import { useProfileStore } from "@/store/profileStore";
import { EmailNotificationPreferences } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/ui/use-toast";
import { PreferencesSection } from "@/components/preferences/section";

const NOTIFICATION_TYPES = [
  {
    id: "marketing",
    label: "Marketing",
    description: "Receive emails about new features and special offers.",
  },
  {
    id: "updates",
    label: "Updates",
    description: "Get notified about important updates and changes.",
  },
  {
    id: "security",
    label: "Security",
    description: "Receive security alerts and account notifications.",
  },
] as const;

export function EmailSection() {
  const { getPreferences, updatePreferences } = useProfileStore();
  const preferences = getPreferences();

  const handleToggle = async (type: keyof EmailNotificationPreferences) => {
    try {
      const currentSettings = preferences?.emailNotifications ?? {
        marketing: true,
        updates: true,
        security: true,
      };

      await updatePreferences({
        emailNotifications: {
          ...currentSettings,
          [type]: !currentSettings[type],
        },
      });

      toast({
        title: "Email preferences updated",
        description: "Your notification settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update email preferences.",
        variant: "destructive",
      });
    }
  };

  return (
    <PreferencesSection
      title="Email Notifications"
      description="Manage your email notification preferences."
    >
      <div className="space-y-6">
        {NOTIFICATION_TYPES.map(({ id, label, description }) => (
          <div key={id} className="flex items-center justify-between space-x-2">
            <div className="space-y-0.5">
              <Label htmlFor={id}>{label}</Label>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Switch
              id={id}
              checked={
                preferences?.emailNotifications?.[
                  id as keyof EmailNotificationPreferences
                ] ?? true
              }
              onCheckedChange={() =>
                handleToggle(id as keyof EmailNotificationPreferences)
              }
            />
          </div>
        ))}
      </div>
    </PreferencesSection>
  );
}
