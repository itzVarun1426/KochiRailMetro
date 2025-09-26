// src/components/layout/app-sidebar.tsx
"use client";

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Map,
  ClipboardList,
  Sliders,
  SortAsc,
  User,
  Settings,
  LogOut,
  Radar,
  PlusCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/ranking",
    icon: SortAsc,
    label: "Train Ranking",
  },
  {
    href: "/depot",
    icon: Map,
    label: "Depot Map",
  },
  {
    href: "/job-cards",
    icon: ClipboardList,
    label: "Job Cards",
  },
  {
    href: "/certificates",
    icon: ClipboardList,
    label: "Certificates",
  },
  {
    href: "/simulations",
    icon: Sliders,
    label: "Simulations",
  },
  {
    href: "/branding",
    icon: PlusCircle,
    label: "Branding",
  },
  {
    href: "/all-trains",
    icon: Radar,
    label: "All Trains",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 [&>svg]:text-primary group-data-[collapsible=icon]:-ml-1">
             <Logo className="size-8 text-primary" />
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <h2 className="text-lg font-bold font-headline tracking-tight text-sidebar-foreground">
                Kochi TrainFlow
              </h2>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && item.href !== '/'}
                tooltip={{
                  children: item.label,
                }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
            <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith('/trains/add')}
                  tooltip={{
                    children: "Add New Metro",
                  }}
                >
                  <Link href="/trains/add">
                    <PlusCircle />
                    <span>Add New Metro</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://picsum.photos/seed/1/100/100" alt="@shadcn" data-ai-hint="man avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-sidebar-foreground">John Doe</span>
                <span className="text-xs text-muted-foreground">Fleet Manager</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mb-2 ml-2 border-sidebar-border bg-sidebar text-sidebar-foreground">
             <DropdownMenuLabel>Fleet Management</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-sidebar-border"/>
            <Link href="/profile">
              <DropdownMenuItem className="cursor-pointer hover:!bg-sidebar-accent">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer hover:!bg-sidebar-accent">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-sidebar-border"/>
            <DropdownMenuItem className="cursor-pointer hover:!bg-sidebar-accent">
               <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}
