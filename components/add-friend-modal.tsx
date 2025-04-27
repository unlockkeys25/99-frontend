"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

interface AddFriendModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddFriend: (friend: {
    name: string
    tier: "close" | "acquaintance" | "quiet-follow"
  }) => void
}

export function AddFriendModal({ open, onOpenChange, onAddFriend }: AddFriendModalProps) {
  const [name, setName] = useState("")
  const [tier, setTier] = useState<"close" | "acquaintance" | "quiet-follow">("acquaintance")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        description: "Please enter a name",
        variant: "destructive",
        duration: 2000,
      })
      return
    }

    onAddFriend({
      name: name.trim(),
      tier,
    })

    // Reset form
    setName("")
    setTier("acquaintance")
    onOpenChange(false)

    toast({
      description: `${name} added to your friends`,
      duration: 2000,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-center">Add a Friend</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="friend-name" className="text-sage-700">
              Name or Username
            </Label>
            <Input
              id="friend-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name or username"
              className="rounded-lg border-sage-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="friend-tier" className="text-sage-700">
              Assign to Tier
            </Label>
            <Select value={tier} onValueChange={(value) => setTier(value as any)}>
              <SelectTrigger id="friend-tier" className="rounded-lg border-sage-200">
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="close">Close Circle</SelectItem>
                <SelectItem value="acquaintance">Acquaintance</SelectItem>
                <SelectItem value="quiet-follow">Quiet Follow</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
          >
            Add Friend
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
