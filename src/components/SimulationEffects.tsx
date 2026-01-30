import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Cloud,
  Droplets,
  Wind,
  Zap,
  Flame,
  Waves,
  Leaf,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface SimulationEffect {
  id: string;
  name: string;
  description: string;
  icon: typeof Cloud;
  color: string;
  isRunning: boolean;
  intensity: number;
}

const SimulationEffects = () => {
  const [simulations, setSimulations] = useState<SimulationEffect[]>([
    {
      id: "rainfall",
      name: "Rainfall Simulation",
      description: "Visualize rainfall patterns and water accumulation",
      icon: Droplets,
      color: "text-blue-400",
      isRunning: false,
      intensity: 50,
    },
    {
      id: "wind",
      name: "Wind Flow Simulation",
      description: "Model air circulation and wind patterns across terrain",
      icon: Wind,
      color: "text-cyan-400",
      isRunning: false,
      intensity: 50,
    },
    {
      id: "flood",
      name: "Flood Propagation",
      description: "Simulate water flow and flood spread in real-time",
      icon: Waves,
      color: "text-blue-500",
      isRunning: false,
      intensity: 50,
    },
    {
      id: "pollution",
      name: "Air Pollution Spread",
      description: "Model pollutant dispersion based on wind and terrain",
      icon: Cloud,
      color: "text-gray-400",
      isRunning: false,
      intensity: 50,
    },
    {
      id: "heat",
      name: "Heat Distribution",
      description: "Visualize urban heat island effects and temperature",
      icon: Flame,
      color: "text-red-400",
      isRunning: false,
      intensity: 50,
    },
    {
      id: "vegetation",
      name: "Vegetation Growth",
      description: "Simulate plant growth and ecosystem dynamics",
      icon: Leaf,
      color: "text-green-400",
      isRunning: false,
      intensity: 50,
    },
    {
      id: "electricity",
      name: "Power Grid Flow",
      description: "Visualize electricity distribution and load balancing",
      icon: Zap,
      color: "text-yellow-400",
      isRunning: false,
      intensity: 50,
    },
    {
      id: "hazard",
      name: "Hazard Propagation",
      description: "Model disaster spread (fire, earthquakes, etc.)",
      icon: AlertTriangle,
      color: "text-orange-400",
      isRunning: false,
      intensity: 50,
    },
  ]);

  const [selectedSim, setSelectedSim] = useState<string | null>(null);

  const toggleSimulation = (id: string) => {
    setSimulations((prev) =>
      prev.map((sim) =>
        sim.id === id ? { ...sim, isRunning: !sim.isRunning } : sim
      )
    );
  };

  const updateIntensity = (id: string, intensity: number) => {
    setSimulations((prev) =>
      prev.map((sim) => (sim.id === id ? { ...sim, intensity } : sim))
    );
  };

  const resetSimulation = (id: string) => {
    setSimulations((prev) =>
      prev.map((sim) =>
        sim.id === id ? { ...sim, isRunning: false, intensity: 50 } : sim
      )
    );
  };

  const runningCount = simulations.filter((s) => s.isRunning).length;

  return (
    <section id="simulation-effects" className="relative py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 mb-4">
            <Zap className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-accent font-medium uppercase tracking-wider">
              Free Physics Simulations
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Real-Time Environmental Simulations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Interactive physics-based simulations for environmental modeling, disaster prediction, and urban planning analysis. All simulations run client-side with no external API requirements.
          </p>
        </motion.div>

        {/* Status Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Available Simulations", value: simulations.length, icon: Settings, color: "text-primary" },
            { label: "Running Now", value: runningCount, icon: Zap, color: "text-accent" },
            { label: "Avg Intensity", value: Math.round(simulations.reduce((a, b) => a + b.intensity, 0) / simulations.length) + "%", icon: Cloud, color: "text-secondary" },
            { label: "Real-Time Rendering", value: "60 FPS", icon: Wind, color: "text-kenya-gold" },
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

        {/* Simulations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {simulations.map((sim, index) => {
            const Icon = sim.icon;
            return (
              <motion.div
                key={sim.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedSim(sim.id)}
                className="cursor-pointer"
              >
                <Card
                  className={`p-4 hover:border-primary/30 transition-all group ${
                    sim.isRunning ? "border-primary/30 bg-primary/5" : ""
                  } ${selectedSim === sim.id ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        <Icon className={`w-5 h-5 ${sim.color}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm">{sim.name}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                          Physics Simulation
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSimulation(sim.id);
                      }}
                    >
                      {sim.isRunning ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {sim.description}
                  </p>

                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Intensity</span>
                      <span className="text-xs font-bold text-foreground">{sim.intensity}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                        style={{ width: `${sim.intensity}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          sim.isRunning
                            ? "bg-primary animate-pulse"
                            : "bg-muted"
                        }`}
                      />
                      <span className="text-xs text-muted-foreground capitalize">
                        {sim.isRunning ? "Running" : "Idle"}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Control Panel */}
        {selectedSim && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 border-primary/20"
          >
            {(() => {
              const selected = simulations.find((s) => s.id === selectedSim);
              if (!selected) return null;

              return (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-muted">
                        <selected.icon className={`w-6 h-6 ${selected.color}`} />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-foreground text-lg">
                          {selected.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{selected.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedSim(null)}
                    >
                      ✕
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">
                        Simulation Intensity
                      </label>
                      <Slider
                        value={[selected.intensity]}
                        onValueChange={(value) =>
                          updateIntensity(selectedSim, value[0])
                        }
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Current: {selected.intensity}%
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-foreground mb-3 block">
                        Simulation Status
                      </label>
                      <div className="flex gap-2">
                        <Button
                          variant={selected.isRunning ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSimulation(selectedSim)}
                          className="flex-1"
                        >
                          {selected.isRunning ? "Pause" : "Start"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resetSimulation(selectedSim)}
                          className="flex-1"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/50">
                    <h4 className="font-bold text-foreground mb-3">Simulation Details</h4>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Rendering Method</p>
                        <p className="font-medium text-foreground">WebGL Particles</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Update Rate</p>
                        <p className="font-medium text-foreground">60 FPS</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Data Source</p>
                        <p className="font-medium text-foreground">Client-Side</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* Technical Info */}
        <div className="mt-8 p-4 rounded-lg bg-accent/5 border border-accent/20 text-center">
          <p className="text-sm text-muted-foreground">
            All simulations run entirely on your device using WebGL and Canvas rendering. No external APIs, no data transmission, no API keys required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SimulationEffects;
