'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, User, Power, Coffee } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import API from '@/lib/api'
import { cn } from '@/lib/utils'

const DashboardPage = () => {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await API.get('/api/partners/dashboard')
                if (response.success) {
                    setData(response.data)
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    const toggleAvailability = async (status: boolean) => {
        if (data?.available === status) return
        
        setUpdating(true)
        try {
            const response = await API.patch('/api/partners/dashboard', { available: status })
            if (response.success) {
                setData((prev: any) => ({ ...prev, available: status }))
            }
        } catch (error) {
            console.error('Failed to update status:', error)
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Loader2 className="h-5 w-5 animate-spin text-zinc-200" strokeWidth={1.5} />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 py-12 text-center animate-in fade-in duration-700">
            <div className="max-w-sm w-full space-y-10">
                {/* Profile Section */}
                <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
                        <User className="h-8 w-8 text-zinc-400" strokeWidth={1} />
                    </div>
                    <div className="space-y-1.5">
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                            Hi, {data?.firstname || 'Partner'}
                        </h1>
                        <div className="flex items-center justify-center">
                            <Badge variant="secondary" className="font-normal px-2.5 bg-zinc-100 text-zinc-600 border-none h-6">
                                {data?.businessCategory?.title?.en || 'Partner'}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Status Toggle Section */}
                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Current Status</p>
                    <div className="flex p-1 bg-zinc-100 rounded-full w-full max-w-[280px] mx-auto border border-zinc-200/50">
                        <button
                            onClick={() => toggleAvailability(true)}
                            disabled={updating}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold transition-all duration-300",
                                data?.available 
                                    ? "bg-white text-zinc-900 shadow-sm" 
                                    : "text-zinc-400 hover:text-zinc-600"
                            )}
                        >
                            <Power className={cn("h-3.5 w-3.5", data?.available ? "text-emerald-500" : "text-zinc-300")} strokeWidth={2.5} />
                            Available
                        </button>
                        <button
                            onClick={() => toggleAvailability(false)}
                            disabled={updating}
                            className={cn(
                                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-xs font-semibold transition-all duration-300",
                                !data?.available 
                                    ? "bg-white text-zinc-900 shadow-sm" 
                                    : "text-zinc-400 hover:text-zinc-600"
                            )}
                        >
                            <Coffee className={cn("h-3.5 w-3.5", !data?.available ? "text-amber-500" : "text-zinc-300")} strokeWidth={2.5} />
                            On Break
                        </button>
                    </div>
                </div>

                {/* Verification Status */}
                <div className="pt-2">
                    <div className="inline-flex items-center gap-2 text-zinc-400 text-[13px] font-light">
                        <CheckCircle2 className="h-4 w-4 text-zinc-300" strokeWidth={1} />
                        Registration Verified
                    </div>
                </div>
            </div>

            <div className="mt-24 opacity-15 grayscale pointer-events-none">
                <img src="/bwf.svg" alt="BWF" className="h-4" />
            </div>
        </div>
    )
}

export default DashboardPage