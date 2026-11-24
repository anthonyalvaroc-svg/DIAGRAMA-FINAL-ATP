const FONT_SIZE_RELLENO = 16;
const STORAGE_KEY = "esquemas_tecnicos_estado_v3";

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
   MOTOR DE APRENDIZAJE DE SITIOS Y PLANTILLAS DE FLECHAS
   (CAPACIDAD PARA 200+ SITIOS EN LOCALSTORAGE + EXPORT JSON)
   ========================================================= */
const KNOWLEDGE_DB_KEY = "esquemas_tecnicos_cerebro_sitios_v1";

function cargarBaseConocimiento() {
  try {
    const raw = localStorage.getItem(KNOWLEDGE_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        sitiosAprendidos: Array.isArray(parsed.sitiosAprendidos) ? parsed.sitiosAprendidos : [],
        plantillasFlechas: Array.isArray(parsed.plantillasFlechas) ? parsed.plantillasFlechas : []
      };
    }
  } catch (_) {}
  return { sitiosAprendidos: [], plantillasFlechas: [] };
}

function guardarBaseConocimiento(db) {
  try {
    // Limitar a los 300 sitios más recientes para mantener velocidad instantánea
    if (db.sitiosAprendidos.length > 300) {
      db.sitiosAprendidos = db.sitiosAprendidos.slice(-300);
    }
    localStorage.setItem(KNOWLEDGE_DB_KEY, JSON.stringify(db));
  } catch (_) {}
  actualizarUIPlantillasAprendidas();
}

function capturarFirmaSitioActual() {
  const sitio = getSitio();
  const modeloTorre = document.getElementById("torreTipo")?.value || "arbol";
  const alturaTorre = parseFloat(document.getElementById("equiposAlturaRef")?.value) || 30;
  const agrupar = document.getElementById("equiposAgrupar")?.value || "si";

  const fotoRef = fotosPanoramicas[0] || null;
  const topY = fotoRef ? fotoRef.topY : (PREAJUSTE_RANGO_TORRE[modeloTorre]?.topY ?? 0.14);
  const bottomY = fotoRef ? fotoRef.bottomY : (PREAJUSTE_RANGO_TORRE[modeloTorre]?.bottomY ?? 0.86);

  // Guardar geometría aprendida de cada flecha/callout posicionada por el usuario
  const flechasAprendidas = fotoRef && Array.isArray(fotoRef.callouts)
    ? fotoRef.callouts.map((c, idx) => ({
        idx,
        texto: c.texto,
        prefijo: (c.texto.match(/^([A-ZÁÉÍÓÚÑ]+)/i)?.[1] || "EQ").toUpperCase(),
        altura: c.altura,
        alturaRelativa: alturaTorre > 0 ? Number((c.altura / alturaTorre).toFixed(4)) : 0.8,
        lado: c.lado,
        targetX: Number(c.targetX.toFixed(4)),
        targetY: Number(c.targetY.toFixed(4)),
        labelX: Number(c.labelX.toFixed(4)),
        labelY: Number(c.labelY.toFixed(4))
      }))
    : [];

  return {
    sitio,
    fecha: new Date().toISOString(),
    modeloTorre,
    alturaTorre,
    agrupar,
    topY: Number(topY.toFixed(4)),
    bottomY: Number(bottomY.toFixed(4)),
    cantidadEquipos: listaEquipos.length,
    equiposBase: listaEquipos.map((e) => ({
      etiqueta: e.etiqueta,
      altura: parseFloat(e.altura) || 0,
      alturaRelativa: alturaTorre > 0 ? Number(((parseFloat(e.altura) || 0) / alturaTorre).toFixed(4)) : 0.8,
      lado: e.lado || "AUTO"
    })),
    flechasAprendidas
  };
}

function aprenderSitioActual(silencioso = false) {
  const firma = capturarFirmaSitioActual();
  if (firma.flechasAprendidas.length === 0 && firma.equiposBase.length === 0) {
    if (!silencioso) {
      setAviso("avisoEquipos", "Primero sube una foto y acomoda las flechas o equipos para que el sistema pueda aprenderlos.", "warning");
    }
    return;
  }

  const db = cargarBaseConocimiento();
  // Si ya existía este mismo código de sitio, actualizar su registro
  const idxExistente = db.sitiosAprendidos.findIndex((s) => s.sitio === firma.sitio);
  if (idxExistente >= 0) {
    db.sitiosAprendidos[idxExistente] = firma;
  } else {
    db.sitiosAprendidos.push(firma);
  }
  guardarBaseConocimiento(db);

  if (!silencioso) {
    setAviso(
      "avisoEquipos",
      `Sitio "${firma.sitio}" aprendido (${firma.flechasAprendidas.length} flechas y calibración guardadas). Total aprendidos: ${db.sitiosAprendidos.length} sitio(s).`,
      "warning"
    );
  }
}

function guardarPlantillaFlechasPersonalizada() {
  const inp = document.getElementById("inpNombrePlantillaFlechas");
  const nombre = (inp?.value || "").trim();
  if (!nombre) {
    setAviso("avisoEquipos", "Escribe un nombre para la plantilla (ej. 'Torre Árbol 30m 3 Sectores').", "warning");
    return;
  }

  const firma = capturarFirmaSitioActual();
  const db = cargarBaseConocimiento();
  const nuevaPlantilla = {
    id: "tpl_" + Date.now(),
    nombre,
    ...firma
  };

  const existente = db.plantillasFlechas.findIndex((p) => p.nombre.toLowerCase() === nombre.toLowerCase());
  if (existente >= 0) {
    db.plantillasFlechas[existente] = nuevaPlantilla;
  } else {
    db.plantillasFlechas.push(nuevaPlantilla);
  }

  guardarBaseConocimiento(db);
  if (inp) inp.value = "";
  setAviso("avisoEquipos", `Plantilla de flechas "${nombre}" guardada correctamente.`, "warning");
}

function aplicarGeometriaAprendidaAFotos(registro, sobrescribirLista = false) {
  if (!registro) return false;

  const alturaDestino = parseFloat(document.getElementById("equiposAlturaRef")?.value) || registro.alturaTorre || 30;

  // Si el usuario pidió cargar la plantilla completa (ej. torre idéntica desde cero)
  if (sobrescribirLista && Array.isArray(registro.equiposBase) && registro.equiposBase.length > 0) {
    const factorAltura = registro.alturaTorre > 0 ? (alturaDestino / registro.alturaTorre) : 1;
    listaEquipos = registro.equiposBase.map((eq, idx) => ({
      id: Date.now() + idx + Math.random(),
      etiqueta: eq.etiqueta,
      altura: Number(Math.max(0.5, eq.altura * factorAltura).toFixed(2)),
      lado: eq.lado || "AUTO"
    }));
    renderizarTablaEquipos();
    guardarEstadoLocal();
  }

  if (fotosPanoramicas.length === 0) return true;

  fotosPanoramicas.forEach((foto) => {
    if (typeof registro.topY === "number") foto.topY = registro.topY;
    if (typeof registro.bottomY === "number") foto.bottomY = registro.bottomY;

    // Primero generar los callouts base con los equipos actuales del sitio
    calcularCalloutsParaFoto(foto);

    // Luego proyectar las posiciones exactas (targetX, targetY, labelX, labelY) aprendidas de la torre similar
    if (Array.isArray(registro.flechasAprendidas) && registro.flechasAprendidas.length > 0) {
      const usadas = new Set();

      foto.callouts.forEach((c) => {
        const prefC = (c.texto.match(/^([A-ZÁÉÍÓÚÑ]+)/i)?.[1] || "EQ").toUpperCase();
        const relH = alturaDestino > 0 ? (c.altura / alturaDestino) : 0.8;

        // Buscar la flecha aprendida más cercana por texto exacto o por mismo tipo de equipo (RF/RRU/MW) y altura relativa
        let mejorIdx = -1;
        let mejorScore = Infinity;

        registro.flechasAprendidas.forEach((fa, fIdx) => {
          if (usadas.has(fIdx)) return;
          let score = Math.abs((fa.alturaRelativa || 0.8) - relH) * 10;
          if (fa.texto === c.texto) score -= 5;
          else if (fa.prefijo === prefC) score -= 2.5;
          if (c.lado !== "AUTO" && fa.lado === c.lado) score -= 1;

          if (score < mejorScore) {
            mejorScore = score;
            mejorIdx = fIdx;
          }
        });

        if (mejorIdx >= 0) {
          usadas.add(mejorIdx);
          const match = registro.flechasAprendidas[mejorIdx];
          c.targetX = match.targetX;
          c.targetY = match.targetY;
          c.labelX = match.labelX;
          c.labelY = match.labelY;
          c.lado = match.lado;
        }
      });
    }

    renderizarFotoEquipos(foto);
  });

  return true;
}

