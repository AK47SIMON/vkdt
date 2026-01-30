import { motion } from "framer-motion";
import {
  Brain,
  TrendingUp,
  Cloud,
  Fuel,
  Wheat,
  LineChart,
  AlertTriangle,
  CheckCircle,
  Loader2,
  RefreshCw,
  Sun,
  TreePine,
  Leaf,
  Factory,
  DollarSign,
  Car,
  Activity,
  Globe
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Prediction {
  id: string;
  name: string;
  model: string;
  category: "price" | "policy" | "climate" | "urban" | "economic" | "resource";
  prediction: string;
  confidence: number;
  horizon: string;
  status: "ready" | "computing" | "updating";
  icon: typeof Fuel;
  impact: "high" | "medium" | "low";
}

const predictions: Prediction[] = [
  {
    id: "traffic_opt",
    name: "Traffic Optimization",
    model: "Ray RLlib + SUMO",
    category: "urban",
    prediction: "15% Congestion Reduction",
    confidence: 94,
    horizon: "7 days",
    status: "ready",
    icon: Car,
    impact: "high",
  },
  {
    id: "solar",
    name: "Solar Yield Forecast",
    model: "CNN + Climate Model",
    category: "resource",
    prediction: "4.2 GW Potential (Nairobi)",
    confidence: 89,
    horizon: "Static",
    status: "ready",
    icon: Sun,
    impact: "high",
  },
  {
    id: "ndvi",
    name: "Carbon Sink Tracking",
    model: "Sentinel-2 NDVI",
    category: "resource",
    prediction: "Mau Forest: +1.2% Biomass",
    confidence: 94,
    horizon: "Last Pass",
    status: "ready",
    icon: Leaf,
    impact: "medium",
  },
  {
    id: "commodity",
    name: "Tea Price Forecast",
    model: "Prophet + LSTM",
    category: "economic",
    prediction: "KES 350/kg in 90 days",
    confidence: 85,
    horizon: "90 days",
    status: "computing",
    icon: Wheat,
    impact: "high",
  },
  {
    id: "fx_rate",
    name: "KES/USD Exchange Rate",
    model: "ARIMA + CBK Data",
    category: "economic",
    prediction: "KES 135.50/USD in 30 days",
    confidence: 78,
    horizon: "30 days",
    status: "ready",
    icon: DollarSign,
    impact: "high",
  },
  {
    id: "drought",
    name: "Drought Risk Assessment",
    model: "WRF + Random Forest",
    category: "climate",
    prediction: "23% probability (Turkana)",
    confidence: 79,
    horizon: "60 days",
    status: "ready",
    icon: Cloud,
    impact: "high",
  },
];

const policyScenarios = [
  { name: "Universal Solar Mandate", impact: "-15% Grid Dependency", risk: "low" },
  { name: "Traffic Congestion Charge", impact: "-20% Nairobi Traffic", risk: "medium" },
  { name: "Tea Export Subsidy", impact: "+10% Export Volume", risk: "medium" },
  { name: "Fuel Subsidy Removal", impact: "+2.1% inflation", risk: "high" },
];

const AIAnalyticsPanel = () => {
  const [predictionData, setPredictionData] = useState(predictions);
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [isRunningScenario, setIsRunningScenario] = useState(false);

  // Simulate prediction updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPredictionData((prev) =>
        prev.map((pred) => ({
          ...pred,
          confidence:
            pred.status === "ready"
              ? Math.min(99, Math.max(60, pred.confidence + (Math.random() - 0.5) * 2))
              : pred.confidence,
          status:
            pred.status === "computing" && Math.random() > 0.7
              ? "ready"
              : pred.status === "ready" && Math.random() > 0.95
              ? "updating"
              : pred.status === "updating" && Math.random() > 0.5
              ? "ready"
              : pred.status,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const runScenario = (index: number) => {
    setSelectedScenario(index);
    setIsRunningScenario(true);
    setTimeout(() => setIsRunningScenario(false), 2000);
  };

  return (
    <section id="ai-analytics" className="relative py-20 px-6">
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
              Advanced Urban Intelligence
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Predictive Governance & Economic Modeling
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leveraging open-source AI models for economic forecasting, resource management, and policy stress testing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Predictions Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Active Predictive Models
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live Inference
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {predictionData.map((pred, index) => (
                <motion.div
                  key={pred.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel p-4 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        <pred.icon
                          className={`w-5 h-5 ${
                            pred.impact === "high"
                              ? "text-accent"
                              : pred.impact === "medium"
                              ? "text-kenya-gold"
                              : "text-primary"
                          }`}
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{pred.name}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{pred.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {pred.status === "ready" ? (
                        <CheckCircle className="w-4 h-4 text-primary" />
                      ) : pred.status === "computing" ? (
                        <Loader2 className="w-4 h-4 text-kenya-gold animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-secondary animate-spin" />
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 mb-3 border border-border/50">
                    <p className="text-sm font-bold text-foreground">{pred.prediction}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Confidence:</span>
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${pred.confidence}%` }}
                        />
                      </div>
                      <span className="font-medium text-foreground">{Math.round(pred.confidence)}%</span>
                    </div>
                    <span className="text-muted-foreground">{pred.horizon}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Policy Sandbox */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6 border-accent/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <AlertTriangle className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-foreground">Policy Sandbox</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Run "What-If" scenarios to see how urban policies impact sustainability and economic resilience.
            </p>

            <div className="space-y-3">
              {policyScenarios.map((scenario, index) => (
                <div
                  key={scenario.name}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedScenario === index
                      ? "border-accent bg-accent/5 shadow-glow-accent"
                      : "border-border/50 hover:border-border bg-muted/20"
                  }`}
                  onClick={() => runScenario(index)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-foreground uppercase tracking-tight">{scenario.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        scenario.risk === "high"
                          ? "bg-accent/10 text-accent"
                          : scenario.risk === "medium"
                          ? "bg-kenya-gold/10 text-kenya-gold"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {scenario.risk}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">Impact: <span className="text-foreground font-medium">{scenario.impact}</span></p>
                  {selectedScenario === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-3 pt-3 border-t border-border/50"
                    >
                      {isRunningScenario ? (
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          RUNNING MONTE CARLO SIM...
                        </div>
                      ) : (
                        <div className="text-[10px] text-primary font-bold">
                          ✓ SIMULATION COMPLETE. RESULTS BROADCAST TO TWIN.
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <Button variant="glow" className="w-full mt-6 gap-2">
              <Brain className="w-4 h-4" />
              Compute Full Matrix
            </Button>
          </motion.div>
        </div>

        {/* Open Tech Stack */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { name: "PyTorch", icon: Brain },
            { name: "TensorFlow", icon: Brain },
            { name: "Ray RLlib", icon: Car },
            { name: "WRF", icon: Cloud },
            { name: "Prophet", icon: LineChart },
            { name: "XGBoost", icon: Activity },
            { name: "Mesa ABM", icon: Globe },
          ].map((tool) => (
            <div
              key={tool.name}
              className="px-3 py-2 rounded-xl bg-muted/50 border border-border/50 flex flex-col items-center gap-1 group hover:border-primary/50 transition-all"
            >
              <tool.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-[10px] font-bold text-muted-foreground group-hover:text-foreground">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIAnalyticsPanel;
