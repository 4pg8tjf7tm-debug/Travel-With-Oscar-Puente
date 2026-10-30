import { COLORS } from '../../shared/constants';
import type { MapId } from '../../shared/maps/types';
import type { EndResult } from '../../shared/protocol';
import { fillStroke, makeCanvas, rr, vgrad } from '../art/draw';
import { INK } from '../art/palette';
import { audio } from '../audio/Audio';
import { store } from '../state';
import type { App } from './App';
import { h, uiRoot } from './dom';
import { portrait } from './Portrait';

const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
/** Progreso local de un tramo [a, b] de la secuencia. */
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/** Sprites laterales de los mapas (se pintan una vez y luego solo se transforman). */
function vehicle(map: MapId): HTMLCanvasElement {
  if (map === 'ship') {
    const c = makeCanvas(620, 230); const g = c.getContext('2d')!; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(10, 130); g.lineTo(610, 130); g.lineTo(550, 214); g.lineTo(70, 214); g.closePath(); fillStroke(g, '#20375c', INK, 3);
    g.fillStyle = '#e63946'; g.fillRect(48, 190, 520, 9);
    rr(g, 100, 70, 380, 62, 8); fillStroke(g, '#f1ede4', INK, 3);
    for (let k = 0; k < 11; k++) { g.beginPath(); g.arc(130 + k * 32, 100, 9, 0, Math.PI * 2); fillStroke(g, '#5fa8d3', INK, 1.5); }
    rr(g, 370, 30, 50, 42, 5); fillStroke(g, '#d62828', INK, 3);
    return c;
  }
  if (map === 'bazar') {
    const c = makeCanvas(620, 260); const g = c.getContext('2d')!; g.lineJoin = 'round';
    rr(g, 20, 40, 580, 200, 6); fillStroke(g, '#c97b4a', INK, 3);
    for (let x = 40; x < 580; x += 40) { g.fillStyle = (x / 40) % 2 ? '#2a9d8f' : '#f8f3e8'; g.fillRect(x, 40, 40, 30); }
    g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(40, 40, 540, 30);
    rr(g, 60, 120, 140, 100, 4); fillStroke(g, 'rgba(170,220,255,0.9)', INK, 3);
    rr(g, 420, 120, 140, 100, 4); fillStroke(g, 'rgba(170,220,255,0.9)', INK, 3);
    for (let i = 0; i < 8; i++) { g.fillStyle = ['#ff8fab', '#ffd23f', '#5cc8ff', '#3ddc97'][i % 4]; g.fillRect(72 + (i % 4) * 30, 150 + Math.floor(i / 4) * 34, 20, 20); g.fillRect(432 + (i % 4) * 30, 150 + Math.floor(i / 4) * 34, 20, 20); }
    rr(g, 250, 120, 120, 120, 4); fillStroke(g, 'rgba(190,225,250,0.9)', INK, 3);
    g.fillStyle = INK; g.fillRect(308, 120, 4, 120);
    g.font = '900 30px "Baloo 2", sans-serif'; g.textAlign = 'center'; g.fillStyle = '#264653'; g.fillText('BAZAR MIL COSAS', 310, 106);
    return c;
  }
  if (map === 'market') {
    const c = makeCanvas(620, 260); const g = c.getContext('2d')!; g.lineJoin = 'round';
    rr(g, 20, 40, 580, 200, 6); fillStroke(g, '#e8e2d6', INK, 3);
    for (let x = 40; x < 580; x += 40) { g.fillStyle = (x / 40) % 2 ? '#e63946' : '#f8f3e8'; g.fillRect(x, 40, 40, 30); }
    g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(40, 40, 540, 30);
    rr(g, 230, 120, 160, 120, 4); fillStroke(g, 'rgba(170,220,255,0.9)', INK, 3);
    g.fillStyle = INK; g.fillRect(308, 120, 4, 120);
    g.font = '900 30px "Baloo 2", sans-serif'; g.textAlign = 'center'; g.fillStyle = '#20375c'; g.fillText('EL CARRITO', 310, 106);
    return c;
  }
  const c = makeCanvas(600, 220); const g = c.getContext('2d')!; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(250, 110); g.lineTo(380, 10); g.lineTo(420, 10); g.lineTo(350, 110); g.closePath(); fillStroke(g, '#c3ccd8', INK, 3);
  rr(g, 10, 90, 560, 68, 34); fillStroke(g, vgrad(g, 90, 158, '#ffffff', '#c9d2de'), INK, 3);
  g.beginPath(); g.moveTo(480, 94); g.lineTo(570, 24); g.lineTo(590, 24); g.lineTo(565, 104); g.closePath(); fillStroke(g, '#2f6fb3', INK, 3);
  for (let k = 0; k < 18; k++) { rr(g, 110 + k * 20, 106, 10, 13, 4); fillStroke(g, '#2f4f75', INK, 1); }
  g.fillStyle = '#2f6fb3'; g.fillRect(16, 136, 548, 6);
  g.beginPath(); g.moveTo(250, 150); g.lineTo(330, 200); g.lineTo(370, 200); g.lineTo(330, 150); g.closePath(); fillStroke(g, '#c3ccd8', INK, 3);
  return c;
}

