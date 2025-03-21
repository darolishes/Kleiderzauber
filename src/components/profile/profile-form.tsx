import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProfileStore } from "@/store/profileStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar } from "./avatar";
import { ProfileUpdate } from "@/types/models/profile";

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { profile, isLoading, getProfile, updateProfile } = useProfileStore();
  const [isSaving, setIsSaving] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name ?? null,
    },
  });

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name ?? null,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSaving(true);
    const update: ProfileUpdate = {
      full_name: data.full_name ?? undefined,
    };
    await updateProfile(update);
    setIsSaving(false);
  };

  if (isLoading && !profile) return <span className="loading" />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card">
      <header className="flex gap-4 items-center">
        <Avatar url={profile?.avatar_url ?? undefined} size="lg" editable />
        <div>
          <h2 className="text-xl font-semibold">Your Profile</h2>
          <p className="text-muted">{profile?.email}</p>
        </div>
      </header>

      <Label htmlFor="full_name">Full Name</Label>
      <Input
        id="full_name"
        {...register("full_name")}
        placeholder="Enter your full name"
      />
      {errors.full_name && (
        <p className="text-error text-sm">{errors.full_name.message}</p>
      )}

      <Button
        type="submit"
        disabled={!isDirty || isSaving || isLoading}
        className="w-full mt-4"
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
