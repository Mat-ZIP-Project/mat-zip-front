import axios from "axios";

const token = () => localStorage.getItem("token");

// 예약자 리뷰 목록
export const fetchReservationReviews = async (search = "") => {
  const res = await axios.get("/api/reservation-reviews", {
    params: { search },
    headers: { Authorization: `Bearer ${token()}` },
  });
  return Array.isArray(res.data) ? res.data : res.data?.reviews || [];
};

// 예약자 리뷰 등록
export const createReservationReview = async ({
  restaurantId,
  content,
  rating,
}) => {
  const res = await axios.post(
    "/api/reservation-reviews",
    { restaurantId, content, rating },
    { headers: { Authorization: `Bearer ${token()}` } }
  );
  return res.data;
};

// OCR 리뷰 목록
export const fetchOcrReviews = async (search = "") => {
  const res = await axios.get("/api/ocr-reviews", {
    params: { search },
    headers: { Authorization: `Bearer ${token()}` },
  });
  return Array.isArray(res.data) ? res.data : res.data?.reviews || [];
};

// OCR 리뷰 등록
export const createOcrReview = async ({
  restaurantName,
  receiptImage,
  content,
  rating,
}) => {
  const formData = new FormData();
  formData.append("restaurantName", restaurantName);
  formData.append("receiptImage", receiptImage); // file input
  formData.append("content", content);
  formData.append("rating", rating);

  const res = await axios.post("/api/ocr-reviews", formData, {
    headers: { Authorization: `Bearer ${token()}` },
  });
  return res.data;
};

// 리뷰 좋아요/신고 (공통)
export const toggleLike = async (reviewId) => {
  const res = await axios.post(
    `/api/reviews/${reviewId}/like`,
    {},
    { headers: { Authorization: `Bearer ${token()}` } }
  );
  return res.data;
};

export const reportReview = async (reviewId) => {
  return axios.post(
    `/api/reviews/${reviewId}/report`,
    {},
    { headers: { Authorization: `Bearer ${token()}` } }
  );
};
