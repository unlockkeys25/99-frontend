"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Mood = "chill" | "open" | "quiet" | null

export function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<Mood>(null)

  const moods = [
    { id: "chill", label: "Chill" },
    { id: "open", label: "Open" },
    { id: "quiet", label: "Quiet" },
  ]

  return (
    <Card className="border-none shadow-sm bg-background">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-foreground">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center gap-2">
          {moods.map((mood) => (
            <Button
              key={mood.id}
              variant="outline"
              onClick={() => setSelectedMood(mood.id as Mood)}
              className={cn(
                "flex-1 py-2 rounded-full transition-all dark:text-black",
                selectedMood === mood.id ? "bg-[#A8C7A1] border-[#A8C7A1] text-white" : "bg-gray-100 hover:bg-gray-200",
              )}
            >
              <span className="text-sm">{mood.label}</span>
            </Button>
          ))}
        </div>

        <p className="text-sm text-gray-500 dark:text-white mt-3 text-center">This is only visible to you</p>
      </CardContent>
    </Card>
  )
}
