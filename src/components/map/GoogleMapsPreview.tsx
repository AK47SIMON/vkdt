import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Maximize2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Location {
  name: string;
  lat: number;
  lng: number;
  description?: string;
}

interface GoogleMapsPreviewProps {
  location: Location | null;
  onClose: () => void;
}

const GoogleMapsPreview = ({ location, onClose }: GoogleMapsPreviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!location) return null;

  const embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${location.lng}!3d${location.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2ske!4v1234567890`;
  
  const googleMapsUrl = `https://www.google.com/maps/@${location.lat},${location.lng},17z`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`absolute z-[1002] glass-panel overflow-hidden ${
          isExpanded 
            ? "inset-4" 
            : "bottom-4 left-4 w-80"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <div>
              <h4 className="text-sm font-medium text-foreground">{location.name}</h4>
              {location.description && (
                <p className="text-xs text-muted-foreground">{location.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
            <a 
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 hover:bg-muted rounded"
            >
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </a>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Map Iframe */}
        <div className={isExpanded ? "h-[calc(100%-48px)]" : "h-48"}>
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Google Maps - ${location.name}`}
          />
        </div>

        {/* Coordinates */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-background/80 text-[10px] text-muted-foreground">
          {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GoogleMapsPreview;
