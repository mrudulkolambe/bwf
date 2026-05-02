"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-6 text-center">
      <div className="relative mb-8">
        <h1 className="text-[14rem] font-black leading-none tracking-tighter text-neutral-100 select-none">
          404
        </h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">Page Not Found</h2>
          <div className="h-1.5 w-16 bg-black rounded-full" />
        </div>
      </div>

      <p className="max-w-[460px] text-neutral-500 text-lg sm:text-xl mb-12 leading-relaxed font-medium">
        The page you are looking for doesn&apos;t exist or has been moved to another coordinate.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-[480px]">
        <Button
          size="lg"
          className="h-14 flex-1 rounded-full bg-black text-white hover:bg-neutral-800 transition-all text-base font-semibold w-full"
        >
          <Link href="/dashboard" className="flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="h-14 flex-1 rounded-full border-2 border-neutral-200 hover:border-black hover:bg-transparent transition-all text-base font-semibold w-full"
        >
          <Link href="/auth/role" className="flex items-center justify-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </Link>
        </Button>
      </div>

      <div className="mt-24 flex items-center gap-2.5 opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-default">
        <img src="/bwf.svg" alt="BWF Logo" className="h-7" />
        <span className="text-sm font-bold tracking-[0.15em] uppercase">BWF CONNECT</span>
      </div>
    </div>
  )
}
