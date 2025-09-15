// src/data/events.ts

// Tipos permitidos (coinciden con las clases CSS: .t-luna, .t-lluvia, etc.)
export const EVENT_TYPES = ['luna', 'lluvia', 'planeta', 'eclipse', 'otro'] as const;
export type EventType = typeof EVENT_TYPES[number];

// Fecha en ISO estricto YYYY-MM-DD para evitar sorpresas de zona horaria
export type AstroEvent = {
  date: `${number}-${number}-${number}`;
  title: string;
  type?: EventType; // opcional, por defecto 'otro'
};

// Lista de eventos (puedes ampliarla sin tocar nada más)
export const astroEvents: AstroEvent[] = [
  { date: '2025-09-18', title: 'Luna llena', type: 'luna' },
  { date: '2025-09-22', title: 'Equinoccio de septiembre', type: 'otro' },
  { date: '2025-10-08', title: 'Lluvia Dracónidas (máximo)', type: 'lluvia' },
  { date: '2025-10-17', title: 'Luna nueva', type: 'luna' },
].sort((a, b) => a.date.localeCompare(b.date)); // siempre ordenados

// Helper opcional: obtener eventos de un mes concreto (1..12)
export function getEventsInMonth(year: number, month: number): AstroEvent[] {
  const mm = String(month).padStart(2, '0');
  const prefix = `${year}-${mm}-`;
  return astroEvents.filter(e => e.date.startsWith(prefix));
}

// Validaciones suaves en desarrollo (avisan por consola si algo está mal)
if (import.meta.env.DEV) {
  for (const ev of astroEvents) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ev.date)) {
      console.warn('[events] Fecha no-ISO (YYYY-MM-DD):', ev);
    }
    if (ev.type && !EVENT_TYPES.includes(ev.type)) {
      console.warn('[events] Tipo desconocido (usa', EVENT_TYPES.join(', '), '):', ev);
    }
  }
}
