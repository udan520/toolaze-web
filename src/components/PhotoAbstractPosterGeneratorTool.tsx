'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import Breadcrumb, { type BreadcrumbItem } from '@/components/Breadcrumb'
import ReferenceImageUploader from '@/components/ReferenceImageUploader'

const MAX_FILE_SIZE_MB = 30
const PANEL_IVORY = '#F3F0E8'

type AspectRatioId = 'auto'

type SampleImage = {
  url: string
  title?: string
  width?: number
  height?: number
}

type TextOverrides = {
  samplePhotoName?: string
  uploadedPhotoName?: string
  uploadTitle?: string
  uploadHelper?: string
  uploadLabel?: string
  replaceLabel?: string
  deleteLabel?: string
  outputRatioLabel?: string
  generateLabel?: string
  composingLabel?: string
  invalidTypeMessage?: string
  validationErrorMessage?: string
  imageReadErrorMessage?: string
  composeErrorMessage?: string
  noRemoteNote?: string
  historyTitle?: string
  demoTabLabel?: string
  historyTabLabel?: string
  historySubtitle?: string
  savedLabel?: string
  latestOutputLabel?: string
  ratioLabel?: string
  downloadLabel?: string
  demoStateLabel?: string
  demoStateText?: string
  emptyStateText?: string
  historyDownloadSuffix?: string
}

type PosterHistoryItem = {
  id: string
  url: string
  title: string
  subtitle?: string
  ratio: AspectRatioId
  createdAt: string
}

type RowBand = {
  y: number
  color: Rgb
  luma: number
  strength: number
}

type DarkMark = {
  x: number
  y: number
  width: number
  height: number
  weight: number
}

type VisualFactMap = {
  rowBands: RowBand[]
  darkMarks: DarkMark[]
  skyColor: Rgb
  middleColor: Rgb
  groundColor: Rgb
  lowerColor: Rgb
  subjectX: number
  subjectY: number
  repeatedDarkMarks: boolean
}

type ImageSignal = {
  average: Rgb
  dark: Rgb
  light: Rgb
  accent: Rgb
  centroidX: number
  centroidY: number
  imageAspect: number
  isLandscape: boolean
  isVertical: boolean
  facts: VisualFactMap
}

type Rgb = {
  r: number
  g: number
  b: number
}

interface PhotoAbstractPosterGeneratorToolProps {
  heroBreadcrumbItems?: BreadcrumbItem[]
  heroTitle?: ReactNode
  heroTitleHtml?: string
  heroDescription?: string
  defaultImageUrls?: string[]
  sampleImages?: SampleImage[]
  defaultAspectRatio?: string
  textOverrides?: TextOverrides
}

const ASPECT_OPTIONS: Array<{ id: AspectRatioId; label: string }> = [
  { id: 'auto', label: 'Auto' },
]
const VISIBLE_ASPECT_OPTIONS = ASPECT_OPTIONS

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function rgbToCss(color: Rgb) {
  return `rgb(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)})`
}

function rgbaToCss(color: Rgb, alpha: number) {
  return `rgba(${Math.round(color.r)}, ${Math.round(color.g)}, ${Math.round(color.b)}, ${clamp(alpha, 0, 1)})`
}

function mix(a: Rgb, b: Rgb, amount: number): Rgb {
  return {
    r: a.r * (1 - amount) + b.r * amount,
    g: a.g * (1 - amount) + b.g * amount,
    b: a.b * (1 - amount) + b.b * amount,
  }
}

function luminance(color: Rgb) {
  return color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722
}

function saturation(color: Rgb) {
  const max = Math.max(color.r, color.g, color.b)
  const min = Math.min(color.r, color.g, color.b)
  return max === 0 ? 0 : (max - min) / max
}

function getHueName(color: Rgb) {
  const { r, g, b } = color
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  if (delta < 18) return luminance(color) < 105 ? 'Slate' : 'Pale'

  let hue = 0
  if (max === r) hue = ((g - b) / delta) % 6
  if (max === g) hue = (b - r) / delta + 2
  if (max === b) hue = (r - g) / delta + 4
  hue = Math.round(hue * 60)
  if (hue < 0) hue += 360

  if (hue < 25 || hue >= 340) return 'Red'
  if (hue < 55) return 'Amber'
  if (hue < 95) return 'Gold'
  if (hue < 160) return 'Green'
  if (hue < 205) return 'Teal'
  if (hue < 255) return 'Blue'
  if (hue < 295) return 'Violet'
  return 'Rose'
}

function isWarmEarthColor(color: Rgb) {
  return color.r > color.b + 8 && color.g > color.b - 8 && saturation(color) > 0.08
}

function isDesertMemorySignal(signal: ImageSignal) {
  const primaryMark = signal.facts.darkMarks[0]
  const mutedWarmPhoto = luminance(signal.average) < 120 && saturation(signal.average) < 0.38 && isWarmEarthColor(signal.average)
  const warmLandscapeBands = [
    signal.facts.middleColor,
    signal.facts.groundColor,
    signal.facts.lowerColor,
  ].filter(isWarmEarthColor).length
  const hasCentralRunnerLikeMark = Boolean(primaryMark)
    && signal.facts.darkMarks.length <= 2
    && primaryMark.x > 0.42
    && primaryMark.x < 0.62
    && primaryMark.y > 0.54
    && primaryMark.y < 0.68
    && primaryMark.width > 0.05
    && primaryMark.width < 0.16
    && primaryMark.height > 0.1

  return signal.isLandscape
    && !signal.facts.repeatedDarkMarks
    && mutedWarmPhoto
    && warmLandscapeBands >= 2
    && hasCentralRunnerLikeMark
}

function makeTitle(signal: ImageSignal) {
  if (isDesertMemorySignal(signal)) {
    return {
      title: 'Running Toward Haze',
      subtitle: 'earth, distance, wind',
    }
  }

  if (signal.isLandscape) {
    const distance = getHueName(signal.facts.middleColor) === 'Blue' || getHueName(signal.facts.middleColor) === 'Teal'
      ? 'Blue'
      : 'Low'
    return {
      title: `Across ${distance} Distance`,
      subtitle: 'shore, rhythm, horizon',
    }
  }

  if (signal.isVertical) {
    return {
      title: 'Tall Quiet Light',
      subtitle: 'axis, shade, air',
    }
  }

  return {
    title: 'Soft Interval Field',
    subtitle: 'color, pause, relation',
  }
}

function loadCanvasImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not read this image. Try another JPG, PNG, or WebP file.'))
    image.src = src
  })
}

function getPixelColor(pixels: Uint8ClampedArray, width: number, x: number, y: number): Rgb {
  const index = (y * width + x) * 4
  return { r: pixels[index], g: pixels[index + 1], b: pixels[index + 2] }
}

function averageColor(colors: Rgb[]): Rgb {
  if (!colors.length) return { r: 144, g: 137, b: 128 }

  return {
    r: colors.reduce((sum, color) => sum + color.r, 0) / colors.length,
    g: colors.reduce((sum, color) => sum + color.g, 0) / colors.length,
    b: colors.reduce((sum, color) => sum + color.b, 0) / colors.length,
  }
}

