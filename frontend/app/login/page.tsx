"use client"

import { useState, useEffect } from "react"
import RoleButton from "./components/role"
import { Briefcase, ShieldCheck, User } from "lucide-react"
import InputField from "@/components/app/input-field"
import { Button } from "@/components/ui/button"
import SelectField from "@/components/app/select-field"
import PartnerAuthService from "./services/partner.auth.service"
import CategoryService from "./services/category.service"
import { CategoryResponse } from "./services/types/category.response.types"

const partnerAuthService = new PartnerAuthService();
const categoryService = new CategoryService();

const LoginPage = () => {
    const [step, setStep] = useState<"role-selection" | "phone" | "basic" | "business" | "verify" | "login">("role-selection")
    const [role, setRole] = useState<"partner" | "customer" | "admin" | null>(null)
    const [phone, setPhone] = useState<string>("")
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
            setLoading,
            lang: "en",
            onSuccess: (data: CategoryResponse[]) => {
                console.log(data)
                setCategories(data)
            },
            onError: (message: string) => {
                console.error(message)
            }
        })
    }

    useEffect(() => {
        fetchCategories()
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
                                    type="number"
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
                                    type="number"
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