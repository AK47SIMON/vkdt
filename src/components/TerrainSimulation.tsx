import { useEffect, useRef } from "react";

interface TerrainSimulationProps {
  type: "erosion" | "subsidence" | "uplift" | "liquefaction";
  intensity: number;
  isRunning: boolean;
}

const TerrainSimulation = ({ type, intensity, isRunning }: TerrainSimulationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heightmapRef = useRef<number[][]>([]);
  const animationRef = useRef<number>();

  const initializeHeightmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = Math.floor(canvas.width / 10);
    const height = Math.floor(canvas.height / 10);
    const heightmap: number[][] = [];

    for (let y = 0; y < height; y++) {
      heightmap[y] = [];
      for (let x = 0; x < width; x++) {
        // Generate initial terrain with Perlin-like noise
        const noise =
          Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.5 +
          Math.sin(x * 0.05) * Math.cos(y * 0.05) * 0.3;
        heightmap[y][x] = 50 + noise * 30;
      }
    }

    heightmapRef.current = heightmap;
  };

  const updateTerrain = () => {
    const heightmap = heightmapRef.current;
    if (heightmap.length === 0) return;

    const height = heightmap.length;
    const width = heightmap[0].length;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let newHeight = heightmap[y][x];

        switch (type) {
          case "erosion":
            // Simulate water erosion
            const neighbors = [
              heightmap[y - 1][x],
              heightmap[y + 1][x],
              heightmap[y][x - 1],
              heightmap[y][x + 1],
            ];
            const avgNeighbor = neighbors.reduce((a, b) => a + b) / neighbors.length;
            newHeight += (avgNeighbor - newHeight) * (intensity / 100) * 0.01;
            break;

          case "subsidence":
            // Simulate ground subsidence
            newHeight -= (intensity / 100) * 0.1;
            break;

          case "uplift":
            // Simulate tectonic uplift
            newHeight += (intensity / 100) * 0.1;
            break;

          case "liquefaction":
            // Simulate earthquake liquefaction
            newHeight += (Math.random() - 0.5) * (intensity / 100) * 2;
            break;
        }

        // Keep height within bounds
        newHeight = Math.max(10, Math.min(100, newHeight));
        heightmap[y][x] = newHeight;
      }
    }
  };

  const drawTerrain = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const heightmap = heightmapRef.current;
    if (heightmap.length === 0) return;

    const cellWidth = canvas.width / heightmap[0].length;
    const cellHeight = canvas.height / heightmap.length;

    for (let y = 0; y < heightmap.length; y++) {
      for (let x = 0; x < heightmap[y].length; x++) {
        const height = heightmap[y][x];
        const normalized = (height - 10) / 90; // Normalize to 0-1

        // Color based on height
        let color: string;
        if (normalized < 0.3) {
          // Low areas - water
          color = `rgb(50, 100, ${Math.floor(150 + normalized * 100)})`;
        } else if (normalized < 0.6) {
          // Mid areas - grass
          color = `rgb(${Math.floor(100 + normalized * 100)}, ${Math.floor(150 + normalized * 50)}, 50)`;
        } else {
          // High areas - rock
          color = `rgb(${Math.floor(150 + normalized * 100)}, ${Math.floor(150 + normalized * 50)}, ${Math.floor(100 + normalized * 50)})`;
        }

        ctx.fillStyle = color;
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
      }
    }
  };

  const animate = () => {
    if (isRunning) {
      updateTerrain();
      drawTerrain();
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    initializeHeightmap();
    drawTerrain();

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, intensity, isRunning]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg bg-gradient-to-b from-slate-900 to-slate-800"
      style={{ display: "block" }}
    />
  );
};

export default TerrainSimulation;
