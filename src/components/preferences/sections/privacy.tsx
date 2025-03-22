import { useProfileStore } from "@/store/profileStore";
import { PrivacyPreferences } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/ui/use-toast";
import { PreferencesSection } from "@/components/preferences/section";

const VISIBILITY_OPTIONS = [
  {
    value: "public",
    label: "Public",
    description: "Your profile is visible to everyone.",
  },
  {
    value: "private",
    label: "Private",
    description: "Your profile is only visible to you.",
  },
  {
    value: "friends",
    label: "Friends Only",
    description: "Your profile is only visible to your friends.",
  },
] as const;

const PRIVACY_TOGGLES = [
  {
    id: "showEmail",
    label: "Show Email",
    description: "Allow others to see your email address.",
  },
  {
    id: "showLocation",
    label: "Show Location",
    description: "Display your location on your profile.",
  },
] as const;

export function PrivacySection() {
  const { getPreferences, updatePreferences } = useProfileStore();
  const preferences = getPreferences();

  const handleVisibilityChange = async (
    visibility: PrivacyPreferences["profileVisibility"]
  ) => {
    try {
      const currentSettings = preferences?.privacy ?? {
        profileVisibility: "public",
        showEmail: false,
        showLocation: false,
      };

      await updatePreferences({
        privacy: {
          ...currentSettings,
          profileVisibility: visibility,
        },
      });

      toast({
        title: "Privacy updated",
        description: "Your profile visibility has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings.",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (
    setting: keyof Omit<PrivacyPreferences, "profileVisibility">
  ) => {
    try {
      const currentSettings = preferences?.privacy ?? {
        profileVisibility: "public",
        showEmail: false,
        showLocation: false,
      };

      await updatePreferences({
        privacy: {
          ...currentSettings,
          [setting]: !currentSettings[setting],
        },
      });

      toast({
        title: "Privacy updated",
        description: "Your privacy settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <PreferencesSection
      title="Privacy"
      description="Control who can see your profile and what information is visible."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Profile Visibility</Label>
          <RadioGroup
            value={preferences?.privacy?.profileVisibility ?? "public"}
            onValueChange={handleVisibilityChange}
            className="space-y-3"
          >
            {VISIBILITY_OPTIONS.map(({ value, label, description }) => (
              <div key={value} className="flex items-center space-x-3">
                <RadioGroupItem value={value} id={`visibility-${value}`} />
                <div className="space-y-0.5">
                  <Label htmlFor={`visibility-${value}`}>{label}</Label>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label>Privacy Options</Label>
          {PRIVACY_TOGGLES.map(({ id, label, description }) => (
            <div
              key={id}
              className="flex items-center justify-between space-x-2"
            >
              <div className="space-y-0.5">
                <Label htmlFor={id}>{label}</Label>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <Switch
                id={id}
                checked={
                  preferences?.privacy?.[
                    id as keyof Omit<PrivacyPreferences, "profileVisibility">
                  ] ?? false
                }
                onCheckedChange={() =>
                  handleToggle(
                    id as keyof Omit<PrivacyPreferences, "profileVisibility">
                  )
                }
              />
            </div>
          ))}
        </div>
      </div>
    </PreferencesSection>
  );
}
