"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import InputField from "@/components/app/input-field"
import { Button } from "@/components/ui/button"
import { useRegistration } from "../context/registration-context"
import PartnerService from "../../login/services/partner.service"

const partnerService = new PartnerService()

export default function VerifyPage() {
    const { phone } = useRegistration()
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleVerify = async () => {
        if (!code) return

        await partnerService.verifyCode({
            setLoading,
            code,
            onSuccess: () => {
                router.push("/dashboard")
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
                <h1 className="text-2xl font-bold">Verify Account</h1>
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
                placeholder="000000"
                id="code"
                label="Verification Code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />

            <Button 
                onClick={handleVerify} 
                disabled={loading || code.length < 4}
                className="w-full h-12 mt-4"
            >
                Verify & Continue
            </Button>
            <p className="text-sm text-center text-muted-foreground mt-2">
                Didn't receive a code? <button className="text-primary font-medium">Resend</button>
            </p>
        </div>
    )
}
