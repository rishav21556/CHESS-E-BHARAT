const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export interface RegisterData {
  user_name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginData {
  user_name: string
  password: string
}

export interface User {
  id: string
  user_name: string
  email: string
  isEmailVerified?: boolean
}

// Backend response interfaces
interface LoginResponse {
  user_name: string
  email: string
  isEmailVerified: boolean
  token: string
}

interface VerifyResponse {
  sub: string
  username: string
  iat: number
  exp: number
}

export const authApi = {
  async register(data: RegisterData) {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Registration failed" }))
      throw new Error(error.message || "Registration failed")
    }

    return response.json()
  },

  async login(data: LoginData): Promise<User> {
    console.log("Attempting login with:", data)
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })

    console.log("Login response status:", response.status)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Login failed" }))
      console.log("Login error:", error)
      throw new Error(error.message || "Login failed")
    }

    const result: LoginResponse = await response.json()
    console.log("Login success result:", result)

    // Transform login response to our User interface
    return {
      id: "", // We'll get this from verify
      user_name: result.user_name,
      email: result.email,
      isEmailVerified: result.isEmailVerified,
    }
  },

  async verify(): Promise<User | null> {
    try {
      console.log("Verifying authentication...")
      const response = await fetch(`${BASE_URL}/auth/verify`, {
        method: "POST",
        credentials: "include",
      })

      console.log("Verify response status:", response.status)

      if (!response.ok) {
        console.log("Verify failed - not authenticated")
        return null
      }

      const result: VerifyResponse = await response.json()
      console.log("Verify success result:", result)

      // Transform verify response to our User interface
      return {
        id: result.sub,
        user_name: result.username,
        email: "", // Not provided by verify endpoint
      }
    } catch (error) {
      console.log("Verify error:", error)
      return null
    }
  },

  async logout() {
    try {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
      return response.ok
    } catch (error) {
      return false
    }
  },
}

export const validatePassword = (password: string): string[] => {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }

  return errors
}
