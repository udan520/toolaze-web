# Toolaze SEO Landing Page Master Template

## 1. Design System (Style 1: Soft Smart Tech)
- **Font**: Poppins (`font-sans`).
- **Typography**:
  - **H1 (Heading 1)**: `text-2xl` (24px) - **MANDATORY**: All H1 tags MUST use `text-2xl` class (24px font size). No responsive variants allowed.
  - **H2 (Heading 2)**: `text-4xl` (36px) for section headings.
  - **H3 (Heading 3)**: `text-xl` (20px) for subsection headings.
  - **Body Text**: Slate-500.
- **Colors**:
  - Background: `#F8FAFF` (Light Indigo Tint).
  - Primary Gradient: `from-indigo-600 to-purple-600`.
  - Text: Slate-900 (Headings), Slate-500 (Body).
- **Shapes**:
  - Container: `rounded-[2.5rem]` (rounded-super).
  - Buttons: `rounded-full`.
- **Shadows**:
  - Soft: `shadow-indigo-500/20`.
  - Glow: `shadow-indigo-200`.
- **Section Background Alternation (CRITICAL)**:
  - **Alternate section backgrounds** to create visual separation and hierarchy.
  - Use `bg-white` for one section, then `bg-[#F8FAFF]` for the next.
  - This ensures different content blocks (e.g., "Why Choose Toolaze?" vs "FAQ") are visually distinct.
  - Example pattern: Hero (`bg-[#F8FAFF]`) → Features (`bg-white`) → Steps (`bg-[#F8FAFF]`) → FAQ (`bg-white`).

## 2. Global Navigation Bar (Required on All Pages)

**All pages MUST use the same navigation structure:**

- **Logo**: Left-aligned, links to homepage (`index.html` or `../../../index.html` depending on depth)
- **Menu Items**: Right-aligned, includes:
  - **Quick Tools** (dropdown menu with hover effect)
    - Image Compression (links to `quick-tools/image-compressor/index.html`)
    - More tools will be added as dropdown items
  - **About Us** (links to `about/index.html` or `../../../about/index.html`)

**Navigation Code Structure:**
```html
<!-- CSS Styles (add to <style> section) -->
<style>
    /* Sticky Navigation */
    nav.sticky-nav { position: sticky; top: 0; z-index: 9999; transition: all 0.3s ease; }
    nav.sticky-nav.scrolled { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); box-shadow: 0 4px 20px -5px rgba(79, 70, 229, 0.1); }
</style>

<!-- Navigation HTML -->
<nav id="mainNav" class="sticky-nav py-6 px-6 flex justify-between items-center max-w-6xl mx-auto w-full relative">
    <a href="[homepage-path]" class="text-3xl font-extrabold text-indigo-600 tracking-tighter flex items-center gap-3 hover:opacity-80 transition-opacity">
        <!-- Logo SVG -->
    </a>
    <div class="hidden md:flex gap-8 text-sm font-bold text-slate-500 items-center">
        <div class="relative group">
            <button class="hover:text-indigo-600 transition-colors flex items-center gap-1">
                Quick Tools
                <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>
            <div class="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-indigo-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div class="py-2">
                    <a href="[tool-path]" class="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Image Compression</a>
                </div>
            </div>
        </div>
        <a href="[about-path]" class="hover:text-indigo-600 transition-colors">About Us</a>
    </div>
</nav>

<!-- JavaScript (add before </body>) -->
<script>
    // Sticky navigation on scroll
    (function() {
        const nav = document.getElementById('mainNav');
        if (nav) {
            let lastScroll = 0;
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                if (currentScroll > 50) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                lastScroll = currentScroll;
            });
        }
    })();
</script>
```

**Sticky Navigation Behavior:**
- The navigation bar MUST use `id="mainNav"` and `class="sticky-nav"` for sticky functionality
- When scrolling down more than 50px, the navigation bar becomes sticky at the top with:
  - Semi-transparent white background (`rgba(255, 255, 255, 0.95)`)
  - Backdrop blur effect (`backdrop-filter: blur(10px)`)
  - Subtle shadow for depth
- Smooth transition effect (0.3s ease) when scrolling state changes

## 3. Breadcrumb Navigation (All Pages Except Homepage)

**Breadcrumbs are REQUIRED on ALL pages except the homepage:**

- **Homepage**: No breadcrumb
- **All Other Pages**: Must include breadcrumb navigation
- **Format Rules**:
  - If page has a clear parent: `Home / [Parent] / [Current Page]`
  - If page has no clear parent or unknown hierarchy: `Home / [Current Page]`
  - Examples:
    - Quick Tools page: `Home / Quick Tools`
    - Image Compressor: `Home / Quick Tools / Image Compression`
    - About page: `Home / About Us`
    - Privacy page: `Home / Privacy Policy`

