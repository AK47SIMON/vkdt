import { Info } from "lucide-react";

interface LegendItem {
  color: string;
  label: string;
  shape?: "circle" | "square";
}

interface MapLegendProps {
  items: LegendItem[];
  title?: string;
}

const MapLegend = ({ items, title = "Legend" }: MapLegendProps) => {
  return (
    <div className="absolute bottom-4 right-4 z-[1000] glass-panel p-4">
      <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
        <Info className="w-4 h-4" />
        {title}
      </h4>
      <div className="space-y-2 text-xs">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className={`w-3 h-3 ${item.shape === "square" ? "rounded" : "rounded-full"}`}
              style={{ backgroundColor: item.color }}
            />
            <span className="text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapLegend;
