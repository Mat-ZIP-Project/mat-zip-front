import axios from "axios";
import { store } from "../store";
import { logout, updateAccessToken } from "../store/authSlice";

const serverIp = import.meta.env.VITE_API_SERVER_IP;

const axiosInstance = axios.create({
  baseURL: serverIp,
  timeout: 30000,
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  withCredentials: true, // RefreshToken 쿠키 전송용
  // paramsSerializer 추가
  paramsSerializer: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });
    return searchParams.toString();
  },
});

// 요청 인터셉터 - AccessToken 헤더 설정
axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Authorization 헤더 설정됨:", config.headers.Authorization);
  }
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// 응답 인터셉터 - 401에러 시 자동 토큰 갱신
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    // 401 & 아직 _retry 플래그 없으면 실행
    if (response?.status === 401 && !originalRequest._retry) {
      // 재시도 중단용 플래그
      originalRequest._retry = true;

      // 인증이 필요한 요청(Authorization 헤더가 있는 경우)만 토큰 갱신 시도
      if (originalRequest.headers && originalRequest.headers.Authorization) {
        // 만약 이 요청이 refresh 호출이라면, 바로 로그아웃
        if (originalRequest.url?.includes("/auth/refresh")) {
          store.dispatch(logout({ forceComplete: true }));
          return Promise.reject(error);
        }

        try {
          // 토큰 갱신 요청 (HttpOnly 쿠키의 RefreshToken 자동 전송)
          const response = await axios.post(
            `${serverIp}/auth/refresh`,
            {},
            {
              withCredentials: true,
              timeout: 5000,
            }
          );

          const { accessToken } = response.data;
          if (!accessToken) {
            throw new Error("새로운 액세스 토큰을 받지 못했습니다.");
          }

          // 새 AccessToken을 Redux에 저장
          store.dispatch(updateAccessToken({ accessToken }));

          // 원본 요청에 새 토큰 설정 후 재시도
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          console.log(
            "📦 Retrying original request with new token:",
            originalRequest
          );

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // 갱신 실패 시 로그아웃
          store.dispatch(logout({ forceComplete: true }));
          return Promise.reject(refreshError);
        }
      }
    }
    // 그 외 모든 경우 에러 반환
    return Promise.reject(error);
  }
);

export default axiosInstance;
