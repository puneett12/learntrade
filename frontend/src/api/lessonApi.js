import axiosClient from "./axiosClient";

export const fetchLessonById = (id) => axiosClient.get(`/lessons/${id}`);
export const createLesson = (payload) => axiosClient.post("/lessons", payload);
export const updateLesson = (id, payload) =>
  axiosClient.patch(`/lessons/${id}`, payload);
export const deleteLesson = (id) => axiosClient.delete(`/lessons/${id}`);