function buscarMejorSitioAprendido() {
  const db = cargarBaseConocimiento();
  const candidatos = [...db.plantillasFlechas, ...db.sitiosAprendidos];
  if (candidatos.length === 0) return null;

  const modeloActual = document.getElementById("torreTipo")?.value || "arbol";
  const alturaActual = parseFloat(document.getElementById("equiposAlturaRef")?.value) || 30;
  const cantActual = listaEquipos.length;

  let mejor = null;
  let mejorPuntaje = -Infinity;

  candidatos.forEach((cand) => {
    let score = 0;
    if (cand.modeloTorre === modeloActual) score += 50;
    const diffAlt = Math.abs((cand.alturaTorre || 30) - alturaActual);
    score += Math.max(0, 25 - diffAlt * 2);
    const diffCant = Math.abs((cand.cantidadEquipos || 0) - cantActual);
    score += Math.max(0, 25 - diffCant * 2.5);
    if (Array.isArray(cand.flechasAprendidas) && cand.flechasAprendidas.length > 0) score += 15;

    if (score > mejorPuntaje) {
      mejorPuntaje = score;
      mejor = cand;
    }
  });

  return mejor;
}

function ejecutarAutoLlenadoDesdeAprendizaje() {
  const mejor = buscarMejorSitioAprendido();
  if (!mejor) {
    setAviso(
      "avisoEquipos",
      "Aún no hay sitios aprendidos ni plantillas guardadas. Acomoda las flechas en tu primer sitio y presiona 'Aprender Este Sitio' o descárgalo.",
      "warning"
    );
    return;
  }

  aplicarGeometriaAprendidaAFotos(mejor, false);
  const origenNombre = mejor.nombre ? `plantilla "${mejor.nombre}"` : `sitio aprendido "${mejor.sitio}"`;
  setAviso(
    "avisoEquipos",
    `Flechas auto-acomodadas usando la geometría de ${origenNombre} (${mejor.modeloTorre}, ${mejor.alturaTorre} m).`,
    "warning"
  );
}

function actualizarUIPlantillasAprendidas() {
  const db = cargarBaseConocimiento();
  const lbl = document.getElementById("lblResumenAprendizaje");
  if (lbl) {
    lbl.textContent = `Sitios aprendidos: ${db.sitiosAprendidos.length} | Plantillas de flechas guardadas: ${db.plantillasFlechas.length}`;
  }

  const sel = document.getElementById("selPlantillasGuardadas");
  if (!sel) return;
  const prevVal = sel.value;
  sel.innerHTML = `<option value="">-- Selecciona una plantilla guardada (${db.plantillasFlechas.length}) --</option>`;

  db.plantillasFlechas.forEach((tpl) => {
    const opt = document.createElement("option");
    opt.value = tpl.id;
    opt.textContent = `${tpl.nombre} (${tpl.cantidadEquipos} eq • ${tpl.alturaTorre}m)`;
    sel.appendChild(opt);
  });

  if (prevVal) sel.value = prevVal;
}

/* =========================================================
   SINCRONIZACIÓN BIDIRECCIONAL ENTRE LAS 4 PESTAÑAS
   ========================================================= */

const USER_TEMPLATE_KEY = "esquemas_tecnicos_plantilla_usuario_v1";

// Preajuste vertical (topY, bottomY) por tipo de torre para la pestaña 4
const PREAJUSTE_RANGO_TORRE = {
  arbol: { topY: 0.14, bottomY: 0.86 },
  monopolo: { topY: 0.12, bottomY: 0.88 },
  autosoportada_normal: { topY: 0.11, bottomY: 0.89 },
  arriostrada_escalera_gato: { topY: 0.14, bottomY: 0.72 },
  ventada_edificio: { topY: 0.14, bottomY: 0.68 },
  ventada_piso: { topY: 0.12, bottomY: 0.88 },
  autosoportada_encima: { topY: 0.11, bottomY: 0.89 },
  arriostrada_edificio_normal: { topY: 0.14, bottomY: 0.68 }
};

let ultimaAlturaTorreSync = parseFloat(document.getElementById("alturaTorre")?.value) || 30.0;

function obtenerSimboloDesdeModelo(modelo) {
  if (modelo === "arbol" || modelo === "monopolo") return "monopolo";
  if (modelo === "ventada_edificio" || modelo === "ventada_piso") return "ventada";
  if (modelo === "arriostrada_escalera_gato" || modelo === "arriostrada_edificio_normal") return "arriostrada";
  return "auto_cuadrado";
}

function sincronizarModeloTorreGlobal(modelo, origen = "") {
  const globalSel = document.getElementById("globalTipoTorre");
  const torreSel = document.getElementById("torreTipo");
  const spatSel = document.getElementById("spatTipoTorre");
  const perSel = document.getElementById("perTipoTorre");

  if (globalSel && origen !== "globalTipoTorre") globalSel.value = modelo;
  if (torreSel && origen !== "torreTipo") torreSel.value = modelo;

  const simbolo = obtenerSimboloDesdeModelo(modelo);
  if (spatSel) spatSel.value = simbolo;
  if (perSel) perSel.value = simbolo;

  // Aplicar preajuste de rango vertical en las fotos de pestaña 4
  const rango = PREAJUSTE_RANGO_TORRE[modelo] || { topY: 0.14, bottomY: 0.86 };
  fotosPanoramicas.forEach((f) => {
    f.topY = rango.topY;
    f.bottomY = rango.bottomY;
    calcularCalloutsParaFoto(f);
  });
}

function sincronizarSimboloDesdePestana1o2(simbolo, origen) {
  const spatSel = document.getElementById("spatTipoTorre");
  const perSel = document.getElementById("perTipoTorre");
  if (spatSel && origen !== "spatTipoTorre") spatSel.value = simbolo;
  if (perSel && origen !== "perTipoTorre") perSel.value = simbolo;
}

