import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ThemeSection,
  LanguageSection,
  EmailSection,
  PrivacySection,
  DisplaySection,
} from "@/components/preferences";

const PREFERENCE_SECTIONS = [
  {
    id: "theme",
    label: "Theme",
    component: ThemeSection,
  },
  {
    id: "language",
    label: "Language",
    component: LanguageSection,
  },
  {
    id: "email",
    label: "Email",
    component: EmailSection,
  },
  {
    id: "privacy",
    label: "Privacy",
    component: PrivacySection,
  },
  {
    id: "display",
    label: "Display",
    component: DisplaySection,
  },
] as const;

export function PreferencesContainer() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Preferences</h2>
        <p className="text-muted-foreground">
          Manage your application preferences and settings.
        </p>
      </div>

      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList className="bg-background h-auto p-1 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {PREFERENCE_SECTIONS.map(({ id, label }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PREFERENCE_SECTIONS.map(({ id, component: Component }) => (
          <TabsContent key={id} value={id} className="space-y-4">
            <Component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
