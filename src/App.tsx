import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { ProtectedRoute } from "@/features/auth";
import { Home } from "@/pages/Home";
import { Auth } from "@/pages/Auth";
import { Wardrobe } from "@/pages/Wardrobe";
import { Outfits } from "@/pages/Outfits";
import { TryOn } from "@/pages/TryOn";
import { Profile } from "@/pages/Profile";
import { NotFound } from "@/pages/NotFound";
import { ThemeProvider } from "@/features/theme";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/layout/error-boundary";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="kleiderzauber-ui-theme">
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route element={<ProtectedRoute />}>
                <Route path="wardrobe" element={<Wardrobe />} />
                <Route path="outfits" element={<Outfits />} />
                <Route path="try-on" element={<TryOn />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
