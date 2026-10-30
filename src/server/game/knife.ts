import { dist2 } from '../../shared/geometry';
import type { KnifeStageKind, MapDef } from '../../shared/maps/types';
import { MapRuntime } from '../../shared/maps/runtime';
import { Rng } from '../../shared/rng';

/** Minijuego de cada tipo de etapa. */
export const KNIFE_MINIGAME: Record<KnifeStageKind, string> = {
  docs: 'k_docs', search: 'k_search', tool: 'k_search', compartment: 'k_compartment', ledger: 'k_docs', keypad: 'k_keypad', auth: 'k_auth',
};

/**
 * Plantillas de secuencia por longitud (3–7). Todas respetan el grafo de
 * prerrequisitos: la combinación sale de los documentos (y del compartimento,
 * si lo hay); el compartimento se abre con la llave o la herramienta obtenida
 * antes; el registro solo tiene sentido con dos partes de código; el teclado va
 * después de conocer el código y la autorización siempre al final.
 */
export const KNIFE_TEMPLATES: Record<number, KnifeStageKind[][]> = {
  3: [['docs', 'keypad', 'auth']],
  4: [['docs', 'search', 'keypad', 'auth'], ['search', 'docs', 'keypad', 'auth'], ['docs', 'tool', 'keypad', 'auth'], ['tool', 'docs', 'keypad', 'auth']],
  5: [
    ['docs', 'search', 'compartment', 'keypad', 'auth'], ['search', 'docs', 'compartment', 'keypad', 'auth'],
    ['docs', 'tool', 'compartment', 'keypad', 'auth'], ['tool', 'docs', 'compartment', 'keypad', 'auth'],
    ['search', 'compartment', 'docs', 'keypad', 'auth'],
  ],
  6: [
    ['docs', 'search', 'compartment', 'ledger', 'keypad', 'auth'], ['search', 'docs', 'compartment', 'ledger', 'keypad', 'auth'],
    ['docs', 'tool', 'compartment', 'ledger', 'keypad', 'auth'], ['search', 'compartment', 'docs', 'ledger', 'keypad', 'auth'],
  ],
  7: [
    ['docs', 'search', 'tool', 'compartment', 'ledger', 'keypad', 'auth'], ['search', 'docs', 'tool', 'compartment', 'ledger', 'keypad', 'auth'],
    ['docs', 'tool', 'search', 'compartment', 'ledger', 'keypad', 'auth'], ['search', 'tool', 'docs', 'compartment', 'ledger', 'keypad', 'auth'],
  ],
};

/** Secuencia por defecto (primera plantilla) para una longitud. */
export function knifeSequence(n: number): KnifeStageKind[] {
  return KNIFE_TEMPLATES[Math.max(3, Math.min(7, Math.round(n)))][0];
}

/** Comprueba el grafo de prerrequisitos de una secuencia. */
export function validKnifeSequence(k: KnifeStageKind[]): boolean {
  const at = (x: KnifeStageKind) => k.indexOf(x);
  if (k[k.length - 1] !== 'auth' || at('docs') < 0 || at('keypad') < 0) return false;
  if (at('keypad') < at('docs')) return false;
  if (at('compartment') >= 0) {
    if (at('keypad') < at('compartment')) return false;
    if (at('search') < 0 && at('tool') < 0) return false;
    const opener = Math.min(...['search', 'tool'].map((x) => at(x as KnifeStageKind)).filter((i) => i >= 0));
    if (opener > at('compartment')) return false;
  }
  if (at('ledger') >= 0 && (at('compartment') < 0 || at('ledger') < at('compartment') || at('ledger') > at('keypad'))) return false;
  return new Set(k).size === k.length;
}

/** Firma de una ruta (secuencia + lugares): sirve para no repetir rutas recientes en la sala. */
export function knifeSignature(c: { kinds: KnifeStageKind[]; stations: string[] }): string {
  return c.kinds.map((k, i) => `${k}@${c.stations[i]}`).join('>');
}

export interface KnifeChain {
  kinds: KnifeStageKind[];
  /** Estación correcta de cada etapa. */
  stations: string[];
  /** Lugares plausibles indicados en cada etapa (incluye la correcta; con ayuda 3, también un señuelo). */
  options: string[][];
  codeA: string;
  codeB: string;
  /** El registro indica que la combinación empieza por la parte del compartimento. */
  swap: boolean;
  help: number;
  /** Código completo que acepta el teclado. */
  code: string;
}

/**
 * Genera la cadena secreta a partir de la plantilla del mapa activo y la
 * dificultad: número de etapas, claridad de pistas y dispersión del recorrido.
 * Solo usa estaciones existentes en este mapa.
 */
export function generateKnifeChain(rng: Rng, map: MapDef, rt: MapRuntime, p: { stages: number; help: number; spread: number }, avoid: string[] = []): KnifeChain {
  // Se prueban varias rutas y se descarta cualquiera que esté en la memoria reciente de la sala.
  // Si todas las variantes recientes están agotadas, se acepta la menos reciente posible.
  let best: KnifeChain | null = null, bestAge = -1;
  for (let attempt = 0; attempt < 40; attempt++) {
    const c = buildKnifeChain(rng, map, rt, p);
    const idx = avoid.indexOf(knifeSignature(c));
    if (idx < 0) return c;
    // `avoid` va de más antigua a más reciente: cuanto menor el índice, más antigua.
    const age = avoid.length - idx;
    if (age > bestAge) { best = c; bestAge = age; }
  }
  return best!;
}

