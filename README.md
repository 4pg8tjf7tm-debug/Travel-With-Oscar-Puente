# The Worst Travel

Juego multijugador de deducción social para navegador con tres modos:

- **VIAJE**, en dos mapas de una sola planta: **BARCO · El Ferry** y **AVIÓN · El Vuelo**. Entre 4 y 12 empleados atienden al pasaje y mantienen el vehículo en marcha; uno de ellos es el **IMPOSTOR**, que sabotea, sigue una cadena secreta para conseguir un cuchillo y quiere llegar hasta el responsable del viaje (la capitana o el piloto, un personaje no jugador).
- **SUPERMERCADO**, en su propio edificio: **SÚPER · El Carrito**. Todos los trabajadores reciben el nombre de la misma comida; el impostor no la conoce. Cada uno compra un ingrediente, las compras se revelan una a una en caja y se vota.
- **CHINATOWN**, en su propio bazar: **Bazar Mil Cosas**, una tienda de artículos variados. Todos los trabajadores reciben el mismo propósito («Renovar mi habitación», «Preparar un disfraz de Halloween»…); el impostor no. Cada uno compra un artículo, se revela en caja y se defiende en la discusión.

Toda la interfaz está en español de España. El arte, los personajes, los escenarios, los textos y el sonido son originales y se generan en el propio proyecto (dibujo vectorial en Canvas 2D durante la carga y audio sintetizado con WebAudio).

## Requisitos

- Node.js **20.19 o superior** (probado con Node 22).
- Un navegador moderno con WebGL (Chrome, Edge, Firefox o Safari recientes).

## Comandos

```bash
npm install
```

```bash
npm run dev
```

Arranca el servidor de desarrollo en `http://localhost:3000` con recarga en caliente (Vite en modo *middleware* + Socket.IO en el mismo puerto).

```bash
npm run build
```

Compila el cliente en `dist/client` y el servidor en `dist/server/index.js`.

```bash
npm start
```

Sirve la compilación de producción. Variables de entorno:

| Variable | Por defecto | Uso |
| --- | --- | --- |
| `PORT` | `3000` | Puerto HTTP y WebSocket. |
| `HOST` | `0.0.0.0` | Interfaz de escucha. |
| `CLIENT_DIR` | `dist/client` | Carpeta del cliente compilado. |

El cliente se conecta siempre al mismo origen que sirve la página: no hay ninguna URL `localhost` fija, así que funciona detrás de un proxy o en cualquier plataforma que asigne el puerto por `PORT`. `GET /health` devuelve el estado del servidor.

```bash
npm test
```

Pruebas de lógica con Vitest (92 casos). Además de votos, roles, tareas idempotentes, cadena del cuchillo, críticos, reuniones, desconexiones y resolución terminal, cubren: colisión de objetos sólidos desde todos los lados y en diagonal, oclusión de estanterías altas, polígono de visión exacto junto a muros, catálogo de 100 comidas y 150 productos, privacidad de la comida (el impostor nunca la recibe), compra/devolución/entrega con autoridad del servidor, SIN APORTE sin expulsión automática, revelación en caja uno a uno con historial, rondas tras expulsar a un inocente sin repetir producto propio, victoria del impostor con un solo trabajador activo (solo en el súper), abandono del impostor, flechas de trampilla solo hacia conexiones reales, plazos absolutos que no se reinician al reconectar, secuencia de resultados también sin expulsado, tareas por trabajador y migración de salas guardadas con el antiguo mapa del tren. Desde la segunda revisión cubren además: qué cara de cada muro se ve desde cada lado (comedor, pasillo y cubierta), la superficie transitable exacta de la cubierta, la fase de cuenta 3–2–1 con plazo del servidor y sin movimiento, el grafo de prerrequisitos de todas las plantillas del cuchillo, al menos 50 rutas distintas por mapa en Normal y la memoria de rutas recientes, el catálogo del bazar (100 propósitos, 138 artículos), la privacidad del propósito, dos rondas seguidas de Chinatown y su cierre por paridad.

```bash
npm run typecheck
```

```bash
npm run validate:maps
```

Valida los cuatro planos (barco, avión, súper y bazar) y la sala de espera: una sola planta, accesibilidad a pie de todas las estaciones desde su lado accesible, holgura de las puertas, objetos dentro de su sala, trampillas, puntos de aparición, cadena del cuchillo y, en las tiendas, estanterías (ninguna vacía y solo con artículos de su edificio), caja, cola y salida.

```bash
node scripts/bots.mjs CODIGO 3
```

