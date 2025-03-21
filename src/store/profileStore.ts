import { create } from "zustand";
import { toast } from "@/hooks/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Profile,
  ProfileState,
  ProfileUpdateData,
} from "@/components/profile/types";
import { FileOptions } from "@supabase/storage-js";

interface UploadProgressEvent {
  loaded: number;
  total: number;
}

interface ExtendedFileOptions extends FileOptions {
  onUploadProgress?: (progress: UploadProgressEvent) => void;
}

export const useProfileStore = create<
  ProfileState & {
    getProfile: () => Promise<Profile>;
    updateProfile: (data: ProfileUpdateData) => Promise<void>;
    uploadAvatar: (file: File) => Promise<string>;
    deleteAvatar: () => Promise<void>;
    resetError: () => void;
  }
>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,
  avatarUploadProgress: 0,

  getProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      set({ profile, isLoading: false });
      return profile;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch profile";
      set({ error: new Error(message), isLoading: false });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  },

  updateProfile: async (data: ProfileUpdateData) => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;

      set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : null,
        isLoading: false,
      }));

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      set({ error: new Error(message), isLoading: false });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  },

  uploadAvatar: async (file: File) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const options: ExtendedFileOptions = {
        upsert: true,
        onUploadProgress: (progress: UploadProgressEvent) => {
          const percentage = (progress.loaded / progress.total) * 100;
          set({ avatarUploadProgress: percentage });
        },
      };

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, options);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const avatarUrl = data.publicUrl;

      await get().updateProfile({ avatar_url: avatarUrl });

      set({ avatarUploadProgress: 0 });
      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });

      return avatarUrl;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to upload avatar";
      set({
        error: new Error(message),
        isLoading: false,
        avatarUploadProgress: 0,
      });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  },

  deleteAvatar: async () => {
    set({ isLoading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { profile } = get();
      if (!profile?.avatar_url) return;

      // Extract filename from URL
      const fileName = profile.avatar_url.split("/").pop();
      if (!fileName) throw new Error("Invalid avatar URL");

      const { error: deleteError } = await supabase.storage
        .from("avatars")
        .remove([fileName]);

      if (deleteError) throw deleteError;

      await get().updateProfile({ avatar_url: null });

      toast({
        title: "Success",
        description: "Avatar deleted successfully",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete avatar";
      set({ error: new Error(message), isLoading: false });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  },

  resetError: () => set({ error: null }),
}));
