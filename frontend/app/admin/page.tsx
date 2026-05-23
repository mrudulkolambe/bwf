"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/token"

export default function AdminRootPage() {
    const router = useRouter()

    useEffect(() => {
        const token = getToken()
        if (token) {
            router.replace("/admin/dashboard")
        } else {
            router.replace("/login?role=admin")
        }
    }, [router])

    return null
}
