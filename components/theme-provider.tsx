"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  // Add transition styles to the document when the component mounts
  useEffect(() => {
    // Add transition styles to all elements
    document.documentElement.style.transition = "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease"

    // Add transition styles to common elements that might change with theme
    const styleElement = document.createElement("style")
    styleElement.textContent = `
      * {
        transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease !important;
      }
    `
    document.head.appendChild(styleElement)

    // Cleanup function
    return () => {
      document.documentElement.style.transition = ""
      document.head.removeChild(styleElement)
    }
  }, [])

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Prevent theme flash by not rendering until client-side
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const ThemeContext = createContext<{
  theme: string | undefined
  setTheme: (theme: string) => void
}>({
  theme: undefined,
  setTheme: () => null,
})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
