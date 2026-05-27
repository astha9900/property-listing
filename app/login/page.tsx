"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Building2 } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        const storedUser = localStorage.getItem("auth_user")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          if (user.role === "admin") {
            router.push("/admin")
          } else if (user.role === "manager") {
            router.push("/manager")
          } else {
            router.push("/")
          }
        } else {
          router.push("/")
        }
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-none bg-card/80 backdrop-blur-xl rounded-[2rem] overflow-hidden">
          <CardHeader className="space-y-2 text-center pb-8 pt-10">
            <div className="mx-auto bg-primary text-primary-foreground p-4 rounded-2xl w-fit mb-4 shadow-lg shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-300">
              <Building2 className="h-10 w-10" />
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Enter your credentials to access your PropFinder account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 px-8">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-12 rounded-xl border-border/50 focus:ring-primary/20 bg-background/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-xl border-border/50 focus:ring-primary/20 bg-background/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20 font-medium text-center">
                  {error}
                </p>
              )}
              <div className="bg-secondary/40 p-5 rounded-2xl border border-secondary/50 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Demo Access</p>
                <div className="text-xs space-y-2 text-muted-foreground font-medium">
                  <div className="flex justify-between border-b border-border/20 pb-1">
                    <span>Admin:</span>
                    <span className="text-foreground">admin@test.com / admin123</span>
                  </div>
                  <div className="flex justify-between border-b border-border/20 pb-1">
                    <span>Manager:</span>
                    <span className="text-foreground">manager@test.com / manager123</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User:</span>
                    <span className="text-foreground">user@test.com / user123</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 px-8 pb-10 pt-4">
              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Sign In"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                New to PropFinder?{" "}
                <Link
                  href="/signup"
                  className="text-primary hover:text-primary/80 transition-colors font-bold underline underline-offset-4 decoration-primary/30"
                >
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
