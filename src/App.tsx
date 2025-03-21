import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Wardrobe from "./pages/Wardrobe";
import Outfits from "./pages/Outfits";
import TryOn from "./pages/TryOn";
import Profile from "./pages/Profile";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="kleiderzauber-ui-theme">
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/wardrobe" element={<Wardrobe />} />
              <Route path="/outfits" element={<Outfits />} />
              <Route path="/try-on" element={<TryOn />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
