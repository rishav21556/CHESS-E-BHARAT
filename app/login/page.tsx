"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

/*
Baby Blue
#68bbe3

Blue Grotto
#0e86d4

Blue
#055c9d

Navy Blue
#003060
*/

export default function LoginPage() {
  return (
    <div className="bg-[url('/Main-background.jpg')] bg-cover h-[100vh] w-full bg-center ">
      <div className="flex flex-col items-center h-full bg-black/50">
        <div className="mt-5">
          <img src="/Logo.png" alt="Logo" className="w-auto h-32" />
        </div>
        <div className="flex flex-col mt-2 bg-[#003060]/50 px-10 py-5 rounded-lg gap-2">
          <input type="text" autoComplete="off" placeholder="Email" className="bg-transparent border-[1px] border-[#055c9d] rounded-lg pl-2 pr-10 py-5 text-white placeholder:text-white/70
          focus:outline-none focus:ring-2 focus:ring-[#68bbe3] focus:border-transparent" />

          <input type="password" autoComplete="off" placeholder="Password" className="bg-transparent border-[1px] border-[#055c9d] rounded-lg pl-2 pr-10 py-5 text-white placeholder:text-white/70
          focus:outline-none focus:ring-2 focus:ring-[#68bbe3] focus:border-transparent" />

          <button className="bg-[#055c9d] text-white py-2 px-4 rounded-lg hover:bg-[#3f92bc]">Login</button>

          <Link href="/register" className="text-white/70 hover:text-white text-sm mt-2 text-center">Don't have an account? Sign up</Link>
        </div>
      </div>
    </div>
  )
}
