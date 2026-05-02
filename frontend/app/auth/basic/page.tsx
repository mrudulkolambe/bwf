"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import InputField from "@/components/app/input-field"
import SelectField from "@/components/app/select-field"
import { Button } from "@/components/ui/button"
import { useRegistration } from "../context/registration-context"
import CategoryService from "../../login/services/category.service"
import { CategoryResponse } from "../../login/services/types/category.response.types"
import PartnerAuthService from "../../login/services/partner.auth.service"

import { setToken } from "@/lib/token"

const categoryService = new CategoryService()
const partnerAuthService = new PartnerAuthService()

export default function BasicDetailsPage() {
    const { phone, basicDetails, businessDetails, updateBasicDetails, updateBusinessDetails } = useRegistration()
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const fetchCategories = async () => {
            await categoryService.getCategories({
                setLoading: () => { }, // Not using global loading here to avoid flicker
                lang: "en",
                onSuccess: (data) => setCategories(data),
                onError: (err) => console.error(err)
            })
        }
        fetchCategories()
    }, [])

    const handleContinue = async () => {
        if (!basicDetails.firstname || !basicDetails.lastname || !basicDetails.email) {
            alert("Please fill all fields")
            return
        }

        await partnerAuthService.createPartner({
            setLoading,
            data: {
                phone,
                ...basicDetails,
                businessCategory: businessDetails.category
            },
            onSuccess: (data) => {
                router.push("/auth/business")
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
                <h1 className="text-2xl font-bold">Basic information</h1>
                <p className="text-muted-foreground">Tell us about yourself</p>
            </div>

            <SelectField
                placeholder="Select your business category"
                id="businessCategory"
                label="Business Category"
                value={businessDetails.category}
                onValueChange={(val) => updateBusinessDetails({ category: val || "" })}
                options={categories.map(cat => ({
                    label: cat.title,
                    value: cat._id
                }))}
            />

            <InputField
                placeholder="Phone number"
                onChange={() => { }}
                id="phone"
                label="Phone number"
                type="text"
                value={phone}
                disabled={true}
            />

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    placeholder="Eg. John"
                    id="firstname"
                    label="Firstname"
                    type="text"
                    value={basicDetails.firstname}
                    onChange={(e) => updateBasicDetails({ firstname: e.target.value })}
                />
                <InputField
                    placeholder="Eg. Doe"
                    id="lastname"
                    label="Lastname"
                    type="text"
                    value={basicDetails.lastname}
                    onChange={(e) => updateBasicDetails({ lastname: e.target.value })}
                />
            </div>

            <InputField
                placeholder="Eg. john.doe@gmail.com"
                id="email"
                label="Email"
                type="email"
                value={basicDetails.email}
                onChange={(e) => updateBasicDetails({ email: e.target.value })}
            />

            <Button loading={loading} onClick={handleContinue} className="w-full h-12 mt-4">
                Continue
            </Button>
        </div>
    )
}
