import { motion } from "framer-motion";
import {
  Cpu,
  Car,
  Zap,
  Droplets,
  Wifi,
  Ship,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Activity,
  Play,
  Pause,
  Settings,
  CloudRain,
  TrafficCone,
  Brain,
  Waves,
  SunMedium,
  Bus
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SimulationEngine {
  id: string;
  name: string;
  type: "infrastructure" | "economic" | "predictive";
  engine: string;
  status: "running" | "paused" | "idle";
  metrics: { name: string; value: string; trend: "up" | "down" | "stable" }[];
  icon: typeof Car;
  color: string;
}

const simulationEngines: SimulationEngine[] = [
  {
    id: "traffic_ai",
    name: "AI Traffic Optimization",
    type: "predictive",
    engine: "SUMO + Ray RLlib",
    status: "running",
    metrics: [
      { name: "Optimization", value: "12% gain", trend: "up" },
      { name: "Emergency Route", value: "3 min", trend: "down" },
      { name: "Congestion Risk", value: "Low", trend: "down" },
    ],
    icon: TrafficCone,
    color: "text-accent",
  },
  {
    id: "climate_stress",
    name: "Climate Stress Test",
    type: "predictive",
    engine: "WRF + GridLAB-D",
    status: "running",
    metrics: [
      { name: "Flood Risk", value: "4/10", trend: "stable" },
      { name: "Power Outage", value: "1.2% chance", trend: "up" },
      { name: "Water Supply", value: "95% stable", trend: "stable" },
    ],
    icon: CloudRain,
    color: "text-secondary",
  },
  {
    id: "fast_flood",
    name: "Fast Flood (Itzi)",
    type: "predictive",
    engine: "Itzi WASM",
    status: "running",
    metrics: [
      { name: "Inundation", value: "0.2m", trend: "stable" },
      { name: "Flow Velocity", value: "1.2m/s", trend: "up" },
      { name: "Risk Level", value: "Medium", trend: "stable" },
    ],
    icon: Waves,
    color: "text-blue-500",
  },
  {
    id: "solar_atlas",
    name: "Solar Potential",
    type: "infrastructure",
    engine: "Global Solar Atlas",
    status: "running",
    metrics: [
      { name: "Avg Yield", value: "5.4 kWh/m²", trend: "up" },
      { name: "Rooftop Area", value: "12k ha", trend: "stable" },
      { name: "Carbon Offset", value: "2.1 Mt", trend: "up" },
    ],
    icon: SunMedium,
    color: "text-yellow-500",
  },
  {
    id: "matatu_flow",
    name: "Matatu Pulse",
    type: "infrastructure",
    engine: "GTFS + OpenSky",
    status: "running",
    metrics: [
      { name: "Active Routes", value: "142", trend: "stable" },
      { name: "Passenger Vol", value: "1.2M/d", trend: "up" },
      { name: "Congestion", value: "24%", trend: "down" },
    ],
    icon: Bus,
    color: "text-green-500",
  },
  {
    id: "power",
    name: "Power Grid",
    type: "infrastructure",
    engine: "GridLAB-D (Free)",
    status: "running",
    metrics: [
      { name: "Load", value: "2.4 GW", trend: "stable" },
      { name: "Generation", value: "2.6 GW", trend: "up" },
      { name: "Efficiency", value: "94%", trend: "stable" },
    ],
    icon: Zap,
    color: "text-kenya-gold",
  },
  {
    id: "water",
    name: "Water Network",
    type: "infrastructure",
    engine: "EPANET (Open Source)",
    status: "running",
    metrics: [
      { name: "Flow Rate", value: "450 ML/d", trend: "stable" },
      { name: "Pressure", value: "45 psi", trend: "stable" },
      { name: "Loss Rate", value: "18%", trend: "down" },
    ],
    icon: Droplets,
    color: "text-primary",
  },
  {
    id: "markets",
    name: "Market Agents",
    type: "economic",
    engine: "Mesa ABM (Open Source)",
    status: "running",
    metrics: [
      { name: "Agents", value: "50,000", trend: "stable" },
      { name: "Trades/s", value: "1,247", trend: "up" },
      { name: "Volatility", value: "12%", trend: "down" },
    ],
    icon: BarChart3,
    color: "text-kenya-gold",
  },
  {
    id: "macro",
    name: "Macro Economy",
    type: "economic",
    engine: "DSGE (Python/Free)",
    status: "running",
    metrics: [
      { name: "GDP Growth", value: "5.2%", trend: "up" },
      { name: "Inflation", value: "6.8%", trend: "down" },
      { name: "Interest", value: "10.5%", trend: "stable" },
    ],
    icon: TrendingUp,
    color: "text-secondary",
  },
];

const interactions = [
  { from: "AI Traffic", to: "Emergency Response", relationship: "→", impact: "Time Saved" },
  { from: "Climate Stress", to: "Power Grid", relationship: "→", impact: "Outage Risk" },
  { from: "Water Network", to: "Agriculture", relationship: "→", impact: "Crop Yield" },
  { from: "Market Agents", to: "Macro Economy", relationship: "→", impact: "Inflation" },
];

const SimulationEnginesPanel = () => {
  const [engines, setEngines] = useState(simulationEngines);
  const [activeInteraction, setActiveInteraction] = useState(0);

  // Simulate metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEngines((prev) =>
        prev.map((engine) => ({
          ...engine,
          metrics: engine.metrics.map((metric) => ({
            ...metric,
            value:
              engine.status === "running" && Math.random() > 0.7
                ? updateMetricValue(metric.value)
                : metric.value,
          })),
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Rotate interactions
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInteraction((prev) => (prev + 1) % interactions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleEngine = (id: string) => {
    setEngines((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: e.status === "running" ? "paused" : "running" }
          : e
      )
    );
  };

  const runningCount = engines.filter((e) => e.status === "running").length;

  return (
    <section id="simulation" className="relative py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 mb-4">
            <Brain className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-accent font-medium uppercase tracking-wider">
              Advanced Predictive Simulation
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sovereign Simulation Bus
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interconnected open-source models for predictive governance, stress testing, and urban optimization.
          </p>
        </motion.div>

        {/* Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Predictive Models", value: "2 Active", icon: Brain, color: "text-accent" },
            { label: "Running Engines", value: runningCount, icon: Activity, color: "text-primary" },
            { label: "Simulated Entities", value: "2.3M", icon: Cpu, color: "text-secondary" },
            { label: "Interaction Rate", value: "15K/sec", icon: ArrowRight, color: "text-kenya-gold" },
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

        {/* Engines Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-8">
          {engines.map((engine, index) => (
            <motion.div
              key={engine.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`glass-panel p-4 hover:border-primary/30 transition-all group ${
                engine.status === "running" ? "border-primary/30" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    <engine.icon className={`w-5 h-5 ${engine.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{engine.name}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{engine.engine}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => toggleEngine(engine.id)}
                >
                  {engine.status === "running" ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                {engine.metrics.map((metric) => (
                  <div key={metric.name} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{metric.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-foreground">{metric.value}</span>
                      <span
                        className={
                          metric.trend === "up"
                            ? "text-primary"
                            : metric.trend === "down"
                            ? "text-accent"
                            : "text-muted-foreground"
                        }
                      >
                        {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "→"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      engine.status === "running"
                        ? "bg-primary animate-pulse"
                        : engine.status === "paused"
                        ? "bg-kenya-gold"
                        : "bg-muted"
                    }`}
                  />
                  <span className="text-xs text-muted-foreground capitalize">{engine.status}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interaction Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6 border-accent/20"
        >
          <h3 className="font-display font-semibold text-foreground mb-4 text-center flex items-center justify-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            Predictive Model Interactions
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {interactions.map((interaction, index) => (
              <motion.div
                key={index}
                className={`flex items-center justify-center gap-2 text-sm transition-all ${
                  index === activeInteraction
                    ? "opacity-100 scale-105"
                    : "opacity-50 scale-100"
                }`}
              >
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-xs">
                  {interaction.from}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-xs">
                  {interaction.to}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="px-3 py-1 rounded-full bg-kenya-gold/10 text-kenya-gold font-medium text-xs">
                  {interaction.impact}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <div className="mt-8 p-4 rounded-lg bg-accent/5 border border-accent/20 text-center">
          <p className="text-sm text-muted-foreground">
            Advanced simulations are built on open-source frameworks like **SUMO, WRF, GridLAB-D, and Ray RLlib**, ensuring **sovereign control** over all predictive models.
          </p>
        </div>
      </div>
    </section>
  );
};

function updateMetricValue(value: string): string {
  const num = parseFloat(value.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return value;
  const change = (Math.random() - 0.5) * 0.02;
  const newNum = num * (1 + change);
  return value.replace(/[\d.]+/, newNum.toFixed(value.includes(".") ? 1 : 0));
}

export default SimulationEnginesPanel;
