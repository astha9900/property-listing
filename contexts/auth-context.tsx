"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export type UserRole = "admin" | "manager" | "user"

export interface User {
  email: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User | boolean>
  signup: (email: string, password: string, role: UserRole) => Promise<User | boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users with credentials
const DEMO_USERS = [
  { email: "admin@test.com", password: "admin123", role: "admin" as UserRole },
  { email: "manager@test.com", password: "manager123", role: "manager" as UserRole },
  { email: "user@test.com", password: "user123", role: "user" as UserRole },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("auth_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<User | boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Check against demo users
      const foundUser = DEMO_USERS.find((u) => u.email === email && u.password === password)

      if (foundUser) {
        const userData: User = { email: foundUser.email, role: foundUser.role }
        setUser(userData)
        setIsAuthenticated(true)
        localStorage.setItem("auth_user", JSON.stringify(userData))
        localStorage.setItem("auth_token", `token_${email}`)
        // Returning userData for immediate redirection
        return userData
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const signup = async (email: string, password: string, role: UserRole): Promise<User | boolean> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In a real app, you would check if user exists and make an API call
      // For now, we'll just accept any new signup and store it
      const userData: User = { email, role }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("auth_user", JSON.stringify(userData))
      localStorage.setItem("auth_token", `token_${email}`)
      return userData
    } catch (error) {
      console.error("Signup error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("auth_user")
    localStorage.removeItem("auth_token")
  }

  if (isLoading) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
