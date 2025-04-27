"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Sample friends data
const friends = [
  { id: "1", name: "Alex Chen" },
  { id: "2", name: "Jamie Smith" },
  { id: "3", name: "Taylor Johnson" },
  { id: "4", name: "Jordan Lee" },
  { id: "5", name: "Casey Williams" },
  { id: "6", name: "Morgan Rivera" },
  { id: "7", name: "Riley Cooper" },
]

export function BlockedFriendsSelect() {
  const [open, setOpen] = useState(false)
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((current) =>
      current.includes(friendId) ? current.filter((id) => id !== friendId) : [...current, friendId],
    )
  }

  const selectedFriendsNames = selectedFriends.map((id) => friends.find((friend) => friend.id === id)?.name || "")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between rounded-lg text-left h-auto min-h-10 py-2"
        >
          {selectedFriends.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selectedFriendsNames.map((name) => (
                <Badge key={name} variant="secondary" className="rounded-full text-xs">
                  {name}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">Select friends to block from this plan</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search friends..." />
          <CommandList>
            <CommandEmpty>No friends found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {friends.map((friend) => (
                <CommandItem
                  key={friend.id}
                  value={friend.name}
                  onSelect={() => toggleFriend(friend.id)}
                  className="flex items-center"
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedFriends.includes(friend.id) ? "opacity-100" : "opacity-0")}
                  />
                  {friend.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
