import { useEffect, useRef, useState, useCallback } from "react";
import * as CesiumModule from "cesium";



// Kenya bounding box
const KENYA_BOUNDS = {
  west: 33.9,
  south: -4.7,
  east: 41.9,
  north: 5.0,
  center: { lat: -1.2921, lng: 36.8219 },
};

// Kenyan locations for search
export const kenyaLocations = [
  { name: "Nairobi", lat: -1.2921, lng: 36.8219, type: "capital", population: "4.4M" },
  { name: "Mombasa", lat: -4.0435, lng: 39.6682, type: "port", population: "1.2M" },
  { name: "Kisumu", lat: -0.1022, lng: 34.7617, type: "city", population: "500K" },
  { name: "Nakuru", lat: -0.3031, lng: 36.0800, type: "city", population: "570K" },
  { name: "Eldoret", lat: 0.5143, lng: 35.2698, type: "city", population: "475K" },
  { name: "Mount Kenya", lat: -0.1521, lng: 37.3084, type: "landmark", elevation: "5,199m" },
  { name: "Lake Victoria", lat: -0.4, lng: 34.0, type: "water", area: "68,800 km²" },
  { name: "Lake Nakuru", lat: -0.3667, lng: 36.0833, type: "water", area: "40 km²" },
  { name: "Maasai Mara", lat: -1.5, lng: 35.1, type: "park", area: "1,510 km²" },
  { name: "Tsavo National Park", lat: -2.8833, lng: 38.4667, type: "park", area: "21,812 km²" },
  { name: "Nairobi National Park", lat: -1.3733, lng: 36.8581, type: "park", area: "117 km²" },
  { name: "Jomo Kenyatta International Airport", lat: -1.3192, lng: 36.9278, type: "infrastructure", code: "NBO" },
  { name: "Port of Mombasa", lat: -4.0650, lng: 39.6583, type: "infrastructure", capacity: "1.4M TEU" },
  { name: "SGR Mombasa-Nairobi", lat: -2.5, lng: 38.0, type: "infrastructure", length: "472 km" },
  { name: "Thika Town", lat: -1.0334, lng: 37.0692, type: "city", population: "200K" },
  { name: "Malindi", lat: -3.2138, lng: 40.1169, type: "city", population: "120K" },
  { name: "Lamu", lat: -2.2686, lng: 40.9020, type: "city", population: "25K" },
  { name: "Turkana", lat: 3.1167, lng: 35.6000, type: "county", area: "68,680 km²" },
  { name: "Hell's Gate", lat: -0.9167, lng: 36.3167, type: "park", area: "68 km²" },
  { name: "Amboseli", lat: -2.6527, lng: 37.2606, type: "park", area: "392 km²" },
  { name: "KICC", lat: -1.2863, lng: 36.8219, type: "landmark", height: "105m" },
  { name: "Upper Hill Nairobi", lat: -1.2990, lng: 36.8150, type: "district", area: "2.5 km²" },
];

export interface Layer {
  id: string;
  name: string;
  enabled: boolean;
  type: "imagery" | "vector" | "terrain" | "model";
  source: string;
}

