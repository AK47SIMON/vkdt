import { motion } from "framer-motion";
import { Building2, MapPin, Layers, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuildingInfo {
  id: string;
  name: string;
  type: string;
  address?: string;
  floors?: number;
  yearBuilt?: string;
  area?: string;
  lat: number;
  lng: number;
  features?: string[];
}

interface BuildingInfoCardProps {
  building: BuildingInfo | null;
  onClose: () => void;
  onViewIn3D?: () => void;
  onViewInGoogleMaps?: () => void;
}

const BuildingInfoCard = ({ building, onClose, onViewIn3D, onViewInGoogleMaps }: BuildingInfoCardProps) => {
  if (!building) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 left-4 z-[1001] w-72 glass-panel p-4"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h4 className="font-medium text-foreground text-sm">{building.name}</h4>
            <p className="text-xs text-muted-foreground capitalize">{building.type}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2 text-xs mb-4">
        {building.address && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">{building.address}</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2 pt-2">
          {building.floors && (
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-[10px] text-muted-foreground">Floors</p>
              <p className="font-medium text-foreground">{building.floors}</p>
            </div>
          )}
          {building.yearBuilt && (
            <div className="p-2 rounded-lg bg-muted/50">
              <p className="text-[10px] text-muted-foreground">Year Built</p>
              <p className="font-medium text-foreground">{building.yearBuilt}</p>
            </div>
          )}
          {building.area && (
            <div className="p-2 rounded-lg bg-muted/50 col-span-2">
              <p className="text-[10px] text-muted-foreground">Area</p>
              <p className="font-medium text-foreground">{building.area}</p>
            </div>
          )}
        </div>

        {building.features && building.features.length > 0 && (
          <div className="pt-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Features</p>
            <div className="flex flex-wrap gap-1">
              {building.features.map((feature, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {onViewIn3D && (
          <Button 
            variant="metric" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={onViewIn3D}
          >
            <Layers className="w-3 h-3 mr-1" />
            View 3D
          </Button>
        )}
        {onViewInGoogleMaps && (
          <Button 
            variant="metric" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={onViewInGoogleMaps}
          >
            <MapPin className="w-3 h-3 mr-1" />
            Street View
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default BuildingInfoCard;
