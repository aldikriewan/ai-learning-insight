import axios from "axios";
import { getCookie } from "cookies-next";
import { getMockResponse } from "./mockData";

// Ganti URL ini sesuai port backend Hapi Anda
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Cek apakah mode mock aktif (jika NEXT_PUBLIC_USE_MOCK=true atau backend tidak tersedia)
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true" || !API_URL || API_URL === "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Timeout 5 detik - jika backend tidak merespon, fallback ke mock
  timeout: 5000,
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

// Interceptor: Handle Response dengan Mock Fallback
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika error karena network (backend tidak tersedia) dan mode mock aktif
    if ((!error.response || error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") && USE_MOCK) {
      const url = error.config?.url || "";
      const method = error.config?.method || "get";
      const data = error.config?.data ? JSON.parse(error.config.data) : undefined;
      
      const mockResponse = getMockResponse(url, method, data);
      
      if (mockResponse) {
        console.log(`[MOCK] ${method.toUpperCase()} ${url} → using mock data`);
        return Promise.resolve({
          data: mockResponse,
          status: 200,
          statusText: "OK (Mock)",
          headers: {},
          config: error.config,
        });
      }
    }
    
    if (error.response && error.response.status === 401) {
      console.error("Session Expired or Unauthorized");
    }
    return Promise.reject(error);
  }
);

export default api;
