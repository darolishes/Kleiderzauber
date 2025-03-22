import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useProfileStore } from "@/store/profileStore";
import { Theme } from "@/types/profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/ui/use-toast";
import { PreferencesSection } from "@/components/preferences/section";

export function ThemeSection() {
  const { theme: currentTheme, setTheme } = useTheme();
  const { getPreferences, updatePreferences } = useProfileStore();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleThemeChange = async (theme: Theme) => {
    try {
      // Update theme immediately for better UX
      setTheme(theme);

      // Persist to profile
      await updatePreferences({ theme });

      toast({
        title: "Theme updated",
        description: "Your theme preference has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update theme preference.",
        variant: "destructive",
      });

      // Revert theme on error
      const savedPreferences = getPreferences();
      if (savedPreferences?.theme) {
        setTheme(savedPreferences.theme);
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <PreferencesSection
      title="Theme"
      description="Choose your preferred theme for the application."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme">Theme Mode</Label>
          <Select value={currentTheme} onValueChange={handleThemeChange}>
            <SelectTrigger id="theme" className="w-full">
              <SelectValue placeholder="Select a theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </PreferencesSection>
  );
}
