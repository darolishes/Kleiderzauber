export * from "./auth";
export * from "./profile";
export * from "./wardrobe";
export * from "./theme";

// Feature module configuration and types
export interface FeatureModule {
  name: string;
  routes?: React.ReactNode;
  components: Record<string, React.ComponentType<any>>;
}