function bgPaint(g: CanvasRenderingContext2D, map: MapId, W: number, H: number, t: number, mood: 'happy' | 'bad' | 'calm') {
  const sky = g.createLinearGradient(0, 0, 0, H);
  if (mood === 'bad') { sky.addColorStop(0, '#2a1830'); sky.addColorStop(1, '#5a2a2a'); }
  else if (map === 'plane') { sky.addColorStop(0, '#5aa5ec'); sky.addColorStop(1, '#ffd6a5'); }
  else if (map === 'market') { sky.addColorStop(0, '#2b3a55'); sky.addColorStop(1, '#f6b38a'); }
  else { sky.addColorStop(0, '#6cb6ef'); sky.addColorStop(1, '#ffe8c2'); }
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  if (map === 'ship') { g.fillStyle = mood === 'bad' ? '#16324a' : '#1f78ad'; g.fillRect(0, H * 0.62, W, H); g.fillStyle = 'rgba(255,255,255,0.25)'; for (let i = 0; i < 30; i++) g.fillRect(((i * 97 - t * 60) % W + W) % W, H * 0.66 + (i % 6) * 22, 50, 3); }
  else if (map === 'market') {
    g.fillStyle = '#4a5563'; g.fillRect(0, H * 0.72, W, H);
    g.fillStyle = '#7a8796'; g.fillRect(0, H * 0.7, W, H * 0.04);
    g.fillStyle = 'rgba(255,255,255,0.7)'; for (let x = 40; x < W; x += 160) g.fillRect(x, H * 0.86, 80, 6);
  } else { g.fillStyle = 'rgba(255,255,255,0.7)'; for (let i = 0; i < 8; i++) { const x = ((i * 260 - t * 120) % (W + 300) + W + 300) % (W + 300) - 150; g.beginPath(); g.ellipse(x, H * (0.2 + (i % 4) * 0.18), 110, 34, 0, 0, Math.PI * 2); g.fill(); } }
}

/** Dibuja el personaje compuesto (mismo compositor que el mundo) con aplastamiento y giro. */
function drawActor(g: CanvasRenderingContext2D, who: HTMLCanvasElement, x: number, y: number, size: number, rot: number, sx: number, sy: number) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(sx, sy);
  g.drawImage(who, -size / 2, -size, size, size);
  g.restore();
}

export interface EjectActor { color: number; acc: number }

/** Plano cercano: dónde está la puerta, el suelo por el que se sale y el dispositivo cómico. */
interface CloseSet { doorX: number; doorW: number; doorTop: number; floorY: number; exitX: number }

function closeSet(map: MapId, W: number, H: number): CloseSet {
  const doorW = Math.min(150, W * 0.14);
  if (map === 'plane') return { doorX: W * 0.42, doorW: doorW * 0.85, doorTop: H * 0.33, floorY: H * 0.66, exitX: W * 0.5 };
  if (map === 'ship') return { doorX: W * 0.34, doorW, doorTop: H * 0.24, floorY: H * 0.58, exitX: W * 0.66 };
  return { doorX: W * 0.3, doorW: doorW * 1.15, doorTop: H * 0.3, floorY: H * 0.72, exitX: W * 1.1 };
}

