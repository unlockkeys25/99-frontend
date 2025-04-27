"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { YourPlanCard } from "@/components/your-plan-card"
import { EditPlanModal } from "@/components/edit-plan-modal"
import { DeletePlanDialog } from "@/components/delete-plan-dialog"
import { CreatePlanModal } from "@/components/create-plan-modal"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample data for plans created by the user
const initialYourPlans = [
  {
    id: "1",
    activity: "Coffee with Jamie",
    description: "Catching up over coffee to discuss the new book we're both reading.",
    date: new Date(),
    time: "3:00 PM",
    location: "Quiet Corner Cafe",
    mood: "chill",
    rsvps: {
      countMeIn: 2,
      thinkICan: 1,
      stillThinking: 0,
    },
  },
  {
    id: "2",
    activity: "Book exchange",
    description: "Bringing a few books to swap. Looking for something new to read!",
    date: new Date(Date.now() + 86400000), // Tomorrow
    time: "11:00 AM",
    location: "City Park Bench",
    mood: "reflective",
    rsvps: {
      countMeIn: 1,
      thinkICan: 0,
      stillThinking: 1,
    },
  },
  {
    id: "3",
    activity: "Walk around the lake",
    description: "Casual stroll around the lake. Weather should be nice.",
    date: new Date(Date.now() + 86400000 * 5), // 5 days from now
    time: "9:00 AM",
    location: "Willow Lake",
    mood: "open",
    rsvps: {
      countMeIn: 3,
      thinkICan: 2,
      stillThinking: 1,
    },
  },
]

export default function FloatedPage() {
  const router = useRouter()
  const [userPlans, setUserPlans] = useState(initialYourPlans)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // State for edit modal
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<(typeof initialYourPlans)[0] | null>(null)

  // State for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<string | null>(null)

  // Add a function to handle adding a new plan
  const handleAddPlan = (newPlan: (typeof initialYourPlans)[0]) => {
    setUserPlans((prevPlans) => [newPlan, ...prevPlans])

    toast({
      description: "Plan created successfully",
      duration: 2000,
    })
  }

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
    localStorage.setItem("userPlans", JSON.stringify(userPlans))
  }, [userPlans])

  const handleEditPlan = (planId: string) => {
    const planToEdit = userPlans.find((plan) => plan.id === planId)
    if (planToEdit) {
      setCurrentPlan(planToEdit)
      setEditModalOpen(true)
    }
  }

  const handleDeletePlan = (planId: string) => {
    setPlanToDelete(planId)
    setDeleteDialogOpen(true)
  }

  const confirmDeletePlan = () => {
    if (planToDelete) {
      const updatedPlans = userPlans.filter((plan) => plan.id !== planToDelete)
      setUserPlans(updatedPlans)
      setPlanToDelete(null)

      toast({
        description: "Plan deleted successfully",
        duration: 2000,
      })
    }
    setDeleteDialogOpen(false)
  }

  const handleSavePlan = (updatedPlan: (typeof initialYourPlans)[0]) => {
    const updatedPlans = userPlans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
    setUserPlans(updatedPlans)
  }

  // Get the activity of the plan to delete for the confirmation dialog
  const getPlanActivityToDelete = () => {
    if (!planToDelete) return ""
    const plan = userPlans.find((p) => p.id === planToDelete)
    return plan ? plan.activity : ""
  }

  return (
    <AppLayout>
      <div className="container max-w-md mx-auto px-4 pt-4 pb-6 space-y-6 bg-background">
        <h1 className="text-2xl font-semibold text-sage-900 mb-6">Floated Plans</h1>

        {/* Create Plan Button - Hidden for now */}
        <div className="flex justify-center" style={{ display: "none" }}>
          <Button
            onClick={() => setCreateModalOpen(true)}
            className="w-1/2 h-14 rounded-full bg-sage-100 hover:bg-sage-200 text-sage-800 border border-sage-200 hover:shadow-md transition-all font-bold text-lg"
          >
            Create Plan
          </Button>
        </div>

        {/* Floated Plans Section */}
        <section>
          {/* Heading - Hidden */}
          <div className="flex items-center mb-3" style={{ display: "none" }}>
            <Leaf className="h-5 w-5 mr-2 text-primary" />
            <h2 className="text-lg font-medium text-foreground bg-secondary px-2 py-1 rounded-md">
              Your Floated Plans
            </h2>
          </div>
          <div className="space-y-3">
            {userPlans.length > 0 ? (
              userPlans.map((plan) => (
                <YourPlanCard key={plan.id} plan={plan} onEdit={handleEditPlan} onDelete={handleDeletePlan} />
              ))
            ) : (
              <div className="text-center py-6 bg-white rounded-lg shadow-sm">
                <p className="text-sage-600">You haven't floated any plans yet</p>
                <p className="text-sm text-sage-500 mt-1">Click the Create Plan button to float your first plan</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Create Plan Modal */}
      <CreatePlanModal open={createModalOpen} onOpenChange={setCreateModalOpen} onAddPlan={handleAddPlan} />

      {/* Edit Plan Modal */}
      <EditPlanModal open={editModalOpen} onOpenChange={setEditModalOpen} plan={currentPlan} onSave={handleSavePlan} />

      {/* Delete Plan Confirmation Dialog */}
      <DeletePlanDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeletePlan}
        planActivity={getPlanActivityToDelete()}
      />
    </AppLayout>
  )
}
