import { Button } from "@/components/ui/button";
import { Layers, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onLayerToggle?: () => void;
}

const MapControls = ({ onZoomIn, onZoomOut, onReset, onLayerToggle }: MapControlsProps) => {
  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
      {onLayerToggle && (
        <Button variant="metric" size="sm" className="gap-2" onClick={onLayerToggle}>
          <Layers className="w-4 h-4" />
          Layers
        </Button>
      )}
      <div className="flex flex-col gap-1">
        <Button variant="metric" size="icon" onClick={onZoomIn} className="h-8 w-8">
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button variant="metric" size="icon" onClick={onZoomOut} className="h-8 w-8">
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button variant="metric" size="icon" onClick={onReset} className="h-8 w-8">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default MapControls;
