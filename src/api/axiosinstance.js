import axios from "axios"; 

const serverIp = import.meta.env.VITE_API_SERVER_IP; 

const axiosInstance = axios.create({ 
    baseURL: serverIp, 
    timeout: 5000, 
    }); 
export default axiosInstance;