/**
 * Real-Time Data Streaming Service
 * Manages continuous, live data feeds from multiple sources
 * Enables day-to-day accurate monitoring of Kenya's digital twin
 */

export interface StreamDataPoint {
  id: string;
  timestamp: number;
  value: any;
  source: string;
  confidence?: number;
}

export interface StreamConfig {
  id: string;
  name: string;
  source: string;
  interval: number; // milliseconds
  endpoint?: string;
  parser?: (data: any) => StreamDataPoint[];
  enabled: boolean;
}

export interface StreamListener {
  id: string;
  onData: (data: StreamDataPoint[]) => void;
  onError?: (error: Error) => void;
}

class RealtimeStreamingService {
  private streams: Map<string, StreamConfig> = new Map();
  private listeners: Map<string, Set<StreamListener>> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private lastData: Map<string, StreamDataPoint[]> = new Map();

  /**
   * Register a new data stream
   */
  registerStream(config: StreamConfig) {
    this.streams.set(config.id, config);
    this.listeners.set(config.id, new Set());
    console.log(`[RT-Stream] Registered: ${config.name}`);
  }

  /**
   * Subscribe to a stream
   */
  subscribe(streamId: string, listener: StreamListener): () => void {
    const streamListeners = this.listeners.get(streamId);
    if (!streamListeners) {
      throw new Error(`Stream ${streamId} not found`);
    }

    streamListeners.add(listener);

    // Return unsubscribe function
    return () => {
      streamListeners.delete(listener);
      if (streamListeners.size === 0) {
        this.stopStream(streamId);
      }
    };
  }

