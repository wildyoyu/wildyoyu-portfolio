import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

/**
 * Uso:
 *   node tools/optimize-images.mjs RAW public/photos [maxWidth] [quality]
 * Ejemplo:
 *   node tools/optimize-images.mjs RAW public/photos 2560 82
 */
const [,, IN_DIR = 'RAW', OUT_DIR = 'public/photos', MAX_W_ARG, Q_ARG] = process.argv;
const MAX_WIDTH = Number(MAX_W_ARG) > 0 ? Number(MAX_W_ARG) : 2560; // ancho máximo (no amplía)
const QUALITY   = Number(Q_ARG) > 0 ? Number(Q_ARG) : 82;            // 1-100

function isImage(f){ return /\.(jpe?g|png|tiff?|bmp|webp)$/i.test(f); }
function slugify(name){
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
}
async function ensureDir(p){ await fsp.mkdir(p, { recursive: true }); }

async function walk(dir){
  const out = [];
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries){
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(full));
    else if (e.isFile() && isImage(e.name)) out.push(full);
  }
  return out;
}

async function processImage(inFile){
  const base = path.basename(inFile);
  const stem = slugify(base.replace(/\.[^.]+$/, ''));
  const outWebp = path.join(OUT_DIR, `${stem}.webp`);

  const input = sharp(inFile, { failOnError: false }).rotate(); // respeta EXIF
  const meta = await input.metadata();
  const w = meta.width || MAX_WIDTH;
  const targetW = Math.min(w, MAX_WIDTH);

  await input
    .resize({ width: targetW, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 4 })
    .toFile(outWebp);

  const outMeta = await sharp(outWebp).metadata();
  return {
    src: `/photos/${path.basename(outWebp)}`,
    w: outMeta.width || targetW,
    h: outMeta.height || Math.round(targetW / 1.618), // aproximación si no viene
    stem,
  };
}

async function main(){
  if (!fs.existsSync(IN_DIR)){
    console.error(`❌ No existe la carpeta de entrada: ${IN_DIR}`);
    process.exit(1);
  }
  await ensureDir(OUT_DIR);

  const files = await walk(IN_DIR);
  if (!files.length){
    console.warn(`⚠️ No se encontraron imágenes en ${IN_DIR}`);
    return;
  }
  console.log(`🔧 Procesando ${files.length} imagen(es) → ${OUT_DIR} (maxWidth=${MAX_WIDTH}, quality=${QUALITY})`);

  for (const f of files){
    try{
      const r = await processImage(f);
      console.log(`✅ ${path.basename(f)} → ${r.src}  (${r.w}×${r.h})`);
      // Sugerencia para front-matter (cópiala al .md):
      console.log(`   front-matter: src: "${r.src}", w: ${r.w}, h: ${r.h}`);
    }catch(err){
      console.error(`❌ Error con ${f}:`, err?.message || err);
    }
  }
  console.log(`🟢 Listo. Sube los .webp y usa los w/h en tus .md de src/content/shots/`);
}
main().catch(e => { console.error(e); process.exit(1); });
