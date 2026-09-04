import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Navigation, Layers, Check, Compass, Crosshair, ExternalLink } from "lucide-react";
import AnimatedButton from "./AnimatedButton";

const JHARKHAND_PLACES = [
  { name: "Kanke Road, Ranchi", lat: 23.4021, lng: 85.3214, district: "Ranchi" },
  { name: "Morabadi Ground, Ranchi", lat: 23.3854, lng: 85.3341, district: "Ranchi" },
  { name: "Bistupur Market, Jamshedpur", lat: 22.7983, lng: 86.1842, district: "Jamshedpur" },
  { name: "Bank More, Dhanbad", lat: 23.7915, lng: 86.4298, district: "Dhanbad" },
  { name: "Sector 4 City Centre, Bokaro", lat: 23.6693, lng: 86.1511, district: "Bokaro" },
  { name: "Matwari Chowk, Hazaribagh", lat: 23.9961, lng: 85.3647, district: "Hazaribagh" },
  { name: "Jasidih Station Road, Deoghar", lat: 24.5167, lng: 86.6501, district: "Deoghar" },
];

export default function MapLocationPicker({
  selectedLocation,
  onSelectLocation,
  className = "",
  compact = false,
}) {
  const [mapType, setMapType] = useState("roadmap"); // "roadmap" | "satellite"
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCoords, setCurrentCoords] = useState({
    lat: selectedLocation?.lat || 23.3441,
    lng: selectedLocation?.lng || 85.3096,
    address: selectedLocation?.address || "Main Road, Ranchi, Jharkhand",
    district: selectedLocation?.district || "Ranchi",
  });
  const [pinOffset, setPinOffset] = useState({ x: 50, y: 50 }); // percentage on map canvas

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(10, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    setPinOffset({ x, y });

    // Simulated coordinate shift
    const baseLat = 23.3441;
    const baseLng = 85.3096;
    const computedLat = +(baseLat + (y - 50) * 0.005).toFixed(4);
    const computedLng = +(baseLng + (x - 50) * 0.005).toFixed(4);
    const address = `Sector ${Math.floor(x / 10)}, Ward ${Math.floor(y / 10)}, Near Ring Road, ${currentCoords.district}`;

    const newLoc = {
      lat: computedLat,
      lng: computedLng,
      address,
      district: currentCoords.district,
    };
    setCurrentCoords(newLoc);
    if (onSelectLocation) onSelectLocation(newLoc);
  };

  const handleSelectPreset = (place) => {
    const newLoc = {
      lat: place.lat,
      lng: place.lng,
      address: place.name,
      district: place.district,
    };
    setCurrentCoords(newLoc);
    setSearchQuery(place.name);
    // Random visual pin repositioning within bounds
    setPinOffset({ x: 45 + Math.random() * 10, y: 45 + Math.random() * 10 });
    if (onSelectLocation) onSelectLocation(newLoc);
  };

  return (
    <div className={`space-y-3 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${className}`}>
      {/* Top Search and Controls */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location on Google Map in Jharkhand..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setMapType(mapType === "roadmap" ? "satellite" : "roadmap")}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-semibold flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            <span>{mapType === "roadmap" ? "Satellite" : "Map"}</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Locations */}
      <div className="px-3 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Popular:</span>
        {JHARKHAND_PLACES.slice(0, 4).map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => handleSelectPreset(p)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap cursor-pointer transition-colors border border-slate-200/60 dark:border-slate-700/60"
          >
            {p.name.split(",")[0]}
          </button>
        ))}
      </div>

      {/* Interactive Google Maps Simulated Viewport */}
      <div
        onClick={handleMapClick}
        className={`relative w-full ${compact ? "h-44" : "h-60"} cursor-crosshair overflow-hidden select-none transition-all ${
          mapType === "satellite"
            ? "bg-[#142318] text-white"
            : "bg-[#e5e3df] dark:bg-[#1a202c] text-slate-800 dark:text-slate-200"
        }`}
      >
        {/* Map Grid / Topography Patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={mapType === "satellite" ? "#2d4a36" : "#cbd5e1"} strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
          {/* Simulated arterial roads */}
          <path d="M -50 80 Q 150 140 350 40 T 800 120" fill="none" stroke={mapType === "satellite" ? "#eab308" : "#fbbf24"} strokeWidth="4" />
          <path d="M 120 -20 Q 140 120 220 250" fill="none" stroke={mapType === "satellite" ? "#ffffff" : "#ffffff"} strokeWidth="3" />
          <path d="M 0 160 L 500 190" fill="none" stroke={mapType === "satellite" ? "#94a3b8" : "#94a3b8"} strokeWidth="2" strokeDasharray="6,4" />
          {/* River Subarnarekha curve */}
          <path d="M -20 20 Q 200 80 400 30 T 900 150" fill="none" stroke="#38bdf8" strokeWidth="8" opacity="0.6" />
        </svg>

        {/* Water / Parks landmarks */}
        <div className="absolute top-4 left-6 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
          🌲 Kanke Dam Catchment
        </div>
        <div className="absolute bottom-4 right-8 px-2 py-0.5 rounded bg-sky-500/20 text-sky-700 dark:text-sky-300 text-[10px] font-bold border border-sky-500/30">
          🌊 Subarnarekha River Basin
        </div>

        {/* Google Map Watermark */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] font-semibold opacity-70 bg-white/70 dark:bg-black/60 px-2 py-0.5 rounded pointer-events-none">
          <span className="text-[#4285F4]">G</span>
          <span className="text-[#EA4335]">o</span>
          <span className="text-[#FBBC05]">o</span>
          <span className="text-[#4285F4]">g</span>
          <span className="text-[#34A853]">l</span>
          <span className="text-[#EA4335]">e</span>
          <span className="ml-1 text-[9px] text-slate-500">Maps (Jharkhand)</span>
        </div>

        {/* Interactive Dropped Pin with Pulse */}
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ left: `${pinOffset.x}%`, top: `${pinOffset.y}%` }}
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-20 flex flex-col items-center"
        >
          <div className="px-2.5 py-1 rounded-xl bg-slate-900 text-white text-[10px] font-bold shadow-2xl border border-white/20 whitespace-nowrap mb-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>Pinned Location</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl border-2 border-white">
            <MapPin className="w-5 h-5 fill-white" />
          </div>
          <div className="w-2.5 h-1 rounded-full bg-black/40 blur-[1px] mt-0.5" />
        </motion.div>

        {/* Map Center crosshair instruction */}
        <div className="absolute top-2 right-2 text-[10px] font-medium bg-black/60 text-white px-2 py-1 rounded-lg backdrop-blur-sm pointer-events-none flex items-center gap-1">
          <Crosshair className="w-3 h-3 text-rose-400" />
          <span>Click anywhere to move pin</span>
        </div>
      </div>

      {/* Selected Details Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="truncate">
            <div className="font-bold text-slate-800 dark:text-slate-200 truncate">
              {currentCoords.address}
            </div>
            <div className="text-[10px] text-slate-400">
              GPS: {currentCoords.lat}° N, {currentCoords.lng}° E ({currentCoords.district})
            </div>
          </div>
        </div>

        <span className="shrink-0 ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
          ✓ Coordinates Linked
        </span>
      </div>
    </div>
  );
}
