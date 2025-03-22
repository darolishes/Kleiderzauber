export type Theme = "light" | "dark" | "system";
export type LanguageCode = string; // ISO 639-1 two-letter language code

export interface EmailNotificationPreferences {
  marketing: boolean;
  updates: boolean;
  security: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: "public" | "private" | "friends";
  showEmail: boolean;
  showLocation: boolean;
}

export interface DisplayPreferences {
  itemsPerPage: number;
  compactView: boolean;
  showAvatars: boolean;
}

export interface UserPreferences {
  theme: Theme;
  language: LanguageCode;
  emailNotifications: EmailNotificationPreferences;
  privacy: PrivacyPreferences;
  display: DisplayPreferences;
}

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  bio: string | null;
  updated_at: string | null;
  preferences: UserPreferences;
}

export type ProfileUpdate = Partial<Omit<Profile, "id" | "updated_at">>;
export type PreferencesUpdate = Partial<UserPreferences>;
