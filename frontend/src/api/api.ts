// Axios client with JWT and baseURL

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("cmh_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
