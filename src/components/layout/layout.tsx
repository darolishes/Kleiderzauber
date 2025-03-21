import { type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};
