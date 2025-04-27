"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { TimePicker } from "@/components/time-picker"
import { toast } from "@/components/ui/use-toast"
import { Textarea } from "@/components/ui/textarea"

interface Plan {
  id: string
  activity: string
  description?: string
  date: Date
  time: string
  location: string
  mood: string
  rsvps: {
    countMeIn: number
    thinkICan: number
    stillThinking: number
  }
}

interface EditPlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: Plan | null
  onSave: (updatedPlan: Plan) => void
}

export function EditPlanModal({ open, onOpenChange, plan, onSave }: EditPlanModalProps) {
  const [activity, setActivity] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [timeOption, setTimeOption] = useState<string>("custom")
  const [customTime, setCustomTime] = useState<string>("")
  const [location, setLocation] = useState("")
  // Change the mood state from a string to an array of strings
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update the useEffect that initializes form data
  useEffect(() => {
    if (plan) {
      setActivity(plan.activity)
      setDescription(plan.description || "")
      setDate(plan.date)
      setCustomTime(plan.time)
      setLocation(plan.location)
      // Handle both string and array formats for backward compatibility
      if (typeof plan.mood === "string") {
        setSelectedMoods(plan.mood.split(", "))
      } else {
        setSelectedMoods([plan.mood])
      }
    }
  }, [plan])

  const timeOptions = [
    { value: "morning", label: "Morning (8-11 AM)" },
    { value: "afternoon", label: "Afternoon (2-5 PM)" },
    { value: "evening", label: "Evening (5-8 PM)" },
    { value: "night", label: "Night (8-11 PM)" },
    { value: "custom", label: "Custom time..." },
  ]

  const moodOptions = [
    { value: "chill", label: "Chill", emoji: "😌" },
    { value: "social", label: "Social", emoji: "🎉" },
    { value: "reflective", label: "Reflective", emoji: "🧠" },
    { value: "deep-talk", label: "Deep Talk", emoji: "💬" },
    { value: "low-energy", label: "Low Energy", emoji: "😴" },
    { value: "open", label: "Open", emoji: "🤔" },
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!activity.trim()) {
      newErrors.activity = "Please enter an activity"
    }

    if (!date) {
      newErrors.date = "Please select a date"
    }

    if (!customTime) {
      newErrors.time = "Please select a time"
    }

    if (selectedMoods.length === 0) {
      newErrors.mood = "Please select at least one mood"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Update the handleSubmit function to show a toast notification
  const handleSubmit = () => {
    if (!plan) return

    setIsSubmitting(true)

    if (validateForm()) {
      // Simulate API call
      setTimeout(() => {
        const updatedPlan: Plan = {
          ...plan,
          activity,
          description,
          date: date!,
          time: customTime,
          location,
          mood: selectedMoods.join(", "), // Join all selected moods
        }

        onSave(updatedPlan)
        onOpenChange(false)
        setIsSubmitting(false)

        toast({
          description: "✅ Your plan has been updated successfully!",
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
      }, 500)
    } else {
      setIsSubmitting(false)
    }
  }

  if (!plan) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center">Edit Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Activity */}
          <div className="space-y-2">
            <Label htmlFor="edit-activity" className="text-sage-700">
              Activity
            </Label>
            <Input
              id="edit-activity"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="Coffee, Walk, Co-work..."
              className="rounded-lg border-sage-200 focus:border-primary focus:ring-primary"
            />
            {errors.activity && <p className="text-xs text-rose-500 mt-1 ml-1 animate-fadeIn">{errors.activity}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sage-700">
              Add more details (optional)
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share any additional information about your plan..."
              className="rounded-lg border-sage-200 focus:border-primary focus:ring-primary min-h-[100px] text-sm"
            />
          </div>

          {/* Mood */}
          <div className="space-y-2">
            <Label htmlFor="edit-mood" className="text-sage-700">
              Mood
            </Label>
            <div className="flex flex-wrap gap-2">
              {moodOptions.map((option) => {
                const isSelected = selectedMoods.includes(option.value)

                return (
                  <Button
                    key={option.value}
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
                          setSelectedMoods(selectedMoods.filter((m) => m !== option.value))
                        }
                      } else {
                        setSelectedMoods([...selectedMoods, option.value])
                      }
                    }}
                  >
                    <span className="mr-1">{option.emoji}</span>
                    <span>{option.label}</span>
                  </Button>
                )
              })}
            </div>
            {errors.mood && <p className="text-xs text-rose-500 mt-1 ml-1 animate-fadeIn">{errors.mood}</p>}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date" className="text-sage-700">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-date"
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
              <Label htmlFor="edit-time" className="text-sage-700">
                Time
              </Label>
              <div className="relative">
                <Select value={timeOption} onValueChange={setTimeOption}>
                  <SelectTrigger id="edit-time" className="rounded-lg border-sage-200">
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

              {timeOption === "custom" && (
                <div className="mt-2">
                  <TimePicker value={customTime} onChange={setCustomTime} className="mt-2" />
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="edit-location" className="text-sage-700">
              Location
            </Label>
            <Input
              id="edit-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="East Side, Somewhere quiet..."
              className="rounded-lg border-sage-200 focus:border-primary focus:ring-primary"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              className="rounded-full border-sage-200 text-sage-700 hover:bg-sage-50"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
