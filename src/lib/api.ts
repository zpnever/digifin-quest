const API_BASE = import.meta.env.VITE_API_URL || "/api";

export type ApiSession = {
  token: string;
  user: { id: string; email: string; name: string; role: "student" | "admin" };
  dashboard: DashboardPayload;
};

export type DashboardPayload = {
  progress: any;
  modules: any[];
  badges: any[];
  levels: any[];
  points: Record<string, number>;
  challenges: Array<{ id: string; text: string }>;
  leaderboard: Array<{ name: string; points: number; self?: boolean }>;
};

let authToken = localStorage.getItem("digifin_token") || "";

export function setAuthToken(token: string) {
  authToken = token;
  if (token) localStorage.setItem("digifin_token", token);
  else localStorage.removeItem("digifin_token");
}

export function getAuthToken() {
  return authToken;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("content-type") && init.body) headers.set("content-type", "application/json");
  if (authToken) headers.set("authorization", `Bearer ${authToken}`);

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  register(payload: { email: string; password: string; name: string; role: "student" | "admin" }) {
    return request<ApiSession>("/auth/register", { method: "POST", body: JSON.stringify(payload) });
  },
  login(payload: { email: string; password: string }) {
    return request<ApiSession>("/auth/login", { method: "POST", body: JSON.stringify(payload) });
  },
  me() {
    return request<{ user: ApiSession["user"]; dashboard: DashboardPayload }>("/me");
  },
  completeLesson(moduleId: string) {
    return request<{ progress: any }>(`/progress/lessons/${moduleId}/complete`, { method: "POST" });
  },
  submitQuiz(moduleId: string, answers: Record<string, number>) {
    return request<{
      correct: number;
      total: number;
      pct: number;
      explanations: Array<{ index: number; correctAnswer: number; explanation: string; correct: boolean }>;
      weakTopics: Array<[string, number]>;
      pointsAwarded: number;
      badgesAwarded: string[];
      progress: any;
    }>(`/quizzes/${moduleId}/submit`, { method: "POST", body: JSON.stringify({ answers }) });
  },
  claimChallenge(id: string) {
    return request<{ progress: any }>(`/challenges/${id}/claim`, { method: "POST" });
  },
  answerScenario(id: string, choiceIndex: number) {
    return request<{ choice: any; progress: any }>(`/scenarios/${id}/answer`, {
      method: "POST",
      body: JSON.stringify({ choiceIndex }),
    });
  },
  finishSimulation(answers: number[]) {
    return request<{ result: any; progress: any }>("/simulation/finish", {
      method: "POST",
      body: JSON.stringify({ answers }),
    });
  },
  adminAnalytics() {
    return request<any>("/admin/analytics");
  },
  async downloadAdminCsv() {
    const headers = new Headers();
    if (authToken) headers.set("authorization", `Bearer ${authToken}`);
    const response = await fetch(`${API_BASE}/admin/export.csv`, { headers });
    if (!response.ok) throw new Error("Gagal mengunduh CSV admin");
    return response.blob();
  },
};
