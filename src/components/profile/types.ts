import { User } from "../auth/types";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  bio: string | null;
  updated_at: string | null;
  preferences: UserPreferences;
  settings: UserSettings;
}

export interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: Error | null;
  avatarUploadProgress: number;
}

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  language: string;
}

export interface UserSettings {
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
  privacyLevel: "public" | "private" | "friends";
}

export interface ProfileFormData {
  username: string;
  full_name: string;
  website?: string;
  bio?: string;
}

export type ProfileUpdateData = Partial<Omit<Profile, "id" | "updated_at">>;
