import { describe, expect, it } from 'vitest';
import { BAZAR_PRODUCTS, BAZAR_SECTIONS, PURPOSES, PURPOSE_BY_ID } from '../src/shared/bazar';
import { pointInPolygon } from '../src/shared/geometry';
import { getMap, getRuntime, isShop, modeOf } from '../src/shared/maps';
import { ALL_OPEN, PLAYER_RADIUS } from '../src/shared/maps/runtime';
import { PRODUCT_BY_ID, productsFor } from '../src/shared/market';
import { Rng } from '../src/shared/rng';
import { defaultSettings, knifeParams, validateSettings } from '../src/shared/settings';
import { generateKnifeChain, KNIFE_TEMPLATES, knifeSignature, validKnifeSequence } from '../src/server/game/knife';
import { Room } from '../src/server/room/Room';
import { makeGame, startExploration, teleportTo, Harness } from './helpers';

const imp = (h: Harness) => [...h.game.players.values()].find((p) => p.team === 'impostor')!;
const workers = (h: Harness) => [...h.game.players.values()].filter((p) => p.team === 'worker');
function untilPhase(h: Harness, phase: string, maxMs = 400_000) {
  for (let t = 0; t < maxMs && h.game.phase !== phase && !h.game.ended; t += 100) h.advanceMs(100);
}

/** Polígono de suelo + partes de muro visibles, como en el cliente. */
function view(map: 'ship' | 'plane', x: number, y: number, r = 900) {
  const rt = getRuntime(map);
  const lv = rt.mainLevel;
  const poly = rt.visibility(lv, x, y, r, ALL_OPEN, [], 180, true);
  const spans = rt.wallSpans(lv, x, y, r, poly, ALL_OPEN);
  return { poly, spans };
}
const litByWall = (spans: { x: number; y: number; w: number; h: number }[], x: number, y: number) => spans.some((s) => x >= s.x && x <= s.x + s.w && y >= s.y && y <= s.y + s.h);

describe('visibilidad por lado del muro (capturas 1, 2 y 5)', () => {
  it('desde el comedor no se ve la cara del muro norte del salón ni de la cocina (sí la propia)', () => {
    const { spans } = view('ship', 1880, 300);
    // Cara propia del comedor (muro norte y 150–206, x 1668–2150)
    expect(litByWall(spans, 1900, 190)).toBe(true);
    // Cara del muro norte del salón (x < 1650), donde está la planta de la captura 1
    expect(litByWall(spans, 1600, 190)).toBe(false);
    // Cara del muro norte de la cocina (x > 2168)
    expect(litByWall(spans, 2300, 190)).toBe(false);
  });

  it('desde el pasillo, del muro que lo separa de las salas técnicas solo se ve la tapa, nunca su cara', () => {
    // Muro y 606–636 (cara hacia las salas de abajo); el observador está encima.
    const { spans } = view('ship', 1900, 560);
    const wallSpans = spans.filter((s) => s.y >= 600 && s.y <= 610);
    expect(wallSpans.length).toBeGreaterThan(0);
    for (const s of wallSpans) expect(s.y + s.h).toBeLessThanOrEqual(606 + 14 + 0.5);
  });

  it('desde la cubierta norte no se ve la cara interior del muro de la superestructura', () => {
    const { spans } = view('ship', 1500, 110);
    const face = spans.filter((s) => s.y + s.h > 150 + 14 + 1 && s.y < 206 && s.x < 3000 && s.x + s.w > 800);
    expect(face).toHaveLength(0);
  });

  it('el muro de enfrente de un cuarto se ilumina entero desde dentro (sin cortes en diagonal)', () => {
    const { spans } = view('ship', 1880, 400);
    for (let x = 1700; x <= 2120; x += 20) expect(litByWall(spans, x, 180)).toBe(true);
  });
});

