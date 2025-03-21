import { Database } from "@/lib/database.types";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Partial<Pick<Profile, "full_name" | "avatar_url">>;

export interface ProfilePreferences {
  theme?: "light" | "dark" | "system";
  language?: string;
}

export interface ProfileSettings {
  privacyLevel?: "public" | "private" | "friends";
  emailNotifications?: boolean;
}

export interface ProfileWithEmail extends Profile {
  email: string;
  preferences?: ProfilePreferences;
  settings?: ProfileSettings;
}

export interface ProfileFormData {
  username: string;
  full_name: string;
  website?: string;
  bio?: string;
}

export interface AvatarUploadResponse {
  path: string;
  publicUrl: string;
}

export interface AvatarUploadProgress {
  progress: number;
  phase: "compressing" | "uploading" | "idle" | "deleting";
}

export interface AvatarDeleteResponse {
  path: string;
}

export type ProfileValidationError = {
  username?: string[];
  full_name?: string[];
  website?: string[];
  bio?: string[];
};