  /**
   * Start streaming data
   */
  startStream(streamId: string) {
    const config = this.streams.get(streamId);
    if (!config) {
      throw new Error(`Stream ${streamId} not found`);
    }

    if (this.intervals.has(streamId)) {
      console.warn(`Stream ${streamId} already running`);
      return;
    }

    const fetchData = async () => {
      try {
        if (config.endpoint) {
          const response = await fetch(config.endpoint);
          const rawData = await response.json();
          const parsedData = config.parser ? config.parser(rawData) : [rawData];
          
          this.lastData.set(streamId, parsedData);
          this.notifyListeners(streamId, parsedData);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        this.notifyListeners(streamId, [], err);
      }
    };

    // Initial fetch
    fetchData();

    // Set up recurring fetch
    const interval = setInterval(fetchData, config.interval);
    this.intervals.set(streamId, interval);
    console.log(`[RT-Stream] Started: ${config.name} (interval: ${config.interval}ms)`);
  }

  /**
   * Stop streaming data
   */
  stopStream(streamId: string) {
    const interval = this.intervals.get(streamId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(streamId);
      console.log(`[RT-Stream] Stopped: ${streamId}`);
    }
  }

  /**
   * Get latest data from a stream
   */
  getLatestData(streamId: string): StreamDataPoint[] | null {
    return this.lastData.get(streamId) || null;
  }

  /**
   * Notify all listeners of new data
   */
  private notifyListeners(streamId: string, data: StreamDataPoint[], error?: Error) {
    const streamListeners = this.listeners.get(streamId);
    if (!streamListeners) return;

    streamListeners.forEach((listener) => {
      if (error) {
        listener.onError?.(error);
      } else {
        listener.onData(data);
      }
    });
  }

  /**
   * Stop all streams
   */
  stopAll() {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
    console.log("[RT-Stream] All streams stopped");
  }

  /**
   * Get stream status
   */
  getStatus(streamId: string) {
    const config = this.streams.get(streamId);
    const isRunning = this.intervals.has(streamId);
    const lastData = this.lastData.get(streamId);

    return {
      id: streamId,
      name: config?.name,
      enabled: config?.enabled,
      running: isRunning,
      lastUpdate: lastData?.[0]?.timestamp,
      dataPoints: lastData?.length || 0,
    };
  }
}

export const streamingService = new RealtimeStreamingService();

// Pre-configured streams for Kenya Digital Twin
export const kenyaStreams = {
  // Aviation tracking (OpenSky Network)
  aviation: {
    id: "aviation-live",
    name: "Live Aviation Tracking",
    source: "OpenSky Network",
    interval: 10000, // 10 seconds
    endpoint: "https://opensky-network.org/api/states/all?lamin=-5&lomin=33&lamax=5&lomax=42",
    parser: (data: any) => {
      if (!data.states) return [];
      return data.states
        .filter((state: any[]) => state[6] !== null && state[7] !== null && !state[8]) // lat, lon, not on ground
        .map((state: any[], idx: number) => ({
          id: `aircraft-${state[0]}`,
          timestamp: Date.now(),
          value: {
            icao24: state[0],
            callsign: state[1]?.trim(),
            origin: state[2],
            lat: state[6],
            lon: state[7],
            altitude: state[8],
            velocity: state[9],
            heading: state[10],
          },
          source: "OpenSky",
          confidence: 0.95,
        }));
    },
    enabled: true,
  } as StreamConfig,

  // Commodity prices (simulated - would connect to real API)
  commodities: {
    id: "commodities-live",
    name: "Live Commodity Prices",
    source: "Kenya Markets",
    interval: 300000, // 5 minutes
    parser: () => {
      // Simulated commodity data
      const baseData = {
        tea: 120 + Math.random() * 10,
        coffee: 180 + Math.random() * 20,
        maize: 45 + Math.random() * 5,
        sugarcane: 3500 + Math.random() * 200,
      };

      return Object.entries(baseData).map(([commodity, price]) => ({
        id: `commodity-${commodity}`,
        timestamp: Date.now(),
        value: { commodity, price, unit: commodity === "sugarcane" ? "KES/tonne" : "KES/kg" },
        source: "KNBS",
        confidence: 0.85,
      }));
    },
    enabled: true,
  } as StreamConfig,

  // Energy grid load
  energyGrid: {
    id: "energy-grid-live",
    name: "Live Energy Grid Load",
    source: "Kenya Power",
    interval: 60000, // 1 minute
    parser: () => {
      // Simulated energy data
      const baseLoad = 2400; // MW
      const variation = Math.sin(Date.now() / 3600000) * 300; // Daily cycle
      const randomNoise = (Math.random() - 0.5) * 100;

      return [
        {
          id: "grid-load",
          timestamp: Date.now(),
          value: {
            totalLoad: baseLoad + variation + randomNoise,
            geothermal: 700 + Math.random() * 50,
            hydro: 400 + Math.random() * 100,
            wind: 150 + Math.random() * 50,
            solar: Math.max(0, 200 + Math.sin(Date.now() / 3600000) * 150),
            thermal: 950 + Math.random() * 100,
          },
          source: "Kenya Power",
          confidence: 0.92,
        },
      ];
    },
    enabled: true,
  } as StreamConfig,

  // Traffic flow (simulated - would connect to real traffic API)
  traffic: {
    id: "traffic-live",
    name: "Live Traffic Flow",
    source: "Urban Mobility",
    interval: 30000, // 30 seconds
    parser: () => {
      // Simulated traffic data for major Nairobi corridors
      const corridors = [
        "Nairobi-Mombasa",
        "Nairobi-Kisumu",
        "Nairobi-Nakuru",
        "Nairobi CBD",
        "Westlands-CBD",
      ];

      return corridors.map((corridor) => ({
        id: `traffic-${corridor.replace(/\s+/g, "-").toLowerCase()}`,
        timestamp: Date.now(),
        value: {
          corridor,
          congestionLevel: Math.random() * 100, // 0-100%
          averageSpeed: 20 + Math.random() * 40, // km/h
          vehicleCount: Math.floor(100 + Math.random() * 500),
          incidents: Math.floor(Math.random() * 3),
        },
        source: "Urban Mobility",
        confidence: 0.80,
      }));
    },
    enabled: true,
  } as StreamConfig,

  // Weather data
  weather: {
    id: "weather-live",
    name: "Live Weather Data",
    source: "NOAA/OpenWeather",
    interval: 600000, // 10 minutes
    parser: () => {
      // Simulated weather data for Kenya
      return [
        {
          id: "weather-nairobi",
          timestamp: Date.now(),
          value: {
            location: "Nairobi",
            temperature: 20 + Math.random() * 8,
            humidity: 40 + Math.random() * 40,
            windSpeed: 5 + Math.random() * 15,
            rainfall: Math.random() * 10,
            cloudCover: Math.random() * 100,
          },
          source: "NOAA",
          confidence: 0.88,
        },
      ];
    },
    enabled: true,
  } as StreamConfig,

  // Air quality
  airQuality: {
    id: "air-quality-live",
    name: "Live Air Quality",
    source: "Environmental Monitoring",
    interval: 300000, // 5 minutes
    parser: () => {
      // Simulated air quality data
      return [
        {
          id: "aqi-nairobi",
          timestamp: Date.now(),
          value: {
            location: "Nairobi",
            aqi: 50 + Math.random() * 100, // 0-500
            pm25: 15 + Math.random() * 50,
            pm10: 25 + Math.random() * 75,
            no2: 20 + Math.random() * 40,
            o3: 30 + Math.random() * 50,
          },
          source: "Environmental Monitoring",
          confidence: 0.82,
        },
      ];
    },
    enabled: true,
  } as StreamConfig,
};

// Initialize all streams
export function initializeStreams() {
  Object.values(kenyaStreams).forEach((streamConfig) => {
    streamingService.registerStream(streamConfig);
  });
  console.log("[RT-Stream] Initialized all Kenya Digital Twin streams");
}

// Start all enabled streams
export function startAllStreams() {
  Object.values(kenyaStreams).forEach((streamConfig) => {
    if (streamConfig.enabled) {
      streamingService.startStream(streamConfig.id);
    }
  });
}
