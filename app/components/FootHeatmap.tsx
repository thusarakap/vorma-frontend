"use client";

import { useEffect, useRef } from "react";

interface PredictedLoads {
  forefoot: number;
  midfoot: number;
  rearfoot: number;
}

interface FootHeatmapProps {
  loads: PredictedLoads;
}

export default function FootHeatmap({ loads }: FootHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Convert load percentage to color (0-1 range)
  const getHeatColor = (value: number, alpha = 1): string => {
    const hue = (1 - value) * 240; // blue → red
    return `hsla(${hue}, 100%, 50%, ${alpha})`;
  };


    useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    /* -------------------------------
      Foot outline path (REUSABLE)
    -------------------------------- */
    const footPath = new Path2D();

    // Heel
    footPath.moveTo(width * 0.3, height * 0.95);
    footPath.quadraticCurveTo(width * 0.5, height, width * 0.7, height * 0.95);

    // Right side
    footPath.lineTo(width * 0.75, height * 0.75);
    footPath.quadraticCurveTo(width * 0.8, height * 0.5, width * 0.8, height * 0.3);

    // Toes
    footPath.quadraticCurveTo(width * 0.8, height * 0.15, width * 0.7, height * 0.05);
    footPath.quadraticCurveTo(width * 0.5, 0, width * 0.3, height * 0.05);
    footPath.quadraticCurveTo(width * 0.2, height * 0.15, width * 0.2, height * 0.3);

    // Left side
    footPath.quadraticCurveTo(width * 0.2, height * 0.5, width * 0.25, height * 0.75);
    footPath.closePath();

    // Draw foot outline
    ctx.fillStyle = "#1a1f2e";
    ctx.strokeStyle = "#22d3ee";
    ctx.lineWidth = 2;
    ctx.fill(footPath);
    ctx.stroke(footPath);

    /* -------------------------------
      Helper: draw pressure zone
    -------------------------------- */
    const drawZone = (draw: () => void, load: number, textY: number) => {
      const gradient = ctx.createRadialGradient(
        width * 0.5,
        textY,
        width * 0.05,
        width * 0.5,
        textY,
        width * 0.35
      );

      gradient.addColorStop(0, getHeatColor(load, 0.9));
      gradient.addColorStop(1, getHeatColor(load, 0.3));

      ctx.save();
      ctx.clip(footPath);   // 🔑 correct clipping
      ctx.fillStyle = gradient;
      draw();
      ctx.restore();

      // percentage text
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${(load * 100).toFixed(1)}%`, width * 0.5, textY);
    };

     // Forefoot
    drawZone(
      () => {
        ctx.beginPath();
        ctx.ellipse(
          width * 0.5,
          height * 0.15,
          width * 0.25,
          height * 0.12,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      },
      loads.forefoot,
      height * 0.15
    );

    
     // Midfoot
    drawZone(
      () => {
        ctx.beginPath();
        ctx.roundRect(
          width * 0.28,
          height * 0.38,
          width * 0.44,
          height * 0.26,
          40
        );
        ctx.fill();
      },
      loads.midfoot,
      height * 0.50
    );

     // Rearfoot
    drawZone(
      () => {
        ctx.beginPath();
        ctx.ellipse(
          width * 0.5,
          height * 0.85,
          width * 0.2,
          height * 0.12,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      },
      loads.rearfoot,
      height * 0.85
    );


    //  Labels
    ctx.fillStyle = "#22d3ee";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText("Forefoot", width * 0.85, height * 0.15);
    ctx.fillText("Midfoot", width * 0.85, height * 0.5);
    ctx.fillText("Rearfoot", width * 0.85, height * 0.85);

  }, [loads]);

  return (
    <div className="relative w-full aspect-[2/3] max-w-sm mx-auto">
      <canvas
        ref={canvasRef}
        width={300}
        height={450}
        className="w-full h-full"
      />
      
      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <div className="text-xs text-muted-foreground font-mono">
          <span className="font-semibold">Pressure:</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatColor(0) }} />
          <span className="text-xs text-muted-foreground">Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatColor(0.5) }} />
          <span className="text-xs text-muted-foreground">Med</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getHeatColor(1) }} />
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </div>
    </div>
  );
}
