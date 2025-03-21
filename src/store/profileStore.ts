import { create } from "zustand";
import { toast } from "@/hooks/ui/use-toast";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  updated_at?: string;
}

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;

  // Data operations
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
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
    set({ isLoading: true, error: null });
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .single();

      if (error) throw error;

      set({ profile, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch profile";
      set({ error: message, isLoading: false });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", data.id);

      if (error) throw error;

      set((state) => ({
        profile: state.profile ? { ...state.profile, ...data } : null,
        isLoading: false,
      }));

      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      set({ error: message, isLoading: false });
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
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
      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
        variant: "default",
      });
      return avatarUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      set({
        error:
          error instanceof Error ? error.message : "Failed to upload avatar",
        isLoading: false,
      });
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload avatar",
        variant: "destructive",
      });
      return null;
    }
  },

  // State management
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
