import { Database } from "@/lib/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export interface ProfileWithEmail extends Profile {
  email?: string | null;
}

export interface ProfileFormData {
  username: string;
  full_name: string;
  website?: string;
  bio?: string;
}

export interface AvatarUploadResponse {
  path: string;
  url: string;
}

export type ProfileValidationError = {
  username?: string[];
  full_name?: string[];
  website?: string[];
  bio?: string[];
};
