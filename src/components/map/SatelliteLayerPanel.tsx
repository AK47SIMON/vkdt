import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Satellite, X, Eye, EyeOff, Globe, Map as MapIcon, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface SatelliteLayer {
  id: string;
  name: string;
  provider: string;
  description: string;
  url: string;
  attribution: string;
  enabled: boolean;
  resolution?: string;
}

interface SatelliteLayerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  layers: SatelliteLayer[];
  onToggleLayer: (layerId: string) => void;
  onSelectBaseLayer: (layerId: string) => void;
  activeBaseLayer: string;
}

const baseLayers = [
  {
    id: "osm-standard",
    name: "OpenStreetMap",
    icon: MapIcon,
    description: "Standard street map with detailed buildings"
  },
  {
    id: "osm-humanitarian",
    name: "Humanitarian OSM",
    icon: Globe,
    description: "Detailed humanitarian mapping data"
  },
  {
    id: "terrain",
    name: "Terrain View",
    icon: Mountain,
    description: "Topographic terrain visualization"
  },
  {
    id: "satellite-sentinel",
    name: "Sentinel-2 Satellite",
    icon: Satellite,
    description: "ESA Copernicus satellite imagery"
  }
];

const SatelliteLayerPanel = ({
  isOpen,
  onClose,
  layers,
  onToggleLayer,
  onSelectBaseLayer,
  activeBaseLayer
}: SatelliteLayerPanelProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute top-4 left-20 z-[1001] w-72 glass-panel p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-foreground text-sm">Layer Control</h4>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Base Layers */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Base Map</p>
            <div className="space-y-1">
              {baseLayers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => onSelectBaseLayer(layer.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    activeBaseLayer === layer.id
                      ? "bg-primary/20 border border-primary/30"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <layer.icon className={`w-4 h-4 ${activeBaseLayer === layer.id ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <p className={`text-xs font-medium ${activeBaseLayer === layer.id ? "text-primary" : "text-foreground"}`}>
                      {layer.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{layer.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Overlay Layers */}
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Overlays</p>
            <div className="space-y-2">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                >
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground">{layer.name}</p>
                    <p className="text-[10px] text-muted-foreground">{layer.provider}</p>
                    {layer.resolution && (
                      <span className="text-[9px] text-primary">{layer.resolution}</span>
                    )}
                  </div>
                  <Switch
                    checked={layer.enabled}
                    onCheckedChange={() => onToggleLayer(layer.id)}
                    className="scale-75"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 pt-3 border-t border-border/50">
            <p className="text-[10px] text-muted-foreground">
              Data sources: OpenStreetMap, Copernicus Sentinel-2, USGS, SRTM DEM
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SatelliteLayerPanel;
