import type { Product } from '../../shared/market';
import { Ctx, fillStroke, rr } from './draw';
import { INK, shade } from './palette';

/**
 * Iconos de producto dibujados por código (forma + colores del catálogo).
 * Se usan en las estanterías, el selector de compra, la caja y el historial.
 */
export function drawProductIcon(ctx: Ctx, p: Product, cx: number, cy: number, s: number) {
  const k = s / 32;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(k, k);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const lw = 1.8;
  const c1 = p.c1, c2 = p.c2;
  switch (p.shape) {
    case 'round':
      ctx.beginPath(); ctx.arc(0, 2, 11, 0, Math.PI * 2); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-4, -2, 3.5, 2.5, -0.6, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(3, -10, 5, 2.5, -0.5, 0, Math.PI * 2); fillStroke(ctx, c2, INK, 1.2);
      break;
    case 'banana':
      ctx.beginPath(); ctx.moveTo(-12, -6); ctx.quadraticCurveTo(-4, 16, 13, 4); ctx.quadraticCurveTo(-2, 8, -8, -8); ctx.closePath(); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = c2; ctx.fillRect(-13, -9, 4, 4);
      break;
    case 'long':
      ctx.save(); ctx.rotate(-0.6); rr(ctx, -14, -5, 28, 10, 5); fillStroke(ctx, c1, INK, lw); ctx.fillStyle = c2; ctx.fillRect(-16, -2, 4, 4); ctx.restore();
      break;
    case 'leafy':
      for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + (i - 2) * 0.55; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 6, 2 + Math.sin(a) * 6, 7, 9, a, 0, Math.PI * 2); fillStroke(ctx, i % 2 ? c1 : c2, INK, 1.3); }
      break;
    case 'bunch':
      for (const [x, y] of [[-6, -6], [0, -7], [6, -6], [-3, 0], [3, 0], [0, 6], [-6, 1], [6, 1]]) { ctx.beginPath(); ctx.arc(x, y + 2, 4.5, 0, Math.PI * 2); fillStroke(ctx, c1, INK, 1.2); }
      ctx.strokeStyle = c2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(3, -14); ctx.stroke();
      break;
    case 'berry':
      for (const [x, y] of [[-6, 3], [5, 4], [0, -3], [-2, 8]]) { ctx.beginPath(); ctx.arc(x, y, 5.5, 0, Math.PI * 2); fillStroke(ctx, c1, INK, 1.2); ctx.fillStyle = c2; ctx.fillRect(x - 1, y - 7, 2, 3); }
      break;
    case 'melon':
      ctx.beginPath(); ctx.ellipse(0, 2, 13, 10, 0, 0, Math.PI * 2); fillStroke(ctx, c1, INK, lw);
      ctx.strokeStyle = shade(c1, -0.3); ctx.lineWidth = 1.5; for (const x of [-6, 0, 6]) { ctx.beginPath(); ctx.moveTo(x, -7); ctx.quadraticCurveTo(x * 1.4, 2, x, 11); ctx.stroke(); }
      ctx.fillStyle = c2; ctx.beginPath(); ctx.moveTo(4, 2); ctx.lineTo(13, 2); ctx.lineTo(9, 9); ctx.closePath(); ctx.fill();
      break;
    case 'pepper':
      ctx.beginPath(); ctx.moveTo(-9, -4); ctx.quadraticCurveTo(-11, 12, 0, 12); ctx.quadraticCurveTo(11, 12, 9, -4); ctx.quadraticCurveTo(0, -9, -9, -4); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = c2; rr(ctx, -2, -11, 4, 6, 2); ctx.fill();
      break;
    case 'root':
      ctx.beginPath(); ctx.moveTo(-6, -8); ctx.lineTo(6, -8); ctx.lineTo(1, 13); ctx.closePath(); fillStroke(ctx, c1, INK, lw);
      ctx.strokeStyle = c2; ctx.lineWidth = 2.5; for (const a of [-0.5, 0, 0.5]) { ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(Math.sin(a) * 8, -14); ctx.stroke(); }
      break;
    case 'bulb':
      ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(12, 0, 8, 8); ctx.quadraticCurveTo(0, 14, -8, 8); ctx.quadraticCurveTo(-12, 0, 0, -12); fillStroke(ctx, c1, INK, lw);
      ctx.strokeStyle = c2; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(1, -15); ctx.stroke();
      break;
    case 'mushroom':
      ctx.beginPath(); ctx.ellipse(0, -2, 12, 8, 0, Math.PI, 0); ctx.closePath(); fillStroke(ctx, c2, INK, lw);
      rr(ctx, -4, -2, 8, 12, 3); fillStroke(ctx, c1, INK, 1.4);
      break;
    case 'meat':
      rr(ctx, -14, -9, 28, 20, 4); fillStroke(ctx, '#f8f9fa', INK, 1.4);
      ctx.beginPath(); ctx.ellipse(0, 1, 10, 7, 0.2, 0, Math.PI * 2); fillStroke(ctx, c1, INK, 1.3);
      ctx.fillStyle = c2; ctx.beginPath(); ctx.ellipse(3, -1, 4, 2, 0.2, 0, Math.PI * 2); ctx.fill();
      break;
    case 'sausage':
      for (const y of [-5, 4]) { rr(ctx, -13, y - 4, 26, 9, 4.5); fillStroke(ctx, c1, INK, 1.3); }
      ctx.fillStyle = c2; ctx.fillRect(-14, -1, 3, 2);
      break;
    case 'fish':
      ctx.beginPath(); ctx.moveTo(-12, 0); ctx.quadraticCurveTo(0, -10, 8, 0); ctx.quadraticCurveTo(0, 10, -12, 0); fillStroke(ctx, c1, INK, lw);
      ctx.beginPath(); ctx.moveTo(8, 0); ctx.lineTo(14, -6); ctx.lineTo(14, 6); ctx.closePath(); fillStroke(ctx, c2, INK, 1.3);
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-6, -1.5, 1.4, 0, Math.PI * 2); ctx.fill();
      break;
    case 'shell':
      for (const x of [-6, 6]) { ctx.beginPath(); ctx.ellipse(x, 2, 7, 10, x > 0 ? 0.3 : -0.3, 0, Math.PI * 2); fillStroke(ctx, c1, INK, 1.4); ctx.strokeStyle = c2; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, -6); ctx.lineTo(x, 10); ctx.stroke(); }
      break;
    case 'shrimp':
      ctx.beginPath(); ctx.arc(0, 0, 10, Math.PI * 0.1, Math.PI * 1.4); ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.stroke(); ctx.strokeStyle = c1; ctx.lineWidth = 6; ctx.stroke();
      ctx.strokeStyle = c2; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-7, -7); ctx.lineTo(-13, -13); ctx.stroke();
      break;
    case 'octopus':
      ctx.beginPath(); ctx.ellipse(0, -4, 9, 8, 0, 0, Math.PI * 2); fillStroke(ctx, c1, INK, lw);
      ctx.strokeStyle = c1; ctx.lineWidth = 3.5; for (const x of [-7, -2, 3, 8]) { ctx.beginPath(); ctx.moveTo(x * 0.8, 2); ctx.quadraticCurveTo(x, 10, x + 3, 12); ctx.stroke(); }
      ctx.fillStyle = c2; ctx.beginPath(); ctx.arc(-3, -5, 1.6, 0, Math.PI * 2); ctx.arc(3, -5, 1.6, 0, Math.PI * 2); ctx.fill();
      break;
    case 'carton':
      ctx.beginPath(); ctx.moveTo(-9, -6); ctx.lineTo(0, -14); ctx.lineTo(9, -6); ctx.lineTo(9, 13); ctx.lineTo(-9, 13); ctx.closePath(); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = c2; ctx.fillRect(-9, 0, 18, 6);
      break;
    case 'bottle':
      rr(ctx, -3, -14, 6, 7, 2); fillStroke(ctx, c2, INK, 1.2);
      ctx.beginPath(); ctx.moveTo(-3, -7); ctx.lineTo(-8, -2); ctx.lineTo(-8, 13); ctx.lineTo(8, 13); ctx.lineTo(8, -2); ctx.lineTo(3, -7); ctx.closePath(); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.7; ctx.fillRect(-6, 2, 12, 6); ctx.globalAlpha = 1;
      break;
    case 'jar':
      rr(ctx, -9, -12, 18, 5, 2); fillStroke(ctx, c2, INK, 1.2);
      rr(ctx, -10, -7, 20, 20, 5); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillRect(-7, -1, 14, 7);
      break;
    case 'can':
      rr(ctx, -10, -11, 20, 23, 3); fillStroke(ctx, '#ced4da', INK, lw);
      ctx.fillStyle = c1; ctx.fillRect(-10, -6, 20, 13);
      ctx.fillStyle = c2; ctx.fillRect(-10, -1, 20, 3);
      break;
    case 'box':
      rr(ctx, -11, -12, 22, 25, 2); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = c2; ctx.fillRect(-11, -4, 22, 7);
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(-7, 6, 14, 3);
      break;
    case 'bag':
      ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(10, -10); ctx.lineTo(12, 13); ctx.lineTo(-12, 13); ctx.closePath(); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = c2; ctx.fillRect(-11, -3, 22, 6);
      ctx.strokeStyle = INK; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-8, -10); ctx.lineTo(8, -10); ctx.stroke();
      break;
    case 'bread':
      ctx.beginPath(); ctx.moveTo(-12, 12); ctx.lineTo(-12, -2); ctx.quadraticCurveTo(-12, -12, 0, -12); ctx.quadraticCurveTo(12, -12, 12, -2); ctx.lineTo(12, 12); ctx.closePath(); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = c2; rr(ctx, -9, -4, 18, 14, 3); ctx.fill();
      break;
    case 'loaf':
      ctx.save(); ctx.rotate(-0.35); ctx.beginPath(); ctx.ellipse(0, 0, 15, 7, 0, 0, Math.PI * 2); fillStroke(ctx, c1, INK, lw);
      ctx.strokeStyle = c2; ctx.lineWidth = 1.6; for (const x of [-7, 0, 7]) { ctx.beginPath(); ctx.moveTo(x - 3, -3); ctx.lineTo(x + 3, 3); ctx.stroke(); } ctx.restore();
      break;
    case 'egg':
      rr(ctx, -14, -2, 28, 14, 3); fillStroke(ctx, '#c9b79c', INK, 1.4);
      for (const x of [-8, 0, 8]) { ctx.beginPath(); ctx.ellipse(x, -3, 4.5, 6, 0, 0, Math.PI * 2); fillStroke(ctx, c1, INK, 1.2); }
      break;
    case 'cheese':
      ctx.beginPath(); ctx.moveTo(-13, 10); ctx.lineTo(13, 10); ctx.lineTo(13, -2); ctx.lineTo(-13, -10); ctx.closePath(); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = shade(c1, -0.15); for (const [x, y] of [[-4, 3], [6, 5], [2, -1]]) { ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = c2; ctx.fillRect(-13, 7, 26, 3);
      break;
    case 'tub':
      ctx.beginPath(); ctx.moveTo(-11, -8); ctx.lineTo(11, -8); ctx.lineTo(8, 12); ctx.lineTo(-8, 12); ctx.closePath(); fillStroke(ctx, c1, INK, lw);
      rr(ctx, -12, -11, 24, 5, 2); fillStroke(ctx, c2, INK, 1.2);
      break;
    case 'spice':
      rr(ctx, -6, -13, 12, 6, 2); fillStroke(ctx, c2, INK, 1.2);
      rr(ctx, -7, -7, 14, 20, 3); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(-5, -1, 10, 6);
      break;
    case 'tube':
      ctx.beginPath(); ctx.moveTo(-7, -9); ctx.lineTo(7, -9); ctx.lineTo(9, 12); ctx.lineTo(-9, 12); ctx.closePath(); fillStroke(ctx, c1, INK, lw);
      rr(ctx, -4, -14, 8, 5, 2); fillStroke(ctx, c2, INK, 1.2);
      ctx.fillStyle = c2; ctx.fillRect(-7, 2, 14, 4);
      break;
    case 'block':
      rr(ctx, -13, -7, 26, 16, 3); fillStroke(ctx, c1, INK, lw);
      ctx.strokeStyle = shade(c1, -0.25); ctx.lineWidth = 1; for (const x of [-4, 4]) { ctx.beginPath(); ctx.moveTo(x, -7); ctx.lineTo(x, 9); ctx.stroke(); }
      ctx.fillStyle = c2; ctx.fillRect(-13, -2, 26, 3);
      break;
    case 'herb':
      ctx.strokeStyle = c2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 13); ctx.lineTo(0, -4); ctx.stroke();
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.5; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 7, -2 + Math.sin(a) * 6, 4, 6, a, 0, Math.PI * 2); fillStroke(ctx, c1, INK, 1.1); }
      break;
    case 'cone':
      ctx.beginPath(); ctx.ellipse(0, 3, 9, 11, 0, 0, Math.PI * 2); fillStroke(ctx, c1, INK, lw);
      ctx.strokeStyle = shade(c1, -0.3); ctx.lineWidth = 1; for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 4 - 4, -6); ctx.lineTo(i * 4 + 4, 12); ctx.stroke(); }
      for (const a of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(Math.sin(a) * 4, -11, 3, 6, a, 0, Math.PI * 2); fillStroke(ctx, c2, INK, 1); }
      break;
    case 'corn':
      ctx.beginPath(); ctx.ellipse(0, 0, 7, 13, 0.3, 0, Math.PI * 2); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = shade(c1, -0.15); for (let y = -8; y < 10; y += 4) ctx.fillRect(-4 + y * 0.3, y, 8, 1.5);
      ctx.beginPath(); ctx.moveTo(4, 8); ctx.quadraticCurveTo(14, 4, 10, -10); ctx.quadraticCurveTo(8, 2, 2, 10); fillStroke(ctx, c2, INK, 1.2);
      break;
    case 'pod':
      ctx.save(); ctx.rotate(-0.5); ctx.beginPath(); ctx.ellipse(0, 0, 15, 6, 0, 0, Math.PI * 2); fillStroke(ctx, c1, INK, lw);
      ctx.fillStyle = c2; for (const x of [-8, -2, 4, 10]) { ctx.beginPath(); ctx.arc(x - 1, 0, 2.6, 0, Math.PI * 2); ctx.fill(); } ctx.restore();
      break;
    default:
      drawBazarIcon(ctx, p.shape, c1, c2, lw);
  }
  ctx.restore();
}

