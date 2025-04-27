"use client"

import { useEffect } from "react"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Home, Calendar, MessageCircle, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavigationDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NavigationDrawer({ open, onOpenChange }: NavigationDrawerProps) {
  const pathname = usePathname()

  // Close the drawer when navigating to a new page
  useEffect(() => {
    if (open) {
      onOpenChange(false)
    }
  }, [pathname, open, onOpenChange])

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "Inbox", href: "/inbox", icon: MessageCircle },
    { name: "People", href: "/people", icon: Users },
  ]

  return (
    <>
      {/* Backdrop overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={() => onOpenChange(false)}
          aria-hidden="true"
        />
      )}

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-[250px] p-0 border-r border-sage-200 rounded-r-xl z-50"
          hideCloseButton={true}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-sage-100">
              <h2 className="text-xl font-medium text-sage-800">99</h2>
              <p className="text-sm text-sage-500">Soft Social Planning</p>
            </div>

            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary-foreground font-medium"
                            : "text-sage-700 hover:bg-sage-50",
                        )}
                        onClick={() => onOpenChange(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="p-4 border-t border-sage-100">
              <p className="text-xs text-sage-500 text-center">Version 1.0.0</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
