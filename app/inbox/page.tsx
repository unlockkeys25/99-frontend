"use client"

import { useState, useEffect } from "react"
import { AppLayout } from "@/components/app-layout"
import { ChatPreview } from "@/components/chat-preview"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

// Update the chats data to include participants information for direct messages
const chats = [
  {
    id: "1",
    name: "Morning Coffee ☕",
    avatar: undefined,
    lastMessage: "I'll be there in 10 minutes",
    time: "10:23 AM",
    unread: 2,
    planRelated: true,
    planDetails: {
      activity: "Morning Coffee ☕",
      time: "Today, 10:30 AM",
      expiresAt: new Date(Date.now() + 3600000 * 2), // 2 hours from now
    },
  },
  {
    id: "2",
    name: "Walk & Chai? 🍵",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Sounds good to me!",
    time: "Yesterday",
    unread: 0,
    planRelated: false,
    planDetails: {
      activity: "Walk & Chai? 🍵",
      time: "Tomorrow, 4:00 PM",
      expiresAt: new Date(Date.now() + 3600000 * 24 * 2), // 2 days from now
      participants: [
        {
          id: "u3",
          name: "Alex",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
      ],
    },
  },
  {
    id: "3",
    name: "Movie Night 🎬",
    avatar: undefined,
    lastMessage: "🍿",
    time: "Yesterday",
    unread: 5,
    planRelated: true,
    planDetails: {
      activity: "Movie Night 🎬",
      time: "Tomorrow, 7:00 PM",
      expiresAt: new Date(Date.now() + 3600000 * 24 + 1800000), // Tomorrow + 30 minutes
    },
  },
  {
    id: "4",
    name: "Dinner Plans? 🍽️",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I'm in quiet mode today, maybe tomorrow?",
    time: "Monday",
    unread: 0,
    planRelated: false,
    planDetails: {
      activity: "Dinner Plans? 🍽️",
      time: "Friday, 7:30 PM",
      expiresAt: new Date(Date.now() + 3600000 * 24 * 3), // 3 days from now
      participants: [
        {
          id: "u2",
          name: "Jamie",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
      ],
    },
  },
  {
    id: "5",
    name: "Book Club 📚",
    avatar: undefined,
    lastMessage: "The meeting is postponed to next week",
    time: "Sunday",
    unread: 0,
    planRelated: true,
    planDetails: {
      activity: "Book Club 📚",
      time: "Next Tuesday, 6:30 PM",
      expiresAt: new Date(Date.now() + 3600000 * 24 * 6), // 6 days from now
    },
  },
  {
    id: "6",
    name: "Park Picnic 🌿",
    avatar: undefined,
    lastMessage: "🌞",
    time: "2 days ago",
    unread: 0,
    planRelated: true,
    planDetails: {
      activity: "Park Picnic 🌿",
      time: "Saturday, 1:00 PM",
      expiresAt: new Date(Date.now() - 3600000), // 1 hour ago (expired)
    },
  },
  {
    id: "7",
    name: "Coffee Chat ☕",
    avatar: undefined,
    lastMessage: "🥹 Can't wait!",
    time: "6 hours ago",
    unread: 0,
    planRelated: false,
    planDetails: {
      activity: "Coffee Chat ☕",
      time: "Friday, 3:00 PM",
      expiresAt: new Date(Date.now() + 3600000 * 72 + 1800000), // 3 days + 30 minutes
      participants: [
        {
          id: "u5",
          name: "Morgan",
          avatar: "/placeholder.svg?height=40&width=40",
          isCurrentUser: false,
        },
        {
          id: "u1",
          name: "You",
          isCurrentUser: true,
        },
      ],
    },
  },
]

// Store chats in localStorage for persistence between pages
const saveChatsToStorage = (chatsData: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("chatData", JSON.stringify(chatsData))
  }
}

// Initialize localStorage with chat data if not already present
const initializeChatsInStorage = () => {
  if (typeof window !== "undefined" && !localStorage.getItem("chatData")) {
    saveChatsToStorage(chats)
  }
}

export default function InboxPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()

  // Initialize chat data in localStorage when the component mounts
  useEffect(() => {
    initializeChatsInStorage()
  }, [])

  // Get chats from localStorage or use the default data
  const getChats = () => {
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
          return parsedChats
        } catch (error) {
          console.error("Error parsing chats from localStorage:", error)
        }
      }
    }
    return chats
  }

  // Filter chats based on search query and active tab
  const filteredChats = getChats().filter((chat) => {
    const matchesSearch = chat.name.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") {
      return matchesSearch
    } else if (activeTab === "plans") {
      return matchesSearch && chat.planRelated
    } else {
      return matchesSearch && !chat.planRelated
    }
  })

  // Handle chat selection
  const handleSelectChat = (chatId: string) => {
    // Mark the chat as read by updating the unread count to 0
    if (typeof window !== "undefined") {
      const storedChats = localStorage.getItem("chatData")
      if (storedChats) {
        try {
          const parsedChats = JSON.parse(storedChats)
          const updatedChats = parsedChats.map((chat: any) => {
            if (chat.id === chatId) {
              return { ...chat, unread: 0 }
            }
            return chat
          })
          saveChatsToStorage(updatedChats)
        } catch (error) {
          console.error("Error updating chat read status:", error)
        }
      }
    }

    // Navigate to the chat detail page
    router.push(`/inbox/${chatId}`)
  }

  return (
    <AppLayout>
      <div className="container max-w-md mx-auto px-4 py-6 bg-background min-h-screen">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Inbox</h1>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations"
            className="pl-9 rounded-full border-sage-200 focus:border-primary focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="all" className="mb-4" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 bg-white/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-white dark:text-black">
              All
            </TabsTrigger>
            <TabsTrigger value="plans" className="data-[state=active]:bg-white dark:text-black">
              Plans
            </TabsTrigger>
            <TabsTrigger value="direct" className="data-[state=active]:bg-white dark:text-black">
              Direct
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => <ChatPreview key={chat.id} chat={chat} onSelectChat={handleSelectChat} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-white rounded-lg shadow-sm">
                <p>No conversations found</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="plans" className="space-y-3">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => <ChatPreview key={chat.id} chat={chat} onSelectChat={handleSelectChat} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-white rounded-lg shadow-sm">
                <p>No plan conversations found</p>
                <p className="text-sm mt-1">Respond to plans to start chatting</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="direct" className="space-y-3">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => <ChatPreview key={chat.id} chat={chat} onSelectChat={handleSelectChat} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-white rounded-lg shadow-sm">
                <p>No direct messages found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
