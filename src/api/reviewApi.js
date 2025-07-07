import axios from "axios";

// [1] 토큰 추출 함수 (파일 내 선언)
const getAccessToken = () => {
  try {
    const persistAuth = localStorage.getItem("persist:auth");
    if (!persistAuth) return null;
    const parsed = JSON.parse(persistAuth);
    let accessToken = parsed.accessToken;
    if (typeof accessToken === "string") {
      try {
        accessToken = JSON.parse(accessToken);
      } catch {}
      accessToken = accessToken.replace(/"/g, "");
    }
    return accessToken;
  } catch {
    return null;
  }
};

// [2] 리뷰 전용 Axios 인스턴스
const reviewAxios = axios.create({
  baseURL: "http://localhost:8080", // 필요한 경우 환경변수 처리
});

// [3] 요청마다 Authorization 자동 세팅
reviewAxios.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// [4] 이하 리뷰 API 함수들

// 예약자 리뷰 목록 조회
export const fetchReservationReviews = async (search = "") => {
  const res = await reviewAxios.get("/api/reservation-reviews", {
    params: { search },
  });
  return Array.isArray(res.data) ? res.data : res.data?.reviews || [];
};

// 예약자 리뷰 등록
export const createReservationReview = async ({
  restaurantId,
  content,
  rating,
}) => {
  const res = await reviewAxios.post("/api/reviews", {
    restaurantId,
    content,
    rating,
  });
  return res.data;
};

// OCR 리뷰 목록 조회
export const fetchOcrReviews = async (search = "") => {
  const res = await reviewAxios.get("/api/ocr-reviews", {
    params: { search },
  });
  return Array.isArray(res.data) ? res.data : res.data?.reviews || [];
};

// OCR 리뷰 등록 (FormData)
export const createOcrReview = async ({
  restaurantName,
  receiptImage,
  content,
  rating,
}) => {
  const formData = new FormData();
  formData.append("restaurantName", restaurantName);
  formData.append("receiptImage", receiptImage);
  formData.append("content", content);
  formData.append("rating", rating);

  const res = await reviewAxios.post("/api/ocr-reviews", formData);
  return res.data;
};

// 리뷰 좋아요 처리
export const toggleLike = async (reviewId) => {
  const res = await reviewAxios.post(`/api/reviews/${reviewId}/like`, {});
  return res.data;
};

// 리뷰 신고 처리
export const reportReview = async (reviewId) => {
  const res = await reviewAxios.post(`/api/reviews/${reviewId}/report`, {});
  return res.data;
};
