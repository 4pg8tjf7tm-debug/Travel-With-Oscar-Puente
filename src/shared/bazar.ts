/**
 * Datos del modo CHINATOWN: un bazar de artículos variados (no un barrio).
 *
 * Artículos: ID estable, nombre en español, sección del bazar y un icono
 * dibujado por código. Unidades manejables: un paquete de tornillos o una
 * tablilla cuentan como un único aporte.
 *
 * Propósitos: 100 objetivos cotidianos y amplios. Solo se guarda el texto y
 * unas formas de contribuir posibles (para validar variedad del catálogo);
 * nunca hay una lista de materiales que puntúe a nadie.
 */
import type { Product } from './market';

export type BazarSectionId =
  | 'bz_papeleria' | 'bz_herramientas' | 'bz_ferreteria' | 'bz_organizacion' | 'bz_decoracion' | 'bz_textil' | 'bz_disfraces'
  | 'bz_fiestas' | 'bz_juguetes' | 'bz_electronica' | 'bz_jardineria' | 'bz_cocina' | 'bz_limpieza' | 'bz_regalos';

export const BAZAR_SECTIONS: { id: BazarSectionId; name: string; icon: string }[] = [
  { id: 'bz_papeleria', name: 'Papelería y manualidades', icon: 'scissors' },
  { id: 'bz_herramientas', name: 'Herramientas sencillas', icon: 'hammer' },
  { id: 'bz_ferreteria', name: 'Ferretería doméstica', icon: 'screws' },
  { id: 'bz_organizacion', name: 'Organización y almacenaje', icon: 'box' },
  { id: 'bz_decoracion', name: 'Decoración', icon: 'frame' },
  { id: 'bz_textil', name: 'Textiles y costura', icon: 'spool' },
  { id: 'bz_disfraces', name: 'Disfraces', icon: 'mask' },
  { id: 'bz_fiestas', name: 'Fiestas', icon: 'balloon' },
  { id: 'bz_juguetes', name: 'Juguetes', icon: 'bear' },
  { id: 'bz_electronica', name: 'Accesorios electrónicos', icon: 'battery' },
  { id: 'bz_jardineria', name: 'Jardinería', icon: 'pot' },
  { id: 'bz_cocina', name: 'Cocina y menaje', icon: 'plate' },
  { id: 'bz_limpieza', name: 'Limpieza', icon: 'sponge' },
  { id: 'bz_regalos', name: 'Embalaje y regalos', icon: 'gift' },
];

type Row = [id: string, name: string, shape: Product['shape'], c1: string, c2: string];

