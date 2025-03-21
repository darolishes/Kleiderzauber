import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { ThemeToggle } from "./theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <header className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary">
                Kleiderzauber
              </Link>
            </div>
            <nav className="ml-6 flex space-x-8">
              <Link
                to="/wardrobe"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border"
              >
                Wardrobe
              </Link>
              <Link
                to="/outfits"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border"
              >
                Outfits
              </Link>
              <Link
                to="/try-on"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border"
              >
                Try On
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth">Log In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
