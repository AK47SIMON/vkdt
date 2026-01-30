import { motion } from "framer-motion";
import { Camera, Users, Car, MapPin, Eye, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CCTVDetection {
  cameraId: string;
  cameraName: string;
  lat: number;
  lng: number;
  detections: {
    type: "person" | "vehicle";
    count: number;
    confidence: number;
  }[];
  timestamp: Date;
}

interface Props {
  detections: CCTVDetection[];
  onClose: () => void;
  isVisible: boolean;
}

const CCTVMapOverlay = ({ detections, onClose, isVisible }: Props) => {
  const [selectedCamera, setSelectedCamera] = useState<CCTVDetection | null>(null);

  if (!isVisible) return null;

  // Convert lat/lng to percentage position on a simplified Kenya map
  const getPosition = (lat: number, lng: number) => {
    // Kenya bounds approximately: lat -4.7 to 4.6, lng 33.9 to 41.9
    const minLat = -4.7, maxLat = 4.6;
    const minLng = 33.9, maxLng = 41.9;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const getTotalCount = (detection: CCTVDetection, type: "person" | "vehicle") => {
    return detection.detections.find((d) => d.type === type)?.count || 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
    >
      <div className="container mx-auto max-w-6xl h-full py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10 border border-accent/30">
              <Eye className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="font-display font-bold text-foreground text-xl">
                CCTV Detection Map
              </h2>
              <p className="text-sm text-muted-foreground">
                Real-time YOLO detections displayed on map
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100%-80px)]">
          {/* Map View */}
          <div className="lg:col-span-2 glass-panel p-4 relative overflow-hidden">
            {/* Simplified Kenya Map Background */}
            <div
              className="absolute inset-4 rounded-xl"
              style={{
                background: `
                  radial-gradient(ellipse 80% 60% at 50% 50%, 
                    hsl(145, 40%, 20%) 0%,
                    hsl(145, 30%, 15%) 50%,
                    hsl(220, 20%, 10%) 100%
                  )
                `,
                border: "1px solid hsl(145, 40%, 30%)",
              }}
            >
              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `
                    linear-gradient(hsl(145, 60%, 50%) 1px, transparent 1px),
                    linear-gradient(90deg, hsl(145, 60%, 50%) 1px, transparent 1px)
                  `,
                  backgroundSize: "10% 10%",
                }}
              />

              {/* Detection markers */}
              {detections.map((detection) => {
                const pos = getPosition(detection.lat, detection.lng);
                const totalPeople = getTotalCount(detection, "person");
                const totalVehicles = getTotalCount(detection, "vehicle");
                const isSelected = selectedCamera?.cameraId === detection.cameraId;

                return (
                  <motion.div
                    key={detection.cameraId}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setSelectedCamera(detection)}
                  >
                    {/* Pulse ring */}
                    <div
                      className={`absolute inset-0 rounded-full animate-ping ${
                        isSelected ? "bg-accent/40" : "bg-primary/30"
                      }`}
                      style={{ width: "40px", height: "40px", margin: "-8px" }}
                    />

                    {/* Main marker */}
                    <div
                      className={`relative w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected
                          ? "bg-accent shadow-lg shadow-accent/50"
                          : "bg-primary shadow-lg shadow-primary/50"
                      }`}
                    >
                      <Camera className="w-3 h-3 text-white" />
                    </div>

                    {/* Detection counts */}
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
                      {totalPeople > 0 && (
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-secondary/80 text-white text-xs">
                          <Users className="w-2.5 h-2.5" />
                          {totalPeople}
                        </div>
                      )}
                      {totalVehicles > 0 && (
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-kenya-gold/80 text-white text-xs">
                          <Car className="w-2.5 h-2.5" />
                          {totalVehicles}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Map labels */}
              <div className="absolute top-4 left-4 text-xs text-muted-foreground">
                Kenya Map View
              </div>
              <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
                {detections.length} active cameras
              </div>
            </div>
          </div>

          {/* Detection Details */}
          <div className="glass-panel p-4 overflow-y-auto">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Detection Details
            </h3>

            {selectedCamera ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="p-3 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-foreground">{selectedCamera.cameraName}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Lat: {selectedCamera.lat.toFixed(4)}, Lng: {selectedCamera.lng.toFixed(4)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Detections
                  </p>
                  {selectedCamera.detections.map((det) => (
                    <div
                      key={det.type}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-2">
                        {det.type === "person" ? (
                          <Users className="w-4 h-4 text-secondary" />
                        ) : (
                          <Car className="w-4 h-4 text-kenya-gold" />
                        )}
                        <span className="text-sm text-foreground capitalize">{det.type}s</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{det.count}</p>
                        <p className="text-xs text-muted-foreground">
                          {(det.confidence * 100).toFixed(0)}% conf
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    Last updated: {selectedCamera.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <Camera className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Click a camera marker to view detection details
                </p>
              </div>
            )}

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                Legend
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">Active Camera</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-xs text-muted-foreground">Selected Camera</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3 text-secondary" />
                  <span className="text-xs text-muted-foreground">Person Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-3 h-3 text-kenya-gold" />
                  <span className="text-xs text-muted-foreground">Vehicle Detection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CCTVMapOverlay;