/** Decorado del plano cercano: la puerta pertenece a su pared, su casco o su fachada. */
function paintClose(g: CanvasRenderingContext2D, map: MapId, W: number, H: number, t: number, cs: CloseSet, open: number) {
  bgPaint(g, map === 'bazar' ? 'market' : map, W, H, t, 'calm');
  const { doorX, doorW, doorTop, floorY } = cs;
  const doorH = floorY - doorTop;
  const doorL = doorX - doorW / 2;
  if (map === 'ship') {
    // Casco y cubierta: la puerta está en la superestructura, sobre la cubierta de madera.
    g.fillStyle = '#20375c'; g.beginPath(); g.moveTo(-10, floorY + 6); g.lineTo(W * 0.6, floorY + 6); g.lineTo(W * 0.54, H + 10); g.lineTo(-10, H + 10); g.closePath(); g.fill();
    g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
    g.fillStyle = '#c8323f'; g.fillRect(-10, H * 0.86, W * 0.57, 10);
    g.fillStyle = '#a77b50'; g.fillRect(-10, floorY - 4, W * 0.6, 12);
    // Barandilla de la borda, con hueco donde sale la plancha
    g.strokeStyle = '#f1ede4'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(-10, floorY - 30); g.lineTo(W * 0.5, floorY - 30); g.stroke();
    for (let x = 10; x < W * 0.5; x += 34) { g.beginPath(); g.moveTo(x, floorY - 30); g.lineTo(x, floorY - 4); g.stroke(); }
    // Superestructura con ojos de buey
    rr(g, -10, H * 0.08, W * 0.46 + 10, floorY - H * 0.08 - 4, 8); fillStroke(g, '#f1ede4', INK, 3);
    g.fillStyle = '#d8d2c4'; g.fillRect(-10, H * 0.08 + 10, W * 0.46, 8);
    for (let x = 40; x < doorL - 30; x += 70) { g.beginPath(); g.arc(x, H * 0.2, 14, 0, Math.PI * 2); fillStroke(g, '#5fa8d3', INK, 2); }
    // Espuma junto al casco
    g.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 12; i++) g.fillRect(((W * 0.55 + i * 23 - t * 40) % (W * 0.45)) + W * 0.52, H * 0.8 + (i % 3) * 6, 18, 3);
  } else if (map === 'plane') {
    // Ala detrás, fuselaje delante con su ventanilla y la puerta recortada en él.
    g.fillStyle = '#c3ccd8'; g.beginPath(); g.moveTo(W * 0.38, H * 0.6); g.lineTo(W * 1.05, H * 0.92); g.lineTo(W * 1.05, H * 1.0); g.lineTo(W * 0.3, H * 0.7); g.closePath(); fillStroke(g, '#c3ccd8', INK, 3);
    rr(g, -60, H * 0.22, W * 0.7, H * 0.52, H * 0.22); fillStroke(g, vgrad(g, H * 0.22, H * 0.74, '#ffffff', '#c9d2de'), INK, 4);
    g.fillStyle = '#2f6fb3'; g.fillRect(-50, H * 0.62, W * 0.68, 10);
    for (let x = 20; x < doorL - 26; x += 46) { rr(g, x, H * 0.36, 22, 30, 10); fillStroke(g, '#2f4f75', INK, 1.5); }
    // Viento que arrastra nubes rápidas
    g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 2;
    for (let i = 0; i < 10; i++) { const y = H * (0.1 + (i % 5) * 0.18), x = ((i * 190 - t * 900) % (W + 200) + W + 200) % (W + 200) - 100; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 70, y); g.stroke(); }
  } else {
    // Fachada de tienda: muro, rótulo, escaparates y acera continua hacia la calle.
    const bazar = map === 'bazar';
    g.fillStyle = bazar ? '#c97b4a' : '#e8e2d6'; g.fillRect(-10, 0, W + 20, floorY);
    if (bazar) { g.strokeStyle = 'rgba(80,30,10,0.25)'; g.lineWidth = 2; for (let y = 10; y < floorY; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); for (let x = (y / 24) % 2 ? 0 : 30; x < W; x += 60) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 24); g.stroke(); } } }
    // Toldo y rótulo
    for (let x = -10; x < W; x += 50) { g.fillStyle = (x / 50) % 2 ? (bazar ? '#2a9d8f' : '#e63946') : '#f8f3e8'; g.fillRect(x, H * 0.08, 50, H * 0.08); }
    g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(-10, H * 0.08, W + 20, H * 0.08);
    // Escaparate a la derecha de la puerta con estantes reconocibles; el rótulo, encima del escaparate.
    const wx = doorX + doorW / 2 + 30, ww = W - wx - 30;
    rr(g, wx + ww * 0.1, H * 0.17, ww * 0.8, H * 0.08, 8); fillStroke(g, bazar ? '#264653' : '#20375c', INK, 3);
    g.font = `900 ${Math.round(H * 0.055)}px "Baloo 2", sans-serif`; g.textAlign = 'center'; g.fillStyle = bazar ? '#ffd23f' : '#f8f3e8';
    g.fillText(bazar ? 'BAZAR MIL COSAS' : 'EL CARRITO', wx + ww / 2, H * 0.232);
    rr(g, wx, doorTop, ww, doorH - 16, 6); fillStroke(g, 'rgba(180,220,245,0.85)', INK, 3);
    for (let r = 0; r < 3; r++) {
      const y = doorTop + 20 + r * (doorH - 40) / 3;
      g.fillStyle = '#8a7f6c'; g.fillRect(wx + 8, y + (doorH - 40) / 3 - 10, ww - 16, 5);
      for (let x = wx + 16; x < wx + ww - 24; x += 26) {
        const k = Math.floor(x * 7 + r * 13) % 5;
        g.fillStyle = bazar ? ['#ff8fab', '#ffd23f', '#5cc8ff', '#3ddc97', '#c77dff'][k] : ['#e63946', '#ffd23f', '#3ddc97', '#5cc8ff', '#f4a261'][k];
        if (bazar && k % 2) { g.beginPath(); g.arc(x + 8, y + (doorH - 40) / 3 - 20, 9, 0, Math.PI * 2); g.fill(); g.strokeStyle = INK; g.lineWidth = 1.5; g.stroke(); }
        else { rr(g, x, y + (doorH - 40) / 3 - 30, 16, 20, 3); fillStroke(g, g.fillStyle as string, INK, 1.5); }
      }
    }
    // Acera y calle
    g.fillStyle = '#9aa5b1'; g.fillRect(-10, floorY, W + 20, H * 0.07);
    g.fillStyle = 'rgba(0,0,0,0.12)'; for (let x = 0; x < W; x += 60) g.fillRect(x, floorY, 2, H * 0.07);
    g.fillStyle = '#4a5563'; g.fillRect(-10, floorY + H * 0.07, W + 20, H);
    g.fillStyle = 'rgba(255,255,255,0.7)'; for (let x = 40; x < W; x += 160) g.fillRect(x, floorY + H * 0.16, 80, 6);
  }
  // Marco, hueco y hoja de la puerta: SIEMPRE dentro de su pared o casco.
  const frame = map === 'plane' ? '#dfe6ef' : map === 'ship' ? '#d8d2c4' : '#2bb24c';
  rr(g, doorL - 10, doorTop - 10, doorW + 20, doorH + 10, 10); fillStroke(g, frame, INK, 4);
  const inside = g.createLinearGradient(0, doorTop, 0, floorY);
  inside.addColorStop(0, map === 'plane' ? '#3a4660' : '#3a3530'); inside.addColorStop(1, map === 'plane' ? '#1f2638' : '#1e1a17');
  g.fillStyle = inside; rr(g, doorL, doorTop, doorW, doorH, 6); g.fill();
  if (open > 0.05) {
    const lg = g.createRadialGradient(doorX, doorTop + doorH / 2, 10, doorX, doorTop + doorH / 2, doorW * 2);
    lg.addColorStop(0, `rgba(255,236,190,${0.3 * open})`); lg.addColorStop(1, 'rgba(255,236,190,0)');
    g.fillStyle = lg; g.fillRect(doorL - doorW * 2, doorTop - doorH * 0.3, doorW * 5, doorH * 1.4);
  }
  if (map === 'market' || map === 'bazar') {
    // Puerta automática de dos hojas de cristal que se abren hacia los lados.
    const off = (doorW / 2) * 0.9 * open;
    for (const side of [-1, 1]) {
      const x0 = side < 0 ? doorL - off : doorX + off;
      rr(g, x0, doorTop, doorW / 2, doorH, 3); fillStroke(g, 'rgba(190,225,250,0.75)', INK, 2.5);
    }
    g.fillStyle = '#ffffff'; g.strokeStyle = INK; g.lineWidth = 4; g.font = `900 ${Math.round(doorW * 0.16)}px "Baloo 2", sans-serif`; g.textAlign = 'center';
    g.strokeText('SALIDA', doorX, doorTop - 16); g.fillText('SALIDA', doorX, doorTop - 16);
  } else {
    rr(g, doorL, doorTop, doorW * (1 - open * 0.92), doorH, 6);
    fillStroke(g, vgrad(g, doorTop, floorY, map === 'plane' ? '#eef2f7' : '#c3ccd8', map === 'plane' ? '#c9d2de' : '#8a96a8'), INK, 3);
  }
}

