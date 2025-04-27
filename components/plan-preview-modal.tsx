"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock, MapPin, Users, Eye } from "lucide-react"

interface PlanPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planDetails: {
    activity: string
    description?: string
    mood: string
    date: Date | undefined
    time: string
    location: string
    audience: string
    genderVisibility: string
  }
}

export function PlanPreviewModal({ open, onOpenChange, planDetails }: PlanPreviewModalProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Not specified"
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  }

  // Update the getMoodEmoji function to handle multiple moods
  const getMoodEmoji = (mood: string) => {
    // If there are multiple moods, get the first one
    const primaryMood = mood.split(", ")[0].trim()

    if (primaryMood === "chill") return "😌"
    if (primaryMood === "social") return "🎉"
    if (primaryMood === "open") return "🤔"
    return "✨"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl bg-sage-50 border-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium text-sage-900 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Plan Preview
          </DialogTitle>
        </DialogHeader>

        <div className="bg-white rounded-lg p-4 shadow-sm space-y-4 my-2">
          {/* Activity */}
          <h3 className="text-lg font-medium text-sage-900">{planDetails.activity || "Untitled Activity"}</h3>

          {planDetails.description && <p className="text-sm text-sage-600 mt-2 mb-3">{planDetails.description}</p>}

          {/* Mood */}
          <div className="flex flex-wrap gap-2 mt-1">
            {planDetails.mood.split(", ").map((singleMood, index) => (
              <div
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary-foreground"
              >
                <span className="mr-1">
                  {singleMood === "chill" ? "😌" : singleMood === "social" ? "🎉" : singleMood === "open" ? "🤔" : "✨"}
                </span>
                <span className="capitalize">{singleMood}</span>
              </div>
            ))}
          </div>

          {/* Date and Time */}
          <div className="flex items-center text-sm text-sage-700">
            <CalendarIcon className="h-4 w-4 mr-2 text-sage-500" />
            <span>{formatDate(planDetails.date)}</span>
            {planDetails.time && (
              <>
                <Clock className="h-4 w-4 ml-3 mr-2 text-sage-500" />
                <span>{planDetails.time}</span>
              </>
            )}
          </div>

          {/* Location */}
          {planDetails.location && (
            <div className="flex items-center text-sm text-sage-700">
              <MapPin className="h-4 w-4 mr-2 text-sage-500" />
              <span>{planDetails.location}</span>
            </div>
          )}

          {/* Visibility */}
          <div className="flex items-center text-sm text-sage-700">
            <Users className="h-4 w-4 mr-2 text-sage-500" />
            <span>
              Visible to: {planDetails.audience || "Not specified"}
              {planDetails.genderVisibility && planDetails.genderVisibility !== "all" && (
                <span className="ml-1">({planDetails.genderVisibility.replace("-only", " only")})</span>
              )}
            </span>
          </div>
        </div>

        <p className="text-xs text-sage-500 text-center">This is how your plan will appear to others</p>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
