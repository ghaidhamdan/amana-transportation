'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type * as Leaflet from 'leaflet';

// ✅ Lazy load react-leaflet components (client-side only)
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then(m => m.Polyline), { ssr: false });

export default function BusMap() {
  const [isClient, setIsClient] = useState(false);
  const [L, setLeaflet] = useState<typeof Leaflet | null>(null);
  const [busIcon, setBusIcon] = useState<Leaflet.Icon | null>(null);
  const [stopIcon, setStopIcon] = useState<Leaflet.Icon | null>(null);

  useEffect(() => {
    // ✅ ننتظر حتى يجهز الـ DOM
    setIsClient(true);

    (async () => {
      const leaflet = await import('leaflet');

      const bus = leaflet.icon({
        iconUrl: '/icons/bus.png',
        iconSize: [35, 35],
        iconAnchor: [22, 45],
        popupAnchor: [0, -40],
      });

      const stop = leaflet.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2776/2776067.png',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -25],
      });

      setLeaflet(leaflet);
      setBusIcon(bus);
      setStopIcon(stop);
    })();

    // ✅ تنظيف الخريطة عند إزالة الكومبوننت
    return () => {
      const container = document.getElementById('map');
      if (container) container.innerHTML = '';
    };
  }, []);

  if (!isClient || !L || !busIcon || !stopIcon) {
    return <p className="text-center text-gray-500">Loading map...</p>;
  }

  const busStops = [
    { id: 1, name: 'Ramallah Station', position: [31.9, 35.2] as [number, number], arrival: '09:45' },
    { id: 2, name: 'Birzeit Stop', position: [31.95, 35.23] as [number, number], arrival: '10:00' },
    { id: 3, name: 'Nablus Station', position: [32.22, 35.26] as [number, number], arrival: '10:30' },
    { id: 4, name: 'Jenin Station', position: [32.46, 35.29] as [number, number], arrival: '10:55' },
  ];

  const busPosition: [number, number] = [32.0, 35.24];

  return (
    <div id="map" className="w-full h-80 rounded-md overflow-hidden border border-gray-300 shadow-sm">
      <MapContainer
        center={[32.0, 35.23]}
        zoom={9}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Polyline
          positions={busStops.map(stop => stop.position)}
          color="gray"
          weight={4}
          opacity={0.8}
        />

        {busStops.map(stop => (
          <Marker key={stop.id} position={stop.position} icon={stopIcon}>
            <Popup>
              <div className="bg-green-100 border border-green-300 p-2 rounded-md text-sm text-gray-800 text-center">
                <strong>{stop.name}</strong>
                <br />
                Next Bus Arrival Time: <strong>{stop.arrival}</strong>
              </div>
            </Popup>
          </Marker>
        ))}

        <Marker position={busPosition} icon={busIcon}>
          <Popup>
            <div className="bg-yellow-100 border border-yellow-300 p-2 rounded-md text-sm text-gray-800 text-center">
              <strong>Bus 1</strong>
              <br />
              Status: Active
              <br />
              Capacity: 35%
              <br />
              Next Stop: Nablus Station
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
