/**
 * Enhanced RT-DKT Lab Module Registry
 * Additions to RTKDTLab.tsx for new real-time and forecasting capabilities
 * 
 * Add these modules to the labModules array in RTKDTLab.tsx
 */

export const enhancedLabModules = [
  {
    id: "realtime-hub",
    name: "Real-Time Data Hub",
    description: "Live streaming of aviation, commodities, energy, traffic, weather, and air quality data. Day-to-day accurate monitoring.",
    icon: "Radio", // lucide-react icon
    color: "#3b82f6",
    category: "spatial",
    status: "active",
  },
  {
    id: "urban-impact",
    name: "Urban Impact Forecaster",
    description: "AI-powered development impact assessment. Simulate economic, environmental, and social effects of new buildings and projects.",
    icon: "Building2",
    color: "#64748b",
    category: "ai",
    status: "active",
  },
  {
    id: "enhanced-geospatial",
    name: "Enhanced Geospatial Layers",
    description: "World-class free satellite imagery (Sentinel-2 5m, Maxar 5m), advanced OSM features, and Kenya-specific layers.",
    icon: "Layers",
    color: "#10b981",
    category: "spatial",
    status: "active",
  },
  {
    id: "traffic-optimizer-ai",
    name: "AI Traffic Optimizer",
    description: "Real-time traffic flow optimization using machine learning. Predict congestion and suggest route alternatives.",
    icon: "Navigation",
    color: "#8b5cf6",
    category: "ai",
    status: "beta",
  },
  {
    id: "water-resource",
    name: "Water Resource Manager",
    description: "Monitor water availability, demand, and quality across Kenya. Forecast droughts and manage water distribution.",
    icon: "Droplets",
    color: "#06b6d4",
    category: "environmental",
    status: "beta",
  },
  {
    id: "renewable-energy",
    name: "Renewable Energy Planner",
    description: "Identify optimal locations for solar, wind, and geothermal projects. Forecast generation and grid integration.",
    icon: "Sun",
    color: "#fbbf24",
    category: "economic",
    status: "beta",
  },
  {
    id: "disaster-response",
    name: "Disaster Response System",
    description: "Real-time disaster monitoring (floods, earthquakes, fires). Coordinate emergency response and evacuation routes.",
    icon: "AlertTriangle",
    color: "#ef4444",
    category: "environmental",
    status: "beta",
  },
  {
    id: "housing-affordability",
    name: "Housing Affordability Index",
    description: "Monitor housing prices, affordability trends, and gentrification risks across Kenya's urban centers.",
    icon: "Home",
    color: "#ec4899",
    category: "economic",
    status: "coming",
  },
  {
    id: "education-access",
    name: "Education Access Mapper",
    description: "Map schools, universities, and training centers. Analyze access gaps and forecast educational needs.",
    icon: "BookOpen",
    color: "#6366f1",
    category: "social",
    status: "coming",
  },
  {
    id: "health-facility-network",
    name: "Health Facility Network",
    description: "Monitor hospitals, clinics, and health centers. Forecast healthcare demand and optimize service delivery.",
    icon: "Heart",
    color: "#f43f5e",
    category: "social",
    status: "coming",
  },
];

/**
 * Integration points for RTKDTLab.tsx
 * 
 * 1. Add to sectionIds mapping:
 * "realtime-hub": "realtime-hub",
 * "urban-impact": "impact-forecaster",
 * "enhanced-geospatial": "globe",
 * "traffic-optimizer-ai": "globe",
 * "water-resource": "environment",
 * "renewable-energy": "economic-dashboard",
 * "disaster-response": "ai-analytics",
 * 
 * 2. Merge enhancedLabModules into labModules array:
 * const labModules: LabModule[] = [
 *   ...existingModules,
 *   ...enhancedLabModules
 * ];
 */
