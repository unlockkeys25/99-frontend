"use client"

import { useState } from "react"
import { CalendarIcon, Clock, MapPin, User } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type RsvpOption = "count-me-in" | "think-i-can" | "still-thinking" | null

interface EventCardProps {
  event: {
    id: string
    activity: string
    date: string
    time: string
    location: string
    mood: "chill" | "social" | "deep-talk" | "reflective" | "low-energy"
    creator: {
      name: string
      isNearby?: boolean
    }
  }
}

export function EventCard({ event }: EventCardProps) {
  const [selectedRsvp, setSelectedRsvp] = useState<RsvpOption>(null)

  const moodColors = {
    chill: "bg-primary/20 text-primary-foreground",
    social: "bg-secondary/20 text-secondary-foreground",
    "deep-talk": "bg-tertiary/20 text-tertiary-foreground",
    reflective: "bg-accent/20 text-accent-foreground",
    "low-energy": "bg-muted text-muted-foreground",
  }

  const moodEmojis = {
    chill: "😌",
    social: "🎉",
    "deep-talk": "💬",
    reflective: "🧠",
    "low-energy": "😴",
  }

  const handleRsvpClick = (option: RsvpOption) => {
    setSelectedRsvp(option === selectedRsvp ? null : option)
  }

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-background">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-foreground">{event.activity}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              <span>{event.date}</span>
              <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
              <span>{event.time}</span>
            </div>
          </div>
          <Badge className={cn("rounded-full", moodColors[event.mood])}>
            <span className="mr-1">{moodEmojis[event.mood]}</span>
            {event.mood.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-3">
        <div className="space-y-2 text-sm text-sage-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-sage-400" />
            <span>{event.location}</span>
          </div>

          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-sage-400" />
            <span>{event.creator.isNearby ? "Created by someone nearby" : `Created by ${event.creator.name}`}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 rounded-full text-xs",
            selectedRsvp === "still-thinking"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-muted-foreground/20 hover:bg-muted/10",
          )}
          onClick={() => handleRsvpClick("still-thinking")}
        >
          <span className="mr-1">💭</span> Still Thinking
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 rounded-full text-xs",
            selectedRsvp === "think-i-can"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-muted-foreground/20 hover:bg-muted/10",
          )}
          onClick={() => handleRsvpClick("think-i-can")}
        >
          <span className="mr-1">🤔</span> Think I Can Make It
        </Button>

        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex-1 rounded-full text-xs",
            selectedRsvp === "count-me-in"
              ? "bg-primary text-primary-foreground border-primary"
              : "border-muted-foreground/20 hover:bg-muted/10",
          )}
          onClick={() => handleRsvpClick("count-me-in")}
        >
          <span className="mr-1">✅</span> Count Me In
        </Button>
      </CardFooter>
    </Card>
  )
}