describe('barco: superficie transitable exacta (captura 5)', () => {
  it('ningún punto fuera de la borda es transitable; el rincón de la captura es cubierta o sólido', () => {
    const def = getMap('ship');
    const rt = getRuntime('ship');
    const walk = def.levels[0].walk!;
    // Fuera de la borda (entre barandilla y casco): nunca se aparece ni se camina.
    expect(rt.insideRooms('deck', 470, 150)).toBe(false);
    // El punto de la captura: o es suelo dentro de la borda o choca con la estructura.
    const p = rt.nearestFree('deck', 690, 110);
    expect(pointInPolygon(p.x, p.y, walk)).toBe(true);
    for (const s of def.spawn) expect(pointInPolygon(s.x, s.y, walk)).toBe(true);
  });

  it('la borda baja no tapa el mar (sin masas negras sobre el agua)', () => {
    const rt = getRuntime('ship');
    expect(rt.los('deck', 300, 550, -200, 550, ALL_OPEN)).toBe(true);
  });
});

describe('cuenta 3–2–1 real', () => {
  it('tras la carga y el rol hay una fase CUENTA de 3 s con plazo del servidor, sin movimiento', () => {
    const h = makeGame('ship', 4);
    for (let i = 0; i < 300 && h.game.phase === 'INICIO'; i++) h.ticks(1);
    expect(h.game.phase).toBe('CUENTA');
    const left = h.game.phaseEnds! - h.now.t;
    expect(left).toBeGreaterThan(2900);
    expect(left).toBeLessThanOrEqual(3000);
    const p = [...h.game.players.values()][0];
    const x0 = p.x;
    h.game.onInput(p.id, { s: 1, d: [1, 1, 1, 1, 1, 1, 1, 1] } as never);
    h.advanceMs(1000);
    expect(p.x).toBe(x0);
    expect(h.game.isExploring()).toBe(false);
    h.advanceMs(2200);
    expect(h.game.phase).toBe('EXPLORACION');
  });
});

describe('rutas del cuchillo variadas', () => {
  it('todas las plantillas cumplen el grafo de prerrequisitos', () => {
    for (const list of Object.values(KNIFE_TEMPLATES)) for (const k of list) expect(validKnifeSequence(k)).toBe(true);
  });

  it.each(['ship', 'plane'] as const)('%s: al menos 50 cadenas distintas en Normal, todas válidas y sin repetir estaciones', (id) => {
    const map = getMap(id), rt = getRuntime(id);
    const s = defaultSettings();
    const sigs = new Set<string>();
    for (let i = 0; i < 3000; i++) {
      const c = generateKnifeChain(new Rng(1000 + i), map, rt, knifeParams(s.game));
      expect(c.kinds).toHaveLength(5);
      expect(validKnifeSequence(c.kinds)).toBe(true);
      expect(new Set(c.stations).size).toBe(c.stations.length);
      for (const st of c.stations) expect(rt.stations.get(st)?.kind).toBe('knife');
      sigs.add(knifeSignature(c));
    }
    expect(sigs.size).toBeGreaterThanOrEqual(50);
  });

  it('la sala evita repetir rutas recientes mientras haya alternativas', () => {
    const map = getMap('ship'), rt = getRuntime('ship');
    const p = knifeParams(defaultSettings().game);
    const recent: string[] = [];
    for (let i = 0; i < 20; i++) {
      const c = generateKnifeChain(new Rng(7), map, rt, p, recent);
      const sig = knifeSignature(c);
      expect(recent).not.toContain(sig);
      recent.push(sig);
    }
  });

  it('la dificultad sigue controlando la longitud (3/5/7)', () => {
    const map = getMap('plane'), rt = getRuntime('plane');
    for (const [kd, n] of [['facil', 3], ['normal', 5], ['dificil', 7]] as const) {
      const s = defaultSettings(); s.game.knifeDifficulty = kd;
      expect(generateKnifeChain(new Rng(3), map, rt, knifeParams(s.game)).kinds).toHaveLength(n);
    }
  });
});

