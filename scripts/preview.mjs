/**
 * TURN EVERY TEMPLATE INTO AN HTML PREVIEW YOU CAN LOOK AT.
 *
 * CEO, 2026-09-25: *"Every template has to be showing in preview inside the
 * Claude Code app so the user can confirm them and delete them. The user will
 * tell you by number which one to push and which to delete, and every template
 * has its own number, 1 2 3 4 5 6…"*
 *
 * Run it after writing templates, and commit what it makes:
 *
 *     node scripts/preview.mjs
 *
 * It reads every templates/NN-name.json and writes previews/NN-name.html, plus
 * previews/index.html listing them all by number. Open a preview to look at a
 * design; say a number to keep it or drop it.
 *
 * ── IT IS AN HONEST APPROXIMATION, NOT THE RENDER ────────────────────────
 *
 * Glowinary's own engine draws these designs twice, in a live canvas and in the
 * export, and the two match pixel for pixel. This is neither of those: it is
 * plain HTML with no dependencies, so it runs anywhere, and it shows LAYOUT,
 * COLOUR, TYPE and WHERE THE MEDIA SITS. It cannot show motion, transitions,
 * timing or the media engine's grade.
 *
 * So judge composition here and never conclude a design is finished from it.
 * The real answer is the app, after Glowinary publishes it.
 *
 * No imports beyond Node's own, on purpose: this must run in a sandbox with
 * nothing installed.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const TPL = 'templates';
const OUT = 'previews';
mkdirSync(OUT, { recursive: true });

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pc = n => `${Number(n ?? 0)}%`;

function background(bg) {
  if (!bg) return '#111';
  const cs = bg.colors?.length ? bg.colors : ['#111'];
  if (bg.type === 'gradient' && cs.length > 1) return `linear-gradient(${bg.angle ?? 160}deg, ${cs.join(', ')})`;
  if (bg.type === 'image' && bg.src) return `#000 url("${bg.src}") center/cover no-repeat`;
  return cs[0];
}

function slotHtml(sl) {
  const url = sl.sample?.url ?? sl.src ?? '';
  const kind = sl.sample?.type ?? (sl.src ? 'photo' : 'photo');
  const radius = sl.radius ? `${sl.radius}px` : '0';
  const inner = url
    ? (kind === 'video'
        ? `<video src="${esc(url)}" muted playsinline preload="metadata" style="width:100%;height:100%;object-fit:cover"></video>`
        : `<img src="${esc(url)}" alt="" style="width:100%;height:100%;object-fit:cover">`)
    : `<div style="width:100%;height:100%;display:grid;place-items:center;background:#2a2a2e;color:#888;font:600 12px system-ui">no sample</div>`;
  return `<div title="slot ${esc(sl.id)}" style="position:absolute;left:${pc(sl.x)};top:${pc(sl.y)};width:${pc(sl.w)};height:${pc(sl.h)};border-radius:${radius};overflow:hidden;transform:rotate(${sl.rotation ?? 0}deg)">${inner}</div>`;
}

function shapeHtml(sh) {
  return `<div style="position:absolute;left:${pc(sh.x)};top:${pc(sh.y)};width:${pc(sh.w)};height:${pc(sh.h)};background:${esc(sh.color ?? '#fff')};opacity:${sh.opacity ?? 1};border-radius:${sh.kind === 'ellipse' ? '50%' : `${sh.radius ?? 0}px`};transform:rotate(${sh.rotation ?? 0}deg)"></div>`;
}

function textHtml(t) {
  const align = t.align ?? 'left';
  return `<div style="position:absolute;left:${pc(t.x)};top:${pc(t.y)};width:${pc(t.w ?? 80)};color:${esc(t.color ?? '#fff')};font-family:Georgia,'Times New Roman',serif;font-size:${t.size ?? 32}px;font-weight:${t.weight ?? 400};line-height:${t.lineHeight ?? 1.15};letter-spacing:${t.tracking ?? 0}px;text-align:${align};text-transform:${t.casing === 'upper' ? 'uppercase' : 'none'};white-space:pre-wrap">${esc(t.text)}</div>`;
}

function badgeHtml(b) {
  return `<div style="position:absolute;left:${pc(b.x)};top:${pc(b.y)};padding:6px 14px;border-radius:999px;background:${esc(b.bg ?? '#fff')};color:${esc(b.color ?? '#111')};font:600 ${b.size ?? 14}px system-ui">${esc(b.text)}</div>`;
}

const files = readdirSync(TPL).filter(f => f.endsWith('.json')).sort();
if (!files.length) { console.log('No templates yet.'); process.exit(0); }

const cards = [];
for (const file of files) {
  let row;
  try { row = JSON.parse(readFileSync(join(TPL, file), 'utf8')); }
  catch { console.log(`skip ${file}: not valid JSON`); continue; }

  const cfg = row.config ?? {};
  const w = cfg.width ?? 1080, h = cfg.height ?? 1350;
  /* The number is the file's own prefix, so it never drifts from the name the
     CEO says back. */
  const number = (file.match(/^(\d+)/) ?? [])[1] ?? '?';

  const layers = [
    ...(cfg.shapes ?? []).map(shapeHtml),
    ...(cfg.mediaSlots ?? []).map(slotHtml),
    ...(cfg.texts ?? []).map(textHtml),
    ...(cfg.badges ?? []).map(badgeHtml),
  ].join('\n');

  const page = `<!doctype html><meta charset="utf-8"><title>${esc(number)} · ${esc(row.name)}</title>
<body style="margin:0;background:#0e0e10;color:#eee;font:14px/1.5 system-ui;display:grid;place-items:center;min-height:100vh;padding:24px">
<div>
  <p style="margin:0 0 4px;font-size:22px;font-weight:700">${esc(number)} · ${esc(row.name)}</p>
  <p style="margin:0 0 16px;color:#999">${esc(row.format)} · ${esc(row.media_type)} · ${w}×${h}</p>
  <div style="position:relative;width:${Math.round(360)}px;height:${Math.round(360 * h / w)}px;background:${background(cfg.background)};overflow:hidden;border-radius:14px;box-shadow:0 10px 40px rgba(0,0,0,.6)">
    <div style="position:absolute;inset:0;transform-origin:top left;transform:scale(${(360 / w).toFixed(5)});width:${w}px;height:${h}px">
      ${layers}
    </div>
  </div>
  <p style="margin:14px 0 0;color:#777;max-width:360px">Layout, colour, type and where the media sits. Motion, transitions and timing are not shown, and the real render is the app.</p>
</div>`;
  writeFileSync(join(OUT, file.replace(/\.json$/, '.html')), page);
  cards.push({ number, name: row.name, file: file.replace(/\.json$/, '.html'), format: row.format });
  console.log(`preview ${number} · ${row.name}`);
}

const index = `<!doctype html><meta charset="utf-8"><title>Templates</title>
<body style="margin:0;background:#0e0e10;color:#eee;font:14px/1.6 system-ui;padding:28px">
<h1 style="font-size:20px">Templates waiting for a decision</h1>
<p style="color:#999">Say the number to keep or to delete.</p>
<ol style="padding-left:20px">
${cards.map(c => `<li style="margin:6px 0"><a href="./${c.file}" style="color:#7dd3fc">${esc(c.name)}</a> <span style="color:#777">· ${esc(c.format)}</span></li>`).join('\n')}
</ol>`;
writeFileSync(join(OUT, 'index.html'), index);
console.log(`\n${cards.length} preview(s) in ${OUT}/. Open previews/index.html.`);
