import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Beaker,
  Globe,
  Map,
  BarChart3,
  Brain,
  Plane,
  Ship,
  Fuel,
  Leaf,
  Building2,
  Zap,
  Radio,
  Search,
  X,
  Maximize2,
  ChevronRight,
  PlayCircle,
  Sparkles,
  Bus,
  Sun,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LabModule {
  id: string;
  name: string;
  description: string;
  icon: typeof Globe;
  color: string;
  category: "spatial" | "economic" | "environmental" | "transport" | "ai";
  status: "active" | "beta" | "coming";
}

const labModules: LabModule[] = [
  {
    id: "3d-twin",
    name: "3D Spatial Twin",
    description: "OpenStreetMap-powered 3D visualization of Kenya with extruded buildings, roads, and infrastructure",
    icon: Globe,
    color: "#22c55e",
    category: "spatial",
    status: "active",
  },
  {
    id: "micromapping",
    name: "Micromapping Explorer",
    description: "Building-level detail mapping with Overpass API real-time data fetching",
    icon: Map,
    color: "#3b82f6",
    category: "spatial",
    status: "active",
  },
  {
    id: "aviation-tracker",
    name: "Live Aviation Tracker",
    description: "Real-time aircraft tracking via OpenSky Network across Kenyan airspace",
    icon: Plane,
    color: "#fbbf24",
    category: "transport",
    status: "active",
  },
  {
    id: "maritime-ais",
    name: "Maritime AIS Monitor",
    description: "Vessel tracking at Mombasa and Lamu ports with AIS data",
    icon: Ship,
    color: "#06b6d4",
    category: "transport",
    status: "active",
  },
  {
    id: "matatu-pulse",
    name: "Matatu Pulse GTFS",
    description: "Real-time Matatu movement simulation using Digital Matatus GTFS data",
    icon: Bus,
    color: "#22c55e",
    category: "transport",
    status: "active",
  },
  {
    id: "fuel-cascade",
    name: "Fuel Price Cascade",
    description: "EPRA-calibrated simulation of fuel price impacts on national economy",
    icon: Fuel,
    color: "#ef4444",
    category: "economic",
    status: "active",
  },
  {
    id: "commodity-tracker",
    name: "Commodity Price Hub",
    description: "Live tea, coffee, maize prices from Mombasa auctions and global markets",
    icon: BarChart3,
    color: "#f97316",
    category: "economic",
    status: "active",
  },
  {
    id: "forex-monitor",
    name: "KES/USD Exchange",
    description: "Real-time exchange rate monitoring with CBK policy correlation",
    icon: Zap,
    color: "#fbbf24",
    category: "economic",
    status: "active",
  },
  {
    id: "ndvi-greenery",
    name: "NDVI Carbon Sink",
    description: "NASA MODIS-powered vegetation health and carbon sink monitoring",
    icon: Leaf,
    color: "#22c55e",
    category: "environmental",
    status: "active",
  },
  {
    id: "energy-grid",
    name: "Energy Grid Dashboard",
    description: "Geothermal, hydro, wind, solar generation monitoring",
    icon: Zap,
    color: "#eab308",
    category: "economic",
    status: "active",
  },
  {
    id: "solar-atlas",
    name: "Solar Potential Map",
    description: "High-resolution solar yield analysis using Global Solar Atlas API",
    icon: Sun,
    color: "#fbbf24",
    category: "environmental",
    status: "active",
  },
  {
    id: "fast-flood",
    name: "Fast Flood (Itzi)",
    description: "Real-time flood inundation simulation using Itzi WASM engine",
    icon: Waves,
    color: "#3b82f6",
    category: "environmental",
    status: "active",
  },
  {
    id: "traffic-sim",
    name: "Traffic Optimizer",
    description: "SUMO-inspired AI traffic simulation for Nairobi corridors",
    icon: Brain,
    color: "#8b5cf6",
    category: "ai",
    status: "beta",
  },
  {
    id: "climate-stress",
    name: "Climate Stress Test",
    description: "Drought, flood, and extreme weather impact simulation",
    icon: Radio,
    color: "#ec4899",
    category: "ai",
    status: "beta",
  },
  {
    id: "urban-planner",
    name: "Urban Impact Analyzer",
    description: "Simulate development impacts on infrastructure, environment, and economy",
    icon: Building2,
    color: "#64748b",
    category: "ai",
    status: "coming",
  },
];

const categories = [
  { id: "all", name: "All Modules" },
  { id: "spatial", name: "Spatial" },
  { id: "economic", name: "Economic" },
  { id: "environmental", name: "Environmental" },
  { id: "transport", name: "Transport" },
  { id: "ai", name: "AI & Simulation" },
];

interface RTKDTLabProps {
  onClose?: () => void;
  isOpen?: boolean;
}

const RTKDTLab = ({ onClose, isOpen = false }: RTKDTLabProps) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedModule, setSelectedModule] = useState<LabModule | null>(null);

  const filteredModules = labModules.filter((module) => {
    const matchesCategory = activeCategory === "all" || module.category === activeCategory;
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLaunchModule = useCallback((module: LabModule) => {
    // Scroll to the corresponding section on the page
    const sectionIds: Record<string, string> = {
      "3d-twin": "globe",
      "micromapping": "map",
      "aviation-tracker": "globe",
      "maritime-ais": "globe",
      "fuel-cascade": "fuel-simulation",
      "commodity-tracker": "economic-dashboard",
      "forex-monitor": "economic-dashboard",
      "ndvi-greenery": "economic-dashboard",
      "energy-grid": "economic-dashboard",
      "traffic-sim": "globe",
      "climate-stress": "ai-analytics",
      "urban-planner": "simulation",
    };

    const sectionId = sectionIds[module.id];
    if (sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
    onClose?.();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 h-20 border-b border-border/50 bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/30">
              <Beaker className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
                RT-KDT Lab
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                  Beta
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">Real-Time Kenya Digital Twin Laboratory</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="pt-20 h-full flex">
          {/* Sidebar */}
          <div className="w-64 border-r border-border/50 p-4 bg-card/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 px-2">Categories</p>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <Sparkles className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm font-bold text-foreground mb-1">100% Sovereign</p>
              <p className="text-xs text-muted-foreground">
                All modules use free, open-source data. No proprietary APIs or paid subscriptions.
              </p>
            </div>
          </div>

          {/* Module Grid */}
          <ScrollArea className="flex-1 p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${
                    module.status === "active"
                      ? "bg-card hover:border-primary/50 border-border/50"
                      : "bg-muted/30 border-border/30 opacity-70"
                  }`}
                  onClick={() => module.status === "active" && setSelectedModule(module)}
                >
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      module.status === "active"
                        ? "bg-green-500/10 text-green-500"
                        : module.status === "beta"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {module.status}
                    </span>
                  </div>

                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${module.color}20` }}
                  >
                    <module.icon className="w-6 h-6" style={{ color: module.color }} />
                  </div>

                  <h3 className="font-bold text-foreground mb-2">{module.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {module.description}
                  </p>

                  {module.status === "active" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-2 text-primary hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchModule(module);
                      }}
                    >
                      <PlayCircle className="w-4 h-4" />
                      Launch
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>

            {filteredModules.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No modules found matching your search.</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RTKDTLab;
