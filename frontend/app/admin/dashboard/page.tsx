"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    Users,
    UserCheck,
    Clock,
    Search,
    Trash2,
    LogOut,
    CheckCircle2,
    XCircle,
    Shield,
    MapPin,
    X,
    Filter,
    RefreshCw,
    Building,
    Eye,
    Power,
    Coffee
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getToken, clearToken } from "@/lib/token"
import AdminService from "../services/admin.service"
import CategoryService from "../../login/services/category.service"
import { Partner } from "../services/types/partner.response.types"
import { CategoryResponse } from "../../login/services/types/category.response.types"
import SelectField from "@/components/app/select-field"

const adminService = new AdminService()
const categoryService = new CategoryService()

export default function AdminDashboardPage() {
    const router = useRouter()

    // Auth State
    const [authChecked, setAuthChecked] = useState(false)

    // Data State
    const [partners, setPartners] = useState<Partner[]>([])
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null) // holds partner ID performing action

    // Filters & Search
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [selectedStatus, setSelectedStatus] = useState<"all" | "completed" | "pending">("all")

    // Modal State
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)

    // Check Authentication
    useEffect(() => {
        const token = getToken()
        if (!token) {
            router.replace("/login?role=admin")
        } else {
            setAuthChecked(true)
        }
    }, [router])

    // Fetch partners & categories
    const fetchData = async () => {
        if (!getToken()) return

        // Fetch categories first
        categoryService.getCategories({
            setLoading: () => { },
            lang: "en",
            onSuccess: (cats) => {
                setCategories(cats)
            },
            onError: (err) => {
                console.error("Failed to load categories:", err)
            }
        })

        // Fetch partners
        adminService.getPartners({
            setLoading,
            search: searchQuery,
            category: selectedCategory,
            status: selectedStatus,
            onSuccess: (data) => {
                setPartners(data)
            },
            onError: (err) => {
                console.error("Failed to fetch partners:", err)
                alert(err)
            }
        })
    }

    // Trigger fetch on filter change
    useEffect(() => {
        if (authChecked) {
            fetchData()
        }
    }, [authChecked, selectedCategory, selectedStatus])

    // Form search trigger
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        fetchData()
    }

    // Toggle Verification (onboarding.completed status)
    const handleToggleVerification = (partner: Partner) => {
        const newStatus = !partner.onboarding.completed
        setActionLoading(partner._id)

        adminService.togglePartnerVerification({
            setLoading: () => { },
            id: partner._id,
            completed: newStatus,
            onSuccess: (updated) => {
                setPartners(prev => prev.map(p => p._id === partner._id ? { ...p, onboarding: updated.onboarding } : p))
                // If the details modal is open for this partner, update it too
                if (selectedPartner?._id === partner._id) {
                    setSelectedPartner(prev => prev ? { ...prev, onboarding: updated.onboarding } : null)
                }
                setActionLoading(null)
            },
            onError: (msg) => {
                alert(msg)
                setActionLoading(null)
            }
        })
    }

    // Delete Partner
    const handleDeletePartner = (id: string) => {
        if (!confirm("Are you sure you want to delete this partner account? This action cannot be undone.")) return
        setActionLoading(id)

        adminService.deletePartner({
            setLoading: () => { },
            id,
            onSuccess: () => {
                setPartners(prev => prev.filter(p => p._id !== id))
                if (selectedPartner?._id === id) {
                    setSelectedPartner(null)
                }
                setActionLoading(null)
            },
            onError: (msg) => {
                alert(msg)
                setActionLoading(null)
            }
        })
    }

    const handleLogout = () => {
        clearToken()
        router.replace("/login?role=admin")
    }

    // Calculate Summary Stats
    const totalCount = partners.length
    const verifiedCount = partners.filter(p => p.onboarding.completed).length
    const pendingCount = partners.filter(p => !p.onboarding.completed).length
    const availableCount = partners.filter(p => p.available).length

    if (!authChecked) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-zinc-950">
                <RefreshCw className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="font-bold tracking-tight text-md">BWF CONNECT</span>
                            <span className="ml-2 text-xs font-semibold px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500">Admin</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLogout}
                            className="text-zinc-600 dark:text-zinc-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Log out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Dashboard Content Container */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-500">

                {/* Intro Title */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Partners Overview</h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Manage, search, verify and configure partner accounts.</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchData}
                        className="self-start sm:self-auto h-10"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reload Data
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/85 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Partners</span>
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-300">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{loading ? "..." : totalCount}</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/85 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Verified</span>
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <UserCheck className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{loading ? "..." : verifiedCount}</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/85 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Pending</span>
                            <div className="p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg text-amber-600 dark:text-amber-400">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{loading ? "..." : pendingCount}</p>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/85 shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Online/Available</span>
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                <Power className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{loading ? "..." : availableCount}</p>
                    </div>
                </div>

                {/* Filters Panel */}
                <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/85 shadow-sm space-y-4">
                    <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Search Partners</label>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, phone, business name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400/50"
                                />
                            </div>
                        </div>

                        <div className="w-full md:w-64 space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Business Category</label>
                            <SelectField
                                label="Business Category"
                                placeholder="All Categories"
                                id="categoryFilter"
                                value={selectedCategory}
                                onValueChange={(val) => setSelectedCategory(val || "all")}
                                options={[
                                    { label: "All Categories", value: "all" },
                                    ...categories.map(cat => ({
                                        label: cat.title,
                                        value: cat._id
                                    }))
                                ]}
                            />
                        </div>

                        <Button type="submit" className="w-full md:w-auto h-11 px-6 font-medium">
                            Search
                        </Button>
                    </form>

                    {/* Onboarding Stage Filter Tabs */}
                    <div className="flex border-b border-zinc-200 dark:border-zinc-800 pt-2 overflow-x-auto gap-4">
                        {[
                            { label: "All Statuses", value: "all" },
                            { label: "Verified Only", value: "completed" },
                            { label: "Pending Verification", value: "pending" }
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setSelectedStatus(tab.value as any)}
                                className={`pb-3 text-xs font-semibold border-b-2 transition-all px-2 whitespace-nowrap ${selectedStatus === tab.value
                                    ? "border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-bold"
                                    : "border-transparent text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Partners List Section */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/85 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <RefreshCw className="h-8 w-8 animate-spin text-zinc-300" />
                            <p className="text-xs text-zinc-400 font-medium">Loading partner directory...</p>
                        </div>
                    ) : partners.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-4 space-y-2">
                            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-full text-zinc-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-zinc-800 dark:text-zinc-200">No partners found</h3>
                            <p className="text-xs text-zinc-400 max-w-xs">
                                Try adjusting your search query, selecting another category, or changing the status filter.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table Layout */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                            <th className="py-4 px-6">Code</th>
                                            <th className="py-4 px-6">Partner Name</th>
                                            <th className="py-4 px-6">Contact Info</th>
                                            <th className="py-4 px-6">Business Details</th>
                                            <th className="py-4 px-6">Availability</th>
                                            <th className="py-4 px-6">Verification</th>
                                            <th className="py-4 px-6 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
                                        {partners.map((partner) => (
                                            <tr key={partner._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                                                <td className="py-4 px-6 font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">
                                                    {partner.code || "PENDING"}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                        {partner.firstname} {partner.lastname}
                                                    </div>
                                                    <span className="text-xs text-zinc-400 font-light">
                                                        Joined: {new Date(partner.createdAt).toLocaleDateString()}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 space-y-0.5">
                                                    <div className="text-xs">{partner.phone}</div>
                                                    {partner.email && <div className="text-xs text-zinc-400 font-light">{partner.email}</div>}
                                                </td>
                                                <td className="py-4 px-6 space-y-1">
                                                    <div className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">
                                                        {partner.business?.name || <em className="text-zinc-400">No name</em>}
                                                    </div>
                                                    {partner.businessCategory && (
                                                        <Badge variant="secondary" className="font-normal text-[10px] bg-zinc-100 text-zinc-600 border-none">
                                                            {partner.businessCategory.title}
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {partner.available ? (
                                                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
                                                            <Power className="w-3 h-3" /> Available
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full">
                                                            <Coffee className="w-3 h-3" /> On Break
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    {partner.onboarding.completed ? (
                                                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-full font-semibold">
                                                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2 py-1 rounded-full font-semibold">
                                                            <Clock className="w-3.5 h-3.5" /> Pending Code
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="xs"
                                                            onClick={() => setSelectedPartner(partner)}
                                                            className="h-8 text-xs font-medium"
                                                        >
                                                            <Eye className="w-3 h-3 mr-1" /> Details
                                                        </Button>

                                                        <Button
                                                            variant={partner.onboarding.completed ? "outline" : "default"}
                                                            size="xs"
                                                            disabled={actionLoading === partner._id}
                                                            onClick={() => handleToggleVerification(partner)}
                                                            className={`h-8 text-xs font-semibold ${!partner.onboarding.completed
                                                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                                : ""
                                                                }`}
                                                        >
                                                            {partner.onboarding.completed ? "Revoke" : "Verify"}
                                                        </Button>

                                                        <Button
                                                            variant="destructive"
                                                            size="xs"
                                                            disabled={actionLoading === partner._id}
                                                            onClick={() => handleDeletePartner(partner._id)}
                                                            className="h-8"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Layout (Responsive List Cards) */}
                            <div className="md:hidden divide-y divide-zinc-200 dark:divide-zinc-800">
                                {partners.map((partner) => (
                                    <div key={partner._id} className="p-4 space-y-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/10 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono font-bold text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-zinc-800 dark:text-zinc-200">
                                                {partner.code || "PENDING"}
                                            </span>

                                            {partner.onboarding.completed ? (
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none hover:bg-emerald-50 font-semibold flex gap-1 items-center py-0.5 px-2">
                                                    <CheckCircle2 className="w-3 h-3" /> Verified
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-amber-50 text-amber-600 border-none hover:bg-amber-50 font-semibold flex gap-1 items-center py-0.5 px-2">
                                                    <Clock className="w-3 h-3" /> Pending Code
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-zinc-950 dark:text-zinc-50">
                                                {partner.firstname} {partner.lastname}
                                            </h3>
                                            <div className="text-xs text-zinc-500">{partner.phone} · {partner.email || "No email"}</div>
                                        </div>

                                        <div className="flex gap-2 flex-wrap items-center">
                                            <Badge variant="secondary" className="font-normal text-[10px] bg-zinc-100 text-zinc-600 border-none py-0.5 h-5">
                                                <Building className="w-3 h-3 mr-1 opacity-60" />
                                                {partner.business?.name || "No Business Name"}
                                            </Badge>

                                            {partner.businessCategory && (
                                                <Badge variant="secondary" className="font-normal text-[10px] bg-zinc-100 text-zinc-600 border-none py-0.5 h-5">
                                                    {partner.businessCategory.title}
                                                </Badge>
                                            )}

                                            {partner.available ? (
                                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/10 px-2 py-0.5 rounded-full">
                                                    <Power className="w-2.5 h-2.5" /> Online
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-bold bg-amber-50 dark:bg-amber-950/10 px-2 py-0.5 rounded-full">
                                                    <Coffee className="w-2.5 h-2.5" /> Offline
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedPartner(partner)}
                                                className="flex-1 text-xs h-9"
                                            >
                                                <Eye className="w-3.5 h-3.5 mr-1.5" /> Details
                                            </Button>

                                            <Button
                                                variant={partner.onboarding.completed ? "outline" : "default"}
                                                size="sm"
                                                disabled={actionLoading === partner._id}
                                                onClick={() => handleToggleVerification(partner)}
                                                className={`flex-1 text-xs h-9 font-semibold ${!partner.onboarding.completed
                                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    : ""
                                                    }`}
                                            >
                                                {partner.onboarding.completed ? "Revoke" : "Verify"}
                                            </Button>

                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                disabled={actionLoading === partner._id}
                                                onClick={() => handleDeletePartner(partner._id)}
                                                className="h-9 w-9 bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* Details Modal overlay */}
            {selectedPartner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
                            <div>
                                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">Partner Details</h3>
                                <p className="text-xs text-zinc-400">Detailed account profile and setup</p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedPartner(null)}
                                className="w-8 h-8 rounded-full"
                            >
                                <X className="w-4 h-4 text-zinc-400 hover:text-zinc-600" />
                            </Button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

                            {/* Profile Info */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Personal Info</h4>
                                <div className="grid grid-cols-2 gap-4 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl">
                                    <div>
                                        <div className="text-[10px] text-zinc-400">Firstname</div>
                                        <div className="text-sm font-semibold">{selectedPartner.firstname}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-400">Lastname</div>
                                        <div className="text-sm font-semibold">{selectedPartner.lastname}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-400">Phone Number</div>
                                        <div className="text-sm font-semibold">{selectedPartner.phone}</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-400">Email Address</div>
                                        <div className="text-sm font-semibold truncate">{selectedPartner.email || "—"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Business Info */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Business Info</h4>
                                <div className="space-y-3 bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-[10px] text-zinc-400">Business Name</div>
                                            <div className="text-sm font-semibold">{selectedPartner.business?.name || "—"}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-zinc-400">Category</div>
                                            <div className="text-sm font-semibold">{selectedPartner.businessCategory?.title || "—"}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-400">Business Location</div>
                                        <div className="text-xs font-semibold flex items-start gap-1 mt-0.5">
                                            <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                                            <span>{selectedPartner.business?.location || "—"}</span>
                                        </div>
                                    </div>

                                    {selectedPartner.business?.coordinates?.lat && selectedPartner.business?.coordinates?.lng && (
                                        <div>
                                            <div className="text-[10px] text-zinc-400">Coordinates (Lat / Lng)</div>
                                            <div className="text-xs font-mono font-semibold">
                                                {selectedPartner.business.coordinates.lat.toFixed(6)}, {selectedPartner.business.coordinates.lng.toFixed(6)}
                                            </div>
                                            {/* Static link to maps */}
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${selectedPartner.business.coordinates.lat},${selectedPartner.business.coordinates.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline mt-1 font-medium"
                                            >
                                                View on Google Maps
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Verification status and Code */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Verification Status</h4>
                                <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-950 p-4 rounded-xl">
                                    <div>
                                        <div className="text-[10px] text-zinc-400">Onboarding Status</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline" className={`font-semibold border-none ${selectedPartner.onboarding.completed
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-amber-50 text-amber-600"
                                                }`}>
                                                {selectedPartner.onboarding.completed ? "Verified" : "Pending Verification"}
                                            </Badge>
                                        </div>
                                    </div>

                                    {selectedPartner.code && (
                                        <div className="text-right">
                                            <div className="text-[10px] text-zinc-400">Registration Code</div>
                                            <div className="font-mono font-bold text-md text-zinc-900 dark:text-zinc-50 tracking-wider">
                                                {selectedPartner.code}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between gap-3 bg-zinc-50/50 dark:bg-zinc-800/10">
                            <Button
                                variant={selectedPartner.onboarding.completed ? "outline" : "default"}
                                size="sm"
                                disabled={actionLoading === selectedPartner._id}
                                onClick={() => handleToggleVerification(selectedPartner)}
                                className={`text-xs h-9 ${!selectedPartner.onboarding.completed
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                    : ""
                                    }`}
                            >
                                {selectedPartner.onboarding.completed ? "Revoke Verification" : "Verify Partner"}
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPartner(null)}
                                className="text-xs h-9"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
