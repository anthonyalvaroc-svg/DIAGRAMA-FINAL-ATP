const FONT_SIZE_RELLENO = 16;
const STORAGE_KEY = "esquemas_tecnicos_estado_v2";

function setFuenteRelleno(ctx, color = "#111827", align = "center", baseline = "middle", size = FONT_SIZE_RELLENO) {
  ctx.fillStyle = color;
  ctx.font = `bold ${size}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
}

function drawTextWithHalo(ctx, texto, x, y, options = {}) {
  const {
    color = "#111827",
    align = "left",
    baseline = "middle",
    size = FONT_SIZE_RELLENO,
    padX = 4,
    padY = 2,
    bgColor = "rgba(255, 255, 255, 0.90)"
  } = options;

  ctx.save();
  setFuenteRelleno(ctx, color, align, baseline, size);
  const metrics = ctx.measureText(texto);
  const textW = metrics.width;
  const textH = size * 1.15;

  let boxX = x - padX;
  if (align === "center") boxX = x - textW / 2 - padX;
  else if (align === "right") boxX = x - textW - padX;

  let boxY = y - textH / 2 - padY;
  if (baseline === "top") boxY = y - padY;
  else if (baseline === "bottom") boxY = y - textH - padY;

  ctx.fillStyle = bgColor;
  ctx.fillRect(boxX, boxY, textW + padX * 2, textH + padY * 2);

  ctx.fillStyle = color;
  ctx.fillText(texto, x, y);
  ctx.restore();
}

function activarTab(targetId, btnEl) {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((b) => {
    b.classList.remove("active");
    b.setAttribute("aria-selected", "false");
    b.setAttribute("tabindex", "-1");
  });
  tabPanels.forEach((p) => {
    p.classList.remove("active");
    p.hidden = true;
  });

  if (btnEl) {
    btnEl.classList.add("active");
    btnEl.setAttribute("aria-selected", "true");
    btnEl.setAttribute("tabindex", "0");
  }
  const panel = document.getElementById(targetId);
  if (panel) {
    panel.classList.add("active");
    panel.hidden = false;
  }

  dibujarTabActiva(targetId);
}

window.activarTab = activarTab;

function getSitio() {
  const input = document.getElementById("sitio");
  const val = input ? input.value : "";
  return val.trim().toUpperCase() || "SITIO";
}

function getSitioSlug() {
  return getSitio().replace(/[^A-Z0-9_-]+/g, "_") || "SITIO";
}

function parsePositiveNum(val, fallback = 0) {
  const num = parseFloat(val);
  if (isNaN(num) || !isFinite(num)) return fallback;
  return Math.max(0, num);
}

function formatNum(val, dec = 2, fallback = 0) {
  return parsePositiveNum(val, fallback).toFixed(dec);
}

function limpiarCoordenada(raw) {
  if (!raw) return "";
  return raw.replace(/[°º]/g, "").replace(/\s+/g, " ").trim();
}

function setAviso(elementId, mensaje, tipo = "error") {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.toggle("warning", tipo === "warning");
  if (mensaje) {
    el.textContent = mensaje;
    el.hidden = false;
  } else {
    el.textContent = "";
    el.hidden = true;
  }
}

function descargarCanvas(canvasId, prefijo) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  descargarCanvasElement(canvas, `${prefijo}_${getSitioSlug()}.png`);
}

function descargarCanvasElement(canvas, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function dibujarSimboloTorre(ctx, tipo, cx, cy, sizeMultiplier = 1) {
  ctx.save();
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 3.5;

  let textOffsetY = 0;

  if (tipo === "auto_cuadrado") {
    const s = 148 * sizeMultiplier;
    ctx.strokeRect(cx - s / 2, cy - s / 2, s, s);
  } else if (tipo === "auto_triangulo") {
    const r = 82 * sizeMultiplier;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx - r * 0.9, cy + r * 0.72);
    ctx.lineTo(cx + r * 0.9, cy + r * 0.72);
    ctx.closePath();
    ctx.stroke();
    textOffsetY = 14 * sizeMultiplier;
  } else if (tipo === "monopolo") {
    const rad = 64 * sizeMultiplier;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.stroke();
  } else if (tipo === "ventada") {
    const s = 86 * sizeMultiplier;
    ctx.strokeRect(cx - s / 2, cy - s / 2, s, s);
  } else if (tipo === "arriostrada") {
    const rad = 40 * sizeMultiplier;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.stroke();
  }

  setFuenteRelleno(ctx, "#111827", "center", "middle");
  ctx.fillText("TORRE", cx, cy + textOffsetY);
  ctx.restore();
}

function dibujarPozo(ctx, x, y, label) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 2.5;
  ctx.fillRect(x - 14, y - 18, 28, 36);
  ctx.strokeRect(x - 14, y - 18, 28, 36);

  ctx.beginPath();
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x, y);
  ctx.moveTo(x - 9, y);
  ctx.lineTo(x + 9, y);
  ctx.moveTo(x - 6, y + 6);
  ctx.lineTo(x + 6, y + 6);
  ctx.moveTo(x - 3, y + 12);
  ctx.lineTo(x + 3, y + 12);
  ctx.stroke();

  setFuenteRelleno(ctx, "#111827", "center", "bottom");
  ctx.fillText(label, x, y - 22);
  ctx.restore();
}

function dibujarPuertaDobleHorizontal(ctx, x, y, anchoTotal, dirY = 1) {
  const half = anchoTotal / 2;
  ctx.save();

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x - 2, y - 6, anchoTotal + 4, 12);

  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y - 6);
  ctx.lineTo(x, y + 6);
  ctx.moveTo(x + anchoTotal, y - 6);
  ctx.lineTo(x + anchoTotal, y + 6);
  ctx.stroke();

  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + dirY * half);
  ctx.moveTo(x + anchoTotal, y);
  ctx.lineTo(x + anchoTotal, y + dirY * half);
  ctx.stroke();

  ctx.lineWidth = 1.6;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  if (dirY > 0) {
    ctx.arc(x, y, half, 0, Math.PI / 2, false);
    ctx.arc(x + anchoTotal, y, half, Math.PI / 2, Math.PI, false);
  } else {
    ctx.arc(x, y, half, -Math.PI / 2, 0, false);
    ctx.arc(x + anchoTotal, y, half, -Math.PI, -Math.PI / 2, false);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

/* =========================================================
   PESTAÑA 1: DIAGRAMA SPAT (F12M)
   ========================================================= */
function dibujarSpat() {
  const canvas = document.getElementById("canvasSpat");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const sitio = getSitio();
  const tipoTorre = document.getElementById("spatTipoTorre").value;
  const cantPozos = Math.min(6, Math.max(1, parseInt(document.getElementById("cantidadPozos").value, 10) || 3));
  const raw50 = parseFloat(document.getElementById("val50").value);
  const raw60 = parseFloat(document.getElementById("val60").value);
  const raw70 = parseFloat(document.getElementById("val70").value);

  const v50 = formatNum(raw50, 2);
  const v60 = formatNum(raw60, 2);
  const v70 = formatNum(raw70, 2);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const boxX = 65;
  const boxY = 55;
  const boxW = 380;
  const boxH = 400;

  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 5;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  const centerX = boxX + boxW / 2;
  ctx.save();
  setFuenteRelleno(ctx, "#dc2626", "center", "middle", 32);
  ctx.fillText(sitio, centerX, boxY + 34);
  ctx.restore();

  dibujarSimboloTorre(ctx, tipoTorre, centerX, boxY + boxH / 2 + 25, 1);

  const posicionesPozos = [
    { x: boxX + 275, y: boxY + 325 },
    { x: boxX + 275, y: boxY + 125 },
    { x: boxX + 190, y: boxY + 100 },
    { x: boxX + 95,  y: boxY + 125 },
    { x: boxX + 95,  y: boxY + 325 },
    { x: boxX + 185, y: boxY + 350 }
  ];

  if (cantPozos > 1) {
    ctx.save();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let i = 0; i < cantPozos; i++) {
      const p = posicionesPozos[i];
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < cantPozos; i++) {
    dibujarPozo(ctx, posicionesPozos[i].x, posicionesPozos[i].y, `PT0${i + 1}`);
  }

  const pt01 = posicionesPozos[0];
  const doorWidth = 76;
  const doorX = pt01.x - 28;
  const doorY = boxY + boxH;
  dibujarPuertaDobleHorizontal(ctx, doorX, doorY, doorWidth, 1);

  const telX = 435;
  const telY = 545;
  const telW = 30;
  const telH = 78;

  ctx.save();
  ctx.strokeStyle = "#16a34a";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(pt01.x, pt01.y + 18);
  ctx.lineTo(pt01.x, doorY + 62);
  ctx.lineTo(telX + 10, telY + 18);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 3;
  ctx.fillRect(telX, telY, telW, telH);
  ctx.strokeRect(telX, telY, telW, telH);

  setFuenteRelleno(ctx, "#111827", "left", "middle");
  ctx.fillText("TELUROMETRO", telX + 38, telY + 24);
  ctx.restore();

  const endBlueX = 595;
  const endBlueY = 825;
  ctx.save();
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 5.5;
  ctx.beginPath();
  ctx.moveTo(telX + 8, telY + telH);
  ctx.lineTo(endBlueX, endBlueY);
  ctx.stroke();

  const endRedX = 720;
  const endRedY = 935;
  ctx.strokeStyle = "#dc2626";
  ctx.lineWidth = 5.5;
  ctx.beginPath();
  ctx.moveTo(telX + 22, telY + telH);
  ctx.lineTo(endRedX, endRedY);
  ctx.stroke();
  ctx.restore();

  const lecturas = [
    { pct: "50%-15MTS=", ohm: `${v50} OHMS`, x: 565, y: 635 },
    { pct: "60%-18MTS=", ohm: `${v60} OHMS`, x: 645, y: 745 },
    { pct: "70%-21MTS=", ohm: `${v70} OHMS`, x: 725, y: 855 }
  ];

  lecturas.forEach((item) => {
    ctx.save();
    setFuenteRelleno(ctx, "#111827", "left", "top", 24);
    ctx.fillText(item.pct, item.x, item.y);

    setFuenteRelleno(ctx, "#dc2626", "left", "top", 48);
    ctx.fillText(item.ohm, item.x, item.y + 30);
    ctx.restore();
  });

  ctx.save();
  setFuenteRelleno(ctx, "#111827", "center", "top");
  ctx.fillText("30 MTS", endRedX, endRedY + 12);
  ctx.restore();

  if ([raw50, raw60, raw70].some((n) => isNaN(n) || n <= 0)) {
    setAviso("avisoSpat", "Verifica las mediciones de resistencia: hay valores en 0.00 OHMS o vacíos.", "warning");
  } else if (Math.max(raw50, raw60, raw70) > 25) {
    setAviso("avisoSpat", "Aviso técnico: una o más lecturas superan los 25 OHMS referenciales.", "warning");
  } else {
    setAviso("avisoSpat", "");
  }
}

/* =========================================================
   PESTAÑA 2: ESQUEMA 1 - PERÍMETRO Y COORDENADAS INCLINADAS
   ========================================================= */
function dibujarCoordInclinada(ctx, x, y, titulo, coordTexto, angleRad) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angleRad);

  drawTextWithHalo(ctx, titulo, 0, -13, { align: "center", baseline: "middle", size: FONT_SIZE_RELLENO });
  drawTextWithHalo(ctx, coordTexto || "-", 0, 13, { align: "center", baseline: "middle", size: FONT_SIZE_RELLENO });
  ctx.restore();
}

function dibujarPerimetro() {
  const canvas = document.getElementById("canvasPerimetro");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const sitio = getSitio();
  const rawAncho = parseFloat(document.getElementById("perAncho").value);
  const rawLargo = parseFloat(document.getElementById("perLargo").value);
  const invalidoDim = isNaN(rawAncho) || isNaN(rawLargo) || rawAncho <= 0 || rawLargo <= 0;

  const numAncho = rawAncho > 0 ? rawAncho : 8.1;
  const numLargo = rawLargo > 0 ? rawLargo : 10.0;
  const ancho = numAncho.toFixed(2);
  const largo = numLargo.toFixed(2);

  const tipoTorre = document.getElementById("perTipoTorre").value;
  const coordA = limpiarCoordenada(document.getElementById("coordA").value);
  const coordB = limpiarCoordenada(document.getElementById("coordB").value);
  const coordC = limpiarCoordenada(document.getElementById("coordC").value);
  const coordD = limpiarCoordenada(document.getElementById("coordD").value);

  const faltanCoords = !coordA || !coordB || !coordC || !coordD;

  if (invalidoDim) {
    setAviso("avisoPerimetro", "Ingresa valores mayores a 0 en Ancho y Largo para calcular la proporción exacta.", "error");
  } else if (faltanCoords) {
    setAviso("avisoPerimetro", "Faltan una o más coordenadas de vértice (A, B, C o D).", "warning");
  } else {
    setAviso("avisoPerimetro", "");
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const ratio = numAncho / numLargo;
  const maxW = 640;
  const maxH = 520;
  const minSide = 310;
  let rectW = maxW;
  let rectH = maxH;

  if (ratio >= 1) {
    rectW = maxW;
    rectH = Math.max(minSide, Math.min(maxH, maxW / ratio));
  } else {
    rectH = maxH;
    rectW = Math.max(minSide, Math.min(maxW, maxH * ratio));
  }

  const rectX = (canvas.width - rectW) / 2;
  const rectY = 145;

  const doorW = 84;
  const doorX = rectX + 24;
  const doorY = rectY;
  dibujarPuertaDobleHorizontal(ctx, doorX, doorY, doorW, -1);

  ctx.save();
  const calloutX = rectX - 24;
  const calloutY = rectY - 84;
  const calloutW = 190;
  const calloutH = 42;
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#64748b";
  ctx.lineWidth = 1.5;
  ctx.fillRect(calloutX, calloutY, calloutW, calloutH);
  ctx.strokeRect(calloutX, calloutY, calloutW, calloutH);

  ctx.beginPath();
  ctx.moveTo(calloutX + calloutW * 0.55, calloutY + calloutH);
  ctx.lineTo(doorX + doorW * 0.5, doorY - 40);
  ctx.stroke();

  setFuenteRelleno(ctx, "#111827", "center", "middle");
  ctx.fillText("PUERTA DE ACCESO", calloutX + calloutW / 2, calloutY + calloutH / 2);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 4;
  ctx.strokeRect(rectX, rectY, rectW, rectH);
  ctx.restore();

  const centerRectX = rectX + rectW / 2;
  const centerRectY = rectY + rectH / 2;

  [rectY - 24, rectY + rectH + 26].forEach((by) => {
    ctx.save();
    setFuenteRelleno(ctx, "#111827", "center", "middle");
    ctx.fillText(`${ancho} MTS`, centerRectX, by);
    ctx.restore();
  });

  [rectX - 28, rectX + rectW + 28].forEach((bx) => {
    ctx.save();
    ctx.translate(bx, centerRectY);
    ctx.rotate(-Math.PI / 2);
    setFuenteRelleno(ctx, "#111827", "center", "middle");
    ctx.fillText(`${largo} MTS`, 0, 0);
    ctx.restore();
  });

  const sizeMult = Math.max(0.55, Math.min(0.85, Math.min(rectW, rectH) / 480));
  drawTextWithHalo(ctx, sitio, centerRectX, centerRectY - 82 * sizeMult, {
    color: "#dc2626",
    align: "center",
    baseline: "middle",
    size: 32
  });

  dibujarSimboloTorre(ctx, tipoTorre, centerRectX, centerRectY + 12 * sizeMult, sizeMult);

  const diagOffsetX = Math.min(125, rectW * 0.24);
  const diagOffsetY = Math.min(78, rectH * 0.22);

  dibujarCoordInclinada(ctx, rectX + diagOffsetX, rectY + diagOffsetY, "COORDENADA A:", coordA, -Math.PI / 4);
  dibujarCoordInclinada(ctx, rectX + rectW - diagOffsetX, rectY + diagOffsetY, "COORDENADA B:", coordB, Math.PI / 4);
  dibujarCoordInclinada(ctx, rectX + rectW - diagOffsetX, rectY + rectH - diagOffsetY, "COORDENADA C:", coordC, -Math.PI / 4);
  dibujarCoordInclinada(ctx, rectX + diagOffsetX, rectY + rectH - diagOffsetY, "COORDENADA D:", coordD, Math.PI / 4);
}

/* =========================================================
   PESTAÑA 3: ESQUEMA 2 - ELEVACIÓN DE TORRE
   ========================================================= */
const MODELOS_TORRE = {
  arbol: {
    nombre: "Torre público tipo árbol",
    src: "img/1_torre_arbol.png",
    sitioPos: { xRatio: 0.77, yRatio: 0.135 },
    cotas: (v) => [
      { texto: `${v.alturaTotal} m`, xRatio: 0.175, yRatio: 0.440, size: 22 },
      { texto: `${v.alturaBase} m`,  xRatio: 0.892, yRatio: 0.928, size: 22 }
    ]
  },
  monopolo: {
    nombre: "Torre monopolo",
    src: "img/2_torre_monopolo.png",
    sitioPos: { xRatio: 0.16, yRatio: 0.15 },
    cotas: (v) => [
      { texto: `${v.alturaTotal} m`, xRatio: 0.175, yRatio: 0.450, size: 23 },
      { texto: `${v.alturaBase} m`,  xRatio: 0.855, yRatio: 0.956, size: 21 },
      { texto: `${v.rol1Sup} m`,     xRatio: 0.840, yRatio: 0.066, size: 15 },
      { texto: `${v.rol1Inf} m`,     xRatio: 0.840, yRatio: 0.128, size: 15 },
      { texto: `${v.rol2Sup} m`,     xRatio: 0.840, yRatio: 0.189, size: 15 },
      { texto: `${v.rol2Inf} m`,     xRatio: 0.840, yRatio: 0.251, size: 15 },
      { texto: `${v.rol3Sup} m`,     xRatio: 0.840, yRatio: 0.312, size: 15 },
      { texto: `${v.rol3Inf} m`,     xRatio: 0.840, yRatio: 0.371, size: 15 }
    ]
  },
  autosoportada_normal: {
    nombre: "Torre autosoportada (roldana normal)",
    src: "img/3_torre_autosoportada_normal.png",
    sitioPos: { xRatio: 0.16, yRatio: 0.13 },
    cotas: (v) => [
      { texto: `${v.roldanaSup} m`,  xRatio: 0.175, yRatio: 0.562, size: 21 },
      { texto: `${v.roldanaInf} m`,  xRatio: 0.785, yRatio: 0.576, size: 18 },
      { texto: `${v.alturaTotal} m`, xRatio: 0.915, yRatio: 0.486, size: 21 },
      { texto: `${v.alturaBase} m`,  xRatio: 0.415, yRatio: 0.960, size: 20 }
    ]
  },
  arriostrada_escalera_gato: {
    nombre: "Torre arriostrada con escalera gato",
    src: "img/4_torre_arriostrada_escalera.png",
    sitioPos: { xRatio: 0.14, yRatio: 0.15 },
    cotas: (v) => [
      { texto: `${v.alturaBase} m`,     xRatio: 0.268, yRatio: 0.412, size: 18 },
      { texto: `${v.alturaTotal} m`,    xRatio: 0.678, yRatio: 0.238, size: 20 },
      { texto: `${v.alturaEscalera} m`, xRatio: 0.768, yRatio: 0.494, size: 17 },
      { texto: `${v.alturaEdificio} m`, xRatio: 0.878, yRatio: 0.774, size: 20 }
    ]
  },
  ventada_edificio: {
    nombre: "Torre ventada con edificio",
    src: "img/5_torre_ventada_edificio.png",
    sitioPos: { xRatio: 0.14, yRatio: 0.15 },
    cotas: (v) => [
      { texto: `${v.alturaTotal} m`,    xRatio: 0.842, yRatio: 0.285, size: 20 },
      { texto: `${v.alturaBase} m`,     xRatio: 0.452, yRatio: 0.514, size: 18 },
      { texto: `${v.alturaEdificio} m`, xRatio: 0.885, yRatio: 0.794, size: 20 }
    ]
  },
  ventada_piso: {
    nombre: "Torre ventada de piso",
    src: "img/6_torre_ventada_piso.png",
    sitioPos: { xRatio: 0.14, yRatio: 0.16 },
    cotas: (v) => [
      { texto: `${v.alturaTotal} m`, xRatio: 0.922, yRatio: 0.542, size: 20 },
      { texto: `${v.alturaBase} m`,  xRatio: 0.562, yRatio: 0.950, size: 18 }
    ]
  },
  autosoportada_encima: {
    nombre: "Torre autosoportada (roldana encima)",
    src: "img/7_torre_autosoportada_encima.png",
    sitioPos: { xRatio: 0.15, yRatio: 0.11 },
    cotas: (v) => [
      { texto: `${v.roldanaSup} m`,  xRatio: 0.172, yRatio: 0.562, size: 18 },
      { texto: `${v.roldanaInf} m`,  xRatio: 0.785, yRatio: 0.576, size: 18 },
      { texto: `${v.alturaTotal} m`, xRatio: 0.925, yRatio: 0.486, size: 20 },
      { texto: `${v.alturaBase} m`,  xRatio: 0.408, yRatio: 0.960, size: 20 }
    ]
  },
  arriostrada_edificio_normal: {
    nombre: "Torre arriostrada con edificio normal",
    src: "img/8_torre_arriostrada_edificio.png",
    sitioPos: { xRatio: 0.14, yRatio: 0.13 },
    cotas: (v) => [
      { texto: `${v.alturaBase} m`,     xRatio: 0.282, yRatio: 0.528, size: 18 },
      { texto: `${v.alturaTotal} m`,    xRatio: 0.835, yRatio: 0.292, size: 20 },
      { texto: `${v.alturaEdificio} m`, xRatio: 0.872, yRatio: 0.768, size: 20 }
    ]
  }
};

const cacheImagenesTorre = {};
const customTorreCargada = {};

function obtenerImagenTorre(tipo, callback) {
  if (cacheImagenesTorre[tipo] && cacheImagenesTorre[tipo].complete && cacheImagenesTorre[tipo].naturalWidth > 0) {
    callback(cacheImagenesTorre[tipo], true);
    return;
  }

  const modelo = MODELOS_TORRE[tipo];
  if (!modelo) {
    callback(null, false);
    return;
  }

  const img = new Image();
  img.onload = () => {
    cacheImagenesTorre[tipo] = img;
    callback(img, true);
  };
  img.onerror = () => {
    callback(null, false);
  };
  img.src = modelo.src;
}

function actualizarCamposTorre() {
  const tipo = document.getElementById("torreTipo").value;
  const isMonopolo = tipo === "monopolo";
  const isStdRoldana = tipo === "autosoportada_normal" || tipo === "autosoportada_encima";
  const hasEscalera = tipo === "arriostrada_escalera_gato";
  const hasEdificio =
    tipo === "ventada_edificio" ||
    tipo === "arriostrada_edificio_normal" ||
    tipo === "arriostrada_escalera_gato";

  document.querySelectorAll(".grp-monopolo").forEach((el) => (el.hidden = !isMonopolo));
  document.querySelectorAll(".grp-roldana-std").forEach((el) => (el.hidden = !isStdRoldana));
  document.querySelectorAll(".grp-edificio").forEach((el) => (el.hidden = !hasEdificio));
  document.querySelectorAll(".grp-escalera").forEach((el) => (el.hidden = !hasEscalera));

  const btnRestaurar = document.getElementById("btnRestaurarImgTorre");
  if (btnRestaurar) {
    btnRestaurar.hidden = !customTorreCargada[tipo];
  }
}

function dibujarTorreElevacion() {
  const canvas = document.getElementById("canvasTorre");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  actualizarCamposTorre();

  const sitio = getSitio();
  const tipoTorre = document.getElementById("torreTipo").value;
  const modelo = MODELOS_TORRE[tipoTorre];

  const rawAlturaTotal = parseFloat(document.getElementById("alturaTorre").value);
  const rawAlturaBase = parseFloat(document.getElementById("alturaBase").value);
  const rawRoldanaSup = parseFloat(document.getElementById("roldanaSup").value);
  const rawRoldanaInf = parseFloat(document.getElementById("roldanaInf").value);

  const valores = {
    alturaTotal: formatNum(rawAlturaTotal, 2, 30),
    alturaBase: formatNum(rawAlturaBase, 2, 1.2),
    roldanaSup: formatNum(rawRoldanaSup, 2, 28.5),
    roldanaInf: formatNum(rawRoldanaInf, 2, 27.3),
    rol1Sup: formatNum(document.getElementById("rol1Sup").value, 2, 29.0),
    rol1Inf: formatNum(document.getElementById("rol1Inf").value, 2, 27.8),
    rol2Sup: formatNum(document.getElementById("rol2Sup").value, 2, 26.0),
    rol2Inf: formatNum(document.getElementById("rol2Inf").value, 2, 24.8),
    rol3Sup: formatNum(document.getElementById("rol3Sup").value, 2, 23.0),
    rol3Inf: formatNum(document.getElementById("rol3Inf").value, 2, 21.8),
    alturaEdificio: formatNum(document.getElementById("alturaEdificio").value, 2, 12.0),
    alturaEscalera: formatNum(document.getElementById("alturaEscaleraGato").value, 2, 2.4)
  };

  const avisos = [];
  if (rawAlturaTotal <= 0 || isNaN(rawAlturaTotal)) {
    avisos.push("La altura total debe ser mayor a 0 m.");
  }
  if (!isNaN(rawAlturaBase) && !isNaN(rawAlturaTotal) && rawAlturaBase > rawAlturaTotal) {
    avisos.push("La altura de base/pedestal supera la altura total ingresada.");
  }
  if (tipoTorre === "autosoportada_normal" || tipoTorre === "autosoportada_encima") {
    if (!isNaN(rawRoldanaInf) && !isNaN(rawRoldanaSup) && rawRoldanaInf > rawRoldanaSup) {
      avisos.push("La altura de roldana inferior supera la roldana superior.");
    }
    if (!isNaN(rawRoldanaSup) && !isNaN(rawAlturaTotal) && rawRoldanaSup > rawAlturaTotal + 2) {
      avisos.push("Verifica la altura de roldana superior respecto a la altura de torre.");
    }
  }

  obtenerImagenTorre(tipoTorre, (img, cargada) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!cargada || !img) {
      avisos.push(
        `No se encontró "${modelo.src}". Verifica la carpeta img/ o selecciona la imagen en "Imagen base de este modelo (opcional)".`
      );
      setAviso("avisoTorre", avisos.join(" "), "error");

      ctx.save();
      ctx.strokeStyle = "#94a3b8";
      ctx.setLineDash([6, 4]);
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      ctx.setLineDash([]);

      setFuenteRelleno(ctx, "#dc2626", "center", "middle", 20);
      ctx.fillText(modelo.nombre.toUpperCase(), canvas.width / 2, canvas.height / 2 - 40);

      setFuenteRelleno(ctx, "#334155", "center", "middle", 15);
      ctx.fillText(`Ruta esperada: ${modelo.src}`, canvas.width / 2, canvas.height / 2);
      ctx.fillText("O usa el selector de archivo superior para insertar la imagen sin modificar su forma.", canvas.width / 2, canvas.height / 2 + 30);
      ctx.restore();
      return;
    }

    setAviso("avisoTorre", avisos.join(" "), avisos.length ? "warning" : "error");

    const pad = 20;
    const maxW = canvas.width - pad * 2;
    const maxH = canvas.height - pad * 2;
    const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const drawX = (canvas.width - drawW) / 2;
    const drawY = (canvas.height - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    const sPos = modelo.sitioPos || { xRatio: 0.24, yRatio: 0.22 };
    drawTextWithHalo(ctx, sitio, drawX + drawW * sPos.xRatio, drawY + drawH * sPos.yRatio, {
      color: "#dc2626",
      align: "center",
      baseline: "middle",
      size: 30,
      padX: 6,
      padY: 3
    });

    const etiquetas = modelo.cotas(valores);
    etiquetas.forEach((item) => {
      const tx = drawX + drawW * item.xRatio;
      const ty = drawY + drawH * item.yRatio;
      const fontSize = item.size || 20;

      drawTextWithHalo(ctx, item.texto, tx, ty, {
        color: "#111827",
        align: "left",
        baseline: "middle",
        size: fontSize,
        padX: 4,
        padY: 2
      });
    });

    if (new URLSearchParams(window.location.search).get("calibrar") === "1") {
      ctx.save();
      ctx.strokeStyle = "rgba(37, 99, 235, 0.35)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 10; i++) {
        const gx = drawX + (drawW * i) / 10;
        const gy = drawY + (drawH * i) / 10;
        ctx.beginPath();
        ctx.moveTo(gx, drawY);
        ctx.lineTo(gx, drawY + drawH);
        ctx.moveTo(drawX, gy);
        ctx.lineTo(drawX + drawW, gy);
        ctx.stroke();
      }
      ctx.restore();
    }
  });
}

document.getElementById("customTorreImg").addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const tipo = document.getElementById("torreTipo").value;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      cacheImagenesTorre[tipo] = img;
      customTorreCargada[tipo] = true;
      dibujarTorreElevacion();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

const btnRestaurarImg = document.getElementById("btnRestaurarImgTorre");
if (btnRestaurarImg) {
  btnRestaurarImg.addEventListener("click", () => {
    const tipo = document.getElementById("torreTipo").value;
    delete cacheImagenesTorre[tipo];
    delete customTorreCargada[tipo];
    const inputFile = document.getElementById("customTorreImg");
    if (inputFile) inputFile.value = "";
    dibujarTorreElevacion();
  });
}

/* =========================================================
   PESTAÑA 4: ESQUEMA DE EQUIPOS EN TORRE (1 A 4 FOTOS PANORÁMICAS)
   ========================================================= */
let listaEquipos = [
  { id: 1, etiqueta: "MW 4", altura: 29.2, lado: "IZQ" },
  { id: 2, etiqueta: "RF 5", altura: 28.8, lado: "DER" },
  { id: 3, etiqueta: "RRU 3", altura: 28.2, lado: "DER" },
  { id: 4, etiqueta: "RRU 6", altura: 28.0, lado: "IZQ" },
  { id: 5, etiqueta: "RRU 7", altura: 27.6, lado: "IZQ" },
  { id: 6, etiqueta: "RF 10", altura: 27.2, lado: "DER" },
  { id: 7, etiqueta: "RRU 2", altura: 26.8, lado: "IZQ" },
  { id: 8, etiqueta: "RRU 8", altura: 26.2, lado: "DER" },
  { id: 9, etiqueta: "RF 1", altura: 25.5, lado: "IZQ" },
  { id: 10, etiqueta: "RRU 9", altura: 25.0, lado: "DER" }
];

// Almacena las fotos panorámicas cargadas (máx. 4)
// Cada foto: { id, nombreArchivo, img, canvas, callouts: [...] }
let fotosPanoramicas = [];

function obtenerEquiposOrdenados() {
  return [...listaEquipos]
    .filter((eq) => eq.etiqueta.trim() !== "")
    .sort((a, b) => (parseFloat(b.altura) || 0) - (parseFloat(a.altura) || 0));
}

function agruparEquiposPorAltura(equiposOrdenados, agrupar) {
  if (!agrupar) {
    return equiposOrdenados.map((eq, idx) => ({
      texto: eq.etiqueta.trim(),
      altura: parseFloat(eq.altura) || 0,
      lado: eq.lado || (idx % 2 === 0 ? "DER" : "IZQ")
    }));
  }

  const grupos = [];
  const tolerancia = 0.05;

  equiposOrdenados.forEach((eq) => {
    const h = parseFloat(eq.altura) || 0;
    const lado = eq.lado || "AUTO";
    const existente = grupos.find(
      (g) => Math.abs(g.altura - h) <= tolerancia && g.lado === lado
    );
    if (existente) {
      existente.items.push(eq.etiqueta.trim());
    } else {
      grupos.push({
        altura: h,
        lado,
        items: [eq.etiqueta.trim()]
      });
    }
  });

  return grupos.map((g, idx) => {
    // Compactar etiquetas si comparten prefijo (ej: RRU 12, RRU 13 -> RRU 12-13)
    const texto = formatearGrupoEtiquetas(g.items);
    const ladoFinal = g.lado === "AUTO" ? (idx % 2 === 0 ? "DER" : "IZQ") : g.lado;
    return {
      texto,
      altura: g.altura,
      lado: ladoFinal
    };
  });
}

function formatearGrupoEtiquetas(items) {
  if (items.length <= 1) return items[0] || "";
  // Verificar si todos tienen el mismo prefijo textual (ej. "RRU 12", "RRU 13")
  const parsed = items.map((str) => {
    const m = str.match(/^([A-Za-zÁÉÍÓÚÑáéíóúñ]+)\s*[-_]?\s*(\d+.*)$/);
    return m ? { prefix: m[1].toUpperCase(), num: m[2] } : null;
  });

  if (parsed.every((p) => p !== null) && new Set(parsed.map((p) => p.prefix)).size === 1) {
    return `${parsed[0].prefix} ${parsed.map((p) => p.num).join("-")}`;
  }
  return items.join(" / ");
}

function calcularCalloutsParaFoto(foto) {
  const ordenados = obtenerEquiposOrdenados();
  const agrupar = document.getElementById("equiposAgrupar").value === "si";
  const grupos = agruparEquiposPorAltura(ordenados, agrupar);

  const alturaMax = Math.max(1, parseFloat(document.getElementById("equiposAlturaRef").value) || 30);
  const izqItems = [];
  const derItems = [];

  grupos.forEach((g, idx) => {
    const lado = g.lado === "IZQ" || g.lado === "DER" ? g.lado : idx % 2 === 0 ? "DER" : "IZQ";
    const ratioH = Math.min(1, Math.max(0, g.altura / alturaMax));
    // Mapear altura: la cima de la torre suele estar alrededor de y=0.14 y la base en y=0.86
    const rawTargetY = 0.86 - ratioH * 0.72;
    const item = {
      texto: g.texto,
      altura: g.altura,
      lado,
      targetX: lado === "IZQ" ? 0.475 : 0.525,
      targetY: rawTargetY,
      labelX: lado === "IZQ" ? 0.24 : 0.76,
      labelY: rawTargetY
    };
    if (lado === "IZQ") izqItems.push(item);
    else derItems.push(item);
  });

  // Evitar superposición vertical entre etiquetas del mismo lado
  const separarVertical = (arr) => {
    arr.sort((a, b) => a.labelY - b.labelY);
    const minGap = 0.044;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].labelY - arr[i - 1].labelY < minGap) {
        arr[i].labelY = Math.min(0.92, arr[i - 1].labelY + minGap);
      }
    }
    // Si la última se pasó abajo, empujar hacia arriba
    for (let i = arr.length - 2; i >= 0; i--) {
      if (arr[i + 1].labelY - arr[i].labelY < minGap) {
        arr[i].labelY = Math.max(0.08, arr[i + 1].labelY - minGap);
      }
    }
  };

  separarVertical(izqItems);
  separarVertical(derItems);

  foto.callouts = [...izqItems, ...derItems];
}

function dibujarFlechaRoja(ctx, fromX, fromY, toX, toY) {
  const headLen = 13;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.save();
  // Halo blanco sutil bajo la línea para que destaque incluso sobre antenas oscuras o cielo brillante
  ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
  ctx.lineWidth = 4.6;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Línea roja principal
  ctx.strokeStyle = "#ef1d1d";
  ctx.fillStyle = "#ef1d1d";
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Punta de flecha en el equipo
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 7), toY - headLen * Math.sin(angle - Math.PI / 7));
  ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 7), toY - headLen * Math.sin(angle + Math.PI / 7));
  ctx.closePath();
  ctx.fill();

  // Pequeño punto de anclaje arrastrable en la punta
  ctx.beginPath();
  ctx.arc(toX, toY, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function dibujarTextoEquipoRojo(ctx, texto, x, y, align, fontSize) {
  ctx.save();
  ctx.font = `bold ${fontSize}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";

  // Contorno blanco suave para máxima legibilidad sobre nubes o estructura
  ctx.lineJoin = "round";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.88)";
  ctx.strokeText(texto, x, y);

  ctx.fillStyle = "#ef1d1d";
  ctx.fillText(texto, x, y);
  ctx.restore();
}

