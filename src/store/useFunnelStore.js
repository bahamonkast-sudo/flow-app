import { create } from 'zustand';

// ---- Constantes del modelo ----
export const COMISION_POR_TRADER_USD = 35;
export const CONVERSION_TELEGRAM = 0.4; // leads -> telegram
export const CONVERSION_BROKER = 0.15; // telegram -> fondeados

export const PHASE_META = {
  social: { title: 'Redes Sociales', subtitle: 'Tráfico orgánico y pago', color: '#38bdf8' },
  wa: { title: 'WhatsApp Masivo', subtitle: 'Extracción y envíos', color: '#25d366' },
  telegram: { title: 'Bot de Telegram', subtitle: 'Centro de Calificación y Cierre', color: '#0088cc' },
  academy: { title: 'Hub Educativo', subtitle: 'Retención y valor', color: '#a78bfa' },
  signals: { title: 'Señales Binomo', subtitle: 'Canal oficial en vivo', color: '#f59e0b' },
};

// Catálogo de sub-herramientas por fase: { id, name, strategy, description, tool, benefit, reach, conversion }
export const CATALOG = {
  social: [
    { id: 'fb_groups', name: 'Facebook: Publicador masivo en grupos', strategy: 'Inundación en grupos de trading y criptomonedas',
      description: 'Publicación diaria automatizada de contenido de valor y ofertas en grupos de trading, criptomonedas y finanzas.',
      tool: 'Script automatizado de publicación en grupos de Facebook',
      benefit: 'Volumen masivo de exposición gratuita en comunidades ya segmentadas.',
      reach: 5000, conversion: 0.02 },
    { id: 'tiktok_clips', name: 'TikTok: Clips orgánicos con ganchos', strategy: 'Ganchos de análisis de velas',
      description: 'Clips cortos diarios con ganchos de análisis de velas japonesas y resultados de operativa.',
      tool: 'CapCut + calendario de publicación diaria',
      benefit: 'Alcance viral orgánico con audiencia joven interesada en trading.',
      reach: 20000, conversion: 0.03 },
    { id: 'ig_bio', name: 'Instagram: Bio + DM automation', strategy: 'Tráfico a biografía y automatización de DMs',
      description: 'Reels y stories que dirigen al link de la biografía, con respuestas automáticas por DM.',
      tool: 'ManyChat para Instagram + Link en bio',
      benefit: 'Captura automatizada 24/7 de seguidores interesados.',
      reach: 8000, conversion: 0.025 },
    { id: 'yt_shorts', name: 'YouTube Shorts educativos', strategy: 'Contenido educativo de corta duración',
      description: 'Shorts con mini-lecciones de velas y gestión de riesgo que posicionan autoridad.',
      tool: 'YouTube Studio + OBS Studio',
      benefit: 'Tráfico evergreen: los videos siguen captando meses después.',
      reach: 12000, conversion: 0.02 },
  ],
  wa: [
    { id: 'wa_extract', name: 'Extractor de leads', strategy: 'Minería de contactos del nicho',
      description: 'Extracción de miembros de grupos y contactos de WhatsApp del nicho de trading.',
      tool: 'Módulo Extractor de la suite Soluciones WA',
      benefit: 'Base de datos propia y segmentada sin pagar publicidad.',
      reach: 3000, conversion: 0.05 },
    { id: 'wa_mass', name: 'Envío masivo directo', strategy: 'Difusión personalizada 1 a 1',
      description: 'Envíos masivos personalizados con nombre y rotación anti-bloqueo entre líneas.',
      tool: 'Módulo de Envío Masivo + Calentador Soluciones WA',
      benefit: 'Contacto directo con tasa de apertura superior al 90%.',
      reach: 5000, conversion: 0.08 },
    { id: 'wa_groups', name: 'Grupos y canales propios', strategy: 'Comunidad cautiva en WhatsApp',
      description: 'Grupos y canales propios donde se publica valor diario y ofertas.',
      tool: 'WhatsApp Business + grupos propios',
      benefit: 'Audiencia cautiva con costo cero por impacto.',
      reach: 2000, conversion: 0.06 },
  ],
  telegram: [
    { id: 'tg_magnet', name: 'Lead Magnet Delivery', strategy: 'Entrega automática de valor',
      description: 'Entrega inmediata del PDF de patrones de velas o mini-taller al hacer /start.',
      tool: 'Flujo de bienvenida automatizado sin intervención humana',
      benefit: 'Tasa de retención inicial y activación inmediata del prospecto.',
      reach: 0, conversion: 0 },
    { id: 'tg_filtro', name: 'Filtro y Diagnóstico Interactivo', strategy: 'Cuestionario con botones en línea',
      description: 'Cuestionario interactivo con Inline Keyboards que evalúa nivel de experiencia, capital y broker actual.',
      tool: 'Árbol de decisión por comandos',
      benefit: 'Segmenta al prospecto curioso del trader con intención real de fondear.',
      reach: 0, conversion: 0 },
    { id: 'tg_verify', name: 'Verificación de Registro y Fondeo', strategy: 'Gate obligatorio hacia la Academia',
      description: 'Solicita el ID de cuenta creada bajo el enlace de afiliado y la captura o confirmación del depósito mínimo en Binomo.',
      tool: 'Webhook / integración de validación (o cola de revisión para soporte)',
      benefit: 'Condición obligatoria para dar paso al siguiente nodo (Academia).',
      reach: 0, conversion: 0 },
    { id: 'tg_creds', name: 'Generador y Despachador de Credenciales', strategy: 'Onboarding sin fricción',
      description: 'Una vez validado el fondeo, el bot genera y envía el usuario/contraseña de acceso al sitio web de la Academia.',
      tool: 'API Auth Dispatcher hacia la base de datos de la plataforma educativa',
      benefit: 'Cero fricción en el onboarding y acceso instantáneo al Hub Educativo.',
      reach: 0, conversion: 0 },
  ],
  signals: [
    { id: 'sig_live', name: 'Señales en vivo de Binomo', strategy: 'Sesiones en alta volatilidad',
      description: 'Transmisión de señales CALL/PUT en vivo con análisis de contexto antes de cada entrada.',
      tool: 'Canal de Telegram + bot despachador de señales',
      benefit: 'El trader opera acompañado: sube la confianza y la tasa de acierto percibida.',
      reach: 0, conversion: 0 },
    { id: 'sig_premarket', name: 'Análisis pre-mercado', strategy: 'Mapa diario del mercado',
      description: 'Resumen diario de pares, horarios y zonas clave antes de la apertura.',
      tool: 'Reporte automatizado + canal de difusión',
      benefit: 'Disciplina operativa: el trader llega con plan en vez de improvisar.',
      reach: 0, conversion: 0 },
    { id: 'sig_sureshots', name: 'Alertas Sure Shots', strategy: 'Patrones de alta probabilidad',
      description: 'Alertas cuando se forman patrones Sure Shots en zonas SNR clave.',
      tool: 'Laboratorio de Velas + alertas del bot',
      benefit: 'Conecta la Academia con la operativa real: educa y retiene a la vez.',
      reach: 0, conversion: 0 },
  ],
  academy: [
    { id: 'm_videos', name: 'Video cursos y estrategias', strategy: 'Formación estructurada',
      description: 'Curso completo en video: desde velas japonesas hasta estrategias avanzadas.',
      tool: 'Plataforma de video cursos (133 lecciones)',
      benefit: 'Cada módulo activo suma +10% a la retención del trader.',
      reach: 0, conversion: 0 },
    { id: 'm_velas', name: 'Velas japonesas y patrones', strategy: 'Laboratorio interactivo',
      description: 'Biblioteca de 30 patrones de velas con niveles clave y variantes CALL/PUT.',
      tool: 'Laboratorio de Velas + Entrenador de patrones',
      benefit: 'Práctica diaria que mantiene al trader activo en la plataforma.',
      reach: 0, conversion: 0 },
    { id: 'm_ia', name: 'Asistente IA técnico', strategy: 'Mentor disponible 24/7',
      description: 'Asistente IA que resuelve dudas técnicas, fractales y operativas.',
      tool: 'Mentor IA integrado 24/7',
      benefit: 'Reduce la frustración y la quema de cuentas por errores básicos.',
      reach: 0, conversion: 0 },
    { id: 'm_riesgo', name: 'Gestión de riesgo', strategy: 'Protección matemática del capital',
      description: 'Calculadora de interés compuesto, stop loss diario y estadísticas.',
      tool: 'Plataforma de gestión de riesgo',
      benefit: 'Principal freno a la quema de cuentas: alarga la vida del trader.',
      reach: 0, conversion: 0 },
    { id: 'm_beta', name: 'Plataforma Beta Binomo', strategy: 'Práctica guiada en vivo',
      description: 'Entorno beta interactivo para practicar operativa de Binomo.',
      tool: 'Plataforma Beta (acceso anticipado)',
      benefit: 'Diferencial exclusivo que eleva la percepción de valor.',
      reach: 0, conversion: 0 },
  ],
};