/**
 * Secuencia de resultados de CADA votación. Empieza con un plano de situación
 * (el barco en el mar, el avión en vuelo o la fachada de la tienda) y pasa a un
 * plano cercano donde la puerta forma parte de su pared. Con expulsado:
 * anticipación, salida, reacción y final. Sin expulsado (`actor` nulo): el
 * mismo decorado y movimiento de cámara, pero vacío, con la causa.
 */
export function ejectionScene(host: HTMLElement, map: MapId, actor: EjectActor | null, text: string, sub: string, durMs: number): () => void {
  const c = makeCanvas(10, 10);
  host.append(c);
  const g = c.getContext('2d')!;
  const who = actor ? portrait(actor.color, actor.acc, 80) : null;
  const wide = vehicle(map);
  const t0 = performance.now();
  let raf = 0;
  if (actor) audio.sfx('eject'); else audio.sfx('close');
  const reduce = store.prefs.reduceMotion;
  const total = durMs / 1000;
  const CUT = 1.5;
  const frame = () => {
    const W = host.clientWidth || 800, H = host.clientHeight || 450;
    if (c.width !== W) { c.width = W; c.height = H; }
    const t = (performance.now() - t0) / 1000;
    if (t < CUT + 0.3) {
      // Plano de situación: el lugar completo y un acercamiento suave hacia la salida.
      g.save();
      const z = reduce ? 1 : 1 + 0.12 * ease(seg(t, 0, CUT));
      g.translate(W / 2, H / 2); g.scale(z, z); g.translate(-W / 2, -H / 2);
      bgPaint(g, map === 'bazar' ? 'market' : map, W, H, t, 'calm');
      const vw = Math.min(W * 0.78, wide.width * 1.4), vh = vw * (wide.height / wide.width);
      const x = W / 2 - vw / 2 + (map === 'plane' ? Math.sin(t) * 6 : 0);
      const y = map === 'ship' ? H * 0.64 - vh * 0.85 : map === 'plane' ? H * 0.42 - vh / 2 + Math.sin(t * 1.4) * 4 : H * 0.72 - vh;
      g.save(); g.translate(x + vw / 2, y + vh / 2); g.rotate(map === 'ship' ? Math.sin(t * 1.2) * 0.012 : 0); g.drawImage(wide, -vw / 2, -vh / 2, vw, vh); g.restore();
      g.restore();
    }
    if (t >= CUT) {
      g.save();
      g.globalAlpha = clamp01((t - CUT) / 0.3);
      const cs = closeSet(map, W, H);
      const open = ease(seg(t, CUT + 0.3, CUT + 0.9)) * (1 - ease(seg(t, total - 1.2, total - 0.6)));
      paintClose(g, map, W, H, t, cs, open);
      const { doorX, doorW, floorY } = cs;
      const size = Math.min(150, H * 0.3);
      if (map === 'ship') {
        // Plancha que sale por el hueco de la borda
        const k = ease(seg(t, CUT + 0.6, CUT + 1.1));
        g.fillStyle = '#b08155'; g.strokeStyle = INK; g.lineWidth = 3;
        g.beginPath(); g.rect(W * 0.5, floorY - 6, (cs.exitX - W * 0.5 + 20) * k, 12); g.fill(); g.stroke();
      }
      if (who) {
        const walk = ease(seg(t, CUT + 0.9, CUT + 2.0));
        const antic = seg(t, CUT + 2.0, CUT + 2.4);
        const fly = seg(t, CUT + 2.4, CUT + 4.0);
        const startX = doorX, endX = map === 'plane' ? doorX + doorW * 0.55 : map === 'ship' ? cs.exitX : doorX + doorW * 1.2;
        let x = startX + (endX - startX) * walk, y = floorY, rot = 0, sx = 1, sy = 1;
        if (t < CUT + 2.0) y -= Math.abs(Math.sin(t * 9)) * 6 * walk;
        else if (t < CUT + 2.4) { sy = 1 - 0.18 * Math.sin(antic * Math.PI); sx = 1 + 0.12 * Math.sin(antic * Math.PI); }
        else if (map === 'market' || map === 'bazar') {
          // Un carrito (súper) o una carretilla de reparto (bazar) lo recoge y se lo lleva por la acera.
          const cx = endX + ease(fly) * W * 0.9;
          if (map === 'market') drawCart(g, cx, floorY + 8, size * 0.9); else drawHandTruck(g, cx, floorY + 8, size);
          x = cx; y = floorY - size * 0.28; rot = reduce ? 0 : Math.sin(fly * 8) * 0.08;
        } else if (map === 'ship') {
          x = endX + ease(fly) * W * 0.12;
          y = floorY + Math.sin(fly * Math.PI) * -H * 0.08 + ease(fly) * (H * 0.86 - floorY);
          rot = reduce ? 0 : fly * 4;
        } else {
          x = endX + fly * W * 0.55;
          y = floorY + fly * H * 0.2 - Math.sin(fly * Math.PI) * H * 0.05;
          rot = reduce ? 0 : -0.3 + fly * 0.5;
        }
        const fade = 1 - seg(t, CUT + 4.0, CUT + 4.6);
        if (fade > 0) {
          // Detrás del marco mientras sale por la puerta: se recorta con el hueco.
          g.save(); g.globalAlpha *= fade;
          drawActor(g, who, x, y, size, rot, sx, sy);
          if (map === 'plane' && fly > 0.45) {
            g.globalAlpha = fade * clamp01((fly - 0.45) * 4);
            g.translate(x, y - size - 30); g.fillStyle = '#ff8a3d'; g.strokeStyle = INK; g.lineWidth = 3;
            g.beginPath(); g.arc(0, 0, 54, Math.PI, 0); g.closePath(); g.fill(); g.stroke();
            g.beginPath(); g.moveTo(-50, 0); g.lineTo(0, 30); g.lineTo(50, 0); g.stroke();
          }
          g.restore();
        }
        if (t > CUT + 2.0 && t < CUT + 2.6) { g.fillStyle = '#9ad1ff'; for (let i = 0; i < 3; i++) { g.beginPath(); g.ellipse(x + 30 + i * 10, y - size * 0.9 + i * 6, 4, 7, 0.3, 0, Math.PI * 2); g.fill(); } }
        if (map === 'ship' && fly >= 1) {
          const k2 = seg(t, CUT + 4.0, CUT + 4.8);
          g.strokeStyle = '#ff4d5e'; g.lineWidth = 10; g.beginPath(); g.arc(endX + W * 0.12, H * 0.88, 30, 0, Math.PI * 2); g.stroke();
          g.fillStyle = `rgba(255,255,255,${0.8 * (1 - k2)})`; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(endX + W * 0.12 - 40 + i * 16, H * 0.86 - k2 * 30 - (i % 2) * 8, 7, 0, Math.PI * 2); g.fill(); }
        }
      } else if (map === 'market' || map === 'bazar') {
        // Sin expulsado: el carrito o la carretilla pasan vacíos por delante de la salida.
        const cx = W * 1.05 - ease(seg(t, CUT + 0.8, total - 1.0)) * W * 1.2;
        if (map === 'market') drawCart(g, cx, floorY + 8, size * 0.9); else drawHandTruck(g, cx, floorY + 8, size);
      }
      g.restore();
      // Texto de resultado con causa explícita
      const ta = clamp01((t - (who ? CUT + 2.6 : CUT + 0.8)) * 2);
      g.globalAlpha = ta;
      g.font = `800 ${Math.max(22, Math.min(48, W / 22))}px "Baloo 2", sans-serif`;
      g.textAlign = 'center'; g.lineWidth = 8; g.strokeStyle = INK; g.fillStyle = '#fff';
      g.strokeText(text, W / 2, H * 0.93 - (sub ? 34 : 0)); g.fillText(text, W / 2, H * 0.93 - (sub ? 34 : 0));
      if (sub) { g.font = `700 ${Math.max(14, Math.min(24, W / 44))}px "Nunito", sans-serif`; g.lineWidth = 5; g.strokeText(sub, W / 2, H * 0.95); g.fillText(sub, W / 2, H * 0.95); }
      g.globalAlpha = 1;
    }
    raf = requestAnimationFrame(frame);
  };
  frame();
  return () => { cancelAnimationFrame(raf); c.remove(); };
}