const line = (ctx: Ctx, pts: number[], w: number, col: string) => {
  ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
};
const circ = (ctx: Ctx, x: number, y: number, r: number, fill: string, lw = 1.4) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); fillStroke(ctx, fill, INK, lw); };
const box = (ctx: Ctx, x: number, y: number, w: number, h: number, r: number, fill: string, lw = 1.6) => { rr(ctx, x, y, w, h, r); fillStroke(ctx, fill, INK, lw); };

/** Iconos de los artículos del bazar (siluetas simples y legibles a 15–24 px). */
function drawBazarIcon(ctx: Ctx, shape: string, c1: string, c2: string, lw: number) {
  switch (shape) {
    case 'paper': box(ctx, -11, -12, 18, 22, 2, c2, 1.2); box(ctx, -7, -9, 18, 22, 2, c1, lw); break;
    case 'card': box(ctx, -12, -9, 24, 17, 2, c1, lw); line(ctx, [-6, -2, 6, -2], 2, c2); line(ctx, [-6, 3, 3, 3], 2, c2); break;
    case 'tag': ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(6, -6); ctx.lineTo(13, 0); ctx.lineTo(6, 6); ctx.lineTo(-12, 6); ctx.closePath(); fillStroke(ctx, c1, INK, lw); circ(ctx, 6, 0, 1.8, c2, 1); break;
    case 'scissors': circ(ctx, -7, 7, 4.5, c1); circ(ctx, 5, 7, 4.5, c1); line(ctx, [-5, 4, 8, -12], 2.6, INK); line(ctx, [3, 4, -9, -12], 2.6, INK); line(ctx, [-5, 4, 8, -12], 1.2, c2); line(ctx, [3, 4, -9, -12], 1.2, c2); break;
    case 'paint': box(ctx, -12, -6, 9, 15, 2, c1); box(ctx, -2, -9, 9, 18, 2, c2); box(ctx, 8, -4, 6, 13, 2, shade(c1, -0.2)); break;
    case 'brush': ctx.save(); ctx.rotate(-0.7); box(ctx, -2, -14, 4, 18, 2, c1, 1.2); box(ctx, -3.5, 3, 7, 5, 1, '#adb5bd', 1.2); ctx.beginPath(); ctx.moveTo(-3.5, 8); ctx.lineTo(0, 15); ctx.lineTo(3.5, 8); ctx.closePath(); fillStroke(ctx, c2, INK, 1.2); ctx.restore(); break;
    case 'markers': for (const [x, c] of [[-8, c1], [-2, c2], [4, '#3ddc97'], [10, '#ffd23f']] as [number, string][]) { box(ctx, x - 2.5, -10, 5, 18, 2, c, 1.1); ctx.fillStyle = INK; ctx.fillRect(x - 1, 8, 2, 3); } break;
    case 'screwdriver': ctx.save(); ctx.rotate(-0.7); box(ctx, -3.5, -14, 7, 12, 3, c1); line(ctx, [0, -2, 0, 14], 2.4, c2); ctx.restore(); break;
    case 'hammer': ctx.save(); ctx.rotate(-0.5); box(ctx, -2, -6, 4, 21, 1.5, c1, 1.2); box(ctx, -9, -12, 18, 7, 2, c2); ctx.restore(); break;
    case 'pliers': line(ctx, [-3, 13, 0, 0, -2, -12], 3.4, c1); line(ctx, [3, 13, 0, 0, 2, -12], 3.4, c1); circ(ctx, 0, 0, 2, c2, 1); break;
    case 'tapeMeasure': box(ctx, -11, -10, 20, 20, 6, c1); circ(ctx, -1, 0, 4, c2, 1.2); box(ctx, 8, 4, 7, 4, 1, '#f8f9fa', 1); break;
    case 'level': box(ctx, -14, -4, 28, 9, 2, c1); box(ctx, -4, -2, 8, 5, 2, c2, 1); circ(ctx, 0, 0.5, 1.2, '#f8f9fa', 0.6); break;
    case 'wrench': ctx.save(); ctx.rotate(-0.7); box(ctx, -2.5, -8, 5, 22, 2, c1, 1.2); ctx.beginPath(); ctx.arc(0, -10, 6, 0.4, Math.PI * 2 - 0.4 + Math.PI); fillStroke(ctx, c1, INK, 1.4); ctx.restore(); break;
    case 'glueGun': box(ctx, -12, -8, 20, 9, 3, c1); box(ctx, -2, 0, 7, 12, 2, c2); line(ctx, [8, -4, 14, -4], 2.4, '#adb5bd'); break;
    case 'cutter': ctx.save(); ctx.rotate(-0.6); box(ctx, -4, -6, 8, 20, 2, c1); ctx.beginPath(); ctx.moveTo(-3, -6); ctx.lineTo(0, -14); ctx.lineTo(3, -6); ctx.closePath(); fillStroke(ctx, c2, INK, 1.1); ctx.restore(); break;
    case 'saw': ctx.beginPath(); ctx.moveTo(-14, 4); ctx.lineTo(8, -6); ctx.lineTo(8, 4); ctx.closePath(); fillStroke(ctx, c1, INK, lw); box(ctx, 7, -9, 7, 15, 3, c2); break;
    case 'screws': box(ctx, -11, -11, 22, 22, 3, 'rgba(220,235,250,0.85)', lw); for (const [x, y] of [[-5, -4], [3, -5], [-2, 4], [5, 4]]) { line(ctx, [x, y - 4, x, y + 4], 2.2, c1); line(ctx, [x - 2.5, y - 4, x + 2.5, y - 4], 2, c2); } break;
    case 'bracket': ctx.beginPath(); ctx.moveTo(-10, -12); ctx.lineTo(-4, -12); ctx.lineTo(-4, 6); ctx.lineTo(12, 6); ctx.lineTo(12, 12); ctx.lineTo(-10, 12); ctx.closePath(); fillStroke(ctx, c1, INK, lw); circ(ctx, -7, -6, 1.4, c2, 0.8); circ(ctx, 6, 9, 1.4, c2, 0.8); break;
    case 'hinge': box(ctx, -12, -9, 10, 18, 1.5, c1); box(ctx, 2, -9, 10, 18, 1.5, c1); box(ctx, -2, -10, 4, 20, 2, c2, 1.2); break;
    case 'knob': circ(ctx, 0, -3, 7, c1); box(ctx, -3, 3, 6, 9, 2, c2, 1.2); break;
    case 'plank': ctx.save(); ctx.rotate(-0.3); box(ctx, -15, -5, 30, 10, 1.5, c1); line(ctx, [-12, 0, 12, 0], 1, c2); ctx.restore(); break;
    case 'sandpaper': box(ctx, -11, -11, 22, 22, 2, c1); ctx.fillStyle = c2; for (let i = 0; i < 18; i++) ctx.fillRect(-9 + ((i * 7) % 18), -9 + ((i * 11) % 18), 1.5, 1.5); break;
    case 'roll': circ(ctx, 0, 0, 11, c1); circ(ctx, 0, 0, 5, c2, 1.2); break;
    case 'hook': box(ctx, -6, -12, 12, 8, 2, c2, 1.2); line(ctx, [0, -4, 0, 6], 3, INK); ctx.strokeStyle = c1; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(-4, 6, 4, 0, Math.PI); ctx.stroke(); break;
    case 'rope': ctx.strokeStyle = c1; ctx.lineWidth = 3; for (const r of [10, 6.5, 3]) { ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); } ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, 11.5, 0, Math.PI * 2); ctx.stroke(); break;
    case 'basket': box(ctx, -13, -4, 26, 14, 4, c1); for (let x = -9; x < 12; x += 5) line(ctx, [x, -3, x, 9], 1, c2); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -4, 9, Math.PI, 0); ctx.stroke(); break;
    case 'organizer': box(ctx, -13, -9, 26, 18, 2, c1); line(ctx, [-4, -9, -4, 9], 1.4, INK); line(ctx, [5, -9, 5, 9], 1.4, INK); line(ctx, [-13, 0, -4, 0], 1.4, INK); ctx.fillStyle = c2; ctx.fillRect(7, -6, 4, 4); break;
    case 'hanger': ctx.strokeStyle = c1; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(-13, 8); ctx.lineTo(0, -2); ctx.lineTo(13, 8); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -6, 4, Math.PI, Math.PI * 2.4); ctx.stroke(); break;
    case 'shelfUnit': box(ctx, -12, -12, 24, 24, 2, c1); for (const y of [-4, 4]) line(ctx, [-12, y, 12, y], 1.6, c2); break;
    case 'cup': ctx.beginPath(); ctx.moveTo(-8, -10); ctx.lineTo(8, -10); ctx.lineTo(6, 11); ctx.lineTo(-6, 11); ctx.closePath(); fillStroke(ctx, c1, INK, lw); line(ctx, [-7, -4, 7, -4], 2, c2); break;
    case 'binder': box(ctx, -10, -13, 20, 26, 2, c1); box(ctx, -10, -13, 6, 26, 2, shade(c1, -0.2)); box(ctx, -1, -6, 9, 6, 1, c2, 1); break;
    case 'frame': box(ctx, -12, -11, 24, 22, 2, c1); box(ctx, -7, -6, 14, 12, 1, c2, 1.2); break;
    case 'mirror': ctx.beginPath(); ctx.ellipse(0, 0, 10, 13, 0, 0, Math.PI * 2); fillStroke(ctx, c2, INK, 2.4); ctx.beginPath(); ctx.ellipse(0, 0, 7, 10, 0, 0, Math.PI * 2); fillStroke(ctx, c1, INK, 1); line(ctx, [-3, -4, 1, -8], 1.6, '#ffffff'); break;
    case 'cushion': box(ctx, -12, -10, 24, 20, 7, c1); circ(ctx, 0, 0, 2.2, c2, 1); break;
    case 'candle': box(ctx, -5, -6, 10, 18, 2, c1); line(ctx, [0, -6, 0, -9], 1.4, INK); ctx.beginPath(); ctx.ellipse(0, -12, 2.6, 4, 0, 0, Math.PI * 2); fillStroke(ctx, c2, INK, 1); break;
    case 'vase': ctx.beginPath(); ctx.moveTo(-4, -12); ctx.lineTo(4, -12); ctx.quadraticCurveTo(12, 2, 6, 12); ctx.lineTo(-6, 12); ctx.quadraticCurveTo(-12, 2, -4, -12); ctx.closePath(); fillStroke(ctx, c1, INK, lw); line(ctx, [-8, 2, 8, 2], 2, c2); break;
    case 'clock': circ(ctx, 0, 0, 12, c1); line(ctx, [0, 0, 0, -7], 2, INK); line(ctx, [0, 0, 5, 3], 2, c2); break;
    case 'fabric': ctx.beginPath(); ctx.moveTo(-13, -8); ctx.quadraticCurveTo(0, -13, 13, -8); ctx.lineTo(13, 10); ctx.quadraticCurveTo(0, 5, -13, 10); ctx.closePath(); fillStroke(ctx, c1, INK, lw); line(ctx, [-9, -2, 9, -2], 1.6, c2); line(ctx, [-9, 4, 9, 4], 1.6, c2); break;
    case 'patch': box(ctx, -11, -11, 22, 22, 4, c1); ctx.setLineDash([2, 2]); ctx.strokeStyle = c2; ctx.lineWidth = 1.4; ctx.strokeRect(-8, -8, 16, 16); ctx.setLineDash([]); break;
    case 'spool': box(ctx, -9, -12, 18, 4, 1, '#c9a36a', 1.2); box(ctx, -9, 8, 18, 4, 1, '#c9a36a', 1.2); box(ctx, -6, -8, 12, 16, 1, c1, 1.2); break;
    case 'buttons': for (const [x, y, c] of [[-6, -5, c1], [6, -4, c2], [0, 6, c1]] as [number, number, string][]) { circ(ctx, x, y, 5.5, c); ctx.fillStyle = INK; ctx.fillRect(x - 2, y - 1, 1.5, 1.5); ctx.fillRect(x + 0.5, y - 1, 1.5, 1.5); } break;
    case 'zipper': box(ctx, -3, -14, 6, 28, 1, c1, 1.2); for (let y = -12; y < 12; y += 3) line(ctx, [-3, y, 3, y], 1, c2); box(ctx, -4, -2, 8, 6, 1.5, '#adb5bd', 1.2); break;
    case 'pins': line(ctx, [-10, 10, 10, -10], 1.8, c1); circ(ctx, -10, 10, 2.5, c2, 1); line(ctx, [-4, 12, 12, -4], 1.8, c1); circ(ctx, 12, -4, 2.5, c2, 1); break;
    case 'yarn': circ(ctx, 0, 0, 11, c1); ctx.strokeStyle = c2; ctx.lineWidth = 1.4; for (const a of [-0.6, 0, 0.6]) { ctx.beginPath(); ctx.ellipse(0, 0, 10, 4, a, 0, Math.PI * 2); ctx.stroke(); } break;
    case 'mask': ctx.beginPath(); ctx.moveTo(-14, -4); ctx.quadraticCurveTo(0, -10, 14, -4); ctx.quadraticCurveTo(12, 8, 0, 6); ctx.quadraticCurveTo(-12, 8, -14, -4); fillStroke(ctx, c1, INK, lw); ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(-6, -1, 3.5, 2.5, 0, 0, Math.PI * 2); ctx.ellipse(6, -1, 3.5, 2.5, 0, 0, Math.PI * 2); ctx.fill(); line(ctx, [-14, -4, -16, -8], 1.4, c2); break;
    case 'cape': ctx.beginPath(); ctx.moveTo(-5, -12); ctx.lineTo(5, -12); ctx.lineTo(13, 12); ctx.quadraticCurveTo(0, 8, -13, 12); ctx.closePath(); fillStroke(ctx, c1, INK, lw); box(ctx, -6, -14, 12, 4, 2, c2, 1); break;
    case 'wig': ctx.beginPath(); ctx.arc(0, 0, 12, Math.PI, 0); ctx.lineTo(12, 10); ctx.quadraticCurveTo(0, 4, -12, 10); ctx.closePath(); fillStroke(ctx, c1, INK, lw); ctx.strokeStyle = c2; ctx.lineWidth = 1.4; for (const x of [-6, 0, 6]) { ctx.beginPath(); ctx.moveTo(x, -10); ctx.quadraticCurveTo(x + 3, 0, x, 8); ctx.stroke(); } break;
    case 'tophat': box(ctx, -7, -13, 14, 18, 2, c1); box(ctx, -13, 4, 26, 5, 2.5, c1); ctx.fillStyle = c2; ctx.fillRect(-7, 0, 14, 3); break;
    case 'glasses': circ(ctx, -6, 0, 5.5, c1, 1.8); circ(ctx, 6, 0, 5.5, c1, 1.8); line(ctx, [-1, -1, 1, -1], 1.6, INK); ctx.fillStyle = c2; ctx.beginPath(); ctx.arc(-6, 0, 2, 0, Math.PI * 2); ctx.arc(6, 0, 2, 0, Math.PI * 2); ctx.fill(); break;
    case 'ears': ctx.strokeStyle = INK; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.arc(0, 8, 11, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 8, -4, 4.5, 6.5, s * 0.4, 0, Math.PI * 2); fillStroke(ctx, c1, INK, 1.4); ctx.beginPath(); ctx.ellipse(s * 8, -4, 2, 3.5, s * 0.4, 0, Math.PI * 2); ctx.fillStyle = c2; ctx.fill(); } break;
    case 'crown': ctx.beginPath(); ctx.moveTo(-12, 8); ctx.lineTo(-12, -6); ctx.lineTo(-6, 0); ctx.lineTo(0, -10); ctx.lineTo(6, 0); ctx.lineTo(12, -6); ctx.lineTo(12, 8); ctx.closePath(); fillStroke(ctx, c1, INK, lw); circ(ctx, 0, 3, 2.2, c2, 1); break;
    case 'wand': line(ctx, [-10, 12, 4, -2], 2.6, INK); line(ctx, [-10, 12, 4, -2], 1.4, c1); star5(ctx, 7, -6, 6, c2); break;
    case 'star': star5(ctx, 0, 0, 12, c1); circ(ctx, 0, 1, 3, c2, 1); break;
    case 'balloon': ctx.beginPath(); ctx.ellipse(-4, -3, 7, 9, -0.2, 0, Math.PI * 2); fillStroke(ctx, c1, INK, lw); ctx.beginPath(); ctx.ellipse(5, -1, 6, 8, 0.2, 0, Math.PI * 2); fillStroke(ctx, c2, INK, lw); line(ctx, [-4, 6, -2, 14], 1, INK); line(ctx, [5, 7, 3, 14], 1, INK); break;
    case 'garland': ctx.strokeStyle = INK; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-14, -8); ctx.quadraticCurveTo(0, 0, 14, -8); ctx.stroke(); for (const [x, c] of [[-9, c1], [0, c2], [9, c1]] as [number, string][]) { ctx.beginPath(); ctx.moveTo(x - 4, -5 + (x === 0 ? 2 : 0)); ctx.lineTo(x + 4, -5 + (x === 0 ? 2 : 0)); ctx.lineTo(x, 7); ctx.closePath(); fillStroke(ctx, c, INK, 1.1); } break;
    case 'horn': ctx.beginPath(); ctx.moveTo(-13, -2); ctx.lineTo(6, -5); ctx.lineTo(13, -9); ctx.lineTo(13, 9); ctx.lineTo(6, 5); ctx.lineTo(-13, 2); ctx.closePath(); fillStroke(ctx, c1, INK, lw); line(ctx, [0, -4, 0, 4], 1.4, c2); break;
    case 'lantern': box(ctx, -3, -13, 6, 3, 1, INK, 1); ctx.beginPath(); ctx.ellipse(0, 0, 10, 11, 0, 0, Math.PI * 2); fillStroke(ctx, c1, INK, lw); for (const x of [-5, 0, 5]) line(ctx, [x, -10, x, 10], 1, shade(c1, -0.2)); box(ctx, -4, 10, 8, 3, 1, c2, 1); break;
    case 'bear': circ(ctx, -7, -9, 4, c1); circ(ctx, 7, -9, 4, c1); circ(ctx, 0, -3, 8, c1); circ(ctx, 0, 9, 7, c1); ctx.fillStyle = INK; ctx.fillRect(-3, -5, 2, 2); ctx.fillRect(2, -5, 2, 2); circ(ctx, 0, -1, 1.6, c2, 0.8); break;
    case 'ball': circ(ctx, 0, 0, 12, c1); ctx.fillStyle = c2; ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(10, 0, 0, 12); ctx.quadraticCurveTo(4, 0, 0, -12); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.stroke(); break;
    case 'car': box(ctx, -13, -3, 26, 10, 3, c1); ctx.beginPath(); ctx.moveTo(-7, -3); ctx.lineTo(-4, -10); ctx.lineTo(5, -10); ctx.lineTo(8, -3); ctx.closePath(); fillStroke(ctx, c2, INK, 1.3); circ(ctx, -7, 8, 3.2, INK, 1); circ(ctx, 7, 8, 3.2, INK, 1); break;
    case 'puzzle': box(ctx, -11, -11, 22, 22, 2, c1); circ(ctx, 0, -11, 3.5, c1, 1.4); circ(ctx, 11, 0, 3.5, c2, 1.4); line(ctx, [0, -11, 0, 11], 1, INK); line(ctx, [-11, 0, 11, 0], 1, INK); break;
    case 'cards': ctx.save(); ctx.rotate(-0.25); box(ctx, -10, -12, 16, 22, 2, '#f8f9fa'); ctx.restore(); box(ctx, -4, -11, 16, 22, 2, c1); ctx.fillStyle = c2; ctx.beginPath(); ctx.moveTo(4, -5); ctx.lineTo(8, 0); ctx.lineTo(4, 5); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill(); break;
    case 'jumprope': ctx.strokeStyle = c1; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-10, -8); ctx.quadraticCurveTo(0, 22, 10, -8); ctx.stroke(); box(ctx, -12, -14, 4, 9, 2, c2, 1); box(ctx, 8, -14, 4, 9, 2, c2, 1); break;
    case 'figure': circ(ctx, 0, -8, 5, '#f1c7a0'); box(ctx, -6, -3, 12, 12, 3, c1); line(ctx, [-3, 9, -3, 14], 2.6, c2); line(ctx, [3, 9, 3, 14], 2.6, c2); break;
    case 'marbles': for (const [x, y, c] of [[-5, -4, c1], [5, -3, c2], [0, 6, '#ff8fab']] as [number, number, string][]) { circ(ctx, x, y, 5, c); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(x - 2, y - 2.5, 2, 2); } break;
    case 'battery': box(ctx, -12, -6, 22, 12, 2, c1); box(ctx, 10, -3, 3, 6, 1, '#adb5bd', 1); box(ctx, -12, -6, 7, 12, 2, c2, 1.2); break;
    case 'cable': ctx.strokeStyle = c1; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-12, 10); ctx.bezierCurveTo(-14, -8, 8, 10, 6, -6); ctx.stroke(); box(ctx, 3, -13, 7, 8, 1.5, c2, 1.2); box(ctx, -14, 8, 5, 6, 1.5, c2, 1.2); break;
    case 'bulb2': ctx.beginPath(); ctx.arc(0, -3, 9, Math.PI * 0.8, Math.PI * 2.2); ctx.lineTo(4, 7); ctx.lineTo(-4, 7); ctx.closePath(); fillStroke(ctx, c1, INK, lw); box(ctx, -4, 7, 8, 6, 1.5, c2, 1.2); break;
    case 'lights': ctx.strokeStyle = INK; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-14, -6); ctx.quadraticCurveTo(0, 6, 14, -6); ctx.stroke(); for (const [x, c] of [[-9, c1], [-3, c2], [3, '#ff8fab'], [9, '#5cc8ff']] as [number, string][]) { ctx.beginPath(); ctx.ellipse(x, Math.abs(x) * -0.2 + 3, 2.4, 3.6, 0, 0, Math.PI * 2); fillStroke(ctx, c, INK, 1); } break;
    case 'flashlight': ctx.save(); ctx.rotate(-0.4); box(ctx, -12, -4, 16, 8, 2, c1); ctx.beginPath(); ctx.moveTo(4, -4); ctx.lineTo(11, -7); ctx.lineTo(11, 7); ctx.lineTo(4, 4); ctx.closePath(); fillStroke(ctx, c1, INK, 1.4); ctx.fillStyle = c2; ctx.fillRect(10, -6, 2, 12); ctx.restore(); break;
    case 'plug': box(ctx, -9, -8, 18, 16, 4, c1); line(ctx, [-3, -8, -3, -13], 2.4, '#adb5bd'); line(ctx, [3, -8, 3, -13], 2.4, '#adb5bd'); line(ctx, [0, 8, 0, 14], 2.4, c2); break;
    case 'earbuds': ctx.strokeStyle = c2; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-6, -4); ctx.quadraticCurveTo(-2, 10, 0, 13); ctx.quadraticCurveTo(2, 10, 6, -4); ctx.stroke(); circ(ctx, -6, -7, 4, c1); circ(ctx, 6, -7, 4, c1); break;
    case 'strip': box(ctx, -14, -5, 28, 10, 3, c1); for (const x of [-8, 0, 8]) { circ(ctx, x, 0, 2.6, '#e9ecef', 1); } box(ctx, -14, -5, 5, 10, 2, c2, 1); break;
    case 'pot': ctx.beginPath(); ctx.moveTo(-11, -4); ctx.lineTo(11, -4); ctx.lineTo(8, 12); ctx.lineTo(-8, 12); ctx.closePath(); fillStroke(ctx, c1, INK, lw); box(ctx, -12, -8, 24, 5, 2, c2, 1.3); break;
    case 'seeds': box(ctx, -10, -12, 20, 24, 2, c1); circ(ctx, 0, -2, 5, c2, 1); ctx.fillStyle = '#8b5e3c'; for (const [x, y] of [[-4, 6], [0, 8], [4, 6]]) ctx.fillRect(x - 1, y - 1, 2, 2.5); break;
    case 'wateringCan': box(ctx, -9, -6, 16, 16, 3, c1); line(ctx, [7, 2, 14, -8], 3, INK); line(ctx, [7, 2, 14, -8], 1.6, c2); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(-1, -6, 6, Math.PI, 0); ctx.stroke(); break;
    case 'glove': ctx.beginPath(); ctx.moveTo(-8, 12); ctx.lineTo(-8, -2); ctx.lineTo(-12, -6); ctx.lineTo(-9, -9); ctx.lineTo(-5, -4); ctx.lineTo(-5, -12); ctx.lineTo(9, -12); ctx.lineTo(9, 12); ctx.closePath(); fillStroke(ctx, c1, INK, lw); box(ctx, -9, 8, 19, 5, 2, c2, 1.2); break;
    case 'spray': box(ctx, -6, -4, 12, 17, 3, c1); box(ctx, -4, -10, 8, 6, 1.5, c2, 1.2); line(ctx, [4, -9, 10, -9], 2.2, INK); break;
    case 'sticks': for (const x of [-6, 0, 6]) { line(ctx, [x - 2, 13, x + 2, -13], 3.2, INK); line(ctx, [x - 2, 13, x + 2, -13], 1.8, c1); } break;
    case 'pebbles': for (const [x, y, r] of [[-6, 3, 5], [5, 4, 6], [0, -5, 4.5]] as [number, number, number][]) { ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.75, 0.3, 0, Math.PI * 2); fillStroke(ctx, x > 0 ? c1 : c2, INK, 1.3); } break;
    case 'plate': ctx.beginPath(); ctx.ellipse(0, 0, 13, 9, 0, 0, Math.PI * 2); fillStroke(ctx, c1, INK, lw); ctx.beginPath(); ctx.ellipse(0, 0, 7, 4.5, 0, 0, Math.PI * 2); ctx.strokeStyle = c2; ctx.lineWidth = 1.4; ctx.stroke(); break;
    case 'glass': ctx.beginPath(); ctx.moveTo(-7, -11); ctx.lineTo(7, -11); ctx.lineTo(5, 11); ctx.lineTo(-5, 11); ctx.closePath(); fillStroke(ctx, c1, INK, lw); line(ctx, [-4, -6, -3, 6], 1.4, '#ffffff'); break;
    case 'mug': box(ctx, -9, -9, 15, 19, 3, c1); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(7, 0, 5, -Math.PI / 2, Math.PI / 2); ctx.stroke(); line(ctx, [-6, -3, 3, -3], 2, c2); break;
    case 'cutlery': line(ctx, [-6, -12, -6, 12], 2.6, c1); line(ctx, [-9, -12, -9, -5, -3, -5, -3, -12], 1.4, c1); ctx.beginPath(); ctx.ellipse(6, -7, 3.5, 5.5, 0, 0, Math.PI * 2); fillStroke(ctx, c1, INK, 1.2); line(ctx, [6, -2, 6, 12], 2.6, c1); break;
    case 'tray': box(ctx, -14, -8, 28, 16, 3, c1); box(ctx, -10, -5, 20, 10, 2, c2, 1); break;
    case 'mold': ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(12, -6); ctx.lineTo(9, 9); ctx.lineTo(-9, 9); ctx.closePath(); fillStroke(ctx, c2, INK, lw); for (let x = -8; x <= 8; x += 4) line(ctx, [x, -5, x * 0.8, 8], 1, INK); ctx.fillStyle = c1; ctx.fillRect(-12, -7, 24, 3); break;
    case 'pitcher': ctx.beginPath(); ctx.moveTo(-7, -11); ctx.lineTo(6, -11); ctx.lineTo(7, 11); ctx.lineTo(-8, 11); ctx.closePath(); fillStroke(ctx, c1, INK, lw); ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.arc(8, 0, 5, -Math.PI / 2, Math.PI / 2); ctx.stroke(); line(ctx, [-6, 2, 6, 2], 2, c2); break;
    case 'sponge': box(ctx, -12, -7, 24, 15, 3, c1); box(ctx, -12, -7, 24, 5, 2, c2, 1.2); break;
    case 'bucket': ctx.beginPath(); ctx.moveTo(-11, -6); ctx.lineTo(11, -6); ctx.lineTo(8, 12); ctx.lineTo(-8, 12); ctx.closePath(); fillStroke(ctx, c1, INK, lw); ctx.strokeStyle = c2; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, -6, 10, Math.PI, 0); ctx.stroke(); break;
    case 'broom': line(ctx, [8, -14, -2, 4], 2.8, INK); line(ctx, [8, -14, -2, 4], 1.6, c2); ctx.beginPath(); ctx.moveTo(-8, 1); ctx.lineTo(2, 5); ctx.lineTo(-2, 14); ctx.lineTo(-13, 10); ctx.closePath(); fillStroke(ctx, c1, INK, 1.4); break;
    case 'duster': line(ctx, [0, 14, 0, 0], 2.6, c2); for (const a of [-0.8, -0.3, 0.2, 0.7]) { ctx.beginPath(); ctx.ellipse(Math.sin(a) * 6, -6 + Math.abs(a) * 3, 3.5, 7, a, 0, Math.PI * 2); fillStroke(ctx, c1, INK, 1); } break;
    case 'dustpan': ctx.beginPath(); ctx.moveTo(-12, -6); ctx.lineTo(8, -6); ctx.lineTo(8, 8); ctx.lineTo(-12, 10); ctx.closePath(); fillStroke(ctx, c1, INK, lw); line(ctx, [8, 1, 14, 1], 3, c2); break;
    case 'bow': ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-12, -8); ctx.lineTo(-12, 8); ctx.closePath(); fillStroke(ctx, c1, INK, lw); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(12, -8); ctx.lineTo(12, 8); ctx.closePath(); fillStroke(ctx, c1, INK, lw); circ(ctx, 0, 0, 3, c2, 1.2); break;
    case 'gift': box(ctx, -11, -6, 22, 17, 2, c1); box(ctx, -12, -10, 24, 6, 2, c1); ctx.fillStyle = c2; ctx.fillRect(-2, -10, 4, 21); ctx.beginPath(); ctx.ellipse(-4, -12, 4, 2.5, -0.4, 0, Math.PI * 2); ctx.ellipse(4, -12, 4, 2.5, 0.4, 0, Math.PI * 2); ctx.fill(); break;
    case 'giftBag': ctx.beginPath(); ctx.moveTo(-10, -4); ctx.lineTo(10, -4); ctx.lineTo(12, 12); ctx.lineTo(-12, 12); ctx.closePath(); fillStroke(ctx, c1, INK, lw); ctx.strokeStyle = INK; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.arc(0, -4, 6, Math.PI, 0); ctx.stroke(); star5(ctx, 0, 4, 4, c2); break;
    case 'bubbles': box(ctx, -12, -10, 24, 20, 3, c1); ctx.strokeStyle = 'rgba(29,24,48,0.5)'; ctx.lineWidth = 1; for (let y = -6; y <= 6; y += 6) for (let x = -8; x <= 8; x += 6) { ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.stroke(); } break;
    default: box(ctx, -10, -10, 20, 20, 3, c1);
  }
}

function star5(ctx: Ctx, x: number, y: number, r: number, fill: string) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr2 = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); }
  ctx.closePath(); fillStroke(ctx, fill, INK, 1.2);
}
