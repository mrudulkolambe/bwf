"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import InputField from "@/components/app/input-field"
import { Button } from "@/components/ui/button"
import { useRegistration } from "../context/registration-context"
import PartnerAuthService from "../../login/services/partner.auth.service"
import AdminAuthService from "../../admin/services/admin.auth.service"

const partnerAuthService = new PartnerAuthService()
const adminAuthService = new AdminAuthService()

export default function PhonePage() {
    const { phone, setPhone, role, basicDetails, updateBasicDetails } = useRegistration()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleContinue = async () => {
        if (!phone) return

        if (role === "admin") {
            const email = basicDetails.email
            if (!email) {
                alert("Please enter your email address")
                return
            }
            await adminAuthService.requestOTP({
                setLoading,
                phone,
                email,
                onSuccess: (message) => {
                    alert(message || "Verification code sent to your email")
                    router.push("/auth/login")
                },
                onError: (message) => {
                    alert(message || "Failed to request verification code")
                }
            })
        } else {
            await partnerAuthService.checkPhone({
                setLoading,
                phoneNumber: phone,
                onSuccess: (data) => {
                    if (data.exists) {
                        router.push("/auth/login")
                    } else {
                        router.push("/auth/basic")
                    }
                },
                onError: (message) => {
                    console.error("Phone check error:", message)
                    if (message.includes("not found") || message.includes("exist")) {
                        router.push("/auth/basic")
                    }
                }
            })
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="mb-2">
                <h1 className="text-2xl font-bold">
                    {role === "admin" ? "Admin Authentication" : "Enter your phone number"}
                </h1>
                <p className="text-muted-foreground">
                    {role === "admin" 
                        ? "Enter your phone and email to receive an OTP code" 
                        : "We will send you a verification code"
                    }
                </p>
            </div>
            
            <InputField
                placeholder="Enter your phone number"
                id="phone"
                label="Phone number"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            {role === "admin" && (
                <InputField
                    placeholder="Enter your email address"
                    id="email"
                    label="Email address"
                    type="email"
                    value={basicDetails.email}
                    onChange={(e) => updateBasicDetails({ email: e.target.value })}
                />
            )}

            <Button 
                onClick={handleContinue} 
                disabled={loading || !phone || (role === "admin" && !basicDetails.email)}
                className="w-full h-12"
            >
                {loading ? "Processing..." : "Continue"}
            </Button>
        </div>
    )
}
