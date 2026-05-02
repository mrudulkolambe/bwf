"use client"

import React from 'react'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const SelectField = ({
    label,
    id,
    placeholder,
    value,
    onValueChange,
    options,
    error,
    description,
    disabled = false
}: {
    label: string
    id: string
    value: string | null
    onValueChange: (value: string | null) => void
    options: { label: string, value: string }[]
    placeholder: string
    description?: string
    error?: string
    disabled?: boolean
}) => {
    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Select
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <SelectTrigger id={id} className="w-full">
                    <SelectValue>
                        {options.find(opt => opt.value === value)?.label || placeholder}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {description && <FieldDescription>{description}</FieldDescription>}
            {error && <FieldError>{error}</FieldError>}
        </Field>
    )
}

export default SelectField