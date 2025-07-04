import axios from "axios";

const serverIp = import.meta.env.VITE_API_SERVER_IP;
const authToken = import.meta.env.VITE_AUTH_TOKEN;
console.log(serverIp);

const axiosInstance = axios.create({
  baseURL: `${serverIp}/api`,
  timeout: 5000,
  headers: {
    Authorization: authToken ? `Bearer ${authToken}` : undefined,
  },
});

export default axiosInstance;
