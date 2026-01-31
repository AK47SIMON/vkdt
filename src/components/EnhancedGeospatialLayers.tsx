/**
 * Enhanced Geospatial Layers Module
 * Integrates world-class, free high-resolution imagery and advanced OSM features
 * Supports Sentinel-2, Maxar Open Data, and advanced vector layers
 */

export interface GeospatialLayer {
  id: string;
  name: string;
  type: "imagery" | "vector" | "dem" | "composite";
  source: string;
  url?: string;
  resolution: string; // e.g., "5m", "10m", "30m"
  provider: string;
  apiKey?: string; // null for free layers
  enabled: boolean;
  opacity: number;
  zIndex: number;
  description: string;
  coverage: string; // e.g., "Global", "Africa", "Kenya"
}

/**
 * World-Class Free Geospatial Data Sources
 * All require NO API keys
 */
export const worldClassLayers: GeospatialLayer[] = [
  // High-Resolution Satellite Imagery
  {
    id: "sentinel2-true-color",
    name: "Sentinel-2 True Color (10m)",
    type: "imagery",
    source: "Copernicus/ESA",
    resolution: "10m",
    provider: "EOX",
    url: "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg",
    enabled: false,
    opacity: 0.8,
    zIndex: 10,
    description: "Cloud-free Sentinel-2 satellite imagery with true color rendering",
    coverage: "Global",
  },

  {
    id: "maxar-open-data",
    name: "Maxar Open Data (5m)",
    type: "imagery",
    source: "Maxar/USGS",
    resolution: "5m",
    provider: "Esri",
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    enabled: false,
    opacity: 0.85,
    zIndex: 11,
    description: "High-resolution Maxar satellite imagery for detailed urban analysis",
    coverage: "Global",
  },

  {
    id: "planet-basemap",
    name: "Planet Basemap (3m)",
    type: "imagery",
    source: "Planet Labs",
    resolution: "3m",
    provider: "Planet",
    url: "https://tiles.planet.com/basemaps/v1/planet-tiles/global_monthly_2020_01_mosaic/gee",
    enabled: false,
    opacity: 0.8,
    zIndex: 12,
    description: "Planet Labs global monthly mosaic with 3m resolution",
    coverage: "Global",
  },

  // Digital Elevation Models
  {
    id: "srtm-dem",
    name: "SRTM DEM (30m)",
    type: "dem",
    source: "USGS",
    resolution: "30m",
    provider: "USGS",
    url: "https://cloud.sdsc.edu/v1/AUTH_ogc/Raster/SRTM_GL30/SRTM_GL30.geotiff",
    enabled: false,
    opacity: 0.6,
    zIndex: 5,
    description: "Shuttle Radar Topography Mission digital elevation model",
    coverage: "Global",
  },

  {
    id: "gebco-bathymetry",
    name: "GEBCO Bathymetry (15 arc-sec)",
    type: "dem",
    source: "GEBCO",
    resolution: "15 arc-sec",
    provider: "GEBCO",
    url: "https://www.gebco.net/data_and_products/gridded_bathymetry_data/",
    enabled: false,
    opacity: 0.5,
    zIndex: 4,
    description: "General Bathymetric Chart of the Oceans",
    coverage: "Global",
  },

  // Vegetation and Environmental Layers
  {
    id: "ndvi-modis",
    name: "NDVI - MODIS (250m)",
    type: "imagery",
    source: "NASA",
    resolution: "250m",
    provider: "NASA",
    url: "https://neo.gsfc.nasa.gov/wms/wms",
    enabled: false,
    opacity: 0.6,
    zIndex: 8,
    description: "Normalized Difference Vegetation Index from MODIS satellite",
    coverage: "Global",
  },

  {
    id: "lulc-esri",
    name: "Land Use/Land Cover (10m)",
    type: "imagery",
    source: "Esri/USGS",
    resolution: "10m",
    provider: "Esri",
    url: "https://www.arcgis.com/sharing/rest/content/items/d6642f8a4f6d4685a24ae2dc0c6367ca",
    enabled: false,
    opacity: 0.7,
    zIndex: 9,
    description: "Global land use and land cover classification",
    coverage: "Global",
  },

  // Advanced OSM Vector Layers
  {
    id: "osm-buildings-3d",
    name: "OSM 3D Buildings",
    type: "vector",
    source: "OpenStreetMap",
    resolution: "Building-level",
    provider: "OSM/Overpass",
    enabled: true,
    opacity: 0.8,
    zIndex: 20,
    description: "3D building footprints and heights from OpenStreetMap",
    coverage: "Global",
  },

  {
    id: "osm-roads-detailed",
    name: "OSM Roads (Detailed)",
    type: "vector",
    source: "OpenStreetMap",
    resolution: "Road-level",
    provider: "OSM/Overpass",
    enabled: true,
    opacity: 0.9,
    zIndex: 15,
    description: "Detailed road network with classification (primary, secondary, etc.)",
    coverage: "Global",
  },

  {
    id: "osm-poi",
    name: "OSM Points of Interest",
    type: "vector",
    source: "OpenStreetMap",
    resolution: "Point-level",
    provider: "OSM/Overpass",
    enabled: false,
    opacity: 0.8,
    zIndex: 18,
    description: "Hospitals, schools, shops, restaurants, and other POIs",
    coverage: "Global",
  },

  {
    id: "osm-utilities",
    name: "OSM Utilities (Power, Water)",
    type: "vector",
    source: "OpenStreetMap",
    resolution: "Infrastructure-level",
    provider: "OSM/Overpass",
    enabled: false,
    opacity: 0.7,
    zIndex: 16,
    description: "Power lines, water pipes, and utility infrastructure",
    coverage: "Global",
  },

  {
    id: "osm-landuse",
    name: "OSM Land Use Zones",
    type: "vector",
    source: "OpenStreetMap",
    resolution: "Zone-level",
    provider: "OSM/Overpass",
    enabled: false,
    opacity: 0.5,
    zIndex: 7,
    description: "Residential, commercial, industrial, and other land use zones",
    coverage: "Global",
  },

  // Climate and Hazard Layers
  {
    id: "flood-risk-sedac",
    name: "Flood Risk (SEDAC)",
    type: "imagery",
    source: "SEDAC/Columbia",
    resolution: "1km",
    provider: "SEDAC",
    url: "https://sedac.ciesin.columbia.edu/geoserver/wms",
    enabled: false,
    opacity: 0.6,
    zIndex: 13,
    description: "Flood hazard and risk assessment from SEDAC",
    coverage: "Global",
  },

  {
    id: "drought-risk-nasa",
    name: "Drought Risk (NASA)",
    type: "imagery",
    source: "NASA",
    resolution: "1km",
    provider: "NASA",
    url: "https://eosdis.nasa.gov/",
    enabled: false,
    opacity: 0.6,
    zIndex: 13,
    description: "Drought risk and vegetation stress monitoring",
    coverage: "Global",
  },

  {
    id: "air-quality-wms",
    name: "Air Quality (Sentinel-5P)",
    type: "imagery",
    source: "Copernicus/ESA",
    resolution: "5.5km",
    provider: "ESA",
    url: "https://wms.sentinel-hub.com/v1/wms",
    enabled: false,
    opacity: 0.6,
    zIndex: 12,
    description: "Air quality indicators (NO2, O3, PM2.5) from Sentinel-5P",
    coverage: "Global",
  },

  // Composite Layers
  {
    id: "false-color-nir",
    name: "False Color (NIR)",
    type: "composite",
    source: "Sentinel-2",
    resolution: "10m",
    provider: "EOX",
    enabled: false,
    opacity: 0.8,
    zIndex: 11,
    description: "False color composite highlighting vegetation (NIR-Red-Green)",
    coverage: "Global",
  },

  {
    id: "swir-composite",
    name: "SWIR Composite (Moisture)",
    type: "composite",
    source: "Sentinel-2",
    resolution: "20m",
    provider: "EOX",
    enabled: false,
    opacity: 0.8,
    zIndex: 10,
    description: "Short-wave infrared composite for moisture and geology analysis",
    coverage: "Global",
  },
];

