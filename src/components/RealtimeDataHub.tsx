import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Zap,
  Wind,
  Droplets,
  TrendingUp,
  Radio,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Signal,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { streamingService, initializeStreams, startAllStreams, kenyaStreams } from "@/lib/realtime/streamingService";

interface StreamStatus {
  id: string;
  name: string;
  enabled: boolean;
  running: boolean;
  lastUpdate: number | undefined;
  dataPoints: number;
  latestData: any[];
}

const RealtimeDataHub = () => {
  const [streams, setStreams] = useState<StreamStatus[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [expandedView, setExpandedView] = useState(false);

  // Initialize streams on mount
  useEffect(() => {
    initializeStreams();
    updateStreamStatuses();
  }, []);

  const updateStreamStatuses = useCallback(() => {
    const statuses = Object.values(kenyaStreams).map((config) => {
      const status = streamingService.getStatus(config.id);
      const latestData = streamingService.getLatestData(config.id) || [];

      return {
        ...status,
        latestData,
      } as StreamStatus;
    });

    setStreams(statuses);
  }, []);

  // Update statuses every 2 seconds
  useEffect(() => {
    const interval = setInterval(updateStreamStatuses, 2000);
    return () => clearInterval(interval);
  }, [updateStreamStatuses]);

  const handleStartAll = () => {
    startAllStreams();
    setIsRunning(true);
    updateStreamStatuses();
  };

  const handleStopAll = () => {
    streamingService.stopAll();
    setIsRunning(false);
    updateStreamStatuses();
  };

  const handleToggleStream = (streamId: string) => {
    if (streamingService.getStatus(streamId).running) {
      streamingService.stopStream(streamId);
    } else {
      streamingService.startStream(streamId);
    }
    updateStreamStatuses();
  };

  const getStreamIcon = (streamId: string) => {
    if (streamId.includes("aviation")) return Activity;
    if (streamId.includes("energy")) return Zap;
    if (streamId.includes("weather")) return Wind;
    if (streamId.includes("air")) return AlertCircle;
    if (streamId.includes("traffic")) return TrendingUp;
    if (streamId.includes("commodities")) return Radio;
    return Signal;
  };

  const getStreamColor = (streamId: string) => {
    if (streamId.includes("aviation")) return "text-yellow-500";
    if (streamId.includes("energy")) return "text-amber-500";
    if (streamId.includes("weather")) return "text-blue-500";
    if (streamId.includes("air")) return "text-red-500";
    if (streamId.includes("traffic")) return "text-purple-500";
    if (streamId.includes("commodities")) return "text-green-500";
    return "text-primary";
  };

  const selectedStreamData = streams.find((s) => s.id === selectedStream);

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Signal className="w-3.5 h-3.5 text-primary animate-pulse" />
            <span className="text-xs text-primary font-medium uppercase tracking-wider">
              Real-Time Data Hub
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Live Kenya Digital Twin
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time streaming data from multiple sources. Day-to-day accurate monitoring of Kenya's infrastructure, economy, and environment.
          </p>
        </motion.div>

        {/* Control Bar */}
        <div className="glass-panel p-4 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isRunning ? "bg-green-500 animate-pulse" : "bg-muted"}`} />
            <span className="text-sm font-medium text-foreground">
              {isRunning ? `${streams.filter((s) => s.running).length} streams active` : "All streams paused"}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="metric"
              size="sm"
              onClick={handleStartAll}
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Start All
            </Button>
            <Button
              variant="metric"
              size="sm"
              onClick={handleStopAll}
              disabled={!isRunning}
              className="gap-2"
            >
              <Pause className="w-4 h-4" />
              Stop All
            </Button>
            <Button
              variant="metric"
              size="sm"
              onClick={updateStreamStatuses}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Streams Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {streams.map((stream, idx) => {
            const Icon = getStreamIcon(stream.id);
            const colorClass = getStreamColor(stream.id);

            return (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel p-4 cursor-pointer hover:border-primary/50 transition-all"
                onClick={() => setSelectedStream(stream.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${colorClass}`} />
                    <h3 className="font-semibold text-sm text-foreground">{stream.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStream(stream.id);
                    }}
                  >
                    {stream.running ? (
                      <Signal className="w-4 h-4 text-green-500 animate-pulse" />
                    ) : (
                      <Signal className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={stream.running ? "text-green-500 font-medium" : "text-muted-foreground"}>
                      {stream.running ? "Live" : "Idle"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Points:</span>
                    <span className="text-foreground font-medium">{stream.dataPoints}</span>
                  </div>
                  {stream.lastUpdate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Update:</span>
                      <span className="text-foreground font-medium">
                        {new Date(stream.lastUpdate).toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Data preview */}
                {stream.latestData.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Latest Value:</p>
                    <div className="text-xs font-mono text-primary truncate">
                      {JSON.stringify(stream.latestData[0]?.value).substring(0, 60)}...
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Detailed View */}
        <AnimatePresence>
          {selectedStreamData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-panel p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {React.createElement(getStreamIcon(selectedStreamData.id), {
                    className: `w-6 h-6 ${getStreamColor(selectedStreamData.id)}`,
                  })}
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">
                      {selectedStreamData.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedStreamData.running ? "🟢 Live Stream" : "⚪ Paused"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedStream(null)}
                >
                  <EyeOff className="w-5 h-5" />
                </Button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Timestamp</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Value</th>
                      <th className="text-left py-2 px-3 text-muted-foreground font-medium">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStreamData.latestData.slice(0, 10).map((dataPoint, idx) => (
                      <tr key={idx} className="border-b border-border/30 hover:bg-muted/30">
                        <td className="py-2 px-3 text-xs text-muted-foreground">
                          {new Date(dataPoint.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-2 px-3 text-xs text-foreground font-mono">
                          {JSON.stringify(dataPoint.value)}
                        </td>
                        <td className="py-2 px-3 text-xs">
                          <span className="px-2 py-1 rounded bg-green-500/10 text-green-500">
                            {(dataPoint.confidence * 100).toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-primary/5 to-transparent border border-primary/20"
        >
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-bold">Real-Time Data Hub:</span> All data streams are updated automatically at configured intervals. 
            This enables day-to-day accurate monitoring and forecasting for urban planning, economic analysis, and infrastructure management.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default RealtimeDataHub;
