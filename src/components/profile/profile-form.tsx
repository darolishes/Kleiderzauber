import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useProfileStore } from "@/store/profileStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarUpload } from "./avatar-upload";
import { toast } from "@/hooks/ui/use-toast";

const formSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").nullish(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileForm() {
  const { profile, getProfile, updateProfile } = useProfileStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile?.full_name ?? null,
    },
  });

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name ?? null,
      });
    }
  }, [form, profile]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateProfile(data);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
          </Avatar>
          <AvatarUpload
            onUploadSuccess={() => {
              getProfile();
              toast({
                title: "Success",
                description: "Avatar updated successfully",
              });
            }}
            onUploadError={(error) => {
              toast({
                title: "Error",
                description: "Failed to update avatar",
                variant: "destructive",
              });
            }}
            onDeleteSuccess={() => {
              getProfile();
              toast({
                title: "Success",
                description: "Avatar deleted successfully",
              });
            }}
            onDeleteError={(error) => {
              toast({
                title: "Error",
                description: "Failed to delete avatar",
                variant: "destructive",
              });
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your name"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  );
}
