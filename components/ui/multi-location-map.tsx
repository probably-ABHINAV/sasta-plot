"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Plot } from "@/types"

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface MultiLocationMapProps {
  plots: Plot[]
  height?: string
  className?: string
}

export function MultiLocationMap({ 
  plots, 
  height = "500px",
  className = ""
}: MultiLocationMapProps) {
  if (plots.length === 0) {
    return null
  }

  // Calculate center point based on all plot locations
  const centerLat = plots.reduce((sum, plot) => sum + (plot.latitude || 0), 0) / plots.length
  const centerLng = plots.reduce((sum, plot) => sum + (plot.longitude || 0), 0) / plots.length

  // Calculate zoom level based on the spread of locations
  const latitudes = plots.map(plot => plot.latitude || 0)
  const longitudes = plots.map(plot => plot.longitude || 0)
  const latSpread = Math.max(...latitudes) - Math.min(...latitudes)
  const lngSpread = Math.max(...longitudes) - Math.min(...longitudes)
  const maxSpread = Math.max(latSpread, lngSpread)
  
  // Determine zoom level based on spread
  let zoom = 10
  if (maxSpread < 0.01) zoom = 14
  else if (maxSpread < 0.05) zoom = 12
  else if (maxSpread < 0.1) zoom = 11
  else if (maxSpread < 0.5) zoom = 9
  else zoom = 8

  return (
    <div className={`rounded-lg overflow-hidden border ${className}`} style={{ height }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {plots.map((plot) => {
          if (plot.latitude == null || plot.longitude == null) return null
          
          return (
            <Marker key={plot.id} position={[plot.latitude, plot.longitude]}>
              <Popup>
                <div className="text-center min-w-[200px]">
                  <h3 className="font-semibold text-base mb-1">{plot.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{plot.location}</p>
                  {plot.price && (
                    <p className="text-sm font-medium mb-2">₹{Number(plot.price).toLocaleString()}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {plot.latitude.toFixed(6)}, {plot.longitude.toFixed(6)}
                  </p>
                  {plot.slug && (
                    <a 
                      href={`/plots/${plot.slug}`}
                      className="inline-block mt-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors"
                    >
                      View Details
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}