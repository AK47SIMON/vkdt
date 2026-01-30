import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Map, Layers, Info, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Major cities with coordinates
const majorCities = [
  { name: "Nairobi", lat: -1.2921, lng: 36.8219, population: "4.4M", type: "capital" },
  { name: "Mombasa", lat: -4.0435, lng: 39.6682, population: "1.2M", type: "major" },
  { name: "Kisumu", lat: -0.1022, lng: 34.7617, population: "1.1M", type: "major" },
  { name: "Nakuru", lat: -0.3031, lng: 36.0800, population: "2.1M", type: "major" },
  { name: "Eldoret", lat: 0.5143, lng: 35.2698, population: "1.1M", type: "major" },
  { name: "Thika", lat: -1.0334, lng: 37.0692, population: "0.2M", type: "city" },
  { name: "Malindi", lat: -3.2175, lng: 40.1167, population: "0.1M", type: "city" },
  { name: "Garissa", lat: -0.4536, lng: 39.6401, population: "0.2M", type: "city" },
  { name: "Lodwar", lat: 3.1167, lng: 35.6000, population: "0.1M", type: "city" },
  { name: "Nyeri", lat: -0.4167, lng: 36.9500, population: "0.2M", type: "city" },
];

// Kenya GeoJSON boundaries (simplified)
const kenyaBoundary = {
  type: "Feature" as const,
  properties: { name: "Kenya" },
  geometry: {
    type: "Polygon" as const,
    coordinates: [[
      [33.9, -4.7], [34.5, -4.7], [37.6, -4.6], [39.2, -4.6], [40.9, -2.5],
      [41.9, -1.7], [41.0, 2.5], [40.9, 4.2], [39.0, 3.4], [36.0, 4.4],
      [35.0, 4.6], [34.0, 4.2], [33.9, 0.1], [34.1, -1.1], [33.9, -4.7]
    ]]
  }
};

const KenyaMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [-1.2921, 37.5],
      zoom: 6,
      zoomControl: false,
      attributionControl: false,
    });

    // Add dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add Kenya boundary
    L.geoJSON(kenyaBoundary as any, {
      style: {
        fillColor: '#22c55e',
        fillOpacity: 0.15,
        color: '#22c55e',
        weight: 2,
        opacity: 0.8
      }
    }).addTo(map);

    // Add city markers
    majorCities.forEach(city => {
      const size = city.type === 'capital' ? 12 : city.type === 'major' ? 8 : 6;
      const color = city.type === 'capital' ? '#fbbf24' : '#22c55e';
      
      const marker = L.circleMarker([city.lat, city.lng], {
        radius: size,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      });

      marker.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong style="font-size: 14px; color: #22c55e;">${city.name}</strong>
          <br/>
          <span style="color: #888; font-size: 12px;">Population: ${city.population}</span>
          <br/>
          <span style="color: #666; font-size: 11px; text-transform: capitalize;">${city.type}</span>
        </div>
      `, {
        className: 'custom-popup'
      });

      marker.addTo(map);
    });

    mapInstanceRef.current = map;
    setMapLoaded(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleReset = () => mapInstanceRef.current?.setView([-1.2921, 37.5], 6);

  return (
    <section className="relative py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Map className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-medium uppercase tracking-wider">Interactive Map</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kenya Geographic Overview
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore Kenya's 47 counties with real-time demographic and economic data visualization.
          </p>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden border border-border glow-border"
        >
          {/* Map Controls */}
          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            <Button variant="metric" size="sm" className="gap-2">
              <Layers className="w-4 h-4" />
              Layers
            </Button>
            <div className="flex flex-col gap-1">
              <Button variant="metric" size="icon" onClick={handleZoomIn} className="h-8 w-8">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="metric" size="icon" onClick={handleZoomOut} className="h-8 w-8">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="metric" size="icon" onClick={handleReset} className="h-8 w-8">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 right-4 z-[1000] glass-panel p-4">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Legend
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-kenya-gold" />
                <span className="text-muted-foreground">Capital City</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Major Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-primary/30 border border-primary" />
                <span className="text-muted-foreground">National Boundary</span>
              </div>
            </div>
          </div>

          {/* Leaflet Map */}
          <div 
            ref={mapRef} 
            className="h-[600px] w-full"
            style={{ background: 'hsl(220, 20%, 6%)' }}
          />

          {/* Loading overlay */}
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-card">
              <div className="text-muted-foreground animate-pulse">Loading map...</div>
            </div>
          )}
        </motion.div>

        {/* Map Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Counties", value: "47" },
            { label: "Total Area", value: "580,367 km²" },
            { label: "Major Cities", value: "12" },
            { label: "Data Points", value: "2.4M+" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 rounded-xl bg-card/50 border border-border/50"
            >
              <p className="text-2xl font-display font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KenyaMap;
