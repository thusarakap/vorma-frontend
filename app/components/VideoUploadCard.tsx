"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Video, X, Check } from "lucide-react";

interface VideoUploadCardProps {
  onUpload: (file: File) => void;
  isDisabled: boolean;
}

export default function VideoUploadCard({ onUpload, isDisabled }: VideoUploadCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDisabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (isDisabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <Card className="border-cyan-500/20 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-500/10">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-cyan-500/10 p-2">
            <Video className="h-6 w-6 text-cyan-500" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Upload Gait Video
            </CardTitle>
            <CardDescription className="mt-1">
              Drop your video file or click to browse
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isDisabled && fileInputRef.current?.click()}
          className={`
            relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed 
            p-12 text-center transition-all duration-300 upload-area-pattern
            ${
              isDragging
                ? "border-cyan-500 bg-cyan-500/10 scale-[1.02]"
                : "border-cyan-500/30 bg-background/30 hover:border-cyan-500/50 hover:bg-cyan-500/5"
            }
            ${isDisabled ? "cursor-not-allowed opacity-50" : ""}
          `}
          role="button"
          tabIndex={0}
          aria-label="Upload video file"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              !isDisabled && fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isDisabled}
            aria-label="File input"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className={`rounded-full bg-cyan-500/10 p-4 transition-transform duration-300 ${isDragging ? "scale-110" : ""}`}>
              <Upload className={`h-10 w-10 text-cyan-500 transition-all ${isDragging ? "animate-bounce" : ""}`} />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">
                {isDragging ? "Drop video here" : "Drag & drop video file"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse your files
              </p>
            </div>

            <Badge variant="secondary" className="font-mono text-xs">
              Supported: MP4, AVI, MOV, WebM
            </Badge>
          </div>
        </div>

        {selectedFile && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
              <div className="rounded-md bg-cyan-500/10 p-2">
                <Check className="h-5 w-5 text-cyan-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-sm text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearFile}
                disabled={isDisabled}
                className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <Button
          onClick={handleUploadClick}
          disabled={!selectedFile || isDisabled}
          className="w-full bg-cyan-500 text-slate-900 hover:bg-cyan-400 disabled:opacity-50 font-semibold tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
          size="lg"
        >
          <Upload className="mr-2 h-5 w-5" />
          Start Analysis
        </Button>
      </CardContent>
    </Card>
  );
}
