import axios from "axios"; 

const serverIp = import.meta.env.VITE_API_SERVER_IP; 
//const authToken = import.meta.env.VITE_AUTH_TOKEN;

const axiosInstance = axios.create({ 
    baseURL: serverIp, 
    timeout: 5000, 
    /*headers: {
    Authorization: authToken
  },*/
    }); 
export default axiosInstance;