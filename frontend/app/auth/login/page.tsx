"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import InputField from "@/components/app/input-field"
import { Button } from "@/components/ui/button"
import { useRegistration } from "../context/registration-context"
import PartnerAuthService from "../../login/services/partner.auth.service"
import { setToken } from "@/lib/token"

const partnerAuthService = new PartnerAuthService()

export default function LoginPage() {
    const { phone } = useRegistration()
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async () => {
        if (!code) return

        await partnerAuthService.login({
            setLoading,
            phone,
            code,
            onSuccess: (data) => {
                console.log(data)
                if (data.token) {
                    setToken(data.token)
                }
                if (!data.partner.onboarding.basic) {
                    router.push("/auth/basic")
                } else if (!data.partner.onboarding.business) {
                    router.push("/auth/business")
                } else if (!data.partner.onboarding.completed) {
                    router.push("/auth/verify")
                } else {
                    router.push("/dashboard")
                }
            },
            onError: (message) => {
                console.error(message)
                alert(message)
            }
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="mb-2">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground">
                    Code sent to admin. Contact{" "}
                    <a 
                        href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE?.replace(/\s+/g, '')}`}
                        className="font-semibold text-foreground hover:underline whitespace-nowrap"
                    >
                        {process.env.NEXT_PUBLIC_SUPPORT_PHONE}
                    </a>
                </p>
            </div>

            <InputField
                id="phone"
                label="Phone number"
                type="text"
                value={phone}
                disabled={true}
                placeholder="No phone number provided"
                onChange={() => { }}
            />

            <InputField
                id="code"
                label="Verification code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />

            <Button
                onClick={handleLogin}
                disabled={loading || !code}
                className="w-full h-12 mt-2"
            >
                {loading ? "Verifying..." : "Login"}
            </Button>

            <Button
                variant="ghost"
                onClick={() => router.push("/auth/phone")}
                className="w-full h-12"
            >
                Change phone number
            </Button>
        </div>
    )
}
