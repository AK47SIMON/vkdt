import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Zap,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface SimulationState {
  year: number;
  month: number;
  population: number;
  gdp: number;
  employment: number;
  infrastructure: number;
  environment: number;
  happiness: number;
  budget: number;
}

interface Policy {
  id: string;
  name: string;
  description: string;
  cost: number; // annual cost in millions KES
  impact: {
    population?: number;
    gdp?: number;
    employment?: number;
    infrastructure?: number;
    environment?: number;
    happiness?: number;
  };
  duration: number; // years
}

const InteractiveSimulationDashboard = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState([1]); // 1x, 2x, 4x
  const [state, setState] = useState<SimulationState>({
    year: 2024,
    month: 1,
    population: 4400000,
    gdp: 420000, // millions KES
    employment: 2200000,
    infrastructure: 65,
    environment: 72,
    happiness: 68,
    budget: 50000, // millions KES annual
  });

  const [appliedPolicies, setAppliedPolicies] = useState<Policy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  // Available policies (inspired by SimCity)
  const policies: Policy[] = [
    {
      id: "public-transport",
      name: "Expand Public Transport",
      description: "Build new BRT and metro lines to reduce traffic",
      cost: 5000,
      impact: {
        employment: 50000,
        infrastructure: 8,
        happiness: 5,
        gdp: 2000,
        environment: 3,
      },
      duration: 5,
    },
    {
      id: "renewable-energy",
      name: "Renewable Energy Initiative",
      description: "Invest in solar and wind power generation",
      cost: 3000,
      impact: {
        infrastructure: 5,
        environment: 8,
        gdp: 1500,
        employment: 30000,
      },
      duration: 3,
    },
    {
      id: "education-expansion",
      name: "Education Expansion",
      description: "Build new schools and universities",
      cost: 2000,
      impact: {
        employment: 20000,
        happiness: 8,
        gdp: 3000,
        infrastructure: 3,
      },
      duration: 4,
    },
    {
      id: "healthcare-network",
      name: "Healthcare Network",
      description: "Expand hospitals and clinics",
      cost: 1500,
      impact: {
        employment: 15000,
        happiness: 10,
        infrastructure: 2,
        gdp: 1000,
      },
      duration: 3,
    },
    {
      id: "green-spaces",
      name: "Green Spaces & Parks",
      description: "Create parks and recreational areas",
      cost: 800,
      impact: {
        environment: 10,
        happiness: 12,
        employment: 5000,
      },
      duration: 2,
    },
    {
      id: "tech-hub",
      name: "Tech Innovation Hub",
      description: "Establish tech parks and startups",
      cost: 2500,
      impact: {
        gdp: 5000,
        employment: 40000,
        infrastructure: 4,
      },
      duration: 5,
    },
    {
      id: "housing-development",
      name: "Affordable Housing",
      description: "Build affordable housing units",
      cost: 3500,
      impact: {
        population: 100000,
        employment: 35000,
        infrastructure: 6,
        happiness: 6,
      },
      duration: 4,
    },
    {
      id: "water-management",
      name: "Water Management",
      description: "Improve water supply and treatment",
      cost: 1200,
      impact: {
        infrastructure: 4,
        environment: 5,
        happiness: 4,
        employment: 8000,
      },
      duration: 3,
    },
  ];

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setState((prev) => {
        let newState = { ...prev };

        // Advance time
        newState.month += simulationSpeed[0];
        if (newState.month > 12) {
          newState.month = 1;
          newState.year += 1;
        }

        // Base growth
        newState.population = Math.floor(newState.population * 1.025); // 2.5% annual growth
        newState.gdp = Math.floor(newState.gdp * 1.045); // 4.5% annual growth
        newState.employment = Math.floor(newState.employment * 1.03); // 3% annual growth

        // Apply policy effects
        appliedPolicies.forEach((policy) => {
          if (policy.impact.population) newState.population += policy.impact.population / 12;
          if (policy.impact.gdp) newState.gdp += policy.impact.gdp / 12;
          if (policy.impact.employment) newState.employment += policy.impact.employment / 12;
          if (policy.impact.infrastructure) newState.infrastructure += policy.impact.infrastructure / 12;
          if (policy.impact.environment) newState.environment += policy.impact.environment / 12;
          if (policy.impact.happiness) newState.happiness += policy.impact.happiness / 12;
        });

        // Deduct policy costs
        let totalCost = 0;
        appliedPolicies.forEach((policy) => {
          totalCost += policy.cost / 12;
        });
        newState.budget -= totalCost;

        // Natural decay (if no policies)
        if (appliedPolicies.length === 0) {
          newState.infrastructure = Math.max(0, newState.infrastructure - 0.1);
          newState.environment = Math.max(0, newState.environment - 0.2);
          newState.happiness = Math.max(0, newState.happiness - 0.15);
        }

        // Clamp values
        newState.infrastructure = Math.min(100, Math.max(0, newState.infrastructure));
        newState.environment = Math.min(100, Math.max(0, newState.environment));
        newState.happiness = Math.min(100, Math.max(0, newState.happiness));

        return newState;
      });
    }, 500 / simulationSpeed[0]);

    return () => clearInterval(interval);
  }, [isRunning, simulationSpeed, appliedPolicies]);

  const handleApplyPolicy = (policy: Policy) => {
    if (state.budget >= policy.cost) {
      setAppliedPolicies([...appliedPolicies, policy]);
      setState((prev) => ({
        ...prev,
        budget: prev.budget - policy.cost,
      }));
    }
  };

  const handleRemovePolicy = (policyId: string) => {
    const policy = appliedPolicies.find((p) => p.id === policyId);
    if (policy) {
      setAppliedPolicies(appliedPolicies.filter((p) => p.id !== policyId));
      setState((prev) => ({
        ...prev,
        budget: prev.budget + policy.cost,
      }));
    }
  };

  const getHealthColor = (value: number) => {
    if (value >= 75) return "text-green-500";
    if (value >= 50) return "text-yellow-500";
    return "text-red-500";
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 mb-4">
            <Sliders className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs text-secondary font-medium uppercase tracking-wider">
              Interactive Simulation
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kenya City Simulator
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Inspired by SimCity and Virtual Singapore. Make policy decisions and watch their effects unfold in real-time. 
            Manage population, economy, infrastructure, and environment.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Simulation Controls */}
          <div className="lg:col-span-1 space-y-4">
            {/* Time Display */}
            <Card className="p-6 bg-card/50">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-foreground">Simulation Time</h3>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{state.year}</p>
                <p className="text-sm text-muted-foreground">Month {state.month}</p>
              </div>
            </Card>

            {/* Controls */}
            <Card className="p-6 bg-card/50 space-y-4">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex-1 gap-2"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isRunning ? "Pause" : "Play"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsRunning(false);
                    setState({
                      year: 2024,
                      month: 1,
                      population: 4400000,
                      gdp: 420000,
                      employment: 2200000,
                      infrastructure: 65,
                      environment: 72,
                      happiness: 68,
                      budget: 50000,
                    });
                    setAppliedPolicies([]);
                  }}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-2 block">
                  Simulation Speed: {simulationSpeed[0]}x
                </label>
                <Slider
                  value={simulationSpeed}
                  onValueChange={setSimulationSpeed}
                  min={1}
                  max={4}
                  step={1}
                />
              </div>
            </Card>

            {/* Budget */}
            <Card className={`p-6 ${state.budget < 5000 ? "bg-red-500/10 border-red-500/20" : "bg-card/50"}`}>
              <p className="text-xs text-muted-foreground mb-2">Annual Budget</p>
              <p className={`text-2xl font-bold ${state.budget < 5000 ? "text-red-500" : "text-green-500"}`}>
                KES {(state.budget / 1000).toFixed(0)}B
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {state.budget < 5000 ? "⚠️ Budget critical!" : "✓ Healthy budget"}
              </p>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="lg:col-span-2 space-y-4">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className={`w-4 h-4 ${getHealthColor(state.population / 50000)}`} />
                  <p className="text-xs text-muted-foreground">Population</p>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {(state.population / 1000000).toFixed(1)}M
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className={`w-4 h-4 ${getHealthColor(state.gdp / 5000)}`} />
                  <p className="text-xs text-muted-foreground">GDP</p>
                </div>
                <p className="text-xl font-bold text-foreground">
                  KES {(state.gdp / 1000).toFixed(0)}B
                </p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className={`w-4 h-4 ${getHealthColor(state.infrastructure)}`} />
                  <p className="text-xs text-muted-foreground">Infrastructure</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${state.infrastructure}%` }}
                    />
                  </div>
                  <p className="text-sm font-bold text-foreground">{state.infrastructure.toFixed(0)}%</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className={`w-4 h-4 ${getHealthColor(state.environment)}`} />
                  <p className="text-xs text-muted-foreground">Environment</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${state.environment}%` }}
                    />
                  </div>
                  <p className="text-sm font-bold text-foreground">{state.environment.toFixed(0)}%</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className={`w-4 h-4 ${getHealthColor(state.happiness)}`} />
                  <p className="text-xs text-muted-foreground">Happiness</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 transition-all"
                      style={{ width: `${state.happiness}%` }}
                    />
                  </div>
                  <p className="text-sm font-bold text-foreground">{state.happiness.toFixed(0)}%</p>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <p className="text-xs text-muted-foreground">Employment</p>
                </div>
                <p className="text-xl font-bold text-foreground">
                  {(state.employment / 1000000).toFixed(1)}M
                </p>
              </Card>
            </div>

            {/* Active Policies */}
            {appliedPolicies.length > 0 && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-medium text-foreground mb-3">Active Policies ({appliedPolicies.length})</h4>
                <div className="space-y-2">
                  {appliedPolicies.map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-2 rounded bg-background/50">
                      <div>
                        <p className="text-sm font-medium text-foreground">{policy.name}</p>
                        <p className="text-xs text-muted-foreground">Cost: KES {(policy.cost / 1000).toFixed(0)}B/year</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemovePolicy(policy.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Policy Selection */}
        <div className="mt-8">
          <h3 className="font-display font-bold text-lg text-foreground mb-4">Available Policies</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {policies.map((policy) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-panel p-4 cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => setSelectedPolicy(policy)}
              >
                <h4 className="font-semibold text-sm text-foreground mb-2">{policy.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">{policy.description}</p>
                <div className="space-y-2 mb-4 text-xs">
                  <p className={state.budget >= policy.cost ? "text-green-500" : "text-red-500"}>
                    Cost: KES {(policy.cost / 1000).toFixed(0)}B/year
                  </p>
                  <p className="text-muted-foreground">Duration: {policy.duration} years</p>
                </div>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyPolicy(policy);
                  }}
                  disabled={state.budget < policy.cost}
                  className="w-full"
                >
                  Apply Policy
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-secondary/5 to-transparent border border-secondary/20"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-bold">Kenya City Simulator:</span> This interactive tool lets you make policy decisions and see their effects on Kenya's urban development. 
            Inspired by SimCity and Virtual Singapore, it demonstrates how different investments impact population, economy, infrastructure, and environment.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveSimulationDashboard;
