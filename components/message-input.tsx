"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Send, Smile } from "lucide-react"
import { cn } from "@/lib/utils"

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSend: (message: string, isEmoji?: boolean) => void
  disabled?: boolean
  placeholder?: string
}

export function MessageInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Type a message...",
}: MessageInputProps) {
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (value.trim()) {
      onSend(value)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Update the handleEmojiSelect function to properly add emojis to the message input
  const handleEmojiSelect = (emoji: string) => {
    // Always append emoji to current message text
    onChange(value + emoji)
    setEmojiPickerOpen(false)
    inputRef.current?.focus()
  }

  // Common emojis for quick selection
  const quickEmojis = ["👍", "❤️", "😊", "🙌", "🫶", "🥹", "👏", "🎉", "🙏", "😂"]

  // More emoji categories
  const emojiCategories = [
    {
      name: "Faces",
      emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘"],
    },
    {
      name: "Gestures",
      emojis: ["👋", "🤚", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇"],
    },
    {
      name: "Activities",
      emojis: ["🎮", "🧩", "🎨", "🎭", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🪕", "🎻", "🎲", "♟️"],
    },
    {
      name: "Food",
      emojis: ["🍕", "🍔", "🍟", "🌭", "🍿", "🧂", "🥓", "🥚", "🍳", "🧇", "🥞", "🧈", "🍞", "🥐", "🥨", "🥯", "🥖"],
    },
  ]

  return (
    <div className={cn("flex items-center gap-2", disabled && "opacity-70")}>
      <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-sage-500 hover:text-sage-700 hover:bg-sage-100"
            disabled={disabled}
          >
            <Smile className="h-5 w-5" />
            <span className="sr-only">Emoji</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start" side="top">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  className="text-2xl hover:bg-sage-100 p-1.5 rounded-lg transition-colors"
                  onClick={() => handleEmojiSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="border-t border-sage-100 pt-2">
              {emojiCategories.map((category) => (
                <div key={category.name} className="mb-3">
                  <h3 className="text-xs text-sage-500 mb-1">{category.name}</h3>
                  <div className="flex flex-wrap gap-1">
                    {category.emojis.map((emoji) => (
                      <button
                        key={emoji}
                        className="text-xl hover:bg-sage-100 p-1.5 rounded-lg transition-colors"
                        onClick={() => handleEmojiSelect(emoji)}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-full border-sage-200 focus:border-primary focus:ring-primary"
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full",
          value.trim() ? "text-primary hover:text-primary/90 hover:bg-primary/10" : "text-sage-400",
        )}
        onClick={handleSend}
        disabled={disabled || !value.trim()}
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">Send</span>
      </Button>
    </div>
  )
}
