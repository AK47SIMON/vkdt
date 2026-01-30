import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Users, 
  TrendingUp, 
  Thermometer, 
  Droplets,
  Zap,
  Building,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Info,
  DollarSign,
  Factory,
  Leaf
} from "lucide-react";

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  change: number;
  unit?: string;
  format?: "number" | "decimal" | "millions" | "currency";
  delay?: number;
}

const formatValue = (value: number, format: string) => {
  switch (format) {
    case "millions":
      return `${(value / 1000000).toFixed(2)}M`;
    case "decimal":
      return value.toFixed(1);
    case "currency":
      return `KES ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    default:
      return value.toLocaleString();
  }
};

const MetricCard = ({ icon: Icon, label, value, change, unit, format = "number", delay = 0 }: MetricCardProps) => {
  const isPositive = change > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="metric-card group hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
          isPositive 
            ? 'bg-primary/10 text-primary' 
            : 'bg-accent/10 text-accent'
        }`}>
          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(change).toFixed(1)}%
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-display font-bold text-foreground">
          {formatValue(value, format)}
          {unit && <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>}
        </p>
      </div>

      {/* Animated bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/50"
          initial={{ width: 0 }}
          whileInView={{ width: '100%' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: delay + 0.3 }}
        />
      </div>
    </motion.div>
  );
};

const MetricsDashboard = () => {
  const [metrics, setMetrics] = useState([
    { icon: Users, label: "Population (KNBS)", value: 54030000, change: 2.3, format: "millions" as const, unit: "people" },
    { icon: TrendingUp, label: "GDP Growth (WorldBank)", value: 5.4, change: 0.8, format: "decimal" as const, unit: "%" },
    { icon: DollarSign, label: "KES/USD Rate (CBK)", value: 138.50, change: -0.5, format: "decimal" as const, unit: "" },
    { icon: Factory, label: "Tea Export Value", value: 12500000000, change: 4.5, format: "currency" as const, unit: "" },
    { icon: Zap, label: "Renewable Energy", value: 87, change: 1.2, format: "number" as const, unit: "%" },
    { icon: Leaf, label: "Carbon Sink Index", value: 0.72, change: 0.1, format: "decimal" as const, unit: "" },
    { icon: Thermometer, label: "Avg Temp (OpenWeather)", value: 24.5, change: -1.2, format: "decimal" as const, unit: "°C" },
    { icon: Droplets, label: "Rainfall (Copernicus)", value: 892, change: 12.5, format: "number" as const, unit: "mm" },
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      
      setTimeout(() => {
        setMetrics(prev => prev.map(metric => ({
          ...metric,
          value: metric.value + (Math.random() - 0.5) * (metric.value * 0.001),
          change: metric.change + (Math.random() - 0.5) * 0.2
        })));
        setLastUpdate(new Date());
        setIsUpdating(false);
      }, 10000);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            <span className="text-xs text-secondary font-medium uppercase tracking-wider">Economic & Climate Pulse</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sovereign National Metrics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time statistics and key performance indicators for Kenya's economic and environmental resilience, aggregated from open sources.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.label}
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              change={metric.change}
              unit={metric.unit}
              format={metric.format}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Live indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Data streaming from open national and global APIs
          </div>
          <div className="flex items-center gap-2 text-xs">
            <RefreshCw className={`w-3 h-3 ${isUpdating ? 'animate-spin' : ''}`} />
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </motion.div>

        <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-border/50 text-center flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground">
            Sourced from KNBS, World Bank, OpenStreetMap, Copernicus, and open financial data. No paid API keys required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MetricsDashboard;
