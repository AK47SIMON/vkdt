import { motion } from "framer-motion";
import { Mountain, Eye, Layers, ChevronUp, ChevronDown, Info, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const terrainLayers = [
  { name: "Mount Kenya Peak", elevation: "5,199m", color: "#ffffff", height: 100 },
  { name: "Aberdare Highlands", elevation: "3,999m", color: "#e5e7eb", height: 77 },
  { name: "Rift Escarpment", elevation: "3,098m", color: "#d1d5db", height: 60 },
  { name: "Central Plateau", elevation: "2,500m", color: "#a3e635", height: 48 },
  { name: "Savanna Basin", elevation: "1,500m", color: "#84cc16", height: 29 },
  { name: "Coastal Corridor", elevation: "0-500m", color: "#22c55e", height: 10 },
];

const TerrainVisualization = () => {
  const [rotateX, setRotateX] = useState(60);
  const [rotateZ, setRotateZ] = useState(-15);
  const [showLabels, setShowLabels] = useState(true);

  return (
    <section id="terrain" className="relative py-20 px-6 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 30%, hsla(145, 60%, 40%, 0.08) 0%, transparent 60%)`
        }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Mountain className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-primary font-medium uppercase tracking-wider">High-Res Topography</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            National Elevation Model
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Utilizing NASA SRTM and ESA Copernicus 30m Digital Elevation Models to visualize Kenya's diverse landscape in 3D.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 3D Terrain View */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-panel p-6 relative overflow-hidden bg-card/50"
          >
            {/* Technical Header */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <div className="px-2 py-1 rounded bg-muted/80 backdrop-blur border border-border/50">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Source: SRTM 30m</span>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <Button 
                variant="metric" 
                size="icon" 
                className="h-8 w-8 bg-card/80 backdrop-blur"
                onClick={() => setRotateX(prev => Math.min(prev + 10, 80))}
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button 
                variant="metric" 
                size="icon" 
                className="h-8 w-8 bg-card/80 backdrop-blur"
                onClick={() => setRotateX(prev => Math.max(prev - 10, 30))}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
              <Button 
                variant={showLabels ? "default" : "metric"}
                size="icon" 
                className="h-8 w-8 bg-card/80 backdrop-blur"
                onClick={() => setShowLabels(!showLabels)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>

            {/* 3D Container */}
            <div 
              className="relative h-[450px] w-full"
              style={{ perspective: '1200px' }}
            >
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`
                }}
                animate={{ rotateZ: rotateZ }}
                transition={{ duration: 0.5 }}
              >
                {/* Terrain layers */}
                {terrainLayers.map((layer, index) => (
                  <motion.div
                    key={layer.name}
                    initial={{ opacity: 0, translateZ: -100 }}
                    whileInView={{ opacity: 1, translateZ: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="absolute rounded-2xl border border-primary/10"
                    style={{
                      width: `${320 - index * 25}px`,
                      height: `${240 - index * 20}px`,
                      background: `linear-gradient(180deg, ${layer.color}20 0%, ${layer.color}10 100%)`,
                      transform: `translateZ(${layer.height * 2.5}px)`,
                      boxShadow: `0 0 30px rgba(0,0,0,0.5)`,
                    }}
                  />
                ))}

                {/* Peak marker */}
                <motion.div
                  className="absolute"
                  style={{
                    transform: 'translateZ(260px)',
                    width: '24px',
                    height: '24px',
                  }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-full h-full rounded-full bg-primary shadow-glow animate-pulse" />
                  {showLabels && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded bg-card/80 border border-border/50 text-[10px] font-bold text-foreground uppercase tracking-widest">
                      Peak 5,199m
                    </div>
                  )}
                </motion.div>
              </motion.div>

              {/* Grid overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  backgroundImage: `
                    linear-gradient(hsl(var(--primary) / 0.5) 1px, transparent 1px),
                    linear-gradient(90deg, hsl(var(--primary) / 0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: '40px 40px',
                  transform: `perspective(1200px) rotateX(${rotateX}deg)`
                }}
              />
            </div>

            {/* Rotation indicator */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                <Info className="w-3 h-3" />
                Sovereign Elevation Data
              </div>
            </div>
          </motion.div>

          {/* Elevation Legend */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-6 border-primary/20"
            >
              <div className="flex items-center gap-2 mb-6">
                <Layers className="w-5 h-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Topographic Strata</h3>
              </div>

              <div className="space-y-3">
                {terrainLayers.map((layer, index) => (
                  <motion.div
                    key={layer.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div 
                      className="w-3 h-3 rounded-full border border-border/50 shadow-glow"
                      style={{ backgroundColor: layer.color }}
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-foreground uppercase tracking-tight">{layer.name}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">{layer.elevation}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="glass-panel p-6 border-kenya-gold/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-kenya-gold" />
                <h3 className="font-display font-semibold text-foreground">Terrain Sovereignty</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By utilizing global open DEM datasets (SRTM/Copernicus), the Virtual Kenya Twin remains independent of commercial terrain providers like Google or Mapbox.
              </p>
              <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Precision</span>
                <span className="text-[10px] font-bold text-primary">30m Horizontal</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TerrainVisualization;