function sincronizarAlturaGlobal(nuevaAltura, origen = "") {
  const val = parseFloat(nuevaAltura);
  if (isNaN(val) || val <= 0) return;
  const formatted = val.toFixed(2);

  const gAlt = document.getElementById("globalAlturaTorre");
  const tAlt = document.getElementById("alturaTorre");
  const eAlt = document.getElementById("equiposAlturaRef");

  if (gAlt && origen !== "globalAlturaTorre") gAlt.value = formatted;
  if (tAlt && origen !== "alturaTorre") tAlt.value = formatted;
  if (eAlt && origen !== "equiposAlturaRef") eAlt.value = formatted;

  ultimaAlturaTorreSync = val;
  recalcularYRenderizarTodasFotos();
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
const PLANTILLAS_EQUIPOS = {
  "3sectores": [
    { etiqueta: "MW 1", altura: 29.5, lado: "IZQ" },
    { etiqueta: "RF 1", altura: 28.5, lado: "IZQ" },
    { etiqueta: "RF 2", altura: 28.5, lado: "DER" },
    { etiqueta: "RF 3", altura: 28.5, lado: "DER" },
    { etiqueta: "RRU 1", altura: 27.8, lado: "IZQ" },
    { etiqueta: "RRU 2", altura: 27.8, lado: "DER" },
    { etiqueta: "RRU 3", altura: 27.8, lado: "DER" },
    { etiqueta: "RF 4", altura: 26.0, lado: "IZQ" },
    { etiqueta: "RF 5", altura: 26.0, lado: "DER" },
    { etiqueta: "RF 6", altura: 26.0, lado: "IZQ" },
    { etiqueta: "RRU 4", altura: 25.3, lado: "IZQ" },
    { etiqueta: "RRU 5", altura: 25.3, lado: "DER" },
    { etiqueta: "RRU 6", altura: 25.3, lado: "IZQ" }
  ],
  "arbol": [
    { etiqueta: "MW 4", altura: 29.2, lado: "IZQ" },
    { etiqueta: "RF 5", altura: 28.8, lado: "DER" },
    { etiqueta: "RRU 3", altura: 28.2, lado: "DER" },
    { etiqueta: "RRU 6", altura: 28.0, lado: "IZQ" },
    { etiqueta: "RRU 7", altura: 27.6, lado: "IZQ" },
    { etiqueta: "RF 10", altura: 27.2, lado: "DER" },
    { etiqueta: "RRU 2", altura: 26.8, lado: "IZQ" },
    { etiqueta: "RRU 8", altura: 26.2, lado: "DER" },
    { etiqueta: "RF 1", altura: 25.5, lado: "IZQ" },
    { etiqueta: "RRU 9", altura: 25.0, lado: "DER" }
  ],
  "autosoportada_full": [
    { etiqueta: "MW 1", altura: 34.0, lado: "IZQ" },
    { etiqueta: "RF 1", altura: 33.0, lado: "IZQ" },
    { etiqueta: "RF 2", altura: 33.0, lado: "DER" },
    { etiqueta: "RF 3", altura: 33.0, lado: "DER" },
    { etiqueta: "RRU 1", altura: 32.2, lado: "IZQ" },
    { etiqueta: "RRU 2", altura: 32.2, lado: "DER" },
    { etiqueta: "RRU 3", altura: 32.2, lado: "DER" },
    { etiqueta: "RF 4", altura: 30.0, lado: "IZQ" },
    { etiqueta: "RF 5", altura: 30.0, lado: "DER" },
    { etiqueta: "RF 6", altura: 30.0, lado: "IZQ" },
    { etiqueta: "RRU 4", altura: 29.2, lado: "IZQ" },
    { etiqueta: "RRU 5", altura: 29.2, lado: "DER" },
    { etiqueta: "RRU 6", altura: 29.2, lado: "IZQ" },
    { etiqueta: "MW 2", altura: 26.5, lado: "DER" },
    { etiqueta: "RF 7", altura: 25.0, lado: "IZQ" },
    { etiqueta: "RF 8", altura: 25.0, lado: "DER" },
    { etiqueta: "RF 9", altura: 25.0, lado: "IZQ" },
    { etiqueta: "RRU 7", altura: 24.2, lado: "IZQ" },
    { etiqueta: "RRU 8", altura: 24.2, lado: "DER" },
    { etiqueta: "RRU 9", altura: 24.2, lado: "IZQ" },
    { etiqueta: "GPS 1", altura: 18.0, lado: "IZQ" }
  ]
};

let listaEquipos = PLANTILLAS_EQUIPOS["arbol"].map((item, idx) => ({
  id: idx + 1,
  ...item
}));

// Cada foto: { id, nombreArchivo, img, canvas, callouts: [...], topY: 0.14, bottomY: 0.86, calibratingStep: 0 }
let fotosPanoramicas = [];
let bloqueoArrastre = false;

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
  const topY = typeof foto.topY === "number" ? foto.topY : 0.14;
  const bottomY = typeof foto.bottomY === "number" ? foto.bottomY : 0.86;
  const spanY = Math.max(0.15, bottomY - topY);

  const izqItems = [];
  const derItems = [];

  grupos.forEach((g, idx) => {
    const lado = g.lado === "IZQ" || g.lado === "DER" ? g.lado : idx % 2 === 0 ? "DER" : "IZQ";
    const ratioH = Math.min(1, Math.max(0, g.altura / alturaMax));
    const rawTargetY = bottomY - ratioH * spanY;
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

  const separarVertical = (arr) => {
    arr.sort((a, b) => a.labelY - b.labelY);
    const minGap = 0.044;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].labelY - arr[i - 1].labelY < minGap) {
        arr[i].labelY = Math.min(0.93, arr[i - 1].labelY + minGap);
      }
    }
    for (let i = arr.length - 2; i >= 0; i--) {
      if (arr[i + 1].labelY - arr[i].labelY < minGap) {
        arr[i].labelY = Math.max(0.07, arr[i + 1].labelY - minGap);
      }
    }
  };

  separarVertical(izqItems);
  separarVertical(derItems);

  foto.callouts = [...izqItems, ...derItems];
}

function alinearEtiquetasEnMargen() {
  fotosPanoramicas.forEach((foto) => {
    const izq = [];
    const der = [];
    foto.callouts.forEach((c) => {
      if (c.labelX <= c.targetX) {
        c.labelX = 0.16;
        izq.push(c);
      } else {
        c.labelX = 0.84;
        der.push(c);
      }
    });

    const espaciar = (arr) => {
      arr.sort((a, b) => a.targetY - b.targetY);
      const minGap = 0.046;
      arr.forEach((item) => (item.labelY = item.targetY));
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].labelY - arr[i - 1].labelY < minGap) {
          arr[i].labelY = Math.min(0.93, arr[i - 1].labelY + minGap);
        }
      }
      for (let i = arr.length - 2; i >= 0; i--) {
        if (arr[i + 1].labelY - arr[i].labelY < minGap) {
          arr[i].labelY = Math.max(0.07, arr[i + 1].labelY - minGap);
        }
      }
    };

    espaciar(izq);
    espaciar(der);
    renderizarFotoEquipos(foto);
  });
}

function dibujarFlechaRoja(ctx, fromX, fromY, toX, toY) {
  const headLen = 13;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
  ctx.lineWidth = 4.6;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.strokeStyle = "#ef1d1d";
  ctx.fillStyle = "#ef1d1d";
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 7), toY - headLen * Math.sin(angle - Math.PI / 7));
  ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 7), toY - headLen * Math.sin(angle + Math.PI / 7));
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(toX, toY, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function dibujarTextoEquipoRojo(ctx, texto, x, y, align, fontSize) {
  ctx.save();
  ctx.font = `bold ${fontSize}px Arial, Helvetica, sans-serif`;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";

  ctx.lineJoin = "round";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.88)";
  ctx.strokeText(texto, x, y);

  ctx.fillStyle = "#ef1d1d";
  ctx.fillText(texto, x, y);
  ctx.restore();
}

