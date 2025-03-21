import { useEffect } from "react";
import { useProfileStore } from "../store/profileStore";
import { useAuthStore } from "../store/authStore";

export const useProfile = () => {
  const {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
  } = useProfileStore();

  const { user } = useAuthStore();

  useEffect(() => {
    if (user && !profile) {
      fetchProfile();
    }
  }, [user, profile, fetchProfile]);

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadAvatar,
  };
};