function renderizarFotoEquipos(foto) {
  const canvas = foto.canvas;
  if (!canvas || !foto.img) return;
  const ctx = canvas.getContext("2d");

  const img = foto.img;
  // Normalizar resolución de salida manteniendo la proporción exacta
  const targetW = 1000;
  const scale = targetW / img.naturalWidth;
  canvas.width = targetW;
  canvas.height = Math.round(img.naturalHeight * scale);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const fontSize = parseInt(document.getElementById("equiposFontSize").value, 10) || 20;

  foto.callouts.forEach((c) => {
    const lx = c.labelX * canvas.width;
    const ly = c.labelY * canvas.height;
    const tx = c.targetX * canvas.width;
    const ty = c.targetY * canvas.height;

    const esIzquierda = lx <= tx;
    const align = esIzquierda ? "right" : "left";
    const lineStartX = esIzquierda ? lx + 6 : lx - 6;

    dibujarFlechaRoja(ctx, lineStartX, ly, tx, ty);
    dibujarTextoEquipoRojo(ctx, c.texto, lx, ly, align, fontSize);

    // Guardar caja aproximada para detección de arrastre
    ctx.save();
    ctx.font = `bold ${fontSize}px Arial, Helvetica, sans-serif`;
    const w = ctx.measureText(c.texto).width;
    ctx.restore();
    c._hitBox = {
      x1: esIzquierda ? lx - w - 10 : lx - 10,
      x2: esIzquierda ? lx + 10 : lx + w + 10,
      y1: ly - fontSize * 0.8,
      y2: ly + fontSize * 0.8,
      tx,
      ty
    };
  });
}

