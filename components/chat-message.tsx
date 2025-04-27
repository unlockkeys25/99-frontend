"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Smile } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ChatMessageProps {
  message: {
    id: string
    sender: {
      name: string
      avatar?: string
      isCurrentUser: boolean
    }
    content: string
    timestamp: Date
    isEmoji: boolean
    reactions?: Array<{
      emoji: string
      userId: string
      userName: string
    }>
  }
  onReaction: (messageId: string, emoji: string) => void
}

export function ChatMessage({ message, onReaction }: ChatMessageProps) {
  const { id, sender, content, timestamp, isEmoji, reactions } = message
  const isCurrentUser = sender.isCurrentUser

  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHrs = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHrs / 24)

    if (diffMins < 1) {
      return "Just now"
    } else if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffHrs < 24) {
      return `${diffHrs}h ago`
    } else if (diffDays === 1) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  // Quick reaction emojis
  const quickReactions = ["👍", "❤️", "🫶", "🥹", "😊", "🙌"]

  return (
    <div className="space-y-1">
      <div className={cn("flex items-end gap-2 max-w-[85%]", isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
        {!isCurrentUser && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
            <AvatarFallback className="bg-primary/20 text-primary-foreground text-xs">
              {sender.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex flex-col">
          {!isCurrentUser && <span className="text-xs text-sage-500 mb-1 ml-1">{sender.name}</span>}

          <div
            className={cn(
              isEmoji ? "text-3xl bg-transparent" : "p-3 rounded-2xl shadow-sm",
              isCurrentUser
                ? "bg-primary/20 text-primary-foreground rounded-tr-none"
                : "bg-white text-sage-800 rounded-tl-none",
            )}
          >
            {content}
          </div>

          <span className={cn("text-xs text-sage-400 mt-1", isCurrentUser ? "text-right mr-1" : "ml-1")}>
            {formatTime(timestamp)}
          </span>
        </div>
      </div>

      {/* Reactions */}
      {reactions && reactions.length > 0 && (
        <div className={cn("flex gap-1", isCurrentUser ? "justify-end" : "justify-start")}>
          {reactions.map((reaction, index) => (
            <div
              key={`${reaction.emoji}-${index}`}
              className="bg-sage-100 rounded-full px-1.5 py-0.5 text-xs flex items-center"
              title={`${reaction.userName}`}
            >
              <span className="mr-1">{reaction.emoji}</span>
              <span className="text-sage-600">1</span>
            </div>
          ))}
        </div>
      )}

      {/* Reaction button */}
      <div className={cn("flex", isCurrentUser ? "justify-start flex-row-reverse" : "justify-end")}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 rounded-full p-0 text-sage-400 hover:text-sage-600 hover:bg-sage-100"
            >
              <Smile className="h-3.5 w-3.5" />
              <span className="sr-only">Add reaction</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align={isCurrentUser ? "end" : "start"}>
            <div className="flex gap-1">
              {quickReactions.map((emoji) => (
                <button
                  key={emoji}
                  className="text-lg hover:bg-sage-100 p-1 rounded-lg transition-colors"
                  onClick={() => onReaction(id, emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
