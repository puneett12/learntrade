import axiosClient from "./axiosClient";

export const fetchModules = () => axiosClient.get("/modules");
export const fetchModuleById = (id) => axiosClient.get(`/modules/${id}`);
export const fetchLessonsByModule = (id) =>
  axiosClient.get(`/modules/${id}/lessons`);
export const createModule = (payload) => axiosClient.post("/modules", payload);
export const updateModule = (id, payload) =>
  axiosClient.patch(`/modules/${id}`, payload);
export const deleteModule = (id) => axiosClient.delete(`/modules/${id}`);