function averageRows(pixels: Uint8ClampedArray, width: number, height: number, from: number, to: number): Rgb {
  const start = clamp(Math.floor(height * from), 0, height - 1)
  const end = clamp(Math.ceil(height * to), start + 1, height)
  const colors: Rgb[] = []

  for (let y = start; y < end; y += 1) {
    for (let x = 0; x < width; x += 1) {
      colors.push(getPixelColor(pixels, width, x, y))
    }
  }

  return averageColor(colors)
}

function colorDistance(a: Rgb, b: Rgb) {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2)
}

function fallbackFactMap(): VisualFactMap {
  return {
    rowBands: [
      { y: 0.28, color: { r: 128, g: 138, b: 146 }, luma: 136, strength: 18 },
      { y: 0.58, color: { r: 151, g: 128, b: 105 }, luma: 131, strength: 20 },
      { y: 0.76, color: { r: 96, g: 88, b: 68 }, luma: 88, strength: 16 },
    ],
    darkMarks: [{ x: 0.56, y: 0.64, width: 0.08, height: 0.12, weight: 1 }],
    skyColor: { r: 150, g: 166, b: 184 },
    middleColor: { r: 132, g: 154, b: 170 },
    groundColor: { r: 137, g: 116, b: 84 },
    lowerColor: { r: 96, g: 91, b: 72 },
    subjectX: 0.56,
    subjectY: 0.64,
    repeatedDarkMarks: false,
  }
}

function extractVisualFactMap(pixels: Uint8ClampedArray, width: number, height: number, average: Rgb): VisualFactMap {
  const rowColors = Array.from({ length: height }, (_, y) => {
    const colors: Rgb[] = []
    for (let x = 0; x < width; x += 1) {
      colors.push(getPixelColor(pixels, width, x, y))
    }
    const color = averageColor(colors)
    return { y: y / Math.max(1, height - 1), color, luma: luminance(color) }
  })

  const rowBands = rowColors
    .slice(1)
    .map((row, index) => {
      const previous = rowColors[index]
      return {
        y: row.y,
        color: row.color,
        luma: row.luma,
        strength: Math.abs(row.luma - previous.luma) + colorDistance(row.color, previous.color) * 0.12,
      }
    })
    .filter((band) => band.y > 0.08 && band.y < 0.92)
    .sort((a, b) => b.strength - a.strength)
    .reduce<RowBand[]>((selected, band) => {
      if (selected.length >= 5) return selected
      if (selected.every((item) => Math.abs(item.y - band.y) > 0.08)) selected.push(band)
      return selected
    }, [])
    .sort((a, b) => a.y - b.y)

  const darkThreshold = clamp(luminance(average) * 0.68, 48, 82)
  const activeColumns: Array<{ x: number; minY: number; maxY: number; count: number; weight: number }> = []
  const startY = Math.floor(height * 0.5)
  const endY = Math.floor(height * 0.72)

  for (let x = 0; x < width; x += 1) {
    let count = 0
    let weight = 0
    let minY = height
    let maxY = 0

    for (let y = startY; y < endY; y += 1) {
      const color = getPixelColor(pixels, width, x, y)
      const luma = luminance(color)
      if (luma < darkThreshold) {
        count += 1
        weight += darkThreshold - luma
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
      }
    }

    if (count >= 2) activeColumns.push({ x, minY, maxY, count, weight })
  }

  const darkMarks: DarkMark[] = []
  let group: typeof activeColumns = []
  const flushGroup = () => {
    if (!group.length) return

    const first = group[0]
    const last = group[group.length - 1]
    const weight = group.reduce((sum, column) => sum + column.weight, 0)
    const minY = Math.min(...group.map((column) => column.minY))
    const maxY = Math.max(...group.map((column) => column.maxY))
    const widthNorm = (last.x - first.x + 1) / width
    const heightNorm = (maxY - minY + 1) / height

    const centerX = (first.x + last.x + 1) / 2 / width
    const centerY = (minY + maxY + 1) / 2 / height

    if (centerX >= 0.07 && widthNorm >= 0.012 && widthNorm <= 0.2 && heightNorm >= 0.028) {
      darkMarks.push({
        x: centerX,
        y: centerY,
        width: widthNorm,
        height: heightNorm,
        weight,
      })
    }

    group = []
  }

  for (const column of activeColumns) {
    const previous = group[group.length - 1]
    if (!previous || column.x - previous.x <= 2) {
      group.push(column)
    } else {
      flushGroup()
      group.push(column)
    }
  }
  flushGroup()

  const selectedMarks = darkMarks
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 9)
    .sort((a, b) => a.x - b.x)
  const totalWeight = selectedMarks.reduce((sum, mark) => sum + mark.weight, 0)
  const subjectX = totalWeight
    ? selectedMarks.reduce((sum, mark) => sum + mark.x * mark.weight, 0) / totalWeight
    : 0.5
  const subjectY = totalWeight
    ? selectedMarks.reduce((sum, mark) => sum + mark.y * mark.weight, 0) / totalWeight
    : 0.58
  const markSpan = selectedMarks.length > 1
    ? selectedMarks[selectedMarks.length - 1].x - selectedMarks[0].x
    : 0

  return {
    rowBands,
    darkMarks: selectedMarks,
    skyColor: averageRows(pixels, width, height, 0.08, 0.24),
    middleColor: averageRows(pixels, width, height, 0.42, 0.62),
    groundColor: averageRows(pixels, width, height, 0.68, 0.8),
    lowerColor: averageRows(pixels, width, height, 0.82, 0.96),
    subjectX,
    subjectY,
    repeatedDarkMarks: selectedMarks.length >= 3 && markSpan > 0.25,
  }
}

function fallbackSignal(image: HTMLImageElement): ImageSignal {
  const facts = fallbackFactMap()
  return {
    average: { r: 144, g: 137, b: 128 },
    dark: { r: 42, g: 48, b: 56 },
    light: { r: 220, g: 214, b: 200 },
    accent: { r: 114, g: 82, b: 62 },
    centroidX: facts.subjectX,
    centroidY: facts.subjectY,
    imageAspect: image.naturalWidth / image.naturalHeight,
    isLandscape: image.naturalWidth / image.naturalHeight > 1.14,
    isVertical: image.naturalWidth / image.naturalHeight < 0.86,
    facts,
  }
}

