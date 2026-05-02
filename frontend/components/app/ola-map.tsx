"use client"

import { useEffect, useRef, useState } from "react"
import { OlaMaps, OlaMapsWeb } from 'olamaps-web-sdk'

interface OlaMapProps {
    apiKey: string
    initialCenter?: { lat: number; lng: number }
    onLocationSelect: (location: { address: string; coordinates: { lat: number; lng: number } }) => void
}

export default function OlaMap({ apiKey, initialCenter, onLocationSelect }: OlaMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const [mapLoaded, setMapLoaded] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [showResults, setShowResults] = useState(false)
    const mapRef = useRef<OlaMapsWeb.Map | null>(null)
    const markerRef = useRef<OlaMapsWeb.Marker | null>(null)
    const olaMapsRef = useRef<OlaMaps | null>(null)
    const isManualSelection = useRef(false)

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 3 && !isManualSelection.current) {
                performSearch(searchQuery)
            } else {
                setSearchResults([])
            }
            isManualSelection.current = false
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        const initialize = async () => {
            if (!mapContainerRef.current || mapRef.current) return

            try {
                const olaMaps = new OlaMaps({
                    apiKey: apiKey,
                })
                olaMapsRef.current = olaMaps

                const center: [number, number] = initialCenter
                    ? [initialCenter.lng, initialCenter.lat]
                    : [77.5946, 12.9716] // Bangalore

                const myMap = await olaMaps.init({
                    style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
                    container: mapContainerRef.current,
                    center: center,
                    zoom: 15,
                })
                mapRef.current = myMap

                const marker = olaMaps.addMarker({
                    offset: [0, -6],
                    anchor: 'bottom',
                    draggable: false,
                }).setLngLat(center).addTo(myMap)
                markerRef.current = marker

                // Marker always at center logic
                myMap.on('move', () => {
                    const center = myMap.getCenter()
                    marker.setLngLat(center)
                })

                myMap.on('moveend', async () => {
                    const center = myMap.getCenter()
                    await handleLocationChange(center.lat, center.lng)
                })

                setMapLoaded(true)
            } catch (error) {
                console.error("Error initializing Ola Maps:", error)
            }
        }

        initialize()

        return () => {
            if (mapRef.current) {
                mapRef.current.remove()
                mapRef.current = null
            }
        }
    }, [apiKey])

    const handleLocationChange = async (lat: number, lng: number) => {
        try {
            const response = await fetch(`https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${apiKey}`)
            const data = await response.json()
            if (data.status === "ok" && data.results && data.results.length > 0) {
                const address = data.results[0].formatted_address
                onLocationSelect({
                    address,
                    coordinates: { lat, lng }
                })
                isManualSelection.current = true
                setSearchQuery(address)
            }
        } catch (error) {
            console.error("Error in reverse geocoding:", error)
        }
    }

    const performSearch = async (query: string) => {
        try {
            const response = await fetch(`https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(query)}&api_key=${apiKey}`)
            const data = await response.json()
            if (data.predictions) {
                setSearchResults(data.predictions)
                setShowResults(true)
            }
        } catch (error) {
            console.error("Error in search autocomplete:", error)
        }
    }

    const selectResult = async (result: any) => {
        isManualSelection.current = true
        setSearchQuery(result.description)
        setSearchResults([])
        setShowResults(false)

        try {
            const response = await fetch(`https://api.olamaps.io/places/v1/details?place_id=${result.place_id}&api_key=${apiKey}`)
            const data = await response.json()
            if (data.result && data.result.geometry && data.result.geometry.location) {
                const { lat, lng } = data.result.geometry.location
                if (mapRef.current) {
                    mapRef.current.jumpTo({ center: [lng, lat], zoom: 15 })
                    markerRef.current?.setLngLat([lng, lat])
                }
                onLocationSelect({
                    address: result.description,
                    coordinates: { lat, lng }
                })
            }
        } catch (error) {
            console.error("Error fetching place details:", error)
        }
    }

    return (
        <div className="flex flex-col gap-3 w-full h-[450px]">
            <link href="https://unpkg.com/maplibre-gl@latest/dist/maplibre-gl.css" rel="stylesheet" />
            <div className="relative z-20">
                <input
                    type="text"
                    className="w-full h-11 px-4 rounded-lg border border-input bg-background text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Search for your business location..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowResults(true)
                    }}
                    onFocus={() => {
                        if (searchResults.length > 0) setShowResults(true)
                    }}
                />
                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                        {searchResults.map((result, idx) => (
                            <div
                                key={idx}
                                className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-0 border-gray-100 transition-colors"
                                onClick={() => selectResult(result)}
                            >
                                {result.description}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div
                ref={mapContainerRef}
                className="w-full grow rounded-xl border border-input overflow-hidden shadow-inner bg-gray-100 relative"
                style={{ minHeight: '300px' }}
            >
                {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 backdrop-blur-sm z-10">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-muted-foreground animate-pulse">Loading Map...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

