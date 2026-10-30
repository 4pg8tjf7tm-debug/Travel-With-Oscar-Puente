import { BAZAR_PRODUCTS, BAZAR_SECTIONS, type BazarSectionId } from '../bazar';
import type { Rect } from '../geometry';
import { MapBuilder, R } from './builder';
import type { MapDef, MarketSection, NpcSeat } from './types';

/**
 * CHINATOWN — «Bazar Mil Cosas» (una sola planta, edificio propio)
 * Planta x 0–2300, y 0–1500. Un bazar/multiprecio de artículos variados:
 *  - Pared norte: paneles perforados con herramientas, ferretería, jardinería y limpieza.
 *  - Centro: 3 filas × 4 góndolas de madera de dos caras, con pasillos transversales
 *    entre cada góndola (rutas alternativas por todo el local).
 *  - Pared oeste: percheros de textiles y disfraces.
 *  - Sur: mostrador de caja, cola y salida de emergencia en la pared este.
 * Cada cara accesible es una estación con sus artículos.
 */
export const BAZAR = {
  W: 2300,
  H: 1500,
  OUTLINE: [{ x: 0, y: 0 }, { x: 2300, y: 0 }, { x: 2300, y: 1500 }, { x: 0, y: 1500 }],
};

export function buildBazar(): MapDef {
  const b = new MapBuilder();
  const K = 'bazar';
  const npcs: NpcSeat[] = [];
  const W = BAZAR.W, H = BAZAR.H;

  b.hwall(K, 0, W, 0, 56, { kind: 'hull' });
  b.hwall(K, 0, W, H - 20, 20, { kind: 'hull', face: false });
  b.vwall(K, 0, 56, H - 20, 18, { kind: 'hull' });
  b.vwall(K, W - 18, 56, H - 20, 18, { kind: 'hull' });

  b.room('paredes', 'Paneles de pared', K, R(18, 56, W - 36, 250), 'wood', 'warm', '#ffb347', 'z_paneles');
  b.room('gondolas', 'Góndolas', K, R(18, 306, W - 36, 760), 'wood', 'warm', '#ffd166', 'z_gondolas');
  b.room('caja', 'Caja', K, R(18, 1066, W - 36, H - 1086), 'terrazzo', 'warm', '#ff8a3d', 'z_caja');

  const shelves: { station: string; section: string; products: string[] }[] = [];
  const bySection = (s: BazarSectionId) => BAZAR_PRODUCTS.filter((p) => p.section === s).map((p) => p.id);
  const secRects = new Map<string, Rect[]>();
  const addRect = (sec: string, r: Rect) => { const a = secRects.get(sec) ?? []; a.push(r); secRects.set(sec, a); };
  const secName = (s: string) => BAZAR_SECTIONS.find((x) => x.id === s)!.name;

  // ---------------- Paneles perforados (pared norte): dos por sección ----------------
  const wallSecs: BazarSectionId[] = ['bz_herramientas', 'bz_ferreteria', 'bz_jardineria', 'bz_limpieza'];
  const PW = 250;
  wallSecs.forEach((sec, si) => {
    const ids = bySection(sec);
    const half = Math.ceil(ids.length / 2);
    for (let k = 0; k < 2; k++) {
      const x = 90 + (si * 2 + k) * (PW + 20);
      const part = ids.slice(k * half, (k + 1) * half);
      b.prop(K, 'pegboard', x, 86, PW, 40, 86, { variant: si, label: JSON.stringify({ s: part, sec }) });
      const id = `bz_w${si}${k}`;
      b.st(id, K, x + PW / 2, 176, 'shelf', `${secName(sec)} (${k ? 'derecha' : 'izquierda'})`, { range: 96 });
      shelves.push({ station: id, section: sec, products: part });
      addRect(sec, R(x, 56, PW, 150));
    }
  });

  // ---------------- Góndolas de madera: 3 filas × 4, dos caras ----------------
  const cols = [120, 620, 1120, 1620];
  const rows = [400, 660, 920];
  const UW = 440, UD = 50, UH = 84;
  const gondolaSecs: BazarSectionId[] = ['bz_papeleria', 'bz_organizacion', 'bz_decoracion', 'bz_fiestas', 'bz_juguetes', 'bz_electronica', 'bz_cocina', 'bz_regalos'];
  const pools = gondolaSecs.map((s) => ({ s, ids: bySection(s) }));
  const faces: { x: number; y: number; face: 'n' | 's'; unit: number; ux: number; uy: number }[] = [];
  rows.forEach((ry, ri) => cols.forEach((ux, ui) => {
    b.prop(K, 'bazarShelf', ux, ry, UW, UD, UH, { variant: ri * 4 + ui });
    for (const face of ['n', 's'] as const) faces.push({ x: ux + UW / 2, y: face === 'n' ? ry - 58 - 30 : ry + UD + 30, face, unit: ri * 4 + ui, ux, uy: ry });
  }));
  // Reparto proporcional de caras por sección, en orden de recorrido (24 caras).
  let fi = 0;
  pools.forEach((pool, pi) => {
    const left = faces.length - fi;
    const remaining = pools.slice(pi).reduce((a, p) => a + p.ids.length, 0);
    const nf = pi === pools.length - 1 ? left : Math.max(1, Math.round((pool.ids.length / remaining) * left));
    const per = Math.ceil(pool.ids.length / nf);
    for (let k = 0; k < nf; k++) {
      const f = faces[fi++];
      const ids = pool.ids.slice(k * per, (k + 1) * per);
      if (!ids.length) continue;
      const id = `bz_g${f.unit + 1}${f.face}`;
      b.st(id, K, Math.round(f.x), f.y, 'shelf', `${secName(pool.s)} · cara ${f.face === 'n' ? 'norte' : 'sur'}`, { range: 110 });
      shelves.push({ station: id, section: pool.s, products: ids });
      addRect(pool.s, R(f.ux, f.face === 'n' ? f.y - 40 : f.y - 60, UW, 100));
    }
  });
  // Cada góndola muestra en su dibujo los artículos de sus dos caras.
  for (const sp of b.props.filter((p) => p.kind === 'bazarShelf')) {
    const fs: { n: string[]; s: string[] } = { n: [], s: [] };
    for (const sh of shelves) {
      const st = b.stations.find((x) => x.id === sh.station)!;
      if (st.x < sp.rect.x || st.x > sp.rect.x + sp.rect.w) continue;
      if (Math.abs(st.y - (sp.rect.y - 88)) < 4) fs.n.push(...sh.products);
      if (Math.abs(st.y - (sp.rect.y + sp.rect.h + 30)) < 4) fs.s.push(...sh.products);
    }
    sp.label = JSON.stringify(fs);
  }

  // ---------------- Percheros de pared oeste y este: textiles y disfraces ----------------
  const rackSecs: [BazarSectionId, number][] = [['bz_textil', 2160], ['bz_disfraces', 2160]];
  rackSecs.forEach(([sec, x], i) => {
    const ids = bySection(sec);
    const y = i === 0 ? 360 : 700;
    b.prop(K, 'clothesRack', x, y, 100, 230, 70, { variant: i, label: JSON.stringify({ s: ids, sec }) });
    const id = `bz_r${i}`;
    b.st(id, K, x - 40, y + 115, 'shelf', `${secName(sec)} (perchero)`, { range: 110 });
    shelves.push({ station: id, section: sec, products: ids });
    addRect(sec, R(x - 80, y, 180, 230));
  });

  // Carteles de sección colgados (planos, sin colisión)
  for (const [sec, rects] of secRects) {
    const r0 = rects[0];
    b.prop(K, 'sectionSign', r0.x + 10, r0.y + (sec.startsWith('bz_herr') || sec.startsWith('bz_ferr') || sec.startsWith('bz_jard') || sec.startsWith('bz_limp') ? 0 : 10), 120, 4, 0, { solid: false, flat: true, label: sec });
  }

  // ---------------- Caja, cola y salida ----------------
  b.prop(K, 'cashDesk', 1020, 1230, 260, 60, 44, { anim: 'screen', label: 'abierta' });
  b.st('checkout', K, 1150, 1196, 'checkout', 'Caja: entregar el artículo', { range: 90 });
  b.prop(K, 'queueLine', 390, 1150, 600, 40, 0, { solid: false, flat: true });
  b.prop(K, 'basketStack', 120, 1380, 60, 40, 40);
  b.prop(K, 'plant', 2230, 1110, 34, 34, 56);
  b.prop(K, 'plant', 30, 1110, 34, 34, 56);
  b.prop(K, 'exitDoor', W - 18, 1260, 18, 110, 0, { solid: false, flat: true, label: 'salida' });
  b.prop(K, 'entranceDoor', 1020, H - 20, 260, 20, 0, { solid: false, flat: true });
  b.prop(K, 'promoStand', 1820, 1170, 120, 70, 40, { label: 'bazar' });
  npcs.push({ id: 'n_dependienta', level: K, x: 1150, y: 1320, facing: -1, pose: 'stand', act: 'talk' });

  const queue = Array.from({ length: 12 }, (_, i) => ({ x: 960 - i * 50, y: 1170 }));
  const sections: MarketSection[] = [...secRects].map(([sec, rects]) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const r of rects) { x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y); x1 = Math.max(x1, r.x + r.w); y1 = Math.max(y1, r.y + r.h); }
    const meta = BAZAR_SECTIONS.find((s) => s.id === sec)!;
    return { id: sec, name: meta.name, rect: R(x0, y0, x1 - x0, y1 - y0), icon: meta.icon };
  });
  sections.push({ id: 'caja', name: 'Caja', rect: R(320, 1120, 1000, 260), icon: 'cart' });

  return b.finish({
    id: 'bazar',
    name: 'Chinatown · Bazar Mil Cosas',
    levels: [{ id: K, name: 'Planta', index: 0, bounds: R(-200, -200, W + 400, H + 400), outline: [BAZAR.OUTLINE] }],
    vents: [],
    escapistLinks: [],
    cameras: [],
    zones: [{ id: 'z_paneles', name: 'Paneles de pared', level: K }, { id: 'z_gondolas', name: 'Góndolas', level: K }, { id: 'z_caja', name: 'Caja', level: K }],
    doorGroups: [], interference: [], sabotages: [], tasks: [], npcs,
    spawn: [0, 1, 2, 3, 4, 5].flatMap((k) => [{ level: K, x: 680 + k * 80, y: 1420 }, { level: K, x: 720 + k * 80, y: 1460 }]),
    safePoints: [],
    meetingRoom: 'caja',
    texts: {
      vehicle: 'Bazar Mil Cosas', short: 'CHINATOWN', description: 'Bazar de una planta con paneles de herramientas, góndolas de madera, percheros y caja.',
      routes: 'Pasillo de paneles, pasillos transversales entre góndolas y la zona de caja.',
      arrivalTitle: '', arrivalText: '', murderTitle: '', murderText: '', accessGoal: '', approach: '',
      ejectText: 'La salida del bazar se abre y…',
    },
    critTimeScale: 1,
    theme: {
      scenery: 'city', bg: '#4a3b35', hull: '#c97b4a', hullDark: '#8a4f2c', trim: '#2a9d8f',
      wallTop: '#4a2f22', wallFace: '#f2e3cf', wallFaceDark: '#d8c3a5', accent: '#2a9d8f', metal: '#b8c0cc',
    },
    market: { checkout: 'checkout', queue, scanPoint: { x: 1150, y: 1196 }, exitDoor: { x: W - 40, y: 1315 }, sections, shelves },
  });
}