**Breadcrumb Code Structure:**
```html
<div class="px-6 max-w-6xl mx-auto w-full mb-4">
    <nav class="text-sm text-slate-500" aria-label="Breadcrumb">
        <ol class="flex items-center gap-2">
            <li><a href="[homepage-path]" class="hover:text-indigo-600 transition-colors">Home</a></li>
            <li class="text-slate-300">/</li>
            <li><a href="[quick-tools-path]" class="hover:text-indigo-600 transition-colors">Quick Tools</a></li>
            <li class="text-slate-300">/</li>
            <li class="text-slate-900 font-medium">[Tool Name]</li>
        </ol>
    </nav>
</div>
```

## 4. Page Structure (Strict Order)
1. **Nav**: Global Navigation Bar (see section 2).
2. **Breadcrumb**: Only on tool pages (see section 3).
3. **Hero**: H1 (Gradient) + Subtitle + Interactive Tool Card + Trust Bar.
4. **Intro**: Feature Grid (Left: Pain Points, Right: 3 Feature Cards merging specs).
5. **Steps**: 3-Column Grid (EaseMate Style).
6. **Compare**: Toolaze (Left, Highlighted) vs Competitor (Right, Gray).
7. **Scenarios**: 3 Cards (Devs, E-commerce, Social).
8. **FAQ**: Accordion style.
9. **Footer**: Rating + Links.

