"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/app-layout"
import { PlanChatHeader } from "@/components/plan-chat-header"
import { ChatMessage } from "@/components/chat-message"
import { MessageInput } from "@/components/message-input"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

// Update the sample chats data to include direct messages
const sampleChats: Record<
  string,
  {
    plan: {
      id: string
      activity: string
      date: string
      time: string
      location: string
      host: string
      mood: string
      expiresAt: Date
      participants: Array<{
        id: string
        name: string
        avatar?: string
        rsvpStatus: "count-me-in" | "think-i-can"
      }>
    }
    messages: Array<{
      id: string
      sender: {
        id: string
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
    }>
  }
> = {
  "1": {
    plan: {
      id: "1",
      activity: "Morning Coffee ☕",
      date: "Today",
      time: "10:30 AM",
      location: "Quiet Corner Cafe",
      host: "Jamie",
      mood: "chill",
      expiresAt: new Date(Date.now() + 3600000 * 2), // 2 hours from now
      participants: [
        {
          id: "u2",
          name: "Jamie",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "count-me-in",
        },
        {
          id: "u1",
          name: "You",
          rsvpStatus: "count-me-in",
        },
        {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "count-me-in",
        },
        {
          id: "u4",
          name: "Taylor",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "think-i-can",
        },
      ],
    },
    messages: [
      {
        id: "m1",
        sender: {
          id: "u2",
          name: "Jamie",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "Hey everyone! Looking forward to seeing you all at the cafe.",
        timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        isEmoji: false,
        reactions: [
          {
            emoji: "👍",
            userId: "u1",
            userName: "You",
          },
          {
            emoji: "🫶",
            userId: "u3",
            userName: "Alex",
          },
        ],
      },
      {
        id: "m2",
        sender: {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "I'll be there in 10 minutes",
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        isEmoji: false,
      },
      {
        id: "m3",
        sender: {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
        content: "👍",
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        isEmoji: true,
      },
      {
        id: "m4",
        sender: {
          id: "u4",
          name: "Taylor",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "Running a bit late, save me a seat!",
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        isEmoji: false,
      },
      {
        id: "m5",
        sender: {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
        content: "No worries, we'll be here for a while",
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        isEmoji: false,
      },
    ],
  },
  "2": {
    plan: {
      id: "2",
      activity: "Walk & Chai? 🍵",
      date: "Tomorrow",
      time: "4:00 PM",
      location: "Riverside Path",
      host: "Alex",
      mood: "chill",
      expiresAt: new Date(Date.now() + 3600000 * 24 * 2), // 2 days from now
      participants: [
        {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "count-me-in",
        },
        {
          id: "u1",
          name: "You",
          rsvpStatus: "think-i-can",
        },
      ],
    },
    messages: [
      {
        id: "m1",
        sender: {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "Hey! Would you be up for a walk and chai tomorrow afternoon?",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isEmoji: false,
      },
      {
        id: "m2",
        sender: {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
        content: "That sounds lovely! What time were you thinking?",
        timestamp: new Date(Date.now() - 82800000), // 23 hours ago
        isEmoji: false,
      },
      {
        id: "m3",
        sender: {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "How about 4pm at the riverside path?",
        timestamp: new Date(Date.now() - 79200000), // 22 hours ago
        isEmoji: false,
      },
      {
        id: "m4",
        sender: {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
        content: "Sounds good to me!",
        timestamp: new Date(Date.now() - 75600000), // 21 hours ago
        isEmoji: false,
      },
    ],
  },
  "3": {
    plan: {
      id: "3",
      activity: "Movie Night 🎬",
      date: "Tomorrow",
      time: "7:00 PM",
      location: "Taylor's Place",
      host: "Taylor",
      mood: "social",
      expiresAt: new Date(Date.now() + 3600000 * 24 + 1800000), // Tomorrow + 30 minutes
      participants: [
        {
          id: "u4",
          name: "Taylor",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "count-me-in",
        },
        {
          id: "u1",
          name: "You",
          rsvpStatus: "think-i-can",
        },
        {
          id: "u2",
          name: "Jamie",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "count-me-in",
        },
        {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "think-i-can",
        },
      ],
    },
    messages: [
      {
        id: "m1",
        sender: {
          id: "u4",
          name: "Taylor",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "Movie night at my place tomorrow! I was thinking we could watch that new sci-fi film.",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isEmoji: false,
      },
      {
        id: "m2",
        sender: {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "Sounds good to me!",
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        isEmoji: false,
        reactions: [
          {
            emoji: "🥹",
            userId: "u1",
            userName: "You",
          },
        ],
      },
      {
        id: "m3",
        sender: {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
        content: "Should we bring snacks?",
        timestamp: new Date(Date.now() - 21600000), // 6 hours ago
        isEmoji: false,
      },
      {
        id: "m4",
        sender: {
          id: "u4",
          name: "Taylor",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "Yes please! I'll provide drinks.",
        timestamp: new Date(Date.now() - 10800000), // 3 hours ago
        isEmoji: false,
      },
      {
        id: "m5",
        sender: {
          id: "u2",
          name: "Jamie",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "🍿",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isEmoji: true,
      },
    ],
  },
  "4": {
    plan: {
      id: "4",
      activity: "Dinner Plans? 🍽️",
      date: "Friday",
      time: "7:30 PM",
      location: "Harvest Table Restaurant",
      host: "Jamie",
      mood: "social",
      expiresAt: new Date(Date.now() + 3600000 * 24 * 3), // 3 days from now
      participants: [
        {
          id: "u2",
          name: "Jamie",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "count-me-in",
        },
        {
          id: "u1",
          name: "You",
          rsvpStatus: "think-i-can",
        },
      ],
    },
    messages: [
      {
        id: "m1",
        sender: {
          id: "u2",
          name: "Jamie",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "Hey! Would you be interested in dinner at Harvest Table on Friday?",
        timestamp: new Date(Date.now() - 259200000), // 3 days ago
        isEmoji: false,
      },
      {
        id: "m2",
        sender: {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
        content: "That sounds nice! What time?",
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        isEmoji: false,
      },
      {
        id: "m3",
        sender: {
          id: "u2",
          name: "Jamie",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "How about 7:30pm? They have that new seasonal menu.",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isEmoji: false,
      },
      {
        id: "m4",
        sender: {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
        content: "I'm in quiet mode today, maybe tomorrow?",
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        isEmoji: false,
      },
    ],
  },
  "5": {
    plan: {
      id: "5",
      activity: "Book Club 📚",
      date: "Next Tuesday",
      time: "6:30 PM",
      location: "City Library",
      host: "Book Lovers Group",
      mood: "deep-talk",
      expiresAt: new Date(Date.now() + 3600000 * 24 * 6), // 6 days from now
      participants: [
        {
          id: "u7",
          name: "Book Lovers Group",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "count-me-in",
        },
        {
          id: "u1",
          name: "You",
          rsvpStatus: "think-i-can",
        },
        {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "count-me-in",
        },
      ],
    },
    messages: [
      {
        id: "m1",
        sender: {
          id: "u7",
          name: "Book Lovers Group",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "The meeting is postponed to next week due to the holiday.",
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        isEmoji: false,
      },
      {
        id: "m2",
        sender: {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
        content: "Thanks for letting us know. I'll update my calendar.",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isEmoji: false,
      },
      {
        id: "m3",
        sender: {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "Has everyone finished the book? I'm still on chapter 8.",
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        isEmoji: false,
      },
    ],
  },
  "6": {
    plan: {
      id: "6",
      activity: "Park Picnic 🌿",
      date: "Saturday",
      time: "1:00 PM",
      location: "Willow Park",
      host: "Riley",
      mood: "chill",
      expiresAt: new Date(Date.now() - 3600000), // 1 hour ago (expired)
      participants: [
        {
          id: "u6",
          name: "Riley",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "count-me-in",
        },
        {
          id: "u1",
          name: "You",
          rsvpStatus: "count-me-in",
        },
        {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "count-me-in",
        },
      ],
    },
    messages: [
      {
        id: "m1",
        sender: {
          id: "u6",
          name: "Riley",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "Perfect weather for a picnic today!",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isEmoji: false,
      },
      {
        id: "m2",
        sender: {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
        content: "I'll bring some sandwiches and fruit.",
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        isEmoji: false,
      },
      {
        id: "m3",
        sender: {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "I've got drinks covered!",
        timestamp: new Date(Date.now() - 21600000), // 6 hours ago
        isEmoji: false,
      },
      {
        id: "m4",
        sender: {
          id: "u6",
          name: "Riley",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "🌞",
        timestamp: new Date(Date.now() - 10800000), // 3 hours ago
        isEmoji: true,
      },
    ],
  },
  "7": {
    plan: {
      id: "7",
      activity: "Coffee Chat ☕",
      date: "Friday",
      time: "3:00 PM",
      location: "Elm Street Cafe",
      host: "Morgan",
      mood: "chill",
      expiresAt: new Date(Date.now() + 3600000 * 72 + 1800000), // 3 days + 30 minutes
      participants: [
        {
          id: "u5",
          name: "Morgan",
          avatar: "/placeholder.svg?height=40&width=40",
          rsvpStatus: "count-me-in",
        },
        {
          id: "u1",
          name: "You",
          rsvpStatus: "count-me-in",
        },
      ],
    },
    messages: [
      {
        id: "m1",
        sender: {
          id: "u5",
          name: "Morgan",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "Hey! Looking forward to our coffee chat on Friday.",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        isEmoji: false,
      },
      {
        id: "m2",
        sender: {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
        content: "Me too! It's been a while since we caught up.",
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        isEmoji: false,
      },
      {
        id: "m3",
        sender: {
          id: "u5",
          name: "Morgan",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        content: "Definitely! I have some exciting news to share.",
        timestamp: new Date(Date.now() - 21600000), // 6 hours ago
        isEmoji: false,
        reactions: [
          {
            emoji: "🫶",
            userId: "u1",
            userName: "You",
          },
        ],
      },
      {
        id: "m4",
        sender: {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
        content: "🥹 Can't wait!",
        timestamp: new Date(Date.now() - 10800000), // 3 hours ago
        isEmoji: false,
      },
    ],
  },
}

// Function to get chat data from localStorage or use the default data
const getChatData = () => {
  if (typeof window !== "undefined") {
    const storedChats = localStorage.getItem("chatData")
    if (storedChats) {
      try {
        // Parse dates from JSON
        const parsedChats = JSON.parse(storedChats, (key, value) => {
          if (key === "expiresAt" && value) {
            return new Date(value)
          }
          if (key === "timestamp" && value) {
            return new Date(value)
          }
          return value
        })

        // Make sure we have the chat with the specified ID
        if (parsedChats) {
          return parsedChats
        }
      } catch (error) {
        console.error("Error parsing chats from localStorage:", error)
      }
    }
  }
  return sampleChats
}

// Function to save chat data to localStorage
const saveChatData = (chatData: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("chatData", JSON.stringify(chatData))
  }
}

// Initialize localStorage with chat data if not already present
const initializeChatData = () => {
  if (typeof window !== "undefined") {
    const existingData = localStorage.getItem("chatData")
    if (!existingData) {
      saveChatData(sampleChats)
    }
  }
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  const [chat, setChat] = useState<any>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isExpired, setIsExpired] = useState(false)
  const [detailsExpanded, setDetailsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat data in localStorage when the component mounts
  useEffect(() => {
    initializeChatData()

    // Add a small delay to ensure localStorage is initialized
    setTimeout(() => {
      loadChat()
    }, 100)
  }, [id])

  // Load the chat data for the current ID
  const loadChat = () => {
    const chats = getChatData()
    const currentChat = chats[id]

    if (currentChat) {
      setChat(currentChat)

      // Check if chat is expired - Add null check for plan and expiresAt
      if (currentChat.plan && currentChat.plan.expiresAt) {
        const now = new Date()
        if (now > currentChat.plan.expiresAt) {
          setIsExpired(true)
        } else {
          setIsExpired(false)
        }
      }
    } else {
      router.push("/inbox")
      toast({
        description: "Chat not found",
        variant: "destructive",
      })
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chat?.messages])

  const handleSendMessage = (message: string, isEmoji = false) => {
    if ((!message.trim() && !isEmoji) || !chat) return

    const newMsg = {
      id: `new-${Date.now()}`,
      sender: {
        id: "u1",
        name: "You",
        isCurrentUser: true,
      },
      content: message,
      timestamp: new Date(),
      isEmoji,
      reactions: [],
    }

    // Update local state
    setChat((prevChat: any) => {
      const updatedChat = {
        ...prevChat,
        messages: [...prevChat.messages, newMsg],
      }

      // Update in localStorage
      const allChats = getChatData()
      allChats[id] = updatedChat
      saveChatData(allChats)

      return updatedChat
    })

    setNewMessage("")

    // Scroll to bottom after sending message
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleReaction = (messageId: string, emoji: string) => {
    if (!chat) return

    setChat((prevChat: any) => {
      const updatedMessages = prevChat.messages.map((message: any) => {
        if (message.id === messageId) {
          // Check if user already reacted with this emoji
          const existingReaction = message.reactions?.find((r: any) => r.userId === "u1" && r.emoji === emoji)

          if (existingReaction) {
            // Remove the reaction
            return {
              ...message,
              reactions: message.reactions?.filter((r: any) => !(r.userId === "u1" && r.emoji === emoji)),
            }
          } else {
            // Add the reaction
            return {
              ...message,
              reactions: [...(message.reactions || []), { emoji, userId: "u1", userName: "You" }],
            }
          }
        }
        return message
      })

      const updatedChat = {
        ...prevChat,
        messages: updatedMessages,
      }

      // Update in localStorage
      const allChats = getChatData()
      allChats[id] = updatedChat
      saveChatData(allChats)

      return updatedChat
    })
  }

  if (!chat || !chat.plan) {
    return (
      <AppLayout>
        <div className="flex flex-col h-[calc(100vh-8rem)] items-center justify-center">
          <p>Loading conversation...</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Chat Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border">
          <div className="flex items-center p-3">
            <Button variant="ghost" size="icon" className="mr-2 rounded-full" onClick={() => router.push("/inbox")}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-medium truncate">{chat.plan.activity}</h1>
            </div>
          </div>
        </div>

        {/* Plan Details Toggle */}
        <div className="bg-white border-b border-sage-100 px-4 py-2 flex justify-between items-center">
          <button
            onClick={() => setDetailsExpanded(!detailsExpanded)}
            className="text-sm text-sage-600 flex items-center hover:text-sage-800 transition-colors"
          >
            {detailsExpanded ? (
              <>
                <span>Hide Event Details</span>
                <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                <span>View Event Details</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
          <span className="text-sm font-medium text-sage-700 truncate max-w-[200px]">{chat.plan.activity}</span>
        </div>

        {/* Plan Details (Collapsible) */}
        {detailsExpanded && <PlanChatHeader plan={chat.plan} isExpired={isExpired} />}

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-sage-50"
          style={{ height: detailsExpanded ? "calc(100% - 40px)" : "calc(100% - 40px)" }}
        >
          {chat.messages.map((message: any) => (
            <ChatMessage key={message.id} message={message} onReact={handleReaction} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-3 border-t borderr-border bg-background">
          <MessageInput
            value={newMessage}
            onChange={setNewMessage}
            onSend={handleSendMessage}
            disabled={isExpired}
            placeholder={isExpired ? "This plan has expired" : "Type a message..."}
          />
        </div>
      </div>
    </AppLayout>
  )
}
