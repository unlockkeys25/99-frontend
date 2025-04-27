"use client"

import type React from "react"
import { StatusBar } from "@/components/status-bar"
import { BottomNavigation } from "@/components/bottom-navigation"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <StatusBar />
      <main className="flex-1 pb-20 pt-14">{children}</main>
      <BottomNavigation />
    </div>
  )
}
