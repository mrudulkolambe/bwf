"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminAuthService from "../services/admin.auth.service"
import { getToken } from "@/lib/token"
import { ShieldAlert, LogIn, Mail, Phone, Lock } from "lucide-react"
import InputField from "@/components/app/input-field"
import { Button } from "@/components/ui/button"

const adminAuthService = new AdminAuthService()

export default function AdminLoginPage() {
    const [step, setStep] = useState<"phone" | "verify">("phone")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [otpCode, setOtpCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const router = useRouter()

    useEffect(() => {
        // If already logged in, go straight to dashboard
        if (getToken()) {
            router.replace("/admin/dashboard")
        }
    }, [router])

    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg("")
        
        if (!phone || !email) {
            setErrorMsg("Phone number and email address are required")
            return
        }

        await adminAuthService.requestOTP({
            setLoading,
            phone,
            email,
            onSuccess: (message) => {
                alert(message || "Verification code sent to your email")
                setStep("verify")
            },
            onError: (message) => {
                setErrorMsg(message || "Failed to send OTP code")
            }
        })
    }

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg("")

        if (!otpCode) {
            setErrorMsg("Verification code is required")
            return
        }

        await adminAuthService.verifyOTP({
            setLoading,
            phone,
            email,
            code: otpCode,
            onSuccess: (data) => {
                router.push("/admin/dashboard")
            },
            onError: (message) => {
                setErrorMsg(message || "Invalid verification code")
            }
        })
    }

    return (
        <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-950 animate-in fade-in duration-500">
            <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xl rounded-2xl p-8 space-y-6">
                
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 mb-2">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Admin Portal
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {step === "phone" 
                            ? "Enter your phone and email to receive an OTP code" 
                            : `Enter the 6-digit OTP code sent to ${email}`
                        }
                    </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div className="p-3.5 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-lg flex items-center gap-2">
                        <span className="font-medium">{errorMsg}</span>
                    </div>
                )}

                {/* Form */}
                {step === "phone" ? (
                    <form onSubmit={handleRequestOTP} className="space-y-4">
                        <InputField
                            id="phone"
                            label="Phone Number"
                            type="text"
                            placeholder="e.g. 9999999999"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        <InputField
                            id="email"
                            label="Email Address"
                            type="email"
                            placeholder="e.g. admin@bwf.connect"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button
                            type="submit"
                            disabled={loading || !phone || !email}
                            className="w-full h-12 mt-4 font-semibold"
                            loading={loading}
                        >
                            <LogIn className="w-4 h-4 mr-2" />
                            Continue
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <InputField
                            id="otpCode"
                            label="Verification Code"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                        />

                        <Button
                            type="submit"
                            disabled={loading || !otpCode}
                            className="w-full h-12 mt-4 font-semibold animate-pulse"
                            loading={loading}
                        >
                            Verify & Sign In
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setStep("phone")}
                            className="w-full h-10 text-xs text-zinc-500"
                        >
                            Go Back
                        </Button>
                    </form>
                )}

                {/* Info Footer */}
                <div className="pt-2 text-center text-xs text-zinc-400">
                    <p>
                        Need assistance? Contact{" "}
                        <a 
                            href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE?.replace(/\s+/g, '')}`}
                            className="font-medium hover:underline text-zinc-600 dark:text-zinc-300"
                        >
                            Support
                        </a>
                    </p>
                    <p className="mt-1.5 opacity-60">
                        Default dev credentials: 9999999999 / admin@bwf.connect
                    </p>
                </div>
            </div>
            
            <div className="mt-8 opacity-20 hover:opacity-30 transition-opacity">
                <img src="/bwf.svg" alt="BWF" className="h-4" />
            </div>
        </div>
    )
}
