import axios from "axios";

const serverIp = import.meta.env.VITE_API_SERVER_IP;
const authToken = import.meta.env.VITE_AUTH_TOKEN;
const adminToken = import.meta.env.VITE_ADMIN_TOKEN;
console.log(serverIp);

const axiosInstance = axios.create({
  baseURL: `${serverIp}`,
  timeout: 5000,
  headers: {
    Authorization: authToken ? `Bearer ${authToken}` : undefined,
  },
});

const adminAxiosInstance = axios.create({
  baseURL: `${serverIp}`, // 필요하다면 여기에 '/api' 등을 추가하세요.
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    // 사장님(관리자) 토큰을 Authorization 헤더에 설정
    Authorization: adminToken ? `Bearer ${adminToken}` : undefined,
  },
});

export { axiosInstance, adminAxiosInstance };