function renderizarFotoEquipos(foto, opciones = {}) {
  const canvas = foto.canvas;
  if (!canvas || !foto.img) return;
  const ctx = canvas.getContext("2d");

  const img = foto.img;
  const targetW = 1000;
  const scale = targetW / img.naturalWidth;
  canvas.width = targetW;
  canvas.height = Math.round(img.naturalHeight * scale);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Si está en modo calibración de cima/base, dibujar guías visuales (solo en vista, no al exportar)
  if (!opciones.paraExportar && foto.calibratingStep > 0) {
    ctx.save();
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    const yCima = foto.topY * canvas.height;
    ctx.beginPath();
    ctx.moveTo(0, yCima);
    ctx.lineTo(canvas.width, yCima);
    ctx.stroke();

    if (foto.calibratingStep === 2) {
      const yBase = foto.bottomY * canvas.height;
      ctx.strokeStyle = "#10b981";
      ctx.beginPath();
      ctx.moveTo(0, yBase);
      ctx.lineTo(canvas.width, yBase);
      ctx.stroke();
    }
    ctx.restore();
  }

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

    ctx.save();
    ctx.font = `bold ${fontSize}px Arial, Helvetica, sans-serif`;
    const w = ctx.measureText(c.texto).width;
    ctx.restore();
    c._hitBox = {
      x1: esIzquierda ? lx - w - 14 : lx - 14,
      x2: esIzquierda ? lx + 14 : lx + w + 14,
      y1: ly - fontSize * 0.9,
      y2: ly + fontSize * 0.9,
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
  let dragging = null;

  const getPos = (e, applyTouchOffset = false) => {
    const rect = canvas.getBoundingClientRect();
    const isTouch = Boolean(e.touches && e.touches.length > 0);
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;
    // En táctil, desplazar 42px hacia arriba al arrastrar para que el dedo no tape la punta de la flecha
    const offsetClientY = isTouch && applyTouchOffset ? -42 : 0;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: (((clientY + offsetClientY) - rect.top) / rect.height) * canvas.height
    };
  };

  const onDown = (e) => {
    // 1. Si está activo el asistente de 2 toques "Calibrar Cima / Base"
    if (foto.calibratingStep === 1 || foto.calibratingStep === 2) {
      e.preventDefault();
      const pos = getPos(e, false);
      const ny = Math.min(0.96, Math.max(0.03, pos.y / canvas.height));
      if (foto.calibratingStep === 1) {
        foto.topY = ny;
        foto.calibratingStep = 2;
        if (foto._calibBanner) {
          foto._calibBanner.textContent = "Paso 2 de 2: Ahora toca en la foto donde termina la BASE (o el límite inferior de equipos).";
        }
        renderizarFotoEquipos(foto);
      } else {
        foto.bottomY = Math.max(foto.topY + 0.12, ny);
        foto.calibratingStep = 0;
        if (foto._calibBanner) {
          foto._calibBanner.hidden = true;
        }
        calcularCalloutsParaFoto(foto);
        renderizarFotoEquipos(foto);
      }
      return;
    }

    // 2. Si el usuario bloqueó el arrastre para hacer scroll tranquilo en el celular
    if (bloqueoArrastre) return;

    const pos = getPos(e, false);
    for (let i = foto.callouts.length - 1; i >= 0; i--) {
      const c = foto.callouts[i];
      if (!c._hitBox) continue;
      const distTarget = Math.hypot(pos.x - c._hitBox.tx, pos.y - c._hitBox.ty);
      if (distTarget <= 24) {
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
    const pos = getPos(e, dragging.mode === "target");
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
        Sube de 1 a 4 fotos panorámicas de la torre para generar automáticamente las flechas rojas y etiquetas según la lista de alturas. Luego descarga cada foto por separado con su botón verde.
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
    header.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "foto-card-actions";

    const btnCalib = document.createElement("button");
    btnCalib.type = "button";
    btnCalib.className = "btn-action btn-ghost";
    btnCalib.style.padding = "6px 10px";
    btnCalib.style.fontSize = "12px";
    btnCalib.textContent = "Calibrar Cima/Base";
    btnCalib.title = "Marca en 2 toques dónde empieza y termina la torre en esta foto";

    const btnResetPos = document.createElement("button");
    btnResetPos.type = "button";
    btnResetPos.className = "btn-action btn-ghost";
    btnResetPos.style.padding = "6px 10px";
    btnResetPos.style.fontSize = "12px";
    btnResetPos.textContent = "Auto-alinear";
    btnResetPos.addEventListener("click", () => {
      foto.topY = 0.14;
      foto.bottomY = 0.86;
      foto.calibratingStep = 0;
      if (foto._calibBanner) foto._calibBanner.hidden = true;
      calcularCalloutsParaFoto(foto);
      renderizarFotoEquipos(foto);
    });

    const btnDown = document.createElement("button");
    btnDown.type = "button";
    btnDown.className = "btn-action btn-primary";
    btnDown.style.padding = "6px 12px";
    btnDown.style.fontSize = "12px";
    btnDown.textContent = `Descargar PNG ${index + 1}`;
    btnDown.addEventListener("click", () => {
      renderizarFotoEquipos(foto, { paraExportar: true });
      descargarCanvasElement(foto.canvas, `ESQUEMA_EQUIPOS_TORRE_${index + 1}_${getSitioSlug()}.png`);
      renderizarFotoEquipos(foto);
    });

    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "btn-danger-sm";
    btnDel.textContent = "Quitar";
    btnDel.addEventListener("click", () => {
      fotosPanoramicas = fotosPanoramicas.filter((f) => f.id !== foto.id);
      construirGaleriaEquipos();
    });

    actions.appendChild(btnCalib);
    actions.appendChild(btnResetPos);
    actions.appendChild(btnDown);
    actions.appendChild(btnDel);

    const calibBanner = document.createElement("div");
    calibBanner.className = "calibracion-banner";
    calibBanner.hidden = true;
    foto._calibBanner = calibBanner;

    btnCalib.addEventListener("click", () => {
      foto.calibratingStep = 1;
      calibBanner.textContent = "Paso 1 de 2: Toca en la foto la CIMA (punta superior) de la torre.";
      calibBanner.hidden = false;
      renderizarFotoEquipos(foto);
    });

    const canvas = document.createElement("canvas");
    if (bloqueoArrastre) canvas.classList.add("scroll-unlocked");
    foto.canvas = canvas;

    card.appendChild(header);
    card.appendChild(actions);
    card.appendChild(calibBanner);
    card.appendChild(canvas);
    galeria.appendChild(card);

    if (!foto.callouts || foto.callouts.length === 0) {
      calcularCalloutsParaFoto(foto);
    }
    renderizarFotoEquipos(foto);
    habilitarArrastreEnCanvas(foto);
  });
}

/* =========================================================
   LECTURA AUTOMÁTICA DE TIMESTAMP CAMERA (OCR LIGERO)
   ========================================================= */
async function extraerMetadatosTimestampCamera(img) {
  const ocrBar = document.getElementById("ocrStatusBar");
  if (!ocrBar) return;

  if (typeof window.Tesseract === "undefined") {
    return;
  }

  try {
    ocrBar.hidden = false;
    ocrBar.textContent = "Analizando sello GPS y nombre de sitio en la foto panorámica...";

    // Recortar el 28% inferior derecho donde Timestamp Camera estampa fecha, GPS y sitio
    const cropCanvas = document.createElement("canvas");
    const cw = Math.round(img.naturalWidth * 0.58);
    const ch = Math.round(img.naturalHeight * 0.28);
    cropCanvas.width = cw;
    cropCanvas.height = ch;
    const cctx = cropCanvas.getContext("2d");
    cctx.drawImage(
      img,
      img.naturalWidth - cw,
      img.naturalHeight - ch,
      cw,
      ch,
      0,
      0,
      cw,
      ch
    );

    const result = await window.Tesseract.recognize(cropCanvas, "spa+eng");
    const text = (result && result.data && result.data.text) ? result.data.text : "";
    const lineas = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length >= 3);

    if (!lineas.length) {
      ocrBar.hidden = true;
      return;
    }

    // Buscar coordenadas en grados o decimal (ej: 5°6'15"S 81°6'55"W o -5.1041, -81.1152)
    let coordDetectada = "";
    const regexDMS = /(\d{1,2}[°º]\s*\d{1,2}['’]\s*\d{1,2}(?:[.,]\d+)?["”]?\s*[NSns]\s*\d{1,3}[°º]\s*\d{1,2}['’]\s*\d{1,2}(?:[.,]\d+)?["”]?\s*[WOEwoe])/;
    const regexDec = /(-?\d{1,2}\.\d{4,})\s*[,;\s]+\s*(-?\d{1,3}\.\d{4,})/;

    for (const l of lineas) {
      const mDec = l.match(regexDec);
      if (mDec) {
        coordDetectada = `${mDec[1]}, ${mDec[2]}`;
        break;
      }
      const mDms = l.match(regexDMS);
      if (mDms) {
        // Convertir DMS a decimal limpio
        const nums = mDms[1].match(/\d+(?:[.,]\d+)?/g);
        const dirs = mDms[1].match(/[NSWOEnswoe]/g);
        if (nums && nums.length >= 6 && dirs && dirs.length >= 2) {
          const lat = (parseFloat(nums[0]) + parseFloat(nums[1]) / 60 + parseFloat(nums[2].replace(",", ".")) / 3600) * (dirs[0].toUpperCase() === "S" ? -1 : 1);
          const lon = (parseFloat(nums[3]) + parseFloat(nums[4]) / 60 + parseFloat(nums[5].replace(",", ".")) / 3600) * (dirs[1].toUpperCase() === "W" || dirs[1].toUpperCase() === "O" ? -1 : 1);
          coordDetectada = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
          break;
        }
      }
    }

    // La última línea limpia en mayúsculas suele ser el nombre del sitio (ej. CARR PAITA, NEW MARIATEGUI)
    const candidatasSitio = lineas.filter(
      (l) =>
        !/\d{2}[:/]\d{2}/.test(l) &&
        !/[°º'"]/.test(l) &&
        !/^(piura|lima|tumbes|peru|perú|sullana|paita)$/i.test(l)
    );
    const sitioDetectado = candidatasSitio.length
      ? candidatasSitio[candidatasSitio.length - 1].replace(/[^A-Za-z0-9ÁÉÍÓÚÑ _-]/g, "").trim().toUpperCase()
      : "";

    if (!sitioDetectado && !coordDetectada) {
      ocrBar.hidden = true;
      return;
    }

    ocrBar.innerHTML = "";
    const msgSpan = document.createElement("span");
    const partesMsg = [];
    if (sitioDetectado) partesMsg.push(`Sitio detectado: <strong>${sitioDetectado}</strong>`);
    if (coordDetectada) partesMsg.push(`GPS: <strong>${coordDetectada}</strong>`);
    msgSpan.innerHTML = `Sello leído de la foto — ${partesMsg.join(" | ")}`;

    const btnAplicar = document.createElement("button");
    btnAplicar.type = "button";
    btnAplicar.className = "btn-action btn-primary";
    btnAplicar.style.padding = "6px 12px";
    btnAplicar.style.fontSize = "12px";
    btnAplicar.textContent = "Aplicar a Sitio y Perímetro";
    btnAplicar.addEventListener("click", () => {
      if (sitioDetectado) {
        document.getElementById("sitio").value = sitioDetectado;
      }
      if (coordDetectada) {
        ["coordA", "coordB", "coordC", "coordD"].forEach((cid) => {
          const el = document.getElementById(cid);
          if (el) el.value = coordDetectada;
        });
      }
      guardarEstadoLocal();
      dibujarTodo();
      ocrBar.textContent = "Datos aplicados correctamente al encabezado del sitio y al Esquema 1 (Perímetro).";
    });

    ocrBar.appendChild(msgSpan);
    ocrBar.appendChild(btnAplicar);
  } catch (_) {
    ocrBar.hidden = true;
  }
}

/* =========================================================
   RENDERIZADO DE FILAS COMPACTAS DE EQUIPOS (SIN RECORTES EN MÓVIL)
   ========================================================= */
function renderizarTablaEquipos() {
  const container = document.getElementById("listaEquiposContainer");
  if (!container) return;
  container.innerHTML = "";

  listaEquipos.forEach((eq) => {
    const row = document.createElement("div");
    row.className = "equipo-row";

    const inpNombre = document.createElement("input");
    inpNombre.type = "text";
    inpNombre.className = "col-codigo";
    inpNombre.value = eq.etiqueta;
    inpNombre.placeholder = "Ej. RF 1, RRU 2";
    inpNombre.setAttribute("aria-label", "Código de equipo");
    inpNombre.addEventListener("input", () => {
      eq.etiqueta = inpNombre.value;
      guardarEstadoLocal();
      recalcularYRenderizarTodasFotos();
    });

    const inpAltura = document.createElement("input");
    inpAltura.type = "number";
    inpAltura.className = "col-altura";
    inpAltura.step = "0.01";
    inpAltura.min = "0";
    inpAltura.value = eq.altura;
    inpAltura.placeholder = "Altura (m)";
    inpAltura.setAttribute("aria-label", "Altura en metros");
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
    inpAltura.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        document.getElementById("btnAgregarEquipo")?.click();
      }
    });

    // Botón toggle de 1 toque: AUTO -> IZQ -> DER -> AUTO
    const btnLado = document.createElement("button");
    btnLado.type = "button";
    btnLado.className = "btn-lado-toggle col-lado";
    const actualizarVisualLado = () => {
      const l = eq.lado || "AUTO";
      btnLado.classList.remove("lado-izq", "lado-der");
      if (l === "IZQ") {
        btnLado.textContent = "◀ Izquierda";
        btnLado.classList.add("lado-izq");
      } else if (l === "DER") {
        btnLado.textContent = "Derecha ▶";
        btnLado.classList.add("lado-der");
      } else {
        btnLado.textContent = "⇄ Auto";
      }
    };
    actualizarVisualLado();

    btnLado.addEventListener("click", () => {
      const orden = ["AUTO", "IZQ", "DER"];
      const next = orden[(orden.indexOf(eq.lado || "AUTO") + 1) % orden.length];
      eq.lado = next;
      actualizarVisualLado();
      guardarEstadoLocal();
      recalcularYRenderizarTodasFotos();
    });

    const btnQuitar = document.createElement("button");
    btnQuitar.type = "button";
    btnQuitar.className = "btn-danger-sm col-del";
    btnQuitar.textContent = "Quitar";
    btnQuitar.addEventListener("click", () => {
      listaEquipos = listaEquipos.filter((item) => item.id !== eq.id);
      guardarEstadoLocal();
      renderizarTablaEquipos();
      recalcularYRenderizarTodasFotos();
    });

    row.appendChild(inpNombre);
    row.appendChild(inpAltura);
    row.appendChild(btnLado);
    row.appendChild(btnQuitar);
    container.appendChild(row);
  });
}

