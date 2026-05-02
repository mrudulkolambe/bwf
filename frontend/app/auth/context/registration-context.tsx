"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import PartnerAuthService from "../../login/services/partner.auth.service"
import { getToken } from "@/lib/token"

const partnerAuthService = new PartnerAuthService()

interface RegistrationContextType {
    role: "partner" | "customer" | "admin" | null
    phone: string
    basicDetails: {
        firstname: string
        lastname: string
        email: string
    }
    businessDetails: {
        category: string
        name: string
        address: string
        selectedTags: string[]
    }
    loading: boolean
    setRole: (role: "partner" | "customer" | "admin" | null) => void
    setPhone: (phone: string) => void
    updateBasicDetails: (details: Partial<RegistrationContextType["basicDetails"]>) => void
    updateBusinessDetails: (details: Partial<RegistrationContextType["businessDetails"]>) => void
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [role, setRole] = useState<RegistrationContextType["role"]>("partner")
    const [phone, setPhone] = useState("")
    const [basicDetails, setBasicDetails] = useState({
        firstname: "",
        lastname: "",
        email: ""
    })
    const [businessDetails, setBusinessDetails] = useState({
        category: "",
        name: "",
        address: "",
        selectedTags: [] as string[]
    })

    const updateBasicDetails = (details: Partial<RegistrationContextType["basicDetails"]>) => {
        setBasicDetails(prev => ({ ...prev, ...details }))
    }

    const updateBusinessDetails = (details: Partial<RegistrationContextType["businessDetails"]>) => {
        setBusinessDetails(prev => ({ ...prev, ...details }))
    }

    const fetchProfile = async () => {
        const token = getToken()
        if (!token) {
            setLoading(false)
            // If no token and not on role/phone/login pages, might want to redirect
            return
        }

        await partnerAuthService.getProfile({
            setLoading,
            onSuccess: (partner) => {
                setPhone(partner.phone)
                setBasicDetails({
                    firstname: partner.firstname || "",
                    lastname: partner.lastname || "",
                    email: partner.email || ""
                })
                setBusinessDetails({
                    category: partner.businessCategory || "",
                    name: partner.business?.name || "",
                    address: partner.business?.location || "",
                    selectedTags: partner.business?.tags || []
                })

                // Redirect based on onboarding status
                if (pathname.startsWith('/auth')) {
                    if (!partner.onboarding?.basic) {
                        router.replace("/auth/basic")
                    } else if (!partner.onboarding?.business) {
                        router.replace("/auth/business")
                    } else if (!partner.onboarding?.completed) {
                        router.replace("/auth/verify")
                    } else {
                        router.replace("/dashboard")
                    }
                }
            },
            onError: (err) => {
                console.error("Failed to fetch profile:", err)
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    return (
        <RegistrationContext.Provider value={{
            role, setRole,
            phone, setPhone,
            basicDetails, updateBasicDetails,
            businessDetails, updateBusinessDetails,
            loading
        }}>
            {children}
        </RegistrationContext.Provider>
    )
}

export const useRegistration = () => {
    const context = useContext(RegistrationContext)
    if (!context) {
        throw new Error("useRegistration must be used within a RegistrationProvider")
    }
    return context
}
