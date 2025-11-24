"use client";

import { useState, FormEvent } from "react";

interface AnalysisResult {
  height_map?: number[];
  foot_pressure?: {
    heel: number;
    midfoot: number;
    forefoot: number;
  };
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError("");
      setResult(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a video file");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze video");
    } finally {
      setLoading(false);
    }
  };

  const getHeatColor = (value: number): string => {
    // Normalize value between 0 and 1 for color mapping
    const normalized = Math.min(Math.max(value, 0), 1);
    
    if (normalized < 0.33) {
      // Blue to Cyan (low pressure)
      const intensity = Math.round(normalized * 3 * 255);
      return `rgb(0, ${intensity}, 255)`;
    } else if (normalized < 0.66) {
      // Cyan to Yellow (medium pressure)
      const intensity = Math.round((normalized - 0.33) * 3 * 255);
      return `rgb(${intensity}, 255, ${255 - intensity})`;
    } else {
      // Yellow to Red (high pressure)
      const intensity = Math.round((normalized - 0.66) * 3 * 255);
      return `rgb(255, ${255 - intensity}, 0)`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Gait Analysis
          </h1>
          <p className="text-gray-600">
            Upload a gait video to analyze foot pressure patterns
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="video-upload"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Select Video File
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="video-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Video files only</p>
                  </div>
                  <input
                    id="video-upload"
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {file && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected: {file.name}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Analyzing..." : "Analyze Video"}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {loading && (
            <div className="mt-8 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Processing your video...</p>
            </div>
          )}

          {result && !loading && (
            <div className="mt-8 space-y-6">
              {result.height_map && (
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Height Map
                  </h2>
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(result.height_map, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {result.foot_pressure && (
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Foot Pressure Heatmap
                  </h2>
                  <div className="space-y-3">
                    {/* Forefoot */}
                    <div className="relative">
                      <div
                        className="h-24 rounded-lg flex items-center justify-center text-white font-semibold transition-all duration-300 shadow-md"
                        style={{
                          backgroundColor: getHeatColor(
                            result.foot_pressure.forefoot
                          ),
                        }}
                      >
                        <div className="text-center">
                          <div className="text-lg">Forefoot</div>
                          <div className="text-2xl">
                            {(result.foot_pressure.forefoot * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Midfoot */}
                    <div className="relative">
                      <div
                        className="h-24 rounded-lg flex items-center justify-center text-white font-semibold transition-all duration-300 shadow-md"
                        style={{
                          backgroundColor: getHeatColor(
                            result.foot_pressure.midfoot
                          ),
                        }}
                      >
                        <div className="text-center">
                          <div className="text-lg">Midfoot</div>
                          <div className="text-2xl">
                            {(result.foot_pressure.midfoot * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Heel */}
                    <div className="relative">
                      <div
                        className="h-24 rounded-lg flex items-center justify-center text-white font-semibold transition-all duration-300 shadow-md"
                        style={{
                          backgroundColor: getHeatColor(
                            result.foot_pressure.heel
                          ),
                        }}
                      >
                        <div className="text-center">
                          <div className="text-lg">Heel</div>
                          <div className="text-2xl">
                            {(result.foot_pressure.heel * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-blue-500"></div>
                      <span>Low Pressure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-yellow-500"></div>
                      <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500"></div>
                      <span>High Pressure</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
