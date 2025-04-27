"use client"

import { useState, useEffect, useCallback } from "react"
import { AppLayout } from "@/components/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { BlockedFriendsSelect } from "@/components/blocked-friends-select"
import { TimePicker } from "@/components/time-picker"
import { PlanPreviewModal } from "@/components/plan-preview-modal"
import { CalendarIcon, Clock, Eye, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function CreatePlanPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [useDefaultExpiry, setUseDefaultExpiry] = useState(true)
  const [customExpiryTime, setCustomExpiryTime] = useState<string>("11:30 PM")

  const [selectedMood, setSelectedMood] = useState<string>("chill")
  const [customMood, setCustomMood] = useState<string>("")
  const [savedCustomMoods, setSavedCustomMoods] = useState<string[]>([])

  const [timeOption, setTimeOption] = useState<string>("afternoon")
  const [customTime, setCustomTime] = useState<string>("03:00 PM")
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showExpiryTimePicker, setShowExpiryTimePicker] = useState(false)

  const [activity, setActivity] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [audience, setAudience] = useState<string>("friends")
  const [genderVisibility, setGenderVisibility] = useState<string>("all")

  const [previewOpen, setPreviewOpen] = useState(false)

  // Add form validation state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const router = useRouter()

  // Load saved custom moods only once on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedMoods = localStorage.getItem("customMoods")
      if (savedMoods) {
        setSavedCustomMoods(JSON.parse(savedMoods))
      }
    }
  }, [])

  // Update time picker visibility when time option changes
  useEffect(() => {
    setShowTimePicker(timeOption === "custom")
  }, [timeOption])

  // Update expiry time picker visibility
  useEffect(() => {
    setShowExpiryTimePicker(!useDefaultExpiry)
  }, [useDefaultExpiry])

  // Handle custom mood addition
  const addCustomMood = useCallback(() => {
    if (customMood.trim() && !savedCustomMoods.includes(customMood.trim())) {
      const newCustomMoods = [...savedCustomMoods, customMood.trim()]
      setSavedCustomMoods(newCustomMoods)

      // Save to localStorage for persistence
      if (typeof window !== "undefined") {
        localStorage.setItem("customMoods", JSON.stringify(newCustomMoods))
      }

      // Set as selected mood
      setSelectedMood(customMood.trim())
    }
    setCustomMood("")
  }, [customMood, savedCustomMoods])

  // Handle custom mood deletion
  const deleteCustomMood = useCallback(
    (mood: string) => {
      const newCustomMoods = savedCustomMoods.filter((m) => m !== mood)
      setSavedCustomMoods(newCustomMoods)

      // If the deleted mood was selected, reset to default
      if (selectedMood === mood) {
        setSelectedMood("chill")
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("customMoods", JSON.stringify(newCustomMoods))
      }

      // Show toast notification
      toast({
        description: "Tag removed.",
        duration: 2000,
      })
    },
    [savedCustomMoods, selectedMood],
  )

  // Get display time based on selected option
  const getDisplayTime = useCallback(() => {
    if (timeOption === "custom") {
      return customTime
    }

    switch (timeOption) {
      case "morning":
        return "9:00 AM"
      case "afternoon":
        return "3:00 PM"
      case "evening":
        return "6:30 PM"
      case "night":
        return "9:00 PM"
      default:
        return ""
    }
  }, [timeOption, customTime])

  // Handle custom time change
  const handleCustomTimeChange = useCallback((newTime: string) => {
    setCustomTime(newTime)
  }, [])

  // Handle custom expiry time change
  const handleExpiryTimeChange = useCallback((newTime: string) => {
    setCustomExpiryTime(newTime)
  }, [])

  // Add validateForm function after the handleExpiryTimeChange function
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validate activity
    if (!activity.trim()) {
      newErrors.activity = "Please enter an activity"
    }

    // Validate date
    if (!date) {
      newErrors.date = "Please select a date"
    }

    // Validate time
    if (!timeOption) {
      newErrors.time = "Please select a time"
    }

    // Validate mood
    if (!selectedMood) {
      newErrors.mood = "Please select a mood"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Add handleSubmit function
  const handleSubmit = () => {
    setIsSubmitting(true)

    if (validateForm()) {
      // Simulate API call
      setTimeout(() => {
        setShowSuccessModal(true)
        setIsSubmitting(false)
      }, 800)
    } else {
      setIsSubmitting(false)
    }
  }

  // Add resetForm function
  const resetForm = () => {
    setActivity("")
    setDate(new Date())
    setSelectedMood("chill")
    setCustomMood("")
    setTimeOption("afternoon")
    setCustomTime("03:00 PM")
    setLocation("")
    setAudience("friends")
    setGenderVisibility("all")
    setUseDefaultExpiry(true)
    setCustomExpiryTime("11:30 PM")
    setErrors({})
  }

  // Add handleSuccess function
  const handleSuccess = () => {
    setShowSuccessModal(false)

    // Either reset the form or redirect to home
    if (Math.random() > 0.5) {
      // Reset form
      resetForm()
    } else {
      // Redirect to home
      router.push("/")
    }
  }

  const timeOptions = [
    { value: "morning", label: "Morning (8-11 AM)" },
    { value: "afternoon", label: "Afternoon (2-5 PM)" },
    { value: "evening", label: "Evening (5-8 PM)" },
    { value: "night", label: "Night (8-11 PM)" },
    { value: "custom", label: "Custom time..." },
  ]

  const audienceOptions = [
    { value: "friends", label: "Friends" },
    { value: "friends-of-friends", label: "Friends of Friends" },
    { value: "public", label: "Public" },
  ]

  const genderVisibilityOptions = [
    { value: "all", label: "All" },
    { value: "women-only", label: "Women Only" },
    { value: "men-only", label: "Men Only" },
  ]

  return (
    <AppLayout>
      <div className="container max-w-md mx-auto px-4 py-6 bg-sage-50">
        <h1 className="text-2xl font-semibold text-sage-900 mb-6">Create a Soft Plan</h1>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="space-y-5">
                {/* Activity */}
                <div className="space-y-2">
                  <Label htmlFor="activity" className="text-sage-700">
                    What are you thinking?
                  </Label>
                  <Input
                    id="activity"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    placeholder="Coffee, Walk, Co-work..."
                    className="rounded-lg border-sage-200 focus:border-primary focus:ring-primary"
                  />
                  {errors.activity && (
                    <p className="text-xs text-rose-500 mt-1 ml-1 animate-fadeIn">{errors.activity}</p>
                  )}
                </div>

                {/* Mood Tag */}
                <div className="space-y-2">
                  <Label className="text-sage-700">Mood</Label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {["chill", "social", ...savedCustomMoods].map((mood) => {
                        const isDefault = mood === "chill" || mood === "social"
                        const emoji = mood === "chill" ? "😌" : mood === "social" ? "🎉" : "✨"
                        const label = isDefault ? mood.charAt(0).toUpperCase() + mood.slice(1) : mood

                        return (
                          <div key={mood} className="relative">
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "flex items-center gap-2 rounded-full border-sage-200 transition-all pr-7",
                                selectedMood === mood
                                  ? "bg-primary/10 border-primary text-primary-foreground"
                                  : "hover:bg-primary/5",
                              )}
                              onClick={() => setSelectedMood(mood)}
                            >
                              <span>{emoji}</span>
                              <span>{label}</span>
                            </Button>

                            {!isDefault && (
                              <button
                                type="button"
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 rounded-full p-0.5"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteCustomMood(mood)
                                }}
                                aria-label={`Delete ${mood} mood`}
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex gap-2">
                      <Input
                        value={customMood}
                        onChange={(e) => setCustomMood(e.target.value)}
                        placeholder="Enter a custom mood..."
                        className="rounded-full border-sage-200 focus:border-primary focus:ring-primary placeholder:text-sage-400"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full border-sage-200 hover:bg-primary/5"
                        onClick={addCustomMood}
                        disabled={!customMood.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  {errors.mood && <p className="text-xs text-rose-500 mt-1 ml-1 animate-fadeIn">{errors.mood}</p>}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sage-700">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal rounded-lg border-sage-200",
                            !date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-sage-500" />
                          {date ? format(date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          className="rounded-lg"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && <p className="text-xs text-rose-500 mt-1 ml-1 animate-fadeIn">{errors.date}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Time</Label>
                    <div className="relative">
                      <Select value={timeOption} onValueChange={setTimeOption}>
                        <SelectTrigger className="rounded-lg border-sage-200">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Clock className="absolute right-8 top-2.5 h-4 w-4 text-sage-500" />
                    </div>
                    {errors.time && <p className="text-xs text-rose-500 mt-1 ml-1 animate-fadeIn">{errors.time}</p>}

                    {showTimePicker && (
                      <div className="mt-2">
                        <TimePicker value={customTime} onChange={handleCustomTimeChange} className="mt-2" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sage-700">
                    Location
                  </Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="East Side, Somewhere quiet..."
                    className="rounded-lg border-sage-200 focus:border-primary focus:ring-primary"
                  />
                </div>

                {/* Audience & Gender Visibility */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sage-700">Audience</Label>
                    <Select value={audience} onValueChange={setAudience}>
                      <SelectTrigger className="rounded-lg border-sage-200">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {audienceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sage-700">Gender Visibility</Label>
                    <Select value={genderVisibility} onValueChange={setGenderVisibility}>
                      <SelectTrigger className="rounded-lg border-sage-200">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderVisibilityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Blocked Friends */}
                <div className="space-y-2">
                  <Label className="text-sage-700">Blocked Friends</Label>
                  <BlockedFriendsSelect />
                  <p className="text-xs text-sage-500 mt-1">
                    These friends won't see your plan or receive notifications about it.
                  </p>
                </div>

                {/* Expiry Logic - UPDATED */}
                <div className="space-y-3 pt-2 border-t border-sage-100">
                  <h3 className="text-sm font-medium text-sage-700">Plan Expiry</h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={useDefaultExpiry}
                        onCheckedChange={setUseDefaultExpiry}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Label className="text-sm text-sage-700">Default expiry: 30 mins after event start time</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!useDefaultExpiry}
                        onCheckedChange={(checked) => setUseDefaultExpiry(!checked)}
                        className="data-[state=checked]:bg-primary"
                      />
                      <Label className="text-sm text-sage-700">Custom expiry time</Label>
                    </div>

                    {showExpiryTimePicker && (
                      <div className="mt-2">
                        <TimePicker value={customExpiryTime} onChange={handleExpiryTimeChange} className="mt-2" />
                      </div>
                    )}

                    <div className="flex items-center pt-2 text-xs text-sage-500">
                      <p>You can delete this plan manually at any time if you change your mind.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Send Plan"
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-full border-sage-300 text-sage-700 hover:bg-sage-50 h-12"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md rounded-xl bg-white border-none">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <h3 className="text-xl font-medium text-sage-900 mb-2">Soft plan created successfully!</h3>
            <p className="text-sage-600 mb-6">Your plan has been shared with your selected audience.</p>
            <Button
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8"
              onClick={handleSuccess}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Plan Preview Modal */}
      <PlanPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        planDetails={{
          activity,
          mood: selectedMood,
          date,
          time: getDisplayTime(),
          location,
          audience: audienceOptions.find((o) => o.value === audience)?.label || "",
          genderVisibility,
        }}
      />
    </AppLayout>
  )
}
