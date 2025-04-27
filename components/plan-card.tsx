import { CalendarIcon, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PlanCardProps {
  plan: {
    id: string
    activity: string
    location: string
    time: string
    date: string
    mood: "chill" | "open" | "reflective" | "low-energy"
  }
}

export function PlanCard({ plan }: PlanCardProps) {
  const moodColors = {
    chill: "bg-primary/20 text-primary-foreground",
    open: "bg-secondary/20 text-secondary-foreground",
    reflective: "bg-tertiary/20 text-tertiary-foreground",
    "low-energy": "bg-accent/20 text-accent-foreground",
  }

  const moodEmojis = {
    chill: "😌",
    open: "🫶",
    reflective: "🧠",
    "low-energy": "😴",
  }

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-background hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-4 flex flex-row justify-between items-start">
        <h3 className="font-medium text-lg text-foreground">{plan.activity}</h3>
        <Badge className={cn("rounded-full", moodColors[plan.mood])}>
          <span className="mr-1">{moodEmojis[plan.mood]}</span>
          {plan.mood.replace("-", " ")}
        </Badge>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-2 text-sm text-sage-600">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-sage-400" />
            <span>{plan.date}</span>
            <Clock className="h-4 w-4 ml-3 mr-2 text-sage-400" />
            <span>{plan.time}</span>
          </div>

          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-sage-400" />
            <span>{plan.location}</span>
          </div>
        </div>

        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" className="text-xs text-sage-600 hover:text-sage-800 hover:bg-sage-50">
            View details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
