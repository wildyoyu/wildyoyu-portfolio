// tools/optimize-images.mjs
// Uso: node tools/optimize-images.mjs <carpeta_entrada> <carpeta_salida>
// Ejemplo: node tools/optimize-images.mjs RAW public/photos

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const [,, IN_DIR = 'RAW', OUT_DIR = 'public/photos'] = process.argv;

// Config de tamaños (puedes ajustar)
const SIZE_HERO = 2560;
const SIZE_GALLERY = 1920;
const QUALITY_WEBP = 80;

// Donde guardaremos un manifiesto para usar en la web
const DATA_JSON = path.join('src', 'data', 'photos.json');

function slugify(name) {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function ensureDir(p) {
  await fsp.mkdir(p, { recursive: true });
}

function isImageFile(file) {
  return /\.(jpe?g|png|webp|tiff?|bmp)$/i.test(file);
}

async function processImage(inFile, outDir) {
  const base = path.basename(inFile);
  const stem = slugify(base.replace(/\.[^.]+$/, ''));
  const isHero = /(^|[-_])hero([-_]|$)/i.test(stem); // si el nombre lleva 'hero'
  const width = isHero ? SIZE_HERO : SIZE_GALLERY;

  const img = sharp(inFile, { failOnError: false }).rotate(); // respeta EXIF

  // Redimensiona manteniendo aspecto y sin subir de tamaño original
  const metadata = await img.metadata();
  const targetWidth = Math.min(width, metadata.width || width);

  const outWebp = path.join(outDir, `${stem}.webp`);
  await img
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: QUALITY_WEBP, effort: 4 })
    .toFile(outWebp);

  // Relee el resultado para obtener dimensiones finales
  const outMeta = await sharp(outWebp).metadata();

  return {
    title: stem.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    alt: "", // <— EDITA luego en src/data/photos.json
    src: `/photos/${path.basename(outWebp)}`,
    w: outMeta.width || targetWidth,
    h: outMeta.height || Math.round(targetWidth * 9 / 16)
  };
}

async function walk(dir) {
  const found = [];
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      found.push(...await walk(full));
    } else if (e.isFile() && isImageFile(e.name)) {
      found.push(full);
    }
  }
  return found;
}

async function main() {
  if (!fs.existsSync(IN_DIR)) {
    console.error(`❌ Carpeta de entrada no existe: ${IN_DIR}\nCrea una carpeta con originales (JPG/PNG)`);
    process.exit(1);
  }
  await ensureDir(OUT_DIR);
  await ensureDir(path.join('src', 'data'));

  const files = await walk(IN_DIR);
  if (files.length === 0) {
    console.warn(`⚠️ No se encontraron imágenes en ${IN_DIR}`);
    process.exit(0);
  }

  console.log(`🔧 Procesando ${files.length} imagen(es) desde ${IN_DIR} → ${OUT_DIR}`);
  const items = [];
  for (const f of files) {
    try {
      const it = await processImage(f, OUT_DIR);
      items.push(it);
      console.log(`✅ ${path.basename(f)} → ${it.src}`);
    } catch (err) {
      console.error(`❌ Error con ${f}:`, err.message);
    }
  }

  // Escribe manifiesto
  const json = JSON.stringify(items, null, 2);
  await fsp.writeFile(DATA_JSON, json, 'utf8');
  console.log(`📝 Manifiesto escrito en ${DATA_JSON} (edita los "alt")`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
