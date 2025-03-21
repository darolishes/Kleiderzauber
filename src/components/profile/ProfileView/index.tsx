import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useProfileStore } from "@/store/profileStore";

export const ProfileView = () => {
  const { profile, isLoading, error, getProfile } = useProfileStore();

  useEffect(() => {
    getProfile().catch(console.error);
  }, [getProfile]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-32" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!profile) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Profile Found</AlertTitle>
        <AlertDescription>
          We couldn't find your profile information. Please try refreshing the
          page.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{profile.full_name || "Your Profile"}</CardTitle>
        <CardDescription>
          View and manage your profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={profile.avatar_url || undefined}
              alt={profile.full_name || "Profile"}
            />
            <AvatarFallback>
              {profile.full_name
                ? profile.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">
              {profile.username || profile.full_name || "Anonymous"}
            </h3>
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:underline"
              >
                {profile.website}
              </a>
            )}
          </div>
        </div>

        {profile.bio && (
          <div className="text-sm text-muted-foreground">
            <p>{profile.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-muted-foreground capitalize">
              {profile.preferences?.theme || "system"}
            </p>
          </div>
          <div>
            <p className="font-medium">Language</p>
            <p className="text-muted-foreground capitalize">
              {profile.preferences?.language || "english"}
            </p>
          </div>
          <div>
            <p className="font-medium">Privacy</p>
            <p className="text-muted-foreground capitalize">
              {profile.settings?.privacyLevel || "public"}
            </p>
          </div>
          <div>
            <p className="font-medium">Notifications</p>
            <p className="text-muted-foreground">
              {profile.settings?.emailNotifications ? "Enabled" : "Disabled"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
