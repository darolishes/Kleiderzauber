import { useProfileStore } from "@/store/profileStore";
import { DisplayPreferences } from "@/types/profile";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/ui/use-toast";
import { PreferencesSection } from "@/components/preferences/section";

const VIEW_OPTIONS = [
  {
    id: "compactView",
    label: "Compact View",
    description: "Display items in a more compact layout.",
  },
  {
    id: "showAvatars",
    label: "Show Avatars",
    description: "Display user avatars in lists and comments.",
  },
] as const;

export function DisplaySection() {
  const { getPreferences, updatePreferences } = useProfileStore();
  const preferences = getPreferences();

  const handleItemsPerPageChange = async (value: number[]) => {
    try {
      const currentSettings = preferences?.display ?? {
        itemsPerPage: 10,
        compactView: false,
        showAvatars: true,
      };

      await updatePreferences({
        display: {
          ...currentSettings,
          itemsPerPage: value[0],
        },
      });

      toast({
        title: "Display updated",
        description: "Items per page setting has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update display settings.",
        variant: "destructive",
      });
    }
  };

  const handleToggle = async (
    setting: keyof Omit<DisplayPreferences, "itemsPerPage">
  ) => {
    try {
      const currentSettings = preferences?.display ?? {
        itemsPerPage: 10,
        compactView: false,
        showAvatars: true,
      };

      await updatePreferences({
        display: {
          ...currentSettings,
          [setting]: !currentSettings[setting],
        },
      });

      toast({
        title: "Display updated",
        description: "Your display settings have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update display settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <PreferencesSection
      title="Display"
      description="Customize how content is displayed."
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Items per Page</Label>
            <p className="text-sm text-muted-foreground">
              Choose how many items to display per page.
            </p>
            <div className="pt-2">
              <Slider
                defaultValue={[preferences?.display?.itemsPerPage ?? 10]}
                min={5}
                max={50}
                step={5}
                onValueCommit={handleItemsPerPageChange}
                className="w-full"
              />
              <div className="flex justify-between mt-2">
                <span className="text-sm text-muted-foreground">5</span>
                <span className="text-sm font-medium">
                  {preferences?.display?.itemsPerPage ?? 10} items
                </span>
                <span className="text-sm text-muted-foreground">50</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>View Options</Label>
          {VIEW_OPTIONS.map(({ id, label, description }) => (
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
                  preferences?.display?.[
                    id as keyof Omit<DisplayPreferences, "itemsPerPage">
                  ] ?? id === "showAvatars"
                }
                onCheckedChange={() =>
                  handleToggle(
                    id as keyof Omit<DisplayPreferences, "itemsPerPage">
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
