# VORMA - Quick Reference Guide

## 🎯 Key Files Overview

### Core Application Files
| File | Purpose | Key Exports |
|------|---------|-------------|
| `app/page.tsx` | Main page component | `Home` (default) |
| `app/layout.tsx` | Root layout with fonts | `RootLayout` (default) |
| `app/globals.css` | Global styles & animations | N/A |

### Component Files
| File | Purpose | Props |
|------|---------|-------|
| `app/components/VideoUploadCard.tsx` | Video upload UI | `onUpload`, `isDisabled` |
| `app/components/AnalysisResultCard.tsx` | Results display | `state`, `result` |

### UI Components (shadcn/ui)
| File | Purpose | Exports |
|------|---------|---------|
| `components/ui/card.tsx` | Card container | `Card`, `CardHeader`, `CardTitle`, etc. |
| `components/ui/button.tsx` | Button component | `Button`, `buttonVariants` |
| `components/ui/badge.tsx` | Badge component | `Badge`, `badgeVariants` |

### Configuration Files
| File | Purpose |
|------|---------|
| `package.json` | Dependencies & scripts |
| `tsconfig.json` | TypeScript configuration |
| `tailwind.config.ts` | Tailwind customization |
| `next.config.js` | Next.js configuration |
| `components.json` | shadcn/ui settings |

## 🔧 Common Tasks

### Change Primary Color
Edit `app/globals.css`:
```css
--primary: 188 95% 52%; /* Change HSL values */
--accent: 188 95% 52%;
```

### Modify Upload Timeout
Edit `app/page.tsx`:
```typescript
setTimeout(() => {
  // Change 3500 to desired milliseconds
}, 3500);
```

### Add New Analysis Fields
1. Update `AnalysisResult` interface in `app/page.tsx`
2. Modify mock data in `handleVideoUpload`
3. Update `AnalysisResultCard.tsx` to display new fields

### Customize Animation Speed
Edit `app/globals.css`:
```css
@keyframes pulse-glow {
  /* Modify animation duration */
}
```

## 📊 State Flow

```
┌─────────┐
│  IDLE   │ ← Initial state
└────┬────┘
     │ User uploads video
     ↓
┌─────────┐
│ LOADING │ ← Shows spinner (3.5s)
└────┬────┘
     │ Processing complete
     ↓
┌──────────┐
│COMPLETED │ ← Shows results
└──────────┘
```

## 🎨 Design Tokens

### Colors (HSL)
```css
Background:    220 15% 6%
Card:          222 15% 9%
Primary:       188 95% 52% (Cyan)
Foreground:    210 20% 98%
Border:        217 33% 17%
```

### Typography
```css
Body:     Inter (--font-inter)
Mono:     JetBrains Mono (--font-mono)
```

### Spacing Scale
```css
Card Padding:     p-6 (24px)
Section Gap:      gap-6 (24px)
Component Gap:    gap-3 (12px)
```

## 🔌 API Integration Template

Replace the mock implementation in `app/page.tsx`:

```typescript
const handleVideoUpload = async (file: File) => {
  setAnalysisState("loading");
  
  try {
    // Create FormData
    const formData = new FormData();
    formData.append('video', file);
    
    // Call your API
    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Analysis failed');
    }
    
    // Parse response
    const result: AnalysisResult = await response.json();
    
    // Update state
    setAnalysisResult(result);
    setAnalysisState("completed");
  } catch (error) {
    console.error('Upload error:', error);
    // Handle error state (add error state to component)
    setAnalysisState("idle");
  }
};
```

## 🎯 Component Props Reference

### VideoUploadCard
```typescript
interface VideoUploadCardProps {
  onUpload: (file: File) => void;  // Called when user clicks "Start Analysis"
  isDisabled: boolean;              // Disables all interactions
}
```

### AnalysisResultCard
```typescript
interface AnalysisResultCardProps {
  state: "idle" | "loading" | "completed";  // Current state
  result?: {                                 // Analysis results (optional)
    heatmapUrl: string;
    prescription: {
      title: string;
      recommendation: string;
      details: string[];
      severity: "mild" | "moderate" | "severe";
    };
  };
}
```

## 🎬 Animation Classes

### Available Utilities
```css
.text-glow          /* Text glow effect */
.card-glow          /* Card glow effect */
.animate-pulse-glow /* Pulsing glow animation */
.animate-scan       /* Scanning line effect */
.grid-background    /* Grid pattern background */
.upload-area-pattern /* Upload area grid pattern */
```

### Tailwind Animations
```typescript
// Built-in
animate-spin      // Spinner rotation
animate-pulse     // Opacity pulse
animate-bounce    // Bounce effect

// Custom (from config)
animate-in        // Entrance animation
slide-in-from-*   // Directional slides
fade-in-*         // Fade transitions
```

## 🔍 Debugging Tips

### Check Component State
```typescript
// Add to page.tsx
console.log('State:', analysisState);
console.log('Result:', analysisResult);
```

### Verify File Upload
```typescript
// In VideoUploadCard
console.log('File selected:', file.name, file.size, file.type);
```

### Inspect Tailwind Classes
```bash
# Check which classes are being generated
npm run build
# Look at .next/static/css/*.css
```

## 📱 Responsive Breakpoints

```typescript
// Default Tailwind breakpoints
sm:   640px   // Small devices
md:   768px   // Tablets
lg:   1024px  // Laptops (cards stack below this)
xl:   1280px  // Desktops
2xl:  1536px  // Large desktops
```

### Responsive Grid
```jsx
// In page.tsx
<div className="grid grid-cols-1 lg:grid-cols-2">
  {/* Stacks on mobile, side-by-side on desktop */}
</div>
```

## 🚀 Performance Checklist

- [ ] Images optimized (WebP format)
- [ ] Lazy load heavy components
- [ ] Minimize bundle size
- [ ] Enable compression (gzip/brotli)
- [ ] Add loading states
- [ ] Implement error boundaries
- [ ] Use production build
- [ ] Enable HTTP/2

## 📝 TypeScript Tips

### Type Assertion
```typescript
const result = data as AnalysisResult;
```

### Optional Chaining
```typescript
result?.prescription?.details?.map(...)
```

### Nullish Coalescing
```typescript
const severity = result?.prescription?.severity ?? "moderate";
```

## 🎨 Customization Examples

### Change to Light Theme
Edit `app/globals.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --primary: 188 95% 42%;
  /* etc... */
}
```

### Add Purple Accent
```css
:root {
  --primary: 271 91% 65%;      /* Purple */
  --accent: 271 91% 65%;
}
```

### Modify Card Radius
```css
:root {
  --radius: 1rem;  /* Larger rounded corners */
}
```

## 🔗 Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Dependencies
npm install          # Install all dependencies
npm update           # Update packages
npm audit            # Check for vulnerabilities

# shadcn/ui
npx shadcn-ui add    # Add components
```

## 📚 Documentation Links

- [Next.js 14 Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Radix UI](https://www.radix-ui.com)

---

**Quick Start:** `npm install && npm run dev`
