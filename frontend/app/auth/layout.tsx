"use client"

import { RegistrationProvider } from "./context/registration-context"

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <RegistrationProvider>
            <div className="flex flex-col min-h-screen w-full items-center justify-start py-8 px-6 sm:px-10">
                <div className="flex flex-col items-center mb-8">
                    <img src="/bwf.svg" className="h-16 mb-2" alt="BWF Logo" />
                    <p className="font-semibold text-center">Connecting people services</p>
                </div>
                <main className="w-full max-w-sm">
                    {children}
                </main>
            </div>
        </RegistrationProvider>
    )
}
