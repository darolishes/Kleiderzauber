import { useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  LoginForm,
  RegisterForm,
  ResetPasswordForm,
  AuthLayout,
} from "@/components/auth";
import { Spinner } from "@/components/ui/spinner";

export function Auth() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (user) {
      // Redirect to the page they came from or default to wardrobe
      const from = location.state?.from || "/wardrobe";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location.state]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  const tab = searchParams.get("tab");

  return (
    <AuthLayout>
      {tab === "reset" ? (
        <ResetPasswordForm />
      ) : tab === "register" ? (
        <RegisterForm />
      ) : (
        <LoginForm />
      )}
    </AuthLayout>
  );
}
