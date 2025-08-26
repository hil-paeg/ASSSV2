'use client'

import { useAuth } from "@/contexts/AuthContext"
import MainLayout from "@/components/Layout/MainLayout"
import CalendarPage from "@/pages/CalendarPage"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function CalendarRoutePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <MainLayout>
      <CalendarPage />
    </MainLayout>
  )
}