const ROWS: Record<BazarSectionId, Row[]> = {
  bz_papeleria: [
    ['cartulinas', 'Cartulinas de colores', 'paper', '#ff8fab', '#ffd23f'], ['papel_seda', 'Papel de seda', 'paper', '#c77dff', '#f8f9fa'],
    ['folios', 'Paquete de folios', 'paper', '#f8f9fa', '#5cc8ff'], ['tijeras', 'Tijeras', 'scissors', '#e63946', '#adb5bd'],
    ['pegamento', 'Pegamento de barra', 'tube', '#ffd23f', '#e63946'], ['cola_blanca', 'Cola blanca', 'bottle', '#f8f9fa', '#2f6fb3'],
    ['acrilicas', 'Pinturas acrílicas', 'paint', '#3ddc97', '#ff8a3d'], ['pinceles', 'Pinceles', 'brush', '#c9a36a', '#264653'],
    ['rotuladores', 'Rotuladores', 'markers', '#5cc8ff', '#e63946'], ['purpurina', 'Purpurina', 'jar', '#ffd23f', '#c77dff'],
    ['goma_eva', 'Goma EVA', 'paper', '#3ddc97', '#ff8fab'], ['plastilina', 'Plastilina', 'block', '#ff8a3d', '#5cc8ff'],
  ],
  bz_herramientas: [
    ['destornilladores', 'Juego de destornilladores', 'screwdriver', '#e63946', '#adb5bd'], ['martillo', 'Martillo', 'hammer', '#c9a36a', '#6c757d'],
    ['alicates', 'Alicates', 'pliers', '#2f6fb3', '#adb5bd'], ['metro', 'Cinta métrica', 'tapeMeasure', '#ffd23f', '#2b2d42'],
    ['nivel', 'Nivel de burbuja', 'level', '#ffd23f', '#3ddc97'], ['llave_inglesa', 'Llave inglesa', 'wrench', '#adb5bd', '#6c757d'],
    ['pistola_silicona', 'Pistola de silicona', 'glueGun', '#3ddc97', '#2b2d42'], ['cuter', 'Cúter', 'cutter', '#ff8a3d', '#adb5bd'],
    ['sierra', 'Sierra de mano pequeña', 'saw', '#adb5bd', '#c9a36a'],
  ],
  bz_ferreteria: [
    ['tornillos', 'Paquete de tornillos', 'screws', '#adb5bd', '#5cc8ff'], ['tacos', 'Tacos de pared', 'screws', '#f8f9fa', '#ff8a3d'],
    ['clavos', 'Caja de clavos', 'screws', '#6c757d', '#ffd23f'], ['escuadras', 'Escuadras metálicas', 'bracket', '#adb5bd', '#2b2d42'],
    ['bisagras', 'Bisagras', 'hinge', '#c9a36a', '#6c757d'], ['tiradores', 'Tiradores de mueble', 'knob', '#c9a36a', '#2b2d42'],
    ['tablillas', 'Tablillas de bricolaje', 'plank', '#d4a373', '#a77b50'], ['lija', 'Papel de lija', 'sandpaper', '#e9c46a', '#a77b50'],
    ['cola_carpintero', 'Cola de carpintero', 'bottle', '#f8f9fa', '#e9c46a'], ['cinta_americana', 'Cinta americana', 'roll', '#adb5bd', '#6c757d'],
    ['ganchos', 'Ganchos adhesivos', 'hook', '#f8f9fa', '#5cc8ff'], ['cuerda', 'Cuerda', 'rope', '#d4a373', '#a77b50'],
  ],
  bz_organizacion: [
    ['cajas_almacen', 'Cajas de almacenaje', 'box', '#5cc8ff', '#f8f9fa'], ['cestas', 'Cestas', 'basket', '#d4a373', '#a77b50'],
    ['organizador', 'Organizador de cajones', 'organizer', '#f8f9fa', '#3ddc97'], ['perchas', 'Perchas', 'hanger', '#c9a36a', '#2b2d42'],
    ['botes_tapa', 'Botes con tapa', 'jar', '#bfe3ff', '#e63946'], ['bolsas_vacio', 'Bolsas de vacío', 'bag', '#bfe3ff', '#2f6fb3'],
    ['etiquetas', 'Etiquetas', 'tag', '#f8f9fa', '#ffd23f'], ['zapatero', 'Zapatero plegable', 'shelfUnit', '#adb5bd', '#2b2d42'],
    ['portalapices', 'Portalápices', 'cup', '#2f6fb3', '#ffd23f'], ['archivador', 'Archivador', 'binder', '#e63946', '#f8f9fa'],
  ],
  bz_decoracion: [
    ['marcos', 'Marcos de fotos', 'frame', '#c9a36a', '#bfe3ff'], ['cojines', 'Cojines', 'cushion', '#ff8fab', '#c77dff'],
    ['velas', 'Velas', 'candle', '#f8f3e8', '#ffd23f'], ['espejo', 'Espejo pequeño', 'mirror', '#bfe3ff', '#c9a36a'],
    ['jarron', 'Jarrón', 'vase', '#2a9d8f', '#e9c46a'], ['laminas', 'Láminas decorativas', 'frame', '#2b2d42', '#ff8a3d'],
    ['planta_artificial', 'Planta artificial', 'herb', '#3ddc97', '#2a9d8f'], ['vinilos', 'Vinilos de pared', 'paper', '#264653', '#ffd23f'],
    ['portavelas', 'Portavelas', 'cup', '#bfe3ff', '#ffd23f'], ['reloj_pared', 'Reloj de pared', 'clock', '#f8f9fa', '#e63946'],
  ],
  bz_textil: [
    ['telas', 'Retales de tela', 'fabric', '#e63946', '#ffd23f'], ['hilo', 'Bobinas de hilo', 'spool', '#5cc8ff', '#c9a36a'],
    ['botones', 'Botones surtidos', 'buttons', '#ff8a3d', '#3ddc97'], ['cremalleras', 'Cremalleras', 'zipper', '#2b2d42', '#adb5bd'],
    ['cinta_raso', 'Cinta de raso', 'roll', '#ff8fab', '#f8f9fa'], ['fieltro', 'Fieltro', 'fabric', '#3ddc97', '#264653'],
    ['imperdibles', 'Agujas e imperdibles', 'pins', '#adb5bd', '#e63946'], ['lana', 'Ovillo de lana', 'yarn', '#c77dff', '#ff8fab'],
    ['parches', 'Parches para planchar', 'patch', '#ffd23f', '#2f6fb3'],
  ],
  bz_disfraces: [
    ['mascaras', 'Máscaras', 'mask', '#f8f9fa', '#e63946'], ['capas', 'Capas', 'cape', '#2b2d42', '#e63946'],
    ['pelucas', 'Pelucas', 'wig', '#ff8a3d', '#c77dff'], ['sombrero_disfraz', 'Sombreros de disfraz', 'tophat', '#2b2d42', '#c77dff'],
    ['maquillaje', 'Maquillaje de fantasía', 'paint', '#f8f9fa', '#3ddc97'], ['gafas_divertidas', 'Gafas divertidas', 'glasses', '#ff8fab', '#2b2d42'],
    ['orejas', 'Diadema con orejas', 'ears', '#c9a36a', '#ff8fab'], ['corona', 'Corona de juguete', 'crown', '#ffd23f', '#e63946'],
    ['varita', 'Varita mágica', 'wand', '#c77dff', '#ffd23f'],
  ],
  bz_fiestas: [
    ['globos', 'Globos', 'balloon', '#e63946', '#5cc8ff'], ['guirnaldas', 'Guirnaldas de banderines', 'garland', '#ffd23f', '#3ddc97'],
    ['confeti', 'Confeti', 'jar', '#ff8fab', '#ffd23f'], ['velas_cumple', 'Velas de cumpleaños', 'candle', '#5cc8ff', '#ff8fab'],
    ['platos_papel', 'Platos de papel', 'plate', '#ffd23f', '#e63946'], ['vasos_papel', 'Vasos de papel', 'cup', '#ff8fab', '#f8f9fa'],
    ['mantel_fiesta', 'Mantel de fiesta', 'fabric', '#5cc8ff', '#ffd23f'], ['pinata', 'Piñata', 'star', '#ff8fab', '#ffd23f'],
    ['matasuegras', 'Matasuegras', 'horn', '#3ddc97', '#ffd23f'], ['farolillos', 'Farolillos de papel', 'lantern', '#ff8a3d', '#ffd23f'],
  ],
  bz_juguetes: [
    ['peluche', 'Peluche', 'bear', '#c9a36a', '#ff8fab'], ['pelota', 'Pelota', 'ball', '#e63946', '#f8f9fa'],
    ['cochecito', 'Cochecito', 'car', '#2f6fb3', '#ffd23f'], ['puzle', 'Puzle', 'puzzle', '#3ddc97', '#ff8a3d'],
    ['baraja', 'Baraja de cartas', 'cards', '#f8f9fa', '#e63946'], ['comba', 'Cuerda de saltar', 'jumprope', '#ff8fab', '#5cc8ff'],
    ['pompas', 'Pompas de jabón', 'bottle', '#bfe3ff', '#c77dff'], ['munecos', 'Muñecos', 'figure', '#ffd23f', '#2f6fb3'],
    ['juego_mesa', 'Juego de mesa', 'box', '#264653', '#ffd23f'], ['canicas', 'Canicas', 'marbles', '#5cc8ff', '#3ddc97'],
  ],
  bz_electronica: [
    ['pilas', 'Pilas', 'battery', '#2b2d42', '#ffd23f'], ['cable_usb', 'Cable USB', 'cable', '#f8f9fa', '#2b2d42'],
    ['alargador', 'Alargador', 'cable', '#f8f9fa', '#e63946'], ['bombilla', 'Bombilla', 'bulb2', '#fff3b0', '#adb5bd'],
    ['luces_led', 'Tira de luces LED', 'lights', '#ffd23f', '#3ddc97'], ['linterna', 'Linterna', 'flashlight', '#e63946', '#ffd23f'],
    ['cargador', 'Cargador', 'plug', '#f8f9fa', '#2b2d42'], ['auriculares_cable', 'Auriculares con cable', 'earbuds', '#f8f9fa', '#5cc8ff'],
    ['regleta', 'Regleta', 'strip', '#f8f9fa', '#e63946'],
  ],
  bz_jardineria: [
    ['macetas', 'Macetas', 'pot', '#e07a5f', '#a0522d'], ['semillas', 'Sobres de semillas', 'seeds', '#3ddc97', '#ffd23f'],
    ['tierra', 'Saco de tierra', 'bag', '#8b5e3c', '#3ddc97'], ['regadera', 'Regadera', 'wateringCan', '#3ddc97', '#2a9d8f'],
    ['guantes_jardin', 'Guantes de jardín', 'glove', '#ff8a3d', '#3ddc97'], ['pulverizador', 'Pulverizador', 'spray', '#5cc8ff', '#f8f9fa'],
    ['tutores', 'Tutores de bambú', 'sticks', '#d4a373', '#a77b50'], ['piedras', 'Piedras decorativas', 'pebbles', '#adb5bd', '#f8f9fa'],
    ['platos_maceta', 'Platos de maceta', 'plate', '#e07a5f', '#a0522d'],
  ],
  bz_cocina: [
    ['platos', 'Platos', 'plate', '#f8f9fa', '#2f6fb3'], ['vasos', 'Vasos', 'glass', '#bfe3ff', '#f8f9fa'],
    ['tazas', 'Tazas', 'mug', '#e63946', '#f8f9fa'], ['cubiertos', 'Juego de cubiertos', 'cutlery', '#adb5bd', '#6c757d'],
    ['taper', 'Táperes', 'tub', '#bfe3ff', '#3ddc97'], ['bandeja', 'Bandeja', 'tray', '#c9a36a', '#a77b50'],
    ['moldes', 'Moldes de repostería', 'mold', '#ff8fab', '#adb5bd'], ['trapos', 'Trapos de cocina', 'fabric', '#f8f9fa', '#e63946'],
    ['salvamanteles', 'Salvamanteles', 'patch', '#d4a373', '#a77b50'], ['jarra', 'Jarra', 'pitcher', '#bfe3ff', '#2f6fb3'],
  ],
  bz_limpieza: [
    ['esponjas', 'Esponjas', 'sponge', '#ffd23f', '#3ddc97'], ['bayetas', 'Bayetas', 'fabric', '#5cc8ff', '#ffd23f'],
    ['cubo', 'Cubo', 'bucket', '#2f6fb3', '#adb5bd'], ['escoba', 'Escoba pequeña', 'broom', '#e63946', '#c9a36a'],
    ['guantes_goma', 'Guantes de goma', 'glove', '#ffd23f', '#ff8a3d'], ['bolsas_basura', 'Bolsas de basura', 'bag', '#2b2d42', '#6c757d'],
    ['plumero', 'Plumero', 'duster', '#c77dff', '#c9a36a'], ['recogedor', 'Recogedor', 'dustpan', '#3ddc97', '#2b2d42'],
    ['ambientador', 'Ambientador', 'spray', '#ff8fab', '#f8f9fa'],
  ],
  bz_regalos: [
    ['papel_regalo', 'Papel de regalo', 'paper', '#e63946', '#3ddc97'], ['lazos', 'Lazos', 'bow', '#e63946', '#ffd23f'],
    ['cajas_regalo', 'Cajas de regalo', 'gift', '#c77dff', '#ffd23f'], ['bolsas_regalo', 'Bolsas de regalo', 'giftBag', '#ff8fab', '#ffd23f'],
    ['tarjetas', 'Tarjetas de felicitación', 'card', '#f8f9fa', '#e63946'], ['cinta_regalo', 'Cinta de regalo', 'roll', '#ffd23f', '#e63946'],
    ['cajas_carton', 'Cajas de cartón', 'box', '#c9a36a', '#a77b50'], ['papel_burbujas', 'Papel de burbujas', 'bubbles', '#bfe3ff', '#f8f9fa'],
    ['celo', 'Celo', 'roll', '#bfe3ff', '#adb5bd'], ['etiquetas_regalo', 'Etiquetas de regalo', 'tag', '#3ddc97', '#e63946'],
  ],
};

