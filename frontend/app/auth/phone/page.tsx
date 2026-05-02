"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import InputField from "@/components/app/input-field"
import { Button } from "@/components/ui/button"
import { useRegistration } from "../context/registration-context"
import PartnerAuthService from "../../login/services/partner.auth.service"

const partnerAuthService = new PartnerAuthService()

export default function PhonePage() {
    const { phone, setPhone } = useRegistration()
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleContinue = async () => {
        if (!phone) return

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
                console.error(message)
            }
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="mb-2">
                <h1 className="text-2xl font-bold">Enter your phone number</h1>
                <p className="text-muted-foreground">We will send you a verification code</p>
            </div>
            <InputField
                placeholder="Enter your phone number"
                id="phone"
                label="Phone number"
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Button 
                onClick={handleContinue} 
                disabled={loading || !phone}
                className="w-full h-12"
            >
                {loading ? "Checking..." : "Continue"}
            </Button>
        </div>
    )
}
