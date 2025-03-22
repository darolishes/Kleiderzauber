import { PreferencesContainer } from "@/components/preferences";
import { useAuthStore } from "@/store/authStore";
import { Navigate } from "react-router-dom";

export function PreferencesPage() {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container py-8">
      <PreferencesContainer />
    </div>
  );
}
