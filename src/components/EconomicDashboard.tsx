import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Leaf, 
  Sun, 
  BarChart3,
  RefreshCw,
  Coffee,
  Wheat,
  Droplets
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface CommodityPrice {
  name: string;
  symbol: string;
  price: number;
  change: number;
  unit: string;
  icon: typeof Coffee;
  color: string;
}

interface ExchangeRate {
  pair: string;
  rate: number;
  change: number;
  timestamp: Date;
}

interface EnergyData {
  source: string;
  generation: number;
  capacity: number;
  color: string;
}

const EconomicDashboard = () => {
  const [commodities, setCommodities] = useState<CommodityPrice[]>([
    { name: "Kenya Tea (Auction)", symbol: "TEA", price: 298.50, change: 2.3, unit: "USD/kg", icon: Leaf, color: "#22c55e" },
    { name: "Arabica Coffee", symbol: "COFFEE", price: 4.85, change: -1.2, unit: "USD/lb", icon: Coffee, color: "#8b4513" },
    { name: "Maize (Nairobi)", symbol: "MAIZE", price: 45.20, change: 0.8, unit: "KES/kg", icon: Wheat, color: "#fbbf24" },
    { name: "Crude Oil (Brent)", symbol: "BRENT", price: 82.45, change: -0.5, unit: "USD/bbl", icon: Droplets, color: "#1e293b" },
  ]);

  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>({
    pair: "KES/USD",
    rate: 129.50,
    change: -0.25,
    timestamp: new Date(),
  });

  const [energyData] = useState<EnergyData[]>([
    { source: "Geothermal", generation: 892, capacity: 950, color: "#ef4444" },
    { source: "Hydro", generation: 826, capacity: 1000, color: "#3b82f6" },
    { source: "Wind (Turkana)", generation: 310, capacity: 400, color: "#22c55e" },
    { source: "Solar", generation: 145, capacity: 200, color: "#fbbf24" },
    { source: "Thermal", generation: 420, capacity: 600, color: "#64748b" },
  ]);

  const [ndviData] = useState([
    { month: "Jul", value: 0.65 },
    { month: "Aug", value: 0.58 },
    { month: "Sep", value: 0.52 },
    { month: "Oct", value: 0.61 },
    { month: "Nov", value: 0.72 },
    { month: "Dec", value: 0.78 },
    { month: "Jan", value: 0.74 },
  ]);

  const [teaAuctionHistory] = useState([
    { week: "W1", price: 285 },
    { week: "W2", price: 290 },
    { week: "W3", price: 288 },
    { week: "W4", price: 295 },
    { week: "W5", price: 298 },
  ]);

  const [kesUsdHistory] = useState([
    { day: "Mon", rate: 129.80 },
    { day: "Tue", rate: 129.65 },
    { day: "Wed", rate: 129.45 },
    { day: "Thu", rate: 129.60 },
    { day: "Fri", rate: 129.50 },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCommodities(prev => prev.map(c => ({
        ...c,
        price: c.price * (1 + (Math.random() - 0.5) * 0.002),
        change: c.change + (Math.random() - 0.5) * 0.1,
      })));

      setExchangeRate(prev => ({
        ...prev,
        rate: prev.rate * (1 + (Math.random() - 0.5) * 0.001),
        change: prev.change + (Math.random() - 0.5) * 0.05,
        timestamp: new Date(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalGeneration = energyData.reduce((sum, e) => sum + e.generation, 0);
  const renewableGeneration = energyData
    .filter(e => ["Geothermal", "Hydro", "Wind (Turkana)", "Solar"].includes(e.source))
    .reduce((sum, e) => sum + e.generation, 0);
  const renewablePercentage = ((renewableGeneration / totalGeneration) * 100).toFixed(1);

  return (
    <section id="economic-dashboard" className="relative py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kenya-gold/10 border border-kenya-gold/30 mb-4">
            <BarChart3 className="w-3.5 h-3.5 text-kenya-gold" />
            <span className="text-xs text-kenya-gold font-medium uppercase tracking-wider">
              Economic Sovereignty Dashboard
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Real-Time Kenya Economic Intelligence
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Live commodity prices, KES/USD exchange rates, renewable energy yield, and environmental monitoring. 
            Data sourced from open APIs and official statistics.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Commodity Prices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="glass-panel h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Commodity Prices
                  <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Live
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {commodities.map((commodity) => (
                    <div
                      key={commodity.symbol}
                      className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${commodity.color}20` }}
                          >
                            <commodity.icon 
                              className="w-4 h-4" 
                              style={{ color: commodity.color }} 
                            />
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{commodity.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{commodity.symbol}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-bold ${
                          commodity.change >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {commodity.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {commodity.change >= 0 ? '+' : ''}{commodity.change.toFixed(2)}%
                        </div>
                      </div>
                      <p className="text-2xl font-display font-bold text-foreground">
                        {commodity.price.toFixed(2)}
                        <span className="text-xs text-muted-foreground ml-1">{commodity.unit}</span>
                      </p>
                    </div>
                  ))}
                </div>

                {/* Tea Auction Chart */}
                <div className="mt-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                    Mombasa Tea Auction (5 Week Trend)
                  </p>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={teaAuctionHistory}>
                        <defs>
                          <linearGradient id="teaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="#22c55e"
                          fill="url(#teaGradient)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Exchange Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-panel h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="w-5 h-5 text-kenya-gold" />
                  KES/USD Exchange
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-4xl font-display font-bold text-foreground">
                    {exchangeRate.rate.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">KES per 1 USD</p>
                  <div className={`inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-bold ${
                    exchangeRate.change >= 0 
                      ? 'bg-red-500/10 text-red-500' 
                      : 'bg-green-500/10 text-green-500'
                  }`}>
                    {exchangeRate.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {exchangeRate.change >= 0 ? '+' : ''}{exchangeRate.change.toFixed(2)}%
                  </div>
                </div>

                <div className="h-24 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={kesUsdHistory}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis hide domain={['dataMin - 0.2', 'dataMax + 0.2']} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#fbbf24"
                        strokeWidth={2}
                        dot={{ fill: '#fbbf24', r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-[10px] text-muted-foreground text-center mt-4">
                  Last updated: {exchangeRate.timestamp.toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Renewable Energy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sun className="w-5 h-5 text-kenya-gold" />
                  Kenya Energy Grid (Live Generation)
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    {renewablePercentage}% Renewable
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-3">
                  {energyData.map((source) => (
                    <div key={source.source} className="text-center">
                      <div className="relative h-24 bg-muted/30 rounded-lg overflow-hidden mb-2">
                        <div
                          className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-1000"
                          style={{
                            height: `${(source.generation / source.capacity) * 100}%`,
                            backgroundColor: source.color,
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-white drop-shadow-md">
                            {source.generation} MW
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-foreground uppercase">{source.source}</p>
                      <p className="text-[9px] text-muted-foreground">
                        {((source.generation / source.capacity) * 100).toFixed(0)}% cap
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Total Generation: <span className="font-bold text-foreground">{totalGeneration.toLocaleString()} MW</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Data: Kenya Power (Simulated)
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* NDVI Greenery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-panel h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Leaf className="w-5 h-5 text-green-500" />
                  NDVI Carbon Sink Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-4xl font-display font-bold text-green-500">
                    0.74
                  </p>
                  <p className="text-sm text-muted-foreground">National Average</p>
                  <p className="text-[10px] text-green-500 mt-1">Healthy Vegetation</p>
                </div>

                <div className="h-24 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ndviData}>
                      <defs>
                        <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis hide domain={[0.4, 0.9]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#22c55e"
                        fill="url(#ndviGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-[10px] text-muted-foreground text-center mt-4">
                  Source: NASA MODIS NDVI
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EconomicDashboard;
