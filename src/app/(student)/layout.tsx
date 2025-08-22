"use client";

import { useAuth } from "@/hooks/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, LayoutDashboard, Newspaper, Calendar, LogOut, User, Building2 } from "lucide-react";
import Link from "next/link";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { profile, role, loading, logout, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (role !== "student") {
         logout().finally(() => router.replace("/login"));
      }
    }
  }, [user, role, loading, router, logout]);

  if (loading || !profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar side="left" collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground">
            <Building2 />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">CampusConnect</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
            <div className="px-2 py-1">
                <div className="text-xs font-semibold uppercase text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">Student Menu</div>
            </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/dashboard"><LayoutDashboard /><span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="View Notices">
                <Link href="/notices"><Newspaper /><span>Notices</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="View Events">
                <Link href="/events"><Calendar /><span>Events</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logout} tooltip="Logout">
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
         <header className="flex h-16 items-center justify-between border-b bg-card px-6">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-xl font-semibold">Student Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{profile.name || "Student"}</span>
                <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${profile.name || "Student"}`} alt={profile.name || "Student"} />
                    <AvatarFallback>{profile.name?.[0] || 'S'}</AvatarFallback>
                </Avatar>
            </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