function renderizarTodasLasFotosEquipos() {
  fotosPanoramicas.forEach((foto) => renderizarFotoEquipos(foto));
}

function habilitarArrastreEnCanvas(foto) {
  const canvas = foto.canvas;
  let dragging = null; // { callout, mode: 'label' | 'target' }

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const onDown = (e) => {
    const pos = getPos(e);
    // Buscar primero si tocó la punta de la flecha (target) o el texto (label)
    for (let i = foto.callouts.length - 1; i >= 0; i--) {
      const c = foto.callouts[i];
      if (!c._hitBox) continue;
      const distTarget = Math.hypot(pos.x - c._hitBox.tx, pos.y - c._hitBox.ty);
      if (distTarget <= 18) {
        dragging = { callout: c, mode: "target" };
        e.preventDefault();
        return;
      }
      if (
        pos.x >= c._hitBox.x1 &&
        pos.x <= c._hitBox.x2 &&
        pos.y >= c._hitBox.y1 &&
        pos.y <= c._hitBox.y2
      ) {
        dragging = { callout: c, mode: "label" };
        e.preventDefault();
        return;
      }
    }
  };

  const onMove = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const pos = getPos(e);
    const nx = Math.min(0.97, Math.max(0.03, pos.x / canvas.width));
    const ny = Math.min(0.97, Math.max(0.03, pos.y / canvas.height));

    if (dragging.mode === "target") {
      dragging.callout.targetX = nx;
      dragging.callout.targetY = ny;
    } else {
      dragging.callout.labelX = nx;
      dragging.callout.labelY = ny;
    }
    renderizarFotoEquipos(foto);
  };

  const onUp = () => {
    dragging = null;
  };

  canvas.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  canvas.addEventListener("touchstart", onDown, { passive: false });
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onUp);
}