## 3. HTML Source Code (Tailwind CSS)
Use this code structure as the absolute source of truth. Replace text content only.

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Poppins', 'sans-serif'] },
                    colors: { brand: { light: '#F8FAFF' } },
                    boxShadow: { 'soft': '0 20px 40px -15px rgba(79, 70, 229, 0.1)' }
                }
            }
        }
    </script>
    <style>
        body { background-color: #F8FAFF; color: #334155; }
        .desc-text { font-size: 14px; line-height: 1.6; color: #64748B; }
        .text-gradient { background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .bg-gradient-brand { background: linear-gradient(135deg, #4f46e5 0%, #9333ea 100%); }
        .rounded-super { border-radius: 2.5rem; }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
    </style>
</head>
<body class="overflow-x-hidden">
    <nav class="py-6 px-6 flex justify-between items-center max-w-6xl mx-auto w-full relative">
        <a href="[homepage-path]" class="text-3xl font-extrabold text-indigo-600 tracking-tighter flex items-center gap-3 hover:opacity-80 transition-opacity">
            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="shadow-md shadow-indigo-100 rounded-lg">
                <rect width="40" height="40" rx="12" fill="white"/>
                <path d="M12 12H22C23.1 12 24 12.9 24 14V28C24 29.1 23.1 30 22 30H18C16.9 30 16 29.1 16 28V16H12C10.9 16 10 15.1 10 14V14C10 12.9 10.9 12 12 12Z" fill="url(#paint_wink)"/>
                <circle cx="29" cy="14" r="3" fill="url(#paint_wink)"/>
                <defs><linearGradient id="paint_wink" x1="10" y1="12" x2="29" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#4F46E5"/><stop offset="1" stop-color="#9333EA"/></linearGradient></defs>
            </svg>
            Toolaze
        </a>
        <div class="hidden md:flex gap-8 text-sm font-bold text-slate-500 items-center">
            <div class="relative group">
                <button class="hover:text-indigo-600 transition-colors flex items-center gap-1">
                    Quick Tools
                    <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
                <div class="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-indigo-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div class="py-2">
                        <a href="[tool-path]" class="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">Image Compression</a>
                    </div>
                </div>
            </div>
            <a href="[about-path]" class="hover:text-indigo-600 transition-colors">About Us</a>
        </div>
    </nav>

    <header class="bg-[#F8FAFF] pb-12 px-6">
        <div class="max-w-4xl mx-auto text-center pt-8 mb-12">
            <h1 class="text-2xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                [Action Verb] <span class="text-gradient">[Target Keyword]</span>
            </h1>
            <p class="desc-text text-lg md:text-xl max-w-2xl mx-auto">[Value Proposition]</p>
        </div>
        <div class="max-w-xl mx-auto relative z-10">
            <div class="bg-white rounded-super p-2 shadow-soft border border-indigo-50">
                <div class="border-2 border-dashed border-indigo-100 rounded-[2.2rem] p-10 bg-indigo-50/20 text-center relative overflow-hidden group hover:border-indigo-300 transition-all cursor-pointer">
                    <div class="text-6xl mb-6 group-hover:scale-110 transition-transform">💎</div>
                    <h3 class="text-xl md:text-2xl font-bold text-slate-800 mb-2">[Upload CTA]</h3>
                    <p class="text-[12px] font-bold text-indigo-400 uppercase tracking-widest">[Format Support]</p>
                </div>
            </div>
            <div class="mt-8 flex flex-wrap justify-center gap-4 text-[11px] font-bold text-indigo-900/60 uppercase tracking-widest">
                <span>🔒 100% Private</span> <span class="hidden md:block">|</span>
                <span>⚡ Local Browser API</span> <span class="hidden md:block">|</span>
                <span>🚫 No Server Logs</span>
            </div>
        </div>
    </header>

    <section class="bg-white py-24 px-6 border-t border-indigo-50/50">
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div class="text-left space-y-6">
                <span class="text-xs font-bold text-purple-500 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full">Why Toolaze?</span>
                <h2 class="text-3xl font-extrabold text-slate-900 leading-tight">[Pain Point Headline]</h2>
                <p class="desc-text text-lg">[Pain Point Description]</p>
            </div>
            <div class="grid gap-4">
                <div class="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">📂</div>
                    <div><h4 class="font-bold text-slate-800">[Feature 1]</h4><p class="text-xs text-slate-500">[Desc 1]</p></div>
                </div>
                <div class="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl">🎨</div>
                    <div><h4 class="font-bold text-slate-800">[Feature 2]</h4><p class="text-xs text-slate-500">[Desc 2]</p></div>
                </div>
                <div class="bg-[#F8FAFF] p-6 rounded-3xl border border-indigo-50 flex items-center gap-4">
                    <div class="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">💎</div>
                    <div><h4 class="font-bold text-slate-800">100% Free</h4><p class="text-xs text-slate-500">No ads forever.</p></div>
                </div>
            </div>
        </div>
    </section>

    <section class="py-24 px-6 bg-[#F8FAFF]">
        <div class="max-w-6xl mx-auto">
            <h2 class="text-3xl font-extrabold text-center text-slate-900 mb-20">How to Use <span class="text-indigo-600">Toolaze?</span></h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                <div class="group">
                    <div class="w-20 h-20 mb-8 mx-auto rounded-full bg-gradient-brand flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-white">1</div>
                    <h3 class="text-xl font-bold text-slate-800 mb-2">[Step 1 Title]</h3>
                    <p class="desc-text max-w-[240px] mx-auto">[Step 1 Desc]</p>
                </div>
            </div>
        </div>
    </section>

    <section class="py-24 px-6 bg-white relative overflow-hidden">
        <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div class="md:col-span-5 relative order-1">
                <div class="relative bg-white rounded-[2rem] p-10 shadow-2xl shadow-indigo-500/20 border border-white">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-brand text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full shadow-lg">Smart Choice</div>
                    <h3 class="font-bold text-slate-900 text-xl mb-8 border-b border-indigo-50 pb-4">Toolaze 💎</h3>
                </div>
            </div>
            <div class="hidden md:flex md:col-span-2 justify-center order-2 font-black text-indigo-200">VS</div>
            <div class="md:col-span-5 bg-white/60 rounded-3xl p-8 border border-slate-200/60 opacity-80 grayscale order-3">
                <h3 class="font-bold text-slate-500 text-lg mb-8 border-b border-slate-200 pb-4">Other Tools</h3>
            </div>
        </div>
    </section>

    <section class="py-24 px-6 bg-[#F8FAFF]">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        </div>
    </section>

    <section class="py-24 px-6 bg-white">
        <div class="max-w-3xl mx-auto space-y-4">
        </div>
    </section>

    <footer class="bg-slate-900 pt-16 pb-8 px-6">
        <div class="max-w-6xl mx-auto">
            <!-- Navigation Links -->
            <nav class="mb-8" aria-label="Footer navigation">
                <ul class="flex flex-wrap justify-center gap-6 md:gap-8 text-sm">
                    <li><a href="/" class="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Home</a></li>
                    <li><a href="/tools" class="text-slate-300 hover:text-indigo-400 transition-colors font-medium">All Tools</a></li>
                    <li><a href="/about" class="text-slate-300 hover:text-indigo-400 transition-colors font-medium">About Us</a></li>
                    <li><a href="/privacy" class="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Privacy Policy</a></li>
                    <li><a href="/terms" class="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Terms of Service</a></li>
                    <li><a href="mailto:support@toolaze.com" class="text-slate-300 hover:text-indigo-400 transition-colors font-medium">Contact</a></li>
                </ul>
            </nav>

            <!-- Copyright -->
            <div class="text-center pt-6 border-t border-slate-700">
                <p class="text-xs text-slate-400 mb-2">
                    © <span id="currentYear">2026</span> Toolaze Lab. All rights reserved.
                </p>
                <p class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">
                    Free Online Tools • No Registration Required • 100% Private
                </p>
            </div>
        </div>
    </footer>

    <script>
        // Update copyright year
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    </script>
</body>
</html>
```

## 4. Standard Footer Structure

**All pages MUST use the same footer structure:**

- **Background**: `bg-slate-900` (Dark slate background)
- **Padding**: `pt-16 pb-8 px-6`
- **Navigation Links**: Centered, flex-wrap layout with standard links (Home, All Tools, About Us, Privacy Policy, Terms of Service, Contact)
- **Link Style**: `text-slate-300 hover:text-indigo-400 transition-colors font-medium`
- **Copyright**: Two-line copyright with dynamic year and tagline
- **Border**: `border-t border-slate-700` separator between navigation and copyright

**Footer Links (Required):**
- Home (/)
- All Tools (/tools)
- About Us (/about)
- Privacy Policy (/privacy)
- Terms of Service (/terms)
- Contact (mailto:support@toolaze.com)
