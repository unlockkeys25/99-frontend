"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { UpcomingPlanCard } from "@/components/upcoming-plan-card"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Clock } from "lucide-react"

// Sample data for plans the user was invited to and responded to
const upcomingPlans = [
  {
    id: "4",
    activity: "Coffee chat at Elm Street Cafe",
    host: "Jamie",
    date: "Today",
    time: "3:00 PM",
    location: "Elm Street Cafe",
    mood: "chill",
    rsvpStatus: "count-me-in" as const,
  },
  {
    id: "5",
    activity: "Book club discussion",
    host: "Book Lovers Group",
    date: "Tomorrow",
    time: "6:30 PM",
    location: "City Library, Room 3",
    mood: "deep-talk",
    rsvpStatus: "think-i-can" as const,
  },
  {
    id: "6",
    activity: "Morning walk in the park",
    host: "Taylor",
    date: "Saturday",
    time: "9:00 AM",
    location: "Willow Lake Trail",
    mood: "reflective",
    rsvpStatus: "count-me-in" as const,
  },
]

export default function UpcomingPage() {
  const router = useRouter()
  const [invitedPlans] = useState(upcomingPlans)

  const handleChangeRsvp = (planId: string) => {
    toast({
      description: `Changing RSVP for plan ${planId}`,
      duration: 2000,
    })
    router.push("/events")
  }

  return (
    <AppLayout>
      <div className="container max-w-md mx-auto px-4 pt-4 pb-6 space-y-6 bg-background">
        <h1 className="text-2xl font-semibold text-sage-900 mb-6">Upcoming Plans</h1>

        {/* Upcoming Plans Section */}
        <section>
          {/* Heading - Hidden */}
          <div className="flex items-center mb-3" style={{ display: "none" }}>
            <Clock className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-lg font-medium text-foreground bg-secondary px-2 py-1 rounded-md">
              Plans you're attending
            </h2>
          </div>
          <div className="space-y-3">
            {invitedPlans.length > 0 ? (
              invitedPlans.map((plan) => <UpcomingPlanCard key={plan.id} plan={plan} onChangeRsvp={handleChangeRsvp} />)
            ) : (
              <div className="text-center py-6 bg-white rounded-lg shadow-sm">
                <p className="text-sage-600">No upcoming plans</p>
                <p className="text-sm text-sage-500 mt-1">Check the Events tab to find plans near you</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
