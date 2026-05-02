"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import InputField from "@/components/app/input-field"
import { Button } from "@/components/ui/button"
import { useRegistration } from "../context/registration-context"

import PartnerAuthService from "../../login/services/partner.auth.service"
import PartnerService from "../../login/services/partner.service"

import CategoryService from "../../login/services/category.service"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const partnerAuthService = new PartnerAuthService()
const categoryService = new CategoryService()
const partnerService = new PartnerService()

export default function BusinessPage() {
    const { businessDetails, updateBusinessDetails } = useRegistration()
    const [tags, setTags] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (businessDetails.category) {
            categoryService.getTags({
                setLoading: () => { },
                categoryId: businessDetails.category,
                onSuccess: (data) => setTags(data),
                onError: (err) => console.error(err)
            })
        }
    }, [businessDetails.category])

    const toggleTag = (tagId: string) => {
        const current = businessDetails.selectedTags || []
        if (current.includes(tagId)) {
            updateBusinessDetails({ selectedTags: current.filter(id => id !== tagId) })
        } else {
            updateBusinessDetails({ selectedTags: [...current, tagId] })
        }
    }

    const handleContinue = async () => {
        if (!businessDetails.name || !businessDetails.address) {
            alert("Please fill all fields")
            return
        }

        await partnerService.updateBusinessDetails({
            setLoading,
            data: {
                name: businessDetails.name,
                location: businessDetails.address,
                tags: businessDetails.selectedTags
            },
            onSuccess: () => {
                router.push("/auth/verify")
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
                <h1 className="text-2xl font-bold">Business Information</h1>
                <p className="text-muted-foreground">Tell us about your business</p>
            </div>
            <InputField
                placeholder="Enter your business name"
                id="name"
                label="Business name"
                type="text"
                value={businessDetails.name}
                onChange={(e) => updateBusinessDetails({ name: e.target.value })}
            />
            <InputField
                placeholder="Enter your business address"
                id="address"
                label="Business address"
                type="text"
                value={businessDetails.address}
                onChange={(e) => updateBusinessDetails({ address: e.target.value })}
            />

            <div className="flex flex-col gap-2 mt-2">
                <p className="text-sm font-medium">Select tags that describe your business</p>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                        const isSelected = businessDetails.selectedTags?.includes(tag._id)
                        return (
                            <Badge
                                key={tag._id}
                                variant={isSelected ? "default" : "outline"}
                                className={cn(
                                    "cursor-pointer h-9 px-4 text-sm transition-all",
                                    isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent"
                                )}
                                onClick={() => toggleTag(tag._id)}
                            >
                                {tag.title}
                            </Badge>
                        )
                    })}
                </div>
            </div>

            <Button
                onClick={handleContinue}
                disabled={loading}
                className="w-full h-12 mt-4"
            >
                {loading ? "Saving..." : "Continue"}
            </Button>
        </div>
    )
}
