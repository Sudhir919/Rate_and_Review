"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "@/lib/session"
import { User, LogOut } from "lucide-react"

export function UserAuth() {
  const { session, login, logout } = useSession()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || (!isLoginMode && !name.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || email.split("@")[0],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to authenticate")
      }

      const user = await response.json()
      login(user)

      toast({
        title: "Success",
        description: `Welcome${user.name ? `, ${user.name}` : ""}!`,
      })

      setEmail("")
      setName("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (session) {
    return (
      <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-sm">{session.name}</p>
          <p className="text-xs text-muted-foreground">{session.email}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={logout} className="h-8 w-8 p-0">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{isLoginMode ? "Sign In" : "Create Account"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {!isLoginMode && (
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Please wait..." : isLoginMode ? "Sign In" : "Create Account"}
          </Button>

          <Button type="button" variant="ghost" onClick={() => setIsLoginMode(!isLoginMode)} className="w-full">
            {isLoginMode ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