export const defaultLayers: Layer[] = [
  { id: "osm", name: "OpenStreetMap", enabled: true, type: "imagery", source: "OSM" },
  { id: "sentinel", name: "Sentinel-2 WMS", enabled: false, type: "imagery", source: "Copernicus" },
  { id: "buildings", name: "3D Buildings (OSM)", enabled: true, type: "model", source: "OSM" },
  { id: "roads", name: "Roads & Highways", enabled: true, type: "vector", source: "OSM" },
  { id: "railways", name: "Railways", enabled: true, type: "vector", source: "OSM" },
  { id: "water", name: "Water Bodies", enabled: true, type: "vector", source: "OSM" },
  { id: "landuse", name: "Land Use", enabled: false, type: "vector", source: "OSM" },
  { id: "admin", name: "Admin Boundaries", enabled: true, type: "vector", source: "OSM" },
  { id: "traffic_sim", name: "Traffic Simulation", enabled: true, type: "vector", source: "SUMO" },
  { id: "ndvi_layer", name: "NDVI Greenery", enabled: false, type: "imagery", source: "NASA" },
  { id: "aviation", name: "Live Aviation", enabled: false, type: "vector", source: "OpenSky" },
  { id: "maritime", name: "Maritime AIS", enabled: false, type: "vector", source: "OpenAIS" },
  { id: "maxar", name: "Maxar Premium", enabled: false, type: "imagery", source: "Maxar (Free)" },
  { id: "highres", name: "5m High Resolution", enabled: false, type: "imagery", source: "OpenData" },
  { id: "matatu", name: "Matatu Flow", enabled: false, type: "vector", source: "Digital Matatus" },
  { id: "flood", name: "Flood Risk", enabled: false, type: "imagery", source: "Fast Flood" },
];

interface OSMBuilding {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
  nodes?: number[];
  height?: number;
}

interface CesiumViewerProps {
  onLocationSelect?: (location: typeof kenyaLocations[0]) => void;
  layers?: Layer[];
  searchQuery?: string;
}

