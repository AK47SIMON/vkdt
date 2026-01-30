import { useEffect, useRef } from "react";

interface ParticleSystemProps {
  type: "rainfall" | "wind" | "flood" | "pollution" | "heat" | "vegetation" | "electricity" | "hazard";
  intensity: number;
  isRunning: boolean;
}

const ParticleSystem = ({ type, intensity, isRunning }: ParticleSystemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    type: string;
  }

  const createParticles = (count: number): Particle[] => {
    const particles: Particle[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return particles;

    for (let i = 0; i < count; i++) {
      let particle: Particle;

      switch (type) {
        case "rainfall":
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: 3 + Math.random() * 2,
            life: 1,
            maxLife: 1,
            size: Math.random() * 2 + 1,
            color: `rgba(100, 150, 255, ${0.6 * intensity / 100})`,
            type: "rainfall",
          };
          break;

        case "wind":
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 4 + Math.random() * 2,
            vy: (Math.random() - 0.5) * 1,
            life: 1,
            maxLife: 1,
            size: Math.random() * 3 + 1,
            color: `rgba(100, 200, 255, ${0.4 * intensity / 100})`,
            type: "wind",
          };
          break;

        case "flood":
          particle = {
            x: Math.random() * canvas.width,
            y: canvas.height * 0.7 + Math.random() * canvas.height * 0.3,
            vx: 2 + Math.random() * 2,
            vy: -1 + Math.random() * 0.5,
            life: 1,
            maxLife: 1,
            size: Math.random() * 4 + 2,
            color: `rgba(50, 100, 200, ${0.7 * intensity / 100})`,
            type: "flood",
          };
          break;

        case "pollution":
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            life: 1,
            maxLife: 1,
            size: Math.random() * 5 + 2,
            color: `rgba(150, 150, 150, ${0.5 * intensity / 100})`,
            type: "pollution",
          };
          break;

        case "heat":
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: -2 + Math.random() * 1,
            life: 1,
            maxLife: 1,
            size: Math.random() * 6 + 2,
            color: `rgba(255, 100, 0, ${0.6 * intensity / 100})`,
            type: "heat",
          };
          break;

        case "vegetation":
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: 1,
            maxLife: 1,
            size: Math.random() * 3 + 1,
            color: `rgba(50, 200, 50, ${0.5 * intensity / 100})`,
            type: "vegetation",
          };
          break;

        case "electricity":
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 1,
            maxLife: 1,
            size: Math.random() * 2 + 1,
            color: `rgba(255, 255, 0, ${0.8 * intensity / 100})`,
            type: "electricity",
          };
          break;

        case "hazard":
          particle = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            life: 1,
            maxLife: 1,
            size: Math.random() * 5 + 2,
            color: `rgba(255, 100, 0, ${0.7 * intensity / 100})`,
            type: "hazard",
          };
          break;

        default:
          particle = {
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            life: 1,
            maxLife: 1,
            size: 1,
            color: "rgba(255, 255, 255, 0.5)",
            type: "default",
          };
      }

      particles.push(particle);
    }

    return particles;
  };

  const updateParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

    particlesRef.current.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.01;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    });

    // Add new particles based on intensity
    const newParticleCount = Math.floor((intensity / 100) * 5);
    if (particlesRef.current.length < 200) {
      particlesRef.current.push(...createParticles(newParticleCount));
    }
  };

  const drawParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas with fade effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particlesRef.current.forEach((particle) => {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const animate = () => {
    if (isRunning) {
      updateParticles();
      drawParticles();
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initialize particles
    particlesRef.current = createParticles(Math.floor((intensity / 100) * 50));

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

export default ParticleSystem;
