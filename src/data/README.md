# Tool Data Structure

This directory contains JSON files that define the content and SEO metadata for each tool page.

## Directory Structure

```
src/data/
├── [tool-name]/
│   ├── [slug].json
│   └── [another-slug].json
└── ...
```

## Example: `image-compression/png-to-100kb.json`

Each JSON file should follow this structure:

```json
{
  "tool": "image-compression",
  "slug": "png-to-100kb",
  "title": "Page Title for SEO | Toolaze",
  "description": "Meta description for SEO",
  "h1": "Free <span class=\"text-gradient\">Tool Name</span>",
  "heroDescription": "Hero section description text",
  "sections": {
    "whyToolaze": {
      "headline": "Headline text",
      "description": "Description text",
      "features": [
        {
          "icon": "📂",
          "title": "Feature Title",
          "description": "Feature description"
        }
      ]
    },
    "howToUse": {
      "steps": [
        {
          "number": 1,
          "title": "Step Title",
          "description": "Step description"
        }
      ]
    },
    "comparison": {
      "toolaze": {
        "features": ["✅ Feature 1", "✅ Feature 2"]
      },
      "competitors": {
        "features": ["❌ Limitation 1", "❌ Limitation 2"]
      }
    },
    "scenarios": [
      {
        "icon": "💻",
        "title": "Scenario Title",
        "description": "Scenario description"
      }
    ],
    "faq": [
      {
        "question": "Question text?",
        "answer": "Answer text"
      }
    ]
  },
  "component": "ImageCompressor"
}
```

## Adding a New Tool

1. Create a new directory under `src/data/` with your tool name (e.g., `image-resize`)
2. Create a JSON file with your slug name (e.g., `resize-to-500px.json`)
3. Fill in all required fields
4. If you need a custom component, add it to `src/components/` and register it in `src/app/[tool]/[slug]/page.tsx` in the `componentMap`

## URL Structure

The URL will be: `/{tool}/{slug}`

Example: `/image-compression/png-to-100kb`

## Required Fields

- `tool`: Must match the directory name
- `slug`: Must match the filename (without .json)
- `title`: SEO title
- `description`: SEO meta description
- `h1`: Main heading (can include HTML)
- `heroDescription`: Hero section text

## Optional Sections

All sections under `sections` are optional. Include only the sections you need for your tool page.
