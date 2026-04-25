import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'

export default function MapView() {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    const { data } = await supabase.from('requests').select('*')
    setRequests(data || [])
  }

  return (
    <MapContainer
      center={[19.0760, 72.8777]} // Mumbai
      zoom={12}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {requests.map((req) => (
        <Marker key={req.id} position={[req.latitude, req.longitude]}>
          <Popup>
            {req.category} <br />
            Urgency: {req.urgency}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
