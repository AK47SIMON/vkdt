import { useState } from "react";
import { motion } from "framer-motion";
import { Beaker, ArrowRight, Sparkles, Globe, BarChart3, Plane, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import RTKDTLab from "./RTKDTLab";

const LabLauncher = () => {
  const [isLabOpen, setIsLabOpen] = useState(false);

  const features = [
    { icon: Globe, label: "3D Spatial Twin", color: "#22c55e" },
    { icon: Plane, label: "Live Aviation", color: "#fbbf24" },
    { icon: BarChart3, label: "Economic Intel", color: "#f97316" },
    { icon: Leaf, label: "Environmental", color: "#22c55e" },
  ];

  return (
    <>
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">Now Available</span>
            </div>

            {/* Main Title */}
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Enter the{" "}
              <span className="text-primary relative">
                RT-KDT Lab
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-primary/30 rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Real-Time Kenya Digital Twin Laboratory. An integrated command center 
              for spatial intelligence, economic simulation, and predictive governance—built 
              entirely on open-source technology.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50"
                >
                  <feature.icon className="w-4 h-4" style={{ color: feature.color }} />
                  <span className="text-sm font-medium text-foreground">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Launch Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button
                size="lg"
                className="gap-3 px-8 py-6 text-lg rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-glow"
                onClick={() => setIsLabOpen(true)}
              >
                <Beaker className="w-5 h-5" />
                Launch RT-KDT Lab
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { value: "12", label: "Active Modules" },
                { value: "100%", label: "Open Source" },
                { value: "0", label: "API Costs" },
                { value: "Real-Time", label: "Data Sync" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-display font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lab Modal */}
      <RTKDTLab isOpen={isLabOpen} onClose={() => setIsLabOpen(false)} />
    </>
  );
};

export default LabLauncher;
