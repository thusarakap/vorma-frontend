# VORMA - Setup Guide

## 1. Create Next.js 14 Project

```bash
npx create-next-app@14 vorma --typescript --tailwind --app --no-src-dir
cd vorma
```

## 2. Install shadcn/ui

```bash
npx shadcn-ui@latest init
```

When prompted, select:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

## 3. Install Required shadcn/ui Components

```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add button
npx shadcn-ui@latest add badge
```

## 4. Install Lucide React Icons

```bash
npm install lucide-react
```

## 5. Project Structure

```
vorma/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── components/
│       ├── VideoUploadCard.tsx
│       └── AnalysisResultCard.tsx
├── components/
│   └── ui/
│       ├── card.tsx
│       ├── button.tsx
│       └── badge.tsx
└── lib/
    └── utils.ts
```

## 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Notes

- All components use TypeScript
- Tailwind CSS is configured automatically
- shadcn/ui components are located in `components/ui/`
- The design uses a medical-professional aesthetic with cyan accents
