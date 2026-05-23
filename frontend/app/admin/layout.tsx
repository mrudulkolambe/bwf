"use client"

import React from 'react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen w-full bg-zinc-50/50">
            {children}
        </div>
    )
}
