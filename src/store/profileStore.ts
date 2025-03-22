import { create } from "zustand";
import { toast } from "@/hooks/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Profile,
  ProfileUpdate,
  PreferencesUpdate,
  UserPreferences,
} from "@/types/profile";
import { FileOptions } from "@supabase/storage-js";

interface ExtendedFileOptions extends FileOptions {
  onUploadProgress?: (progress: { loaded: number; total: number }) => void;
}

interface UploadProgress {
  phase: "idle" | "compressing" | "uploading" | "deleting";
  progress: number;
}

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  uploadProgress: UploadProgress;
  getProfile: () => Promise<void>;
  updateProfile: (updates: ProfileUpdate) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
  deleteAvatar: () => Promise<void>;
  getPreferences: () => UserPreferences | null;
  updatePreferences: (updates: PreferencesUpdate) => Promise<void>;
  resetPreferences: () => Promise<void>;
  resetError: () => void;
  setUploadProgress: (progress: UploadProgress) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  language: "en",
  emailNotifications: {
    marketing: true,
    updates: true,
    security: true,
  },
  privacy: {
    profileVisibility: "public",
    showEmail: false,
    showLocation: false,
  },
  display: {
    itemsPerPage: 10,
    compactView: false,
    showAvatars: true,
  },
};

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,
  uploadProgress: {
    phase: "idle",
    progress: 0,
  },

  getProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", user.id)
        .single();

      if (error) throw error;

      // Ensure preferences exist with defaults
      const profile = {
        ...data,
        preferences: {
          ...DEFAULT_PREFERENCES,
          ...data.preferences,
        },
      };

      set({ profile, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  updateProfile: async (updates: ProfileUpdate) => {
    try {
      set({ isLoading: true, error: null });
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      // Refresh profile
      await get().getProfile();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  uploadAvatar: async (file: File) => {
    try {
      set({ uploadProgress: { phase: "uploading", progress: 0 }, error: null });
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      // Delete existing avatar if it exists
      const { data: existingFiles } = await supabase.storage
        .from("avatars")
        .list(user.id);

      if (existingFiles?.length) {
        await supabase.storage
          .from("avatars")
          .remove(existingFiles.map((f) => `${user.id}/${f.name}`));
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          upsert: true,
          onUploadProgress: (progress: { loaded: number; total: number }) => {
            set({
              uploadProgress: {
                phase: "uploading",
                progress: Math.round((progress.loaded / progress.total) * 100),
              },
            });
          },
        } as ExtendedFileOptions);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      await get().updateProfile({ avatar_url: publicUrl });
      set({ uploadProgress: { phase: "idle", progress: 100 } });
      return publicUrl;
    } catch (error) {
      set({
        error: (error as Error).message,
        uploadProgress: { phase: "idle", progress: 0 },
      });
      return null;
    }
  },

  deleteAvatar: async () => {
    try {
      set({ uploadProgress: { phase: "deleting", progress: 0 }, error: null });
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const profile = get().profile;
      if (!profile?.avatar_url) throw new Error("No avatar to delete");

      // Extract file path from URL
      const urlParts = profile.avatar_url.split("/");
      const filePath = urlParts.slice(-2).join("/");

      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([filePath]);

      if (deleteError) throw deleteError;

      await get().updateProfile({ avatar_url: null });
      set({ uploadProgress: { phase: "idle", progress: 0 } });
    } catch (error) {
      set({
        error: (error as Error).message,
        uploadProgress: { phase: "idle", progress: 0 },
      });
    }
  },

  getPreferences: () => {
    const profile = get().profile;
    if (!profile) return null;
    return profile.preferences;
  },

  updatePreferences: async (updates: PreferencesUpdate) => {
    try {
      set({ isLoading: true, error: null });
      const profile = get().profile;

      if (!profile) throw new Error("No profile found");

      const newPreferences = {
        ...profile.preferences,
        ...updates,
      };

      const { error } = await supabase.rpc("update_user_preferences", {
        user_id: profile.id,
        new_preferences: newPreferences,
      });

      if (error) throw error;

      // Refresh profile to get updated preferences
      await get().getProfile();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  resetPreferences: async () => {
    try {
      set({ isLoading: true, error: null });
      const profile = get().profile;

      if (!profile) throw new Error("No profile found");

      await get().updatePreferences(DEFAULT_PREFERENCES);
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  resetError: () => set({ error: null }),

  setUploadProgress: (progress: UploadProgress) =>
    set({ uploadProgress: progress }),
}));
