import { readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const imageDir = path.resolve('public/images')
const sources = (await readdir(imageDir)).filter((file) => /^[a-z-]+\.webp$/.test(file))

for (const file of sources) {
  const input = path.join(imageDir, file)
  const name = path.basename(file, '.webp')
  const metadata = await sharp(input).metadata()

  await Promise.all([
    sharp(input).avif({ quality: 58, effort: 6 }).toFile(path.join(imageDir, `${name}.avif`)),
    sharp(input).resize({ width: 960, withoutEnlargement: true }).avif({ quality: 55, effort: 6 }).toFile(path.join(imageDir, `${name}-960.avif`)),
    sharp(input).resize({ width: 960, withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toFile(path.join(imageDir, `${name}-960.webp`)),
  ])

  console.log(`${file}: ${metadata.width}x${metadata.height}`)
}
