import axios from "axios"; 
import { store } from "../store";
import { logout, updateAccessToken } from "../store/authSlice";

const serverIp = import.meta.env.VITE_API_SERVER_IP; 

const axiosInstance = axios.create({ 
    baseURL: serverIp, 
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
    withCredentials: true 
});

// SPA 방식 로그인 페이지 이동 이벤트 핸들러
const navigateToLogin = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
        window.history.pushState(null, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
    }
};

// 요청 인터셉터 - Redux에서 accessToken 가져와서 헤더에 설정
axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.accessToken;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Authorization 헤더 설정됨:', config.headers.Authorization);
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
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // refresh 요청 실패한 경우 바로 로그아웃 (무한루프 방지)
            if (originalRequest.url?.includes('/auth/refresh')) {
                console.error('Refresh token이 만료되었습니다.');
                store.dispatch(logout({ forceComplete: true }));
                navigateToLogin();
                return Promise.reject(error);
            }

            try {
                // 이미 로그아웃 상태면 갱신 시도 X
                const state = store.getState();
                if (!state.auth.isAuthenticated) {
                    navigateToLogin();
                    return Promise.reject(error);
                }

                // 서버에 토큰 갱신 요청 (AuthController의 /auth/refresh 엔드포인트)
                const response = await axios.post(`${serverIp}/auth/refresh`, {}, {
                    withCredentials: true,
                    timeout: 5000
                });
                
                const { accessToken } = response.data;
                if (!accessToken) { throw new Error('새로운 액세스 토큰을 받지 못했습니다.');}
                
                store.dispatch(updateAccessToken({ accessToken }));

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
                
            } catch (refreshError) {
                console.error('토큰 갱신 실패:', refreshError);
                store.dispatch(logout({ forceComplete: true }));
                navigateToLogin(); 
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);
export default axiosInstance;