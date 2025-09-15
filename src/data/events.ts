// src/data/events.ts
// ----------------------------------------------
// Tipos
export const EVENT_TYPES = ['luna', 'lluvia', 'planeta', 'eclipse', 'otro'] as const;
export type EventType = typeof EVENT_TYPES[number];

export type AstroEvent = {
  date: `${number}-${number}-${number}`; // YYYY-MM-DD
  title: string;
  type?: EventType; // 'luna'|'lluvia'|'planeta'|'eclipse'|'otro'
};

// ----------------------------------------------
// Eventos 2025 (fechas sin horas, en ISO)
export const astroEvents: AstroEvent[] = [
  // ——— Lluvias de meteoros ———
  { date: '2025-01-03', title: 'Cuadrántidas (máximo)', type: 'lluvia' },
  { date: '2025-04-22', title: 'Líridas (máximo)', type: 'lluvia' },
  { date: '2025-05-06', title: 'Eta Acuáridas (máximo, antes del alba)', type: 'lluvia' },
  { date: '2025-07-30', title: 'Delta Acuáridas Sur (máximo)', type: 'lluvia' },
  { date: '2025-08-13', title: 'Perseidas (máximo)', type: 'lluvia' },
  { date: '2025-10-08', title: 'Dracónidas (máximo, al anochecer)', type: 'lluvia' },
  { date: '2025-10-22', title: 'Oriónidas (máximo, madrugada)', type: 'lluvia' },
  { date: '2025-11-17', title: 'Leónidas (máximo)', type: 'lluvia' },
  { date: '2025-12-14', title: 'Géminidas (máximo, toda la noche)', type: 'lluvia' },
  { date: '2025-12-22', title: 'Úrsidas (máximo, antes del alba)', type: 'lluvia' },

  // ——— Eclipses visibles desde España ———
  { date: '2025-03-14', title: 'Eclipse total de Luna (visible desde España, madrugada)', type: 'eclipse' },
  { date: '2025-03-29', title: 'Eclipse parcial de Sol (visible desde España)', type: 'eclipse' },
  { date: '2025-09-07', title: 'Eclipse total de Luna (visible desde España)', type: 'eclipse' },

  // ——— Oposiciones / planetas ———
  { date: '2025-09-21', title: 'Saturno en oposición (visible toda la noche)', type: 'planeta' },
  { date: '2025-12-07', title: 'Júpiter en oposición (visible toda la noche)', type: 'planeta' },

  // ——— Estaciones ———
  { date: '2025-09-22', title: 'Equinoccio de septiembre', type: 'otro' },

  // ——— Lunas llenas de 2025 (con superlunas) ———
  { date: '2025-01-13', title: 'Luna llena (Lobo)', type: 'luna' },
  { date: '2025-02-12', title: 'Luna llena (Nieve)', type: 'luna' },
  { date: '2025-03-14', title: 'Luna llena (Gusano)', type: 'luna' },
  { date: '2025-04-13', title: 'Luna llena (Rosa)', type: 'luna' },
  { date: '2025-05-12', title: 'Luna llena (Flores)', type: 'luna' },
  { date: '2025-06-11', title: 'Luna llena (Fresa)', type: 'luna' },
  { date: '2025-07-10', title: 'Luna llena (Ciervo)', type: 'luna' },
  { date: '2025-08-09', title: 'Luna llena (Esturión)', type: 'luna' },
  { date: '2025-09-07', title: 'Luna llena (Cosecha)', type: 'luna' },
  { date: '2025-10-07', title: 'Superluna (Cazador)', type: 'luna' },
  { date: '2025-11-05', title: 'Superluna (Castor)', type: 'luna' },
  { date: '2025-12-04', title: 'Superluna (Fría)', type: 'luna' },
].sort((a, b) => a.date.localeCompare(b.date));

// Helper opcional: eventos de un mes concreto
export function getEventsInMonth(year: number, month: number): AstroEvent[] {
  const mm = String(month).padStart(2, '0');
  return astroEvents.filter(e => e.date.startsWith(`${year}-${mm}-`));
}

// Avisos suaves en desarrollo
if (import.meta.env.DEV) {
  for (const ev of astroEvents) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ev.date)) console.warn('[events] Fecha no-ISO:', ev);
    if (ev.type && !EVENT_TYPES.includes(ev.type)) console.warn('[events] Tipo desconocido:', ev);
  }
}