function construirGaleriaEquipos() {
  const galeria = document.getElementById("galeriaEquipos");
  if (!galeria) return;
  galeria.innerHTML = "";

  if (fotosPanoramicas.length === 0) {
    galeria.innerHTML = `
      <div class="empty-photos-msg">
        Sube de 1 a 4 fotos panorámicas de la torre para generar automáticamente las flechas rojas y etiquetas según la lista de alturas.
      </div>`;
    return;
  }

  fotosPanoramicas.forEach((foto, index) => {
    const card = document.createElement("div");
    card.className = "foto-card";

    const header = document.createElement("div");
    header.className = "foto-card-header";

    const title = document.createElement("span");
    title.className = "foto-card-title";
    title.textContent = `Foto Panorámica ${index + 1} (${foto.nombreArchivo})`;

    const actions = document.createElement("div");
    actions.className = "foto-card-actions";

    const btnResetPos = document.createElement("button");
    btnResetPos.type = "button";
    btnResetPos.className = "btn-action btn-ghost";
    btnResetPos.style.padding = "6px 10px";
    btnResetPos.style.fontSize = "12px";
    btnResetPos.textContent = "Auto-alinear";
    btnResetPos.addEventListener("click", () => {
      calcularCalloutsParaFoto(foto);
      renderizarFotoEquipos(foto);
    });

    const btnDown = document.createElement("button");
    btnDown.type = "button";
    btnDown.className = "btn-action btn-primary";
    btnDown.style.padding = "6px 12px";
    btnDown.style.fontSize = "12px";
    btnDown.textContent = `Descargar Foto ${index + 1}`;
    btnDown.addEventListener("click", () => {
      renderizarFotoEquipos(foto);
      descargarCanvasElement(foto.canvas, `ESQUEMA_EQUIPOS_TORRE_${index + 1}_${getSitioSlug()}.png`);
    });

    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "btn-danger-sm";
    btnDel.textContent = "Quitar";
    btnDel.addEventListener("click", () => {
      fotosPanoramicas = fotosPanoramicas.filter((f) => f.id !== foto.id);
      construirGaleriaEquipos();
    });

    actions.appendChild(btnResetPos);
    actions.appendChild(btnDown);
    actions.appendChild(btnDel);

    header.appendChild(title);
    header.appendChild(actions);

    const canvas = document.createElement("canvas");
    foto.canvas = canvas;

    card.appendChild(header);
    card.appendChild(canvas);
    galeria.appendChild(card);

    if (!foto.callouts || foto.callouts.length === 0) {
      calcularCalloutsParaFoto(foto);
    }
    renderizarFotoEquipos(foto);
    habilitarArrastreEnCanvas(foto);
  });
}

