"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hour, setHour] = useState<number>(12)
  const [minute, setMinute] = useState<number>(0)
  const [period, setPeriod] = useState<"AM" | "PM">("PM")
  const [internalValue, setInternalValue] = useState(value)

  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)

  // Parse initial value if provided - only run once on mount or when value changes externally
  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value)
      const match = value.match(/(\d+):(\d+)\s+(AM|PM)/)
      if (match) {
        setHour(Number.parseInt(match[1], 10))
        setMinute(Number.parseInt(match[2], 10))
        setPeriod(match[3] as "AM" | "PM")
      }
    }
  }, [value, internalValue])

  // Update parent component when time changes - but only when user makes a selection
  const updateParentValue = () => {
    const formattedHour = hour.toString().padStart(2, "0")
    const formattedMinute = minute.toString().padStart(2, "0")
    const newValue = `${formattedHour}:${formattedMinute} ${period}`

    if (newValue !== internalValue) {
      setInternalValue(newValue)
      onChange(newValue)
    }
  }

  // Only update parent when a selection is made
  useEffect(() => {
    updateParentValue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute, period])

  // Scroll to center the selected value - only run once on mount
  useEffect(() => {
    if (hourRef.current) {
      const selectedHour = hourRef.current.querySelector('[data-selected="true"]')
      if (selectedHour) {
        selectedHour.scrollIntoView({ block: "center" })
      }
    }
    if (minuteRef.current) {
      const selectedMinute = minuteRef.current.querySelector('[data-selected="true"]')
      if (selectedMinute) {
        selectedMinute.scrollIntoView({ block: "center" })
      }
    }
  }, [])

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const minutes = Array.from({ length: 60 }, (_, i) => i)

  return (
    <div className={cn("flex rounded-lg border border-sage-200 overflow-hidden", className)}>
      {/* Hours */}
      <div
        ref={hourRef}
        className="flex-1 h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-sage-200 scrollbar-track-transparent"
      >
        <div className="py-4">
          {hours.map((h) => (
            <div
              key={h}
              data-selected={h === hour}
              className={cn(
                "py-2 px-4 text-center cursor-pointer transition-colors",
                h === hour ? "bg-primary/10 text-primary-foreground font-medium" : "hover:bg-sage-50",
              )}
              onClick={() => setHour(h)}
            >
              {h.toString().padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center text-sage-400 px-1">:</div>

      {/* Minutes */}
      <div
        ref={minuteRef}
        className="flex-1 h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-sage-200 scrollbar-track-transparent"
      >
        <div className="py-4">
          {minutes.map((m) => (
            <div
              key={m}
              data-selected={m === minute}
              className={cn(
                "py-2 px-4 text-center cursor-pointer transition-colors",
                m === minute ? "bg-primary/10 text-primary-foreground font-medium" : "hover:bg-sage-50",
              )}
              onClick={() => setMinute(m)}
            >
              {m.toString().padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>

      {/* AM/PM */}
      <div className="flex flex-col border-l border-sage-200">
        <div
          className={cn(
            "py-2 px-4 text-center cursor-pointer transition-colors",
            period === "AM" ? "bg-primary/10 text-primary-foreground font-medium" : "hover:bg-sage-50",
          )}
          onClick={() => setPeriod("AM")}
        >
          AM
        </div>
        <div
          className={cn(
            "py-2 px-4 text-center cursor-pointer transition-colors",
            period === "PM" ? "bg-primary/10 text-primary-foreground font-medium" : "hover:bg-sage-50",
          )}
          onClick={() => setPeriod("PM")}
        >
          PM
        </div>
      </div>
    </div>
  )
}
