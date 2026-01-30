import { motion } from "framer-motion";
import { 
  Globe, 
  Database, 
  Activity, 
  Cloud, 
  Building2, 
  TreePine,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="absolute inset-0 scanline pointer-events-none" />
      
      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, hsla(145, 60%, 40%, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 80%, hsla(20, 70%, 50%, 0.1) 0%, transparent 40%),
            radial-gradient(ellipse 40% 30% at 20% 70%, hsla(200, 80%, 50%, 0.08) 0%, transparent 40%)
          `
        }}
      />

      {/* Floating Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-gradient-radial from-primary/20 to-transparent blur-3xl"
        style={{ top: '10%', right: '10%' }}
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-gradient-radial from-secondary/15 to-transparent blur-3xl"
        style={{ bottom: '20%', left: '5%' }}
        animate={{ 
          y: [0, 20, 0],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8"
          >
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium uppercase tracking-wider">100% Free & Open Source Digital Twin</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          >
            <span className="text-foreground">Virtual</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-kenya-gold bg-clip-text text-transparent glow-text">
              Kenya
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            A sovereign digital twin platform for Kenya. Real-time data visualization, 
            3D urban modeling, and infrastructure simulation powered by open-source 
            technologies with **no paid API keys required**.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Button variant="hero" size="xl" className="group" onClick={() => document.getElementById('globe')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore 3D Globe
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="glow" size="xl" onClick={() => document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' })}>
              View OSM Explorer
            </Button>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { icon: Globe, label: "OSM 3D Buildings" },
              { icon: Database, label: "Open Data APIs" },
              { icon: Activity, label: "Free AI Analytics" },
              { icon: Cloud, label: "Sentinel-2 Imagery" },
              { icon: Building2, label: "Urban Planning" },
              { icon: TreePine, label: "Sovereign Tech" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
