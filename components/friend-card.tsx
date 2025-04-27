"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface FriendCardProps {
  friend: {
    id: string
    name: string
    avatar?: string
    tier: "close" | "acquaintance" | "quiet-follow"
    status: "available" | "busy" | "quiet" | "offline"
    lastActive: string
    isNearby?: boolean
  }
  onRemoveFriend?: (id: string) => void
  onUpdateTier?: (id: string, tier: "close" | "acquaintance" | "quiet-follow") => void
}

export function FriendCard({ friend, onRemoveFriend, onUpdateTier }: FriendCardProps) {
  const [currentTier, setCurrentTier] = useState(friend.tier)
  const [isEditingTier, setIsEditingTier] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  const tierColors = {
    close: "bg-accent text-accent-foreground",
    acquaintance: "bg-secondary text-secondary-foreground",
    "quiet-follow": "bg-tertiary text-tertiary-foreground",
  }

  const tierLabels = {
    close: "Close Circle",
    acquaintance: "Acquaintance",
    "quiet-follow": "Quiet Follow",
  }

  const statusColors = {
    available: "bg-green-400",
    busy: "bg-amber-400",
    quiet: "bg-accent",
    offline: "bg-gray-400",
  }

  const statusLabels = {
    available: "I'm around",
    busy: "Busy",
    quiet: "Quiet mode",
    offline: "Offline",
  }

  const handleTierChange = (newTier: "close" | "acquaintance" | "quiet-follow") => {
    setCurrentTier(newTier)
    setIsEditDialogOpen(false)

    // Call the parent component's update function if provided
    if (onUpdateTier) {
      onUpdateTier(friend.id, newTier)
    }

    toast({
      description: `${friend.name} moved to ${tierLabels[newTier]}`,
      duration: 2000,
    })
  }

  const handleRemoveFriend = () => {
    setIsConfirmDeleteOpen(false)

    // Call the parent component's remove function if provided
    if (onRemoveFriend) {
      onRemoveFriend(friend.id)
    }

    toast({
      description: `${friend.name} has been removed from your friends`,
      duration: 2000,
    })
  }

  return (
    <>
      <Card className="border-none shadow-sm hover:bg-background/80 transition-colors bg-background">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={friend.avatar || "/placeholder.svg"} alt={friend.name} />
                <AvatarFallback className="bg-primary/20 text-primary-foreground">
                  {friend.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background",
                  statusColors[friend.status],
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium truncate text-foreground">{friend.name}</h3>
                <div className="flex items-center gap-2">
                  {!isEditingTier && (
                    <Badge className={cn("rounded-full text-xs", tierColors[currentTier])}>
                      {tierLabels[currentTier]}
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit Tier</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setIsConfirmDeleteOpen(true)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Remove Friend</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Tier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Edit Friend Tier</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Choose which tier to place <span className="font-medium">{friend.name}</span> in:
            </p>
            <div className="space-y-2">
              {(["close", "acquaintance", "quiet-follow"] as const).map((tier) => (
                <Button
                  key={tier}
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left rounded-lg py-3 px-4 bg-gray-100",
                    currentTier === tier && "ring-2 ring-primary bg-primary/5",
                  )}
                  onClick={() => handleTierChange(tier)}
                >
                  <div className="flex items-center">
                    <div className={cn("w-3 h-3 rounded-full mr-3", tierColors[tier].split(" ")[0])}></div>
                    <div>
                      <p className="font-medium">{tierLabels[tier]}</p>
                      {tier === "close" && <p className="text-xs text-muted-foreground">Your closest friends</p>}
                      {tier === "acquaintance" && (
                        <p className="text-xs text-muted-foreground">Friends you know but aren't close with</p>
                      )}
                      {tier === "quiet-follow" && (
                        <p className="text-xs text-muted-foreground">Friends you follow without interaction</p>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle>Remove Friend</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to remove <span className="font-medium">{friend.name}</span> from your friends? This
              action cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveFriend}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