function recalcularYRenderizarTodasFotos() {
  fotosPanoramicas.forEach((foto) => {
    calcularCalloutsParaFoto(foto);
    renderizarFotoEquipos(foto);
  });
}


/* =========================================================
   IMPORTACIÓN DE LISTA DE EQUIPOS DESDE IMAGEN (JPG / PNG)
   ========================================================= */
function preprocesarImagenTablaParaOcr(img) {
  // Escalar a buen ancho (1600px) y aplicar alto contraste/escala de grises para leer tablas o capturas
  const maxW = 1600;
  const scale = img.naturalWidth > 0 ? Math.min(2.2, Math.max(1, maxW / img.naturalWidth)) : 1;
  const w = Math.max(400, Math.round(img.naturalWidth * scale));
  const h = Math.max(300, Math.round(img.naturalHeight * scale));

  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  ctx.filter = "grayscale(100%) contrast(155%) brightness(105%)";
  ctx.drawImage(img, 0, 0, w, h);
  ctx.filter = "none";
  return c;
}

function parsearTextoOcrListaEquipos(textoCrudo) {
  const filas = [];
  const lineas = (textoCrudo || "").split(/\r?\n/);

  lineas.forEach((rawLine, idx) => {
    // Limpiar ruido típico de OCR en bordes
    const clean = rawLine
      .replace(/[|]/g, " ")
      .replace(/[“”"]/g, '"')
      .trim();
    if (clean.length < 3) return;

    // Buscar código de equipo (RF 1, RRU2, MW-4, GPS 10, ANT 3, etc.)
    const codeMatch = clean.match(/\b(RF|RRU|MW|GPS|ANT|BBU|ODU)\s*[-_.]?\s*(\d{1,3}[A-Za-z]?)\b/i);

    // Buscar altura decimal o entera plausible (ej. 28.50, 28,5, 25.0 m, 18.20)
    // Evitar confundir números pegados al código si hay otro número decimal/altura después
    let textoSinCodigo = codeMatch
      ? clean.replace(codeMatch[0], " ")
      : clean;

    const numMatches = [...textoSinCodigo.matchAll(/\b(\d{1,2}(?:[.,]\d{1,2})?)\s*(?:M|MTS|METROS)?\b/gi)];
    let altura = NaN;
    for (const m of numMatches) {
      const val = parseFloat(m[1].replace(",", "."));
      if (!isNaN(val) && val >= 0.5 && val <= 150) {
        altura = val;
        break;
      }
    }

    // Detectar lado si aparece explícito
    let lado = "AUTO";
    if (/\b(IZQ|IZQUIERDA|LEFT)\b/i.test(clean)) lado = "IZQ";
    else if (/\b(DER|DERECHA|RIGHT)\b/i.test(clean)) lado = "DER";

    if (codeMatch && !isNaN(altura) && altura > 0) {
      const etiqueta = `${codeMatch[1].toUpperCase()} ${codeMatch[2].toUpperCase()}`;
      filas.push({
        id: Date.now() + idx + Math.random(),
        etiqueta,
        altura,
        lado
      });
    }
  });

  return filas;
}

async function importarListaDesdeImagen(file) {
  const container = document.getElementById("listaEquiposContainer");
  let statusEl = document.getElementById("importImgStatus");
  if (!statusEl && container && container.parentElement) {
    statusEl = document.createElement("div");
    statusEl.id = "importImgStatus";
    statusEl.className = "import-img-status";
    container.parentElement.insertBefore(statusEl, container);
  }

  if (typeof window.Tesseract === "undefined") {
    setAviso(
      "avisoEquipos",
      "El lector OCR de imágenes (Tesseract) no está disponible sin conexión. Usa Excel/CSV o 'Pegar Lista / Portal'.",
      "warning"
    );
    return;
  }

  try {
    setAviso("avisoEquipos", "");
    if (statusEl) {
      statusEl.hidden = false;
      statusEl.textContent = `Leyendo lista desde imagen "${file.name}" (OCR)...`;
    }

    const dataUrl = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = reject;
      r.readAsDataURL(file);
    });

    const img = await new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = reject;
      im.src = dataUrl;
    });

    const procCanvas = preprocesarImagenTablaParaOcr(img);
    const res = await window.Tesseract.recognize(procCanvas, "spa+eng");
    const texto = res && res.data && res.data.text ? res.data.text : "";
    const detectados = parsearTextoOcrListaEquipos(texto);

    if (detectados.length > 0) {
      detectados.sort((a, b) => b.altura - a.altura);
      listaEquipos = detectados;
      guardarEstadoLocal();
      renderizarTablaEquipos();
      recalcularYRenderizarTodasFotos();
      if (statusEl) {
        statusEl.textContent = `Se importaron ${detectados.length} equipo(s) desde "${file.name}". Revisa alturas y lados si es necesario.`;
      }
    } else {
      if (statusEl) statusEl.hidden = true;
      setAviso(
        "avisoEquipos",
        `No se detectaron filas claras de equipos y alturas en "${file.name}". Prueba con una captura más nítida o pega la lista manualmente.`,
        "warning"
      );
    }
  } catch (_) {
    if (statusEl) statusEl.hidden = true;
    setAviso("avisoEquipos", "No se pudo procesar la imagen de lista. Intenta con otro JPG/PNG o usa Excel/CSV.", "error");
  }
}

