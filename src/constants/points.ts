export const POINTS = {
  lessonComplete: 30,
  quizPassPerCorrect: 15,
  dailyLogin: 20,
  challenge: 40,
};

export const DAILY_CHALLENGES = [
  { id: "c1", text: "Selesaikan satu pelajaran hari ini", check: (s: { todayLessons: number }) => s.todayLessons >= 1 },
  { id: "c2", text: "Raih skor di atas 80% pada kuis mana pun", check: (s: { bestQuizPct: number }) => s.bestQuizPct >= 80 },
  { id: "c3", text: "Login 5 hari berturut-turut", check: (s: { streak: number }) => s.streak >= 5 },
];

export const SIM_START_BALANCE = 3000000;
