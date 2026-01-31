import { motion } from "framer-motion";
import { Globe, Menu, X, ShieldCheck, Activity, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "#dashboard" },
    { label: "3D Globe", href: "#globe" },
    { label: "Real-Time Hub", href: "#realtime-hub" },
    { label: "Urban Planner", href: "#impact-forecaster" },
    { label: "AI Analytics", href: "#ai-analytics" },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="glass-panel px-6 py-3 flex items-center justify-between border-primary/20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-glow">
              <Globe className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-foreground leading-none tracking-tight">Sovereign Kenya</h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Digital Twin v2.0</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-all rounded-lg hover:bg-primary/5"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 mr-2">
              <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Live Sync</span>
            </div>
            <Button variant="glow" size="sm" className="hidden sm:flex gap-2" onClick={() => document.getElementById('realtime-hub')?.scrollIntoView({ behavior: 'smooth' })}>
              <Radio className="w-4 h-4" />
              Live Data
            </Button>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden mt-2 glass-panel p-4 border-primary/20"
          >
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-all rounded-lg hover:bg-primary/5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Button variant="glow" size="sm" className="mt-2 w-full gap-2" onClick={() => {
                document.getElementById('realtime-hub')?.scrollIntoView({ behavior: 'smooth' });
                setIsMenuOpen(false);
              }}>
                <Radio className="w-4 h-4" />
                Live Data
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
