import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { Home } from "@/pages/Home";
import { Auth } from "@/pages/Auth";
import { Wardrobe } from "@/pages/Wardrobe";
import { Outfits } from "@/pages/Outfits";
import { TryOn } from "@/pages/TryOn";
import { Profile } from "@/pages/Profile";
import { NotFound } from "@/pages/NotFound";
import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/layout/error-boundary";
import { useAuthStore } from "@/store/authStore";
import { Spinner } from "@/components/ui/spinner";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    // Preserve the attempted URL for redirecting back after login
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

// Prevent authenticated users from accessing auth pages
function RequireUnauth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (user) {
    // Redirect to the page they came from or default to wardrobe
    const from = location.state?.from || "/wardrobe";
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}

export function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="kleiderzauber-ui-theme">
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route
              path="/auth"
              element={
                <RequireUnauth>
                  <Auth />
                </RequireUnauth>
              }
            />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="wardrobe"
                element={
                  <RequireAuth>
                    <Wardrobe />
                  </RequireAuth>
                }
              />
              <Route
                path="outfits"
                element={
                  <RequireAuth>
                    <Outfits />
                  </RequireAuth>
                }
              />
              <Route
                path="try-on"
                element={
                  <RequireAuth>
                    <TryOn />
                  </RequireAuth>
                }
              />
              <Route
                path="profile"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