function buildInitialPhases() {
  return {
    social: { enabled: true, items: ['fb_groups', 'tiktok_clips', 'ig_bio', 'yt_shorts'].map((id) => ({ ...CATALOG.social.find((t) => t.id === id) })) },
    wa: { enabled: true, items: ['wa_extract', 'wa_mass'].map((id) => ({ ...CATALOG.wa.find((t) => t.id === id) })) },
    telegram: { enabled: true, items: ['tg_magnet', 'tg_filtro', 'tg_verify', 'tg_creds'].map((id) => ({ ...CATALOG.telegram.find((t) => t.id === id) })) },
    signals: { enabled: true, items: ['sig_live', 'sig_premarket', 'sig_sureshots'].map((id) => ({ ...CATALOG.signals.find((t) => t.id === id) })) },
    academy: { enabled: true, items: ['m_videos', 'm_velas', 'm_ia', 'm_riesgo'].map((id) => ({ ...CATALOG.academy.find((t) => t.id === id) })) },
  };
}
const initialPhases = buildInitialPhases();

export const useFunnelStore = create((set) => ({
  phases: initialPhases,
  inspection: null, // { type: 'phase'|'item', phaseId, itemId? }
  catalogOpen: false,

  togglePhase: (phaseId) =>
    set((s) => ({ phases: { ...s.phases, [phaseId]: { ...s.phases[phaseId], enabled: !s.phases[phaseId].enabled } } })),
  setPhaseEnabled: (phaseId, enabled) =>
    set((s) => ({ phases: { ...s.phases, [phaseId]: { ...s.phases[phaseId], enabled } } })),
  addToolToPhase: (phaseId, tool) =>
    set((s) => {
      const items = s.phases[phaseId].items;
      if (items.some((i) => i.id === tool.id)) return s;
      return { phases: { ...s.phases, [phaseId]: { ...s.phases[phaseId], enabled: true, items: [...items, { ...tool }] } } };
    }),
  removeToolFromPhase: (phaseId, toolId) =>
    set((s) => ({
      phases: { ...s.phases, [phaseId]: { ...s.phases[phaseId], items: s.phases[phaseId].items.filter((i) => i.id !== toolId) } },
    })),
  setItemReach: (phaseId, toolId, reach) =>
    set((s) => ({
      phases: {
        ...s.phases,
        [phaseId]: { ...s.phases[phaseId], items: s.phases[phaseId].items.map((i) => (i.id === toolId ? { ...i, reach } : i)) },
      },
    })),
  selectForInspection: (inspection) => set({ inspection }),
  resetIdealFlow: () => set({ phases: buildInitialPhases(), inspection: null }),
  setCatalogOpen: (open) => set({ catalogOpen: open }),
}));

