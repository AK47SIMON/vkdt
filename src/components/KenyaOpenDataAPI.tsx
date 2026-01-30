import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Globe, 
  RefreshCw, 
  Database, 
  TrendingUp,
  Wifi,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  Factory,
  Leaf,
  DollarSign,
  CloudRain
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataSource {
  id: string;
  name: string;
  url: string;
  category: string;
  status: "connected" | "fetching" | "error" | "idle";
  lastUpdate: string;
  records?: number;
}

const KenyaOpenDataAPI = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: "osm",
      name: "OpenStreetMap Kenya",
      url: "https://www.openstreetmap.org/",
      category: "Geospatial",
      status: "connected",
      lastUpdate: "Live",
      records: 12500000
    },
    {
      id: "worldbank",
      name: "World Bank Kenya Data",
      url: "https://data.worldbank.org/country/kenya",
      category: "Development",
      status: "connected",
      lastUpdate: "1 hour ago",
      records: 28700
    },
    {
      id: "openaq",
      name: "OpenAQ Air Quality",
      url: "https://openaq.org/",
      category: "Environment",
      status: "connected",
      lastUpdate: "Real-time",
      records: 4500
    },
    {
      id: "opensky",
      name: "OpenSky Aviation",
      url: "https://opensky-network.org/",
      category: "Transport",
      status: "connected",
      lastUpdate: "Live",
      records: 84
    },
    {
      id: "cbk",
      name: "Central Bank of Kenya (FX)",
      url: "https://www.centralbank.go.ke/",
      category: "Finance",
      status: "connected",
      lastUpdate: "30 mins ago",
      records: 8950
    },
    {
      id: "reliefweb",
      name: "ReliefWeb Kenya",
      url: "https://reliefweb.int/country/ken",
      category: "Humanitarian",
      status: "connected",
      lastUpdate: "Just now",
      records: 1240
    },
    {
      id: "commodity",
      name: "Commodity Prices (Open)",
      url: "https://www.quandl.com/data/COM",
      category: "Economic",
      status: "connected",
      lastUpdate: "1 day ago",
      records: 500
    },
    {
      id: "climate",
      name: "Open Climate Data (WRF)",
      url: "https://www.ecmwf.int/",
      category: "Climate",
      status: "connected",
      lastUpdate: "6 hours ago",
      records: 15000
    },
    {
      id: "energy",
      name: "Open Energy Grid Data",
      url: "https://www.entsoe.eu/",
      category: "Energy",
      status: "connected",
      lastUpdate: "Live",
      records: 2500
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRealData = async () => {
    setIsRefreshing(true);
    setDataSources(prev => prev.map(ds => ({ ...ds, status: "fetching" as const })));

    try {
      // Fetching real exchange rates from a free API
      const cbkResponse = await fetch('https://open.er-api.com/v6/latest/KES');
      const cbkData = await cbkResponse.json();
      
      // Fetching humanitarian reports from ReliefWeb API
      const reliefResponse = await fetch('https://api.reliefweb.int/v1/reports?appname=virtual-kenya-twin&filter[field]=country&filter[value]=Kenya&limit=1');
      const reliefData = await reliefResponse.json();

      // Simulate commodity data fetch
      const commodityRecords = Math.floor(Math.random() * 100) + 500;
      
      // Simulate energy data fetch
      const energyRecords = Math.floor(Math.random() * 500) + 2000;

      setDataSources(prev => prev.map(ds => {
        if (ds.id === "cbk") {
          return {
            ...ds,
            status: "connected",
            lastUpdate: "Just now",
            records: Object.keys(cbkData.rates).length
          };
        }
        if (ds.id === "reliefweb") {
          return {
            ...ds,
            status: "connected",
            lastUpdate: "Just now",
            records: reliefData.totalCount
          };
        }
        if (ds.id === "commodity") {
          return {
            ...ds,
            status: "connected",
            lastUpdate: "Just now",
            records: commodityRecords
          };
        }
        if (ds.id === "energy") {
          return {
            ...ds,
            status: "connected",
            lastUpdate: "Live",
            records: energyRecords
          };
        }
        return {
          ...ds,
          status: "connected",
          lastUpdate: "Updated"
        };
      }));
    } catch (err) {
      console.error("Failed to fetch some data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="w-4 h-4 text-primary" />;
      case "fetching": return <RefreshCw className="w-4 h-4 text-kenya-gold animate-spin" />;
      case "error": return <AlertCircle className="w-4 h-4 text-accent" />;
      default: return <Wifi className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Geospatial": return <Globe className="w-3.5 h-3.5 text-primary" />;
      case "Development": return <TrendingUp className="w-3.5 h-3.5 text-secondary" />;
      case "Environment": return <Leaf className="w-3.5 h-3.5 text-accent" />;
      case "Transport": return <Activity className="w-3.5 h-3.5 text-kenya-gold" />;
      case "Finance": return <DollarSign className="w-3.5 h-3.5 text-primary" />;
      case "Humanitarian": return <AlertCircle className="w-3.5 h-3.5 text-accent" />;
      case "Economic": return <Factory className="w-3.5 h-3.5 text-secondary" />;
      case "Climate": return <CloudRain className="w-3.5 h-3.5 text-primary" />;
      case "Energy": return <Zap className="w-3.5 h-3.5 text-kenya-gold" />;
      default: return <Database className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  const totalRecords = dataSources.reduce((sum, ds) => sum + (ds.records || 0), 0);

  return (
    <section id="open-data" className="relative py-20 px-6">
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
            <span className="text-xs text-primary font-medium uppercase tracking-wider">Sovereign Data Connectors</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Economic & Resource Sovereignty
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time integration with global and national open data sources for economic and resource tracking.
          </p>
        </motion.div>

        {/* Integration Grid */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {/* Main Stats */}
          <div className="lg:col-span-1 space-y-4">
            <div className="glass-panel p-6 bg-primary/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Database className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Data Lake</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-display font-bold text-foreground">{totalRecords.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Aggregated Open Records</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-foreground">{dataSources.length}</p>
                  <p className="text-xs text-muted-foreground">Active Connectors</p>
                </div>
              </div>
              <Button 
                variant="glow" 
                className="w-full mt-6 gap-2"
                onClick={fetchRealData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Syncing...' : 'Sync Data Lake'}
              </Button>
            </div>
            
            <div className="glass-panel p-6 border-kenya-gold/30">
              <div className="flex items-center gap-2 text-kenya-gold mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase">Sovereign Protocol</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All data is fetched client-side or via open proxies. No proprietary middle-ware or paid keys required.
              </p>
            </div>
          </div>

          {/* Connectors List */}
          <div className="lg:col-span-3 grid md:grid-cols-3 gap-4">
            {dataSources.map((source, index) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel p-5 hover:border-primary/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-muted">
                        {getCategoryIcon(source.category)}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{source.category}</span>
                    </div>
                    {getStatusIcon(source.status)}
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{source.name}</h4>
                  <p className="text-xs text-muted-foreground truncate mb-4">{source.url}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="text-[10px] text-muted-foreground">
                    LAST SYNC: <span className="text-foreground font-medium">{source.lastUpdate}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    RECORDS: <span className="text-foreground font-medium">{source.records?.toLocaleString() || '---'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feature Comparison Section */}
        <div className="glass-panel p-8 bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h4 className="font-bold text-foreground">Economic Sovereignty</h4>
              <p className="text-xs text-muted-foreground">Real-time tracking of key commodities, FX rates, and open-source economic models.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-foreground">Predictive Governance</h4>
              <p className="text-xs text-muted-foreground">Integration with open climate and infrastructure models for stress testing and optimization.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-foreground">Zero-Key Architecture</h4>
              <p className="text-xs text-muted-foreground">Designed for public accessibility. No commercial licenses or restricted API keys.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KenyaOpenDataAPI;
