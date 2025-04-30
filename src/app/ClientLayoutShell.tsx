// components/ClientLayoutShell.jsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AppSidebar } from "@/components/AdminScreen/Sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function ClientLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  const isPreviewRoute = pathname === "/apply/preview";

  const showNavbarFooter = !isAdminRoute && !isPreviewRoute;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {isAdminRoute ? (
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col w-full">
              <header className="flex items-center p-4 bg-white border-b border-gray-200">
                <SidebarTrigger>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu size={24} />
                  </Button>
                </SidebarTrigger>
                <h1 className="text-lg font-semibold">Admin Dashboard</h1>
              </header>
              <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      ) : (
        <div className="flex-1 flex flex-col">
          {(pathname === "/" || pathname === "/apply" || showNavbarFooter) && (
            <Navbar />
          )}
          <main className="flex-1">{children}</main>
          {(pathname === "/" || pathname === "/apply" || showNavbarFooter) && (
            <Footer />
          )}
        </div>
      )}
    </div>
  );
}
