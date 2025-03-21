import React from "react";
import { Avatar, ProfileForm } from "@/features/profile";

export const Profile: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <Avatar size="lg" editable />
        </div>
        <ProfileForm />
      </div>
    </div>
  );
};
