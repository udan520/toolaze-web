# Toolaze - Next.js 15 App Router

This project has been refactored to use Next.js 15 with App Router architecture.

## Project Structure

```
src/
├── app/
│   ├── (quick-tools)/          # Route Group (doesn't appear in URL)
│   │   └── [tool]/
│   │       └── [slug]/
│   │           └── page.tsx    # Dynamic route: /[tool]/[slug]
│   ├── about/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   ├── terms/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx                # Homepage
│   └── globals.css
└── components/
    ├── Navigation.tsx
    ├── Footer.tsx
    ├── Breadcrumb.tsx
    └── ImageCompressor.tsx
```

## URL Structure

- Homepage: `/`
- About: `/about`
- Privacy: `/privacy`
- Terms: `/terms`
- Image Compression Tool: `/image-compression/png-to-100kb` (or any slug)

The Route Group `(quick-tools)` is used for logical organization but doesn't appear in the URL.

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

```bash
npm run build
npm start
```

## Features

- ✅ Next.js 15 App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Dynamic routing with `[tool]/[slug]` pattern
- ✅ Route Groups for logical organization
- ✅ Client-side image compression
- ✅ Batch processing (up to 100 images)
- ✅ Drag and drop support
- ✅ Responsive design

## Notes

- The `(quick-tools)` route group allows you to organize tools logically without affecting URLs
- All tool pages use the same dynamic route structure: `/[tool]/[slug]`
- Static assets (like favicon.svg) should be placed in the `public/` directory
