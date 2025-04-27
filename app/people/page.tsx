"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { FriendCard } from "@/components/friend-card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Search, UserPlus, Link, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AddFriendModal } from "@/components/add-friend-modal"
import { InviteLinkModal } from "@/components/invite-link-modal"
import { ImportContactsModal } from "@/components/import-contacts-modal"

// Sample friends data
const initialFriends = [
  {
    id: "1",
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "close" as const,
    status: "available" as const,
    lastActive: "Now",
    isNearby: true,
  },
  {
    id: "2",
    name: "Jamie Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "acquaintance" as const,
    status: "quiet" as const,
    lastActive: "2h ago",
    isNearby: false,
  },
  {
    id: "3",
    name: "Taylor Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "close" as const,
    status: "busy" as const,
    lastActive: "1h ago",
    isNearby: true,
  },
  {
    id: "4",
    name: "Jordan Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "quiet-follow" as const,
    status: "offline" as const,
    lastActive: "2d ago",
    isNearby: false,
  },
  {
    id: "5",
    name: "Casey Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "acquaintance" as const,
    status: "available" as const,
    lastActive: "Just now",
    isNearby: true,
  },
  {
    id: "6",
    name: "Morgan Rivera",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "quiet-follow" as const,
    status: "available" as const,
    lastActive: "5m ago",
    isNearby: true,
  },
  {
    id: "7",
    name: "Riley Cooper",
    avatar: "/placeholder.svg?height=40&width=40",
    tier: "close" as const,
    status: "quiet" as const,
    lastActive: "1h ago",
    isNearby: false,
  },
]

export default function PeoplePage() {
  const [friends, setFriends] = useState(initialFriends)
  const [showNearbyOnly, setShowNearbyOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [addFriendOpen, setAddFriendOpen] = useState(false)
  const [inviteLinkOpen, setInviteLinkOpen] = useState(false)
  const [importContactsOpen, setImportContactsOpen] = useState(false)

  // Load friends from localStorage on mount
  useEffect(() => {
    const savedFriends = localStorage.getItem("friends")
    if (savedFriends) {
      setFriends(JSON.parse(savedFriends))
    }
  }, [])

  // Save friends to localStorage when updated
  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends))
  }, [friends])

  // Filter friends based on search and nearby toggle
  const filteredFriends = friends.filter((friend) => {
    const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesNearby = showNearbyOnly ? friend.isNearby : true
    return matchesSearch && matchesNearby
  })

  // Group friends by tier
  const closeFriends = filteredFriends.filter((friend) => friend.tier === "close")
  const acquaintances = filteredFriends.filter((friend) => friend.tier === "acquaintance")
  const quietFollows = filteredFriends.filter((friend) => friend.tier === "quiet-follow")

  // Tier colors for section headers
  const tierColors = {
    close: "bg-accent/20 text-accent-foreground",
    acquaintance: "bg-secondary/20 text-secondary-foreground",
    "quiet-follow": "bg-tertiary/20 text-tertiary-foreground",
  }

  // Add a new friend
  const handleAddFriend = (newFriend: { name: string; tier: "close" | "acquaintance" | "quiet-follow" }) => {
    const newId = `new-${Date.now()}`
    setFriends([
      ...friends,
      {
        id: newId,
        name: newFriend.name,
        avatar: "/placeholder.svg?height=40&width=40",
        tier: newFriend.tier,
        status: "offline" as const,
        lastActive: "Just added",
        isNearby: false,
      },
    ])
  }

  // Import contacts as friends
  const handleImportContacts = (contacts: Array<{ name: string }>) => {
    const newFriends = contacts.map((contact, index) => ({
      id: `imported-${Date.now()}-${index}`,
      name: contact.name,
      avatar: "/placeholder.svg?height=40&width=40",
      tier: "acquaintance" as const,
      status: "offline" as const,
      lastActive: "Just imported",
      isNearby: false,
    }))

    setFriends([...friends, ...newFriends])
  }

  // Remove a friend
  const handleRemoveFriend = (friendId: string) => {
    setFriends(friends.filter((friend) => friend.id !== friendId))
  }

  // Update a friend's tier
  const handleUpdateTier = (friendId: string, newTier: "close" | "acquaintance" | "quiet-follow") => {
    setFriends(friends.map((friend) => (friend.id === friendId ? { ...friend, tier: newTier } : friend)))
  }

  return (
    <AppLayout>
      <div className="container max-w-md mx-auto px-4 py-6 bg-background min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-foreground">People</h1>
          <Button size="icon" variant="ghost" className="rounded-full" onClick={() => setAddFriendOpen(true)}>
            <UserPlus className="h-5 w-5" />
            <span className="sr-only">Add friend</span>
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search friends"
              className="pl-9 rounded-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full flex-1" onClick={() => setInviteLinkOpen(true)}>
              <Link className="h-4 w-4 mr-1.5" />
              Invite via Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full flex-1"
              onClick={() => setImportContactsOpen(true)}
            >
              <Users className="h-4 w-4 mr-1.5" />
              Import Contacts
            </Button>
          </div>

          {/* Nearby toggle */}
          <div className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
            <Label htmlFor="nearby-toggle" className="text-sm text-sage-700 cursor-pointer">
              Show nearby friends only
            </Label>
            <Switch
              id="nearby-toggle"
              checked={showNearbyOnly}
              onCheckedChange={setShowNearbyOnly}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Friend groups */}
        <div className="space-y-6">
          {/* Close Circle */}
          {closeFriends.length > 0 && (
            <div className="space-y-2">
              <div className={cn("px-3 py-1.5 rounded-lg inline-block", tierColors.close)}>
                <h2 className="text-sm font-medium">Close Circle</h2>
              </div>
              <div className="space-y-2">
                {closeFriends.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onRemoveFriend={handleRemoveFriend}
                    onUpdateTier={handleUpdateTier}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Acquaintance */}
          {acquaintances.length > 0 && (
            <div className="space-y-2">
              <div className={cn("px-3 py-1.5 rounded-lg inline-block", tierColors.acquaintance)}>
                <h2 className="text-sm font-medium">Acquaintance</h2>
              </div>
              <div className="space-y-2">
                {acquaintances.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onRemoveFriend={handleRemoveFriend}
                    onUpdateTier={handleUpdateTier}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quiet Follow */}
          {quietFollows.length > 0 && (
            <div className="space-y-2">
              <div className={cn("px-3 py-1.5 rounded-lg inline-block", tierColors["quiet-follow"])}>
                <h2 className="text-sm font-medium">Quiet Follow</h2>
              </div>
              <div className="space-y-2">
                {quietFollows.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                    onRemoveFriend={handleRemoveFriend}
                    onUpdateTier={handleUpdateTier}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {filteredFriends.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p>No friends found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddFriendModal open={addFriendOpen} onOpenChange={setAddFriendOpen} onAddFriend={handleAddFriend} />

      <InviteLinkModal open={inviteLinkOpen} onOpenChange={setInviteLinkOpen} />

      <ImportContactsModal
        open={importContactsOpen}
        onOpenChange={setImportContactsOpen}
        onImportContacts={handleImportContacts}
      />
    </AppLayout>
  )
}