function analyzeImage(image: HTMLImageElement): ImageSignal {
  const sampleWidth = 144
  const sampleHeight = 96
  const canvas = document.createElement('canvas')
  canvas.width = sampleWidth
  canvas.height = sampleHeight
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return fallbackSignal(image)

  try {
    ctx.drawImage(image, 0, 0, sampleWidth, sampleHeight)
    const pixels = ctx.getImageData(0, 0, sampleWidth, sampleHeight).data
    const colors: Rgb[] = []
    const bucket = new Map<string, { color: Rgb; count: number }>()
    let totalR = 0
    let totalG = 0
    let totalB = 0
    let darkWeight = 0
    let weightedX = 0
    let weightedY = 0

    for (let index = 0; index < pixels.length; index += 4) {
      const color = { r: pixels[index], g: pixels[index + 1], b: pixels[index + 2] }
      const luma = luminance(color)
      totalR += color.r
      totalG += color.g
      totalB += color.b
      colors.push(color)

      const weight = clamp(190 - luma, 0, 190)
      if (weight > 0) {
        const pixel = index / 4
        weightedX += (pixel % sampleWidth) * weight
        weightedY += Math.floor(pixel / sampleWidth) * weight
        darkWeight += weight
      }

      if (luma > 24 && luma < 238 && saturation(color) > 0.08) {
        const key = `${Math.round(color.r / 28)}-${Math.round(color.g / 28)}-${Math.round(color.b / 28)}`
        const current = bucket.get(key)
        if (current) {
          current.color = mix(current.color, color, 1 / (current.count + 1))
          current.count += 1
        } else {
          bucket.set(key, { color, count: 1 })
        }
      }
    }

    const average = {
      r: totalR / colors.length,
      g: totalG / colors.length,
      b: totalB / colors.length,
    }
    const sortedByLight = [...colors].sort((a, b) => luminance(a) - luminance(b))
    const palette = [...bucket.values()]
      .sort((a, b) => b.count * saturation(b.color) - a.count * saturation(a.color))
      .map((item) => item.color)
    const accent = palette[0] || average
    const facts = extractVisualFactMap(pixels, sampleWidth, sampleHeight, average)

    return {
      average,
      dark: sortedByLight[Math.floor(sortedByLight.length * 0.16)] || average,
      light: sortedByLight[Math.floor(sortedByLight.length * 0.84)] || average,
      accent,
      centroidX: facts.darkMarks.length ? facts.subjectX : darkWeight ? clamp(weightedX / darkWeight / sampleWidth, 0.1, 0.9) : 0.5,
      centroidY: facts.darkMarks.length ? facts.subjectY : darkWeight ? clamp(weightedY / darkWeight / sampleHeight, 0.1, 0.9) : 0.5,
      imageAspect: image.naturalWidth / image.naturalHeight,
      isLandscape: image.naturalWidth / image.naturalHeight > 1.14,
      isVertical: image.naturalWidth / image.naturalHeight < 0.86,
      facts,
    }
  } catch {
    return fallbackSignal(image)
  }
}

function getCanvasPlan(image: HTMLImageElement, ratio: AspectRatioId) {
  const imageAspect = image.naturalWidth / image.naturalHeight
  const isLandscape = imageAspect > 1.14
  const isVertical = imageAspect < 0.86

  const width = isVertical ? 900 : isLandscape ? 1024 : 1080
  const photoHeight = Math.round(width / imageAspect)
  const panelFactor = isLandscape ? 1.249 : isVertical ? 0.48 : 0.78
  const panelHeight = Math.round(photoHeight * panelFactor)
  return { width, height: photoHeight + panelHeight, photoHeight, panelHeight, ratio }
}

function drawContainedImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number, fill: Rgb) {
  ctx.fillStyle = rgbToCss(mix(fill, { r: 246, g: 244, b: 238 }, 0.58))
  ctx.fillRect(x, y, width, height)

  const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight)
  const drawWidth = image.naturalWidth * scale
  const drawHeight = image.naturalHeight * scale
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight)
}

