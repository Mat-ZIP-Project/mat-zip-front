import axios from "axios"; 
import { store } from "../store";
import { updateAccessToken, logout } from "../store/authSlice";

const serverIp = import.meta.env.VITE_API_SERVER_IP; 
//const authToken = import.meta.env.VITE_AUTH_TOKEN;

const axiosInstance = axios.create({ 
    baseURL: serverIp, 
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 요청 인터셉터 - Redux에서 accessToken 가져와서 헤더에 설정
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 토큰 만료 시 갱신 또는 로그아웃
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // 401 에러이고 아직 재시도하지 않은 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // 서버에 토큰 갱신 요청 (AuthController의 /auth/refresh 엔드포인트)
                const response = await axios.post(`${serverIp}/auth/refresh`, {}, {
                    withCredentials: true // 쿠키 포함
                });
                
                const { accessToken } = response.data;
                
                // Redux 상태 업데이트 (Redux-persist가 자동으로 localStorage 업데이트)
                store.dispatch(updateAccessToken({ accessToken }));
                
                // 원래 요청에 새 토큰으로 재시도
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
                
            } catch (refreshError) {
                // 토큰 갱신 실패 시 로그아웃
                store.dispatch(logout());
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);
export default axiosInstance;