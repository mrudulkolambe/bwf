"use client"

import { PartnerProvider } from "./context/partner-context"

export default function PartnerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <PartnerProvider>
            {children}
        </PartnerProvider>
    )
}
