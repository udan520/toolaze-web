#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const rootDir = path.join(__dirname, '..')
const sourceFile = path.join(rootDir, 'public', 'prompts-data.json')
const outputDir = path.join(rootDir, 'public', 'prompts-data')
const modelsDir = path.join(outputDir, 'models')
const categoriesDir = path.join(outputDir, 'categories')

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data), 'utf8')
}

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1)
}

if (!fs.existsSync(sourceFile)) {
  console.error(`Cannot find ${sourceFile}`)
  process.exit(1)
}

const items = JSON.parse(fs.readFileSync(sourceFile, 'utf8'))
if (!Array.isArray(items)) {
  console.error('prompts-data.json must be an array')
  process.exit(1)
}

const sortedItems = [...items].sort((a, b) => Number(a.rank || 0) - Number(b.rank || 0))
const modelBuckets = new Map()
const categoryBuckets = new Map()
const modelCounts = new Map()
const categoryCounts = new Map()
const modelCategoryCounts = {}

sortedItems.forEach((item) => {
  if (!modelBuckets.has(item.model)) modelBuckets.set(item.model, [])
  if (!categoryBuckets.has(item.category)) categoryBuckets.set(item.category, [])

  modelBuckets.get(item.model).push(item)
  categoryBuckets.get(item.category).push(item)
  increment(modelCounts, item.model)
  increment(categoryCounts, item.category)

  if (!modelCategoryCounts[item.model]) modelCategoryCounts[item.model] = {}
  modelCategoryCounts[item.model][item.category] = (modelCategoryCounts[item.model][item.category] || 0) + 1
})

const toSummary = ([name, count]) => ({
  name,
  slug: slugify(name),
  count,
})

const manifest = {
  total: sortedItems.length,
  models: Array.from(modelCounts.entries()).map(toSummary),
  categories: Array.from(categoryCounts.entries()).map(toSummary),
  modelCategoryCounts,
}

fs.mkdirSync(modelsDir, { recursive: true })
fs.mkdirSync(categoriesDir, { recursive: true })

writeJson(path.join(outputDir, 'manifest.json'), manifest)
writeJson(path.join(outputDir, 'all.json'), sortedItems)

modelBuckets.forEach((bucketItems, model) => {
  writeJson(path.join(modelsDir, `${slugify(model)}.json`), bucketItems)
})

categoryBuckets.forEach((bucketItems, category) => {
  writeJson(path.join(categoriesDir, `${slugify(category)}.json`), bucketItems)
})

console.log(`Generated prompt data shards for ${sortedItems.length} templates.`)
console.log(`Models: ${modelBuckets.size}`)
console.log(`Categories: ${categoryBuckets.size}`)