describe('Chinatown: catálogo y mapa propio', () => {
  it('100 propósitos únicos y al menos 120 artículos distintos, todos en una estantería del bazar', () => {
    expect(PURPOSES).toHaveLength(100);
    expect(new Set(PURPOSES.map((p) => p.name)).size).toBe(100);
    expect(BAZAR_PRODUCTS.length).toBeGreaterThanOrEqual(120);
    expect(new Set(BAZAR_PRODUCTS.map((p) => p.name)).size).toBe(BAZAR_PRODUCTS.length);
    expect(BAZAR_SECTIONS).toHaveLength(14);
    for (const s of BAZAR_SECTIONS) expect(BAZAR_PRODUCTS.filter((p) => p.section === s.id).length).toBeGreaterThanOrEqual(8);
    const placed = new Set(getMap('bazar').market!.shelves.flatMap((s) => s.products));
    for (const p of productsFor('bazar')) expect(placed.has(p.id)).toBe(true);
    // Ningún alimento del súper en el bazar ni al revés
    for (const id of placed) expect(id.startsWith('b_')).toBe(true);
    for (const id of getMap('market').market!.shelves.flatMap((s) => s.products)) expect(id.startsWith('b_')).toBe(false);
  });

  it('modo y mapa: el bazar es Chinatown, un modo de compra, y la validación exige su mapa', () => {
    expect(modeOf('bazar')).toBe('chinatown');
    expect(isShop('chinatown')).toBe(true);
    const s = defaultSettings(); s.mode = 'chinatown';
    expect(validateSettings(s, 4, getMap('market')).some((i) => i.field === 'map')).toBe(true);
    expect(validateSettings(s, 4, getMap('bazar')).length).toBe(0);
  });

  it('cambiar de modo en la sala elige el bazar', () => {
    const r = new Room('ABCDE', false, { mapId: 'ship', maxPlayers: 8, preset: 'equilibrado' }, () => {});
    r.hostId = 'h';
    try {
      expect(r.onSettings('h', null, undefined, 'chinatown')).toBeNull();
      expect(r.mapId).toBe('bazar');
      expect(r.settings.mode).toBe('chinatown');
      expect(r.onSettings('h', null, 'market' as never)).toBe('Ese mapa no pertenece al modo elegido.');
    } finally { r.destroy(); }
  });
});