Une 3 clientes de prueba sin interfaz a una sala existente (útil para probar el multijugador con un solo navegador).

## Cómo jugar

- **CREAR SALA**: eliges primero el **modo** (VIAJE, SUPERMERCADO o CHINATOWN) y después el **mapa** de ese modo, las plazas (4–12) y, en el viaje, el preset de especialidades (CLÁSICO SIN ROLES, EQUILIBRADO, PERSONALIZADO). Compartes el código de 5 caracteres o el enlace (`?sala=CODIGO`).
- **UNIRSE CON CÓDIGO**: entras en una sala privada.
- **PRÁCTICA**: modo de un jugador claramente identificado, sin red (ejecuta la misma lógica del servidor dentro del navegador). Eliges mapa, bando y especialidad; en práctica también los trabajadores pueden provocar sabotajes para probarlos.
- En la **sala de espera** (vestíbulo de salidas) puedes moverte y chatear. La cabecera muestra modo, mapa, reglas y plazas; la lista de tripulación marca al anfitrión con una corona. **PERSONALIZAR** abre el vestuario (color, complemento y nombre) con vista previa y botones APLICAR/CANCELAR. Solo el anfitrión cambia ajustes (**AJUSTES DE SALA**: tarjetas MODO → MAPA y pestañas por modo) y pulsa **INICIAR** (mínimo 4 personas conectadas con el mapa cargado; cuenta atrás de 3 s).

### Supermercado

1. **Compra** (30–180 s, 90 por defecto): los trabajadores ven el nombre de la comida (solo el nombre, sin imagen ni ingredientes); el impostor ve «No conoces la comida · Dedúcela». Cada uno coge **un** producto de las estanterías (más de 100, por secciones) y lo entrega en la caja abierta. Se puede devolver a su estantería antes de entregar. Nadie ve lo que llevan los demás: solo una bolsa.
2. **Caja**: cuando todos han entregado o se agota el tiempo, cada aporte pasa por caja uno a uno (2–5 s cada uno) con el retrato de quien lo trajo. Quien no entregó aparece como **SIN APORTE**, sin expulsión automática.
3. **Discusión y votación** con el registro de aportes de todas las rondas a la vista.
4. **Resultados** siempre, también sin expulsado: NADIE HA SIDO EXPULSADO, EMPATE o SE HA SALTADO LA VOTACIÓN. Quien sale lo hace por la salida de emergencia en un carrito.
5. Si sale un inocente (o nadie), nueva compra con **la misma comida**; nadie puede repetir su propio producto. Los trabajadores ganan al expulsar al impostor; el impostor gana si queda solo con un trabajador activo. Los expulsados no compran ni votan. No hay trampillas, sabotajes ni especialidades en este modo.

### Chinatown

El mismo motor de rondas que el Supermercado, con datos propios: un bazar de una planta (paneles perforados de herramientas, ferretería, jardinería y limpieza en la pared norte; 12 góndolas de madera de dos caras con pasillos transversales entre ellas; percheros de textiles y disfraces; caja y salida), 14 secciones y 138 artículos recogibles y devolvibles (un paquete de tornillos o una tablilla cuentan como un aporte). Los trabajadores reciben uno de 100 propósitos cotidianos, solo como texto y sin lista de materiales; nada puntúa si un artículo «encaja»: se argumenta y se vota. El impostor no recibe el propósito y deduce mirando secciones, trayectos y aportes revelados. Tampoco hay especialidades, trampillas, cuchillo ni sabotajes, y el contorno de coger, devolver y entregar es amarillo para todos.

### Controles

| Acción | Teclado | Táctil |
| --- | --- | --- |
| Moverse (8 direcciones) | WASD / flechas | Joystick |
| Usar / reparar / reunión / recoger, devolver o entregar en el súper | E | USAR / RECOGER |
| Ocultarse en taquilla | E (OCULTARSE) | OCULTARSE |
| Trampilla (entrar o salir; dentro, flechas en pantalla) | V | TRAMPILLA |
| Sabotear (impostor) | X | SABOTEAR |
| Atacar al responsable (impostor, al final) | T | ATACAR |
| Habilidad | Q (configurable) | HABILIDAD |
| Mapa | M / Tab | MAPA |
| Cerrar paneles | Escape | ✕ |
| Depuración (colisiones, contorno, salas) | F3 | — |
| Depuración de visión (origen, oclusores, puertas, zona, caras de muro, polígono; cada capa por separado) | F4 | — |

Mientras escribes en el chat o manejas un minijuego no se activan acciones del mundo.

