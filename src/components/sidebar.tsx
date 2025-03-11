"use client"

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  return (
    <ShadcnSidebar>
      <SidebarHeader className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span>EduManage</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/dashboard")} tooltip="Dashboard">
              <Link href="/dashboard">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive("/students")} tooltip="Students">
              <Link href="/students">
                <Users className="h-4 w-4" />
                <span>Students</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarContent>
      <SidebarFooter className="border-t p-4 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">EduManage</p>
            <p>Teacher Portal</p>
          </div>
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