describe('Chinatown: privacidad y rondas', () => {
  const pick = (h: Harness, pid: string, product: string) => {
    const sh = h.game.map.market!.shelves.find((s) => s.products.includes(product))!;
    teleportTo(h, pid, sh.station);
    return h.act(pid, { k: 'pick', st: sh.station, product });
  };
  const deliver = (h: Harness, pid: string) => { teleportTo(h, pid, 'checkout'); return h.act(pid, { k: 'deliver', st: 'checkout' }); };

  it('todos los trabajadores reciben el mismo propósito; el impostor nunca; sin especialidades, cuchillo ni sabotajes', () => {
    const h = makeGame('bazar', 6, (s) => { s.mode = 'chinatown'; });
    startExploration(h);
    expect(h.game.mode).toBe('chinatown');
    expect(h.game.phase).toBe('COMPRA');
    const goal = PURPOSE_BY_ID[h.game.market!.dish];
    expect(goal).toBeTruthy();
    expect(new Set(workers(h).map((w) => h.priv.get(w.id)!.market!.dish))).toEqual(new Set([goal.name]));
    const i = imp(h);
    expect(h.priv.get(i.id)!.market!.dish).toBeNull();
    const toImp = JSON.stringify(h.sent.filter((s) => s.pid === i.id).map((s) => s.data));
    expect(toImp.includes(goal.name)).toBe(false);
    expect(toImp.includes(goal.id)).toBe(false);
    expect(h.game.knife).toBeNull();
    for (const p of h.game.players.values()) { expect(p.role).toBeNull(); expect(p.knife ?? null).toBeNull(); }
    expect(h.game.map.vents).toHaveLength(0);
    expect(h.game.map.sabotages).toHaveLength(0);
  });

  it('dos rondas seguidas conservan propósito e impostor, permiten cambiar de artículo y guardan el historial', () => {
    const h = makeGame('bazar', 5, (s) => { s.mode = 'chinatown'; s.game.discussionTime = 0; });
    startExploration(h);
    const goal = h.game.market!.dish, i = imp(h), ws = workers(h);
    // Cambiar de artículo antes de entregar
    expect(pick(h, ws[0].id, 'b_tijeras').ok).toBe(true);
    const sh = h.game.map.market!.shelves.find((s) => s.products.includes('b_tijeras'))!;
    teleportTo(h, ws[0].id, sh.station);
    expect(h.act(ws[0].id, { k: 'putback', st: sh.station }).ok).toBe(true);
    expect(pick(h, ws[0].id, 'b_globos').ok).toBe(true);
    for (const p of h.game.players.values()) { if (p.id !== ws[0].id) pick(h, p.id, 'b_martillo'); deliver(h, p.id); }
    untilPhase(h, 'VOTACION', 60_000);
    for (const p of h.game.alive()) h.act(p.id, { k: 'vote', target: 'skip' });
    untilPhase(h, 'COMPRA', 30_000);
    expect(h.game.market!.round).toBe(2);
    expect(h.game.market!.dish).toBe(goal);
    expect(imp(h).id).toBe(i.id);
    expect(h.game.market!.history.filter((e) => e.round === 1)).toHaveLength(5);
    expect(h.game.market!.history.find((e) => e.pid === ws[0].id)?.product).toBe('b_globos');
    // No puede repetir su propio artículo; otro sí puede coger ese tipo
    expect(pick(h, ws[0].id, 'b_globos').ok).toBe(false);
    expect(pick(h, ws[1].id, 'b_globos').ok).toBe(true);
    expect(PRODUCT_BY_ID.b_globos.name).toBe('Globos');
  });

  it('cierre exclusivo de las tiendas: con el impostor y un trabajador activo, gana el impostor', () => {
    const h = makeGame('bazar', 4, (s) => { s.mode = 'chinatown'; s.game.discussionTime = 0; });
    startExploration(h);
    const ws = workers(h);
    for (const p of h.game.players.values()) { pick(h, p.id, 'b_velas'); deliver(h, p.id); }
    untilPhase(h, 'VOTACION', 60_000);
    for (const p of h.game.alive()) h.act(p.id, { k: 'vote', target: ws[0].id });
    untilPhase(h, 'COMPRA', 30_000);
    for (const p of h.game.alive()) { pick(h, p.id, 'b_lazos'); deliver(h, p.id); }
    untilPhase(h, 'VOTACION', 60_000);
    for (const p of h.game.alive()) h.act(p.id, { k: 'vote', target: ws[1].id });
    for (let t = 0; t < 40_000 && !h.game.ended; t += 100) h.advanceMs(100);
    expect(h.game.ended).toBe(true);
    expect(h.game.result?.winner).toBe('impostor');
  });
});

describe('tiendas: catálogo correcto por mapa', () => {
  it('el súper no carga artículos de bazar en sus estanterías', () => {
    for (const sh of getMap('market').market!.shelves) for (const id of sh.products) expect(productsFor('market').some((p) => p.id === id)).toBe(true);
  });
  it('las estaciones del bazar son accesibles sin atravesar góndolas', () => {
    const rt = getRuntime('bazar');
    for (const sh of getMap('bazar').market!.shelves) {
      const st = rt.stations.get(sh.station)!;
      expect(rt.collides('bazar', st.x, st.y, PLAYER_RADIUS, ALL_OPEN)).toBe(false);
    }
  });
});
