export type Theme = "light" | "dark" | "system";

export interface ThemeState {
  current: Theme;
  systemPreference: "light" | "dark";
  loading: boolean;
  error: string | null;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export interface ThemeToggleProps {
  className?: string;
}

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: "light" | "dark";
}
