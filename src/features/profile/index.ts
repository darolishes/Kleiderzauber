import type { FeatureModule } from "..";
import { Avatar, ProfileForm } from "./components";

// Export components for external use
export { Avatar, ProfileForm };

// Export types
export * from "./types";

// Feature module definition
export const ProfileFeature: FeatureModule = {
  name: "profile",
  components: {
    Avatar,
    ProfileForm,
  },
};
