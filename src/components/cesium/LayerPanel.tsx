import { motion } from "framer-motion";
import { 
  Layers, 
  Building2, 
  Route, 
  Train, 
  Droplets, 
  Trees, 
  Map, 
  Mountain,
  Satellite,
  MapPin,
  Plane,
  Ship,
  Activity,
  Leaf,
  Waves,
  Bus,
  SunMedium
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Layer {
  id: string;
  name: string;
  enabled: boolean;
  type: "imagery" | "vector" | "terrain" | "model";
  source: string;
}

interface LayerPanelProps {
  layers: Layer[];
  onToggleLayer: (layerId: string) => void;
}

const layerIcons: Record<string, React.ElementType> = {
  osm: MapPin,
  sentinel: Satellite,
  buildings: Building2,
  roads: Route,
  railways: Train,
  water: Droplets,
  landuse: Trees,
  admin: Map,
  terrain: Mountain,
  traffic_sim: Activity,
  ndvi_layer: Leaf,
  aviation: Plane,
  maritime: Ship,
  maxar: Satellite,
  highres: Globe,
  matatu: Bus,
  flood: Waves,
};

const LayerPanel = ({ layers, onToggleLayer }: LayerPanelProps) => {
  const imageryLayers = layers.filter((l) => l.type === "imagery");
  const vectorLayers = layers.filter((l) => l.type === "vector");
  const modelLayers = layers.filter((l) => l.type === "model");
  const terrainLayers = layers.filter((l) => l.type === "terrain");

  const renderLayerGroup = (title: string, groupLayers: Layer[]) => (
    <div className="mb-4">
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {title}
      </h4>
      <div className="space-y-2">
        {groupLayers.map((layer) => {
          const Icon = layerIcons[layer.id] || Layers;
          return (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-2 rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${layer.enabled ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-sm ${layer.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                    {layer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{layer.source}</p>
                </div>
              </div>
              <Switch
                checked={layer.enabled}
                onCheckedChange={() => onToggleLayer(layer.id)}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="glass-panel p-4 max-h-[400px] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-foreground">Layers</h3>
      </div>

      {renderLayerGroup("Imagery", imageryLayers)}
      {modelLayers.length > 0 && renderLayerGroup("3D Models", modelLayers)}
      {renderLayerGroup("Vector Data (OSM)", vectorLayers)}
      {terrainLayers.length > 0 && renderLayerGroup("Terrain", terrainLayers)}

      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">
          All data sources are free and open-source. No paid APIs or Cesium Ion required.
        </p>
      </div>
    </div>
  );
};

export default LayerPanel;
