/* Pistacho Imperium: Risk de bolsillo con pistachos sobre un mapa esquemático de España.
 * 17 comunidades y 2 ciudades autónomas, 5 zonas con bonus, dados 3 contra 2 con empate para el defensor, un robot con tres niveles.
 * Diseño aprobado en DISENO.md (cambio de mapa pedido por quien aprueba el 26/10/2026). Las reglas son funciones puras:
 * la misma lógica corre en la partida y en headless(). */
(function () {
  'use strict';
  const { $, esc, T, REDUCE, sound } = GK;

  // ── Idioma: ES por defecto; EN con ?lang=en o con la elección guardada. Se decide al cargar (cambiar de idioma recarga la página),
  // así que los textos pueden calcularse una vez con lg(español, inglés).
  const LANG_KEY = 'pistacho_lang';
  let lang = 'es';
  try { const q = new URLSearchParams(location.search).get('lang'), sv = localStorage.getItem(LANG_KEY); lang = (q === 'en' || q === 'es') ? q : (sv === 'en' ? 'en' : 'es'); } catch (e) { /* sin almacenamiento: español */ }
  const lg = (es, en) => lang === 'en' ? en : es;

  /* MAPA:INICIO (generado por investigacion/mapa_export.py, no editar a mano) */
const MAPA = {"regions":[{"name":"Galicia","code":"GAL","zone":0,"c":[-2.36,1.857],"poly":[[-0.597,0.172],[-0.118,0.569],[0.179,0.537],[0.589,-0.334],[0.542,-0.424],[0.317,-0.424],[-0.075,-0.509],[-0.336,-0.396],[-0.423,-0.055]]},{"name":"Asturias","code":"AST","zone":0,"c":[-1.704,2.073],"poly":[[-0.477,0.321],[-0.253,0.297],[0.269,0.297],[0.506,0.271],[0.049,-0.465],[-0.067,-0.55]]},{"name":"Cantabria","code":"CTB","zone":0,"c":[-1.126,1.865],"poly":[[-0.072,0.479],[-0.068,0.478],[0.601,-0.223],[-0.529,-0.257]]},{"name":"País Vasco","code":"PV","zone":0,"c":[-0.499,2.026],"poly":[[-0.695,0.317],[-0.153,0.258],[0.325,0.23],[0.522,0.218],[0.514,0.091],[0.167,-0.458],[-0.026,-0.384]]},{"name":"Navarra","code":"NAV","zone":1,"c":[0.736,1.88],"poly":[[-0.713,0.364],[-0.432,0.348],[-0.214,0.149],[0.264,0.036],[0.655,0.036],[0.981,-0.078],[1.064,-0.107],[1.063,-0.108],[-0.22,-0.263],[-0.721,0.237]]},{"name":"La Rioja","code":"RIO","zone":1,"c":[0.059,1.549],"poly":[[-0.391,0.019],[-0.044,0.568],[0.457,0.068],[-0.084,-0.616]]},{"name":"Aragón","code":"ARA","zone":1,"c":[0.755,1.168],"poly":[[-0.78,-0.235],[-0.239,0.449],[1.044,0.604],[-0.046,-0.622],[-0.425,-0.652],[-0.744,-0.407],[-0.771,-0.333]]},{"name":"Cataluña","code":"CAT","zone":1,"c":[1.608,1.126],"poly":[[0.192,0.647],[0.349,0.591],[0.87,0.506],[0.827,0.279],[0.566,0.052],[0.044,-0.175],[-0.173,-0.402],[-0.478,-0.743],[-0.513,-0.824],[-0.899,-0.58],[0.191,0.646]]},{"name":"Castilla y León","code":"CYL","zone":2,"c":[-0.95,0.975],"poly":[[-0.865,-0.01],[-0.659,0.259],[-0.833,0.458],[-0.868,0.458],[-0.821,0.548],[-0.705,0.633],[0.425,0.667],[0.618,0.593],[0.925,-0.042],[0.934,-0.14],[0.089,-0.759],[-0.203,-0.952]]},{"name":"Madrid","code":"MAD","zone":2,"c":[-0.289,0.604],"poly":[[-0.572,-0.388],[0.273,0.231],[0.3,0.157]]},{"name":"Castilla-La Mancha","code":"CLM","zone":2,"c":[-0.335,-0.12],"poly":[[0.364,-0.81],[-0.928,-0.338],[-0.818,0.143],[-0.526,0.336],[0.346,0.881],[0.665,0.636],[0.632,-0.364]]},{"name":"Extremadura","code":"EXT","zone":2,"c":[-1.691,-0.165],"poly":[[-0.426,-1.098],[-0.439,-1.098],[-0.483,-0.644],[-0.266,-0.474],[-0.352,-0.19],[-0.222,0.037],[-0.396,0.321],[-0.222,0.491],[-0.179,1.059],[-0.124,1.13],[0.538,0.188],[0.428,-0.293]]},{"name":"Andalucía","code":"AND","zone":3,"c":[-0.958,-1.173],"poly":[[1.167,-0.296],[0.958,-0.374],[0.523,-0.345],[0.132,-0.374],[-0.259,-0.657],[-0.39,-0.771],[-0.694,-0.487],[-0.955,-0.09],[-1.159,-0.09],[-0.305,0.715],[0.987,0.243]]},{"name":"Murcia","code":"MUR","zone":3,"c":[0.417,-0.909],"poly":[[0.511,0.314],[0.453,0.27],[0.279,-0.127],[-0.113,-0.524],[-0.208,-0.56],[-0.388,-0.021],[-0.12,0.425]]},{"name":"Comunidad Valenciana","code":"VAL","zone":3,"c":[0.68,-0.038],"poly":[[0.415,0.34],[0.277,0.024],[0.494,-0.373],[0.248,-0.557],[-0.383,-0.446],[-0.35,0.554],[0.029,0.584]]},{"name":"Baleares","code":"BAL","zone":4,"c":[2.207,0.003],"poly":[[-0.598,0.267],[0.402,0.295],[0.793,0.153],[0.271,-0.301],[-0.511,-0.358]]},{"name":"Canarias","code":"CNR","zone":4,"c":[-2.32,-2.182],"poly":[[-0.68,-0.159],[-0.158,-0.244],[0.624,-0.102],[0.581,0.181],[-0.332,0.238]]},{"name":"Ceuta","code":"CEU","zone":4,"c":[-1.283,-2.27],"poly":[[-0.195,-0.156],[0.196,-0.156],[0.196,0.156],[-0.195,0.156]]},{"name":"Melilla","code":"MEL","zone":4,"c":[-0.282,-2.27],"poly":[[-0.196,-0.156],[0.195,-0.156],[0.195,0.156],[-0.196,0.156]]}],"edges":[[0,1],[0,8],[1,2],[1,8],[2,3],[2,8],[3,4],[3,5],[3,8],[4,5],[4,6],[5,6],[5,8],[6,7],[6,8],[6,10],[6,14],[7,14],[7,15],[8,9],[8,10],[8,11],[9,10],[10,11],[10,12],[10,13],[10,14],[11,12],[12,13],[12,16],[12,17],[12,18],[13,14],[14,15]],"sea":[[15,7],[15,14],[16,12],[17,12],[18,12]],"zones":[{"name":"Norte","bonus":2},{"name":"Ebro","bonus":2},{"name":"Centro","bonus":3},{"name":"Sur y Levante","bonus":2},{"name":"Islas y ciudades","bonus":2}]};
/* MAPA:FIN */

  // ── Configuración y contenido ───────────────────────────────────────────────
  const N = MAPA.regions.length, ROUNDS = 6, ROBOT_EXTRA_TURNS = 1, MAX_ROBOT_ATTACKS = 5, DIVISOR = 2;
  const ZONES = MAPA.zones, ZCOL = ['#9DBFA9', '#E3C08C', '#D9A07C', '#E6CD73', '#9FB7D9'];
  const CONFIG = {
    title: lg('Aquí el pistacho se cultiva, no se importa.', 'Here pistachios are grown, not imported.'),
    rules: [
      lg('Cada turno te dan plantones: plántalos en tus territorios.', 'Each turn you get saplings: plant them in your territories.'),
      lg('Ataca los territorios del robot tirando dados. Con ventaja, casi siempre ganas.', "Attack the robot's territories by rolling dice. With an edge, you almost always win."),
      lg('Una zona entera da plantones extra. Al acabar la ronda 6, gana quien tenga más territorios.', 'A whole zone gives bonus saplings. When round 6 ends, whoever holds more territories wins.'),
    ],
    note: lg('Demo de Landbot. Vergel es una marca inventada: el descuento y la compra son simulados. Mapa esquemático, no a escala. Los datos del final llevan su fuente.', 'Landbot demo. Vergel is an invented brand: the discount and the purchase are simulated. Schematic map, not to scale. The facts at the end give their source.'),
    storageKey: 'pistacho_tut',
    cta: { text: lg('Cultivamos, recogemos y envasamos. Del campo a tu mesa.', 'We grow, harvest and pack. From field to table.') },
    // Premio: ganar al robot da un 5 % de descuento SIMULADO en Vergel (marca inventada): el código no existe en ninguna tienda.
    prize: { pct: 5, code: 'VERGEL5' },
    // Cierre: conversación de Landbot con el resultado de la partida. SUSTITUIR: pon aquí la URL de config de TU bot (config y configEn) y tu enlace de reserva; vacío = el final enseña solo el enlace. Ver landbot/README.md.
    chat: { lib: 'https://cdn.landbot.io/landbot-3/landbot-3.0.0.mjs', config: '', configEn: '', book: 'https://example.com/reserva' },
  };
  const TEAMS = {
    es: { name: 'Pistacho español', adj: lg('verdes', 'green'), main: '#8DB255', ink: '#1D2B22', body: '#6E9140', leaf: '#3E6B1E', trunk: '#1D2B22', say: lg(['Aquí plantamos, no importamos.', 'Del árbol al bote.', 'Esto sabe a pistacho de verdad.', 'Mis raíces llegan hasta aquí.'], ["We plant here, we don't import.", 'From tree to jar.', 'This tastes like real pistachio.', 'My roots reach all the way here.']) },
    ca: { name: 'Pistacho californiano', adj: lg('violetas', 'purple'), main: '#3E2C5B', ink: '#F3F5EC', body: '#251a3a', leaf: '#E5484D', trunk: '#F3F5EC', say: lg(['Mis pistachos son más grandes.', '¿A eso le llamas pistacho?', 'Aquí todo es XXL.', 'Este territorio ya es mío.'], ['My pistachios are bigger.', 'You call that a pistachio?', 'Everything here is XXL.', 'This territory is already mine.']) },
  };
  const LEVELS = [{ name: lg('Cauto', 'Cautious'), thr: 2 }, { name: lg('Medio', 'Medium'), thr: 1 }, { name: lg('Agresivo', 'Aggressive'), thr: 0 }];
  const FACTS = [
    { t: lg('Europa consume el 25 % del pistacho del mundo y produce menos del 1 %.', "Europe consumes 25% of the world's pistachios and produces less than 1%."), s: lg('Europistachios, cifra de la propia empresa (gextia.com)', "Europistachios, the company's own figure (gextia.com)") },
    { t: lg('España produce unas 5.500 toneladas de pistacho: el 0,8 % del mundo.', 'Spain produces about 5,500 tonnes of pistachios: 0.8% of the world total.'), s: lg('CIAG, Castilla-La Mancha (promedio de los dos últimos años)', 'CIAG, Castilla-La Mancha (average of the last two years)') },
    { t: lg('Castilla-La Mancha concentra algo más del 72 % de las 84.500 hectáreas de pistachero de España.', "Castilla-La Mancha holds just over 72% of Spain's 84,500 hectares of pistachio trees."), s: lg('agronewscastillayleon.com, datos Sigpac 2024', 'agronewscastillayleon.com, Sigpac 2024 data') },
    { t: lg('Estados Unidos produce cerca del 43 % del pistacho mundial.', "The United States produces close to 43% of the world's pistachios."), s: lg('USDA vía mundus-agri.eu, campaña 2024/25', 'USDA via mundus-agri.eu, 2024/25 season') },
    { t: lg('El Kerman, la variedad de California, viene de Irán: Whitehouse lo recogió allí en 1929.', "The Kerman, California's variety, comes from Iran: Whitehouse collected it there in 1929."), s: lg('americanpistachios.org y atlasobscura.com; las fechas del reparto varían según la fuente', 'americanpistachios.org and atlasobscura.com; the dates of the distribution vary by source') },
  ];

  // ── Reglas (puras) ──────────────────────────────────────────────────────────
  const NB = Array.from({ length: N }, () => []);
  // las aristas ya incluyen los enlaces por mar: sin repetir, para que cada vecina cuente una sola vez (como en sim3.py)
  MAPA.edges.concat(MAPA.sea).forEach(([a, b]) => { if (!NB[a].includes(b)) NB[a].push(b); if (!NB[b].includes(a)) NB[b].push(a); });
  const REN = { GAL: 'Galicia', AST: 'Asturias', CTB: 'Cantabria', PV: 'Basque Country', NAV: 'Navarre', RIO: 'La Rioja', ARA: 'Aragon', CAT: 'Catalonia', CYL: 'Castile and Leon', MAD: 'Madrid', CLM: 'Castilla-La Mancha', EXT: 'Extremadura', AND: 'Andalusia', MUR: 'Murcia', VAL: 'Valencian Community', BAL: 'Balearic Islands', CNR: 'Canary Islands', CEU: 'Ceuta', MEL: 'Melilla' };
  const ZEN = ['North', 'Ebro', 'Centre', 'South and Levante', 'Islands and cities'];
  const nameOf = (i) => lang === 'en' ? REN[MAPA.regions[i].code] : MAPA.regions[i].name;
  const zname = (k) => lang === 'en' ? ZEN[k] : ZONES[k].name;
  const zoneMembers = ZONES.map((_, z) => MAPA.regions.map((r, i) => r.zone === z ? i : -1).filter(i => i >= 0));
  const zoneFull = (own, z, p) => zoneMembers[z].every(i => own[i] === p);
  const count = (own, p) => own.filter(o => o === p).length;
  const zonesBonus = (own, p) => ZONES.reduce((s, z, k) => s + (zoneFull(own, k, p) ? z.bonus : 0), 0);
  const reinf = (own, p) => Math.max(3, Math.floor(count(own, p) / DIVISOR)) + zonesBonus(own, p);
  const d6 = () => 1 + Math.floor(Math.random() * 6);
  // Una tirada: a atacantes (hasta 3 dados) contra d defensores (hasta 2). El empate lo gana el defensor.
  function rollRound(a, d) {
    const ad = [], dd = [];
    for (let k = 0; k < Math.min(3, a); k++) ad.push(d6());
    for (let k = 0; k < Math.min(2, d); k++) dd.push(d6());
    ad.sort((x, y) => y - x); dd.sort((x, y) => y - x);
    let la = 0, ld = 0; const pairs = [];
    for (let k = 0; k < Math.min(ad.length, dd.length); k++) { const att = ad[k] > dd[k]; if (att) ld++; else la++; pairs.push({ a: ad[k], d: dd[k], att }); }
    return { ad, dd, pairs, la, ld };
  }
  // Una tirada sobre el tablero: ataca la comunidad i (deja una tropa en casa) a la j. Si j se queda sin tropas, la ocupan las supervivientes.
  function applyRound(own, arm, i, j) {
    const r = rollRound(arm[i] - 1, arm[j]); arm[i] -= r.la; arm[j] -= r.ld; r.conq = false;
    if (arm[j] <= 0) { arm[j] = arm[i] - 1; arm[i] = 1; own[j] = own[i]; r.conq = true; }
    return r;
  }
  // Probabilidad exacta de ganar la comunidad atacando con a contra d (suma sobre los 6^5 resultados de dados).
  const dist = {}, pwm = {};
  function roundDist(na, nd) {
    const key = na * 10 + nd; if (dist[key]) return dist[key];
    const tot = Math.pow(6, na + nd), acc = {};
    for (let n = 0; n < tot; n++) {
      let x = n; const ad = [], dd = [];
      for (let k = 0; k < na; k++) { ad.push(x % 6); x = Math.floor(x / 6); }
      for (let k = 0; k < nd; k++) { dd.push(x % 6); x = Math.floor(x / 6); }
      ad.sort((p, q) => q - p); dd.sort((p, q) => q - p);
      let la = 0, ld = 0; for (let k = 0; k < Math.min(na, nd); k++) { if (ad[k] > dd[k]) ld++; else la++; }
      const kk = la + ',' + ld; acc[kk] = (acc[kk] || 0) + 1;
    }
    return (dist[key] = Object.entries(acc).map(([k, v]) => { const [la, ld] = k.split(',').map(Number); return { la, ld, p: v / tot }; }));
  }
  function pwin(a, d) {
    if (d <= 0) return 1; if (a <= 0) return 0; const k = a + ',' + d; if (k in pwm) return pwm[k];
    let s = 0; for (const o of roundDist(Math.min(3, a), Math.min(2, d))) s += o.p * pwin(a - o.la, d - o.ld); return (pwm[k] = s);
  }
  // Robot: refuerza donde más amenaza hay respecto a lo que tiene; ataca si la ventaja llega al umbral del nivel.
  function botPlace(own, arm, p) {
    let best = -1, bs = 1e9;
    for (let i = 0; i < N; i++) { if (own[i] !== p) continue; const en = NB[i].filter(j => own[j] !== p); if (!en.length) continue;
      const s = en.reduce((a, j) => a + arm[j], 0) - arm[i]; if (s < bs) { bs = s; best = i; } }
    return best;
  }
  function botAttack(own, arm, p, thr) {
    let best = null;
    for (let i = 0; i < N; i++) { if (own[i] !== p || arm[i] < 2) continue;
      for (const j of NB[i]) if (own[j] !== p && arm[i] - 1 >= arm[j] + thr) { const sc = (arm[i] - 1) - arm[j]; if (!best || sc > best.sc) best = { sc, i, j }; } }
    return best;
  }
  // Pasar plantas: una vez por turno, de un territorio sin enemigos a uno propio pegado a él que sí los tenga (lo que hace el robot).
  function fortifyPick(own, arm, p) {
    let best = null;
    for (let i = 0; i < N; i++) { if (own[i] !== p || arm[i] < 2 || NB[i].some(j => own[j] !== p)) continue;
      for (const j of NB[i]) if (own[j] === p && NB[j].some(k => own[k] !== p) && (!best || arm[i] > best.a)) best = { a: arm[i], i, j }; }
    return best;
  }
  // Reparto: 9 territorios para el jugador y 10 para el robot (compensa que el jugador empieza). Tropas iniciales de 1 a 3.
  function newBoard() {
    const own = Array.from({ length: N }, (_, i) => i < Math.floor(N / 2) ? 0 : 1).sort(() => Math.random() - 0.5);
    return { own, arm: own.map(() => 1 + Math.floor(Math.random() * 3)) };
  }
  // Partidas sin pantalla, con la misma lógica: comprueba que el JS reproduce la simulación de investigacion/sim3.py.
  function headless(thrP, thrR, M = 500) {
    let wins = 0, done = 0, turns = 0;
    for (let g = 0; g < M; g++) {
      const { own, arm } = newBoard(); let p = 0, rt = 0, over = -1, t;
      for (t = 1; t <= 2 * ROUNDS; t++) {
        let pool = reinf(own, p) + (p === 1 && rt < ROBOT_EXTRA_TURNS ? 1 : 0); if (p === 1) rt++;
        while (pool-- > 0) { const i = botPlace(own, arm, p); if (i < 0) break; arm[i]++; }
        for (let k = 0; k < 60; k++) { const m = botAttack(own, arm, p, p === 0 ? thrP : thrR); if (!m) break; let r; do { r = applyRound(own, arm, m.i, m.j); } while (!r.conq && arm[m.i] > 1); }
        const fp = fortifyPick(own, arm, p); if (fp) { arm[fp.j] += arm[fp.i] - 1; arm[fp.i] = 1; }
        if (count(own, p) === N) { over = p; break; } p ^= 1;
      }
      const mine = count(own, 0); if (over >= 0) done++; turns += t;
      if (over === 0 || (over < 0 && mine > N / 2)) wins++;
    }
    return { winsPlayer: wins / M, finishedEarly: done / M, ownTurns: turns / M / 2 };
  }

  // ── Escena 3D ───────────────────────────────────────────────────────────────
  const canvas = $('#c');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2)); renderer.outputEncoding = THREE.sRGBEncoding; renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#F3F5EC').convertSRGBToLinear();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 80);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9c7b8, 0.6));
  const sun = new THREE.DirectionalLight(0xffffff, 0.5); sun.position.set(-4, 10, 6); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 26 }); sun.shadow.bias = -0.0005; scene.add(sun);
  // los colores de marca están en sRGB: se pasan a lineal para que la salida sRGB los muestre tal cual
  const lin = (c) => new THREE.Color(c).convertSRGBToLinear();
  const std = (c, o = {}) => new THREE.MeshStandardMaterial(Object.assign({ color: lin(c), roughness: 0.8, metalness: 0 }, o));
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), std('#E6EBD8', { roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);

  const TOP_H = 0.2, RIM_H = 0.07, SHRINK = 0.9;
  const regs = [];
  const matCache = {}, leafMat = (c) => matCache[c] || (matCache[c] = std(c));
  const leafGeo = { es: new THREE.SphereGeometry(0.075, 10, 8), ca: new THREE.ConeGeometry(0.08, 0.17, 4) };
  MAPA.regions.forEach((r, i) => {
    const shape = new THREE.Shape(r.poly.map(([x, y]) => new THREE.Vector2(x, y)));
    const group = new THREE.Group(); group.position.set(r.c[0], 0, -r.c[1]);
    const baseMat = std(ZCOL[r.zone]);
    const base = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: RIM_H, bevelEnabled: false }), baseMat); base.rotation.x = -Math.PI / 2; base.receiveShadow = true;
    const topMat = std('#ffffff'), sideMat = std('#333333');
    const top = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: TOP_H, bevelEnabled: false }), [topMat, sideMat]); top.rotation.x = -Math.PI / 2; top.scale.set(SHRINK, SHRINK, 1); top.castShadow = top.receiveShadow = true;
    const pts = r.poly.map(([x, y]) => new THREE.Vector3(x * SHRINK, TOP_H + 0.003, -y * SHRINK));
    const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: lin('#1D2B22') }));
    const stack = new THREE.Group(); stack.position.y = TOP_H;
    const cv = document.createElement('canvas'); cv.width = 128; cv.height = 112; const tex = new THREE.CanvasTexture(cv); tex.encoding = THREE.sRGBEncoding;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })); sprite.renderOrder = 10; sprite.scale.set(0.52, 0.455, 1); sprite.userData.i = i;
    group.add(base, top, line, stack, sprite); scene.add(group);
    regs.push({ i, group, base, baseMat, top, topMat, sideMat, stack, sprite, cv, ctx: cv.getContext('2d'), tex, pop: 0, lift: 0, liftTarget: 0 });
  });
  // Enlaces por mar (como Kamchatka en Risk): Baleares con Cataluña y Valencia, Canarias con Andalucía
  MAPA.sea.forEach(([a, b]) => {
    const A = MAPA.regions[a].c, B = MAPA.regions[b].c;
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(A[0], 0.04, -A[1]), new THREE.Vector3(B[0], 0.04, -B[1])]), new THREE.LineDashedMaterial({ color: lin('#1D2B22'), dashSize: 0.12, gapSize: 0.1 }));
    l.computeLineDistances(); scene.add(l);
  });

  const rig = GK.rig(camera, renderer, {
    desktop: { base: [0, 10.2, 7.6], look: [0, 0, 1.5], fov: 38, dx: 0 },
    portrait: { base: [0, 12.6, 6.4], look: [0, 0, 0.1], fov: 52, dy: 0.02 },
  });

  // ── Estado ──────────────────────────────────────────────────────────────────
  const me = 'es';
  let st = null, level = 0;
  const teamOf = (p) => TEAMS[p === 0 ? me : (me === 'es' ? 'ca' : 'es')];
  const kindOf = (p) => p === 0 ? me : (me === 'es' ? 'ca' : 'es');
  const coach = GK.coach({
    storageKey: CONFIG.storageKey,
    steps: [
      { el: () => mapRect(), text: lg('Te dan plantones cada turno. Toca tus territorios, los que tienen un anillo claro, hasta gastarlos todos.', 'You get saplings every turn. Tap your territories, the ones with a light ring, until you have used them all.'), wait: 'plantadas' },
      { el: () => mapRect(), text: lg('Ahora ataca: toca un territorio tuyo con 2 o más y luego uno del robot pegado a él.', 'Now attack: tap one of your territories with 2 or more, then a robot territory next to it.'), wait: 'pick' },
      { el: '#say', text: lg('Aquí ves cuánto ganas. Con ventaja es casi seguro. Pulsa Una tirada.', 'Here you see how much you gain. With an edge it is almost certain. Tap One roll.'), wait: 'attack' },
      { el: '#ol', text: lg('Gana el dado más alto de cada pareja. Si empatan, gana quien ya tiene raíces: el defensor.', 'The highest die of each pair wins. On a tie, whoever already has roots wins: the defender.'), wait: 'dados', whenVisible: true },
      { el: '#say', text: lg('Antes de acabar, puedes llevar plantas a otro territorio tuyo pegado: pulsa Pasar plantas. Es lo último que haces. Si no quieres, pulsa Terminar turno.', "Before finishing, you can move saplings to another of your neighbouring territories: tap Move saplings. It is the last thing you do. If you don't want to, tap End turn."), wait: 'move' },
      { el: '#say', text: lg('Elige de dónde salen, adónde llegan y cuántas. Al confirmar, acaba tu turno. O pulsa Terminar turno.', 'Choose where they leave from, where they arrive and how many. When you confirm, your turn ends. Or tap End turn.'), wait: 'end' },
    ],
    onEnd() { GK.overlay.hide(); newGame(); GK.announce(lg('Ahora, la partida de verdad', 'Now, the real game'), 'good'); },
  });

  function applyTheme() {
    const a = teamOf(0), b = teamOf(1), r = document.documentElement.style;
    r.setProperty('--me', a.main); r.setProperty('--me-ink', a.ink); r.setProperty('--rv', b.main); r.setProperty('--rv-ink', b.ink);
  }
  function newGame() {
    GK.cancelAll(); GK.end(''); GK.overlay.hide(); GK.say('');
    const b = newBoard();
    st = { own: b.own, arm: b.arm, phase: 'plant', pool: 0, round: 1, robotTurns: 0, sel: null, tgt: null, atk: [], over: null, level, lastAtk: null };
    document.querySelectorAll('.confetti').forEach(n => n.remove());
    regs.forEach(t => { t.liftTarget = 0; t.lift = 0; });
    applyTheme(); repaintAll(); rig.dollyFrom(1.12); startPlayerTurn();
  }

  // ── Dibujo de comunidades ───────────────────────────────────────────────────
  function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function paint(i) {
    const t = regs[i], g = t.ctx, tm = teamOf(st.own[i]), mine = st.own[i] === 0, kind = kindOf(st.own[i]);
    t.topMat.color.copy(lin(tm.main)); t.sideMat.color.copy(lin(tm.body));
    const can = !st.over && mine && ((st.phase === 'plant' && st.pool > 0) || ((st.phase === 'attack' || st.phase === 'move') && st.arm[i] >= 2 && st.tgt == null));
    const isSel = st.sel === i, isTgt = st.tgt === i;
    t.topMat.emissive.copy(lin(isTgt && st.phase !== 'move' ? '#5a1414' : isSel ? '#3a3a2a' : '#000000'));
    g.clearRect(0, 0, 128, 112);
    if (can || isSel || isTgt) { g.lineWidth = isTgt ? 9 : 8; g.strokeStyle = isTgt ? (st.phase === 'move' ? '#1D2B22' : '#E5484D') : '#F3F5EC'; if (isTgt) g.setLineDash([12, 7]); rrect(g, 5, 5, 118, 102, 14); g.stroke(); g.setLineDash([]); }
    g.fillStyle = tm.main; rrect(g, 10, 10, 108, 92, 12); g.fill(); g.lineWidth = 5; g.strokeStyle = '#1D2B22'; g.stroke();
    // marca de equipo que no depende del color: círculo (español) o rombo (californiano)
    g.fillStyle = tm.ink; g.beginPath();
    if (kind === 'es') g.arc(26, 28, 8, 0, 7); else { g.moveTo(26, 18); g.lineTo(36, 28); g.lineTo(26, 38); g.lineTo(16, 28); g.closePath(); }
    g.fill();
    g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = tm.ink;
    g.font = '700 58px Montserrat, Jost, sans-serif'; g.fillText(String(st.arm[i]), 68, 50);
    g.font = '700 22px Montserrat, Jost, sans-serif'; g.fillText(MAPA.regions[i].code, 64, 86);
    if (st.phase === 'plant' && st.pool > 0 && mine) { g.font = '700 30px Montserrat, sans-serif'; g.textAlign = 'right'; g.fillText('+', 110, 28); }
    t.tex.needsUpdate = true;
    // pila de plantones: esferas (español) o conos (californiano), una por tropa, como mucho 8
    while (t.stack.children.length) t.stack.remove(t.stack.children[0]);
    const n = Math.min(st.arm[i], 8);
    for (let k = 0; k < n; k++) {
      const m = new THREE.Mesh(leafGeo[kind], leafMat(tm.leaf)); m.position.set(((k % 2) - 0.5) * 0.06, 0.07 + k * 0.1, 0); m.castShadow = true; t.stack.add(m);
    }
    t.sprite.position.set(0, TOP_H + 0.4, -0.22);
  }
  function paintZones() {
    ZONES.forEach((z, k) => {
      let owner = -1; for (const p of [0, 1]) if (zoneFull(st.own, k, p)) owner = p;
      zoneMembers[k].forEach(i => regs[i].baseMat.color.copy(lin(owner < 0 ? ZCOL[k] : teamOf(owner).main)));
    });
  }
  function repaintAll() { for (let i = 0; i < N; i++) paint(i); paintZones(); paintKb(); }
  if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('700 58px Montserrat'), document.fonts.load('700 22px Montserrat')]).then(() => { if (st) repaintAll(); });
  // Teclado y lectores de pantalla: un botón por territorio, fuera de vista hasta que recibe el foco.
  const kb = $('#kb');
  MAPA.regions.forEach((r, i) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.kb = i; kb.appendChild(b); });
  function paintKb() {
    kb.querySelectorAll('button').forEach((b, i) => { b.textContent = lg(`${nameOf(i)}: ${st.own[i] === 0 ? 'tuyo' : 'del robot'}, ${st.arm[i]} plantones${serves(i) ? ', se puede tocar ahora' : ''}`, `${nameOf(i)}: ${st.own[i] === 0 ? 'yours' : "the robot's"}, ${st.arm[i]} saplings${serves(i) ? ', can be tapped now' : ''}`); });
  }
  kb.addEventListener('click', (e) => { const b = e.target.closest('[data-kb]'); if (b) tap(+b.dataset.kb); });
  kb.addEventListener('focusin', (e) => { const b = e.target.closest('[data-kb]'); if (b && st) { const i = +b.dataset.kb; regs[i].pop = REDUCE ? 0 : 1; } });
  const pop = (i) => { if (!REDUCE) regs[i].pop = 1; };

  // ── Panel: turno, progreso y lo que puedes hacer ────────────────────────────
  const oddsLabel = (p) => p >= 0.85 ? lg('casi seguro', 'almost certain') : p >= 0.6 ? lg('con ventaja', 'with an edge') : p >= 0.4 ? lg('a cara o cruz', 'a coin flip') : p >= 0.2 ? lg('arriesgado', 'risky') : lg('mala idea', 'a bad idea');
  const legend = () => `<p class="meta zl">${ZONES.map((z, k) => `<span class="zc" style="--zc:${ZCOL[k]}">${esc(zname(k))} +${z.bonus}</span>`).join('')}</p>`;
  function render() {
    if (!st) return;
    const mine = count(st.own, 0), theirs = N - mine, lv = LEVELS[st.level];
    const turn = st.over ? lg('Fin de la partida', 'Game over') : st.phase === 'robot' ? lg('Turno del robot', "Robot's turn") : st.phase === 'plant' ? lg('Tu turno: planta', 'Your turn: plant') : st.phase === 'move' ? lg('Tu turno: pasa plantas', 'Your turn: move saplings') : st.phase === 'moved' ? lg('Tu turno: hecho', 'Your turn: done') : lg('Tu turno: ataca', 'Your turn: attack');
    const head = `<div class="hud">${coach.active ? `<span class="practice">${lg('Práctica', 'Practice')}</span>` : ''}<span class="turn ${st.phase === 'robot' ? 'dim' : ''}">${turn}</span>
      <span class="cnt"><span class="hl"><b>${mine}</b></span> <span class="hr"><b>${theirs}</b></span> · ${lg('ronda', 'round')} ${Math.min(st.round, ROUNDS)}/${ROUNDS}</span></div>`;
    const cancelBtn = `<button class="btn" id="cancel">${lg('Cancelar', 'Cancel')}</button>`;
    let body = '';
    if (st.over) body = `<p class="q">${lg('Mira el resultado.', 'Check the result.')}</p>`;
    else if (GK.overlay.open && st.phase === 'attack') body = `<p class="q">${lg('Mira los dados.', 'Watch the dice.')}</p>`;
    else if (st.phase === 'moved') body = `<p class="q">${lg('Hecho. Ahora juega el robot.', 'Done. Now the robot plays.')}</p>`;
    else if (st.phase === 'move') {
      if (st.sel == null) body = `<p class="q">${lg('Pasa plantas entre tus territorios.', 'Move saplings between your territories.')}</p><p class="meta">${lg('Toca el territorio de donde salen (con 2 o más) y luego el tuyo, pegado a él, al que llegan. Solo un traslado por turno, y acaba el turno.', 'Tap the territory they leave from (with 2 or more), then your own neighbouring territory where they arrive. Only one move per turn, and it ends the turn.')}</p><div class="answers"><button class="btn primary big" id="endturn">${lg('Terminar turno', 'End turn')}</button></div>`;
      else if (st.tgt == null) body = `<p class="q">${lg(`Pasas plantas desde ${esc(nameOf(st.sel))}. Toca el territorio tuyo, pegado a él, al que las llevas.`, `You move saplings from ${esc(nameOf(st.sel))}. Tap your own neighbouring territory to send them to.`)}</p><div class="answers">${cancelBtn}</div>`;
      else { const m = st.arm[st.sel] - 1, opts = [...new Set([1, Math.max(1, Math.floor(m / 2)), m])];
        body = `<p class="q">${lg(`${esc(nameOf(st.sel))} (${st.arm[st.sel]}) a ${esc(nameOf(st.tgt))} (${st.arm[st.tgt]}): ¿cuántas plantas pasas? Después acaba tu turno.`, `${esc(nameOf(st.sel))} (${st.arm[st.sel]}) to ${esc(nameOf(st.tgt))} (${st.arm[st.tgt]}): how many saplings do you move? Your turn ends after.`)}</p><div class="answers">${opts.map(k => `<button class="btn${k === m ? ' primary' : ''}" data-move="${k}">${lg('Pasar', 'Move')} ${k}</button>`).join('')}${cancelBtn}</div>`; }
    }
    else if (st.phase === 'robot') body = `<p class="q">${lg(`Juega el robot (${esc(lv.name)}). Mira qué ataca.`, `The robot plays (${esc(lv.name)}). Watch what it attacks.`)}</p>`;
    else if (st.phase === 'plant') body = `<p class="q">${lg(`Te quedan <b>${st.pool}</b> plantones. Toca tus territorios ${teamOf(0).adj}.`, `You have <b>${st.pool}</b> saplings left. Tap your ${teamOf(0).adj} territories.`)}</p><p class="meta prizeline">${lg(`<b>Premio:</b> gana al robot y te llevas un ${CONFIG.prize.pct} % de descuento en Vergel.`, `<b>Prize:</b> beat the robot and get ${CONFIG.prize.pct}% off at Vergel.`)}</p>${legend()}`;
    else if (st.sel == null) body = `<p class="q">${lg('Ataca con ventaja o termina el turno.', 'Attack with an edge or end your turn.')}</p><p class="meta">${lg(`Toca un territorio tuyo con 2 o más y luego uno del robot pegado a él. Gana quien tenga más territorios al acabar la ronda ${ROUNDS}.`, `Tap one of your territories with 2 or more, then a robot territory next to it. Whoever holds more territories when round ${ROUNDS} ends wins.`)}</p><p class="meta">${lg('Para llevar plantas de un territorio tuyo a otro tuyo pegado, pulsa Pasar plantas. Es lo último que haces y acaba tu turno.', 'To move saplings from one of your territories to a neighbouring one of yours, tap Move saplings. It is the last thing you do and it ends your turn.')}</p>
      <div class="answers"><button class="btn primary big" id="endturn">${lg('Terminar turno', 'End turn')}</button><button class="btn big" id="gomove">${lg('Pasar plantas', 'Move saplings')}</button></div>`;
    else if (st.tgt == null) body = `<p class="q">${lg(`Sales desde ${esc(nameOf(st.sel))}. Toca un territorio del robot para atacar.`, `You leave from ${esc(nameOf(st.sel))}. Tap a robot territory to attack.`)}</p><div class="answers"><button class="btn big" id="gomove">${lg('Pasar plantas desde aquí', 'Move saplings from here')}</button>${cancelBtn}</div>`;
    else { const a = st.arm[st.sel] - 1, d = st.arm[st.tgt], p = pwin(a, d);
      body = `<p class="q">${lg(`${esc(nameOf(st.sel))} contra ${esc(nameOf(st.tgt))}: atacas con <b>${a}</b> contra <b>${d}</b>, ${oddsLabel(p)} (<b>${Math.round(p * 100)} %</b>).`, `${esc(nameOf(st.sel))} against ${esc(nameOf(st.tgt))}: you attack with <b>${a}</b> against <b>${d}</b>, ${oddsLabel(p)} (<b>${Math.round(p * 100)}%</b>).`)}</p>
      <div class="answers"><button class="btn primary big" id="roll1">${lg('Una tirada', 'One roll')}</button><button class="btn big" id="rollAll">${lg('Hasta el final', 'All the way')}</button>${cancelBtn}</div>`; }
    $('#say').innerHTML = head + body;
  }

  // ── Turnos del jugador ──────────────────────────────────────────────────────
  function startPlayerTurn() {
    st.sel = st.tgt = null; st.pool = reinf(st.own, 0); st.phase = 'plant';
    GK.announce(lg(`Planta ${st.pool} plantones`, `Plant ${st.pool} saplings`), 'good'); repaintAll(); render();
  }
  function plant(i) {
    if (!st || st.phase !== 'plant' || st.own[i] !== 0 || st.pool <= 0 || GK.overlay.open) return;
    st.arm[i]++; st.pool--; pop(i); sound.tick(); coach.event(st.pool === 0 ? 'plantadas' : 'plant');
    if (st.pool === 0) { st.phase = 'attack'; GK.announce(lg('Ahora, ataca con ventaja', 'Now, attack with an edge'), 'good'); }
    repaintAll(); render();
  }
  function select(i) {
    if (!st || st.phase !== 'attack' || GK.overlay.open || st.over) return;
    if (st.sel != null && st.tgt == null && st.own[i] === 1 && NB[st.sel].includes(i)) { st.tgt = i; regs[i].liftTarget = 0.12; coach.event('pick'); }
    else if (st.own[i] === 0 && st.arm[i] >= 2) { clearSel(); st.sel = i; regs[i].liftTarget = 0.25; sound.tick(); }
    else if (st.sel != null && st.own[i] === 1) { GK.announce(lg(`${nameOf(i)} no está pegado a ${nameOf(st.sel)}`, `${nameOf(i)} is not next to ${nameOf(st.sel)}`), 'bad', 1300); sound.no(); return; }
    else if (st.own[i] === 0) { GK.announce(lg('Necesitas 2 o más para atacar', 'You need 2 or more to attack'), 'bad', 1100); sound.no(); return; }
    repaintAll(); render();
  }
  // Pasar plantas: un traslado por turno entre territorios propios pegados; al hacerlo, acaba el turno.
  function startMove() {
    if (!st || st.phase !== 'attack' || GK.overlay.open) return;
    coach.event('move');
    // si ya hay un territorio elegido para atacar, se pasa desde ese; si no, se elige el origen
    const keep = st.sel; clearSel(); st.phase = 'move'; if (keep != null) { st.sel = keep; regs[keep].liftTarget = 0.25; } repaintAll(); render();
  }
  function selectMove(i) {
    if (!st || st.phase !== 'move' || GK.overlay.open) return;
    if (st.sel != null && st.tgt == null && st.own[i] === 0 && i !== st.sel && NB[st.sel].includes(i)) { st.tgt = i; regs[i].liftTarget = 0.12; }
    else if (st.own[i] === 0 && st.arm[i] >= 2) { clearSel(); st.sel = i; regs[i].liftTarget = 0.25; sound.tick(); }
    else if (st.own[i] === 0 && st.sel != null) { GK.announce(lg(`${nameOf(i)} no está pegado a ${nameOf(st.sel)}`, `${nameOf(i)} is not next to ${nameOf(st.sel)}`), 'bad', 1300); sound.no(); return; }
    else if (st.own[i] === 1) { GK.announce(lg('Solo puedes pasar plantas entre los tuyos', 'You can only move saplings between your own'), 'bad', 1300); sound.no(); return; }
    else { GK.announce(lg('Necesitas 2 o más para pasar plantas', 'You need 2 or more to move saplings'), 'bad', 1100); sound.no(); return; }
    repaintAll(); render();
  }
  function doMove(k, immediate) {
    if (!st || st.phase !== 'move' || st.sel == null || st.tgt == null) return;
    const i = st.sel, j = st.tgt; k = Math.min(k, st.arm[i] - 1); if (k < 1) return;
    st.arm[i] -= k; st.arm[j] += k; pop(i); pop(j); sound.tick(); st.phase = 'moved';
    GK.announce(lg(`Pasas ${k} de ${nameOf(i)} a ${nameOf(j)}`, `You move ${k} from ${nameOf(i)} to ${nameOf(j)}`), 'good'); clearSel(); repaintAll(); render();
    const done = () => { if (st && st.phase === 'moved') { st.phase = 'attack'; endTurn(); } };
    if (immediate) done(); else GK.after(T(900), done);
  }
  function clearSel() { regs.forEach(t => { t.liftTarget = 0; }); st.sel = st.tgt = null; }
  function cancel() { clearSel(); repaintAll(); render(); }
  // Resuelve una tirada (o la batalla entera) y enseña los dados con el porqué.
  function attack(full) {
    if (!st || st.phase !== 'attack' || st.sel == null || st.tgt == null || GK.overlay.open) return;
    const i = st.sel, j = st.tgt, a0 = st.arm[i] - 1, d0 = st.arm[j], pBefore = pwin(a0, d0);
    const before = zonesBonus(st.own, 0); let r, la = 0, ld = 0, rounds = 0;
    do { r = applyRound(st.own, st.arm, i, j); la += r.la; ld += r.ld; rounds++; } while (full && !r.conq && st.arm[i] > 1);
    const done = r.conq || st.arm[i] <= 1;
    if (done) st.atk.push({ a: a0, d: d0, won: r.conq });
    rig.impact(0.2); coach.event('attack');
    showDice(r, { who: 0, i, j, rounds, la, ld, conq: r.conq, done, a0, d0, pBefore, before });
    pop(i); pop(j);
  }
  function diceHtml(r, atkP) {
    const A = teamOf(atkP), D = teamOf(atkP ^ 1);
    const pr = r.pairs.map(p => `<div class="pair"><b class="die a ${p.att ? 'w' : 'l'}">${p.a}</b><em>${p.att ? lg('Gana el ataque', 'Attack wins') : p.a === p.d ? lg('Empate: gana la defensa', 'Tie: the defence wins') : lg('Gana la defensa', 'The defence wins')}</em><b class="die d ${p.att ? 'l' : 'w'}">${p.d}</b></div>`).join('');
    const extra = r.ad.slice(r.pairs.length).map(v => `<div class="pair extra"><b class="die a">${v}</b><em>${lg('Sin pareja: la defensa tiene menos dados', 'No pair: the defence has fewer dice')}</em><span></span></div>`).join('');
    const you = lg('Tú', 'You'), rob = 'Robot';
    return { style: `--atk:${A.main};--atk-ink:${A.ink};--dfn:${D.main};--dfn-ink:${D.ink}`, html: `<div class="dicehead"><span>${atkP === 0 ? you : rob}</span><span></span><span>${atkP === 0 ? rob : you}</span></div><div class="pairs">${pr}${extra}</div>` };
  }
  function showDice(r, o) {
    const atkP = o.who, dd = diceHtml(r, atkP);
    const loss = atkP === 0 ? lg(`Tú pierdes ${o.la}, el robot ${o.ld}`, `You lose ${o.la}, the robot ${o.ld}`) : lg(`El robot pierde ${o.la}, tú ${o.ld}`, `The robot loses ${o.la}, you ${o.ld}`);
    const verdict = o.conq ? (atkP === 0 ? lg(`Conquistas ${nameOf(o.j)}`, `You conquer ${nameOf(o.j)}`) : lg(`El robot se lleva ${nameOf(o.j)}`, `The robot takes ${nameOf(o.j)}`)) : o.done ? (atkP === 0 ? lg(`Te quedas sin tropas. ${loss}`, `You run out of troops. ${loss}`) : lg(`El robot se queda sin tropas. ${loss}`, `The robot runs out of troops. ${loss}`)) : loss;
    const why = (!o.conq && o.done && atkP === 0) ? lg(`Atacabas con ${o.a0} contra ${o.d0}: la probabilidad era ${Math.round(o.pBefore * 100)} %.`, `You attacked with ${o.a0} against ${o.d0}: the odds were ${Math.round(o.pBefore * 100)}%.`) : '';
    GK.overlay.show(`<div style="${dd.style}"><p class="ol-q">${atkP === 0 ? lg('Atacas', 'You attack') : lg('Ataca el robot', 'The robot attacks')}: ${esc(nameOf(o.i))} ${lg('contra', 'against')} ${esc(nameOf(o.j))}</p>${dd.html}
      <p class="ol-a show ${o.conq ? (atkP === 0 ? 'good' : 'bad') : ''}">${esc(verdict)}</p>
      ${o.rounds > 1 ? `<p class="ol-m">${lg(`${o.rounds} tiradas seguidas; se ven los dados de la última.`, `${o.rounds} rolls in a row; you see the dice of the last one.`)}</p>` : ''}${why ? `<p class="ol-m">${esc(why)}</p>` : ''}
      ${atkP === 0 ? `<div class="answers center"><button class="btn primary" id="next">${lg('Seguir', 'Continue')}</button></div>` : ''}</div>`);
    if (atkP === 0) { const nx = $('#next'); if (nx) nx.focus({ preventScroll: true }); }
    if (o.conq) { sound[atkP === 0 ? 'yes' : 'no'](); rig.shake(0.15); }
    st.lastAtk = o; repaintAll(); render();
  }
  function afterDice() {
    GK.overlay.hide(); coach.event('dados');
    const o = st.lastAtk; if (!o) return;
    if (o.done) clearSel(); else { st.tgt = o.j; regs[o.i].liftTarget = 0.25; regs[o.j].liftTarget = 0.12; }
    if (o.conq) { zoneNews(0, o.before); if (count(st.own, 0) === N) { finish(); return; } }
    repaintAll(); render();
  }
  function zoneNews(p, before) {
    const now = zonesBonus(st.own, p);
    if (now > before) { const z = ZONES.findIndex((zz, k) => zoneFull(st.own, k, p)); GK.announce(p === 0 ? lg(`Zona completa: ${zname(z)}. +${now - before} plantones`, `Zone complete: ${zname(z)}. +${now - before} saplings`) : lg(`El robot completa ${zname(z)}`, `The robot completes ${zname(z)}`), p === 0 ? 'good' : 'bad'); }
  }
  function endTurn() {
    if (!st || st.phase === 'robot' || st.phase === 'moved' || st.over || GK.overlay.open) return;
    clearSel(); const cur = st; coach.event('move'); coach.event('end');
    // si la guía acaba aquí, newGame() ya ha empezado la partida de verdad y el turno del robot no toca
    if (st !== cur) return;
    startRobotTurn();
  }

  // ── Turno del robot, a la vista ─────────────────────────────────────────────
  function startRobotTurn() {
    st.phase = 'robot'; st.sel = st.tgt = null;
    const pool = reinf(st.own, 1) + (st.robotTurns < ROBOT_EXTRA_TURNS ? 1 : 0); st.robotTurns++;
    repaintAll(); render(); const tm = teamOf(1); GK.announce(lg('Juega el robot', 'The robot plays'), 'bad', 1100);
    const talk = (txt, i) => { GK.say(txt); rig.follow($('#bubble'), regs[i].group, 1.2, 70); };
    const place = (left) => {
      if (st.over) return;
      if (left <= 0) { GK.after(T(250), () => attackStep(0)); return; }
      const i = botPlace(st.own, st.arm, 1); if (i < 0) { attackStep(0); return; }
      if (left === pool) talk(tm.say[GK.rnd(tm.say.length)], i);
      st.arm[i]++; pop(i); sound.tick(); paint(i); GK.after(T(120), () => place(left - 1));
    };
    const attackStep = (k) => {
      if (st.over) return;
      const m = k < MAX_ROBOT_ATTACKS ? botAttack(st.own, st.arm, 1, LEVELS[st.level].thr) : null;
      if (!m) { fortifyStep(); return; }
      st.sel = m.i; st.tgt = m.j; repaintAll(); sound.robot(); talk(lg(`Voy a por ${nameOf(m.j)}: ${st.arm[m.i] - 1} contra ${st.arm[m.j]}.`, `I'm going for ${nameOf(m.j)}: ${st.arm[m.i] - 1} against ${st.arm[m.j]}.`), m.i);
      GK.after(T(450), () => {
        const before = zonesBonus(st.own, 1), a0 = st.arm[m.i] - 1, d0 = st.arm[m.j]; let r, la = 0, ld = 0, rounds = 0;
        do { r = applyRound(st.own, st.arm, m.i, m.j); la += r.la; ld += r.ld; rounds++; } while (!r.conq && st.arm[m.i] > 1);
        rig.impact(0.2); showDice(r, { who: 1, i: m.i, j: m.j, rounds, la, ld, conq: r.conq, done: true, a0, d0, before });
        GK.after(T(1100), () => {
          GK.overlay.hide(); st.sel = st.tgt = null; zoneNews(1, before); repaintAll();
          if (count(st.own, 1) === N) { finish(); return; }
          GK.after(T(250), () => attackStep(k + 1));
        });
      });
    };
    const fortifyStep = () => {
      if (st.over) return;
      const f = fortifyPick(st.own, st.arm, 1); if (!f) { endRobotTurn(); return; }
      st.sel = f.i; st.tgt = f.j; repaintAll(); talk(lg(`Paso ${st.arm[f.i] - 1} de ${nameOf(f.i)} a ${nameOf(f.j)}: ahí tengo enemigos.`, `I'm moving ${st.arm[f.i] - 1} from ${nameOf(f.i)} to ${nameOf(f.j)}: I have enemies there.`), f.i);
      GK.after(T(700), () => { const k = st.arm[f.i] - 1; st.arm[f.i] -= k; st.arm[f.j] += k; pop(f.i); pop(f.j); sound.tick(); st.sel = st.tgt = null; repaintAll(); GK.after(T(500), endRobotTurn); });
    };
    GK.after(T(500), () => place(pool));
  }
  function endRobotTurn() {
    GK.say(''); st.sel = st.tgt = null;
    if (st.round >= ROUNDS) { finish(); return; }
    st.round++; startPlayerTurn();
  }

  // ── Final ───────────────────────────────────────────────────────────────────
  function finish() {
    GK.cancelAll(); GK.overlay.hide(); GK.say(''); clearSel();
    const mine = count(st.own, 0), all = mine === N, lost = count(st.own, 1) === N, win = all || (!lost && mine > N / 2);
    st.over = { win, mine, all }; st.phase = 'over'; repaintAll(); render();
    GK.announce(win ? `${all ? lg('¡España entera!', 'All of Spain!') : lg('¡Ganas!', 'You win!')} -${CONFIG.prize.pct}${lg(' % en Vergel', '% at Vergel')}` : lg('Gana el robot', 'The robot wins'), win ? 'good' : 'bad');
    if (win) { sound.win(); GK.confetti([teamOf(0).main, '#1D2B22', '#E5484D']); } else sound.lose();
    const gain = st.atk.filter(a => a.a - a.d >= 2), flat = st.atk.filter(a => a.a - a.d < 2);
    const lostFlat = flat.filter(a => !a.won).length;
    let why = st.atk.length ? lg(`Hiciste ${st.atk.length} ataques. Con 2 o más de ventaja ganaste ${gain.filter(a => a.won).length} de ${gain.length}; con menos, ${flat.filter(a => a.won).length} de ${flat.length}.`, `You made ${st.atk.length} attacks. With an edge of 2 or more you won ${gain.filter(a => a.won).length} of ${gain.length}; with less, ${flat.filter(a => a.won).length} of ${flat.length}.`) : lg('No atacaste ninguna vez: sin ataques no se conquista.', 'You never attacked: without attacks you conquer nothing.');
    if (lostFlat >= 1 && !win) why += lg(` Perdiste ${lostFlat} ataques sin ventaja. Con 2 de ventaja se gana cerca del ${Math.round(pwin(4, 2) * 100)} % (4 contra 2).`, ` You lost ${lostFlat} attacks without an edge. With an edge of 2 you win about ${Math.round(pwin(4, 2) * 100)}% (4 against 2).`);
    const rank = all ? lg('Imperio', 'Empire') : win ? lg('Pistachero', 'Pistachio grower') : lg('Aprendiz', 'Apprentice');
    const next = win && st.level < 2 ? lg(`Siguiente robot: ${LEVELS[st.level + 1].name}.`, `Next robot: ${LEVELS[st.level + 1].name}.`) : '';
    if (win) level = Math.min(2, st.level + 1);
    const f = FACTS[GK.rnd(FACTS.length)];
    // lo único que lee el chat de cierre: si ganó (para ofrecer el 5 %). Ni resultado ni datos personales.
    st.chatData = { gano: win ? 'si' : 'no' };
    GK.end(`<h2>${win ? lg('Has ganado', 'You won') : lg('Te ha ganado el robot', 'The robot beat you')}: ${mine} ${lg('contra', 'to')} ${N - mine}</h2>
      <div class="rv"><h3>${lg('Rango', 'Rank')}: ${rank}</h3><p>${esc(why)} ${esc(next)}</p></div>
      ${win ? `<div class="ticket"><b class="pct">-${CONFIG.prize.pct}${lg(' %', '%')}</b><div><p><b>${lg(`Has ganado un ${CONFIG.prize.pct} % de descuento en Vergel.`, `You won a ${CONFIG.prize.pct}% discount at Vergel.`)}</b></p><p>${lg(`Por vencer al robot. Código ${esc(CONFIG.prize.code)}: es una demo y no funciona en ninguna tienda.`, `For beating the robot. Code ${esc(CONFIG.prize.code)}: this is a demo and it works in no shop.`)}</p><p class="src">${lg('Descuento simulado: Vergel es una marca inventada.', 'Simulated discount: Vergel is an invented brand.')}</p></div></div>`
        : `<div class="ticket off"><b class="pct">-${CONFIG.prize.pct}${lg(' %', '%')}</b><div><p><b>${lg('Esta vez no hay descuento.', 'No discount this time.')}</b></p><p>${lg(`Gana al robot y te llevas un ${CONFIG.prize.pct} % en Vergel.`, `Beat the robot and get ${CONFIG.prize.pct}% off at Vergel.`)}</p></div></div>`}
      <div class="cta"><p>${esc(CONFIG.cta.text)}</p><button class="btn primary cta-btn" id="openChat"><b>${lg('Ver mi premio', 'See my prize')}</b><small>${lg('Y cómo hacer un juego así', 'And how to get a game like this')}</small></button></div>
      <div class="fact"><p><b>${esc(f.t)}</b></p><p class="src">${lg('Fuente', 'Source')}: ${esc(f.s)}</p></div>
      <div class="answers"><button class="btn" id="again">${lg('Jugar otra vez', 'Play again')}</button></div>`);
  }

  // ── Cierre: chat de Landbot ─────────────────────────────────────────────────
  // Se monta con Landbot.Container para pasarle el resultado (customData llega a partir del segundo mensaje).
  // Si la librería no carga en 8 s, se enseñan los enlaces directos: el cierre nunca se queda en blanco.
  let chatBox = null;
  function chatFallback(host) {
    const noEn = lang === 'en' && !CONFIG.chat.configEn;
    host.innerHTML = `<div class="lbfail"><p><b>${noEn ? 'The closing chat is only available in Spanish for now.' : lg('No se ha podido abrir el chat.', 'The chat could not be opened.')}</b></p><p>${lg('Puedes reservar una llamada para hablar de un juego como este para tu marca:', 'You can book a call to talk about a game like this for your brand:')}</p>
      <div class="answers"><a class="btn primary" href="${esc(CONFIG.chat.book)}" target="_blank" rel="noopener">${lg('Reservar llamada con Landbot', 'Book a call with Landbot')}</a></div></div>`;
  }
  async function openChat() {
    const box = $('#lbchat'), host = box.querySelector('.lbframe'); box.hidden = false; $('#closeChat').focus({ preventScroll: true });
    if (chatBox) { try { chatBox.destroy(); } catch (e) { /* ya cerrado */ } chatBox = null; }
    host.innerHTML = `<p class="lbwait">${lg('Abriendo el chat...', 'Opening the chat...')}</p>`;
    const cfgUrl = lang === 'en' ? CONFIG.chat.configEn : CONFIG.chat.config;
    if (!cfgUrl) { chatFallback(host); return; }
    try {
      const mod = await Promise.race([import(CONFIG.chat.lib), new Promise((_, no) => GK.after(8000, () => no(new Error('tiempo'))))]);
      const L = window.Landbot || (mod && (mod.default || mod.Landbot));
      if (!L || !L.Container) throw new Error('sin Container');
      host.innerHTML = ''; const cont = document.createElement('div'); cont.className = 'lbcont'; host.appendChild(cont);
      chatBox = new L.Container({ container: cont, configUrl: cfgUrl, storage_off: true, customData: (st && st.chatData) || {} });
      if (lang === 'es') translateChat(cont, 0);
    } catch (e) { chatFallback(host); }
  }
  // Los rótulos del widget vienen en inglés y no se pueden cambiar con CSS ni desde la API. El iframe es del mismo origen,
  // así que se traducen desde aquí cambiando nodeValue (nunca textContent: React se cae si se sustituye el nodo).
  const CHAT_ES = { 'Choose an option': 'Elige una opción', 'Back': 'Atrás', 'Just now': 'Ahora', 'Type here...': 'Escribe aquí...', 'Thinking...': 'Pensando...' };
  function translateChat(cont, tries) {
    const fr = cont.querySelector('iframe'); let doc = null;
    try { doc = fr && fr.contentDocument; } catch (e) { doc = null; }
    if (!doc || !doc.body || !doc.body.innerText) { if (tries < 40) GK.after(250, () => translateChat(cont, tries + 1)); return; }
    const pass = () => { const w = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const t = n.nodeValue.trim(); if (CHAT_ES[t]) n.nodeValue = n.nodeValue.replace(t, CHAT_ES[t]); } };
    pass(); let busy = false;
    new MutationObserver(() => { if (busy) return; busy = true; try { pass(); } finally { busy = false; } }).observe(doc.body, { childList: true, subtree: true, characterData: true });
  }
  function closeChat() { $('#lbchat').hidden = true; }

  // ── Reinicio: vuelve al principio (nivel medio, partida nueva). Si hay partida empezada, pide confirmar con un segundo toque.
  let resetTimer = null;
  function resetBtn(label, armed) { const b = $('#reset'); b.textContent = label; b.classList.toggle('armed', armed); }
  function doReset() {
    GK.cancel(resetTimer); resetBtn(lg('Reiniciar', 'Restart'), false); closeChat(); level = 0;
    if (coach.active) { coach.end(); return; }
    newGame(); GK.announce(lg('Partida reiniciada', 'Game restarted'), 'good');
  }
  function pressReset() {
    if (!st) return;
    const started = !st.over && (st.round > 1 || st.atk.length > 0 || st.phase !== 'plant' || st.pool < reinf(st.own, 0));
    if (!started || $('#reset').classList.contains('armed')) { doReset(); return; }
    resetBtn(lg('¿Seguro?', 'Sure?'), true); GK.cancel(resetTimer); resetTimer = GK.after(3000, () => resetBtn(lg('Reiniciar', 'Restart'), false));
  }

  // ── Eventos ─────────────────────────────────────────────────────────────────
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), wp = new THREE.Vector3();
  // Lo que hay bajo el dedo, por orden: la ficha que flota sobre la comunidad, la ficha más cercana (a menos de 20 px) y la comunidad.
  // Si hay varias, se elige la primera que sirva para lo que toca ahora (así una ficha vecina no tapa a la comunidad que quieres).
  function candidatesAt(cx, cy) {
    const rect = canvas.getBoundingClientRect(), out = []; ndc.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const add = (i) => { if (i >= 0 && !out.includes(i)) out.push(i); };
    const hs = ray.intersectObjects(regs.map(t => t.sprite), false)[0]; if (hs) add(hs.object.userData.i);
    const hm = ray.intersectObjects(regs.map(t => t.top), false)[0]; if (hm) add(regs.findIndex(t => t.top === hm.object));
    let nb = -1, nd = 20;
    regs.forEach((t, i) => { wp.setFromMatrixPosition(t.sprite.matrixWorld); wp.project(camera); const d = Math.hypot((wp.x * 0.5 + 0.5) * rect.width - (cx - rect.left), (-wp.y * 0.5 + 0.5) * rect.height - (cy - rect.top)); if (d < nd) { nd = d; nb = i; } });
    add(nb);
    let best = -1, bd = 28;
    regs.forEach((t, i) => { wp.setFromMatrixPosition(t.group.matrixWorld); wp.project(camera); const d = Math.hypot((wp.x * 0.5 + 0.5) * rect.width - (cx - rect.left), (-wp.y * 0.5 + 0.5) * rect.height - (cy - rect.top)); if (d < bd) { bd = d; best = i; } });
    add(best);
    return out;
  }
  function serves(i) {
    if (!st) return false;
    if (st.phase === 'plant') return st.own[i] === 0 && st.pool > 0;
    if (st.phase === 'move') return st.sel == null ? (st.own[i] === 0 && st.arm[i] >= 2) : (st.tgt == null && st.own[i] === 0 && (NB[st.sel].includes(i) || st.arm[i] >= 2));
    if (st.phase !== 'attack') return false;
    if (st.sel == null) return st.own[i] === 0 && st.arm[i] >= 2;
    return st.tgt == null && ((st.own[i] === 1 && NB[st.sel].includes(i)) || (st.own[i] === 0 && st.arm[i] >= 2));
  }
  // Madrid es una cuña diminuta entre dos comunidades enormes: su ficha tiene prioridad en un radio de 24 px
  const MAD = MAPA.regions.findIndex(r => r.code === 'MAD');
  function tileAt(cx, cy) {
    const rect = canvas.getBoundingClientRect(); wp.setFromMatrixPosition(regs[MAD].sprite.matrixWorld); wp.project(camera);
    const dm = Math.hypot((wp.x * 0.5 + 0.5) * rect.width - (cx - rect.left), (-wp.y * 0.5 + 0.5) * rect.height - (cy - rect.top));
    if (dm < 24 && serves(MAD)) return MAD;
    const c = candidatesAt(cx, cy); const ok = c.find(serves); return ok != null ? ok : (c.length ? c[0] : -1);
  }
  const tap = (i) => { if (i < 0 || !st) return; if (st.phase === 'plant') plant(i); else if (st.phase === 'move') selectMove(i); else select(i); };
  canvas.addEventListener('click', (e) => { tap(tileAt(e.clientX, e.clientY)); });
  document.addEventListener('click', (e) => {
    if (e.target.closest('#endturn')) { endTurn(); return; }
    if (e.target.closest('#openChat')) { openChat(); return; }
    if (e.target.closest('#closeChat')) { closeChat(); return; }
    if (e.target.closest('#reset')) { pressReset(); return; }
    if (e.target.closest('#gomove')) { startMove(); return; }
    const mv = e.target.closest('[data-move]'); if (mv) { doMove(parseInt(mv.dataset.move, 10)); return; }
    if (e.target.closest('#roll1')) { attack(false); return; }
    if (e.target.closest('#rollAll')) { attack(true); return; }
    if (e.target.closest('#cancel')) { cancel(); return; }
    if (e.target.closest('#next')) { afterDice(); return; }
    if (e.target.closest('#again')) { newGame(); return; }
    const mu = e.target.closest('#mute'); if (mu) { sound.muted = !sound.muted; mu.setAttribute('aria-pressed', String(sound.muted)); mu.textContent = sound.muted ? lg('Sonido: no', 'Sound: off') : lg('Sonido: sí', 'Sound: on'); return; }
    if (e.target.closest('#help')) { showIntro(lg('Seguir', 'Continue')); return; }
    const lb = e.target.closest('[data-lang]'); if (lb) { setLang(lb.dataset.lang); return; }
    if (e.target.closest('#lang')) { setLang(lang === 'en' ? 'es' : 'en'); return; }
  });
  // Cambiar de idioma recarga la página: todos los textos se calculan una vez al cargar.
  function setLang(l) {
    try { localStorage.setItem(LANG_KEY, l); } catch (e) { /* sin almacenamiento */ }
    try { const u = new URL(location.href); u.searchParams.set('lang', l); location.href = u.toString(); } catch (e) { location.reload(); }
  }
  // Rótulos fijos del HTML y del motor (la guía dice «de» y «Saltar guía» en español: se cambian aquí para no tocar el motor).
  function applyLang() {
    document.documentElement.lang = lang; $('#lang').textContent = lg('EN', 'ES');
    if (lang !== 'en') return;
    document.title = 'Pistacho Imperium · Landbot demo';
    $('#c').setAttribute('aria-label', 'Schematic map of Spain with its 17 autonomous communities, Ceuta and Melilla as territories');
    document.querySelector('.top .brand small').textContent = 'Landbot demo';
    $('#reset').textContent = 'Restart'; $('#mute').textContent = 'Sound: on'; $('#help').setAttribute('aria-label', 'How to play');
    $('#lang').setAttribute('aria-label', 'Jugar en español');
    $('#lbchat').setAttribute('aria-label', 'Pistacho Imperium closing chat'); $('#closeChat').textContent = 'Back to the game';
    $('#kb').setAttribute('aria-label', 'Territories, for keyboard play');
    // solo se toca lo que sigue en español: cambiar el texto dispara otra mutación, y sin esta comprobación no pararía nunca
    const tip = document.querySelector('#coach .tip');
    new MutationObserver(() => {
      const n = tip.querySelector('.stepn'); if (n && n.textContent.includes(' de ')) n.textContent = n.textContent.replace(' de ', ' of ');
      const k = tip.querySelector('#coachSkip'); if (k && k.textContent !== 'Skip guide') k.textContent = 'Skip guide';
    }).observe(tip, { childList: true, subtree: true });
  }
  function showIntro(button = lg('Jugar', 'Play')) {
    // siempre se juega con el pistacho español: no hay elección de equipo
    const sw = `<div class="langsw" role="group" aria-label="Idioma / Language"><button class="btn small" data-lang="es" aria-pressed="${lang === 'es'}">Español</button><button class="btn small" data-lang="en" aria-pressed="${lang === 'en'}">English</button></div>`;
    const extra = `<div class="prize"><b>-${CONFIG.prize.pct}${lg(' %', '%')}</b><span>${lg(`Gana al robot y te llevas un ${CONFIG.prize.pct} % de descuento en Vergel.`, `Beat the robot and get ${CONFIG.prize.pct}% off at Vergel.`)}</span></div>${sw}`;
    GK.intro({ brand: 'Vergel<b>®</b>', title: CONFIG.title, rules: CONFIG.rules, extra, button, note: CONFIG.note, onGo() { if (!coach.done()) { coach.start(); render(); } } });
  }

  // ── Foco de la guía sobre el mapa ───────────────────────────────────────────
  // El mapa es un canvas: la guía (GK.coach) acepta una función que devuelve el rectángulo en pantalla que cubre las comunidades.
  const mv = new THREE.Vector3();
  function mapRect() {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    regs.forEach(t => { t.group.getWorldPosition(mv); mv.project(camera); const x = (mv.x * 0.5 + 0.5) * innerWidth, y = (-mv.y * 0.5 + 0.5) * innerHeight; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
    const L = Math.max(0, x0 - 48), T = Math.max(72, y0 - 60), R = Math.min(innerWidth, x1 + 48), B = Math.min(innerHeight, y1 + 44);
    return { left: L, top: T, width: R - L, height: B - T };
  }

  // ── Bucle ───────────────────────────────────────────────────────────────────
  GK.loop((dt) => {
    regs.forEach(t => { t.pop += (0 - t.pop) * Math.min(1, dt * 7); t.lift += (t.liftTarget - t.lift) * (REDUCE ? 1 : Math.min(1, dt * 12)); t.group.position.y = t.lift + t.pop * 0.2; });
    rig.update(dt);
    if (coach.active) coach.place();
  }, () => renderer.render(scene, camera));

  GK.expose({
    openChat, pressReset, chatState: () => ({ open: !$('#lbchat').hidden, fallback: !!document.querySelector('.lbfail'), hasContainer: !!document.querySelector('.lbcont') }),
    state: () => st && ({ phase: st.phase, pool: st.pool, round: st.round, own: st.own.slice(), arm: st.arm.slice(), mine: count(st.own, 0), theirs: count(st.own, 1), sel: st.sel, tgt: st.tgt,
      level: st.level, overlay: GK.overlay.open, over: st.over, atk: st.atk.length, practice: coach.active, me }),
    plant, select, attack, startMove, selectMove, doMove, fortifyPick: () => fortifyPick(st.own, st.arm, 0), endTurn, cancel, newGame, coach, headless, pwin, pick: tileAt, reinf: (p) => reinf(st.own, p), afterDice, NB, N,
    setLevel: (l) => { level = l; },
    // Dónde cae cada comunidad en pantalla (px): para comprobar que el mapa se ve entero y no lo tapa el panel.
    tilesOnScreen: () => regs.map(t => { const v = new THREE.Vector3(); t.group.getWorldPosition(v); v.project(camera); return [Math.round((v.x * 0.5 + 0.5) * innerWidth), Math.round((-v.y * 0.5 + 0.5) * innerHeight)]; }),
    // Juega el turno del jugador con la política del robot (para recorridos automáticos)
    autoTurn: (thr = 1) => { if (st.phase === 'plant') { while (st.pool > 0) { const i = botPlace(st.own, st.arm, 0); if (i < 0) break; plant(i); } if (st.phase === 'plant') { st.phase = 'attack'; } }
      for (let k = 0; k < 60; k++) { const m = botAttack(st.own, st.arm, 0, thr); if (!m) break; st.sel = m.i; st.tgt = m.j; attack(true); afterDice(); if (st.over) return; }
      const fp = fortifyPick(st.own, st.arm, 0); if (fp) { st.phase = 'move'; st.sel = fp.i; st.tgt = fp.j; doMove(st.arm[fp.i] - 1, true); return; }
      endTurn(); },
  });
  applyLang(); newGame(); showIntro();
})();
