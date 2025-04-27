"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeletePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  planActivity: string
}

export function DeletePlanDialog({ open, onOpenChange, onConfirm, planActivity }: DeletePlanDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this plan?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete your plan <span className="font-medium">"{planActivity}"</span> and remove it
            from your calendar. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full border-sage-200 text-sage-700 hover:bg-sage-50">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