function renderizarTablaEquipos() {
  const tbody = document.getElementById("tbodyEquipos");
  if (!tbody) return;
  tbody.innerHTML = "";

  listaEquipos.forEach((eq) => {
    const tr = document.createElement("tr");

    const tdNombre = document.createElement("td");
    const inpNombre = document.createElement("input");
    inpNombre.type = "text";
    inpNombre.value = eq.etiqueta;
    inpNombre.placeholder = "Ej. RF 1, RRU 2, MW 4";
    inpNombre.addEventListener("input", () => {
      eq.etiqueta = inpNombre.value;
      guardarEstadoLocal();
      recalcularYRenderizarTodasFotos();
    });
    tdNombre.appendChild(inpNombre);

    const tdAltura = document.createElement("td");
    const inpAltura = document.createElement("input");
    inpAltura.type = "number";
    inpAltura.step = "0.01";
    inpAltura.min = "0";
    inpAltura.value = eq.altura;
    inpAltura.addEventListener("input", () => {
      eq.altura = parseFloat(inpAltura.value) || 0;
      guardarEstadoLocal();
      recalcularYRenderizarTodasFotos();
    });
    inpAltura.addEventListener("change", () => {
      listaEquipos.sort((a, b) => (parseFloat(b.altura) || 0) - (parseFloat(a.altura) || 0));
      renderizarTablaEquipos();
      recalcularYRenderizarTodasFotos();
    });
    tdAltura.appendChild(inpAltura);

    const tdLado = document.createElement("td");
    const selLado = document.createElement("select");
    [
      { val: "AUTO", label: "Automático (Alternado)" },
      { val: "IZQ", label: "Izquierda" },
      { val: "DER", label: "Derecha" }
    ].forEach((opt) => {
      const o = document.createElement("option");
      o.value = opt.val;
      o.textContent = opt.label;
      if ((eq.lado || "AUTO") === opt.val) o.selected = true;
      selLado.appendChild(o);
    });
    selLado.addEventListener("change", () => {
      eq.lado = selLado.value;
      guardarEstadoLocal();
      recalcularYRenderizarTodasFotos();
    });
    tdLado.appendChild(selLado);

    const tdAccion = document.createElement("td");
    const btnQuitar = document.createElement("button");
    btnQuitar.type = "button";
    btnQuitar.className = "btn-danger-sm";
    btnQuitar.textContent = "Eliminar";
    btnQuitar.addEventListener("click", () => {
      listaEquipos = listaEquipos.filter((item) => item.id !== eq.id);
      guardarEstadoLocal();
      renderizarTablaEquipos();
      recalcularYRenderizarTodasFotos();
    });
    tdAccion.appendChild(btnQuitar);

    tr.appendChild(tdNombre);
    tr.appendChild(tdAltura);
    tr.appendChild(tdLado);
    tr.appendChild(tdAccion);
    tbody.appendChild(tr);
  });
}

