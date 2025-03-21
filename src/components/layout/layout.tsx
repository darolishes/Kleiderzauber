import { type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface LayoutProps {
  children?: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main className="container mx-auto p-8 min-h-screen">
        {children || <Outlet />}
      </main>
      <Footer />
    </>
  );
}
