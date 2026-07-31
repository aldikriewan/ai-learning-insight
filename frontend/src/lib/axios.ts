import axios from "axios";
import { getCookie } from "cookies-next";

// Ganti URL ini sesuai port backend Hapi Anda
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Setiap request otomatis dipasang Token JWT jika ada
api.interceptors.request.use(
  (config) => {
    // Ambil token dari cookie
    const token = getCookie("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor: Handle Error Global (Misal token expired -> 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Opsional: Redirect ke login jika session habis
      // window.location.href = "/login";
      console.error("Session Expired or Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default api;