function recalcularYRenderizarTodasFotos() {
  fotosPanoramicas.forEach((foto) => {
    calcularCalloutsParaFoto(foto);
    renderizarFotoEquipos(foto);
  });
}

document.getElementById("equiposFotos").addEventListener("change", (e) => {
  const files = Array.from(e.target.files || []);
  if (!files.length) return;

  const disponibles = 4 - fotosPanoramicas.length;
  if (disponibles <= 0) {
    setAviso("avisoEquipos", "Ya tienes el máximo de 4 fotos panorámicas cargadas. Quita una para agregar otra.", "warning");
    e.target.value = "";
    return;
  }

  const seleccionados = files.slice(0, disponibles);
  if (files.length > disponibles) {
    setAviso("avisoEquipos", `Solo se cargaron ${disponibles} foto(s) para no superar el límite de 4 fotos panorámicas.`, "warning");
  } else {
    setAviso("avisoEquipos", "");
  }

  let pendientes = seleccionados.length;
  seleccionados.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const nuevaFoto = {
          id: Date.now() + i + Math.random(),
          nombreArchivo: file.name,
          img,
          canvas: null,
          callouts: []
        };
        calcularCalloutsParaFoto(nuevaFoto);
        fotosPanoramicas.push(nuevaFoto);
        pendientes--;
        if (pendientes === 0) {
          construirGaleriaEquipos();
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  e.target.value = "";
});

document.getElementById("btnAgregarEquipo").addEventListener("click", () => {
  const maxH = listaEquipos.length
    ? Math.max(...listaEquipos.map((e) => parseFloat(e.altura) || 0))
    : 28.0;
  listaEquipos.push({
    id: Date.now() + Math.random(),
    etiqueta: `RF ${listaEquipos.length + 1}`,
    altura: Number(Math.max(1, maxH - 0.5).toFixed(2)),
    lado: "AUTO"
  });
  listaEquipos.sort((a, b) => (parseFloat(b.altura) || 0) - (parseFloat(a.altura) || 0));
  guardarEstadoLocal();
  renderizarTablaEquipos();
  recalcularYRenderizarTodasFotos();
});

document.getElementById("btnPegarListaEquipos").addEventListener("click", () => {
  const panel = document.getElementById("panelPegarEquipos");
  panel.hidden = !panel.hidden;
});

document.getElementById("btnCerrarPegadoEquipos").addEventListener("click", () => {
  document.getElementById("panelPegarEquipos").hidden = true;
});

document.getElementById("btnProcesarPegadoEquipos").addEventListener("click", () => {
  const raw = document.getElementById("txtPegarEquipos").value.trim();
  if (!raw) return;

  const nuevasFilas = [];
  raw.split(/\r?\n/).forEach((linea, idx) => {
    const clean = linea.trim();
    if (!clean) return;
    // Soporta tabulaciones (Excel), punto y coma, barra vertical o coma
    const partes = clean.split(/[\t;|]+/).map((p) => p.trim()).filter(Boolean);
    if (partes.length >= 2) {
      const etiqueta = partes[0].toUpperCase();
      const altura = parseFloat(partes[1].replace(",", ".")) || 0;
      let lado = "AUTO";
      if (partes[2]) {
        const l = partes[2].toUpperCase();
        if (l.startsWith("I")) lado = "IZQ";
        else if (l.startsWith("D")) lado = "DER";
      }
      nuevasFilas.push({
        id: Date.now() + idx + Math.random(),
        etiqueta,
        altura,
        lado
      });
    }
  });

  if (nuevasFilas.length > 0) {
    nuevasFilas.sort((a, b) => b.altura - a.altura);
    listaEquipos = nuevasFilas;
    guardarEstadoLocal();
    renderizarTablaEquipos();
    recalcularYRenderizarTodasFotos();
    document.getElementById("panelPegarEquipos").hidden = true;
    document.getElementById("txtPegarEquipos").value = "";
    setAviso("avisoEquipos", "");
  } else {
    setAviso("avisoEquipos", "No se reconocieron filas válidas. Usa el formato: ETIQUETA [Tab o |] ALTURA.", "warning");
  }
});

["equiposAlturaRef", "equiposAgrupar", "equiposFontSize"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener("input", () => {
      guardarEstadoLocal();
      recalcularYRenderizarTodasFotos();
    });
    el.addEventListener("change", () => {
      guardarEstadoLocal();
      recalcularYRenderizarTodasFotos();
    });
  }
});

