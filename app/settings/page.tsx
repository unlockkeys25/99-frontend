"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Bell, Shield, Smartphone, Moon, Sun, Globe, Clock } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [quietMode, setQuietMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quietMode")
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  const [notificationSettings, setNotificationSettings] = useState({
    planInvites: true,
    planUpdates: true,
    friendRequests: true,
    nearbyPlans: false,
    statusUpdates: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    showOnlineStatus: true,
    shareLocation: false,
    allowFriendRequests: true,
    showInNearby: true,
  })

  const toggleQuietMode = () => {
    const newValue = !quietMode
    setQuietMode(newValue)
    if (typeof window !== "undefined") {
      localStorage.setItem("quietMode", JSON.stringify(newValue))
    }

    toast({
      description: `Quiet mode ${newValue ? "enabled" : "disabled"}`,
      duration: 2000,
    })
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)

    toast({
      description: `Theme switched to ${newTheme} mode`,
      duration: 2000,
    })
  }

  const toggleNotification = (key: keyof typeof notificationSettings) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

    toast({
      description: `Notification setting updated`,
      duration: 2000,
    })
  }

  const togglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))

    toast({
      description: `Privacy setting updated`,
      duration: 2000,
    })
  }

  return (
    <AppLayout>
      <div className="container max-w-md mx-auto px-4 py-6 bg-background min-h-screen">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid grid-cols-3 bg-white/50">
            <TabsTrigger value="general" className="data-[state=active]:bg-white">
              General
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-white">
              Privacy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Appearance</CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {theme === "dark" ? (
                      <Moon className="h-4 w-4 text-sage-600" />
                    ) : (
                      <Sun className="h-4 w-4 text-sage-600" />
                    )}
                    <span>Dark Mode</span>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Status</CardTitle>
                <CardDescription>Manage your availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-sage-600" />
                    <span>Quiet Mode</span>
                  </div>
                  <Switch
                    checked={quietMode}
                    onCheckedChange={toggleQuietMode}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
                <p className="text-xs text-sage-500">
                  When quiet mode is enabled, you won't receive notifications and your status will appear as "Quiet
                  mode" to others.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Language & Region</CardTitle>
                <CardDescription>Set your preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-sage-600" />
                    <span>Language</span>
                  </div>
                  <span className="text-sm text-sage-600">English</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-sage-600" />
                    <span>Time Format</span>
                  </div>
                  <span className="text-sm text-sage-600">12-hour</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Notification Preferences</CardTitle>
                <CardDescription>Choose what you want to be notified about</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Plan invites</span>
                  <Switch
                    checked={notificationSettings.planInvites}
                    onCheckedChange={() => toggleNotification("planInvites")}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Plan updates</span>
                  <Switch
                    checked={notificationSettings.planUpdates}
                    onCheckedChange={() => toggleNotification("planUpdates")}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Friend requests</span>
                  <Switch
                    checked={notificationSettings.friendRequests}
                    onCheckedChange={() => toggleNotification("friendRequests")}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Nearby plans</span>
                  <Switch
                    checked={notificationSettings.nearbyPlans}
                    onCheckedChange={() => toggleNotification("nearbyPlans")}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Friend status updates</span>
                  <Switch
                    checked={notificationSettings.statusUpdates}
                    onCheckedChange={() => toggleNotification("statusUpdates")}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Delivery Methods</CardTitle>
                <CardDescription>How you'll receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-sage-600" />
                    <span>Push notifications</span>
                  </div>
                  <Switch checked={true} className="data-[state=checked]:bg-primary" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Privacy Settings</CardTitle>
                <CardDescription>Control your visibility and data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Show online status</span>
                  <Switch
                    checked={privacySettings.showOnlineStatus}
                    onCheckedChange={() => togglePrivacy("showOnlineStatus")}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Share location</span>
                  <Switch
                    checked={privacySettings.shareLocation}
                    onCheckedChange={() => togglePrivacy("shareLocation")}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Allow friend requests</span>
                  <Switch
                    checked={privacySettings.allowFriendRequests}
                    onCheckedChange={() => togglePrivacy("allowFriendRequests")}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span>Show in nearby</span>
                  <Switch
                    checked={privacySettings.showInNearby}
                    onCheckedChange={() => togglePrivacy("showInNearby")}
                    className="data-[state=checked]:bg-primary"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Account Security</CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left rounded-lg"
                  onClick={() => toast({ description: "Change password feature coming soon", duration: 2000 })}
                >
                  <Shield className="h-4 w-4 mr-2 text-sage-600" />
                  Change Password
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-left rounded-lg"
                  onClick={() => toast({ description: "Two-factor authentication coming soon", duration: 2000 })}
                >
                  <Shield className="h-4 w-4 mr-2 text-sage-600" />
                  Two-factor Authentication
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
