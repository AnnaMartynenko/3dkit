#!/usr/bin/env node
// Імпорт товарів з експорту Instagram.
//
// Як отримати експорт (Meta перенесла цю функцію в Accounts Center):
//   https://accountscenter.instagram.com/info_and_permissions/dyi/
//   → Export your information → Create export → Instagram → Export to device
//   → Some of your information → Posts → All time → JSON → Start export.
//   Архів доступний у «Available downloads» протягом 4 днів.
//
// Запуск:
//   npm run import:instagram -- ~/Downloads/instagram-username-2026-10-22
//
// Корисні прапорці:
//   --dry-run       показати, що буде імпортовано, нічого не змінюючи
//   --force         перезаписати товари з таким самим id
//   --all-images    копіювати всі фото каруселі (за замовчуванням 3)
//
// Скрипт не чіпає наявні товари, додає лише нові.

import { existsSync } from 'node:fs'
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { basename, dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const productsPath = join(root, 'src/data/products.json')

const args = process.argv.slice(2)
const flags = new Set(args.filter((arg) => arg.startsWith('--')))
const targetArg = args.find((arg) => !arg.startsWith('--'))

const dryRun = flags.has('--dry-run')
const force = flags.has('--force')
const allImages = flags.has('--all-images')

if (!targetArg) {
  console.error(`
Потрібно вказати теку з експортом Instagram.

  1. Відкрий https://accountscenter.instagram.com/info_and_permissions/dyi/
  2. Export your information → Create export → Instagram → Export to device
  3. Some of your information → Posts → All time → JSON → Start export
  4. Завантаж архів із «Available downloads» (посилання діє 4 дні)
  5. Розпакуй ZIP (буде тека на кшталт instagram-username-2026-10-22)
  6. Запусти:

     npm run import:instagram -- ~/Downloads/instagram-username-2026-10-22
`)
  process.exit(1)
}

const exportRoot = resolve(targetArg.replace(/^~(?=$|\/)/, process.env.HOME ?? '~'))

if (!existsSync(exportRoot)) {
  console.error(`Теки не існує: ${exportRoot}`)
  process.exit(1)
}

// ---------- пошук постів у структурі експорту ----------

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await walk(full)))
    } else if (entry.isFile()) {
      files.push(full)
    }
  }

  return files
}

function hasMedia(item) {
  return Array.isArray(item?.media) && item.media.some((media) => media && typeof media.uri === 'string')
}

function hasLabelMedia(item) {
  return (
    Array.isArray(item?.label_values) &&
    item.label_values.some(
      (label) =>
        Array.isArray(label?.media) &&
        label.media.some((media) => media && typeof media.uri === 'string'),
    )
  )
}

function isPostList(value) {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        (hasMedia(item) || hasLabelMedia(item)),
    )
  )
}

// У новіших експортах Meta фото каруселі лежать у label_values (іноді
// вкладені глибше, у полі dict), а не в post.media. Збираємо їх рекурсивно
// і прибираємо дублікати.
function collectMedia(post) {
  const media = []
  const seen = new Set()

  const push = (item) => {
    if (!item || typeof item.uri !== 'string' || seen.has(item.uri)) return
    seen.add(item.uri)
    media.push(item)
  }

  const walk = (value) => {
    if (!value || typeof value !== 'object') return

    if (Array.isArray(value)) {
      value.forEach(walk)
      return
    }

    if (typeof value.uri === 'string') {
      push(value)
      return
    }

    for (const [key, child] of Object.entries(value)) {
      if (key === 'media_metadata') continue
      if (key === 'media' || key === 'label_values' || key === 'dict') walk(child)
    }
  }

  walk(post.media)
  walk(post.label_values)

  return media
}

// Експорт Instagram інколи віддає UTF-8, прочитаний як Latin-1 («ÐÐ¾Ð²Ñ–»).
function repairEncoding(text) {
  if (typeof text !== 'string' || !text) return text
  if (!/[ÃÂÐÑ]/.test(text)) return text

  const repaired = Buffer.from(text, 'latin1').toString('utf8')
  return repaired.includes('\uFFFD') ? text : repaired
}

function getCaption(post, media) {
  if (typeof post.title === 'string' && post.title.trim()) return repairEncoding(post.title.trim())

  // Підпис зазвичай висить на першому (обкладинковому) фото
  const titles = media
    .map((item) => (typeof item.title === 'string' ? repairEncoding(item.title.trim()) : ''))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)

  return titles[0] ?? ''
}

function findPostsInJson(value) {
  if (isPostList(value)) return value

  // Деякі версії експорту обгортають список у поле
  if (value && typeof value === 'object') {
    for (const nested of Object.values(value)) {
      if (isPostList(nested)) return nested
    }
  }

  return null
}

