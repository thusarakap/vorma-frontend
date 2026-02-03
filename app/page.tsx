"use client";

import { useState } from "react";
import VideoUploadCard from "./components/VideoUploadCard";
import AnalysisResultCard from "./components/AnalysisResultCard";

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

export default function Home() {
  const [analysisState, setAnalysisState] = useState<AnalysisState>("idle");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | undefined>(undefined);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleVideoUpload = async (file: File) => {
    console.log("Uploading file:", file.name);
    
    try {
      // Step 1: Upload video and extract features
      setAnalysisState("uploading");
      setLoadingMessage("Uploading video...");
      
      const formData = new FormData();
      formData.append("file", file);

      // Start the fetch request immediately
      const extractPromise = fetch(
        "https://vorma-backend-extractor.onrender.com/api/analyze",
        // "http://127.0.0.1:8000/api/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      // Wait for 5 seconds purely for UX/Animation
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Update state to extracting (50%)
      setAnalysisState("extracting");
      setLoadingMessage("Analyzing gait patterns...");

      // Now await the actual response
      const extractResponse = await extractPromise;

      if (!extractResponse.ok) {
        throw new Error(`Feature extraction failed: ${extractResponse.statusText}`);
      }

      const extractData = await extractResponse.json();
      console.log("Extraction result:", extractData);

      // Step 2: Send gait features to prediction API
      setAnalysisState("predicting");
      setLoadingMessage("Generating orthotic prescription...");

      const predictResponse = await fetch(
        "https://vorma-backend-predictor.onrender.com/api/predict",
        // "http://127.0.0.1:8001/api/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(extractData.gait_features),
        }
      );

      if (!predictResponse.ok) {
        throw new Error(`Prediction failed: ${predictResponse.statusText}`);
      }

      const predictData = await predictResponse.json();
      console.log("Prediction result:", predictData);

      // Combine results
      const result: AnalysisResult = {
        gaitFeatures: extractData.gait_features,
        predictedLoads: predictData.predicted_loads,
        orthoticPrescription: predictData.orthotic_prescription,
        videoFilename: extractData.video_filename,
        numFrames: extractData.num_frames,
      };

      setAnalysisResult(result);
      setAnalysisState("completed");
      setLoadingMessage("");
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisState("error");
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    }
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden grid-background">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-500/20 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-cyan-500/10 p-2">
              <svg
                className="h-8 w-8 text-cyan-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                VORMA
              </h1>
              <p className="text-sm text-muted-foreground font-mono">
                Video-based Orthotic Recommendation through ML & Gait Analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-88px)] px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Left Section - Video Upload */}
            <div className="w-full">
              <VideoUploadCard
                onUpload={handleVideoUpload}
                isDisabled={analysisState !== "idle" && analysisState !== "error"}
              />
            </div>

            {/* Right Section - Analysis Output */}
            <div className="w-full">
              <AnalysisResultCard
                state={analysisState}
                result={analysisResult}
                loadingMessage={loadingMessage}
                errorMessage={errorMessage}
              />
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Powered by machine learning for biomechanical analysis
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
