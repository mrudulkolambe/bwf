"use client"

import { Briefcase, ShieldCheck, User } from "lucide-react"
import RoleButton from "../../login/components/role"
import { useRegistration } from "../context/registration-context"
import { useRouter } from "next/navigation"

export default function RolePage() {
    const { role, setRole } = useRegistration()
    const router = useRouter()

    const handleRoleSelect = (selectedRole: "partner" | "customer" | "admin") => {
        setRole(selectedRole)
        router.push("/auth/phone")
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="mb-2">
                <h1 className="text-2xl font-bold">Select your role</h1>
                <p className="text-muted-foreground">Tell us how you plan to use the platform</p>
            </div>
            <RoleButton
                title="Partner"
                description="Provide services and build your business"
                icon={Briefcase}
                selected={role === "partner"}
                onClick={() => handleRoleSelect("partner")}
            />
            {/* <RoleButton
                title="Customer"
                description="Find and consume professional services"
                icon={User}
                selected={role === "customer"}
                onClick={() => handleRoleSelect("customer")}
            />
            <RoleButton
                title="Admin"
                description="Manage platform operations and users"
                icon={ShieldCheck}
                selected={role === "admin"}
                onClick={() => handleRoleSelect("admin")}
            /> */}
        </div>
    )
}
