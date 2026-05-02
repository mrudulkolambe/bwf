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
        coordinates: { lat: number; lng: number } | null
        selectedTags: string[]
    }
    loading: boolean
    partnerData: any | null
    setRole: (role: "partner" | "customer" | "admin" | null) => void
    setPhone: (phone: string) => void
    updateBasicDetails: (details: Partial<RegistrationContextType["basicDetails"]>) => void
    updateBusinessDetails: (details: Partial<RegistrationContextType["businessDetails"]>) => void
    setPartnerData: (data: any) => void
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined)

export const RegistrationProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [partnerData, setPartnerData] = useState<any>(null)
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
        coordinates: null as { lat: number; lng: number } | null,
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
            return
        }

        await partnerAuthService.getProfile({
            setLoading,
            onSuccess: (partner) => {
                setPartnerData(partner)
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
                    coordinates: partner.business?.coordinates || null,
                    selectedTags: partner.business?.tags || []
                })
            },
            onError: (err) => {
                console.error("Failed to fetch profile:", err)
                setLoading(false)
            }
        })
    }

    useEffect(() => {
        const publicRoutes = [
            '/',
            '/auth/role',
            '/auth/phone',
            '/auth/login',
            '/auth/basic',
        ];

        const isPublicRoute = publicRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'));

        if (isPublicRoute) {
            setLoading(false);
            return;
        }

        const token = getToken();
        if (!token) {
            router.replace('/auth/role');
            setLoading(false);
            return;
        }

        if (!partnerData) {
            fetchProfile();
        } else {
            const onboarding = partnerData.onboarding;
            if (!onboarding?.basic) {
                if (pathname !== '/auth/basic') {
                    router.replace("/auth/basic")
                }
            } else if (!onboarding?.business) {
                if (pathname !== '/auth/business') {
                    router.replace("/auth/business")
                }
            } else if (!onboarding?.completed) {
                if (pathname !== '/auth/verify') {
                    router.replace("/auth/verify")
                }
            } else {
                if (pathname.startsWith('/auth')) {
                    router.replace("/dashboard")
                }
            }
            setLoading(false);
        }
    }, [partnerData]);

    return (
        <RegistrationContext.Provider value={{
            role, setRole,
            phone, setPhone,
            basicDetails, updateBasicDetails,
            businessDetails, updateBusinessDetails,
            loading, partnerData, setPartnerData
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