const CesiumViewer = ({ onLocationSelect, layers = defaultLayers, searchQuery }: CesiumViewerProps) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const dataSourcesRef = useRef<Map<string, Cesium.DataSource | Cesium.PrimitiveCollection>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStatus, setLoadingStatus] = useState("Initializing...");

  // Fetch OSM buildings via Overpass API and render as 3D extrusions
  const loadOSMBuildings = useCallback(async (viewer: Cesium.Viewer, bounds: { west: number; south: number; east: number; north: number }) => {
    setLoadingStatus("Fetching OSM buildings...");
    
    try {
      const query = `[out:json][timeout:30];
        (
          way["building"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
        );
        out body;
        >;
        out skel qt;`;

      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();

      // Parse nodes into coordinate lookup
      const nodes: Record<number, [number, number]> = {};
      data.elements.filter((e: any) => e.type === 'node').forEach((n: any) => {
        nodes[n.id] = [n.lon, n.lat];
      });

      // Create building instances
      const buildingInstances: Cesium.GeometryInstance[] = [];
      
      data.elements
        .filter((e: any) => e.type === 'way' && e.nodes && e.tags?.building)
        .forEach((way: any) => {
          const coords = way.nodes.map((id: number) => nodes[id]).filter(Boolean);
          if (coords.length < 3) return;

          // Estimate height from OSM tags or use default
          let height = 12; // Default 4 floors
          if (way.tags['building:levels']) {
            height = parseInt(way.tags['building:levels']) * 3;
          } else if (way.tags.height) {
            height = parseFloat(way.tags.height) || height;
          } else if (way.tags.building === 'house') {
            height = 6;
          } else if (way.tags.building === 'apartments') {
            height = 18;
          } else if (way.tags.building === 'commercial') {
            height = 15;
          } else if (way.tags.building === 'industrial') {
            height = 10;
          }

          try {
            const positions = coords.flatMap((c: [number, number]) => [c[0], c[1]]);
            const polygon = new Cesium.PolygonGeometry({
              polygonHierarchy: new Cesium.PolygonHierarchy(
                Cesium.Cartesian3.fromDegreesArray(positions)
              ),
              height: 0,
              extrudedHeight: height,
              vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
            });

            const geometry = Cesium.PolygonGeometry.createGeometry(polygon);
            if (geometry) {
              buildingInstances.push(new Cesium.GeometryInstance({
                geometry: geometry,
                attributes: {
                  color: Cesium.ColorGeometryInstanceAttribute.fromColor(
                    Cesium.Color.fromCssColorString('#22c55e').withAlpha(0.7)
                  ),
                },
                id: `building_${way.id}`,
              }));
            }
          } catch (e) {
            // Skip invalid geometries
          }
        });

      if (buildingInstances.length > 0) {
        const primitive = new Cesium.Primitive({
          geometryInstances: buildingInstances,
          appearance: new Cesium.PerInstanceColorAppearance({
            flat: false,
            translucent: true,
          }),
          asynchronous: true,
        });

        // Remove old buildings
        const oldBuildings = dataSourcesRef.current.get('buildings');
        if (oldBuildings && oldBuildings instanceof Cesium.PrimitiveCollection) {
          viewer.scene.primitives.remove(oldBuildings);
        }

        const collection = new Cesium.PrimitiveCollection();
        collection.add(primitive);
        viewer.scene.primitives.add(collection);
        dataSourcesRef.current.set('buildings', collection);
        
        setLoadingStatus(`Loaded ${buildingInstances.length} buildings`);
      }
    } catch (err) {
      console.warn("Failed to load OSM buildings:", err);
      setLoadingStatus("OSM buildings unavailable");
    }
  }, []);

  // Fetch roads, railways, water from Overpass and render as polylines/polygons
  const loadOSMVectors = useCallback(async (viewer: Cesium.Viewer, type: string, query: string, color: Cesium.Color, width: number = 2) => {
    try {
      const overpassQuery = `[out:json][timeout:25];${query};out body;>;out skel qt;`;
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
      const data = await response.json();

      const nodes: Record<number, [number, number]> = {};
      data.elements.filter((e: any) => e.type === 'node').forEach((n: any) => {
        nodes[n.id] = [n.lon, n.lat];
      });

      const entities = new Cesium.CustomDataSource(type);

      data.elements
        .filter((e: any) => e.type === 'way' && e.nodes)
        .forEach((way: any) => {
          const coords = way.nodes.map((id: number) => nodes[id]).filter(Boolean);
          if (coords.length < 2) return;

          const positions = Cesium.Cartesian3.fromDegreesArray(coords.flat());
          
          entities.entities.add({
            polyline: {
              positions: positions,
              width: width,
              material: color,
              clampToGround: true,
            },
          });
        });

      // Remove old layer
      const oldData = dataSourcesRef.current.get(type);
      if (oldData && oldData instanceof Cesium.CustomDataSource) {
        viewer.dataSources.remove(oldData);
      }

      await viewer.dataSources.add(entities);
      dataSourcesRef.current.set(type, entities);
    } catch (err) {
      console.warn(`Failed to load OSM ${type}:`, err);
    }
  }, []);

  // Load live aviation data from OpenSky Network
  const loadAviationData = useCallback(async (viewer: Cesium.Viewer) => {
    try {
      setLoadingStatus("Fetching live aviation data...");
      
      // OpenSky Network API - Kenya airspace bounds
      const response = await fetch(
        `https://opensky-network.org/api/states/all?lamin=-5&lomin=33&lamax=5&lomax=42`
      );
      const data = await response.json();

      const aviationSource = new Cesium.CustomDataSource('aviation');

      if (data.states) {
        data.states.forEach((state: any[]) => {
          const [icao24, callsign, origin, timePosition, lastContact, lon, lat, altitude, onGround, velocity, heading] = state;
          
          if (lat && lon && !onGround) {
            aviationSource.entities.add({
              name: callsign?.trim() || icao24,
              position: Cesium.Cartesian3.fromDegrees(lon, lat, (altitude || 10000)),
              billboard: {
                image: 'data:image/svg+xml,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2">
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                  </svg>
                `),
                scale: 1,
                rotation: Cesium.Math.toRadians(heading || 0),
                heightReference: Cesium.HeightReference.NONE,
              },
              label: {
                text: callsign?.trim() || icao24,
                font: '10px sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -20),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 500000),
              },
              description: `
                <div style="font-family: sans-serif; padding: 10px;">
                  <h3 style="margin: 0 0 10px 0; color: #fbbf24;">${callsign || 'Unknown'}</h3>
                  <p>ICAO: ${icao24}</p>
                  <p>Origin: ${origin || 'Unknown'}</p>
                  <p>Altitude: ${Math.round(altitude || 0)}m</p>
                  <p>Velocity: ${Math.round(velocity || 0)} m/s</p>
                  <p>Heading: ${Math.round(heading || 0)}°</p>
                </div>
              `,
            });
          }
        });
      }

      const oldData = dataSourcesRef.current.get('aviation');
      if (oldData && oldData instanceof Cesium.CustomDataSource) {
        viewer.dataSources.remove(oldData);
      }

      await viewer.dataSources.add(aviationSource);
      dataSourcesRef.current.set('aviation', aviationSource);
      setLoadingStatus(`Tracking ${aviationSource.entities.values.length} aircraft`);
    } catch (err) {
      console.warn("Failed to load aviation data:", err);
    }
  }, []);

  // Load maritime AIS data (simulated since real AIS requires subscription)
  const loadMaritimeData = useCallback(async (viewer: Cesium.Viewer) => {
    // Simulated vessel data for Mombasa/Lamu ports
    const vessels = [
      { name: "MV KENYA STAR", lat: -4.05, lng: 39.68, heading: 45, type: "cargo" },
      { name: "AFRICAN QUEEN", lat: -4.08, lng: 39.72, heading: 180, type: "tanker" },
      { name: "MOMBASA EXPRESS", lat: -4.02, lng: 39.65, heading: 270, type: "container" },
      { name: "LAMU TRADER", lat: -2.27, lng: 40.92, heading: 90, type: "cargo" },
      { name: "INDIAN OCEAN", lat: -4.10, lng: 39.80, heading: 135, type: "bulk" },
    ];

    const maritimeSource = new Cesium.CustomDataSource('maritime');

    vessels.forEach((vessel) => {
      maritimeSource.entities.add({
        name: vessel.name,
        position: Cesium.Cartesian3.fromDegrees(vessel.lng, vessel.lat, 0),
        billboard: {
          image: 'data:image/svg+xml,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00bcd4" stroke-width="2">
              <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
              <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
              <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
              <path d="M12 10v4"/>
            </svg>
          `),
          scale: 1.2,
          rotation: Cesium.Math.toRadians(vessel.heading),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
        label: {
          text: vessel.name,
          font: '10px sans-serif',
          fillColor: Cesium.Color.CYAN,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -25),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 200000),
        },
        description: `
          <div style="font-family: sans-serif; padding: 10px;">
            <h3 style="margin: 0 0 10px 0; color: #00bcd4;">${vessel.name}</h3>
            <p>Type: ${vessel.type}</p>
            <p>Heading: ${vessel.heading}°</p>
            <p>Position: ${vessel.lat.toFixed(4)}, ${vessel.lng.toFixed(4)}</p>
          </div>
        `,
      });
    });

    const oldData = dataSourcesRef.current.get('maritime');
    if (oldData && oldData instanceof Cesium.CustomDataSource) {
      viewer.dataSources.remove(oldData);
    }

    await viewer.dataSources.add(maritimeSource);
    dataSourcesRef.current.set('maritime', maritimeSource);
  }, []);

  // Initialize Cesium viewer with 100% open-source configuration
  useEffect(() => {
    if (!cesiumContainer.current || viewerRef.current) return;

    const Cesium = (window as any).Cesium || CesiumModule;

    try {
      // Configure Cesium to work WITHOUT ion (open-source only)
      Cesium.Ion.defaultAccessToken = undefined as any;

      setLoadingStatus("Creating 3D viewer...");
      
      // Create viewer WITHOUT any Cesium Ion dependencies
      const viewer = new Cesium.Viewer(cesiumContainer.current, {
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        infoBox: true,
        selectionIndicator: true,
        shadows: false,
        shouldAnimate: true,
        // Use OpenStreetMap tiles (completely free, no API key)
        baseLayer: new Cesium.ImageryLayer(
          new Cesium.OpenStreetMapImageryProvider({
            url: "https://tile.openstreetmap.org/",
          })
        ),
        // Use ellipsoid terrain (no Ion required) - flat but works
        terrainProvider: new Cesium.EllipsoidTerrainProvider(),
      });

      // Hide Cesium credits for cleaner UI
      const creditContainer = viewer.cesiumWidget.creditContainer as HTMLElement;
      if (creditContainer) {
        creditContainer.style.display = "none";
      }

      // Disable globe depth testing for better building rendering
      viewer.scene.globe.depthTestAgainstTerrain = false;

      // Set initial camera to Nairobi
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          KENYA_BOUNDS.center.lng,
          KENYA_BOUNDS.center.lat,
          50000 // Lower altitude for better building view
        ),
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-45),
          roll: 0,
        },
        duration: 2,
      });

      viewerRef.current = viewer;

      // Add Kenya location markers
      kenyaLocations.forEach((location) => {
        const color = 
          location.type === "capital" ? Cesium.Color.GOLD :
          location.type === "port" ? Cesium.Color.CYAN :
          location.type === "city" ? Cesium.Color.LIME :
          location.type === "landmark" ? Cesium.Color.ORANGE :
          location.type === "water" ? Cesium.Color.BLUE :
          location.type === "park" ? Cesium.Color.GREEN :
          Cesium.Color.WHITE;

        viewer.entities.add({
          name: location.name,
          position: Cesium.Cartesian3.fromDegrees(location.lng, location.lat, 0),
          point: {
            pixelSize: location.type === "capital" ? 15 : 10,
            color: color,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
          label: {
            text: location.name,
            font: "12px sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -15),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 300000),
          },
          description: `
            <div style="font-family: sans-serif; padding: 10px;">
              <h3 style="margin: 0 0 10px 0; color: #22c55e;">${location.name}</h3>
              <p style="margin: 5px 0;">Type: ${location.type}</p>
              ${(location as any).population ? `<p style="margin: 5px 0;">Population: ${(location as any).population}</p>` : ""}
              ${(location as any).elevation ? `<p style="margin: 5px 0;">Elevation: ${(location as any).elevation}</p>` : ""}
              ${(location as any).area ? `<p style="margin: 5px 0;">Area: ${(location as any).area}</p>` : ""}
              <p style="margin: 5px 0;">Coordinates: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</p>
            </div>
          `,
        });
      });

      // Handle entity selection
      viewer.selectedEntityChanged.addEventListener((entity) => {
        if (entity && onLocationSelect) {
          const location = kenyaLocations.find((l) => l.name === entity.name);
          if (location) {
            onLocationSelect(location);
          }
        }
      });

      // Load initial OSM data for Nairobi area
      const nairobiBounds = { 
        west: 36.75, 
        south: -1.35, 
        east: 36.90, 
        north: -1.20 
      };
      
      loadOSMBuildings(viewer, nairobiBounds);

      // Load roads
      loadOSMVectors(
        viewer,
        'roads',
        `way["highway"~"primary|secondary|tertiary|trunk"](-1.35,36.75,-1.20,36.90)`,
        Cesium.Color.YELLOW.withAlpha(0.8),
        3
      );

      // Load railways
      loadOSMVectors(
        viewer,
        'railways',
        `way["railway"="rail"](-5,33,5,42)`,
        Cesium.Color.RED.withAlpha(0.8),
        4
      );

      // Load water bodies
      loadOSMVectors(
        viewer,
        'water',
        `way["natural"="water"](-5,33,5,42)`,
        Cesium.Color.BLUE.withAlpha(0.6),
        2
      );

      setIsLoading(false);
      setLoadingStatus("Ready");

    } catch (err) {
      console.error("Failed to initialize Cesium:", err);
      setError("Failed to load 3D viewer. Please refresh the page.");
      setIsLoading(false);
    }

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [onLocationSelect, loadOSMBuildings, loadOSMVectors]);

  // Handle layer visibility changes
  useEffect(() => {
    if (!viewerRef.current) return;
    const viewer = viewerRef.current;

    layers.forEach((layer) => {
      const dataSource = dataSourcesRef.current.get(layer.id);
      
      if (layer.id === 'buildings') {
        if (dataSource instanceof Cesium.PrimitiveCollection) {
          dataSource.show = layer.enabled;
        }
      } else if (layer.id === 'aviation' && layer.enabled) {
        loadAviationData(viewer);
      } else if (layer.id === 'maritime' && layer.enabled) {
        loadMaritimeData(viewer);
      } else if (layer.id === 'sentinel' && layer.enabled) {
        // Add Sentinel-2 cloudless imagery overlay
        try {
          const sentinelProvider = new Cesium.UrlTemplateImageryProvider({
            url: "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg",
            maximumLevel: 14,
            credit: "© EOX - Sentinel-2 cloudless"
          });
          viewer.imageryLayers.addImageryProvider(sentinelProvider);
        } catch (e) {
          console.warn("Sentinel imagery unavailable");
        }
      } else if (layer.id === 'ndvi_layer' && layer.enabled) {
        // Add NASA NDVI layer
        try {
          const ndviProvider = new Cesium.WebMapServiceImageryProvider({
            url: "https://neo.gsfc.nasa.gov/wms/wms",
            layers: "MOD_NDVI_M",
            parameters: {
              transparent: true,
              format: "image/png",
            },
          });
          viewer.imageryLayers.addImageryProvider(ndviProvider);
        } catch (e) {
          console.warn("NDVI layer unavailable");
        }
      } else if (layer.id === 'maxar' && layer.enabled) {
        try {
          const maxarProvider = new Cesium.UrlTemplateImageryProvider({
            url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            maximumLevel: 19,
            credit: "© Maxar, Esri"
          });
          viewer.imageryLayers.addImageryProvider(maxarProvider);
        } catch (e) {
          console.warn("Maxar imagery unavailable");
        }
      } else if (layer.id === 'highres' && layer.enabled) {
        try {
          const highResProvider = new Cesium.UrlTemplateImageryProvider({
            url: "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg",
            maximumLevel: 16,
            credit: "© EOX 5m Optimized"
          });
          viewer.imageryLayers.addImageryProvider(highResProvider);
        } catch (e) {
          console.warn("High-res imagery unavailable");
        }
      } else if (layer.id === 'flood' && layer.enabled) {
        try {
          const floodProvider = new Cesium.WebMapServiceImageryProvider({
            url: "https://sedac.ciesin.columbia.edu/geoserver/wms",
            layers: "ndh:ndh-flood-hazard-proxies",
            parameters: {
              transparent: true,
              format: "image/png",
            },
          });
          viewer.imageryLayers.addImageryProvider(floodProvider);
        } catch (e) {
          console.warn("Flood layer unavailable");
        }
      } else if (dataSource instanceof Cesium.CustomDataSource) {
        dataSource.show = layer.enabled;
      }
    });
  }, [layers, loadAviationData, loadMaritimeData]);

  // Handle search
  const flyToLocation = useCallback((location: typeof kenyaLocations[0]) => {
    if (!viewerRef.current) return;
    
    viewerRef.current.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        location.lng,
        location.lat,
        location.type === "city" || location.type === "capital" ? 30000 : 80000
      ),
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
      duration: 1.5,
    });
  }, []);

  useEffect(() => {
    if (!searchQuery || !viewerRef.current) return;
    
    const location = kenyaLocations.find(
      (l) => l.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (location) {
      flyToLocation(location);
      onLocationSelect?.(location);
    }
  }, [searchQuery, flyToLocation, onLocationSelect]);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-card/50 rounded-lg">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/90 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">{loadingStatus}</p>
          </div>
        </div>
      )}
      <div ref={cesiumContainer} className="h-full w-full" />
    </div>
  );
};

export default CesiumViewer;
