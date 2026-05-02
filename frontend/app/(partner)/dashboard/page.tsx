import React from 'react'

const DashboardPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
            <div className="max-w-md space-y-4">
                <h1 className="text-5xl font-bold tracking-tight text-zinc-900">
                    Dashboard Coming Soon
                </h1>
                
                <p className="text-lg text-zinc-500 leading-relaxed max-w-sm mx-auto">
                    We&apos;re currently building your command center. 
                    Stay tuned for a more powerful professional experience.
                </p>
            </div>

            <div className="mt-16 flex items-center gap-2 opacity-30">
                <img src="/bwf.svg" alt="BWF Logo" className="h-6" />
                <span className="text-xs font-bold tracking-widest uppercase">BWF Connect</span>
            </div>
        </div>
    )
}

export default DashboardPage