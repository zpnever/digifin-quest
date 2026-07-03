import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";

export interface Progress {
  completedLessons: Record<string, boolean>;
  quizScores: Record<string, { correct: number; total: number; pct: number }>;
  points: number;
  badges: string[];
  streak: number;
  lastLoginDay: string | null;
  todayLessons: number;
  claimedChallenges: string[];
  joined: string;
  scenarioResults: Record<string, { choiceIndex: number; quality: number }>;
  simResult: { balance: number; saving: number; avgQuality: number; pct: number; passed: boolean } | null;
}

const DEFAULT_PROGRESS: Progress = {
  completedLessons: {}, quizScores: {}, points: 0, badges: [],
  streak: 1, lastLoginDay: null, todayLessons: 0,
  claimedChallenges: [], joined: new Date().toDateString(),
  scenarioResults: {}, simResult: null,
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await api.get("/progress");
      setProgress(res.data.progress);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const completeLesson = async (moduleId: string) => {
    try {
      await api.post(`/progress/lessons/${moduleId}`);
      await fetchProgress();
    } catch (err) {
      console.error("Failed to complete lesson:", err);
    }
  };

  const submitQuiz = async (moduleId: string, correct: number, total: number) => {
    try {
      await api.post(`/progress/quizzes/${moduleId}`, { correct, total });
      await fetchProgress();
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    }
  };

  const claimChallenge = async (challengeId: string) => {
    try {
      await api.post(`/progress/challenges/${challengeId}`);
      await fetchProgress();
    } catch (err) {
      console.error("Failed to claim challenge:", err);
    }
  };

  const recordScenario = async (scenarioId: string, choiceIndex: number, quality: number) => {
    try {
      await api.post(`/progress/scenarios/${scenarioId}`, { choiceIndex, quality });
      await fetchProgress();
    } catch (err) {
      console.error("Failed to record scenario:", err);
    }
  };

  const finishSimulation = async (result: { balance: number; saving: number; avgQuality: number; pct: number; passed: boolean }) => {
    try {
      await api.post("/progress/simulation", result);
      await fetchProgress();
    } catch (err) {
      console.error("Failed to save simulation:", err);
    }
  };

  return {
    progress, loading, fetchProgress,
    completeLesson, submitQuiz, claimChallenge, recordScenario, finishSimulation,
  };
}
