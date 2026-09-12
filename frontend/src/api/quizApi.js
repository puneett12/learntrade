import axiosClient from "./axiosClient";

export const fetchQuizByLesson = (lessonId) =>
  axiosClient.get(`/quizzes/lesson/${lessonId}`);

export const submitQuizAttempt = (quizId, answers) =>
  axiosClient.post(`/attempts/${quizId}`, { answers });

export const saveQuiz = (payload) => axiosClient.post("/quizzes", payload);
