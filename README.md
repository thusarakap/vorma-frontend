# VORMA - Gait Analysis Platform

**Video-based Orthotic Recommendation through Machine Learning and Gait Analysis**

A modern, production-ready Next.js 14 application for analyzing gait patterns and providing AI-powered orthotic recommendations.

![VORMA Screenshot](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## 🎯 Features

### ✨ Core Functionality
- **Drag & Drop Video Upload** - Intuitive file upload with visual feedback
- **Real-time Analysis Status** - Loading states with animated progress indicators
- **AI-Powered Results** - Displays heatmaps and detailed orthotic prescriptions
- **Responsive Design** - Seamless experience on desktop, tablet, and mobile
- **Accessibility First** - ARIA labels, keyboard navigation, and screen reader support

### 🎨 Design Highlights
- **Medical-Professional Aesthetic** - Dark theme with cyan accents inspired by medical imaging
- **Micro-interactions** - Smooth animations and hover effects
- **Grid Background** - Subtle technical pattern with ambient glow effects
- **Custom Typography** - Inter for UI, JetBrains Mono for technical details
- **State Visualizations** - Clear idle, loading, and completed states

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. **Clone or create the project**
```bash
npx create-next-app@14 vorma --typescript --tailwind --app --no-src-dir
cd vorma
```

2. **Install dependencies**
```bash
npm install
```

3. **Add required packages**
```bash
# Install shadcn/ui dependencies
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge

# Install icons
npm install lucide-react

# Install animation plugin
npm install tailwindcss-animate
```

4. **Copy all project files**
   - Copy all files from this repository into your project directory
   - Ensure the following structure:
```
vorma/
├── app/
│   ├── components/
│   │   ├── VideoUploadCard.tsx
│   │   └── AnalysisResultCard.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── ui/
│       ├── card.tsx
│       ├── button.tsx
│       └── badge.tsx
├── lib/
│   └── utils.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
└── next.config.js
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

### Components

#### `VideoUploadCard.tsx`
Handles video file upload with drag-and-drop functionality.

**Props:**
- `onUpload: (file: File) => void` - Callback when file is uploaded
- `isDisabled: boolean` - Disables upload during processing

**Features:**
- Drag and drop support
- File validation (video files only)
- File size display
- Visual feedback for drag states
- Keyboard accessibility

#### `AnalysisResultCard.tsx`
Displays analysis results with dynamic states.

**Props:**
- `state: "idle" | "loading" | "completed"` - Current analysis state
- `result?: AnalysisResult` - Analysis results object

**States:**
- **Idle:** Placeholder with instructions
- **Loading:** Animated spinner with progress indicator
- **Completed:** Heatmap image and prescription details

### State Management

The application uses React `useState` for state management:

```typescript
type AnalysisState = "idle" | "loading" | "completed";

interface AnalysisResult {
  heatmapUrl: string;
  prescription: {
    title: string;
    recommendation: string;
    details: string[];
    severity: "mild" | "moderate" | "severe";
  };
}
```

### Simulated Backend Processing

The current implementation simulates backend processing using `setTimeout`:

```typescript
const handleVideoUpload = (file: File) => {
  setAnalysisState("loading");
  
  setTimeout(() => {
    // Mock analysis result
    setAnalysisResult(mockResult);
    setAnalysisState("completed");
  }, 3500);
};
```

**To integrate a real backend:**
1. Replace `setTimeout` with an API call
2. Add proper error handling
3. Implement file upload to server
4. Process response and update state

## 🎨 Styling & Customization

### Color Scheme
The application uses a cyan-accented dark theme defined in `globals.css`:

```css
--primary: 188 95% 52%;  /* Cyan accent */
--background: 220 15% 6%; /* Dark background */
--card: 222 15% 9%;       /* Card background */
```

### Custom Animations

**Pulse Glow:**
```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px -5px rgba(34, 211, 238, 0.3); }
  50% { box-shadow: 0 0 30px 0px rgba(34, 211, 238, 0.5); }
}
```

**Grid Background:**
```css
.grid-background {
  background-image: 
    linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

### Responsive Breakpoints

Using Tailwind's default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px (cards stack vertically below this)
- `xl`: 1280px
- `2xl`: 1536px

## 🔧 Configuration Files

### `tailwind.config.ts`
Extends Tailwind with custom colors, fonts, and animations.

### `tsconfig.json`
TypeScript configuration with path aliases (`@/*`).

### `next.config.js`
Next.js configuration with image domain allowlist.

## ♿ Accessibility Features

- **ARIA Labels:** All interactive elements have descriptive labels
- **Keyboard Navigation:** Full keyboard support for upload actions
- **Focus States:** Visible focus indicators on all interactive elements
- **Screen Reader Support:** Semantic HTML and descriptive text
- **Color Contrast:** WCAG AA compliant contrast ratios

## 🚀 Performance Optimizations

- **Next.js App Router:** Optimized routing and rendering
- **CSS-only Animations:** No JavaScript animation libraries
- **Tailwind JIT:** Just-in-time compilation for minimal CSS
- **Lazy Loading:** Components render on demand
- **Image Optimization:** Next.js automatic image optimization

## 🔐 Security Considerations

- **File Type Validation:** Client-side validation for video files only
- **File Size Limits:** Implement server-side limits (not included in frontend)
- **XSS Prevention:** React's built-in XSS protection
- **HTTPS:** Always use HTTPS in production

## 📦 Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 🔄 Future Enhancements

Potential additions for production deployment:

1. **Backend Integration**
   - REST API or GraphQL endpoints
   - File upload to cloud storage (S3, GCS)
   - Real ML model integration

2. **Enhanced Features**
   - Video preview before upload
   - Multiple file uploads
   - Export analysis reports as PDF
   - Historical analysis tracking
   - User authentication

3. **Advanced UI**
   - Progress tracking for large uploads
   - Real-time video processing feedback
   - 3D gait visualization
   - Comparison with previous analyses

4. **Analytics**
   - User behavior tracking
   - Performance monitoring
   - Error logging and reporting

## 🐛 Troubleshooting

### Common Issues

**Issue:** `Module not found: Can't resolve '@/components/ui/card'`
**Solution:** Ensure `tsconfig.json` has the correct path alias configuration.

**Issue:** Styles not loading correctly
**Solution:** Verify `tailwind.config.ts` includes all content paths.

**Issue:** Icons not displaying
**Solution:** Check that `lucide-react` is installed: `npm install lucide-react`

## 📄 License

This project is for demonstration purposes. Customize as needed for your use case.

## 🤝 Contributing

This is a template project. Feel free to fork and modify for your needs.

## 📞 Support

For issues or questions, please refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui
