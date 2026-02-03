"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Loader2, ClipboardList, AlertCircle } from "lucide-react";
import FootHeatmap from "./FootHeatmap";

type AnalysisState = "idle" | "uploading" | "extracting" | "predicting" | "completed" | "error";

interface GaitFeatures {
  mean_ankle_angle: number;
  ankle_angle_range: number;
  ankle_angle_std: number;
  mean_knee_angle: number;
  knee_angle_range: number;
  knee_angle_std: number;
  mean_step_height: number;
  cadence: number;
  stance_ratio: number;
}

interface PredictedLoads {
  forefoot: number;
  midfoot: number;
  rearfoot: number;
}

interface OrthoticPrescription {
  rearfoot_medial_post_mm: number;
  rearfoot_lateral_post_mm: number;
  forefoot_lateral_wedge_mm: number;
  forefoot_medial_wedge_mm: number;
  arch_support_mm: number;
  heel_cushion_mm: number;
}

interface AnalysisResult {
  gaitFeatures: GaitFeatures;
  predictedLoads: PredictedLoads;
  orthoticPrescription: OrthoticPrescription;
  videoFilename: string;
  numFrames: number;
}

interface AnalysisResultCardProps {
  state: AnalysisState;
  result?: AnalysisResult;
  loadingMessage?: string;
  errorMessage?: string;
}

export default function AnalysisResultCard({
  state,
  result,
  loadingMessage = "",
  errorMessage = "",
}: AnalysisResultCardProps) {
  return (
    <Card className="border-cyan-500/20 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-cyan-500/10 p-2">
            <Activity className="h-6 w-6 text-cyan-500" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Analysis Result
            </CardTitle>
            <CardDescription className="mt-1">
              {state === "idle" && "Awaiting video upload"}
              {state === "uploading" && "Uploading video..."}
              {state === "extracting" && "Extracting gait features..."}
              {state === "predicting" && "Generating prescription..."}
              {state === "completed" && "Analysis complete"}
              {state === "error" && "Analysis failed"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {state === "idle" && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-cyan-500/5 p-6 mb-4">
              <ClipboardList className="h-12 w-12 text-cyan-500/50" />
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              Upload a gait analysis video to receive AI-powered orthotic recommendations
              based on biomechanical patterns.
            </p>
          </div>
        )}

        {(state === "uploading" || state === "extracting" || state === "predicting") && (
          <div className="flex flex-col items-center justify-center py-16 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse-glow" />
              <Loader2 className="h-16 w-16 animate-spin text-cyan-500 relative" />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-lg font-semibold text-foreground">
                {loadingMessage || "Processing..."}
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                {state === "uploading" && "Transferring video to server"}
                {state === "extracting" && "Analyzing biomechanical data"}
                {state === "predicting" && "Computing orthotic specifications"}
              </p>
            </div>
            <div className="w-full max-w-xs">
              <div className="h-2 rounded-full bg-cyan-500/10 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{
                    width:
                      state === "uploading"
                        ? "25%"
                        : state === "extracting"
                        ? "50%"
                        : state === "predicting"
                        ? "75%"
                        : "100%",
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="rounded-full bg-red-500/10 p-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <div className="space-y-2 text-center max-w-md">
              <p className="text-lg font-semibold text-foreground">Analysis Failed</p>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
              <p className="text-xs text-muted-foreground mt-4">
                Please try uploading your video again.
              </p>
            </div>
          </div>
        )}

        {state === "completed" && result && (
          <div className="space-y-6 animate-in fade-in-50 duration-500">
            {/* Pressure Distribution Heatmap */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-500">
                  Pressure Distribution
                </h3>
                <Badge variant="outline" className="font-mono text-xs border-cyan-500/30">
                  {result.numFrames} frames analyzed
                </Badge>
              </div>
              <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-6">
                <FootHeatmap loads={result.predictedLoads} />
              </div>
            </div>

            {/* Orthotic Prescription Table */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-cyan-500" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-500">
                  Orthotic Prescription
                </h3>
              </div>

              <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-transparent overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-cyan-500/10 border-b border-cyan-500/30">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-foreground">
                          Component
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-foreground">
                          Height (mm)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-500/20">
                      <tr className="hover:bg-cyan-500/5 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">
                          Rearfoot Medial Post
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-foreground font-semibold">
                          {result.orthoticPrescription.rearfoot_medial_post_mm.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="hover:bg-cyan-500/5 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">
                          Rearfoot Lateral Post
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-foreground font-semibold">
                          {result.orthoticPrescription.rearfoot_lateral_post_mm.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="hover:bg-cyan-500/5 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">
                          Forefoot Lateral Wedge
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-foreground font-semibold">
                          {result.orthoticPrescription.forefoot_lateral_wedge_mm.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="hover:bg-cyan-500/5 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">
                          Forefoot Medial Wedge
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-foreground font-semibold">
                          {result.orthoticPrescription.forefoot_medial_wedge_mm.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="hover:bg-cyan-500/5 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">Arch Support</td>
                        <td className="px-4 py-3 text-right font-mono text-foreground font-semibold">
                          {result.orthoticPrescription.arch_support_mm.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="hover:bg-cyan-500/5 transition-colors">
                        <td className="px-4 py-3 text-muted-foreground">Heel Cushion</td>
                        <td className="px-4 py-3 text-right font-mono text-foreground font-semibold">
                          {result.orthoticPrescription.heel_cushion_mm.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="px-4 py-3 bg-cyan-500/5 border-t border-cyan-500/20">
                  <p className="text-xs text-muted-foreground italic">
                    ⚠️ Note: This AI-generated prescription should be reviewed by a qualified
                    healthcare professional before manufacturing orthotics.
                  </p>
                </div>
              </div>
            </div>

            {/* Gait Features Summary */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-500">
                Key Gait Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Cadence</p>
                  <p className="text-lg font-semibold text-foreground font-mono">
                    {result.gaitFeatures.cadence.toFixed(1)} <span className="text-sm">steps/min</span>
                  </p>
                </div>
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Stance Ratio</p>
                  <p className="text-lg font-semibold text-foreground font-mono">
                    {(result.gaitFeatures.stance_ratio * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Mean Step Height</p>
                  <p className="text-lg font-semibold text-foreground font-mono">
                    {result.gaitFeatures.mean_step_height.toFixed(3)} <span className="text-sm">m</span>
                  </p>
                </div>
                <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Ankle Angle Range</p>
                  <p className="text-lg font-semibold text-foreground font-mono">
                    {result.gaitFeatures.ankle_angle_range.toFixed(1)}°
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
