"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import RoleButton from "./components/role"
import { Briefcase, ShieldCheck, User } from "lucide-react"
import InputField from "@/components/app/input-field"
import { Button } from "@/components/ui/button"
import SelectField from "@/components/app/select-field"
import PartnerAuthService from "./services/partner.auth.service"
import CategoryService from "./services/category.service"
import AdminAuthService from "../admin/services/admin.auth.service"
import { CategoryResponse } from "./services/types/category.response.types"
import { setToken } from "@/lib/token"

const partnerAuthService = new PartnerAuthService();
const categoryService = new CategoryService();
const adminAuthService = new AdminAuthService();

const LoginPage = () => {
    const router = useRouter()
    const [step, setStep] = useState<"role-selection" | "phone" | "basic" | "business" | "verify" | "login">("role-selection")
    const [role, setRole] = useState<"partner" | "customer" | "admin" | null>(null)
    const [phone, setPhone] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [otpCode, setOtpCode] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [basicDetails, setBasicDetails] = useState({
        firstname: "",
        lastname: "",
        email: ""
    })
    const [businessDetails, setBusinessDetails] = useState({
        category: "",
        name: "",
        address: ""
    })

    const handleBasicChange = (key: keyof typeof basicDetails, value: string) => {
        setBasicDetails(prev => ({ ...prev, [key]: value }))
    }

    const handleBusinessChange = (key: keyof typeof businessDetails, value: string) => {
        setBusinessDetails(prev => ({ ...prev, [key]: value }))
    }

    const fetchCategories = async () => {
        await categoryService.getCategories({
            setLoading: () => { },
            lang: "en",
            onSuccess: (data: CategoryResponse[]) => {
                setCategories(data)
            },
            onError: (message: string) => {
                console.error(message)
            }
        })
    }

    // Direct url check for admin query parameter
    useEffect(() => {
        fetchCategories()
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const roleParam = params.get('role')
            if (roleParam === 'admin') {
                setRole('admin')
                setStep('phone')
            }
        }
    }, [])

    const checkPhone = async () => {
        await partnerAuthService.checkPhone({
            setLoading,
            phoneNumber: phone,
            onSuccess: (data) => {
                if (data.exists) {
                    setStep("verify")
                } else {
                    setStep("basic")
                }
            },
            onError: (message) => {
                console.error(message);
                alert(message);
            }
        });
    }

    const handleContinue = async () => {
        if (role === "admin") {
            if (!phone || !email) {
                alert("Please enter both phone number and email")
                return
            }
            await adminAuthService.requestOTP({
                setLoading,
                phone,
                email,
                onSuccess: (message) => {
                    alert(message)
                    setStep("verify")
                },
                onError: (message) => {
                    alert(message)
                }
            })
        } else {
            checkPhone()
        }
    }

    const handleVerify = async () => {
        if (role === "admin") {
            await adminAuthService.verifyOTP({
                setLoading,
                phone,
                email,
                code: otpCode,
                onSuccess: (data) => {
                    router.push("/admin/dashboard")
                },
                onError: (message) => {
                    alert(message)
                }
            })
        } else {
            await partnerAuthService.login({
                setLoading,
                phone,
                code: otpCode,
                onSuccess: (data) => {
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
                    alert(message)
                }
            })
        }
    }

    return (
        <>
            <div className="flex flex-col h-screen w-screen px-10 items-center justify-start py-8">
                <img src="/bwf.svg" className="h-20 mb-2" alt="" />
                <p className="font-semibold">Connecting people services</p>

                {
                    step === "role-selection" && (
                        <>
                            <div className="flex flex-col gap-4 w-full max-w-sm mt-12">
                                <div className="mb-2">
                                    <h1 className="text-2xl font-bold">Select your role</h1>
                                    <p className="text-muted-foreground">Tell us how you plan to use the platform</p>
                                </div>
                                <RoleButton
                                    title="Partner11"
                                    description="Provide services and build your business"
                                    icon={Briefcase}
                                    selected={role === "partner"}
                                    onClick={() => {
                                        setRole("partner")
                                        setStep("phone")
                                    }}
                                />
                                <RoleButton
                                    title="Customer"
                                    description="Find and consume professional services"
                                    icon={User}
                                    selected={role === "customer"}
                                    onClick={() => setRole("customer")}
                                />
                                <RoleButton
                                    title="Admin"
                                    description="Manage platform operations and users"
                                    icon={ShieldCheck}
                                    selected={role === "admin"}
                                    onClick={() => {
                                        setRole("admin")
                                        setStep("phone")
                                    }}
                                />
                            </div>
                        </>
                    )
                }

                {
                    step === "phone" && (
                        <>
                            <div className="flex flex-col gap-4 w-full max-w-sm mt-12">
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
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                )}

                                <Button
                                    onClick={handleContinue}
                                    disabled={loading || !phone || (role === "admin" && !email)}
                                    loading={loading}
                                >
                                    Continue
                                </Button>
                            </div>
                        </>
                    )
                }

                {
                    step === "verify" && (
                        <>
                            <div className="flex flex-col gap-4 w-full max-w-sm mt-12">
                                <div className="mb-2">
                                    <h1 className="text-2xl font-bold">Verify Account</h1>
                                    <p className="text-muted-foreground">
                                        {role === "admin" ? (
                                            `Enter the 6-digit OTP code sent to ${email}`
                                        ) : (
                                            <>
                                                Code sent to admin. Contact{" "}
                                                <a
                                                    href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE?.replace(/\s+/g, '')}`}
                                                    className="font-semibold text-foreground hover:underline whitespace-nowrap"
                                                >
                                                    {process.env.NEXT_PUBLIC_SUPPORT_PHONE}
                                                </a>
                                            </>
                                        )}
                                    </p>
                                </div>
                                <InputField
                                    placeholder="Enter verification code"
                                    id="code"
                                    label="Verification Code"
                                    type="text"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value)}
                                />

                                <Button
                                    onClick={handleVerify}
                                    disabled={loading || !otpCode}
                                    loading={loading}
                                >
                                    Verify & Continue
                                </Button>
                            </div>
                        </>
                    )
                }

                {
                    step === "basic" && (
                        <>
                            <div className="flex flex-col gap-4 w-full max-w-sm mt-12">
                                <div className="mb-2">
                                    <h1 className="text-2xl font-bold">Enter your basic information</h1>
                                    <p className="text-muted-foreground">We will use this information to create your account</p>
                                </div>
                                <SelectField
                                    placeholder="Select your business category"
                                    id="businessCategory"
                                    label="Business Category"
                                    value={businessDetails.category}
                                    onValueChange={(val) => handleBusinessChange("category", val || "")}
                                    options={categories.map(cat => ({
                                        label: cat.title,
                                        value: cat._id
                                    }))}
                                />
                                <InputField
                                    placeholder="Enter your phone number"
                                    id="phone"
                                    label="Phone number"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={true}
                                />
                                <InputField
                                    placeholder="Eg. John"
                                    id="firstname"
                                    label="Firstname"
                                    type="text"
                                    value={basicDetails.firstname}
                                    onChange={(e) => handleBasicChange("firstname", e.target.value)}
                                />
                                <InputField
                                    placeholder="Eg. Doe"
                                    id="lastname"
                                    label="Lastname"
                                    type="text"
                                    value={basicDetails.lastname}
                                    onChange={(e) => handleBasicChange("lastname", e.target.value)}
                                />
                                <InputField
                                    placeholder="Eg. john.doe@gmail.com"
                                    id="email"
                                    label="Email"
                                    type="text"
                                    value={basicDetails.email}
                                    onChange={(e) => handleBasicChange("email", e.target.value)}
                                />

                                <Button onClick={() => setStep("business")}>Continue</Button>
                            </div>
                        </>
                    )
                }

                {
                    step === "business" && (
                        <>
                            <div className="flex flex-col gap-4 w-full max-w-sm mt-12">
                                <div className="mb-2">
                                    <h1 className="text-2xl font-bold">Business Information</h1>
                                    <p className="text-muted-foreground">Tell us about your business</p>
                                </div>
                                <InputField
                                    placeholder="Enter your business name"
                                    id="name"
                                    label="Business name"
                                    type="text"
                                    value={businessDetails.name}
                                    onChange={(e) => handleBusinessChange("name", e.target.value)}
                                />
                                <InputField
                                    placeholder="Enter your business address"
                                    id="address"
                                    label="Business address"
                                    type="text"
                                    value={businessDetails.address}
                                    onChange={(e) => handleBusinessChange("address", e.target.value)}
                                />


                                <Button onClick={() => setStep("business")}>Continue</Button>
                            </div>
                        </>
                    )
                }
            </div>
        </>
    )
}

export default LoginPage