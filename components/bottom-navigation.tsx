"use client"

import { usePathname, useRouter } from "next/navigation"
import { Home, Clock, Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Upcoming", href: "/upcoming", icon: Clock },
    { name: "Floated", href: "/floated", icon: Leaf },
  ]

  const handleNavigation = (href: string) => {
    router.push(href)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname === item.href
          const Icon = item.icon

          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
