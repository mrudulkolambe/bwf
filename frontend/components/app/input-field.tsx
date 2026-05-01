"use client"

import React from 'react'
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from '../ui/input'

const InputField = ({
    label,
    id,
    type,
    placeholder,
    value,
    onChange,
    error,
    description,
    disabled = false
}: {
    label: string
    id: string
    value: string | number
    type: "number" | "text" | "email" | "password" | "date"
    placeholder: string
    description?: string
    error?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean
}) => {
    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                aria-invalid={!!error}
                disabled={disabled}
            />
            {description && <FieldDescription>{description}</FieldDescription>}
            {error && <FieldError>{error}</FieldError>}
        </Field>
    )
}

export default InputField