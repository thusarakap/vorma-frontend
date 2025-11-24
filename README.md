# Vorma Frontend - Gait Video Analysis

A modern Next.js frontend application for uploading and analyzing gait videos with real-time visualization of foot pressure patterns.

## Features

- 📹 Video file upload with drag-and-drop support
- 🔄 Real-time loading state during analysis
- 📊 Height map data visualization
- 🎨 Interactive foot pressure heatmap (heel, midfoot, forefoot regions)
- 🎯 Color-coded pressure values (blue=low, yellow=medium, red=high)
- 📱 Responsive, modern UI with centered card layout
- ⚡ Built with Next.js 16, TypeScript, and Tailwind CSS

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running at `http://127.0.0.1:8000/api/analyze`

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables template
cp .env.local.example .env.local

# (Optional) Edit .env.local to configure API URL
# NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click the upload area or drag and drop a gait video file
2. Click "Analyze Video" to submit
3. Wait for the analysis to complete
4. View the results:
   - Height map data (JSON format)
   - Foot pressure heatmap with three regions:
     - Forefoot (top)
     - Midfoot (middle)
     - Heel (bottom)

## API Integration

The application sends a POST request to `http://127.0.0.1:8000/api/analyze` with the video file as FormData. Expected response format:

```json
{
  "height_map": [0.1, 0.2, 0.3, ...],
  "foot_pressure": {
    "forefoot": 0.75,
    "midfoot": 0.45,
    "heel": 0.85
  }
}
```

## Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Development

```bash
# Run linting
npm run lint

# Run development server with auto-reload
npm run dev
```

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom React components
- **HTTP Client**: Fetch API

## License

ISC