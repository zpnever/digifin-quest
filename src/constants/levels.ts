export const LEVELS = [
  { lvl: 1, name: "Pemula", min: 0 },
  { lvl: 2, name: "Penjelajah", min: 200 },
  { lvl: 3, name: "Inovator", min: 500 },
  { lvl: 4, name: "Ahli", min: 1000 },
  { lvl: 5, name: "Master Fintech", min: 1800 },
];

export const levelFor = (points: number) =>
  [...LEVELS].reverse().find((l) => points >= l.min) || LEVELS[0];

export const nextLevel = (points: number) =>
  LEVELS.find((l) => l.min > points);