function buildKnifeChain(rng: Rng, map: MapDef, rt: MapRuntime, p: { stages: number; help: number; spread: number }): KnifeChain {
  const tpl = map.knife;
  if (!tpl) throw new Error('Mapa sin plantilla de cuchillo');
  const n = Math.max(3, Math.min(7, Math.round(p.stages)));
  const kinds = rng.pick(KNIFE_TEMPLATES[n].filter((k) => k.every((x) => tpl.pools[x].length > 0)));
  const stations: string[] = [];
  const options: string[][] = [];
  const used = new Set<string>();
  // El punto de partida de la investigación cambia: cualquier aparición del mapa.
  let prev = rng.pick(map.spawn);
  for (const kind of kinds) {
    const pool = tpl.pools[kind].filter((s) => !used.has(s));
    if (!pool.length) throw new Error(`Plantilla de cuchillo sin candidatos para ${kind}`);
    const scored = pool.map((sid) => { const s = rt.stations.get(sid)!; return { sid, d: dist2(s.x, s.y, prev.x, prev.y) }; }).sort((a, b) => a.d - b.d);
    // La dispersión inclina la elección (cerca / indiferente / lejos) sin volverla fija.
    let pick: string;
    const half = Math.max(Math.min(2, scored.length), Math.ceil(scored.length * 0.6));
    if (p.spread <= 1) pick = rng.pick(scored.slice(0, half)).sid;
    else if (p.spread >= 3) pick = rng.pick(scored.slice(scored.length - half)).sid;
    else pick = rng.pick(pool);
    stations.push(pick);
    used.add(pick);
    const opts = [pick];
    if (p.help >= 3 && kind !== 'auth') {
      // Señuelo plausible de otro tipo de etapa o del mismo, en otra sala.
      const pickRoom = rt.roomAt(rt.stations.get(pick)!.level, rt.stations.get(pick)!.x, rt.stations.get(pick)!.y)?.id;
      const decoys = rng.shuffle(Object.values(tpl.pools).flat().filter((s) => !used.has(s) && s !== pick && rt.roomAt(rt.stations.get(s)!.level, rt.stations.get(s)!.x, rt.stations.get(s)!.y)?.id !== pickRoom));
      if (decoys.length) opts.push(decoys[0]);
    }
    options.push(rng.shuffle(opts));
    const ps = rt.stations.get(pick)!;
    prev = { level: ps.level, x: ps.x, y: ps.y };
  }
  const codeA = String(rng.int(10, 99));
  const codeB = String(rng.int(10, 99));
  const hasLedger = kinds.includes('ledger');
  const swap = hasLedger ? rng.next() < 0.5 : false;
  const hasCompartment = kinds.includes('compartment');
  const code = hasCompartment ? (swap ? codeB + codeA : codeA + codeB) : codeA + codeB;
  return { kinds, stations, options, codeA, codeB, swap, help: p.help, code };
}

/** Texto de la pista y destinos que el impostor ya puede conocer (nunca coordenadas con ayuda 3). */
export function describePlace(map: MapDef, rt: MapRuntime, stationIds: string[], help: number): { text: string; hints: { id: string; name: string; level: string; x: number; y: number }[] } {
  const parts: string[] = [];
  const hints: { id: string; name: string; level: string; x: number; y: number }[] = [];
  for (const sid of stationIds) {
    const s = rt.stations.get(sid)!;
    const room = rt.roomAt(s.level, s.x, s.y);
    if (help <= 1) {
      parts.push(`${s.name} (${room?.name ?? 'zona'})`);
      hints.push({ id: sid, name: s.name, level: s.level, x: s.x, y: s.y });
    } else if (help === 2) {
      parts.push(`algún lugar de ${room?.name ?? 'la zona'}`);
      const c = room ? { x: room.rect.x + room.rect.w / 2, y: room.rect.y + room.rect.h / 2 } : { x: s.x, y: s.y };
      hints.push({ id: sid, name: room?.name ?? s.name, level: s.level, x: c.x, y: c.y });
    } else {
      parts.push(`${room?.name ?? 'una sala'}`);
    }
  }
  void map;
  return { text: help >= 3 ? `en ${parts.join(' o en ')} (solo uno es el bueno)` : parts.join(' o '), hints };
}

/** Descripción de cada etapa para el panel privado del impostor. */
export function stageLabel(kind: KnifeStageKind, tpl: NonNullable<MapDef['knife']>, chain: KnifeChain): string {
  switch (kind) {
    case 'docs': return chain.kinds.includes('compartment') ? `Lee ${tpl.docName} (primeros dígitos)` : `Lee ${tpl.docName} (combinación completa)`;
    case 'search': return `Encuentra ${tpl.keyName}`;
    case 'tool': return `Consigue ${tpl.toolName}`;
    case 'compartment': return `Abre ${tpl.compartmentName} (últimos dígitos)`;
    case 'ledger': return `Consulta ${tpl.ledgerName} (orden de la combinación)`;
    case 'keypad': return `Abre ${tpl.containerName} y coge el cuchillo`;
    case 'auth': return `Manipula ${tpl.authName}`;
  }
}