## Reglas implementadas (modo Viaje)

- Un único impostor. Gana **solo** si un sabotaje crítico agota su plazo o si ataca al responsable tras completar la cadena del arma. La dificultad del cuchillo (FÁCIL, NORMAL, DIFÍCIL o PERSONALIZADA) cambia la cadena real: 3, 5 o 7 etapas, ayudas y dispersión por el mapa. No hay asesinatos de trabajadores ni victoria por paridad.
- La cadena del cuchillo se genera con semilla del servidor en cada partida: orden de etapas (varias plantillas por longitud, todas con prerrequisitos válidos), punto de partida, lugar de documentos, llave o herramienta, compartimento, registro, cofre del arma, autorización final (dos puestos por mapa), código y su orden. La sala recuerda las 20 últimas rutas por mapa y dificultad y no las repite mientras haya alternativas; si se agotan, elige la menos reciente. Rutas distintas comprobadas generando 20 000 cadenas: barco 12 / 864 / 896 y avión 8 / 864 / 768 (Fácil / Normal / Difícil). Fácil tiene pocas porque solo son tres etapas.
- Inicio: carga de todos (máximo 15 s), tarjeta de rol (mínimo 2,5 s) y una fase **CUENTA** de 3 s con plazo del servidor que todos ven como 3–2–1; nadie se mueve hasta que termina. En la sala de espera solo hay un margen de 2 s para cancelar.
- Los trabajadores ganan expulsando al impostor o completando todas las tareas obligatorias (cantidad de tareas cortas y largas por trabajador configurable, con totales y validación de al menos una): entonces empieza la maniobra de llegada (puerto o aterrizaje), que se pausa si hay un crítico activo.
- Reuniones: convocatoria → discusión → votación (con confirmación y SALTAR) → resultados → secuencia de expulsión propia de cada mapa, que se reproduce **siempre**: sin expulsado muestra la misma escena vacía con la causa. Empate o SALTAR con el máximo: nadie es expulsado. Abstenerse no cuenta.
- Expulsados: espectadores fantasma con chat propio; pueden terminar sus tareas, no votan ni reparan.
- Sabotajes físicos (hay que ir a la instalación): apagón, comunicaciones, puertas y dos críticos distintos por mapa con reparación secuencial que una sola persona puede completar.
- Trampillas con red explícita y estados FUERA → ENTRANDO → DENTRO → VIAJANDO → SALIENDO: dentro se ven flechas grandes solo hacia las conexiones reales (sin nombres de destino), la vista se reduce al entorno inmediato y se sale con SALIR (o al agotar la estancia máxima). Taquillas para una persona con puerta animada y tiempo máximo.
- Cámaras fijas con encuadre real, oclusión y piloto visible; panel de ocupación; SIN SEÑAL con comunicaciones caídas.
- Trece especialidades opcionales con nombres canónicos idénticos en los dos mapas de viaje (7 de trabajador, 6 de impostor), todas configurables antes de iniciar.
- Un único reloj del servidor para todos los plazos (fases, compra, críticos): viajan como instantes absolutos, así que reconectar no reinicia nada.
- Chat con retrato de cada jugador hecho con el mismo compositor de personajes que el mundo, contador de caracteres, desplazamiento automático con aviso «NUEVOS MENSAJES», mensajes del sistema separados y texto siempre escapado. El impostor ve su propio nombre en rojo solo en su pantalla.
- Servidor autoritativo: el cliente solo envía intenciones. Visibilidad filtrada por observador (no se envían jugadores fuera de visión), identificadores opacos por observador (un disfraz o un señuelo no se delatan por su identificador), validación de distancia, línea de visión, prerrequisitos y duraciones mínimas en cada etapa de minijuego, acciones con identificador para descartar duplicados, reconexión con token y 30 s de margen.

## Estructura

