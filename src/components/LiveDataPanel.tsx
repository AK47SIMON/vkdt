import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Globe,
  RefreshCw,
  ExternalLink,
  Plane,
  Ship,
  Wind,
  Activity,
  Zap,
  Droplets,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataSource {
  id: string;
  name: string;
  provider: string;
  category: string;
  status: "connected" | "updating" | "error";
  lastUpdate: Date;
  recordCount: number;
  url: string;
}

interface LiveTrackingMetric {
  id: string;
  label: string;
  value: string;
  subValue: string;
  icon: React.ElementType;
  color: string;
  trend: "up" | "down" | "stable";
}

const dataSources: DataSource[] = [
  {
    id: "opensky-aviation",
    name: "Air Traffic (Kenya)",
    provider: "OpenSky Network (Free)",
    category: "Transport",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: 84,
    url: "https://opensky-network.org",
  },
  {
    id: "marinetraffic-ais",
    name: "Mombasa Port AIS",
    provider: "AIS Open Data",
    category: "Maritime",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: 1240,
    url: "https://www.marinetraffic.com",
  },
  {
    id: "openaq-air",
    name: "Air Quality Index",
    provider: "OpenAQ API (Free)",
    category: "Environment",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: 4500,
    url: "https://openaq.org",
  },
  {
    id: "openweather-live",
    name: "National Weather Grid",
    provider: "OpenWeatherMap",
    category: "Climate",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: 156000,
    url: "https://openweathermap.org",
  },
  {
    id: "copernicus-sentinel",
    name: "Satellite Earth Observation",
    provider: "ESA Copernicus (Free)",
    category: "Space",
    status: "connected",
    lastUpdate: new Date(Date.now() - 3600000),
    recordCount: 850000,
    url: "https://scihub.copernicus.eu",
  },
  {
    id: "reliefweb-crisis",
    name: "Humanitarian Updates",
    provider: "UN OCHA ReliefWeb",
    category: "Crisis",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: 12000,
    url: "https://reliefweb.int",
  },
];

const initialTrackingMetrics: LiveTrackingMetric[] = [
  { id: "flights", label: "Active Flights", value: "42", subValue: "In Kenyan Airspace", icon: Plane, color: "text-blue-400", trend: "up" },
  { id: "vessels", label: "Port Vessels", value: "18", subValue: "Mombasa/Lamiru", icon: Ship, color: "text-cyan-400", trend: "stable" },
  { id: "aqi", label: "Nairobi AQI", value: "38", subValue: "Good Quality", icon: Wind, color: "text-green-400", trend: "down" },
  { id: "energy", label: "Grid Load", value: "1.8 GW", subValue: "74% Renewable", icon: Zap, color: "text-yellow-400", trend: "up" },
];

const LiveDataPanel = () => {
  const [sources, setSources] = useState(dataSources);
  const [metrics, setMetrics] = useState(initialTrackingMetrics);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");

  // Simulate real-time updates for tracking metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(m => {
        if (Math.random() > 0.7) {
          const valNum = parseFloat(m.value.replace(/[^0-9.]/g, ''));
          const change = (Math.random() - 0.5) * 2;
          const newVal = Math.max(0, valNum + change);
          return {
            ...m,
            value: m.id === 'energy' ? `${newVal.toFixed(1)} GW` : Math.round(newVal).toString(),
            trend: change > 0 ? "up" : "down"
          };
        }
        return m;
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSources((prev) =>
      prev.map((source) => ({
        ...source,
        lastUpdate: new Date(),
        recordCount: source.recordCount + Math.floor(Math.random() * 50),
      }))
    );
    setIsRefreshing(false);
  };

  const categories = ["all", ...new Set(sources.map((s) => s.category))];
  const filteredSources =
    selectedCategory === "all" ? sources : sources.filter((s) => s.category === selectedCategory);

  return (
    <section id="open-data" className="relative py-20 px-6 bg-gradient-to-b from-transparent via-card/20 to-transparent">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-xs text-primary font-medium uppercase tracking-wider">
              Real-Time Sovereign Data
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            National Live Pulse
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aggregating real-time transport, environment, and infrastructure data from global open-source networks.
          </p>
        </motion.div>

        {/* Real-Time Tracking Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-5 relative overflow-hidden group hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-bold ${metric.trend === 'up' ? 'text-primary' : metric.trend === 'down' ? 'text-accent' : 'text-muted-foreground'}`}>
                    {metric.trend === 'up' ? '▲' : metric.trend === 'down' ? '▼' : '●'}
                  </span>
                  <div className="w-12 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-3xl font-display font-bold text-foreground">{metric.value}</h4>
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <p className="text-xs text-muted-foreground/60 mt-1">{metric.subValue}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Data Connectors Section */}
        <div className="glass-panel p-6 mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-border/50 pb-6">
            <div>
              <h3 className="text-xl font-display font-bold text-foreground">Open Data Connectors</h3>
              <p className="text-sm text-muted-foreground">Live synchronization with global and national registries.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {categories.slice(1, 5).map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                    <Database className="w-3.5 h-3.5 text-primary" />
                  </div>
                ))}
              </div>
              <Button variant="metric" size="sm" onClick={refreshData} disabled={isRefreshing} className="gap-2">
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                {isRefreshing ? "Syncing..." : "Sync All"}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all border ${
                  selectedCategory === cat
                    ? "bg-primary border-primary text-primary-foreground"
                    : "bg-transparent border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {cat === "all" ? "All Channels" : cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSources.map((source, index) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-bold text-foreground uppercase tracking-tighter">{source.category}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">ID: {source.id}</span>
                </div>
                <h5 className="font-bold text-foreground mb-1">{source.name}</h5>
                <p className="text-xs text-muted-foreground mb-4">{source.provider}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <RefreshCw className="w-3 h-3" />
                    {source.lastUpdate.toLocaleTimeString()}
                  </div>
                  <a href={source.url} target="_blank" className="text-[10px] text-primary font-bold hover:underline">ACCESS HUB</a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sovereign Tech Badge */}
        <div className="mt-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-display font-bold text-foreground">100% Sovereign Technology Stack</h4>
              <p className="text-sm text-muted-foreground max-w-xl">
                Unlike traditional digital twins, Virtual Kenya uses decentralized open-source data. 
                No dependence on commercial API keys or foreign proprietary infrastructure.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">0</span>
              <span className="text-[10px] text-muted-foreground uppercase">API Fees</span>
            </div>
            <div className="w-px h-10 bg-border mx-2" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-primary">∞</span>
              <span className="text-[10px] text-muted-foreground uppercase">Scalability</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDataPanel;
