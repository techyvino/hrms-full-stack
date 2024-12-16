'use client'

import type { Location } from '@capacitor-community/background-geolocation'
import type { LatLngTuple } from 'leaflet'
import type { FC } from 'react'
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet'

interface OpenStreetMapProps {
  center: LatLngTuple | null
  positions: Location[]
}
const OpenStreetMap: FC<OpenStreetMapProps> = ({ center, positions }) => {
  const limeOptions = { color: 'lime' }

  const polyline: LatLngTuple[] | boolean =
    Array.isArray(positions) &&
    positions?.length > 0 &&
    positions?.map(({ latitude, longitude }) => [latitude, longitude])

  if (!center) {
    return (
      <div className="flex h-[40vh] w-[70vw] items-center justify-center border">
        <p className="text-bolder animate-bounce text-sm">
          <span>Start to get Location</span>
        </p>
      </div>
    )
  }

  return (
    <div className="mt-24 flex items-center justify-center">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '50vh', width: '50vh' }}>
        {polyline && <Polyline pathOptions={limeOptions} positions={polyline} />}
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={center} />
      </MapContainer>
    </div>
  )
}

export default OpenStreetMap
