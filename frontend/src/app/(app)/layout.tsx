// src/app/(app)/layout.tsx
"use client";

import * as React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import type { Train } from "@/lib/types";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [extraTrains, setExtraTrains] = useState<Train[]>([]);

  const handleAddTrain = (train: Train) => {
    setExtraTrains(prevTrains => [...prevTrains, train]);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center p-4 border-b">
            <SidebarTrigger />
        </header>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            // @ts-ignore
            return React.cloneElement(child, { extraTrains, onAddTrain: handleAddTrain });
          }
          return child;
        })}
      </SidebarInset>
    </SidebarProvider>
  );
}