const allFiles = await walk(exportRoot)
const jsonFiles = allFiles.filter((file) => extname(file).toLowerCase() === '.json')

console.log(`Знайдено ${jsonFiles.length} JSON-файлів в експорті…`)

const rawPosts = []

for (const file of jsonFiles) {
  let parsed
  try {
    parsed = JSON.parse(await readFile(file, 'utf8'))
  } catch {
    continue
  }

  const posts = findPostsInJson(parsed)
  if (!posts) continue

  // Файли з коментарями/лайками мають іншу структуру, тому сюди не потрапляють
  for (const post of posts) {
    const media = collectMedia(post)
    if (!media.length) continue

    rawPosts.push({
      post,
      media,
      caption: getCaption(post, media),
      file: relative(exportRoot, file),
    })
  }
}

// Одна публікація може траплятися у двох JSON-файлах (наприклад, posts.json
// з підписами та posts_1.json без них). Спершу обробляємо варіанти з підписом,
// а дублікати відсіюємо за вже використаними фото.
rawPosts.sort((a, b) => {
  const captionDiff = Number(Boolean(b.caption)) - Number(Boolean(a.caption))
  if (captionDiff) return captionDiff
  return b.media.length - a.media.length
})

if (!rawPosts.length) {
  console.error(`
У теці не знайдено публікацій Instagram.

Перевір, що експорт містить Posts / Публікації у форматі JSON, і що ти вказала
саме розпаковану теку (а не .zip).
`)
  process.exit(1)
}

// ---------- перетворення в товари ----------

const translit = {
  а: 'a', б: 'b', в: 'v', г: 'h', ґ: 'g', д: 'd', е: 'e', є: 'ye', ж: 'zh', з: 'z',
  и: 'y', і: 'i', ї: 'yi', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p',
  р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'shch', ь: '', ю: 'yu', я: 'ya',
}

