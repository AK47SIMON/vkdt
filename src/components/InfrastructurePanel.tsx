import { motion } from "framer-motion";
import { 
  Wifi, 
  Zap, 
  Droplet, 
  Route,
  Signal,
  Battery,
  Activity,
  AlertTriangle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

const infrastructureData = [
  { 
    name: "Road Network",
    icon: Route,
    status: "operational",
    coverage: 78,
    metric: "177,800 km",
    description: "Total road network coverage",
    trend: "+2.3% this year"
  },
  { 
    name: "Power Grid",
    icon: Zap,
    status: "operational",
    coverage: 75,
    metric: "2,819 MW",
    description: "Installed generation capacity",
    trend: "+8.5% this year"
  },
  { 
    name: "Water Systems",
    icon: Droplet,
    status: "warning",
    coverage: 62,
    metric: "58% access",
    description: "Clean water accessibility",
    trend: "+1.8% this year"
  },
  { 
    name: "Telecom (4G/5G)",
    icon: Wifi,
    status: "operational",
    coverage: 92,
    metric: "96% coverage",
    description: "Mobile network coverage",
    trend: "+4.2% this year"
  },
  { 
    name: "Internet Fiber",
    icon: Signal,
    status: "operational",
    coverage: 45,
    metric: "12,000 km",
    description: "Fiber optic network",
    trend: "+15.3% this year"
  },
  { 
    name: "Renewable Energy",
    icon: Battery,
    status: "operational",
    coverage: 89,
    metric: "2,500 MW",
    description: "Clean energy capacity",
    trend: "+12.1% this year"
  },
];

const countyData = [
  { name: "Nairobi", power: 98, water: 85, telecom: 99, roads: 95 },
  { name: "Mombasa", power: 95, water: 78, telecom: 97, roads: 88 },
  { name: "Kisumu", power: 88, water: 65, telecom: 94, roads: 75 },
  { name: "Nakuru", power: 85, water: 70, telecom: 92, roads: 82 },
  { name: "Eldoret", power: 82, water: 68, telecom: 90, roads: 78 },
  { name: "Garissa", power: 45, water: 35, telecom: 75, roads: 45 },
];

const InfrastructurePanel = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "bg-primary text-primary";
      case "warning": return "bg-kenya-gold text-kenya-gold";
      case "critical": return "bg-accent text-accent";
      default: return "bg-muted-foreground text-muted-foreground";
    }
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return "#22c55e";
    if (coverage >= 60) return "#fbbf24";
    return "#ef4444";
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
            <Activity className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs text-secondary font-medium uppercase tracking-wider">Infrastructure</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            National Infrastructure
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring of Kenya's critical infrastructure including roads, power grid, water systems, and telecommunications.
          </p>
        </motion.div>

        {/* Infrastructure Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {infrastructureData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-5 hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)} bg-opacity-10`}>
                  {item.status === "warning" && <AlertTriangle className="w-3 h-3" />}
                  <span className="capitalize">{item.status}</span>
                </div>
              </div>

              {/* Coverage bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Coverage</span>
                  <span className="font-medium text-foreground">{item.coverage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.coverage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: getCoverageColor(item.coverage) }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">{item.metric}</span>
                <span className="text-primary text-xs">{item.trend}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* County Comparison Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-6"
        >
          <h3 className="font-display font-semibold text-foreground mb-6">
            Infrastructure by County
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countyData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 15%, 60%)', fontSize: 12 }}
                  width={80}
                />
                <Bar dataKey="power" fill="#22c55e" radius={[0, 4, 4, 0]} name="Power">
                  {countyData.map((entry, index) => (
                    <Cell key={`power-${index}`} fill={getCoverageColor(entry.power)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-primary" />
              <span className="text-muted-foreground">80%+ Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-kenya-gold" />
              <span className="text-muted-foreground">60-80% Coverage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-accent" />
              <span className="text-muted-foreground">&lt;60% Coverage</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InfrastructurePanel;
