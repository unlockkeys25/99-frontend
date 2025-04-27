import { CalendarIcon, Clock, MapPin, User } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface InvitationCardProps {
  invitation: {
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

export function InvitationCard({ invitation }: InvitationCardProps) {
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

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-white">
      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-sage-900">{invitation.activity}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              <span>{invitation.date}</span>
              <Clock className="h-3.5 w-3.5 ml-3 mr-1" />
              <span>{invitation.time}</span>
            </div>
          </div>
          <Badge className={cn("rounded-full", moodColors[invitation.mood])}>
            <span className="mr-1">{moodEmojis[invitation.mood]}</span>
            {invitation.mood.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-3">
        <div className="space-y-2 text-sm text-sage-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-sage-400" />
            <span>{invitation.location}</span>
          </div>

          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 text-sage-400" />
            <span>
              {invitation.creator.isNearby ? "Created by someone nearby" : `Created by ${invitation.creator.name}`}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-full text-xs border-accent/30 bg-accent/10 hover:bg-accent/20 text-accent-foreground"
        >
          <span className="mr-1">💭</span> Still Thinking
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex-1 rounded-full text-xs border-secondary/30 bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground"
        >
          <span className="mr-1">🤔</span> Think I Can Make It
        </Button>

        <Button
          size="sm"
          className="flex-1 rounded-full text-xs bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <span className="mr-1">✅</span> Count Me In
        </Button>
      </CardFooter>
    </Card>
  )
}