document.getElementById("btnAutoDistribuirEquipos").addEventListener("click", () => {
  listaEquipos.sort((a, b) => (parseFloat(b.altura) || 0) - (parseFloat(a.altura) || 0));
  renderizarTablaEquipos();
  recalcularYRenderizarTodasFotos();
});

document.getElementById("btnDescargarTodasFotos").addEventListener("click", () => {
  if (fotosPanoramicas.length === 0) {
    setAviso("avisoEquipos", "Primero sube entre 1 y 4 fotos panorámicas para descargarlas.", "warning");
    return;
  }
  fotosPanoramicas.forEach((foto, idx) => {
    renderizarFotoEquipos(foto);
    setTimeout(() => {
      descargarCanvasElement(foto.canvas, `ESQUEMA_EQUIPOS_TORRE_${idx + 1}_${getSitioSlug()}.png`);
    }, idx * 220);
  });
});

document.getElementById("btnLimpiarFotosEquipos").addEventListener("click", () => {
  fotosPanoramicas = [];
  construirGaleriaEquipos();
  setAviso("avisoEquipos", "");
});

/* =========================================================
   NAVEGACIÓN, PERSISTENCIA Y EVENTOS GENERALES
   ========================================================= */
function dibujarTabActiva(tabId) {
  if (tabId === "tabSpat") dibujarSpat();
  else if (tabId === "tabPerimetro") dibujarPerimetro();
  else if (tabId === "tabTorre") dibujarTorreElevacion();
  else if (tabId === "tabEquipos") renderizarTodasLasFotosEquipos();
  else dibujarTodo();
}

