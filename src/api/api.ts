import axios from "axios";
import { useAuthStore } from "../store/UseAuthStore"; // Assuming you're using Zustand for user auth

const api = axios.create({
  baseURL: "http://localhost:8000/api", // Ganti sesuai base URL backend
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Ambil token dari store atau localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Menambahkan header Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