/* =========================================================
   IMPORTACIÓN INTELIGENTE DESDE EXCEL / CSV / PORTAL ATP
   ========================================================= */
function parsearLineasInventario(textoMultilinea) {
  const nuevasFilas = [];
  const lineas = textoMultilinea.split(/\r?\n/);

  lineas.forEach((linea, idx) => {
    const clean = linea.trim();
    if (!clean) return;

    // Caso 1: Formato directo "ETIQUETA | ALTURA | LADO"
    const partes = clean.split(/[\t;|]+/).map((p) => p.trim()).filter(Boolean);
    if (partes.length >= 2) {
      // Buscar si alguna columna tiene código tipo RF/RRU/MW/GPS y otra tiene altura numérica
      let etiqueta = "";
      let altura = NaN;
      let lado = "AUTO";

      partes.forEach((p) => {
        const up = p.toUpperCase();
        if (!etiqueta && /^(RF|RRU|MW|GPS|ANT|BBU|ODU)\s*[-_]?\s*\d+/i.test(up)) {
          etiqueta = up.replace(/\s+/g, " ");
        } else if (isNaN(altura) && /^\d{1,2}(?:[.,]\d{1,2})?\s*M?$/i.test(up)) {
          const val = parseFloat(up.replace("M", "").replace(",", "."));
          if (val > 0 && val <= 150) altura = val;
        } else if (up === "IZQ" || up === "IZQUIERDA" || up === "I") {
          lado = "IZQ";
        } else if (up === "DER" || up === "DERECHA" || up === "D") {
          lado = "DER";
        }
      });

      // Fallback si las 2 primeras columnas eran texto libre y número
      if (!etiqueta && partes[0] && !/^\d+([.,]\d+)?$/.test(partes[0])) {
        etiqueta = partes[0].toUpperCase();
      }
      if (isNaN(altura) && partes[1]) {
        const val = parseFloat(partes[1].replace(",", "."));
        if (!isNaN(val) && val > 0 && val <= 150) altura = val;
      }

      if (etiqueta && !isNaN(altura) && altura > 0) {
        nuevasFilas.push({
          id: Date.now() + idx + Math.random(),
          etiqueta,
          altura,
          lado
        });
      }
    }
  });

  return nuevasFilas;
}

document.getElementById("inputExcelEquipos").addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const lower = file.name.toLowerCase();
  const mime = (file.type || "").toLowerCase();
  if (
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    mime.startsWith("image/")
  ) {
    importarListaDesdeImagen(file);
    e.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      let textoTabla = "";
      if (file.name.toLowerCase().endsWith(".csv") || file.name.toLowerCase().endsWith(".txt")) {
        textoTabla = ev.target.result;
      } else if (typeof window.XLSX !== "undefined") {
        const workbook = window.XLSX.read(ev.target.result, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        textoTabla = window.XLSX.utils.sheet_to_csv(firstSheet, { FS: "\t" });
      } else {
        setAviso("avisoEquipos", "No se pudo cargar el lector Excel sin conexión. Usa CSV o pega la tabla en 'Pegar Lista / Portal'.", "warning");
        return;
      }

      const importados = parsearLineasInventario(textoTabla);
      if (importados.length > 0) {
        importados.sort((a, b) => b.altura - a.altura);
        listaEquipos = importados;
        guardarEstadoLocal();
        renderizarTablaEquipos();
        recalcularYRenderizarTodasFotos();
        setAviso("avisoEquipos", "");
      } else {
        setAviso("avisoEquipos", "No se encontraron filas con código de equipo y altura en el archivo.", "warning");
      }
    } catch (_) {
      setAviso("avisoEquipos", "Error al leer el archivo. Verifica que sea un Excel (.xlsx) o CSV válido.", "error");
    }
  };

  if (file.name.toLowerCase().endsWith(".csv") || file.name.toLowerCase().endsWith(".txt")) {
    reader.readAsText(file);
  } else {
    reader.readAsArrayBuffer(file);
  }
  e.target.value = "";
});

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

  const eraPrimeraFoto = fotosPanoramicas.length === 0;
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
          callouts: [],
          topY: 0.14,
          bottomY: 0.86,
          calibratingStep: 0
        };
        const mejorPrevio = buscarMejorSitioAprendido();
        if (mejorPrevio && mejorPrevio.modeloTorre === (document.getElementById("torreTipo")?.value || "arbol")) {
          nuevaFoto.topY = mejorPrevio.topY;
          nuevaFoto.bottomY = mejorPrevio.bottomY;
        }
        calcularCalloutsParaFoto(nuevaFoto);
        fotosPanoramicas.push(nuevaFoto);

        if (eraPrimeraFoto && i === 0) {
          extraerMetadatosTimestampCamera(img);
        }

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

document.getElementById("btnPlantillasEquipos").addEventListener("click", () => {
  const panel = document.getElementById("panelPlantillasEquipos");
  panel.hidden = !panel.hidden;
  document.getElementById("panelPegarEquipos").hidden = true;
});

document.getElementById("btnCerrarPlantillas").addEventListener("click", () => {
  document.getElementById("panelPlantillasEquipos").hidden = true;
});

document.querySelectorAll(".btn-tpl").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-tpl");
    const tpl = PLANTILLAS_EQUIPOS[key];
    if (!tpl) return;
    listaEquipos = tpl.map((item, idx) => ({
      id: Date.now() + idx + Math.random(),
      ...item
    }));
    guardarEstadoLocal();
    renderizarTablaEquipos();
    recalcularYRenderizarTodasFotos();
    document.getElementById("panelPlantillasEquipos").hidden = true;
  });
});

