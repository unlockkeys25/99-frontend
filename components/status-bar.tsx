"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, User, Settings, Bell, LogOut, ChevronRight, Calendar, MessageCircle, Users } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { useRouter, usePathname } from "next/navigation"

type StatusType = "available" | "open" | "quiet"

interface StatusOption {
  id: StatusType
  label: string
  emoji: string
  color: string
}

interface StatusBarProps {
  onOpenDrawer: () => void
}

const statusOptions: StatusOption[] = [
  { id: "available", label: "I'm around", emoji: "✅", color: "bg-green-400" },
  { id: "open", label: "Not planning but open", emoji: "🤔", color: "bg-amber-400" },
  { id: "quiet", label: "Quiet mode", emoji: "🚫", color: "bg-accent" },
]

export function StatusBar({ onOpenDrawer }: StatusBarProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [status, setStatus] = useState<StatusOption>(statusOptions[0])
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [statusExpiry, setStatusExpiry] = useState<Date | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [quietMode, setQuietMode] = useState(false)
  const pathname = usePathname()

  // Load saved status on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStatus = localStorage.getItem("userStatus")
      const savedExpiry = localStorage.getItem("statusExpiry")
      const savedQuietMode = localStorage.getItem("quietMode")

      if (savedStatus) {
        const parsedStatus = JSON.parse(savedStatus)
        setStatus(parsedStatus)
      }

      if (savedExpiry) {
        const expiryDate = new Date(savedExpiry)

        // Check if the status has expired
        if (expiryDate > new Date()) {
          setStatusExpiry(expiryDate)
        } else {
          // Clear expired status
          localStorage.removeItem("statusExpiry")
          localStorage.removeItem("userStatus")
          setStatus(statusOptions[0])
        }
      }

      if (savedQuietMode) {
        setQuietMode(JSON.parse(savedQuietMode))
      }
    }
  }, [])

  // Set up auto-clear timer
  useEffect(() => {
    if (statusExpiry) {
      const timeUntilExpiry = statusExpiry.getTime() - new Date().getTime()

      if (timeUntilExpiry > 0) {
        const timer = setTimeout(() => {
          setStatus(statusOptions[0])
          setStatusExpiry(null)
          localStorage.removeItem("statusExpiry")
          localStorage.removeItem("userStatus")

          toast({
            description: "Your status has been automatically reset.",
            duration: 3000,
          })
        }, timeUntilExpiry)

        return () => clearTimeout(timer)
      }
    }
  }, [statusExpiry])

  const updateStatus = (newStatus: StatusOption) => {
    setStatus(newStatus)

    // Set expiry time (8 hours from now)
    const expiryTime = new Date()
    expiryTime.setHours(expiryTime.getHours() + 8)
    setStatusExpiry(expiryTime)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("userStatus", JSON.stringify(newStatus))
      localStorage.setItem("statusExpiry", expiryTime.toISOString())
    }

    setStatusDialogOpen(false)

    toast({
      description: `Status updated to "${newStatus.label}"`,
      duration: 2000,
    })
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")

    toast({
      description: `Theme switched to ${theme === "dark" ? "light" : "dark"} mode`,
      duration: 2000,
    })
  }

  const toggleQuietMode = () => {
    const newQuietMode = !quietMode
    setQuietMode(newQuietMode)

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("quietMode", JSON.stringify(newQuietMode))
    }

    toast({
      description: `Quiet mode ${newQuietMode ? "enabled" : "disabled"}`,
      duration: 2000,
    })
  }

  const navigateToFullSettings = () => {
    // Close the dropdown
    setSettingsOpen(false)

    // Navigate to settings page
    router.push("/settings")

    toast({
      description: "Opening full settings",
      duration: 2000,
    })
  }

  const handleMenuClick = () => {
    // Ensure the drawer opens when the menu button is clicked
    if (onOpenDrawer) {
      onOpenDrawer()
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex justify-between items-center h-14 px-4">
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="mr-3 rounded-lg border-sage-200 hover:bg-sage-100 active:bg-sage-200 font-medium"
              >
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 p-2 rounded-xl shadow-lg bg-background">
              <DropdownMenuGroup>
                {[
                  { name: "Events", href: "/events", icon: Calendar },
                  { name: "Inbox", href: "/inbox", icon: MessageCircle },
                  { name: "People", href: "/people", icon: Users },
                ].map((item) => {
                  const Icon = item.icon
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

                  return (
                    <DropdownMenuItem
                      key={item.name}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer",
                        isActive
                          ? "bg-primary/10 text-primary-foreground font-medium"
                          : "text-sage-700 hover:bg-sage-50",
                      )}
                      onClick={() => {
                        router.push(item.href)
                      }}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <span className="text-lg font-medium text-foreground">99</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full flex items-center gap-1.5 px-3"
            onClick={() => setStatusDialogOpen(true)}
          >
            <div className={cn("w-2.5 h-2.5 rounded-full", status.color)} />
            <span className="text-xs">{status.label}</span>
          </Button>

          {/* Settings Dropdown */}
          <DropdownMenu open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-72 p-2 rounded-xl shadow-lg animate-in fade-in-80 slide-in-from-top-5 duration-200 bg-background"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Your Account</p>
                  <p className="text-xs leading-none text-muted-foreground">Manage your settings and preferences</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="flex justify-between items-center cursor-pointer py-2"
                  onClick={navigateToFullSettings}
                >
                  <div className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Go to Full Settings</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">Quick Settings</DropdownMenuLabel>

                <div className="px-2 py-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      <span className="text-sm">Dark Mode</span>
                    </div>
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={() => toggleTheme()}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>

                <div className="px-2 py-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <span className="text-sm">Quiet Mode</span>
                    </div>
                    <Switch
                      checked={quietMode}
                      onCheckedChange={toggleQuietMode}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>

                <DropdownMenuItem
                  className="flex items-center cursor-pointer py-2"
                  onClick={() => {
                    setSettingsOpen(false)
                    setStatusDialogOpen(true)
                  }}
                >
                  <div className={cn("w-2.5 h-2.5 rounded-full mr-2", status.color)} />
                  <span className="text-sm">Current Status: {status.label}</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center cursor-pointer py-2 text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Status Selection Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center">Set your status</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 py-4">
            {statusOptions.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                className={cn(
                  "w-full justify-start text-left rounded-lg py-3 px-4",
                  status.id === option.id && "ring-2 ring-primary bg-primary/5",
                )}
                onClick={() => updateStatus(option)}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{option.emoji}</span>
                  <div>
                    <p className="font-medium">{option.label}</p>
                    {option.id === "available" && (
                      <p className="text-xs text-muted-foreground">Let friends know you're available to hang</p>
                    )}
                    {option.id === "open" && (
                      <p className="text-xs text-muted-foreground">Open to invites but not actively planning</p>
                    )}
                    {option.id === "quiet" && (
                      <p className="text-xs text-muted-foreground">Taking some time for yourself</p>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Your status will automatically reset after 8 hours
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
