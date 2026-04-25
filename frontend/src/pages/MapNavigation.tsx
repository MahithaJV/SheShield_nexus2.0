import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShieldCheck, Map as MapIcon } from 'lucide-react';

const MapNavigation = () => {
  const navigate = useNavigate();
  const position: [number, number] = [51.505, -0.09]; // Example coordinates

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white">
      <header className="p-6 flex items-center gap-4 border-b border-white/5 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-[1000]">
        <button onClick={() => navigate('/dashboard')} className="p-2 rounded-xl bg-white/5 border border-white/10">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Safe Navigation</h1>
      </header>

      <div className="p-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for a safe destination..."
            className="w-full py-4 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 focus:border-pink-500/50 outline-none transition-all"
          />
        </div>

        <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-white/10 relative">
          <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                You are here. <br /> Safe area.
              </Popup>
            </Marker>
            {/* Safety zone simulation */}
            <Circle center={position} radius={500} pathOptions={{ color: '#22c55e', fillOpacity: 0.1 }} />
            <Circle center={[51.51, -0.1]} radius={300} pathOptions={{ color: '#ef4444', fillOpacity: 0.2 }} />
          </MapContainer>

          <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
            <button className="p-3 rounded-full bg-pink-500 shadow-lg shadow-pink-500/30">
              <ShieldCheck size={24} />
            </button>
            <button className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <MapIcon size={24} />
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="font-bold text-lg">Safe Havens Nearby</h2>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <ShieldCheck size={24} className="text-green-500" />
            </div>
            <div>
              <h4 className="font-bold">Police Station - Central</h4>
              <p className="text-xs text-gray-400">0.5 miles away • Open 24/7</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <ShieldCheck size={24} className="text-pink-500" />
            </div>
            <div>
              <h4 className="font-bold">SheShield Safe Spot</h4>
              <p className="text-xs text-gray-400">1.2 miles away • Partner Cafe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapNavigation;
