import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wifi,
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Battery,
  Signal,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area } from "recharts";

interface SensorData {
  id: string;
  name: string;
  location: string;
  type: "temperature" | "humidity" | "air_quality" | "water" | "traffic" | "energy";
  value: number;
  unit: string;
  status: "online" | "warning" | "offline";
  lastUpdate: Date;
  battery: number;
  signal: number;
}

// Simulated IoT sensor data
const initialSensors: SensorData[] = [
  { id: "temp-001", name: "Nairobi CBD Temp", location: "Nairobi", type: "temperature", value: 24.5, unit: "°C", status: "online", lastUpdate: new Date(), battery: 85, signal: 95 },
  { id: "hum-001", name: "Mombasa Humidity", location: "Mombasa", type: "humidity", value: 78, unit: "%", status: "online", lastUpdate: new Date(), battery: 72, signal: 88 },
  { id: "air-001", name: "Kisumu Air Quality", location: "Kisumu", type: "air_quality", value: 42, unit: "AQI", status: "online", lastUpdate: new Date(), battery: 91, signal: 92 },
  { id: "wat-001", name: "Lake Victoria Level", location: "Kisumu", type: "water", value: 1134.2, unit: "m", status: "warning", lastUpdate: new Date(), battery: 45, signal: 78 },
  { id: "trf-001", name: "Thika Road Traffic", location: "Nairobi", type: "traffic", value: 2847, unit: "vehicles/hr", status: "online", lastUpdate: new Date(), battery: 100, signal: 99 },
  { id: "eng-001", name: "Nakuru Power Grid", location: "Nakuru", type: "energy", value: 342, unit: "MW", status: "online", lastUpdate: new Date(), battery: 100, signal: 97 },
  { id: "temp-002", name: "Eldoret Station", location: "Eldoret", type: "temperature", value: 18.2, unit: "°C", status: "online", lastUpdate: new Date(), battery: 67, signal: 85 },
  { id: "air-002", name: "Industrial Area AQ", location: "Nairobi", type: "air_quality", value: 68, unit: "AQI", status: "warning", lastUpdate: new Date(), battery: 58, signal: 91 },
];

// Generate time series data
const generateTimeSeriesData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    temperature: 20 + Math.random() * 10 + Math.sin(i / 4) * 3,
    humidity: 60 + Math.random() * 20,
    airQuality: 30 + Math.random() * 40,
    traffic: 1000 + Math.random() * 3000 + (i > 6 && i < 20 ? 1500 : 0),
  }));
};

const getTypeIcon = (type: SensorData["type"]) => {
  switch (type) {
    case "temperature": return Thermometer;
    case "humidity": return Droplets;
    case "air_quality": return Wind;
    case "water": return Droplets;
    case "traffic": return Activity;
    case "energy": return Gauge;
    default: return Wifi;
  }
};

const getStatusColor = (status: SensorData["status"]) => {
  switch (status) {
    case "online": return "text-primary bg-primary/10 border-primary/30";
    case "warning": return "text-kenya-gold bg-kenya-gold/10 border-kenya-gold/30";
    case "offline": return "text-accent bg-accent/10 border-accent/30";
  }
};

const IoTDashboard = () => {
  const [sensors, setSensors] = useState(initialSensors);
  const [timeSeriesData] = useState(generateTimeSeriesData);
  const [selectedType, setSelectedType] = useState<SensorData["type"] | "all">("all");

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) =>
        prev.map((sensor) => ({
          ...sensor,
          value: sensor.value + (Math.random() - 0.5) * (sensor.value * 0.02),
          lastUpdate: new Date(),
          signal: Math.min(100, Math.max(50, sensor.signal + (Math.random() - 0.5) * 5)),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredSensors = selectedType === "all" 
    ? sensors 
    : sensors.filter((s) => s.type === selectedType);

  const onlineSensors = sensors.filter((s) => s.status === "online").length;
  const warningSensors = sensors.filter((s) => s.status === "warning").length;

  return (
    <section className="relative py-20 px-6 bg-gradient-to-b from-transparent via-card/20 to-transparent">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 mb-4">
            <Wifi className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs text-secondary font-medium uppercase tracking-wider">IoT Network</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            IoT Sensor Network
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time data from {sensors.length} IoT sensors deployed across Kenya monitoring environment, traffic, and infrastructure.
          </p>
        </motion.div>

        {/* Network Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Sensors", value: sensors.length, icon: Wifi, color: "text-primary" },
            { label: "Online", value: onlineSensors, icon: CheckCircle, color: "text-primary" },
            { label: "Warnings", value: warningSensors, icon: AlertTriangle, color: "text-kenya-gold" },
            { label: "Data Points/sec", value: "12.4K", icon: Activity, color: "text-secondary" },
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
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", "temperature", "humidity", "air_quality", "water", "traffic", "energy"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all ${
                selectedType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {type === "all" ? "All Sensors" : type.replace("_", " ").charAt(0).toUpperCase() + type.replace("_", " ").slice(1)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sensor Cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {filteredSensors.map((sensor, index) => {
              const Icon = getTypeIcon(sensor.type);
              return (
                <motion.div
                  key={sensor.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-panel p-4 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{sensor.name}</p>
                        <p className="text-xs text-muted-foreground">{sensor.location}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(sensor.status)}`}>
                      {sensor.status}
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="text-3xl font-display font-bold text-foreground">
                      {sensor.value.toFixed(1)}
                      <span className="text-sm font-normal text-muted-foreground ml-1">{sensor.unit}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Battery className="w-3 h-3" />
                        {sensor.battery}%
                      </div>
                      <div className="flex items-center gap-1">
                        <Signal className="w-3 h-3" />
                        {sensor.signal.toFixed(0)}%
                      </div>
                    </div>
                    <span>
                      {sensor.lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Time Series Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-panel p-6"
          >
            <h3 className="font-display font-semibold text-foreground mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              24-Hour Trends
            </h3>

            <div className="space-y-6">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Temperature (°C)</p>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData}>
                      <defs>
                        <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(145, 60%, 40%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(145, 60%, 40%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="hour" hide />
                      <YAxis hide domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 18%, 10%)",
                          border: "1px solid hsl(220, 15%, 20%)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Area type="monotone" dataKey="temperature" stroke="hsl(145, 60%, 40%)" strokeWidth={2} fill="url(#tempGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Traffic (vehicles/hr)</p>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData}>
                      <defs>
                        <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(20, 70%, 50%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(20, 70%, 50%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="hour" hide />
                      <YAxis hide domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 18%, 10%)",
                          border: "1px solid hsl(220, 15%, 20%)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Area type="monotone" dataKey="traffic" stroke="hsl(20, 70%, 50%)" strokeWidth={2} fill="url(#trafficGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Air Quality (AQI)</p>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={timeSeriesData}>
                      <XAxis dataKey="hour" hide />
                      <YAxis hide domain={["auto", "auto"]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 18%, 10%)",
                          border: "1px solid hsl(220, 15%, 20%)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Line type="monotone" dataKey="airQuality" stroke="hsl(200, 80%, 50%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IoTDashboard;
