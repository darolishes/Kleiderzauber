import { create } from "zustand";
import { toast } from "@/hooks/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Profile,
  ProfileUpdate,
  ProfileValidationError,
  ProfileWithEmail,
  AvatarUploadProgress,
} from "@/types/models/profile";
import { FileOptions } from "@supabase/storage-js";

interface ExtendedFileOptions extends FileOptions {
  onUploadProgress?: (progress: { loaded: number; total: number }) => void;
}

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  uploadProgress: AvatarUploadProgress;
  getProfile: () => Promise<void>;
  updateProfile: (profile: ProfileUpdate) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  deleteAvatar: () => Promise<void>;
  resetError: () => void;
  setUploadProgress: (progress: AvatarUploadProgress) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,
  uploadProgress: { progress: 0, phase: "idle" },

  getProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (profile: ProfileUpdate) => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", user.id);

      if (error) throw error;

      // Update local state
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...profile } : null,
      }));
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  uploadAvatar: async (file: File) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      set({ uploadProgress: { progress: 0, phase: "uploading" } });

      const options: ExtendedFileOptions = {
        cacheControl: "3600",
        upsert: true,
        onUploadProgress: (progress) => {
          const percentage = Math.round(
            (progress.loaded / progress.total) * 100
          );
          set({
            uploadProgress: { progress: percentage, phase: "uploading" },
          });
        },
      };

      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, options);

      if (uploadError) throw uploadError;
      if (!data) throw new Error("Upload failed");

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new avatar URL
      await get().updateProfile({ avatar_url: publicUrl });

      set({ uploadProgress: { progress: 0, phase: "idle" } });
      return publicUrl;
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  deleteAvatar: async () => {
    set({ uploadProgress: { progress: 0, phase: "deleting" } });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const profile = get().profile;
      if (!profile?.avatar_url) return;

      // Extract file path from URL
      const url = new URL(profile.avatar_url);
      const filePath = url.pathname.split("/").slice(-2).join("/");

      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Update profile
      await get().updateProfile({ avatar_url: null });

      set({ uploadProgress: { progress: 0, phase: "idle" } });
    } catch (error) {
      set({ error: error as Error });
      throw error;
    }
  },

  resetError: () => set({ error: null }),

  setUploadProgress: (progress: AvatarUploadProgress) =>
    set({ uploadProgress: progress }),
}));
