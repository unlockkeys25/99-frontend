"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Update the ChatPreviewProps interface to include information about participants
interface ChatPreviewProps {
  chat: {
    id: string
    name: string
    avatar?: string
    lastMessage: string
    time: string
    unread: number
    planRelated: boolean
    planDetails?: {
      activity: string
      time: string
      expiresAt: Date
      participants?: Array<{
        id: string
        name: string
        avatar?: string
        isCurrentUser?: boolean
      }>
    }
  }
  onSelectChat?: (chatId: string) => void
}

export function ChatPreview({ chat, onSelectChat }: ChatPreviewProps) {
  // Calculate time left until expiry
  const getTimeLeft = () => {
    if (!chat.planDetails?.expiresAt) return null

    const now = new Date()
    const expiryDate = new Date(chat.planDetails.expiresAt)

    // Check if expired
    if (now > expiryDate) {
      return "Expired"
    }

    const diffMs = expiryDate.getTime() - now.getTime()
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHrs > 24) {
      const days = Math.floor(diffHrs / 24)
      return `${days}d`
    } else if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m`
    } else {
      return `${diffMins}m`
    }
  }

  const isExpired = chat.planDetails?.expiresAt && new Date() > new Date(chat.planDetails.expiresAt)

  // Check if the last message is just an emoji
  const isEmojiOnly = /^(\p{Emoji}+)$/u.test(chat.lastMessage.trim())

  // Determine if this is a direct thread (1-on-1 conversation)
  const isDirect = !chat.planRelated && chat.planDetails?.participants?.length === 2

  // For direct threads, get the other participant's name
  const getOtherParticipantName = () => {
    if (isDirect && chat.planDetails?.participants) {
      const otherParticipant = chat.planDetails.participants.find((p) => !p.isCurrentUser)
      return otherParticipant?.name || chat.name
    }
    return chat.name
  }

  // Get the display name based on thread type
  const displayName = isDirect ? getOtherParticipantName() : chat.name

  const handleClick = () => {
    if (onSelectChat) {
      onSelectChat(chat.id)
    }
  }

  return (
    <Link href={`/inbox/${chat.id}`} className="block" onClick={handleClick}>
      <Card className="border-none shadow-sm hover:bg-primary/5 active:bg-primary/10 transition-colors cursor-pointer mb-3 bg-background">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={displayName} />
              <AvatarFallback className="bg-primary/20 text-primary-foreground">
                {displayName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-foreground">{displayName}</h3>

                {chat.unread > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-primary-foreground">
                    {chat.unread}
                  </span>
                )}
              </div>

              {chat.planDetails && (
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-sage-600">{chat.planDetails.time}</span>

                  {chat.planDetails.expiresAt && (
                    <span className="text-xs text-sage-500">
                      {isExpired ? "Expired" : `Expires in ${getTimeLeft()}`}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-2 flex justify-between items-center">
                <p
                  className={cn(
                    "text-sm truncate",
                    isEmojiOnly ? "text-lg" : "",
                    chat.unread > 0 ? "text-sage-800 font-medium" : "text-sage-600",
                  )}
                >
                  {chat.lastMessage}
                </p>

                <span className="text-xs text-sage-400">{chat.time}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