/** Artículos del bazar (ID con prefijo «b_» para no chocar con los del súper). */
export const BAZAR_PRODUCTS: Product[] = (Object.entries(ROWS) as [BazarSectionId, Row[]][]).flatMap(([section, rows]) =>
  rows.map(([id, name, shape, c1, c2]) => ({ id: `b_${id}`, name, section, shape, c1, c2 })));

/** Formas de contribuir a un propósito (solo para comprobar que el catálogo deja variedad). */
export type Contribution = 'herramienta' | 'material' | 'decoracion' | 'organizacion' | 'presentacion' | 'proteccion' | 'detalle';

export interface Purpose { id: string; name: string; ways: Contribution[] }

const ALL: Contribution[] = ['herramienta', 'material', 'decoracion', 'organizacion', 'presentacion', 'proteccion', 'detalle'];

const PURPOSE_NAMES: string[] = [
  'Preparar un disfraz de Halloween', 'Preparar un disfraz de carnaval', 'Montar una pequeña obra de teatro', 'Crear un personaje para una fiesta de disfraces',
  'Preparar una fiesta de cumpleaños infantil', 'Preparar una fiesta sorpresa', 'Decorar una fiesta de Halloween', 'Decorar una fiesta de Navidad',
  'Preparar una fiesta de Nochevieja', 'Organizar una fiesta de verano', 'Preparar una merienda con amigos', 'Preparar una cena especial en casa',
  'Organizar una reunión familiar', 'Montar una fiesta de pijamas', 'Crear una zona de fotos para una fiesta', 'Preparar un regalo para un niño',
  'Preparar un regalo para un adolescente', 'Preparar un regalo para mis abuelos', 'Preparar un regalo para mi pareja', 'Preparar un regalo para un amigo',
  'Preparar una caja de recuerdos', 'Envolver un regalo de forma original', 'Preparar un regalo hecho a mano', 'Crear una sorpresa para un cumpleaños',
  'Preparar un regalo de amigo invisible', 'Renovar mi habitación', 'Decorar el salón', 'Organizar mi escritorio',
  'Mejorar mi rincón de estudio', 'Montar una zona para jugar a videojuegos', 'Preparar un rincón de lectura', 'Decorar una habitación infantil',
  'Organizar el armario', 'Ordenar los juguetes', 'Aprovechar un rincón pequeño de casa', 'Construir un armario',
  'Montar una estantería', 'Renovar una mesilla de noche', 'Arreglar un cajón', 'Reparar una silla',
  'Renovar una mesa', 'Colgar un cuadro', 'Preparar una pared para decorarla', 'Organizar el recibidor',
  'Mejorar el almacenaje del baño', 'Organizar los utensilios de cocina', 'Ordenar los cables de casa', 'Preparar una zona para dejar los zapatos',
  'Crear un organizador de pared', 'Preparar una mudanza', 'Hacer una maqueta para clase', 'Preparar un mural escolar',
  'Hacer una manualidad para regalar', 'Crear un álbum de fotos', 'Personalizar una libreta', 'Decorar una camiseta',
  'Personalizar una mochila', 'Hacer una máscara', 'Crear una figura decorativa', 'Preparar un taller de pintura',
  'Montar una tarde de manualidades', 'Crear un juego de mesa casero', 'Preparar una búsqueda del tesoro', 'Montar una pequeña feria de juegos',
  'Preparar un concurso con amigos', 'Construir un escondite de juego en casa', 'Preparar una tarde de cine', 'Montar un espectáculo de magia casero',
  'Crear un escenario para grabar vídeos', 'Preparar una sesión de fotos casera', 'Decorar un balcón', 'Preparar una pequeña zona de plantas',
  'Renovar unas macetas', 'Organizar una terraza', 'Preparar un pícnic', 'Preparar una excursión',
  'Preparar un día de playa', 'Preparar una tarde en la piscina', 'Organizar una acampada de juego en casa', 'Preparar actividades para un día de lluvia',
  'Crear un calendario de tareas', 'Montar un tablón de recordatorios', 'Preparar un horario para estudiar', 'Organizar el material de clase',
  'Guardar documentos importantes', 'Preparar un puesto para un mercadillo', 'Montar una pequeña exposición de trabajos', 'Preparar un concurso de disfraces',
  'Hacer una pancarta para animar a un equipo', 'Preparar una celebración de fin de curso', 'Arreglar un peluche', 'Preparar una casita de juguete',
  'Organizar una colección', 'Restaurar una caja vieja', 'Renovar un espejo decorativo', 'Crear adornos para una puerta',
  'Hacer una guirnalda', 'Preparar detalles para invitados', 'Montar un pequeño taller de bricolaje', 'Preparar un rincón para escuchar música',
];

