"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authApi, type User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (user_name: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    console.log("Checking authentication...")
    try {
      const userData = await authApi.verify()
      console.log("Auth check result:", userData)
      setUser(userData)
    } catch (error) {
      console.log("Auth check error:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (user_name: string, password: string) => {
    console.log("Login function called")
    try {
      // Login returns user data directly now
      const loginResult = await authApi.login({ user_name, password })
      console.log("Login result:", loginResult)

      // Get complete user data from verify (includes user ID)
      const userData = await authApi.verify()
      console.log("User data after login:", userData)

      // Merge login data with verify data for complete user info
      const completeUser: User = {
        id: userData?.id || "",
        user_name: loginResult.user_name,
        email: loginResult.email,
        isEmailVerified: loginResult.isEmailVerified,
      }

      console.log("Complete user data:", completeUser)
      setUser(completeUser)
    } catch (error) {
      console.log("Login error in context:", error)
      throw error
    }
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
