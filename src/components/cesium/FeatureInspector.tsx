import { motion } from "framer-motion";
import { 
  X, 
  MapPin, 
  Building2, 
  Mountain, 
  Droplets, 
  TreePine, 
  Plane,
  ExternalLink,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { kenyaLocations } from "./CesiumViewer";

interface FeatureInspectorProps {
  location: typeof kenyaLocations[0] | null;
  onClose: () => void;
  onNavigate: () => void;
}

const typeIcons: Record<string, React.ElementType> = {
  capital: Building2,
  city: MapPin,
  port: Building2,
  landmark: Mountain,
  water: Droplets,
  park: TreePine,
  infrastructure: Plane,
  county: MapPin,
};

const typeColors: Record<string, string> = {
  capital: "text-kenya-gold",
  city: "text-primary",
  port: "text-cyan-400",
  landmark: "text-orange-400",
  water: "text-blue-400",
  park: "text-green-400",
  infrastructure: "text-purple-400",
  county: "text-secondary",
};

const FeatureInspector = ({ location, onClose, onNavigate }: FeatureInspectorProps) => {
  if (!location) return null;

  const Icon = typeIcons[location.type] || MapPin;
  const colorClass = typeColors[location.type] || "text-primary";

  // Generate OSM query URL for the location
  const osmUrl = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}&zoom=14`;
  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(location.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      className="glass-panel p-4 w-72"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg bg-card ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-foreground">{location.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{location.type}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Latitude</span>
          <span className="text-foreground font-mono">{location.lat.toFixed(4)}°</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Longitude</span>
          <span className="text-foreground font-mono">{location.lng.toFixed(4)}°</span>
        </div>
        {location.population && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Population</span>
            <span className="text-foreground">{location.population}</span>
          </div>
        )}
        {location.elevation && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Elevation</span>
            <span className="text-foreground">{location.elevation}</span>
          </div>
        )}
        {location.area && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Area</span>
            <span className="text-foreground">{location.area}</span>
          </div>
        )}
        {(location as any).code && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Code</span>
            <span className="text-foreground">{(location as any).code}</span>
          </div>
        )}
        {(location as any).capacity && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Capacity</span>
            <span className="text-foreground">{(location as any).capacity}</span>
          </div>
        )}
        {(location as any).length && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Length</span>
            <span className="text-foreground">{(location as any).length}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="metric" size="sm" className="flex-1 gap-2" onClick={onNavigate}>
          <Navigation className="w-3 h-3" />
          Fly to
        </Button>
        <a
          href={osmUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-card hover:bg-muted transition-colors text-muted-foreground"
        >
          <ExternalLink className="w-3 h-3" />
          OSM
        </a>
        <a
          href={wikipediaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg bg-card hover:bg-muted transition-colors text-muted-foreground"
        >
          <ExternalLink className="w-3 h-3" />
          Wiki
        </a>
      </div>

      {/* Data source notice */}
      <div className="mt-3 pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          Data from OpenStreetMap • Free & open-source
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureInspector;
