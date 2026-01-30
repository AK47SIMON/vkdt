import { useEffect, useRef } from "react";

interface FluidDynamicsSimulationProps {
  type: "water_flow" | "air_circulation" | "smoke_dispersion" | "ocean_waves";
  intensity: number;
  isRunning: boolean;
}

const FluidDynamicsSimulation = ({
  type,
  intensity,
  isRunning,
}: FluidDynamicsSimulationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const velocityFieldRef = useRef<{ x: number; y: number }[][]>([]);
  const pressureFieldRef = useRef<number[][]>([]);
  const animationRef = useRef<number>();

  const initializeFields = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gridWidth = Math.floor(canvas.width / 20);
    const gridHeight = Math.floor(canvas.height / 20);

    // Initialize velocity field
    const velocityField: { x: number; y: number }[][] = [];
    for (let y = 0; y < gridHeight; y++) {
      velocityField[y] = [];
      for (let x = 0; x < gridWidth; x++) {
        velocityField[y][x] = { x: 0, y: 0 };
      }
    }

    // Initialize pressure field
    const pressureField: number[][] = [];
    for (let y = 0; y < gridHeight; y++) {
      pressureField[y] = [];
      for (let x = 0; x < gridWidth; x++) {
        pressureField[y][x] = 0;
      }
    }

    velocityFieldRef.current = velocityField;
    pressureFieldRef.current = pressureField;
  };

  const updateFluidDynamics = () => {
    const velocityField = velocityFieldRef.current;
    const pressureField = pressureFieldRef.current;

    if (velocityField.length === 0 || pressureField.length === 0) return;

    const height = velocityField.length;
    const width = velocityField[0].length;

    // Apply forces based on simulation type
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        switch (type) {
          case "water_flow":
            // Gravity and flow
            velocityField[y][x].y += (intensity / 100) * 0.2; // Gravity
            velocityField[y][x].x += (Math.random() - 0.5) * 0.1; // Turbulence
            break;

          case "air_circulation":
            // Circular wind patterns
            const angle = Math.atan2(y - height / 2, x - width / 2);
            velocityField[y][x].x = Math.cos(angle) * (intensity / 100) * 2;
            velocityField[y][x].y = Math.sin(angle) * (intensity / 100) * 2;
            break;

          case "smoke_dispersion":
            // Buoyant smoke
            velocityField[y][x].y -= (intensity / 100) * 0.15; // Buoyancy
            velocityField[y][x].x += (Math.random() - 0.5) * 0.2; // Diffusion
            break;

          case "ocean_waves":
            // Wave propagation
            const waveHeight = Math.sin(x * 0.1 + Date.now() * 0.001) * (intensity / 100);
            velocityField[y][x].y = waveHeight * 0.5;
            velocityField[y][x].x = Math.cos(x * 0.1 + Date.now() * 0.001) * (intensity / 100);
            break;
        }

        // Damping
        velocityField[y][x].x *= 0.99;
        velocityField[y][x].y *= 0.99;

        // Limit velocity
        const speed = Math.sqrt(
          velocityField[y][x].x ** 2 + velocityField[y][x].y ** 2
        );
        if (speed > 5) {
          velocityField[y][x].x = (velocityField[y][x].x / speed) * 5;
          velocityField[y][x].y = (velocityField[y][x].y / speed) * 5;
        }
      }
    }

    // Simple pressure calculation
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const divergence =
          (velocityField[y][x + 1].x - velocityField[y][x - 1].x) / 2 +
          (velocityField[y + 1][x].y - velocityField[y - 1][x].y) / 2;

        pressureField[y][x] += divergence * 0.1;
        pressureField[y][x] *= 0.95; // Decay
      }
    }
  };

  const drawFluidField = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const velocityField = velocityFieldRef.current;
    const pressureField = pressureFieldRef.current;

    if (velocityField.length === 0) return;

    const cellWidth = canvas.width / velocityField[0].length;
    const cellHeight = canvas.height / velocityField.length;

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw velocity field
    for (let y = 0; y < velocityField.length; y++) {
      for (let x = 0; x < velocityField[y].length; x++) {
        const vel = velocityField[y][x];
        const pressure = pressureField[y][x];

        // Color based on velocity magnitude
        const speed = Math.sqrt(vel.x ** 2 + vel.y ** 2);
        const normalized = Math.min(speed / 5, 1);

        let color: string;
        switch (type) {
          case "water_flow":
            color = `rgba(100, 150, 255, ${0.3 + normalized * 0.5})`;
            break;
          case "air_circulation":
            color = `rgba(150, 200, 255, ${0.3 + normalized * 0.5})`;
            break;
          case "smoke_dispersion":
            color = `rgba(150, 150, 150, ${0.3 + normalized * 0.5})`;
            break;
          case "ocean_waves":
            color = `rgba(50, 150, 200, ${0.3 + normalized * 0.5})`;
            break;
          default:
            color = `rgba(255, 255, 255, 0.3)`;
        }

        ctx.fillStyle = color;
        ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);

        // Draw velocity vectors
        if (x % 2 === 0 && y % 2 === 0) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * normalized})`;
          ctx.beginPath();
          ctx.moveTo(x * cellWidth + cellWidth / 2, y * cellHeight + cellHeight / 2);
          ctx.lineTo(
            x * cellWidth + cellWidth / 2 + vel.x * 5,
            y * cellHeight + cellHeight / 2 + vel.y * 5
          );
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    if (isRunning) {
      updateFluidDynamics();
      drawFluidField();
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    initializeFields();
    drawFluidField();

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

export default FluidDynamicsSimulation;