function slugify(text) {
  return text
    .toLowerCase()
    .split('')
    .map((char) => translit[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

const categoryKeywords = {
  boxes: ['шкатулк', 'органайзер', 'сховищ', 'box', 'organizer'],
  earrings: ['сережк', 'сереж', 'кульчик', 'прикрас', 'earring', 'jewelry', 'каблучк'],
  animation: ['фліпбук', 'флипбук', 'трауматроп', 'зоотроп', 'анімац', 'оптичн', 'flipbook'],
  stencils: ['трафарет', 'stencil', 'шаблон', 'алфавіт', 'вертляв'],
  keychains: ['брелок', 'брелок', 'антистрес', 'крутилк', 'фіджет', 'keychain', 'fidget'],
  other: [],
}

function guessCategory(text) {
  const lower = text.toLowerCase()
  for (const [id, words] of Object.entries(categoryKeywords)) {
    if (words.some((word) => lower.includes(word))) return id
  }
  return 'other'
}

function guessSubcategory(category, text) {
  if (category !== 'stencils') return null

  const lower = text.toLowerCase()
  if (['алфавіт', 'літер', 'alphabet'].some((word) => lower.includes(word))) return 'alphabet'
  if (['вертляв', 'цифр', 'spinner'].some((word) => lower.includes(word))) return 'spinner'
  return 'themed'
}

function extractPrice(text) {
  const match = text.match(/(\d[\d\s]{1,6})\s*(?:грн|₴|uah|гривень|гривні)/i)
  if (!match) return null

  const value = Number(match[1].replace(/\s/g, ''))
  return Number.isFinite(value) && value > 0 ? value : null
}

function extractAge(text) {
  const match = text.match(/(\d+[+,.]?\d*)\s*\+/)
  return match ? `${match[1].replace(',', ',')}+` : null
}

function cleanTitle(line) {
  return line
    .replace(/#[\p{L}\p{N}_]+/gu, '')
    .replace(/[^\p{L}\p{N}\s'’«»"—–-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.,;:!-]+$/, '')
}

function extractHashtags(text) {
  return [...text.matchAll(/#([\p{L}\p{N}_]+)/gu)]
    .map((match) => match[1].toLowerCase())
    .filter((tag, index, list) => list.indexOf(tag) === index)
    .slice(0, 8)
}

const usedIds = new Set()
const takenIds = new Set()
const existing = JSON.parse(await readFile(productsPath, 'utf8'))
existing.products.forEach((product) => takenIds.add(product.id))

const imported = []
const skipped = []
const usedImages = new Set()
const usedCaptions = new Set()

for (const { post, media, caption: rawCaption } of rawPosts) {
  const caption = repairEncoding(rawCaption).trim()
  const timestamp = Number(post.timestamp || post.creation_timestamp || media[0]?.creation_timestamp) || null

  // Той самий пост може бути в posts.json і posts_1.json — беремо лише один
  if (caption && usedCaptions.has(caption)) continue

  const allImages = []

  for (const item of media) {
    if (typeof item.uri !== 'string') continue
    if (item.media_metadata?.video_metadata) continue
    if (!/\.(jpe?g|png|webp)$/i.test(item.uri)) continue
    allImages.push(decodeURIComponent(item.uri))
  }

  if (!allImages.length) {
    skipped.push({ reason: 'немає фото (лише відео)', caption: caption.slice(0, 60) })
    continue
  }

  // Якщо всі фото вже забрав інший варіант цієї ж публікації — це дублікат
  const images = allImages.filter((uri) => !usedImages.has(uri))
  if (!images.length) continue
  images.forEach((uri) => usedImages.add(uri))

  const lines = caption.split('\n').map((line) => line.trim()).filter(Boolean)
  const firstLine = lines.find((line) => !line.startsWith('#')) ?? ''
  const title = cleanTitle(firstLine) || `Виріб з Instagram ${timestamp ? new Date(timestamp * 1000).toLocaleDateString('uk-UA') : ''}`
  const description = lines
    .filter((line) => line !== firstLine)
    .join('\n')
    .replace(/#[\p{L}\p{N}_]+/gu, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  let id = slugify(title) || `instagram-${timestamp ?? createHash('md5').update(caption).digest('hex').slice(0, 8)}`

  if (takenIds.has(id) && !force) {
    skipped.push({ reason: 'такий товар уже є на сайті', caption: title })
    continue
  }

  let uniqueId = id
  let counter = 2
  while (usedIds.has(uniqueId)) {
    uniqueId = `${id}-${counter}`
    counter += 1
  }
  usedIds.add(uniqueId)
  id = uniqueId

  const limit = allImages ? images.length : Math.min(images.length, 3)
  const copiedImages = []

  for (const [index, uri] of images.slice(0, limit).entries()) {
    const source = join(exportRoot, uri)
    if (!existsSync(source)) continue

    const ext = extname(uri).toLowerCase()
    const fileName = `${index + 1}${ext}`
    const publicPath = `/products/${id}/${fileName}`

    if (!dryRun) {
      const destination = join(root, 'public', publicPath)
      await mkdir(dirname(destination), { recursive: true })
      await copyFile(source, destination)
    }

    copiedImages.push(publicPath)
  }

  if (!copiedImages.length) {
    skipped.push({ reason: 'фото не знайдено у теці експорту', caption: title })
    continue
  }

  const price = extractPrice(caption)
  const category = guessCategory(`${title} ${caption}`)
  const subcategory = guessSubcategory(category, `${title} ${caption}`)
  if (caption) usedCaptions.add(caption)

  imported.push({
    id,
    title,
    category,
    ...(subcategory ? { subcategory } : {}),
    price,
    oldPrice: null,
    description: description || 'Опис з Instagram. Додайте деталі у файлі src/data/products.json.',
    details: [],
    images: copiedImages,
    tags: extractHashtags(caption),
    inStock: true,
    featured: false,
    ageGroup: extractAge(caption),
    source: {
      platform: 'instagram',
      permalink: null,
      postedAt: timestamp ? new Date(timestamp * 1000).toISOString().slice(0, 10) : null,
    },
  })
}

// ---------- запис ----------

if (!imported.length) {
  console.log('\nНічого нового не імпортовано.')
  for (const item of skipped) console.log(`  · пропущено: ${item.reason} — ${item.caption}`)
  process.exit(0)
}

const merged = {
  ...existing,
  updatedAt: new Date().toISOString().slice(0, 10),
  products: [
    ...existing.products.filter((product) => !(force && imported.some((item) => item.id === product.id))),
    ...imported,
  ],
}

if (!dryRun) {
  await writeFile(productsPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8')

  const rows = [
    'id,назва,ціна,категорія,потребує правки',
    ...imported.map((item) =>
      [
        item.id,
        `"${item.title.replace(/"/g, '""')}"`,
        item.price ?? '',
        item.category,
        item.price ? '' : 'так — вкажіть ціну',
      ].join(','),
    ),
  ]
  await writeFile(join(root, 'instagram-import.csv'), `${rows.join('\n')}\n`, 'utf8')
}

console.log(`\n${dryRun ? '[dry-run] ' : ''}Імпортовано товарів: ${imported.length}`)

for (const item of imported) {
  const price = item.price ? `${item.price} грн` : 'ціну треба вказати'
  console.log(`  ✓ ${item.title} — ${item.category}, ${price}`)
}

if (skipped.length) {
  console.log(`\nПропущено: ${skipped.length}`)
  for (const item of skipped) console.log(`  · ${item.reason} — ${item.caption}`)
}

if (!dryRun) {
  console.log(`
Далі:
  1. Перевір ціни та описи: src/data/products.json (або instagram-import.csv)
  2. Додай категорію «Інше», якщо вона не підходить
  3. Запусти: npm run dev
`)
}
