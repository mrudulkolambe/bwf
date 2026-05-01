"use client"

import { useState } from "react"
import RoleButton from "./components/role"
import { Briefcase, ShieldCheck, User } from "lucide-react"
import InputField from "@/components/app/input-field"
import { Button } from "@/components/ui/button"
import SelectField from "@/components/app/select-field"
import { PartnerAuthService } from "./services/partner.auth.service"

const LoginPage = () => {
    const [step, setStep] = useState<"role-selection" | "phone" | "basic" | "business" | "verify" | "login">("role-selection")
    const [role, setRole] = useState<"partner" | "customer" | "admin" | null>(null)
    const [phone, setPhone] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)

    const checkPhone = async () => {
        await PartnerAuthService.checkPhone(phone, {
            setLoading,
            onSuccess: (data) => {
                if (data.exists) {
                    setStep("verify")
                } else {
                    setStep("basic")
                }
            },
            onError: (message) => {
                // Handle error if needed
                console.error(message);
            }
        });
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
                                    title="Partner"
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
                                    onClick={() => setRole("admin")}
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
                                    <h1 className="text-2xl font-bold">Enter your phone number</h1>
                                    <p className="text-muted-foreground">We will send you a verification code</p>
                                </div>
                                <InputField
                                    placeholder="Enter your phone number"
                                    id="phone"
                                    label="Phone number"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />

                                <Button onClick={() => checkPhone()}>Continue</Button>
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
                                    placeholder="Select your gender"
                                    id="gender"
                                    label="Gender"
                                    value={""}
                                    onValueChange={() => { }}
                                    options={[
                                        { label: "Male", value: "male" },
                                        { label: "Female", value: "female" },
                                        { label: "Other", value: "other" },
                                    ]}
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
                                    value={""}
                                    onChange={() => { }}
                                />
                                <InputField
                                    placeholder="Eg. Doe"
                                    id="lastname"
                                    label="Lastname"
                                    type="text"
                                    value={""}
                                    onChange={() => { }}
                                />
                                <InputField
                                    placeholder="Eg. john.doe@gmail.com"
                                    id="email"
                                    label="Email"
                                    type="text"
                                    value={""}
                                    onChange={() => { }}
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
                                    value={""}
                                    onChange={() => { }}
                                />
                                <InputField
                                    placeholder="Enter your business address"
                                    id="address"
                                    label="Business address"
                                    type="text"
                                    value={""}
                                    onChange={() => { }}
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