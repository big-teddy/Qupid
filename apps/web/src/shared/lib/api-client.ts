import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 인증 오류 처리
      localStorage.removeItem("authToken");
      if (!window.location.pathname.includes("/onboarding") && !window.location.pathname.includes("/auth")) {
        window.location.href = "/onboarding";
      }
    }
    return Promise.reject(error);
  },
);

// Generic helper methods
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T, AxiosResponse<T>>(url, config).then(res => res.data),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T, AxiosResponse<T>>(url, data, config).then(res => res.data),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T, AxiosResponse<T>>(url, data, config).then(res => res.data),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T, AxiosResponse<T>>(url, data, config).then(res => res.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T, AxiosResponse<T>>(url, config).then(res => res.data),
};

export default apiClient;