// ---- Nivel de capacidad por alcance (indicador de eficiencia, no conteo) ----
export const capacityOf = (reach) =>
  reach >= 15000 ? 'Alto Volumen' : reach >= 5000 ? 'Medio Volumen' : 'Volumen Base';

// ---- Diagnóstico de salud del ecosistema (memoizado) ----
const VULNERABILITIES = {
  social: 'Sin captación orgánica: se pierde descubrimiento, autoridad y tráfico evergreen.',
  wa: 'Sin WhatsApp masivo: se pierde el canal de mayor apertura. La captación directa queda sin contacto 1 a 1.',
  telegram: '⚠️ Sin Bot de Telegram, no hay mecanismo automatizado para filtrar leads ni validar cuentas en el broker. La tasa de conversión hacia la Academia cae un 85%',
  academy: 'Sin Hub Educativo: no hay retención. El trader fondea, opera sin método y quema la cuenta.',
  signals: 'Sin Canal de Señales Oficial: el trader opera sin guía en vivo ni confirmación. Caen la confianza, la retención y el valor percibido.',
};

function computeHealth(phases) {
  const ids = ['social', 'wa', 'telegram', 'signals', 'academy'];
  let score = 0;
  const alerts = [];
  ids.forEach((id) => {
    const p = phases[id];
    if (p?.enabled && p.items.length > 0) {
      score += 20;
    } else if (p?.enabled) {
      score += 8;
      alerts.push({ canal: PHASE_META[id].title, msg: `La caja ${PHASE_META[id].title} está vacía: sin ingredientes no hay aporte. Agrega herramientas desde el catálogo.` });
    } else {
      alerts.push({ canal: id === 'telegram' ? '' : PHASE_META[id].title, msg: VULNERABILITIES[id] });
    }
  });
  const optimal = score === 100;
  return {
    score,
    optimal,
    status: optimal ? '100% ÓPTIMO' : 'DEFICIENTE',
    alerts,
  };
}

let healthCache = { key: null, value: null };
export function selectHealth(state) {
  const key = JSON.stringify(state.phases);
  if (healthCache.key !== key) {
    healthCache = { key, value: computeHealth(state.phases) };
  }
  return healthCache.value;
}
export const fmt = (n) => Math.round(n).toLocaleString('es-CO');
export const fmtUSD = (n) => `USD ${Math.round(n).toLocaleString('es-CO')}`;

// ---- Conexiones maestras y reconexión automática ----
export const MASTER_CONNECTIONS = [
  { source: 'node-social', target: 'node-telegram' },
  { source: 'node-wa', target: 'node-telegram' },
  { source: 'node-telegram', target: 'node-signals' },
  { source: 'node-signals', target: 'node-academy' },
  { source: 'node-academy', target: 'node-diagnostic' },
];

function buildEdge(conn, i) {
  return { id: `e-master-${i}`, source: conn.source, target: conn.target, sourceHandle: 'out', targetHandle: 'in' };
}

// Recalcula los edges válidos según los nodos existentes (IDs estáticos → re-anclaje exacto)
export function syncEdges(nodeIds) {
  const set = new Set(nodeIds);
  return MASTER_CONNECTIONS.filter((c) => set.has(c.source) && set.has(c.target)).map(buildEdge);
}