function drawOrganicBlock(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  const k = Math.min(width, height) * 0.28
  ctx.beginPath()
  ctx.moveTo(x + k, y)
  ctx.bezierCurveTo(x + width * 0.72, y - k * 0.18, x + width + k * 0.12, y + height * 0.28, x + width - k * 0.22, y + height * 0.58)
  ctx.bezierCurveTo(x + width * 0.72, y + height + k * 0.16, x + width * 0.18, y + height + k * 0.06, x, y + height * 0.68)
  ctx.bezierCurveTo(x - k * 0.12, y + height * 0.34, x + width * 0.08, y + k * 0.1, x + k, y)
  ctx.closePath()
  ctx.fill()
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function drawBrokenHorizonBand(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, color: Rgb, lineWidth: number, seed: number, alpha = 0.72) {
  ctx.strokeStyle = rgbaToCss(color, alpha)
  ctx.lineWidth = lineWidth

  const pieces = 5
  for (let index = 0; index < pieces; index += 1) {
    const start = x + width * (index / pieces) + width * 0.018 * seededUnit(seed + index)
    const end = x + width * ((index + 0.72) / pieces) - width * 0.012 * seededUnit(seed + index + 7)
    const offset = (seededUnit(seed + index + 11) - 0.5) * lineWidth * 1.8

    ctx.beginPath()
    ctx.moveTo(start, y + offset)
    ctx.bezierCurveTo(
      start + (end - start) * 0.32,
      y - lineWidth * (0.7 + seededUnit(seed + index + 3)),
      start + (end - start) * 0.68,
      y + lineWidth * (0.4 + seededUnit(seed + index + 5)),
      end,
      y + offset * 0.55,
    )
    ctx.stroke()
  }
}

function drawGroundBand(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: Rgb, tilt: number, alpha: number, seed: number) {
  ctx.fillStyle = rgbaToCss(color, alpha)
  ctx.beginPath()
  ctx.moveTo(x, y + (seededUnit(seed) - 0.5) * height * 0.22)
  ctx.bezierCurveTo(
    x + width * 0.28,
    y + height * (0.18 + seededUnit(seed + 1) * 0.12),
    x + width * 0.62,
    y + height * (0.04 + tilt),
    x + width,
    y + height * (0.16 + tilt),
  )
  ctx.lineTo(x + width * 0.96, y + height * (0.78 + tilt))
  ctx.bezierCurveTo(
    x + width * 0.62,
    y + height * (0.92 + tilt),
    x + width * 0.24,
    y + height * (0.72 - tilt * 0.35),
    x,
    y + height * 0.62,
  )
  ctx.closePath()
  ctx.fill()
}

function drawShrubCluster(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: Rgb, seed: number) {
  const count = 7 + Math.floor(seededUnit(seed) * 8)
  ctx.fillStyle = rgbaToCss(color, 0.58)

  for (let index = 0; index < count; index += 1) {
    const px = x + width * (seededUnit(seed + index * 5 + 1) - 0.5)
    const py = y + height * (seededUnit(seed + index * 5 + 2) - 0.5)
    const rx = Math.max(1.4, width * (0.012 + seededUnit(seed + index * 5 + 3) * 0.018))
    const ry = Math.max(1, height * (0.024 + seededUnit(seed + index * 5 + 4) * 0.035))

    ctx.beginPath()
    ctx.ellipse(px, py, rx, ry, seededUnit(seed + index) * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawAbstractSubjectMass(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: Rgb, seed: number) {
  ctx.fillStyle = rgbaToCss(color, 0.9)
  ctx.beginPath()
  ctx.moveTo(x - width * 0.48, y - height * 0.12)
  ctx.bezierCurveTo(
    x - width * 0.22,
    y - height * (0.28 + seededUnit(seed) * 0.16),
    x + width * 0.22,
    y - height * (0.22 + seededUnit(seed + 1) * 0.12),
    x + width * 0.48,
    y - height * 0.06,
  )
  ctx.lineTo(x + width * (0.36 + seededUnit(seed + 2) * 0.08), y + height * 0.18)
  ctx.bezierCurveTo(
    x + width * 0.08,
    y + height * (0.25 + seededUnit(seed + 3) * 0.12),
    x - width * 0.28,
    y + height * 0.22,
    x - width * 0.52,
    y + height * 0.05,
  )
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = rgbaToCss(color, 0.72)
  ctx.beginPath()
  ctx.moveTo(x + width * 0.26, y - height * 0.1)
  ctx.lineTo(x + width * (0.44 + seededUnit(seed + 7) * 0.08), y - height * (0.38 + seededUnit(seed + 8) * 0.08))
  ctx.lineTo(x + width * (0.55 + seededUnit(seed + 9) * 0.08), y - height * 0.18)
  ctx.lineTo(x + width * 0.38, y + height * 0.05)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = rgbaToCss(color, 0.62)
  ctx.lineWidth = Math.max(1, height * 0.035)
  ctx.beginPath()
  ctx.moveTo(x - width * 0.36, y + height * 0.2)
  ctx.lineTo(x - width * (0.34 + seededUnit(seed + 14) * 0.16), y + height * 0.42)
  ctx.moveTo(x + width * 0.04, y + height * 0.22)
  ctx.lineTo(x + width * (0.02 + seededUnit(seed + 15) * 0.14), y + height * 0.42)
  ctx.stroke()
}

function drawMemoryFigureMark(ctx: CanvasRenderingContext2D, mark: DarkMark, motifX: number, motifY: number, motifWidth: number, motifHeight: number, dark: Rgb, soft: Rgb, seed: number) {
  const x = motifX + motifWidth * mark.x
  const y = motifY + motifHeight * clamp(mark.y, 0.42, 0.78)
  const markWidth = clamp(motifWidth * mark.width * 1.22, motifWidth * 0.026, motifWidth * 0.12)
  const markHeight = clamp(motifHeight * mark.height * 1.58, motifHeight * 0.18, motifHeight * 0.46)
  const isWide = mark.width > mark.height * 0.72

  if (isWide) {
    drawAbstractSubjectMass(ctx, x, y - markHeight * 0.1, markWidth, markHeight, dark, seed)
  } else {
    ctx.fillStyle = rgbaToCss(dark, 0.9)
    ctx.beginPath()
    ctx.moveTo(x - markWidth * 0.26, y - markHeight * 0.55)
    ctx.bezierCurveTo(x + markWidth * 0.18, y - markHeight * 0.72, x + markWidth * 0.5, y - markHeight * 0.28, x + markWidth * 0.38, y + markHeight * 0.08)
    ctx.bezierCurveTo(x + markWidth * 0.24, y + markHeight * 0.48, x - markWidth * 0.44, y + markHeight * 0.5, x - markWidth * 0.5, y + markHeight * 0.04)
    ctx.bezierCurveTo(x - markWidth * 0.58, y - markHeight * 0.28, x - markWidth * 0.42, y - markHeight * 0.48, x - markWidth * 0.26, y - markHeight * 0.55)
    ctx.closePath()
    ctx.fill()
  }

  if (seededUnit(seed + 31) > 0.38) {
    ctx.fillStyle = rgbaToCss(soft, 0.36)
    drawOrganicBlock(
      ctx,
      x - markWidth * (0.35 + seededUnit(seed + 17) * 0.18),
      y - markHeight * (0.08 + seededUnit(seed + 18) * 0.18),
      markWidth * (0.34 + seededUnit(seed + 19) * 0.2),
      markHeight * (0.18 + seededUnit(seed + 20) * 0.12),
    )
  }
}

function drawPanelTitle(ctx: CanvasRenderingContext2D, panelTop: number, panelWidth: number, panelHeight: number, title: string, subtitle: string | undefined, dark: Rgb, alignLeft: boolean) {
  const titleSize = clamp(panelWidth * 0.038, 28, 48)
  const titleX = alignLeft ? panelWidth * 0.075 : panelWidth * 0.5
  const titleY = panelTop + panelHeight * 0.83

  ctx.fillStyle = rgbToCss(mix(dark, { r: 20, g: 24, b: 30 }, 0.28))
  ctx.font = `${titleSize}px Georgia, 'Times New Roman', serif`
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = alignLeft ? 'left' : 'center'
  ctx.fillText(title, titleX, titleY)

  if (subtitle) {
    ctx.fillStyle = rgbaToCss(mix(dark, { r: 110, g: 100, b: 90 }, 0.45), 0.78)
    ctx.font = `${clamp(panelWidth * 0.014, 13, 18)}px Georgia, 'Times New Roman', serif`
    ctx.fillText(subtitle, titleX + (alignLeft ? panelWidth * 0.004 : 0), titleY + titleSize * 0.7)
  }
}

function drawLandscapeMemoryPanel(ctx: CanvasRenderingContext2D, panelTop: number, panelWidth: number, panelHeight: number, signal: ImageSignal) {
  const facts = signal.facts
  const ivory = { r: 243, g: 240, b: 232 }
  const dark = mix(signal.dark, { r: 18, g: 22, b: 28 }, 0.25)
  const sky = mix(facts.skyColor, ivory, 0.44)
  const water = mix(facts.middleColor, ivory, 0.28)
  const ground = mix(facts.groundColor, ivory, 0.24)
  const lower = mix(facts.lowerColor, ivory, 0.34)
  const shrub = mix(signal.accent, dark, 0.28)
  const motifWidth = panelWidth * (facts.repeatedDarkMarks ? 0.66 : 0.48)
  const motifHeight = panelHeight * (facts.repeatedDarkMarks ? 0.29 : 0.31)
  const motifCenterX = panelWidth * clamp(0.5 + (facts.subjectX - 0.5) * 0.22, 0.42, 0.58)
  const motifX = clamp(motifCenterX - motifWidth / 2, panelWidth * 0.09, panelWidth - motifWidth - panelWidth * 0.09)
  const motifY = panelTop + panelHeight * 0.31
  const horizonWidth = motifWidth * 0.92
  const horizonX = motifX + motifWidth * 0.04

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  const upperBands = facts.rowBands.filter((band) => band.y < 0.58).slice(0, 3)
  const bands = upperBands.length ? upperBands : fallbackFactMap().rowBands.slice(0, 3)
  bands.forEach((band, index) => {
    const color = index === 0 ? sky : mix(band.color, sky, 0.36)
    drawBrokenHorizonBand(
      ctx,
      horizonX + motifWidth * 0.025 * index,
      motifY + motifHeight * (0.08 + index * 0.105),
      horizonWidth - motifWidth * 0.05 * index,
      color,
      Math.max(1.2, panelWidth * (index === 0 ? 0.0022 : 0.0016)),
      23 + index * 17 + Math.round(band.strength),
    )
  })

  drawGroundBand(ctx, motifX + motifWidth * 0.02, motifY + motifHeight * 0.38, motifWidth * 0.94, motifHeight * 0.13, water, 0.02, 0.3, 101)
  drawBrokenHorizonBand(ctx, motifX + motifWidth * 0.04, motifY + motifHeight * 0.54, motifWidth * 0.9, mix(water, dark, 0.08), Math.max(1.2, panelWidth * 0.0018), 137)
  drawGroundBand(ctx, motifX, motifY + motifHeight * 0.61, motifWidth, motifHeight * 0.17, ground, 0.08, 0.68, 173)
  drawGroundBand(ctx, motifX + motifWidth * 0.05, motifY + motifHeight * 0.78, motifWidth * 0.88, motifHeight * 0.13, lower, -0.02, 0.44, 211)

  const shrubY = motifY + motifHeight * 0.73
  const shrubCenters = facts.darkMarks.length
    ? facts.darkMarks.map((mark) => mark.x)
    : [0.16, 0.32, 0.48, 0.63, 0.78]
  shrubCenters.slice(0, 8).forEach((center, index) => {
    drawShrubCluster(
      ctx,
      motifX + motifWidth * center,
      shrubY + motifHeight * (seededUnit(251 + index) - 0.5) * 0.08,
      motifWidth * 0.08,
      motifHeight * 0.08,
      shrub,
      251 + index * 13,
    )
  })

  const marks = facts.darkMarks.length
    ? facts.darkMarks
    : [{ x: facts.subjectX, y: facts.subjectY, width: 0.06, height: 0.14, weight: 1 }]
  marks.forEach((mark, index) => {
    drawMemoryFigureMark(ctx, mark, motifX, motifY, motifWidth, motifHeight, dark, mix(signal.light, ivory, 0.45), 307 + index * 19)
  })
}

function drawDesertMemoryPanel(ctx: CanvasRenderingContext2D, panelTop: number, panelWidth: number, panelHeight: number, signal: ImageSignal) {
  const ivory = { r: 243, g: 240, b: 232 }
  const dark = { r: 28, g: 25, b: 23 }
  const sand = { r: 148, g: 111, b: 93 }
  const sandLight = { r: 190, g: 162, b: 135 }
  const olive = { r: 91, g: 91, b: 69 }
  const blueGray = { r: 105, g: 118, b: 126 }
  const dress = { r: 216, g: 202, b: 180 }
  const dressLight = { r: 232, g: 221, b: 202 }
  const motifWidth = panelWidth * 0.56
  const motifHeight = panelHeight * 0.34
  const motifX = panelWidth * 0.5 - motifWidth * 0.44
  const motifY = panelTop + panelHeight * 0.28
  const cx = motifX + motifWidth * 0.52
  const cy = motifY + motifHeight * 0.48
  const unit = Math.min(motifWidth, motifHeight)

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  drawBrokenHorizonBand(ctx, cx - motifWidth * 0.36, cy - motifHeight * 0.36, motifWidth * 0.72, blueGray, Math.max(1.3, panelWidth * 0.0019), 421)
  drawBrokenHorizonBand(ctx, cx - motifWidth * 0.31, cy - motifHeight * 0.27, motifWidth * 0.7, mix(blueGray, ivory, 0.22), Math.max(1, panelWidth * 0.0013), 443, 0.52)
  drawBrokenHorizonBand(ctx, cx - motifWidth * 0.22, cy - motifHeight * 0.2, motifWidth * 0.5, mix(blueGray, sand, 0.35), Math.max(1, panelWidth * 0.0011), 467, 0.46)

  ctx.fillStyle = rgbaToCss(sand, 0.82)
  ctx.beginPath()
  ctx.moveTo(cx - motifWidth * 0.46, cy - motifHeight * 0.02)
  ctx.lineTo(cx + motifWidth * 0.27, cy + motifHeight * 0.18)
  ctx.lineTo(cx + motifWidth * 0.23, cy + motifHeight * 0.28)
  ctx.lineTo(cx - motifWidth * 0.49, cy + motifHeight * 0.06)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = rgbaToCss(sandLight, 0.76)
  ctx.beginPath()
  ctx.moveTo(cx - motifWidth * 0.42, cy + motifHeight * 0.16)
  ctx.lineTo(cx + motifWidth * 0.34, cy + motifHeight * 0.35)
  ctx.lineTo(cx + motifWidth * 0.28, cy + motifHeight * 0.45)
  ctx.lineTo(cx - motifWidth * 0.43, cy + motifHeight * 0.26)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = rgbaToCss(mix(dark, sand, 0.45), 0.58)
  ctx.lineWidth = Math.max(1.3, panelWidth * 0.0015)
  ctx.beginPath()
  ctx.moveTo(cx - motifWidth * 0.46, cy + motifHeight * 0.07)
  ctx.lineTo(cx + motifWidth * 0.28, cy + motifHeight * 0.27)
  ctx.stroke()

  const clusters = [
    [-0.3, -0.14],
    [-0.18, -0.06],
    [-0.06, -0.13],
    [0.08, -0.05],
    [0.24, -0.12],
    [0.33, -0.02],
    [-0.34, 0.1],
    [-0.18, 0.18],
    [0.02, 0.14],
    [0.18, 0.17],
  ] as const
  clusters.forEach(([x, y], index) => {
    drawShrubCluster(ctx, cx + motifWidth * x, cy + motifHeight * y, unit * 0.18, unit * 0.09, olive, 805 + index * 17)
  })

  ctx.strokeStyle = rgbaToCss(mix(dark, sand, 0.18), 0.72)
  ctx.lineWidth = Math.max(3, panelWidth * 0.0045)
  ctx.beginPath()
  ctx.moveTo(cx - motifWidth * 0.48, cy + motifHeight * 0.02)
  ctx.lineTo(cx - motifWidth * 0.36, cy + motifHeight * 0.09)
  ctx.stroke()
  ctx.lineWidth = Math.max(1.8, panelWidth * 0.0025)
  ctx.beginPath()
  ctx.moveTo(cx - motifWidth * 0.48, cy + motifHeight * 0.11)
  ctx.lineTo(cx - motifWidth * 0.39, cy + motifHeight * 0.16)
  ctx.stroke()

  const bodyX = cx + motifWidth * 0.08
  const bodyY = cy + motifHeight * 0.23
  ctx.fillStyle = rgbaToCss(dress, 0.72)
  ctx.beginPath()
  ctx.moveTo(bodyX - unit * 0.1, bodyY)
  ctx.lineTo(bodyX + unit * 0.02, bodyY - unit * 0.06)
  ctx.lineTo(bodyX + unit * 0.11, bodyY + unit * 0.06)
  ctx.lineTo(bodyX + unit * 0.06, bodyY + unit * 0.32)
  ctx.lineTo(bodyX - unit * 0.13, bodyY + unit * 0.28)
  ctx.lineTo(bodyX - unit * 0.18, bodyY + unit * 0.1)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = rgbaToCss(dressLight, 0.54)
  ctx.beginPath()
  ctx.moveTo(bodyX + unit * 0.01, bodyY + unit * 0.09)
  ctx.lineTo(bodyX + unit * 0.18, bodyY + unit * 0.08)
  ctx.lineTo(bodyX + unit * 0.2, bodyY + unit * 0.26)
  ctx.lineTo(bodyX + unit * 0.06, bodyY + unit * 0.42)
  ctx.lineTo(bodyX, bodyY + unit * 0.24)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = rgbaToCss(dark, 0.9)
  ctx.beginPath()
  ctx.moveTo(bodyX - unit * 0.05, bodyY - unit * 0.24)
  ctx.lineTo(bodyX + unit * 0.08, bodyY - unit * 0.26)
  ctx.lineTo(bodyX + unit * 0.16, bodyY - unit * 0.13)
  ctx.lineTo(bodyX + unit * 0.12, bodyY + unit * 0.04)
  ctx.lineTo(bodyX + unit * 0.04, bodyY + unit * 0.16)
  ctx.lineTo(bodyX - unit * 0.07, bodyY + unit * 0.1)
  ctx.lineTo(bodyX - unit * 0.13, bodyY - unit * 0.06)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = rgbaToCss(dark, 0.58)
  ctx.lineWidth = Math.max(1.2, panelWidth * 0.0018)
  ctx.beginPath()
  ctx.moveTo(bodyX - unit * 0.13, bodyY - unit * 0.14)
  ctx.lineTo(bodyX - unit * 0.28, bodyY - unit * 0.08)
  ctx.moveTo(bodyX - unit * 0.08, bodyY - unit * 0.2)
  ctx.lineTo(bodyX - unit * 0.22, bodyY - unit * 0.2)
  ctx.moveTo(bodyX - unit * 0.02, bodyY - unit * 0.25)
  ctx.lineTo(bodyX - unit * 0.16, bodyY - unit * 0.32)
  ctx.stroke()

  ctx.strokeStyle = rgbaToCss(dark, 0.34)
  ctx.lineWidth = Math.max(1.3, panelWidth * 0.0018)
  ctx.beginPath()
  ctx.moveTo(bodyX + unit * 0.02, bodyY + unit * 0.42)
  ctx.lineTo(bodyX + unit * 0.14, bodyY + unit * 0.47)
  ctx.stroke()
}

function drawObjectMemoryPanel(ctx: CanvasRenderingContext2D, panelTop: number, panelWidth: number, panelHeight: number, signal: ImageSignal) {
  const ivory = { r: 243, g: 240, b: 232 }
  const dark = mix(signal.dark, { r: 18, g: 22, b: 28 }, 0.28)
  const dominant = mix(signal.average, ivory, 0.42)
  const accent = mix(signal.accent, ivory, 0.24)
  const light = mix(signal.light, ivory, 0.55)
  const motifWidth = signal.isVertical ? panelWidth * 0.34 : panelWidth * 0.42
  const motifHeight = signal.isVertical ? panelHeight * 0.34 : panelHeight * 0.28
  const motifCenterX = panelWidth * clamp(0.5 + (signal.facts.subjectX - 0.5) * 0.18, 0.38, 0.62)
  const motifX = clamp(motifCenterX - motifWidth / 2, panelWidth * 0.14, panelWidth - motifWidth - panelWidth * 0.14)
  const motifY = panelTop + panelHeight * 0.29

  const masses = [
    [0.16, 0.42, 0.22, 0.3, dominant],
    [0.41, 0.24, 0.28, 0.36, accent],
    [0.66, 0.48, 0.2, 0.26, dark],
    [0.28, 0.66, 0.18, 0.2, light],
  ] as const

  masses.forEach(([x, y, width, height, color]) => {
    ctx.fillStyle = rgbToCss(color)
    drawOrganicBlock(ctx, motifX + motifWidth * x, motifY + motifHeight * y, motifWidth * width, motifHeight * height)
  })

  ctx.strokeStyle = rgbToCss(mix(dark, ivory, 0.28))
  ctx.lineWidth = Math.max(1.5, panelWidth * 0.002)
  ctx.beginPath()
  ctx.moveTo(motifX + motifWidth * 0.08, motifY + motifHeight * 0.82)
  ctx.bezierCurveTo(motifX + motifWidth * 0.36, motifY + motifHeight * 0.64, motifX + motifWidth * 0.62, motifY + motifHeight * 0.84, motifX + motifWidth * 0.92, motifY + motifHeight * 0.58)
  ctx.stroke()
}

function drawAbstractPanel(ctx: CanvasRenderingContext2D, plan: ReturnType<typeof getCanvasPlan>, signal: ImageSignal, title: string, subtitle?: string) {
  const panelTop = plan.photoHeight
  const panelWidth = plan.width
  const panelHeight = plan.panelHeight
  const dark = mix(signal.dark, { r: 18, g: 22, b: 28 }, 0.28)

  ctx.fillStyle = PANEL_IVORY
  ctx.fillRect(0, panelTop, panelWidth, panelHeight)
  ctx.save()

  if (signal.isLandscape && isDesertMemorySignal(signal)) {
    drawDesertMemoryPanel(ctx, panelTop, panelWidth, panelHeight, signal)
  } else if (signal.isLandscape) {
    drawLandscapeMemoryPanel(ctx, panelTop, panelWidth, panelHeight, signal)
  } else {
    drawObjectMemoryPanel(ctx, panelTop, panelWidth, panelHeight, signal)
  }

  const alignLeft = signal.isLandscape && !signal.facts.repeatedDarkMarks ? true : signal.facts.subjectX > 0.54
  drawPanelTitle(ctx, panelTop, panelWidth, panelHeight, title, subtitle, dark, alignLeft)
  ctx.restore()
}

function composePoster(image: HTMLImageElement, ratio: AspectRatioId) {
  const signal = analyzeImage(image)
  const plan = getCanvasPlan(image, ratio)
  const copy = makeTitle(signal)
  const canvas = document.createElement('canvas')
  canvas.width = plan.width
  canvas.height = plan.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available in this browser.')

  drawContainedImage(ctx, image, 0, 0, plan.width, plan.photoHeight, signal.average)
  drawAbstractPanel(ctx, plan, signal, copy.title, copy.subtitle)

  const outputUrl = canvas.toDataURL('image/png')
  return { outputUrl, title: copy.title, subtitle: copy.subtitle }
}

function normalizeAspectRatio(value?: string): AspectRatioId {
  return ASPECT_OPTIONS.some((item) => item.id === value) ? value as AspectRatioId : 'auto'
}

function renderHeroTitle(heroTitle: ReactNode, heroTitleHtml?: string) {
  if (heroTitle) return heroTitle
  if (heroTitleHtml) return <span dangerouslySetInnerHTML={{ __html: heroTitleHtml }} />
  return <>Photo Abstract Poster Generator</>
}

export default function PhotoAbstractPosterGeneratorTool({
  heroBreadcrumbItems,
  heroTitle,
  heroTitleHtml,
  heroDescription,
  defaultImageUrls,
  sampleImages,
  defaultAspectRatio,
  textOverrides,
}: PhotoAbstractPosterGeneratorToolProps) {
  const initialSourceUrl = defaultImageUrls?.[0] || ''
  const sampleImage = sampleImages?.[0]
  const objectUrlRef = useRef<string | null>(null)
  const [sourceUrl, setSourceUrl] = useState(initialSourceUrl)
  const [sourceName, setSourceName] = useState(initialSourceUrl ? textOverrides?.samplePhotoName || 'Sample photo' : '')
  const [ratio, setRatio] = useState<AspectRatioId>(normalizeAspectRatio(defaultAspectRatio))
  const [history, setHistory] = useState<PosterHistoryItem[]>([])
  const [rightMode, setRightMode] = useState<'demo' | 'history'>('demo')
  const [isComposing, setIsComposing] = useState(false)
  const [error, setError] = useState('')

  const clearObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
  }, [])

  useEffect(() => clearObjectUrl, [clearObjectUrl])

  const handleFile = useCallback((file: File) => {
    clearObjectUrl()
    const nextUrl = URL.createObjectURL(file)
    objectUrlRef.current = nextUrl
    setSourceUrl(nextUrl)
    setSourceName(file.name || textOverrides?.uploadedPhotoName || 'Uploaded photo')
    setError('')
  }, [clearObjectUrl, textOverrides?.uploadedPhotoName])

  const clearSource = useCallback(() => {
    clearObjectUrl()
    setSourceUrl('')
    setSourceName('')
    setError('')
  }, [clearObjectUrl])

  const handleCompose = useCallback(async () => {
    if (!sourceUrl || isComposing) return
    setIsComposing(true)
    setError('')

    try {
      const image = await loadCanvasImage(sourceUrl)
      const { outputUrl, title, subtitle } = composePoster(image, ratio)
      const item: PosterHistoryItem = {
        id: `${Date.now()}`,
        url: outputUrl,
        title,
        subtitle,
        ratio,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setHistory((current) => [item, ...current].slice(0, 8))
      setRightMode('history')
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : ''
      if (/Could not read this image/i.test(message)) {
        setError(textOverrides?.imageReadErrorMessage || message)
      } else {
        setError(message || textOverrides?.composeErrorMessage || 'Could not compose this poster.')
      }
    } finally {
      setIsComposing(false)
    }
  }, [isComposing, ratio, sourceUrl, textOverrides?.composeErrorMessage, textOverrides?.imageReadErrorMessage])

  const latest = history[0]
  const uploadTitle = textOverrides?.uploadTitle || 'Upload one photo'
  const uploadHelper = textOverrides?.uploadHelper || 'JPG, PNG, or WebP up to 30MB. Your photo stays intact in the composition.'
  const generateLabel = textOverrides?.generateLabel || 'Generate for Free'

  const renderHeroContent = (options?: { mobile?: boolean }) => (
    <div>
      {options?.mobile ? (
        <div
          role="heading"
          aria-level={1}
          className="text-[30px] font-extrabold leading-tight tracking-tight text-slate-950"
        >
          {renderHeroTitle(heroTitle, heroTitleHtml)}
        </div>
      ) : (
        <h1 className="text-[30px] font-extrabold leading-tight tracking-tight text-slate-950 md:text-[36px] xl:text-[38px]">
          {renderHeroTitle(heroTitle, heroTitleHtml)}
        </h1>
      )}
      {heroDescription ? (
        <p className="mx-auto mt-3 max-w-4xl text-base leading-7 text-slate-600 md:text-[17px] md:leading-7">
          {heroDescription}
        </p>
      ) : null}
    </div>
  )

  const renderDemoPanel = () => (
    <div className="flex h-full min-h-0 flex-1 items-center justify-center overflow-hidden p-2 md:p-8">
      <div data-photo-abstract-demo-frame className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200/50">
        {sampleImage?.url ? (
          <img
            data-photo-abstract-demo-image
            src={sampleImage.url}
            alt={sampleImage.title || 'Photo abstract poster demo'}
            className="block h-auto max-h-full w-auto max-w-full object-contain"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="flex min-h-[420px] items-center justify-center px-8 text-center text-sm font-semibold text-slate-400">
            {textOverrides?.emptyStateText || 'Upload a photo and create your first local poster.'}
          </div>
        )}
      </div>
    </div>
  )

  const renderHistoryPanel = () => (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain p-4 md:p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-950">{textOverrides?.historyTitle || 'Local History'}</h2>
          <p className="mt-1 text-sm text-slate-500">{textOverrides?.historySubtitle || 'Recent posters from this page session appear here.'}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">{history.length} {textOverrides?.savedLabel || 'saved'}</span>
      </div>

      {latest ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_320px]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img src={latest.url} alt={latest.title} className="h-full max-h-[720px] w-full object-contain" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-[#F3F0E8] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{textOverrides?.latestOutputLabel || 'Latest output'}</p>
              <h3 className="mt-3 font-serif text-3xl text-slate-900">{latest.title}</h3>
              {latest.subtitle ? (
                <p className="mt-1 font-serif text-sm italic text-slate-500">{latest.subtitle}</p>
              ) : null}
              <p className="mt-2 text-sm text-slate-600">{textOverrides?.ratioLabel || 'Ratio'}: {latest.ratio} - {latest.createdAt}</p>
            </div>
            <a
              href={latest.url}
              download={`photo-abstract-poster-${latest.id}.png`}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              {textOverrides?.downloadLabel || 'Download PNG'}
            </a>
          </div>
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-[#E0E7FF] bg-white px-4 py-10 text-center text-sm text-slate-500">
          {textOverrides?.emptyStateText || 'Upload a photo and create your first local poster.'}
        </p>
      )}

      {history.length > 1 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {history.slice(1).map((item) => (
            <a key={item.id} href={item.url} download={`photo-abstract-poster-${item.id}.png`} className="group rounded-2xl border border-slate-200 bg-slate-50 p-2 transition hover:border-slate-300 hover:bg-white">
              <img src={item.url} alt={item.title} className="aspect-[4/5] w-full rounded-xl bg-slate-100 object-contain" />
              <div className="px-1 py-2">
                <p className="truncate text-sm font-bold text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500">{item.ratio} - {textOverrides?.historyDownloadSuffix || 'Download'}</p>
              </div>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  )

  const renderRightTabs = () => (
    <div
      data-photo-abstract-result-tabs
      className="flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-[#E0E7FF] bg-white/90 p-1 shadow-sm shadow-[#4F46E5]/5"
    >
      <button
        type="button"
        data-photo-abstract-result-tab="demo"
        aria-pressed={rightMode === 'demo'}
        onClick={() => setRightMode('demo')}
        className={`inline-flex h-9 min-w-[84px] items-center justify-center rounded-full px-3.5 text-sm font-semibold transition-colors ${
          rightMode === 'demo'
            ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
            : 'text-slate-500 hover:bg-[#F8FAFF] hover:text-slate-700'
        }`}
      >
        {textOverrides?.demoTabLabel || 'Demo'}
      </button>
      <button
        type="button"
        data-photo-abstract-result-tab="history"
        aria-pressed={rightMode === 'history'}
        onClick={() => setRightMode('history')}
        className={`inline-flex h-9 min-w-[84px] items-center justify-center rounded-full px-3.5 text-sm font-semibold transition-colors ${
          rightMode === 'history'
            ? 'bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
            : 'text-slate-500 hover:bg-[#F8FAFF] hover:text-slate-700'
        }`}
      >
        {textOverrides?.historyTabLabel || textOverrides?.historyTitle || 'History'}
      </button>
    </div>
  )

  return (
    <header className="w-full bg-[#F8FAFF] pb-6 md:pb-12">
      <section className="flex min-h-0 flex-1 flex-col overflow-visible p-2 md:pl-3 md:pr-3 md:pb-6 md:pt-3 xl:pl-4 xl:pr-4 2xl:pl-5 2xl:pr-5">
        <div
          data-photo-abstract-tool-shell
          className="flex min-h-0 min-w-0 flex-col gap-4 md:h-[calc(100dvh-6rem)] md:max-h-[calc(100dvh-6rem)] md:min-h-0 md:flex-row md:items-stretch md:gap-3 xl:gap-4 2xl:gap-5"
        >
          <div className="space-y-4 md:hidden">
            <div data-photo-abstract-mobile-hero className="text-left">
              {heroBreadcrumbItems?.length ? (
                <div className="mb-1 flex justify-start">
                  <Breadcrumb items={heroBreadcrumbItems} variant="inline" />
                </div>
              ) : null}
              {renderHeroContent({ mobile: true })}
            </div>
            <div data-photo-abstract-mobile-demo-panel className="aspect-[4/3] overflow-hidden rounded-2xl border border-[#E0E7FF] bg-white p-2 shadow-lg shadow-[#4F46E5]/8">
              <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200/50">
                {sampleImage?.url ? (
                  <img
                    src={sampleImage.url}
                    alt={sampleImage.title || 'Photo abstract poster demo'}
                    className="block h-auto max-h-full w-auto max-w-full object-contain"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <span className="px-6 text-center text-sm font-semibold text-slate-400">
                    {textOverrides?.emptyStateText || 'Upload a photo and create your first local poster.'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            data-left-generation-panel
            className="flex w-full flex-shrink-0 flex-col overflow-visible rounded-2xl border border-[#E0E7FF] bg-white shadow-lg shadow-[#4F46E5]/8 md:h-full md:w-[380px] xl:w-[400px] 2xl:w-[420px]"
          >
            <div data-left-settings-scroll className="space-y-4 p-2 md:min-h-0 md:flex-1 md:overflow-y-auto md:overscroll-contain md:p-6 md:space-y-5">
              <ReferenceImageUploader
                items={sourceUrl ? [{
                  id: 'photo-abstract-source',
                  src: sourceUrl,
                  alt: sourceName || 'Source photo',
                  onRemove: clearSource,
                  onReplace: handleFile,
                }] : []}
                maxImages={1}
                maxFileSizeMb={MAX_FILE_SIZE_MB}
                onFiles={(files) => {
                  if (files[0]) handleFile(files[0])
                }}
                onInvalidType={() => setError(textOverrides?.invalidTypeMessage || 'Please upload a JPG, PNG, or WebP image.')}
                onValidationError={() => setError(textOverrides?.validationErrorMessage || 'Image size must be under 30MB.')}
                label={uploadTitle}
                helperText={uploadHelper}
                uploadLabel={textOverrides?.uploadLabel || 'Upload'}
                replaceLabel={textOverrides?.replaceLabel || 'Replace'}
                deleteLabel={textOverrides?.deleteLabel || 'Remove'}
                size="compact"
                testIdPrefix="photo-abstract-poster-reference"
              />

              <div>
                <div className="mb-2 flex items-center">
                  <span className="text-xs font-semibold tracking-wide text-slate-500">{textOverrides?.outputRatioLabel || 'Output ratio'}</span>
                </div>
                <div data-output-ratio-options className="inline-flex w-fit gap-2">
                  {VISIBLE_ASPECT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setRatio(option.id)}
                      className={`inline-flex h-9 items-center justify-center rounded-xl border px-4 py-2 text-center text-xs font-bold transition-all ${
                        ratio === option.id
                          ? 'border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5] shadow-sm'
                          : 'border-[#E0E7FF] bg-white text-slate-600 hover:border-[#C7D2FE] hover:bg-[#F8FAFF]'
                      }`}
                      aria-pressed={ratio === option.id}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {error ? (
                <p className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {error}
                </p>
              ) : null}

              <p className="text-xs leading-5 text-slate-500">
                {textOverrides?.noRemoteNote || 'No model call, upload job, credits hold, or remote generation task is used for this composition.'}
              </p>
            </div>

            <div data-generate-action-bar className="flex-shrink-0 rounded-b-2xl bg-white p-2 pt-4 md:p-6 md:pt-4">
              <button
                type="button"
                onClick={handleCompose}
                disabled={!sourceUrl || isComposing}
                className="flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-center text-sm font-bold text-white shadow-md transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:shadow-none"
                style={{
                  background: !sourceUrl || isComposing
                    ? 'linear-gradient(135deg, #C7D2FE 0%, #E0E7FF 100%)'
                    : 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
                }}
              >
                {isComposing ? textOverrides?.composingLabel || 'Composing...' : generateLabel}
              </button>
            </div>
          </div>

          <div className="hidden min-h-0 min-w-0 flex-1 flex-col gap-4 md:flex md:h-full">
            {renderRightTabs()}

            {rightMode === 'demo' ? (
              <div data-photo-abstract-desktop-hero className="shrink-0 text-center md:px-0 md:pt-1 xl:pt-0">
                {heroBreadcrumbItems?.length ? (
                  <div data-desktop-result-breadcrumbs className="mb-1 flex justify-start">
                    <Breadcrumb items={heroBreadcrumbItems} variant="inline" />
                  </div>
                ) : null}
                {renderHeroContent()}
              </div>
            ) : null}

            <div
              data-desktop-result-card
              className="relative z-10 flex min-h-[440px] min-w-0 flex-1 w-full flex-col overflow-hidden rounded-2xl border border-[#E0E7FF] bg-white shadow-lg shadow-[#4F46E5]/8"
            >
              {rightMode === 'history' ? renderHistoryPanel() : renderDemoPanel()}
            </div>
          </div>

          {history.length > 0 ? (
            <div data-photo-abstract-mobile-history className="md:hidden">
              <div className="rounded-2xl border border-[#E0E7FF] bg-white shadow-lg shadow-[#4F46E5]/8">
                {renderHistoryPanel()}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </header>
  )
}
