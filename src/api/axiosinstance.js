import axios from "axios";

const serverIp = import.meta.env.VITE_API_SERVER_IP;

const axiosInstance = axios.create({
  baseURL: serverIp,
  timeout: 5000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers?.skipAuth) {
      const token = localStorage.getItem("Authorization");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    if (config.headers?.skipAuth) {
      delete config.headers.skipAuth;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
