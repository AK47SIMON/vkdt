import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Fuel, 
  TrendingUp, 
  TrendingDown, 
  Ship, 
  DollarSign, 
  Truck,
  ShoppingCart,
  Building2,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Calendar,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface SimulationStep {
  id: string;
  name: string;
  icon: React.ElementType;
  value: number;
  baseValue: number;
  unit: string;
  change: number;
  description: string;
}

// Latest Kenya fuel prices as of January 2025 (EPRA regulated prices)
// Source: Energy and Petroleum Regulatory Authority (EPRA)
const LATEST_FUEL_DATA = {
  superPetrol: 180.66,  // KES per litre in Nairobi
  diesel: 168.07,       // KES per litre in Nairobi
  kerosene: 149.94,     // KES per litre in Nairobi
  exchangeRate: 129.50, // KES/USD average
  lastUpdated: "January 2025",
  brentCrude: 76.50,    // USD per barrel
  portCongestion: 18,   // % average delay at Mombasa
  shippingCost: 2800,   // USD per TEU (Twenty-foot Equivalent Unit)
  inflationRate: 4.6,   // % annual (December 2024)
};

const getInitialSteps = (): SimulationStep[] => [
  { 
    id: "crude", 
    name: "Brent Crude", 
    icon: Fuel, 
    value: LATEST_FUEL_DATA.brentCrude, 
    baseValue: LATEST_FUEL_DATA.brentCrude,
    unit: "USD/bbl", 
    change: 0, 
    description: "Global oil benchmark" 
  },
  { 
    id: "port", 
    name: "Port Congestion", 
    icon: Ship, 
    value: LATEST_FUEL_DATA.portCongestion, 
    baseValue: LATEST_FUEL_DATA.portCongestion,
    unit: "%", 
    change: 0, 
    description: "Mombasa port delay" 
  },
  { 
    id: "shipping", 
    name: "Shipping Cost", 
    icon: Truck, 
    value: LATEST_FUEL_DATA.shippingCost, 
    baseValue: LATEST_FUEL_DATA.shippingCost,
    unit: "USD/TEU", 
    change: 0, 
    description: "Container freight rate" 
  },
  { 
    id: "forex", 
    name: "Exchange Rate", 
    icon: DollarSign, 
    value: LATEST_FUEL_DATA.exchangeRate, 
    baseValue: LATEST_FUEL_DATA.exchangeRate,
    unit: "KES/USD", 
    change: 0, 
    description: "CBK exchange rate" 
  },
  { 
    id: "pump", 
    name: "Super Petrol", 
    icon: Fuel, 
    value: LATEST_FUEL_DATA.superPetrol, 
    baseValue: LATEST_FUEL_DATA.superPetrol,
    unit: "KES/L", 
    change: 0, 
    description: "EPRA regulated price" 
  },
  { 
    id: "diesel", 
    name: "Diesel Price", 
    icon: Fuel, 
    value: LATEST_FUEL_DATA.diesel, 
    baseValue: LATEST_FUEL_DATA.diesel,
    unit: "KES/L", 
    change: 0, 
    description: "EPRA regulated price" 
  },
  { 
    id: "transport", 
    name: "Transport Cost", 
    icon: Truck, 
    value: 52, 
    baseValue: 52,
    unit: "KES/km", 
    change: 0, 
    description: "Freight per km" 
  },
  { 
    id: "food", 
    name: "Food Index", 
    icon: ShoppingCart, 
    value: 118.5, 
    baseValue: 118.5,
    unit: "Index", 
    change: 0, 
    description: "KNBS food CPI" 
  },
  { 
    id: "inflation", 
    name: "Inflation Rate", 
    icon: TrendingUp, 
    value: LATEST_FUEL_DATA.inflationRate, 
    baseValue: LATEST_FUEL_DATA.inflationRate,
    unit: "%", 
    change: 0, 
    description: "Annual inflation" 
  },
];

const FuelPriceSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [crudeOilChange, setCrudeOilChange] = useState([10]); // 10% increase in crude oil
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>(getInitialSteps());
  const [projectionMonths, setProjectionMonths] = useState([3]); // 3 months projection

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= simulationSteps.length - 1) {
          setIsRunning(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isRunning, simulationSteps.length]);

  useEffect(() => {
    // Calculate cascade effects based on crude oil price change
    const oilChange = crudeOilChange[0];
    const months = projectionMonths[0];
    
    // Time-adjusted multipliers (effects compound over time)
    const timeMultiplier = 1 + (months - 1) * 0.15;
    
    setSimulationSteps(prev => prev.map((step, index) => {
      if (index > currentStep) return { ...step, value: step.baseValue, change: 0 };
      
      // Economic multipliers based on Kenya's fuel price transmission
      const multipliers: Record<string, number> = {
        crude: 1.0,      // Direct change
        port: 0.25,      // Port congestion increases with oil demand
        shipping: 0.55,  // Shipping costs track oil closely
        forex: 0.18,     // Forex pressure from import bills
        pump: 0.72,      // EPRA pass-through ~72% of crude changes
        diesel: 0.68,    // Diesel slightly less sensitive
        transport: 0.58, // Transport costs follow diesel
        food: 0.42,      // Food prices lag transport
        inflation: 0.12, // Inflation responds to all factors
      };
      
      const stepChange = oilChange * (multipliers[step.id] || 0.1) * timeMultiplier;
      
      let newValue: number;
      if (step.id === "inflation") {
        newValue = step.baseValue + (stepChange * 0.3);
      } else if (step.id === "forex") {
        newValue = step.baseValue * (1 + stepChange / 100);
      } else {
        newValue = step.baseValue * (1 + stepChange / 100);
      }
      
      return {
        ...step,
        value: parseFloat(newValue.toFixed(step.id === "inflation" ? 1 : 2)),
        change: parseFloat(stepChange.toFixed(1))
      };
    }));
  }, [currentStep, crudeOilChange, projectionMonths]);

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setSimulationSteps(getInitialSteps());
  };

  const handleStart = () => {
    if (currentStep >= simulationSteps.length - 1) {
      handleReset();
      setTimeout(() => setIsRunning(true), 100);
    } else {
      setIsRunning(true);
    }
  };

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kenya-gold/10 border border-kenya-gold/30 mb-4">
            <Fuel className="w-3.5 h-3.5 text-kenya-gold" />
            <span className="text-xs text-kenya-gold font-medium uppercase tracking-wider">Economic Simulation</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fuel Price Cascade Simulation
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Project future fuel prices and economic impacts using latest EPRA data ({LATEST_FUEL_DATA.lastUpdated}).
          </p>
          
          {/* Current price badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-kenya-gold/10 border border-kenya-gold/30 text-kenya-gold">
              Super: KES {LATEST_FUEL_DATA.superPetrol}/L
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 border border-primary/30 text-primary">
              Diesel: KES {LATEST_FUEL_DATA.diesel}/L
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 border border-accent/30 text-accent">
              Brent: ${LATEST_FUEL_DATA.brentCrude}/bbl
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 border border-secondary/30 text-secondary">
              USD/KES: {LATEST_FUEL_DATA.exchangeRate}
            </span>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="glass-panel p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Crude Oil Change Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Fuel className="w-4 h-4" />
                  Crude Oil Price Change
                </span>
                <span className={`text-lg font-bold ${crudeOilChange[0] >= 0 ? "text-accent" : "text-primary"}`}>
                  {crudeOilChange[0] >= 0 ? "+" : ""}{crudeOilChange[0]}%
                </span>
              </div>
              <Slider
                value={crudeOilChange}
                onValueChange={setCrudeOilChange}
                max={50}
                min={-30}
                step={5}
                className="w-full"
                disabled={isRunning}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Simulate crude oil price changes (${(LATEST_FUEL_DATA.brentCrude * (1 + crudeOilChange[0]/100)).toFixed(2)}/bbl)
              </p>
            </div>

            {/* Projection Period Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Projection Period
                </span>
                <span className="text-lg font-bold text-primary">
                  {projectionMonths[0]} months
                </span>
              </div>
              <Slider
                value={projectionMonths}
                onValueChange={setProjectionMonths}
                max={12}
                min={1}
                step={1}
                className="w-full"
                disabled={isRunning}
              />
              <p className="text-xs text-muted-foreground mt-1">
                How far into the future to project prices
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <Button 
              variant="metric" 
              onClick={handleStart}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Running..." : "Run Simulation"}
            </Button>
            <Button variant="metric" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </div>

        {/* Simulation Flow */}
        <div className="relative">
          {/* Connection Lines */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-kenya-gold/40 to-accent/20 -translate-y-1/2 hidden lg:block" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {simulationSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index <= currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative glass-panel p-4 text-center transition-all duration-300 ${
                    isCurrent ? "border-kenya-gold ring-2 ring-kenya-gold/30" : 
                    isActive ? "border-primary/50" : "opacity-50"
                  }`}
                >
                  <div className={`p-2 rounded-lg mx-auto w-fit mb-2 ${
                    isCurrent ? "bg-kenya-gold/20" : isActive ? "bg-primary/20" : "bg-muted"
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isCurrent ? "text-kenya-gold" : isActive ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  
                  <h4 className="text-xs font-medium text-foreground mb-1 line-clamp-1">{step.name}</h4>
                  
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-bold text-foreground">{step.value}</span>
                    <span className="text-xs text-muted-foreground">{step.unit}</span>
                  </div>
                  
                  {step.change > 0 && isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center justify-center gap-1 mt-1"
                    >
                      <TrendingUp className="w-3 h-3 text-accent" />
                      <span className="text-xs text-accent font-medium">+{step.change}%</span>
                    </motion.div>
                  )}

                  {/* Arrow to next */}
                  {index < simulationSteps.length - 1 && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 hidden lg:block z-10">
                      <ArrowRight className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground/30"}`} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Impact Summary */}
        {currentStep >= simulationSteps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 glass-panel border-accent/30"
          >
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-accent" />
              {projectionMonths[0]}-Month Economic Impact Projection
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-kenya-gold/10">
                <p className="text-sm text-muted-foreground mb-1">Projected Super Petrol</p>
                <p className="text-2xl font-bold text-kenya-gold">
                  KES {simulationSteps.find(s => s.id === "pump")?.value.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  +{simulationSteps.find(s => s.id === "pump")?.change.toFixed(1)}% from today
                </p>
              </div>
              <div className="p-4 rounded-lg bg-accent/10">
                <p className="text-sm text-muted-foreground mb-1">Projected Diesel</p>
                <p className="text-2xl font-bold text-accent">
                  KES {simulationSteps.find(s => s.id === "diesel")?.value.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  +{simulationSteps.find(s => s.id === "diesel")?.change.toFixed(1)}% from today
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/10">
                <p className="text-sm text-muted-foreground mb-1">Food Price Impact</p>
                <p className="text-2xl font-bold text-primary">
                  +{simulationSteps.find(s => s.id === "food")?.change.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">CPI food index change</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/10">
                <p className="text-sm text-muted-foreground mb-1">Projected Inflation</p>
                <p className="text-2xl font-bold text-secondary">
                  {simulationSteps.find(s => s.id === "inflation")?.value.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Annual rate</p>
              </div>
            </div>

            {/* Policy implications */}
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border/50">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Policy Implications</p>
                  <p className="text-xs text-muted-foreground">
                    {crudeOilChange[0] > 20 
                      ? "Significant fuel price increases may trigger CBK monetary policy review and potential fuel subsidy discussions."
                      : crudeOilChange[0] > 10
                      ? "Moderate price increases will likely pass through to consumer goods. EPRA may implement phased price adjustments."
                      : crudeOilChange[0] > 0
                      ? "Minor price adjustments expected. Market should absorb changes without major policy intervention."
                      : "Price decreases would provide relief to consumers and reduce inflationary pressure."
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Data source notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20"
        >
          <p className="text-sm text-muted-foreground text-center">
            <span className="text-primary font-medium">Data Sources:</span>{" "}
            EPRA (Energy & Petroleum Regulatory Authority) • CBK (Central Bank of Kenya) • KNBS (Kenya National Bureau of Statistics) • ICE Brent Futures
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FuelPriceSimulation;