/** Carretilla de reparto del bazar (dos ruedas, plataforma y asas). */
function drawHandTruck(g: CanvasRenderingContext2D, x: number, y: number, s: number) {
  g.save(); g.translate(x, y);
  g.strokeStyle = INK; g.lineWidth = 4; g.lineCap = 'round';
  g.beginPath(); g.moveTo(-s * 0.3, -s * 0.05); g.lineTo(-s * 0.12, -s * 0.95); g.stroke();
  g.beginPath(); g.moveTo(-s * 0.12, -s * 0.95); g.lineTo(-s * 0.02, -s * 1.0); g.stroke();
  g.fillStyle = '#ffd23f'; rr(g, -s * 0.34, -s * 0.12, s * 0.5, s * 0.08, 3); g.fill(); g.stroke();
  // Caja con el logotipo del bazar
  rr(g, -s * 0.1, -s * 0.5, s * 0.4, s * 0.36, 4); fillStroke(g, '#c9a36a', INK, 3);
  g.fillStyle = INK; for (const wx of [-0.28, 0.02]) { g.beginPath(); g.arc(wx * s, 0, s * 0.08, 0, Math.PI * 2); g.fill(); }
  g.restore();
}

function drawCart(g: CanvasRenderingContext2D, x: number, y: number, s: number) {
  g.save(); g.translate(x, y);
  g.strokeStyle = INK; g.lineWidth = 4;
  rr(g, -s * 0.45, -s * 0.45, s * 0.9, s * 0.38, 6); g.fillStyle = 'rgba(200,210,220,0.85)'; g.fill(); g.stroke();
  g.strokeStyle = '#c0c8d4'; g.lineWidth = 2; for (let k = -0.4; k < 0.45; k += 0.1) { g.beginPath(); g.moveTo(k * s, -s * 0.44); g.lineTo(k * s, -s * 0.08); g.stroke(); }
  g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(s * 0.45, -s * 0.45); g.lineTo(s * 0.6, -s * 0.62); g.stroke();
  g.fillStyle = '#e63946'; g.fillRect(-s * 0.46, -s * 0.48, s * 0.92, 6);
  g.fillStyle = INK; for (const wx of [-0.32, 0.32]) { g.beginPath(); g.arc(wx * s, 0, s * 0.07, 0, Math.PI * 2); g.fill(); }
  g.restore();
}

