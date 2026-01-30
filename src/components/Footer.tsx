import { motion } from "framer-motion";
import { 
  Github, 
  Code2, 
  Database, 
  Map, 
  BarChart3, 
  Globe,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";

const technologies = [
  { name: "React", icon: Code2, description: "Frontend Framework" },
  { name: "Leaflet", icon: Map, description: "Interactive Maps" },
  { name: "Recharts", icon: BarChart3, description: "Data Visualization" },
  { name: "OpenStreetMap", icon: Globe, description: "Map Tiles" },
  { name: "PostgreSQL", icon: Database, description: "Data Storage" },
  { name: "Open Source", icon: Github, description: "Community Driven" },
];

const Footer = () => {
  return (
    <footer className="relative py-20 px-6 border-t border-border/50">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 100%, hsla(145, 60%, 40%, 0.08) 0%, transparent 60%)`
        }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Technologies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-8">
            Powered by Open Source Technologies
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card/50 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <tech.icon className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 pb-12 border-b border-border/50">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-foreground">Virtual Kenya</h4>
                <p className="text-xs text-muted-foreground">Digital Twin Platform</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              An open-source digital twin platform for Kenya, enabling data-driven urban planning, 
              environmental monitoring, and smart nation development. Inspired by Virtual Singapore.
            </p>
            <Button variant="glow" size="sm" className="gap-2">
              <Github className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-medium text-foreground mb-4">Platform</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Interactive Map</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Analytics</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Access</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="font-medium text-foreground mb-4">Resources</h5>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Data Sources</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contributing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2025 Virtual Kenya. Open Source Project.</p>
          <div className="flex items-center gap-4">
            <span>Built with 🇰🇪 for Kenya</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
