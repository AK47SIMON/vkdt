import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Map, Building2, Satellite as SatelliteIcon, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapControls from "./map/MapControls";
import MapLegend from "./map/MapLegend";
import SatelliteLayerPanel from "./map/SatelliteLayerPanel";
import GoogleMapsPreview from "./map/GoogleMapsPreview";
import BuildingInfoCard from "./map/BuildingInfoCard";

// Major cities and landmarks with detailed building data
const kenyaLocations = [
  { name: "Nairobi", lat: -1.2921, lng: 36.8219, population: "4.4M", type: "capital" },
  { name: "Mombasa", lat: -4.0435, lng: 39.6682, population: "1.2M", type: "major" },
  { name: "Kisumu", lat: -0.1022, lng: 34.7617, population: "1.1M", type: "major" },
  { name: "Nakuru", lat: -0.3031, lng: 36.0800, population: "2.1M", type: "major" },
  { name: "Eldoret", lat: 0.5143, lng: 35.2698, population: "1.1M", type: "major" },
  { name: "KICC Tower", lat: -1.2855, lng: 36.8245, type: "landmark", building: true },
  { name: "Kenyatta University", lat: -1.1807, lng: 36.9357, type: "education", building: true },
  { name: "JKIA Airport", lat: -1.3192, lng: 36.9278, type: "transport", building: true },
  { name: "Mombasa Port", lat: -4.0657, lng: 39.6605, type: "transport", building: true },
];

// Kenya GeoJSON boundaries
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

// Tile layer configurations
const tileLayers = {
  "osm-standard": {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  },
  "osm-humanitarian": {
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution: '© OpenStreetMap contributors, HOT',
    maxZoom: 19
  },
  "terrain": {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '© OpenTopoMap contributors',
    maxZoom: 17
  },
  "satellite-sentinel": {
    url: "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg",
    attribution: '© EOX IT Services GmbH - Sentinel-2 cloudless',
    maxZoom: 15
  }
};

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

const EnhancedKenyaMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const buildingLayerRef = useRef<L.GeoJSON | null>(null);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [activeBaseLayer, setActiveBaseLayer] = useState("osm-standard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);
  const [showGooglePreview, setShowGooglePreview] = useState(false);
  const [isFetchingBuildings, setIsFetchingBuildings] = useState(false);
  
  const [overlayLayers, setOverlayLayers] = useState<SatelliteLayer[]>([
    {
      id: "buildings",
      name: "Building Footprints",
      provider: "OpenStreetMap",
      description: "Detailed building outlines",
      url: "",
      attribution: "OSM",
      enabled: true,
      resolution: "1m"
    },
    {
      id: "sentinel",
      name: "Sentinel-2 Overlay",
      provider: "Copernicus",
      description: "Latest satellite imagery",
      url: "",
      attribution: "ESA",
      enabled: false,
      resolution: "10m"
    },
    {
      id: "usgs",
      name: "USGS Landsat",
      provider: "USGS EarthExplorer",
      description: "High-res terrain data",
      url: "",
      attribution: "USGS",
      enabled: false,
      resolution: "30m"
    }
  ]);

  // Function to fetch buildings from Overpass API
  const fetchBuildings = useCallback(async (bounds: L.LatLngBounds) => {
    if (isFetchingBuildings) return;
    
    const buildingsLayer = overlayLayers.find(l => l.id === "buildings");
    if (!buildingsLayer?.enabled) return;

    // Only fetch at high zoom levels to avoid overloading Overpass
    if (mapInstanceRef.current && mapInstanceRef.current.getZoom() < 16) return;

    setIsFetchingBuildings(true);
    try {
      const south = bounds.getSouth();
      const west = bounds.getWest();
      const north = bounds.getNorth();
      const east = bounds.getEast();

      const query = `[out:json][timeout:25];
        (
          way["building"](${south},${west},${north},${east});
          relation["building"](${south},${west},${north},${east});
        );
        out body;
        >;
        out skel qt;`;

      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();

      // Basic Overpass to GeoJSON conversion
      const nodes: any = {};
      data.elements.filter((e: any) => e.type === 'node').forEach((n: any) => {
        nodes[n.id] = [n.lon, n.lat];
      });

      const features = data.elements
        .filter((e: any) => e.type === 'way' && e.nodes)
        .map((w: any) => ({
          type: "Feature",
          properties: w.tags || {},
          geometry: {
            type: "Polygon",
            coordinates: [w.nodes.map((id: number) => nodes[id]).filter(Boolean)]
          }
        }))
        .filter((f: any) => f.geometry.coordinates[0].length > 0);

      if (mapInstanceRef.current) {
        if (buildingLayerRef.current) {
          mapInstanceRef.current.removeLayer(buildingLayerRef.current);
        }

        buildingLayerRef.current = L.geoJSON({
          type: "FeatureCollection",
          features: features
        } as any, {
          style: {
            color: "#22c55e",
            weight: 1,
            fillColor: "#22c55e",
            fillOpacity: 0.3
          },
          onEachFeature: (feature, layer) => {
            layer.on('click', (e: L.LeafletMouseEvent) => {
              L.DomEvent.stopPropagation(e);
              setSelectedBuilding({
                id: feature.properties.id || Math.random().toString(),
                name: feature.properties.name || "Unnamed Building",
                type: feature.properties.building || "building",
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                features: Object.keys(feature.properties).slice(0, 5),
                area: 'Calculated from OSM'
              });
            });
          }
        }).addTo(mapInstanceRef.current);
      }
    } catch (err) {
      console.warn("Failed to fetch buildings:", err);
    } finally {
      setIsFetchingBuildings(false);
    }
  }, [overlayLayers, isFetchingBuildings]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with higher zoom for micromapping
    const map = L.map(mapRef.current, {
      center: [-1.2921, 36.8219],
      zoom: 14, // Higher zoom for building detail
      zoomControl: false,
      attributionControl: true,
    });

    // Add initial tile layer
    const layer = tileLayers["osm-standard"];
    baseLayerRef.current = L.tileLayer(layer.url, {
      maxZoom: layer.maxZoom,
      attribution: layer.attribution
    }).addTo(map);

    // Add Kenya boundary
    L.geoJSON(kenyaBoundary as any, {
      style: {
        fillColor: '#22c55e',
        fillOpacity: 0.05,
        color: '#22c55e',
        weight: 2,
        opacity: 0.4
      }
    }).addTo(map);

    // Add location markers
    kenyaLocations.forEach(loc => {
      const isBuilding = loc.building;
      const size = loc.type === 'capital' ? 12 : loc.type === 'major' ? 8 : isBuilding ? 10 : 6;
      const color = loc.type === 'capital' ? '#fbbf24' : 
                    loc.type === 'landmark' ? '#3b82f6' :
                    loc.type === 'education' ? '#8b5cf6' :
                    loc.type === 'transport' ? '#f97316' : '#22c55e';
      
      const marker = L.circleMarker([loc.lat, loc.lng], {
        radius: size,
        fillColor: color,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      });

      marker.on('click', () => {
        if (isBuilding) {
          setSelectedBuilding({
            id: loc.name.toLowerCase().replace(/\s/g, '-'),
            name: loc.name,
            type: loc.type,
            lat: loc.lat,
            lng: loc.lng,
            features: ['Landmark', 'Tourism'],
            area: 'N/A'
          });
        } else {
          setSelectedLocation({
            name: loc.name,
            lat: loc.lat,
            lng: loc.lng,
            description: `Population: ${loc.population || 'N/A'}`
          });
        }
      });

      marker.addTo(map);
    });

    // Handle map move to fetch buildings
    map.on('moveend', () => {
      fetchBuildings(map.getBounds());
    });

    mapInstanceRef.current = map;
    setMapLoaded(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [fetchBuildings]);

  // Update base layer when changed
  useEffect(() => {
    if (!mapInstanceRef.current || !baseLayerRef.current) return;
    
    const map = mapInstanceRef.current;
    map.removeLayer(baseLayerRef.current);
    
    const layer = tileLayers[activeBaseLayer as keyof typeof tileLayers];
    if (layer) {
      baseLayerRef.current = L.tileLayer(layer.url, {
        maxZoom: layer.maxZoom,
        attribution: layer.attribution
      }).addTo(map);
    }
  }, [activeBaseLayer]);

  const handleZoomIn = useCallback(() => mapInstanceRef.current?.zoomIn(), []);
  const handleZoomOut = useCallback(() => mapInstanceRef.current?.zoomOut(), []);
  const handleReset = useCallback(() => {
    mapInstanceRef.current?.setView([-1.2921, 36.8219], 14);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const location = kenyaLocations.find(
      loc => loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (location && mapInstanceRef.current) {
      mapInstanceRef.current.setView([location.lat, location.lng], 17);
      setSelectedLocation({
        name: location.name,
        lat: location.lat,
        lng: location.lng
      });
    }
  }, [searchQuery]);

  const handleToggleOverlay = useCallback((layerId: string) => {
    setOverlayLayers(prev => {
      const newLayers = prev.map(layer => 
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      );
      
      // If buildings layer was toggled on, trigger a fetch
      if (layerId === "buildings" && mapInstanceRef.current) {
        const isEnabled = newLayers.find(l => l.id === "buildings")?.enabled;
        if (isEnabled) {
          fetchBuildings(mapInstanceRef.current.getBounds());
        } else if (buildingLayerRef.current) {
          mapInstanceRef.current.removeLayer(buildingLayerRef.current);
          buildingLayerRef.current = null;
        }
      }
      
      return newLayers;
    });
  }, [fetchBuildings]);

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
            <span className="text-xs text-primary font-medium uppercase tracking-wider">Micromapping Technology</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kenya OpenStreetMap Explorer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            High-resolution micromapping with building-level detail. Powered by OpenStreetMap, Sentinel-2, and USGS EarthExplorer data.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSearch}
          className="flex gap-2 max-w-md mx-auto mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search locations, buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
          <Button type="submit" variant="metric">Search</Button>
        </motion.form>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden border border-border glow-border h-[600px]"
        >
          <div ref={mapRef} className="h-full w-full z-0" />
          
          {/* Overlay Controls */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
            <Button
              variant="metric"
              size="sm"
              className="gap-2"
              onClick={() => setShowLayerPanel(!showLayerPanel)}
            >
              <SatelliteIcon className="w-4 h-4" />
              Layers
            </Button>
            <Button
              variant="metric"
              size="icon"
              className="h-8 w-8"
              onClick={handleReset}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <MapControls 
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
          />

          <MapLegend items={[
            { color: "#fbbf24", label: "Capital City" },
            { color: "#22c55e", label: "Major Cities" },
            { color: "#3b82f6", label: "Landmarks" },
            { color: "#8b5cf6", label: "Education" },
            { color: "#f97316", label: "Transport" },
          ]} />

          {showLayerPanel && (
            <div className="absolute top-16 right-4 z-10">
              <SatelliteLayerPanel 
                isOpen={showLayerPanel}
                onClose={() => setShowLayerPanel(false)}
                layers={overlayLayers}
                activeBaseLayer={activeBaseLayer}
                onToggleLayer={handleToggleOverlay}
                onSelectBaseLayer={setActiveBaseLayer}
              />
            </div>
          )}

          {selectedBuilding && (
            <div className="absolute bottom-4 left-4 z-10 w-80">
              <BuildingInfoCard 
                building={selectedBuilding}
                onClose={() => setSelectedBuilding(null)}
              />
            </div>
          )}

          {isFetchingBuildings && (
            <div className="absolute bottom-4 right-4 z-10 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-muted-foreground">Loading OSM features...</span>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedKenyaMap;
