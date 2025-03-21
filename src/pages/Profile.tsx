import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useProfileStore } from "../store/profileStore";
import { ProfileForm } from "../components/profile";

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchProfile, profile, isLoading } = useProfileStore();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="space-y-6">
        <ProfileForm />

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">User ID</p>
              <p className="mt-1 text-sm font-mono bg-gray-100 p-2 rounded">
                {user?.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