document.getElementById("btnPegarListaEquipos").addEventListener("click", () => {
  const panel = document.getElementById("panelPegarEquipos");
  panel.hidden = !panel.hidden;
  document.getElementById("panelPlantillasEquipos").hidden = true;
});

document.getElementById("btnCerrarPegadoEquipos").addEventListener("click", () => {
  document.getElementById("panelPegarEquipos").hidden = true;
});

document.getElementById("btnProcesarPegadoEquipos").addEventListener("click", () => {
  const raw = document.getElementById("txtPegarEquipos").value.trim();
  if (!raw) return;

  const nuevasFilas = parsearLineasInventario(raw);

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


function descargarTodasFotosUnidas() {
  if (!fotosPanoramicas || fotosPanoramicas.length === 0) {
    setAviso("avisoEquipos", "Primero sube al menos 1 foto panorámica para poder descargar la imagen.", "warning");
    return;
  }

  // Renderizar cada foto limpia (sin líneas guía de calibración) antes de unir
  fotosPanoramicas.forEach((foto) => renderizarFotoEquipos(foto, { paraExportar: true }));

  const layout = (document.getElementById("equiposLayoutUnido")?.value) || "horizontal";
  const count = fotosPanoramicas.length;
  const gap = 14;
  const pad = 16;

  // Normalizar altura o ancho según disposición para que queden perfectamente alineadas
  const mergedCanvas = document.createElement("canvas");
  const mctx = mergedCanvas.getContext("2d");

  if (count === 1) {
    const c0 = fotosPanoramicas[0].canvas;
    mergedCanvas.width = c0.width;
    mergedCanvas.height = c0.height;
    mctx.drawImage(c0, 0, 0);
  } else if (layout === "horizontal") {
    // Igualar altura de todas las fotos al promedio/máximo (1000px base) y colocarlas lado a lado
    const targetH = Math.max(...fotosPanoramicas.map((f) => f.canvas.height));
    const items = fotosPanoramicas.map((f) => {
      const ratio = targetH / f.canvas.height;
      return {
        canvas: f.canvas,
        w: Math.round(f.canvas.width * ratio),
        h: targetH
      };
    });
    const totalW = items.reduce((acc, it) => acc + it.w, 0) + gap * (count - 1) + pad * 2;
    const totalH = targetH + pad * 2;
    mergedCanvas.width = totalW;
    mergedCanvas.height = totalH;

    mctx.fillStyle = "#ffffff";
    mctx.fillRect(0, 0, totalW, totalH);

    let curX = pad;
    items.forEach((it) => {
      mctx.drawImage(it.canvas, curX, pad, it.w, it.h);
      curX += it.w + gap;
    });
  } else if (layout === "vertical") {
    const targetW = 1000;
    const items = fotosPanoramicas.map((f) => {
      const ratio = targetW / f.canvas.width;
      return {
        canvas: f.canvas,
        w: targetW,
        h: Math.round(f.canvas.height * ratio)
      };
    });
    const totalW = targetW + pad * 2;
    const totalH = items.reduce((acc, it) => acc + it.h, 0) + gap * (count - 1) + pad * 2;
    mergedCanvas.width = totalW;
    mergedCanvas.height = totalH;

    mctx.fillStyle = "#ffffff";
    mctx.fillRect(0, 0, totalW, totalH);

    let curY = pad;
    items.forEach((it) => {
      mctx.drawImage(it.canvas, pad, curY, it.w, it.h);
      curY += it.h + gap;
    });
  } else {
    // Cuadrícula 2x2 (ideal para 2, 3 o 4 fotos)
    const cols = 2;
    const rows = Math.ceil(count / cols);
    const cellW = 900;
    const cellH = Math.max(
      ...fotosPanoramicas.map((f) => Math.round((f.canvas.height / f.canvas.width) * cellW))
    );

    const totalW = cols * cellW + (cols - 1) * gap + pad * 2;
    const totalH = rows * cellH + (rows - 1) * gap + pad * 2;
    mergedCanvas.width = totalW;
    mergedCanvas.height = totalH;

    mctx.fillStyle = "#ffffff";
    mctx.fillRect(0, 0, totalW, totalH);

    fotosPanoramicas.forEach((f, idx) => {
      const r = Math.floor(idx / cols);
      const c = idx % cols;
      const boxX = pad + c * (cellW + gap);
      const boxY = pad + r * (cellH + gap);

      const scale = Math.min(cellW / f.canvas.width, cellH / f.canvas.height);
      const dw = Math.round(f.canvas.width * scale);
      const dh = Math.round(f.canvas.height * scale);
      const dx = boxX + Math.round((cellW - dw) / 2);
      const dy = boxY + Math.round((cellH - dh) / 2);
      mctx.drawImage(f.canvas, dx, dy, dw, dh);
    });
  }

  // Restaurar vista normal en pantalla
  fotosPanoramicas.forEach((foto) => renderizarFotoEquipos(foto));

  aprenderSitioActual(true);
  descargarCanvasElement(mergedCanvas, `ESQUEMA_EQUIPOS_TORRE_${getSitioSlug()}.png`);
}

document.getElementById("btnDescargarUnidaEquipos").addEventListener("click", descargarTodasFotosUnidas);

document.getElementById("btnAutoDistribuirEquipos").addEventListener("click", () => {
  listaEquipos.sort((a, b) => (parseFloat(b.altura) || 0) - (parseFloat(a.altura) || 0));
  renderizarTablaEquipos();
  recalcularYRenderizarTodasFotos();
});

document.getElementById("btnAlinearMargenes").addEventListener("click", alinearEtiquetasEnMargen);

document.getElementById("btnToggleLockDrag").addEventListener("click", (e) => {
  bloqueoArrastre = !bloqueoArrastre;
  const btn = e.currentTarget;
  btn.setAttribute("aria-pressed", String(bloqueoArrastre));
  btn.textContent = bloqueoArrastre ? "Desbloquear Arrastre en Fotos" : "Bloquear Arrastre en Fotos";

  fotosPanoramicas.forEach((f) => {
    if (f.canvas) {
      f.canvas.classList.toggle("scroll-unlocked", bloqueoArrastre);
    }
  });
});

document.getElementById("btnLimpiarFotosEquipos").addEventListener("click", () => {
  fotosPanoramicas = [];
  construirGaleriaEquipos();
  setAviso("avisoEquipos", "");
  const ocrBar = document.getElementById("ocrStatusBar");
  if (ocrBar) ocrBar.hidden = true;
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
  "sitio", "globalTipoTorre", "globalAlturaTorre",
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
      if (id === "torreTipo" || id === "globalTipoTorre") {
        sincronizarModeloTorreGlobal(el.value, id);
      } else if (id === "spatTipoTorre" || id === "perTipoTorre") {
        sincronizarSimboloDesdePestana1o2(el.value, id);
      } else if (id === "alturaTorre" || id === "globalAlturaTorre" || id === "equiposAlturaRef") {
        sincronizarAlturaGlobal(el.value, id);
      }

      guardarEstadoLocal();
      dibujarTodo();
    };
    el.addEventListener("input", onChangeHandler);
    el.addEventListener("change", onChangeHandler);
  }
});

// Enlazado automático de fecha/GPS desde Timestamp Camera hacia SPAT/Perímetro/Sitio

// Panel Ajuste Masivo de Alturas (+/- m) y Plantilla de Usuario
const btnAjusteMasivo = document.getElementById("btnAjusteMasivoAlturas");
if (btnAjusteMasivo) {
  btnAjusteMasivo.addEventListener("click", () => {
    const p = document.getElementById("panelAjusteAlturas");
    p.hidden = !p.hidden;
    document.getElementById("panelPlantillasEquipos").hidden = true;
    document.getElementById("panelPegarEquipos").hidden = true;
  });
}

document.getElementById("btnCerrarAjusteAlturas")?.addEventListener("click", () => {
  document.getElementById("panelAjusteAlturas").hidden = true;
});