function dibujarTodo() {
  dibujarSpat();
  dibujarPerimetro();
  dibujarTorreElevacion();
  renderizarTodasLasFotosEquipos();
}

const tabBtns = Array.from(document.querySelectorAll(".tab-btn"));
tabBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-tab");
    if (targetId) activarTab(targetId, btn);
  });

  btn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const nextIdx = (idx + dir + tabBtns.length) % tabBtns.length;
      const nextBtn = tabBtns[nextIdx];
      nextBtn.focus();
      const targetId = nextBtn.getAttribute("data-tab");
      if (targetId) activarTab(targetId, nextBtn);
    }
  });
});

const allInputs = [
  "sitio",
  "spatTipoTorre", "cantidadPozos", "val50", "val60", "val70",
  "perAncho", "perLargo", "perTipoTorre", "coordA", "coordB", "coordC", "coordD",
  "torreTipo", "alturaTorre", "alturaBase", "roldanaSup", "roldanaInf",
  "rol1Sup", "rol1Inf", "rol2Sup", "rol2Inf", "rol3Sup", "rol3Inf",
  "alturaEdificio", "alturaEscaleraGato",
  "equiposAlturaRef", "equiposAgrupar", "equiposFontSize"
];

function guardarEstadoLocal() {
  try {
    const data = { inputs: {}, listaEquipos };
    allInputs.forEach((id) => {
      const el = document.getElementById(id);
      if (el) data.inputs[id] = el.value;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (_) {}
}

function restaurarEstadoLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.inputs) {
      allInputs.forEach((id) => {
        const el = document.getElementById(id);
        if (el && typeof data.inputs[id] === "string") {
          el.value = data.inputs[id];
        }
      });
    }
    if (Array.isArray(data.listaEquipos) && data.listaEquipos.length > 0) {
      listaEquipos = data.listaEquipos;
    }
  } catch (_) {}
}

allInputs.forEach((id) => {
  const el = document.getElementById(id);
  if (el) {
    const onChangeHandler = () => {
      guardarEstadoLocal();
      if (id === "sitio") {
        dibujarTodo();
      } else {
        const activeBtn = document.querySelector(".tab-btn.active");
        const activeTabId = activeBtn ? activeBtn.getAttribute("data-tab") : null;
        dibujarTabActiva(activeTabId);
      }
    };
    el.addEventListener("input", onChangeHandler);
    el.addEventListener("change", onChangeHandler);
  }
});

const btnResetTodo = document.getElementById("btnResetTodo");
if (btnResetTodo) {
  btnResetTodo.addEventListener("click", () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    location.reload();
  });
}

document.getElementById("btnActualizarSpat").addEventListener("click", dibujarSpat);
document.getElementById("btnDescargarSpat").addEventListener("click", () => {
  dibujarSpat();
  descargarCanvas("canvasSpat", "ESQUEMA_SPAT");
});

document.getElementById("btnActualizarPer").addEventListener("click", dibujarPerimetro);
document.getElementById("btnDescargarPer").addEventListener("click", () => {
  dibujarPerimetro();
  descargarCanvas("canvasPerimetro", "ESQUEMA_1_PERIMETRO");
});

document.getElementById("btnActualizarTorre").addEventListener("click", dibujarTorreElevacion);
document.getElementById("btnDescargarTorre").addEventListener("click", () => {
  const modelo = document.getElementById("torreTipo").value.toUpperCase();
  dibujarTorreElevacion();
  descargarCanvas("canvasTorre", `ESQUEMA_2_TORRE_${modelo}`);
});

const canvasTorreEl = document.getElementById("canvasTorre");
if (canvasTorreEl && new URLSearchParams(window.location.search).get("calibrar") === "1") {
  canvasTorreEl.addEventListener("click", (e) => {
    const rect = canvasTorreEl.getBoundingClientRect();
    const rx = ((e.clientX - rect.left) / rect.width).toFixed(3);
    const ry = ((e.clientY - rect.top) / rect.height).toFixed(3);
    alert(`Coordenada relativa en canvasTorre:\nxRatio: ${rx}, yRatio: ${ry}`);
  });
}

restaurarEstadoLocal();
renderizarTablaEquipos();
dibujarTodo();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    }).catch(() => {});
  });
}