```
src/shared/        Lógica compartida cliente/servidor
  maps/            Planos (barco, avión, súper, sala de espera), definición única de objetos, runtime de colisión/visión y validador
  market.ts        Catálogo del súper: 11 secciones, 150 productos y 100 comidas
  settings.ts      Ajustes, presets, validación y asignación de roles
  roles.ts         Trece especialidades y sus parámetros
  minigames.ts     Generación y validación de puzles de cada minijuego
  movement.ts      Paso fijo de movimiento (predicción del cliente = simulación del servidor)
  protocol.ts      Mensajes y tipos de red (versión de protocolo)
src/server/        Servidor Node.js + Socket.IO
  room/            Salas, sesiones, anfitrión, cuenta atrás, chat, sala de espera
  game/            Partida: fases, tareas, sabotajes, cuchillo, roles, visibilidad y modo Supermercado (market.ts)
src/client/        Cliente Phaser 3 (WebGL) + interfaz DOM
  art/             Guía de arte y generación de texturas (personajes y compositor único de complementos, mobiliario, productos, paisaje)
  world/           Escena del mundo: capas, predicción, interpolación, niebla con polígono exacto, contornos de interacción, cámaras
  ui/              Menús, sala, ajustes, HUD, mapa, reuniones, finales
  minigames/       Más de 30 minijuegos en Canvas 2D (tareas, reparaciones y preparación del arma)
  audio/           Sonido sintetizado (ambiente por mapa, alarmas, interfaz, música)
tests/             Pruebas de Vitest
scripts/           Validación de mapas y clientes de prueba
docs/              Arquitectura, planos dimensionales y guía de arte
```

Más detalle en [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) y [docs/GUIA_ARTE.md](docs/GUIA_ARTE.md).

## Verificación realizada y limitaciones

Comprobado en este entorno (Linux sin GPU, Chromium con SwiftShader por software):

- `npm run typecheck`, `npm test` (92 pruebas), `npm run validate:maps` (5 planos) y `npm run build` sin errores; arranque de la compilación de producción con una partida de práctica en el bazar.
- Segunda revisión, con Playwright sobre el servidor real:
  - **Capturas 1, 2 y 5 reproducidas en sus posiciones** antes y después del cambio. Antes: desde el comedor se veían la cara del muro del salón con su planta y los fogones de la cocina, y desde el pasillo, las caras y equipos de las salas de abajo. Después: cada muro solo se ilumina por el lado que da al observador (desde el norte, solo la tapa) y los muebles sin línea de visión no se dibujan. Las capas de depuración de visión (F4) confirman los tramos de muro visibles.
  - **Barco**: mar con bandas y crestas alargadas, espuma junto al casco y estela en la popa; sin islas ni círculos tipo nube; borda baja que no tapa el mar; en el rincón de la captura 5 hay cubierta continua y el parche azul ya no existe (el suelo se pinta y se pisa solo dentro de la borda).
  - **Contorno**: línea fina sobre la silueta real de la válvula de fondo y de la barra (sin cuadrado ni relleno). Cada estación está asociada a su propio objeto: las tareas junto a trampillas (cocina, máquinas, almacén) apuntan a su panel, nunca a la tapa.
  - **Cuenta 3–2–1**: registrada en el navegador con marcas de tiempo: 3, 2 y 1 a intervalos de 1000 ms, también con la compilación de producción.
  - **Giro**: muestreando la escala del cuerpo al alternar izquierda y derecha, la anchura no cambia nunca (solo el sentido).
  - **Cascos**: diadema sobre la cabeza y almohadillas a la altura de las orejas, iguales en ambas orientaciones (retratos del mismo compositor que el mundo).
  - **Muebles de cajones**: todos los frentes quedan dentro de su carcasa a cualquier anchura.
  - **Cinemáticas** de barco, avión, súper y bazar con plano de situación y puerta integrada en su pared, con y sin expulsado.
  - **Chinatown en línea con 4 navegadores**: selector de tres modos, sala y ajustes propios, impostor sin propósito y los tres trabajadores con el mismo propósito. En práctica: góndolas, paneles, iconos de artículos y tarjeta de rol.
- De la primera revisión siguen comprobados el Supermercado completo, las trampillas, la sala en línea y la vista de móvil emulada.
- Capturas en [docs/capturas](docs/capturas).

No verificado, para ser transparentes:

- **Rendimiento**: sin GPU la escena va a 3–5 FPS; no hay mediciones en un PC con GPU ni en móviles. El panel de diagnóstico (Ajustes → GRÁFICOS) muestra FPS, tiempo de fotograma y ping para medirlo en un equipo real. A tan pocos FPS tampoco se ha podido juzgar a fondo la ausencia de parpadeos al cruzar puertas: la lógica está probada, pero falta verlo en movimiento a 60 FPS.
- **Red real**: las pruebas multijugador han sido en el mismo equipo; no se ha probado con latencias de Internet ni con 12 navegadores a la vez. Las partidas completas de Chinatown (votos, segunda ronda y victoria por paridad) están cubiertas por las pruebas del servidor, no jugadas hasta el final con 4 navegadores.
- **Móvil**: solo emulado en Chromium.
- La revisión visual cubre las zonas de las capturas y otras representativas; puede haber detalles mejorables en salas concretas.
