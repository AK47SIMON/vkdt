import { motion } from "framer-motion";
import {
  Database,
  Satellite,
  Cloud,
  Map,
  Users,
  TrendingUp,
  Radio,
  Globe,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Plane,
  Ship,
  Zap
} from "lucide-react";
import { useState, useEffect } from "react";

interface DataSource {
  id: string;
  name: string;
  category: "geography" | "transport" | "population" | "climate";
  provider: string;
  status: "connected" | "syncing" | "offline";
  lastUpdate: Date;
  recordCount: string;
  icon: typeof Database;
  description: string;
}

const dataSources: DataSource[] = [
  {
    id: "osm",
    name: "OpenStreetMap 3D",
    category: "geography",
    provider: "OSM Foundation",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: "12M features",
    icon: Map,
    description: "Roads, buildings, POIs for Kenya",
  },
  {
    id: "opensky",
    name: "Aviation Feed",
    category: "transport",
    provider: "OpenSky Network",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: "Live ADSB",
    icon: Plane,
    description: "Real-time aircraft tracking",
  },
  {
    id: "marinetraffic",
    name: "Maritime AIS",
    category: "transport",
    provider: "OpenAIS Hub",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: "Mombasa/Lamu",
    icon: Ship,
    description: "Vessel movement & port status",
  },
  {
    id: "sentinel",
    name: "Sentinel-2 L2A",
    category: "geography",
    provider: "Copernicus",
    status: "connected",
    lastUpdate: new Date(Date.now() - 3600000),
    recordCount: "10m NDVI",
    icon: Satellite,
    description: "Multispectral satellite imagery",
  },
  {
    id: "openaq",
    name: "OpenAQ Air",
    category: "climate",
    provider: "OpenAQ API",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: "Real-time",
    icon: Cloud,
    description: "Global air quality monitoring",
  },
  {
    id: "worldpop",
    name: "WorldPop Density",
    category: "population",
    provider: "Southampton Uni",
    status: "connected",
    lastUpdate: new Date(Date.now() - 86400000),
    recordCount: "100m grid",
    icon: Users,
    description: "Population density estimates",
  },
  {
    id: "srtm",
    name: "SRTM Terrain",
    category: "geography",
    provider: "NASA/ESA",
    status: "connected",
    lastUpdate: new Date(Date.now() - 86400000),
    recordCount: "30m DEM",
    icon: Globe,
    description: "Digital elevation model",
  },
  {
    id: "kmd",
    name: "Kenya Meteo Grid",
    category: "climate",
    provider: "KMD Open",
    status: "syncing",
    lastUpdate: new Date(),
    recordCount: "47 Counties",
    icon: Radio,
    description: "Local weather observations",
  },
  {
    id: "kplc",
    name: "Energy Grid",
    category: "transport",
    provider: "Open Energy Hub",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: "National Load",
    icon: Zap,
    description: "Power generation & distribution",
  },
  {
    id: "maxar_imagery",
    name: "Maxar High-Res",
    category: "geography",
    provider: "Maxar Open Data",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: "0.5m GSD",
    icon: Satellite,
    description: "Ultra-high resolution satellite base layers",
  },
  {
    id: "digital_matatus",
    name: "Digital Matatus",
    category: "transport",
    provider: "Columbia/MIT",
    status: "connected",
    lastUpdate: new Date(),
    recordCount: "142 Routes",
    icon: Map,
    description: "Semi-formal transit network mapping",
  },
];

const categoryColors = {
  geography: "text-primary",
  transport: "text-kenya-gold",
  population: "text-secondary",
  climate: "text-accent",
};

const categoryBg = {
  geography: "bg-primary/10 border-primary/30",
  transport: "bg-kenya-gold/10 border-kenya-gold/30",
  population: "bg-secondary/10 border-secondary/30",
  climate: "bg-accent/10 border-accent/30",
};

const DataSourcesPanel = () => {
  const [sources, setSources] = useState(dataSources);

  // Simulate data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSources((prev) =>
        prev.map((source) => ({
          ...source,
          lastUpdate:
            source.status === "connected" && Math.random() > 0.7
              ? new Date()
              : source.lastUpdate,
          status:
            source.status === "syncing" && Math.random() > 0.8
              ? "connected"
              : source.status === "connected" && Math.random() > 0.95
              ? "syncing"
              : source.status,
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const connectedCount = sources.filter((s) => s.status === "connected").length;
  const syncingCount = sources.filter((s) => s.status === "syncing").length;

  return (
    <section id="data-sources" className="relative py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Database className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-medium uppercase tracking-wider">
              Reality Feed Architecture
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sovereign Data Ingestion
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our digital twin architecture bypasses proprietary silos, connecting directly to open-source satellite, 
            maritime, aviation, and environmental data streams.
          </p>
        </motion.div>

        {/* Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Active Channels", value: connectedCount, icon: CheckCircle, color: "text-primary" },
            { label: "Syncing Latency", value: "< 2s", icon: RefreshCw, color: "text-kenya-gold" },
            { label: "Daily Features", value: "85M+", icon: Database, color: "text-secondary" },
            { label: "Protocol", value: "Sovereign", icon: Radio, color: "text-accent" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-tight">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Data Sources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source, index) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="glass-panel p-4 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${categoryBg[source.category]} group-hover:shadow-glow transition-all`}>
                    <source.icon className={`w-5 h-5 ${categoryColors[source.category]}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{source.name}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase">{source.provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {source.status === "connected" ? (
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  ) : source.status === "syncing" ? (
                    <RefreshCw className="w-3 h-3 text-kenya-gold animate-spin" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-accent" />
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{source.description}</p>

              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest border-t border-border/50 pt-3">
                <span className="text-primary">{source.recordCount}</span>
                <span className="text-muted-foreground">
                  LIVE SYNC: {Math.round((Date.now() - source.lastUpdate.getTime()) / 60000)}m
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Notice */}
        <div className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/50 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            All ingestion channels are optimized for client-side rendering. No central database storage of PII data.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DataSourcesPanel;
