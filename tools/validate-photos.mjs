import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = 'src/content/shots';
const PUBLIC_DIR = 'public';

const WRITE = process.argv.includes('--write');
const MD_RE = /\.md$/i;

function listMd(dir) {
  return fs.readdirSync(dir).filter((f) => MD_RE.test(f)).map((f) => path.join(dir, f));
}

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function extractSrc(yaml) {
  // Busca línea src: "...", tolerante a comillas y espacios
  const m = yaml.match(/^\s*src:\s*["']?(.+?)["']?\s*$/m);
  return m ? m[1] : null;
}

function replaceSrc(content, newSrc) {
  return content.replace(/^\s*src:\s*["']?.+?["']?\s*$/m, `src: "${newSrc}"`);
}

function existsPublic(p) {
  return fs.existsSync(path.join(PUBLIC_DIR, p.replace(/^\//, '')));
}

function candidateWebp(p) {
  return p.replace(/\.(jpe?g|png|tiff?)$/i, '.webp');
}

function isPhotosPath(p) {
  return /^\/photos\//i.test(p);
}

function hasAccentsOrSpaces(p) {
  return /[^\x00-\x7F]|[ ]/.test(p);
}

async function main() {
  const files = listMd(CONTENT_DIR);
  let errors = 0, fixed = 0, ok = 0;
  for (const file of files) {
    const raw = read(file);

    // Coge solo el front-matter (antes de la primera línea fuera de --- … ---)
    const m = raw.match(/^---\s*[\s\S]*?---/);
    if (!m) { console.log(`⚠️  ${file}: sin front-matter`); errors++; continue; }
    const fm = m[0];

    let src = extractSrc(fm);
    if (!src) { console.log(`❌ ${file}: no tiene campo src:`); errors++; continue; }

    // Normaliza ruta
    src = src.trim();

    // Debe empezar por /photos/
    if (!isPhotosPath(src)) {
      console.log(`❌ ${file}: src no empieza por /photos/ → "${src}"`);
      errors++;
      continue;
    }

    // Existe?
    if (existsPublic(src)) {
      // Avisos por nombre raro
      if (hasAccentsOrSpaces(src)) {
        console.log(`⚠️  ${file}: src con espacios/acentos → "${src}" (mejor renombrar a kebab-case)`);
      }
      ok++;
      continue;
    }

    // No existe: probamos con .webp
    const webp = candidateWebp(src);
    if (webp !== src && existsPublic(webp)) {
      if (WRITE) {
        const next = replaceSrc(raw, webp);
        await fsp.writeFile(file, next, 'utf8');
        console.log(`✅ ${file}: src corregido a .webp → ${webp}`);
        fixed++;
      } else {
        console.log(`🟡 ${file}: falta ${src} pero existe ${webp} → añade --write para auto-fijar`);
        errors++;
      }
      continue;
    }

    console.log(`❌ ${file}: no existe el archivo referenciado (${src}).`);
    errors++;
  }

  console.log(`\nResumen → OK: ${ok} · Arreglados: ${fixed} · Pendientes: ${errors}`);
  if (!WRITE && errors) {
    console.log('Vuelve a ejecutar con "--write" para auto-corregir extensiones .jpg/.png → .webp');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