/** Catálogo de 100 propósitos con ID estable (pXXX). Todos admiten varias formas de contribuir. */
export const PURPOSES: Purpose[] = PURPOSE_NAMES.map((name, i) => ({ id: `p${String(i + 1).padStart(3, '0')}`, name, ways: ALL }));
export const PURPOSE_BY_ID: Record<string, Purpose> = Object.fromEntries(PURPOSES.map((p) => [p.id, p]));

/** Secciones que suelen servir a cada forma de contribuir (validación de variedad, nunca puntuación). */
export const WAY_SECTIONS: Record<Contribution, BazarSectionId[]> = {
  herramienta: ['bz_herramientas', 'bz_ferreteria', 'bz_papeleria', 'bz_jardineria', 'bz_limpieza'],
  material: ['bz_papeleria', 'bz_ferreteria', 'bz_textil', 'bz_jardineria'],
  decoracion: ['bz_decoracion', 'bz_fiestas', 'bz_disfraces', 'bz_electronica'],
  organizacion: ['bz_organizacion', 'bz_ferreteria', 'bz_cocina'],
  presentacion: ['bz_regalos', 'bz_decoracion', 'bz_fiestas', 'bz_cocina'],
  proteccion: ['bz_limpieza', 'bz_regalos', 'bz_organizacion', 'bz_jardineria'],
  detalle: ['bz_juguetes', 'bz_decoracion', 'bz_textil', 'bz_regalos', 'bz_electronica'],
};

/** Elige el propósito de una partida nueva evitando los recientes de la sala. */
export function pickPurpose(rnd: () => number, recent: string[]): Purpose {
  let pool = PURPOSES.filter((p) => !recent.includes(p.id));
  if (!pool.length) pool = PURPOSES;
  return pool[Math.floor(rnd() * pool.length) % pool.length];
}
