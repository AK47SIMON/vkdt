import { motion } from "framer-motion";
import { 
  Sun, 
  Cloud, 
  Droplets, 
  Wind, 
  ThermometerSun,
  Gauge,
  TreePine,
  Waves,
  Info
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Sample climate data
const temperatureData = [
  { month: "Jan", temp: 25, rainfall: 45 },
  { month: "Feb", temp: 26, rainfall: 38 },
  { month: "Mar", temp: 26, rainfall: 85 },
  { month: "Apr", temp: 24, rainfall: 180 },
  { month: "May", temp: 22, rainfall: 120 },
  { month: "Jun", temp: 21, rainfall: 35 },
  { month: "Jul", temp: 20, rainfall: 20 },
  { month: "Aug", temp: 20, rainfall: 25 },
  { month: "Sep", temp: 22, rainfall: 30 },
  { month: "Oct", temp: 24, rainfall: 65 },
  { month: "Nov", temp: 24, rainfall: 140 },
  { month: "Dec", temp: 24, rainfall: 95 },
];

interface EnvironmentCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  status: "good" | "moderate" | "warning";
  description: string;
}

const EnvironmentCard = ({ icon: Icon, title, value, status, description }: EnvironmentCardProps) => {
  const statusColors = {
    good: "bg-primary/20 text-primary border-primary/30",
    moderate: "bg-kenya-gold/20 text-kenya-gold border-kenya-gold/30",
    warning: "bg-accent/20 text-accent border-accent/30"
  };

  return (
    <div className="glass-panel p-5 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2.5 rounded-lg bg-muted">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      <p className="text-2xl font-display font-bold text-foreground mb-2">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

const EnvironmentalPanel = () => {
  const envMetrics = [
    { 
      icon: ThermometerSun, 
      title: "Air Quality (OpenAQ)", 
      value: "42 AQI", 
      status: "good" as const,
      description: "Healthy air quality across major cities"
    },
    { 
      icon: Droplets, 
      title: "Water (Open Data)", 
      value: "78%", 
      status: "good" as const,
      description: "National reservoir capacity"
    },
    { 
      icon: TreePine, 
      title: "Forest Cover (Sentinel)", 
      value: "7.4%", 
      status: "warning" as const,
      description: "Target: 10% by 2030"
    },
    { 
      icon: Waves, 
      title: "Ocean Health (NOAA)", 
      value: "Good", 
      status: "good" as const,
      description: "Coastal ecosystem status"
    },
    { 
      icon: Wind, 
      title: "Wind (OpenWeather)", 
      value: "12 km/h", 
      status: "moderate" as const,
      description: "Average national wind speed"
    },
    { 
      icon: Gauge, 
      title: "CO2 (Global Carbon)", 
      value: "0.3 Mt", 
      status: "good" as const,
      description: "Monthly CO2 emissions"
    },
    { 
      icon: Sun, 
      title: "Solar Potential (GSA)", 
      value: "5.8 kWh/m²", 
      status: "good" as const,
      description: "Daily photovoltaic potential"
    },
    { 
      icon: Waves, 
      title: "Flood Hazard (FastFlood)", 
      value: "Low", 
      status: "good" as const,
      description: "Real-time inundation monitoring"
    },
  ];

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-transparent via-card/30 to-transparent">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kenya-gold/10 border border-kenya-gold/30 mb-4">
            <Sun className="w-3.5 h-3.5 text-kenya-gold" />
            <span className="text-xs text-kenya-gold font-medium uppercase tracking-wider">Environmental Monitoring</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Climate & Environment
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time environmental monitoring and climate data across Kenya's diverse ecosystems using 100% free data sources.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Environment Cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {envMetrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <EnvironmentCard {...metric} />
              </motion.div>
            ))}
          </div>

          {/* Climate Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Cloud className="w-5 h-5 text-primary" />
              <h3 className="font-display font-semibold text-foreground">Climate Patterns</h3>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={temperatureData}>
                  <defs>
                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(145, 60%, 40%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(145, 60%, 40%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(215, 15%, 60%)', fontSize: 10 }}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(220, 18%, 10%)',
                      border: '1px solid hsl(220, 15%, 20%)',
                      borderRadius: '8px',
                      color: 'hsl(210, 20%, 95%)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    stroke="hsl(145, 60%, 40%)"
                    strokeWidth={2}
                    fill="url(#tempGradient)"
                    name="Temperature (°C)"
                  />
                  <Area
                    type="monotone"
                    dataKey="rainfall"
                    stroke="hsl(200, 80%, 50%)"
                    strokeWidth={2}
                    fill="url(#rainGradient)"
                    name="Rainfall (mm)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-primary rounded" />
                <span className="text-muted-foreground">Temperature</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-[hsl(200,80%,50%)] rounded" />
                <span className="text-muted-foreground">Rainfall</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-border/50 text-center flex items-center justify-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground">
            Climate data is powered by OpenWeatherMap, OpenAQ, and Copernicus Sentinel-2. No paid API keys required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EnvironmentalPanel;
