import type { FeatureModule } from "..";
import { ItemCard, UploadZone } from "./components";

// Export components for external use
export { ItemCard, UploadZone };

// Export types
export * from "./types";

// Feature module definition
export const WardrobeFeature: FeatureModule = {
  name: "wardrobe",
  components: {
    ItemCard,
    UploadZone,
  },
};
