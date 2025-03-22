import { useProfileStore } from "@/store/profileStore";
import { LanguageCode } from "@/types/profile";
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

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
] as const;

export function LanguageSection() {
  const { getPreferences, updatePreferences } = useProfileStore();
  const preferences = getPreferences();

  const handleLanguageChange = async (languageCode: LanguageCode) => {
    try {
      await updatePreferences({ language: languageCode });

      toast({
        title: "Language updated",
        description: "Your language preference has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update language preference.",
        variant: "destructive",
      });
    }
  };

  return (
    <PreferencesSection
      title="Language"
      description="Choose your preferred language for the application."
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="language">Display Language</Label>
          <Select
            value={preferences?.language ?? "en"}
            onValueChange={handleLanguageChange}
          >
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map(({ code, name }) => (
                <SelectItem key={code} value={code}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </PreferencesSection>
  );
}
