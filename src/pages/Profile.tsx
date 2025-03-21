import React from "react";
import { ProfileForm } from "@/components/profile";

export const Profile: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="max-w-2xl mx-auto">
        <ProfileForm />
      </div>
    </div>
  );
};
