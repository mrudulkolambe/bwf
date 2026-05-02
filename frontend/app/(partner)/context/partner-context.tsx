"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getToken } from "@/lib/token"
import PartnerAuthService from "../../login/services/partner.auth.service"

const partnerAuthService = new PartnerAuthService()

interface PartnerContextType {
    partner: any | null
    loading: boolean
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined)

export const PartnerProvider = ({ children }: { children: React.ReactNode }) => {
    const [partner, setPartner] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkAuth = async () => {
            const token = getToken()
            if (!token) {
                router.replace("/auth/role")
                setLoading(false)
                return
            }

            // If we have a token, fetch the profile to ensure it's valid and check onboarding
            await partnerAuthService.getProfile({
                setLoading,
                onSuccess: (data) => {
                    setPartner(data)

                    // Onboarding logic (same as proxy and registration-context)
                    const onboarding = data.onboarding
                    if (!onboarding?.basic) {
                        router.replace("/auth/basic")
                    } else if (!onboarding?.business) {
                        router.replace("/auth/business")
                    } else if (!onboarding?.completed) {
                        router.replace("/auth/verify")
                    }
                    // Else, they are allowed to stay in (partner) group (e.g. /dashboard)
                },
                onError: (err) => {
                    console.error("Auth check failed:", err)
                    router.replace("/auth/role")
                    setLoading(false)
                }
            })
        }

        checkAuth()
    }, [])

    return (
        <PartnerContext.Provider value={{ partner, loading }}>
            {!loading && partner ? children : (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm text-muted-foreground animate-pulse">Authenticating...</p>
                    </div>
                </div>
            )}
        </PartnerContext.Provider>
    )
}

export const usePartner = () => {
    const context = useContext(PartnerContext)
    if (!context) {
        throw new Error("usePartner must be used within a PartnerProvider")
    }
    return context
}
