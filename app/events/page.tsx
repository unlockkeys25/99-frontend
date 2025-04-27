import { AppLayout } from "@/components/app-layout"
import { EventFilters } from "@/components/event-filters"
import { EventCard } from "@/components/event-card"

const events = [
  {
    id: "1",
    activity: "Coffee chat at Elm Street Cafe",
    date: "Today",
    time: "3:00 PM",
    location: "Elm Street Cafe",
    mood: "chill" as const,
    creator: {
      name: "Jamie",
      isNearby: false,
    },
  },
  {
    id: "2",
    activity: "Book club discussion",
    date: "Tomorrow",
    time: "6:30 PM",
    location: "City Library, Room 3",
    mood: "deep-talk" as const,
    creator: {
      name: "Book Lovers Group",
      isNearby: false,
    },
  },
  {
    id: "3",
    activity: "Morning walk in the park",
    date: "Saturday",
    time: "9:00 AM",
    location: "Willow Lake Trail",
    mood: "reflective" as const,
    creator: {
      name: "Someone",
      isNearby: true,
    },
  },
  {
    id: "4",
    activity: "Casual dinner gathering",
    date: "Friday",
    time: "7:00 PM",
    location: "Cozy Corner Restaurant",
    mood: "social" as const,
    creator: {
      name: "Alex",
      isNearby: false,
    },
  },
  {
    id: "5",
    activity: "Quiet movie night",
    date: "Sunday",
    time: "8:00 PM",
    location: "Taylor's Place",
    mood: "low-energy" as const,
    creator: {
      name: "Taylor",
      isNearby: false,
    },
  },
]

export default function EventsPage() {
  return (
    <AppLayout>
      <div className="container max-w-md mx-auto px-4 py-6 bg-background min-h-screen">
        <h1 className="text-2xl font-semibold text-foreground mb-4">Events</h1>

        {/* Filter Bar */}
        <EventFilters />

        {/* Events List */}
        <div className="space-y-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
