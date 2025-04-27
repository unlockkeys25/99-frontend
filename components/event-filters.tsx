"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function EventFilters() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden transition-all duration-300">
      {/* Filter Header - Always visible */}
      <Button
        variant="ghost"
        className="w-full py-2 px-4 flex justify-center items-center h-auto"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-bold text-black">Filters</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 ml-2 text-sage-500" />
        ) : (
          <ChevronDown className="h-4 w-4 ml-2 text-sage-500" />
        )}
      </Button>

      {/* Filter Content - Expandable */}
      <div
        className={cn(
          "px-4 pb-4 space-y-4 overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-sage-600">Mood Tag</label>
            <Select>
              <SelectTrigger className="rounded-full text-sm h-9">
                <SelectValue placeholder="Any mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any mood</SelectItem>
                <SelectItem value="chill">Chill</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="deep-talk">Deep Talk</SelectItem>
                <SelectItem value="reflective">Reflective</SelectItem>
                <SelectItem value="low-energy">Low Energy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-sage-600">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-full text-sm h-9",
                    !date && "text-muted-foreground",
                  )}
                >
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-sage-600">Time Range</label>
            <Select>
              <SelectTrigger className="rounded-full text-sm h-9">
                <SelectValue placeholder="Any time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any time</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
                <SelectItem value="night">Night</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-sage-600">Location</label>
            <Input placeholder="Any location" className="rounded-full text-sm h-9" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-sage-600">Created by</label>
            <Select>
              <SelectTrigger className="rounded-full text-sm h-9">
                <SelectValue placeholder="Anyone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Anyone</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="men">Men</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-sage-600">Audience Scope</label>
            <Select>
              <SelectTrigger className="rounded-full text-sm h-9">
                <SelectValue placeholder="All events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All events</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
                <SelectItem value="friends-of-friends">Friends of Friends</SelectItem>
                <SelectItem value="public">Public/Local</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 mt-2" size="sm">
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