/** Desenlace propio de cada mapa (estilizado, sin gore). */
export function playCinematic(app: App, r: EndResult): Promise<void> {
  void app;
  if (r.cause === 'ejected' || r.cause === 'abandon' || r.cause === 'cancelled') return Promise.resolve();
  const map = (store.gstart?.mapId ?? 'ship') as MapId;
  const happy = r.winner === 'workers';
  const root = h('div', { class: 'cine' });
  const c = makeCanvas(10, 10);
  root.append(c, h('div', { class: 'txt' }, r.title));
  uiRoot().append(root);
  const g = c.getContext('2d')!;
  const v = vehicle(map);
  const t0 = performance.now();
  const dur = 4200;
  const shop = map === 'market' || map === 'bazar';
  audio.sfx(happy ? 'win' : shop ? 'lose' : 'crash');
  const scene = r.scene;
  return new Promise((resolve) => {
    let raf = 0;
    const skip = () => { cancelAnimationFrame(raf); root.remove(); resolve(); };
    root.addEventListener('pointerdown', skip);
    const frame = () => {
      const W = window.innerWidth, H = window.innerHeight;
      if (c.width !== W) { c.width = W; c.height = H; }
      const t = (performance.now() - t0) / 1000;
      const k = Math.min(1, t / (dur / 1000));
      bgPaint(g, map === 'bazar' ? 'market' : map, W, H, happy ? t * (1 - k) : t, happy ? 'happy' : 'bad');
      const vw = Math.min(W * 0.8, v.width), vh = vw * (v.height / v.width);
      let x = W / 2 - vw / 2, y = map === 'ship' ? H * 0.64 - vh * 0.85 : shop ? H * 0.72 - vh : H * 0.4 - vh / 2;
      let rot = 0;
      if (happy) {
        if (map === 'ship') { g.fillStyle = '#8d6e52'; g.fillRect(0, H * 0.58, W * 0.25, H * 0.08); x -= (1 - k) * W * 0.3 - W * 0.05; }
        if (map === 'plane') { g.fillStyle = '#4a4e57'; g.fillRect(0, H * 0.8, W, H * 0.1); g.fillStyle = '#fff'; for (let i = 0; i < 10; i++) g.fillRect(i * W / 10, H * 0.85, W / 20, 5); y = H * 0.4 + k * (H * 0.4 - vh * 0.75); rot = -0.12 * (1 - k); }
      } else if (!shop) {
        if (scene === 'sink') { rot = k * 0.35; y += k * vh * 0.7; }
        else if (scene === 'reef' || (map === 'ship' && scene === 'murder')) { g.fillStyle = '#5c5f6b'; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(W * 0.7 + i * 50, H * 0.66); g.lineTo(W * 0.72 + i * 50, H * 0.5); g.lineTo(W * 0.76 + i * 50, H * 0.66); g.fill(); } x += k * W * 0.15; rot = Math.sin(t * 3) * 0.1 * k; }
        else { rot = k * 0.9; y += k * H * 0.5; x += k * W * 0.2; for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(60,60,70,0.4)'; g.beginPath(); g.arc(x + vw * 0.2 - i * 30, y + vh / 2 - i * 20, 18 + i * 6, 0, Math.PI * 2); g.fill(); } }
      }
      if (store.prefs.reduceMotion) rot *= 0.3;
      g.save();
      g.translate(x + vw / 2, y + vh / 2);
      g.rotate(rot);
      g.drawImage(v, -vw / 2, -vh / 2, vw, vh);
      g.restore();
      if (shop && !happy) { g.fillStyle = `rgba(20,14,40,${0.45 * k})`; g.fillRect(0, 0, W, H); }
      if (map === 'ship' && !happy && scene === 'sink') { g.fillStyle = 'rgba(31,120,173,0.85)'; g.fillRect(0, H * 0.64, W, H); }
      if (t * 1000 >= dur) { skip(); return; }
      raf = requestAnimationFrame(frame);
    };
    frame();
  });
}

export function colorName(c: number) { return COLORS[c]?.name ?? ''; }