/**
 * Kenya-Specific Enhanced Layers
 */
export const kenyaEnhancedLayers: GeospatialLayer[] = [
  {
    id: "kenya-ndvi-monthly",
    name: "Kenya NDVI (Monthly)",
    type: "imagery",
    source: "NASA/MODIS",
    resolution: "250m",
    provider: "NASA",
    enabled: false,
    opacity: 0.7,
    zIndex: 9,
    description: "Monthly NDVI data for vegetation monitoring across Kenya",
    coverage: "Kenya",
  },

  {
    id: "kenya-rainfall-seasonal",
    name: "Kenya Rainfall (Seasonal)",
    type: "imagery",
    source: "NOAA",
    resolution: "5km",
    provider: "NOAA",
    enabled: false,
    opacity: 0.6,
    zIndex: 8,
    description: "Seasonal rainfall patterns and precipitation anomalies",
    coverage: "Kenya",
  },

  {
    id: "kenya-urban-extent",
    name: "Kenya Urban Extent",
    type: "vector",
    source: "GHSL/ESA",
    resolution: "100m",
    provider: "ESA",
    enabled: false,
    opacity: 0.7,
    zIndex: 14,
    description: "Built-up areas and urban extent mapping",
    coverage: "Kenya",
  },

  {
    id: "kenya-protected-areas",
    name: "Kenya Protected Areas",
    type: "vector",
    source: "WDPA",
    resolution: "Park-level",
    provider: "UNEP",
    enabled: true,
    opacity: 0.5,
    zIndex: 6,
    description: "National parks, reserves, and protected areas",
    coverage: "Kenya",
  },

  {
    id: "kenya-infrastructure",
    name: "Kenya Infrastructure Network",
    type: "vector",
    source: "OSM",
    resolution: "Infrastructure-level",
    provider: "OSM",
    enabled: false,
    opacity: 0.8,
    zIndex: 17,
    description: "Roads, railways, airports, ports, and utilities",
    coverage: "Kenya",
  },

  {
    id: "kenya-administrative",
    name: "Kenya Administrative Boundaries",
    type: "vector",
    source: "OSM",
    resolution: "County-level",
    provider: "OSM",
    enabled: true,
    opacity: 0.6,
    zIndex: 5,
    description: "County and sub-county administrative boundaries",
    coverage: "Kenya",
  },
];

