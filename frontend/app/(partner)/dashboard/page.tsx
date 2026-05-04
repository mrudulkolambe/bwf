'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import API from '@/lib/api'

const DashboardPage = () => {
    const [partner, setPartner] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPartner = async () => {
            try {
                const response = await API.get('/api/partners/me')
                if (response.success) {
                    setPartner(response.data)
                }
            } catch (error) {
                console.error('Failed to fetch partner:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPartner()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-200" strokeWidth={1.5} />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-12 text-center animate-in fade-in duration-700">
            <div className="max-w-xs w-full space-y-6">
                <CheckCircle2 className="mx-auto h-12 w-12 text-zinc-900" strokeWidth={1} />

                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                        Hi, {partner?.firstname || 'Partner'}
                    </h1>
                    <p className="text-zinc-500 font-light leading-relaxed">
                        Your registration is complete. <br />
                        Your account is currently being verified.
                    </p>
                </div>

                {/* <div className="pt-6">
                    <Button variant="outline" className="rounded-full px-8 text-zinc-600 border-zinc-200 font-normal">
                        View Dashboard
                    </Button>
                </div> */}
            </div>

            <div className="mt-24 opacity-15 grayscale pointer-events-none">
                <img src="/bwf.svg" alt="BWF" className="h-4" />
            </div>
        </div>
    )
}

export default DashboardPage