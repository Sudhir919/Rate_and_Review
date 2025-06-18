"use client"

import { useState, useEffect } from "react"

export interface UserSession {
  id: number
  email: string
  name: string
}

export function useSession() {
  const [session, setSession] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedSession = localStorage.getItem("userSession")
    if (savedSession) {
      setSession(JSON.parse(savedSession))
    }
    setLoading(false)
  }, [])

  const login = (user: UserSession) => {
    setSession(user)
    localStorage.setItem("userSession", JSON.stringify(user))
  }

  const logout = () => {
    setSession(null)
    localStorage.removeItem("userSession")
  }

  return { session, login, logout, loading }
}