/**
 * Layer Category Groupings
 */
export const layerCategories = {
  satellite: {
    name: "High-Resolution Satellite",
    description: "5-30m resolution satellite imagery",
    layers: ["sentinel2-true-color", "maxar-open-data", "planet-basemap"],
  },
  vegetation: {
    name: "Vegetation & Environment",
    description: "NDVI, land use, and environmental monitoring",
    layers: ["ndvi-modis", "lulc-esri", "kenya-ndvi-monthly"],
  },
  vector: {
    name: "Vector Data (OSM)",
    description: "Buildings, roads, POIs, and utilities",
    layers: ["osm-buildings-3d", "osm-roads-detailed", "osm-poi", "osm-utilities", "osm-landuse"],
  },
  hazards: {
    name: "Hazards & Climate",
    description: "Flood, drought, and air quality monitoring",
    layers: ["flood-risk-sedac", "drought-risk-nasa", "air-quality-wms"],
  },
  dem: {
    name: "Elevation & Bathymetry",
    description: "Digital elevation models and ocean depth",
    layers: ["srtm-dem", "gebco-bathymetry"],
  },
  kenya: {
    name: "Kenya-Specific",
    description: "Layers tailored for Kenya analysis",
    layers: ["kenya-ndvi-monthly", "kenya-rainfall-seasonal", "kenya-urban-extent", "kenya-protected-areas", "kenya-infrastructure"],
  },
};

/**
 * Get layer by ID
 */
export function getLayer(id: string): GeospatialLayer | undefined {
  return [...worldClassLayers, ...kenyaEnhancedLayers].find((layer) => layer.id === id);
}

/**
 * Get layers by category
 */
export function getLayersByCategory(category: keyof typeof layerCategories): GeospatialLayer[] {
  const layerIds = layerCategories[category].layers;
  return layerIds
    .map((id) => getLayer(id))
    .filter((layer): layer is GeospatialLayer => layer !== undefined);
}

/**
 * Get all available layers
 */
export function getAllLayers(): GeospatialLayer[] {
  return [...worldClassLayers, ...kenyaEnhancedLayers];
}

/**
 * Get enabled layers
 */
export function getEnabledLayers(): GeospatialLayer[] {
  return getAllLayers().filter((layer) => layer.enabled);
}
