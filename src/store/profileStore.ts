import { create } from "zustand";
import { supabase } from "../lib/supabase";
import { toast } from "react-hot-toast";

interface Profile {
  id: string;
  email: string | undefined;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;

  // Data operations
  fetchProfile: () => Promise<void>;
  updateProfile: (
    updates: Partial<Omit<Profile, "id" | "email">>
  ) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;

  // State management
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      set({
        profile: {
          id: user.id,
          email: user.email,
          full_name: data?.full_name || null,
          avatar_url: data?.avatar_url || null,
          updated_at: data?.updated_at || null,
        },
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch profile",
        isLoading: false,
      });
    }
  },

  updateProfile: async (updates) => {
    try {
      set({ isLoading: true, error: null });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Update local state
      const profile = get().profile;
      set({
        profile: profile
          ? { ...profile, ...updates, updated_at: new Date().toISOString() }
          : null,
        isLoading: false,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to update profile",
        isLoading: false,
      });
      toast.error("Failed to update profile");
    }
  },

  uploadAvatar: async (file) => {
    try {
      set({ isLoading: true, error: null });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      if (!file) {
        throw new Error("No file selected");
      }

      // Check file size and type
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        throw new Error("File size must be less than 5MB");
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      // Update the user profile with the new avatar URL
      await get().updateProfile({ avatar_url: avatarUrl });

      set({ isLoading: false });
      toast.success("Avatar uploaded successfully");
      return avatarUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to upload avatar",
        isLoading: false,
      });
      toast.error(
        error instanceof Error ? error.message : "Failed to upload avatar"
      );
      return null;
    }
  },

  // State management
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
