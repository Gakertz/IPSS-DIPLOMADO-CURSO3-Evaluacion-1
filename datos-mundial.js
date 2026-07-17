// ─────────────────────────────────────────────────────────────────────────────
// Evaluación 1 · API del Mundial 2026
// Diplomado IPS · Módulo 3 — Backend y APIs REST
//
// ESTOS SON TUS DATOS. Cópialos tal cual en tu proyecto: no tienes que
// inventarlos ni tipearlos. Tu trabajo empieza en las rutas.
//
// Puedes agregar campos si los necesitas, pero no quites los que están aquí.
// ─────────────────────────────────────────────────────────────────────────────

// Un continente agrupa selecciones.
export const continentes = [
  { id: 1, nombre: 'Sudamérica', confederacion: 'CONMEBOL' },
  { id: 2, nombre: 'Europa', confederacion: 'UEFA' },
  { id: 3, nombre: 'África', confederacion: 'CAF' },
  { id: 4, nombre: 'Norteamérica', confederacion: 'CONCACAF' },
  { id: 5, nombre: 'Asia', confederacion: 'AFC' },
]

// Los grupos del torneo.
export const grupos = [
  { id: 1, nombre: 'A' },
  { id: 2, nombre: 'B' },
  { id: 3, nombre: 'C' },
  { id: 4, nombre: 'D' },
]

// Cada selección pertenece a UN grupo y a UN continente (por su id).
// `copas` = los años de los mundiales que ganó.
export const selecciones = [
  // ── Grupo A ────────────────────────────────────────────────────────────────
  { id: 1,  nombre: 'Brasil',    grupoId: 1, continenteId: 1, fifaRanking: 5,  copas: [1958, 1962, 1970, 1994, 2002] },
  { id: 2,  nombre: 'Chile',     grupoId: 1, continenteId: 1, fifaRanking: 45, copas: [] },
  { id: 3,  nombre: 'Marruecos', grupoId: 1, continenteId: 3, fifaRanking: 13, copas: [] },
  { id: 4,  nombre: 'Japón',     grupoId: 1, continenteId: 5, fifaRanking: 18, copas: [] },

  // ── Grupo B ────────────────────────────────────────────────────────────────
  { id: 5,  nombre: 'Argentina', grupoId: 2, continenteId: 1, fifaRanking: 1,  copas: [1978, 1986, 2022] },
  { id: 6,  nombre: 'Alemania',  grupoId: 2, continenteId: 2, fifaRanking: 16, copas: [1954, 1974, 1990, 2014] },
  { id: 7,  nombre: 'Senegal',   grupoId: 2, continenteId: 3, fifaRanking: 20, copas: [] },
  { id: 8,  nombre: 'México',    grupoId: 2, continenteId: 4, fifaRanking: 15, copas: [] },

  // ── Grupo C ────────────────────────────────────────────────────────────────
  { id: 9,  nombre: 'Francia',   grupoId: 3, continenteId: 2, fifaRanking: 2,  copas: [1998, 2018] },
  { id: 10, nombre: 'Uruguay',   grupoId: 3, continenteId: 1, fifaRanking: 11, copas: [1930, 1950] },
  { id: 11, nombre: 'Corea',     grupoId: 3, continenteId: 5, fifaRanking: 23, copas: [] },
  { id: 12, nombre: 'Canadá',    grupoId: 3, continenteId: 4, fifaRanking: 48, copas: [] },

  // ── Grupo D ────────────────────────────────────────────────────────────────
  { id: 13, nombre: 'España',    grupoId: 4, continenteId: 2, fifaRanking: 3,  copas: [2010] },
  { id: 14, nombre: 'Inglaterra',grupoId: 4, continenteId: 2, fifaRanking: 4,  copas: [1966] },
  { id: 15, nombre: 'Ghana',     grupoId: 4, continenteId: 3, fifaRanking: 68, copas: [] },
  { id: 16, nombre: 'Australia', grupoId: 4, continenteId: 5, fifaRanking: 25, copas: [] },
]

// Aquí se guardan los resultados que registres. Empiezan vacíos: los llenan
// tus rutas POST.
export const partidos = {
  semifinales: [],  // { numero: 1..4, local: {...}, visita: {...} }
  final: null,      // { local: {...}, visita: {...} }
}
