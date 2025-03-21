import { create } from "zustand";
import { User, Session, AuthError, AuthResponse } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/ui/use-toast";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;

  // State management
  setUser: (user: User | null, session: Session | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

// Helper to handle auth errors
const handleAuthError = (error: AuthError): string => {
  // Map common Supabase error messages to user-friendly messages
  switch (error.message) {
    case "Invalid login credentials":
      return "Incorrect email or password. Please try again.";
    case "Email not confirmed":
      return "Please check your email to confirm your account before logging in.";
    case "User already registered":
      return "An account with this email already exists. Try logging in instead.";
    default:
      return (
        error.message || "An authentication error occurred. Please try again."
      );
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  error: null,

  // Auth actions
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error }: AuthResponse =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) throw error;

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      toast({
        title: "Success",
        description: "Logged in successfully!",
        variant: "default",
      });
    } catch (error) {
      const errorMessage = handleAuthError(error as AuthError);
      set({ error: errorMessage, isLoading: false });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  register: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      set({
        user: data.user,
        session: data.session,
        isLoading: false,
      });

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        toast({
          title: "Success",
          description:
            "Registration successful! Please check your email to confirm your account.",
          variant: "default",
        });
      } else {
        toast({
          title: "Success",
          description: "Registration successful!",
          variant: "default",
        });
      }
    } catch (error) {
      const errorMessage = handleAuthError(error as AuthError);
      set({ error: errorMessage, isLoading: false });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        user: null,
        session: null,
        isLoading: false,
      });

      toast({
        title: "Success",
        description: "Logged out successfully!",
        variant: "default",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during logout";
      set({ error: errorMessage, isLoading: false });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      set({ isLoading: false });
      toast({
        title: "Success",
        description: "Password reset link sent to your email!",
        variant: "default",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during password reset";
      set({ error: errorMessage, isLoading: false });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  },

  // State management
  setUser: (user, session) => set({ user, session, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setUser(session?.user ?? null, session);
});

// Listen for auth changes
supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setUser(session?.user ?? null, session);
});
