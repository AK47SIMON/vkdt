import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Building2, Mountain, Droplets, TreePine, Plane, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { kenyaLocations } from "./CesiumViewer";

interface SearchPanelProps {
  onSearch: (query: string) => void;
  onLocationSelect: (location: typeof kenyaLocations[0]) => void;
}

const typeIcons: Record<string, React.ElementType> = {
  capital: Building2,
  city: MapPin,
  port: Building2,
  landmark: Mountain,
  water: Droplets,
  park: TreePine,
  infrastructure: Plane,
  county: MapPin,
};

const SearchPanel = ({ onSearch, onLocationSelect }: SearchPanelProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredLocations = useMemo(() => {
    if (!query.trim()) return [];
    const searchTerm = query.toLowerCase();
    return kenyaLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(searchTerm) ||
        loc.type.toLowerCase().includes(searchTerm)
    ).slice(0, 8);
  }, [query]);

  const handleSelect = (location: typeof kenyaLocations[0]) => {
    setQuery(location.name);
    onLocationSelect(location);
    onSearch(location.name);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Search Kenya cities, landmarks, parks..."
          className="pl-9 pr-9 bg-card/80 backdrop-blur-sm border-border/50"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isFocused && filteredLocations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass-panel p-2 max-h-[300px] overflow-y-auto z-50"
          >
            {filteredLocations.map((location) => {
              const Icon = typeIcons[location.type] || MapPin;
              return (
                <button
                  key={location.name}
                  onClick={() => handleSelect(location)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors text-left"
                >
                  <Icon className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {location.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {location.type}
                      {location.population && ` • ${location.population}`}
                      {location.area && ` • ${location.area}`}
                    </p>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick access buttons */}
      <div className="flex flex-wrap gap-1 mt-2">
        {["Nairobi", "Mombasa", "Mount Kenya", "Maasai Mara"].map((name) => (
          <button
            key={name}
            onClick={() => {
              const loc = kenyaLocations.find((l) => l.name === name);
              if (loc) handleSelect(loc);
            }}
            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchPanel;
