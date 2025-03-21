import type { FeatureModule } from "..";
import { ThemeProvider, ThemeToggle } from "./components";

// Export components for external use
export { ThemeProvider, ThemeToggle };

// Export types
export * from "./types";

// Feature module definition
export const ThemeFeature: FeatureModule = {
  name: "theme",
  components: {
    ThemeProvider,
    ThemeToggle,
  },
};
