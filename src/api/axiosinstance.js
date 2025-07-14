import axios from "axios"; 
import { store } from "../store";
import { logout, updateAccessToken } from "../store/authSlice";

const serverIp = import.meta.env.VITE_API_SERVER_IP;

const axiosInstance = axios.create({ 
    baseURL: serverIp, 
    timeout: 30000,
    // headers: {
    //     'Content-Type': 'application/json',
    // },
    withCredentials: true // RefreshToken 쿠키 전송용
});

// SPA 방식 로그인 페이지 이동
const navigateToLogin = () => {
    const currentPath = window.location.pathname;
    if (currentPath !== '/login') {
        window.history.pushState(null, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
    }
};

// 요청 인터셉터 - AccessToken 헤더 설정
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
    (error) => Promise.reject(error)
);

// 응답 인터셉터 - 401에러 시 자동 토큰 갱신
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러이고 재시도하지 않은 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // refresh 요청 자체가 실패한 경우 로그아웃
            if (originalRequest.url?.includes('/auth/refresh')) {
                store.dispatch(logout({ forceComplete: true }));
                navigateToLogin();
            }

            try {
                // 토큰 갱신 요청 (HttpOnly 쿠키의 RefreshToken 자동 전송)
                const response = await axios.post(`${serverIp}/auth/refresh`, {}, {
                    withCredentials: true,
                    timeout: 5000
                });
                
                const { accessToken } = response.data;
                if (!accessToken) {
                    throw new Error('새로운 액세스 토큰을 받지 못했습니다.');
                }
                
                // 새 AccessToken을 Redux에 저장
                store.dispatch(updateAccessToken({ accessToken }));
                
                // 원본 요청에 새 토큰 설정 후 재시도
                delete originalRequest._retry;
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                console.log('📦 Retrying original request with new token:', originalRequest);


                return axios(originalRequest);
                
            } catch (refreshError) {
                // 갱신 실패 시 로그아웃
                store.dispatch(logout({ forceComplete: true }));
                navigateToLogin();
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance;