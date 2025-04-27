"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"

interface CreatePlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPlan: (plan: {
    id: string
    activity: string
    description: string
    date: Date
    time: string
    location: string
    mood: string
    rsvps: {
      countMeIn: number
      thinkICan: number
      stillThinking: number
    }
  }) => void
}

export function CreatePlanModal({ open, onOpenChange, onAddPlan }: CreatePlanModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [useDefaultExpiry, setUseDefaultExpiry] = useState(true)
  const [customExpiryTime, setCustomExpiryTime] = useState<string>("11:30 PM")

  // Change the selectedMood state from a string to an array of strings
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["chill"])

  const [customMood, setCustomMood] = useState<string>("")
  const [savedCustomMoods, setSavedCustomMoods] = useState<string[]>([])

  const [timeOption, setTimeOption] = useState<string>("afternoon")
  const [customTime, setCustomTime] = useState<string>("03:00 PM")
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [showExpiryTimePicker, setShowExpiryTimePicker] = useState(false)

  const [activity, setActivity] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [location, setLocation] = useState<string>("")
  const [audience, setAudience] = useState<string>("friends")
  const [genderVisibility, setGenderVisibility] = useState<string>("all")

  const [previewOpen, setPreviewOpen] = useState(false)

  // Add form validation state
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      resetForm()
    }
  }, [open])

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
      setSelectedMoods([...selectedMoods, customMood.trim()])
      setCustomMood("")
    }
    setCustomMood("")
  }, [customMood, savedCustomMoods, selectedMoods])

  // Handle custom mood deletion
  const deleteCustomMood = useCallback(
    (mood: string) => {
      const newCustomMoods = savedCustomMoods.filter((m) => m !== mood)
      setSavedCustomMoods(newCustomMoods)

      // If the deleted mood was selected, remove it from selected moods
      if (selectedMoods.includes(mood)) {
        setSelectedMoods(selectedMoods.filter((m) => m !== mood))
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
    [savedCustomMoods, selectedMoods],
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

  // Add validateForm function
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
    if (selectedMoods.length === 0) {
      newErrors.mood = "Please select at least one mood"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Add handleSubmit function
  const handleSubmit = () => {
    setIsSubmitting(true)

    if (validateForm()) {
      // Create new plan object
      const newPlan = {
        id: `new-${Date.now()}`,
        activity,
        description,
        date: date!,
        time: getDisplayTime(),
        location: location || "TBD",
        mood: selectedMoods.join(", "), // Join all selected moods
        rsvps: {
          countMeIn: 0,
          thinkICan: 0,
          stillThinking: 0,
        },
      }

      // Add the plan
      onAddPlan(newPlan)

      // Show success toast with custom styling
      toast({
        description: "✅ Your plan has been created and shared!",
        duration: 7000,
        className: "bg-[#A8C7A1] text-white text-sm rounded px-4 py-2 shadow-md",
        action: (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.dismiss()}
            className="h-auto p-1 text-white hover:bg-[#97b690] hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        ),
      })

      // Close the modal
      onOpenChange(false)
      setIsSubmitting(false)
    } else {
      setIsSubmitting(false)
    }
  }

  // Add resetForm function
  const resetForm = () => {
    setActivity("")
    setDescription("")
    setDate(new Date())
    setSelectedMoods(["chill"]) // Reset to default mood
    setCustomMood("")
    setTimeOption("afternoon")
    setCustomTime("03:00 PM")
    setLocation("")
    setAudience("friends")
    setGenderVisibility("all")
    setUseDefaultExpiry(true)
    setCustomExpiryTime("11:30 PM")
    setErrors({})
    setIsSubmitting(false)
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
    { value: "all", label: "Everyone" },
    { value: "women-only", label: "Women Only" },
    { value: "men-only", label: "Men Only" },
  ]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Create a Soft Plan</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
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
              {errors.activity && <p className="text-xs text-rose-500 mt-1 ml-1 animate-fadeIn">{errors.activity}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sage-700">
                Add more details (optional)
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share any additional information about your plan..."
                className="rounded-lg border-sage-200 focus:border-primary focus:ring-primary min-h-[100px] text-sm"
              />
            </div>

            {/* Mood Tag */}
            <div className="space-y-2">
              <Label className="text-sage-700">Mood</Label>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {["chill", "social", "open", ...savedCustomMoods].map((mood) => {
                    const isDefault = mood === "chill" || mood === "social" || mood === "open"
                    const emoji = mood === "chill" ? "😌" : mood === "social" ? "🎉" : mood === "open" ? "🤔" : "✨"
                    const label = isDefault ? mood.charAt(0).toUpperCase() + mood.slice(1) : mood
                    const isSelected = selectedMoods.includes(mood)

                    return (
                      <div key={mood} className="relative">
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "rounded-full px-3 py-1 text-sm transition-all",
                            isSelected
                              ? "bg-[#A8C7A1] text-white border-[#A8C7A1]"
                              : "bg-gray-100 text-black hover:bg-gray-200 border-transparent",
                          )}
                          onClick={() => {
                            if (isSelected) {
                              // Don't allow deselecting if it's the only selected mood
                              if (selectedMoods.length > 1) {
                                setSelectedMoods(selectedMoods.filter((m) => m !== mood))
                              }
                            } else {
                              setSelectedMoods([...selectedMoods, mood])
                            }
                          }}
                        >
                          <span className="mr-1">{emoji}</span>
                          <span>{label}</span>
                        </Button>

                        {!isDefault && (
                          <button
                            type="button"
                            className="absolute right-1 top-1/2 -translate-y-1/2 text-sage-400 hover:text-sage-600 rounded-full p-0.5 bg-white"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteCustomMood(mood)
                            }}
                            aria-label={`Delete ${mood} mood`}
                          >
                            <X className="h-3 w-3" />
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
                    onClick={() => {
                      if (customMood.trim() && !savedCustomMoods.includes(customMood.trim())) {
                        const newCustomMoods = [...savedCustomMoods, customMood.trim()]
                        setSavedCustomMoods(newCustomMoods)

                        // Save to localStorage for persistence
                        if (typeof window !== "undefined") {
                          localStorage.setItem("customMoods", JSON.stringify(newCustomMoods))
                        }

                        // Add to selected moods
                        setSelectedMoods([...selectedMoods, customMood.trim()])
                        setCustomMood("")
                      }
                    }}
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
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="rounded-lg" />
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

            {/* Expiry Logic */}
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

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
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
        </DialogContent>
      </Dialog>

      {/* Plan Preview Modal */}
      <PlanPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        planDetails={{
          activity,
          description,
          mood: selectedMoods.join(", "), // Join all selected moods
          date,
          time: getDisplayTime(),
          location,
          audience: audienceOptions.find((o) => o.value === audience)?.label || "",
          genderVisibility,
        }}
      />
    </>
  )
}