function aplicarDeltaAlturas(signo) {
  const delta = parseFloat(document.getElementById("inpDeltaAltura")?.value) || 0;
  if (delta === 0) return;
  listaEquipos.forEach((eq) => {
    const actual = parseFloat(eq.altura) || 0;
    eq.altura = Number(Math.max(0.5, actual + signo * delta).toFixed(2));
  });
  listaEquipos.sort((a, b) => (parseFloat(b.altura) || 0) - (parseFloat(a.altura) || 0));
  guardarEstadoLocal();
  renderizarTablaEquipos();
  recalcularYRenderizarTodasFotos();
}

document.getElementById("btnSumarDeltaAltura")?.addEventListener("click", () => aplicarDeltaAlturas(1));
document.getElementById("btnRestarDeltaAltura")?.addEventListener("click", () => aplicarDeltaAlturas(-1));

document.getElementById("btnEscalarProporcional")?.addEventListener("click", () => {
  const nuevaMax = parseFloat(document.getElementById("equiposAlturaRef")?.value) || 30;
  const maxActual = listaEquipos.length
    ? Math.max(...listaEquipos.map((e) => parseFloat(e.altura) || 0))
    : 0;
  if (maxActual <= 0 || nuevaMax <= 0) return;
  const factor = nuevaMax / maxActual;
  listaEquipos.forEach((eq) => {
    const h = parseFloat(eq.altura) || 0;
    eq.altura = Number(Math.max(0.5, h * factor).toFixed(2));
  });
  listaEquipos.sort((a, b) => (parseFloat(b.altura) || 0) - (parseFloat(a.altura) || 0));
  guardarEstadoLocal();
  renderizarTablaEquipos();
  recalcularYRenderizarTodasFotos();
});

document.getElementById("btnGuardarPlantillaUsuario")?.addEventListener("click", () => {
  try {
    localStorage.setItem(USER_TEMPLATE_KEY, JSON.stringify(listaEquipos));
    setAviso("avisoEquipos", "Lista actual guardada como tu plantilla personal en este navegador.", "warning");
  } catch (_) {}
});

document.getElementById("btnCargarPlantillaUsuario")?.addEventListener("click", () => {
  try {
    const raw = localStorage.getItem(USER_TEMPLATE_KEY);
    if (!raw) {
      setAviso("avisoEquipos", "Aún no tienes una plantilla guardada. Usa 'Guardar Lista Actual como Mi Plantilla' primero.", "warning");
      return;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      listaEquipos = parsed.map((item, idx) => ({ ...item, id: Date.now() + idx + Math.random() }));
      guardarEstadoLocal();
      renderizarTablaEquipos();
      recalcularYRenderizarTodasFotos();
      setAviso("avisoEquipos", "");
    }
  } catch (_) {}
});

// Nuevo Sitio manteniendo estructura y lista de equipos como base
document.getElementById("btnNuevoSitioConBase")?.addEventListener("click", () => {
  fotosPanoramicas = [];
  construirGaleriaEquipos();
  const ocrBar = document.getElementById("ocrStatusBar");
  if (ocrBar) ocrBar.hidden = true;
  const sitioInput = document.getElementById("sitio");
  if (sitioInput) {
    sitioInput.value = "";
    sitioInput.focus();
  }
  ["coordA", "coordB", "coordC", "coordD"].forEach((cid) => {
    const el = document.getElementById(cid);
    if (el) el.value = "";
  });
  guardarEstadoLocal();
  dibujarTodo();
});

// Descarga por lote de todas las pestañas del F10 en secuencia rápida
document.getElementById("btnDescargarTodoLote")?.addEventListener("click", () => {
  dibujarTodo();
  const modelo = (document.getElementById("torreTipo")?.value || "TORRE").toUpperCase();
  const tareas = [
    () => descargarCanvas("canvasSpat", "1_ESQUEMA_SPAT"),
    () => descargarCanvas("canvasPerimetro", "2_ESQUEMA_PERIMETRO"),
    () => descargarCanvas("canvasTorre", `3_ESQUEMA_TORRE_${modelo}`)
  ];
  if (fotosPanoramicas.length > 0) {
    tareas.push(() => descargarTodasFotosUnidas());
  }
  tareas.forEach((fn, idx) => {
    setTimeout(fn, idx * 380);
  });
});

// Atajo rápido de teclado: Ctrl+Enter descarga el esquema de la pestaña activa
window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    const activeTab = document.querySelector(".tab-btn.active")?.getAttribute("data-tab");
    if (activeTab === "tabSpat") document.getElementById("btnDescargarSpat")?.click();
    else if (activeTab === "tabPerimetro") document.getElementById("btnDescargarPer")?.click();
    else if (activeTab === "tabTorre") document.getElementById("btnDescargarTorre")?.click();
    else if (activeTab === "tabEquipos") document.getElementById("btnDescargarUnidaEquipos")?.click();
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

restaurarEstadoLocal();

document.getElementById("btnAprenderSitioActual")?.addEventListener("click", () => aprenderSitioActual(false));
document.getElementById("btnAplicarAprendizajeAuto")?.addEventListener("click", ejecutarAutoLlenadoDesdeAprendizaje);
document.getElementById("btnAutoAcomodarRapido")?.addEventListener("click", ejecutarAutoLlenadoDesdeAprendizaje);
document.getElementById("btnGuardarPlantillaFlechas")?.addEventListener("click", guardarPlantillaFlechasPersonalizada);

document.getElementById("btnAplicarPlantillaGuardada")?.addEventListener("click", () => {
  const id = document.getElementById("selPlantillasGuardadas")?.value;
  if (!id) {
    setAviso("avisoEquipos", "Selecciona primero una plantilla de la lista.", "warning");
    return;
  }
  const db = cargarBaseConocimiento();
  const tpl = db.plantillasFlechas.find((p) => p.id === id);
  if (!tpl) return;

  if (tpl.modeloTorre) {
    sincronizarModeloTorreGlobal(tpl.modeloTorre, "plantilla");
  }
  if (tpl.alturaTorre) {
    sincronizarAlturaGlobal(tpl.alturaTorre, "plantilla");
  }
  aplicarGeometriaAprendidaAFotos(tpl, true);
  dibujarTodo();
  setAviso("avisoEquipos", `Plantilla "${tpl.nombre}" aplicada (equipos, alturas y posiciones de flechas).`, "warning");
});

document.getElementById("btnEliminarPlantillaGuardada")?.addEventListener("click", () => {
  const id = document.getElementById("selPlantillasGuardadas")?.value;
  if (!id) return;
  const db = cargarBaseConocimiento();
  db.plantillasFlechas = db.plantillasFlechas.filter((p) => p.id !== id);
  guardarBaseConocimiento(db);
});

document.getElementById("btnExportarCerebro")?.addEventListener("click", () => {
  const db = cargarBaseConocimiento();
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `APRENDIZAJE_TORRES_${db.sitiosAprendidos.length}_SITIOS.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("inputImportarCerebro")?.addEventListener("change", (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const incoming = JSON.parse(ev.target.result);
      const db = cargarBaseConocimiento();
      if (Array.isArray(incoming.sitiosAprendidos)) {
        incoming.sitiosAprendidos.forEach((s) => {
          const idx = db.sitiosAprendidos.findIndex((x) => x.sitio === s.sitio);
          if (idx >= 0) db.sitiosAprendidos[idx] = s;
          else db.sitiosAprendidos.push(s);
        });
      }
      if (Array.isArray(incoming.plantillasFlechas)) {
        incoming.plantillasFlechas.forEach((p) => {
          const idx = db.plantillasFlechas.findIndex((x) => x.nombre === p.nombre);
          if (idx >= 0) db.plantillasFlechas[idx] = p;
          else db.plantillasFlechas.push(p);
        });
      }
      guardarBaseConocimiento(db);
      setAviso(
        "avisoEquipos",
        `Base importada: ${db.sitiosAprendidos.length} sitios aprendidos y ${db.plantillasFlechas.length} plantillas disponibles.`,
        "warning"
      );
    } catch (_) {
      setAviso("avisoEquipos", "El archivo JSON de aprendizaje no es válido.", "error");
    }
  };
  reader.readAsText(file);
  e.target.value = "";
});

actualizarUIPlantillasAprendidas();

renderizarTablaEquipos();
dibujarTodo();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    }).catch(() => {});
  });
}
