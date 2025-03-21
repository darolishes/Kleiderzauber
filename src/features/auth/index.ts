import type { FeatureModule } from "..";

// Import components
import { LoginForm } from "./components/login-form/login-form";
import { RegisterForm } from "./components/register-form/register-form";
import { ResetPasswordForm } from "./components/reset-password-form/reset-password-form";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Export components for external use
export { LoginForm, RegisterForm, ResetPasswordForm, ProtectedRoute };

// Export types
export * from "./types";

// Feature module definition
export const AuthFeature: FeatureModule = {
  name: "auth",
  components: {
    LoginForm,
    RegisterForm,
    ResetPasswordForm,
    ProtectedRoute,
  },
};
