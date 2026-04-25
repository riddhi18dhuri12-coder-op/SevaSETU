import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const center = { lat: 19.0760, lng: 72.8777 }; // 📍 Mumbai default center

export default function MapView() {
  const { isLoaded } = useLoadScript({
    // ⚠️ Replace your Google Maps API key in .env file
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();

    // 🔄 Real-time updates from Supabase
    const channel = supabase
      .channel('requests')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'requests' },
        fetchRequests
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchRequests = async () => {
    // 📡 Fetch all requests from database
    const { data, error } = await supabase.from('requests').select('*');

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      setRequests(data);
    }
  };

  // 🎨 Marker color based on urgency
  const getColor = (urgency) => {
    if (urgency >= 4) return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    if (urgency === 3) return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
    return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
  };

  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <GoogleMap
      zoom={12}
      center={center}
      mapContainerStyle={{ width: "100%", height: "500px" }}
    >
      {requests.map((req) => (
        <Marker
          key={req.id}
          position={{
            lat: req.latitude,
            lng: req.longitude
          }}
          icon={getColor(req.urgency)}
        />
      ))}
    </GoogleMap>
  );
}
