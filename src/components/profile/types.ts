import { User } from "../auth/types";

export interface ProfileState {
  loading: boolean;
  error: string | null;
  data: ProfileData | null;
}

export interface ProfileData extends Pick<User, "name" | "avatar_url"> {
  preferences: UserPreferences;
  settings: UserSettings;
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
