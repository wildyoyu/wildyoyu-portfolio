export type AstroEvent = {
  date: string;   // YYYY-MM-DD (UTC o tu zona)
  title: string;
  type?: 'luna' | 'lluvia' | 'planeta' | 'eclipse' | 'otro';
};

export const astroEvents: AstroEvent[] = [
  // 🔧 Edita/añade aquí tus eventos
  { date: '2025-09-18', title: 'Luna llena', type: 'luna' },
  { date: '2025-09-22', title: 'Equinoccio de septiembre', type: 'otro' },
  { date: '2025-10-08', title: 'Lluvia Dracónidas (máximo)', type: 'lluvia' },
  { date: '2025-10-17', title: 'Luna nueva', type: 'luna' },
];
