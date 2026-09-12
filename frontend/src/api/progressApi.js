import axiosClient from "./axiosClient";

export const fetchProgress = () => axiosClient.get("/progress");

export const updateLessonProgress = (lessonId, status = "completed") =>
  axiosClient.post(`/progress/${lessonId}`, { status });

