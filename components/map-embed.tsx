"use client"

export function MapEmbed({
  lat,
  lng,
  address,
  className,
}: {
  lat?: number
  lng?: number
  address?: string
  className?: string
}) {
  const hasCoords = typeof lat === "number" && typeof lng === "number"
  const q = hasCoords ? `${lat},${lng}` : encodeURIComponent(address || "")
  const src = `https://www.google.com/maps?q=${q}&output=embed`
  return (
    <div className={className}>
      <iframe
        title="Location map"
        src={src}
        className="w-full h-64 rounded-md border"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
