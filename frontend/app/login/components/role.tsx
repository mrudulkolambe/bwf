import { LucideIcon } from 'lucide-react'
import React from 'react'

const RoleButton = ({
    title,
    description,
    icon,
    selected,
    onClick
}: {
    title: string,
    description: string,
    icon: LucideIcon,
    selected: boolean,
    onClick: () => void
}) => {
    const Icon = icon
    return (
        <div 
            onClick={onClick}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                selected 
                ? "border-primary bg-primary/5 shadow-sm" 
                : "border-border hover:border-primary/50 hover:bg-accent/50"
            }`}
        >
            <div className={`p-3 rounded-lg ${selected ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <Icon className={`h-6 w-6`} />
            </div>
            <div className="flex flex-col">
                <p className={`font-semibold ${selected ? "text-primary" : "text-foreground"}`}>{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}

export default RoleButton