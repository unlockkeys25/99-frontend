"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { MoodCheckIn } from "@/components/mood-check-in"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CreatePlanModal } from "@/components/create-plan-modal"
import { toast } from "@/components/ui/use-toast"

// Sample data structure for plans
interface Plan {
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
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true)
  const router = useRouter()
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [userPlans, setUserPlans] = useState<Plan[]>([])

  // Load plans from localStorage on mount
  useEffect(() => {
    const savedPlans = localStorage.getItem("userPlans")
    if (savedPlans) {
      try {
        // Parse the JSON string
        const parsedPlans = JSON.parse(savedPlans)

        // Convert date strings back to Date objects
        const plansWithDates = parsedPlans.map((plan: any) => ({
          ...plan,
          date: new Date(plan.date),
        }))

        setUserPlans(plansWithDates)
      } catch (error) {
        console.error("Error parsing saved plans:", error)
      }
    }
  }, [])

  // Save plans to localStorage when they change
  useEffect(() => {
    if (userPlans.length > 0) {
      localStorage.setItem("userPlans", JSON.stringify(userPlans))
    }
  }, [userPlans])

  // Add a function to handle adding a new plan
  const handleAddPlan = (newPlan: Plan) => {
    setUserPlans((prevPlans) => [newPlan, ...(prevPlans || [])])

    toast({
      description: "Plan created successfully",
      duration: 2000,
    })
  }

  return (
    <AppLayout>
      <div className="container max-w-md mx-auto px-4 pt-4 pb-6 space-y-6 bg-background">
        {/* Welcome Message - only shown first time */}
        {showWelcome && (
          <div className="bg-primary/10 rounded-xl p-4 text-center relative">
            <button
              className="absolute top-2 right-2 text-sage-500 hover:text-sage-700"
              onClick={() => setShowWelcome(false)}
            >
              ✕
            </button>
            <h1 className="text-xl font-semibold text-sage-900 mb-2">Welcome to 99</h1>
            <p className="text-sage-700">
              A gentler way to make plans with friends. Check your Upcoming and Floated tabs to see your plans.
            </p>
          </div>
        )}

        {/* Mood Check-in Section */}
        <MoodCheckIn />

        {/* Quick Actions */}
        <div className="flex flex-col items-center justify-center mt-8 space-y-4">
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="w-3/4 h-14 rounded-full bg-sage-100 hover:bg-sage-200 text-sage-800 border border-sage-200 hover:shadow-md transition-all font-bold text-lg"
          >
            Create Plan
          </Button>
          <Button
            onClick={() => router.push("/events")}
            variant="outline"
            className="w-3/4 h-12 rounded-full border-sage-200 text-sage-700 hover:bg-sage-50"
          >
            Browse Events
          </Button>
        </div>
      </div>

      {/* Create Plan Modal */}
      <CreatePlanModal open={createModalOpen} onOpenChange={setCreateModalOpen} onAddPlan={handleAddPlan} />
    </AppLayout>
  )
}
