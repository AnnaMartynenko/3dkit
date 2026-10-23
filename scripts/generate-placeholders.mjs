// Генерує тимчасові SVG-зображення для товарів, у яких ще немає фото.
// Запуск: node scripts/generate-placeholders.mjs
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = join(root, 'src/data/products.json')

const palettes = {
  animation: ['#e3d4f7', '#6224ba'],
  stencils: ['#ffe1bd', '#b85c00'],
  keychains: ['#ffd9c2', '#c2560f'],
  earrings: ['#f3d9ec', '#8e3f7a'],
  other: ['#e8e4ef', '#6b6277'],
}

const data = JSON.parse(await readFile(dataPath, 'utf8'))
let created = 0

for (const product of data.products) {
  for (const image of product.images) {
    if (!image.endsWith('.svg')) continue

    const target = join(root, 'public', image)
    if (existsSync(target)) continue

    const [light, dark] = palettes[product.category] ?? ['#eee6db', '#b0a08c']
    const title = product.title.replace(/[<>&]/g, '')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${light}" />
      <stop offset="1" stop-color="#fffaf4" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="52%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.85" />
      <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="800" height="800" fill="url(#bg)" />
  <circle cx="400" cy="330" r="260" fill="url(#glow)" />
  <g fill="none" stroke="${dark}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" opacity="0.65">
    <circle cx="400" cy="350" r="150" />
    <path d="M300 470c40-60 80-60 120-20s80 40 120-10" />
  </g>
  <text x="400" y="650" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${dark}" opacity="0.75">3Dkit</text>
</svg>
`
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, svg, 'utf8')
    created += 1
  }
}

console.log(`Готово: створено ${created} зображень-заглушок.`)
