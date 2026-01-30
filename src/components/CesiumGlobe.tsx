import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Layers, Maximize2, ShieldCheck, Zap, Brain, Leaf, Plane, Ship, Satellite, Waves, Bus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CesiumViewer, { kenyaLocations, defaultLayers } from "./cesium/CesiumViewer";
import LayerPanel from "./cesium/LayerPanel";
import SearchPanel from "./cesium/SearchPanel";
import FeatureInspector from "./cesium/FeatureInspector";

const CesiumGlobe = () => {
  const [layers, setLayers] = useState(defaultLayers);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<typeof kenyaLocations[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleLayer = useCallback((layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  }, []);

  const handleLocationSelect = useCallback((location: typeof kenyaLocations[0]) => {
    setSelectedLocation(location);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleNavigate = useCallback(() => {
    if (selectedLocation) {
      setSearchQuery(selectedLocation.name);
    }
  }, [selectedLocation]);

  const trafficLayer = layers.find(l => l.id === "traffic_sim")?.enabled;
  const ndviLayer = layers.find(l => l.id === "ndvi_layer")?.enabled;
  const aviationLayer = layers.find(l => l.id === "aviation")?.enabled;
  const maritimeLayer = layers.find(l => l.id === "maritime")?.enabled;

  return (
    <section id="globe" className="relative py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Brain className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-xs text-primary font-medium uppercase tracking-wider">
              Open-Source 3D Digital Twin
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sovereign Kenya 3D Twin
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            100% open-source 3D visualization with real OSM buildings, live aviation tracking, and AI simulations. Zero proprietary APIs.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[
              { label: "OSM 3D Buildings", active: true, icon: Globe },
              { label: "Maxar Premium (Free)", active: layers.find(l => l.id === "maxar")?.enabled, icon: Satellite },
              { label: "Live Aviation (OpenSky)", active: aviationLayer, icon: Plane },
              { label: "Matatu Pulse", active: layers.find(l => l.id === "matatu")?.enabled, icon: Bus },
              { label: "Flood Risk (Itzi)", active: layers.find(l => l.id === "flood")?.enabled, icon: Waves },
              { label: "Zero API Cost", active: true, icon: ShieldCheck },
            ].map((badge) => (
              <span
                key={badge.label}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  badge.active
                    ? "bg-primary/10 border border-primary/30 text-primary shadow-glow"
                    : "bg-muted border border-border text-muted-foreground"
                }`}
              >
                <badge.icon className="w-3 h-3" />
                {badge.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Main Viewer Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`relative rounded-3xl overflow-hidden border border-border glow-border bg-card ${
            isFullscreen ? "fixed inset-4 z-50" : ""
          }`}
        >
          {/* Search Bar - Top Center */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-80">
            <SearchPanel onSearch={handleSearch} onLocationSelect={handleLocationSelect} />
          </div>

          {/* Controls - Top Left */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <Button
              variant="metric"
              size="sm"
              className="gap-2 bg-card/80 backdrop-blur-xl border-border/50"
              onClick={() => setShowLayerPanel(!showLayerPanel)}
            >
              <Layers className="w-4 h-4" />
              Layers
            </Button>
            <Button
              variant="metric"
              size="icon"
              className="h-8 w-8 bg-card/80 backdrop-blur-xl border-border/50"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Real-time Indicator - Top Right */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-xl border border-border/50">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Live Data</span>
          </div>

          {/* Layer Panel - Left Side */}
          <AnimatePresence>
            {showLayerPanel && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute top-20 left-4 z-20"
              >
                <LayerPanel layers={layers} onToggleLayer={handleToggleLayer} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feature Inspector - Right Side */}
          <AnimatePresence>
            {selectedLocation && (
              <div className="absolute top-20 right-4 z-20">
                <FeatureInspector
                  location={selectedLocation}
                  onClose={() => setSelectedLocation(null)}
                  onNavigate={handleNavigate}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Cesium 3D Viewer */}
          <div className={`${isFullscreen ? "h-full" : "h-[650px]"} w-full`}>
            <CesiumViewer
              layers={layers}
              searchQuery={searchQuery}
              onLocationSelect={handleLocationSelect}
            />
          </div>

          {/* Urban Analytics Overlay - Bottom Center */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3 px-4 py-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50">
            <div className="flex items-center gap-2 border-r border-border/50 pr-3">
              <Zap className="w-3.5 h-3.5 text-kenya-gold" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Grid Load</span>
                <span className="text-xs font-bold text-foreground">2.4 GW</span>
              </div>
            </div>
            <div className="flex items-center gap-2 border-r border-border/50 pr-3">
              <Leaf className="w-3.5 h-3.5 text-green-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">NDVI</span>
                <span className="text-xs font-bold text-foreground">0.72</span>
              </div>
            </div>
            <div className="flex items-center gap-2 border-r border-border/50 pr-3">
              <Plane className="w-3.5 h-3.5 text-kenya-gold" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Aircraft</span>
                <span className="text-xs font-bold text-foreground">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Ship className="w-3.5 h-3.5 text-cyan-500" />
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Vessels</span>
                <span className="text-xs font-bold text-foreground">5</span>
              </div>
            </div>
          </div>

          {/* Data Sources - Bottom Left */}
          <div className="absolute bottom-4 left-4 z-20">
            <p className="text-[10px] font-bold text-muted-foreground bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/50 uppercase tracking-widest">
              OSM • OpenSky • Sentinel-2 • NASA NDVI
            </p>
          </div>
        </motion.div>

        {/* Open Source Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl">
              <span className="text-foreground font-bold">100% Sovereign Architecture:</span> Built entirely on open-source tools and free data. 
              No Cesium Ion, no Google Maps, no Mapbox—complete national control over geospatial intelligence.
            </p>
          </div>
          <Button variant="outline" size="sm" className="whitespace-nowrap">View Tech Stack</Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CesiumGlobe;
