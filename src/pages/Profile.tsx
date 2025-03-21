import React from 'react';
import { useAuthStore } from '../store/authStore';

const Profile: React.FC = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <p className="mt-1 text-sm text-gray-900">{user?.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;