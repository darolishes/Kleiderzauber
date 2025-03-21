import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfileStore } from "../../store/profileStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Avatar from "./avatar";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfileForm: React.FC = () => {
  const { profile, isLoading, fetchProfile, updateProfile } = useProfileStore();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    await updateProfile(data);
    setIsSaving(false);
  };

  if (isLoading && !profile) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center mb-6">
        <Avatar url={profile?.avatar_url || null} size="lg" editable />
        <div className="ml-6">
          <h2 className="text-xl font-semibold">Your Profile</h2>
          <p className="text-gray-600">{profile?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            type="text"
            {...register("full_name")}
            placeholder="Enter your full name"
          />
          {errors.full_name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.full_name.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            disabled={!isDirty || isSaving || isLoading}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
