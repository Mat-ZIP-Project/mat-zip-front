import axiosInstance from './axiosinstance';

/** 식당주인 관련 API */
export const ownerApi = {
  // 식당 정보 조회
  getRestaurantInfo: async () => axiosInstance.get('/owner/restaurant'),
  // 식당 정보 수정
  updateRestaurantInfo: async (data) => axiosInstance.put('/owner/restaurant', data),
  // 식당 이미지 목록 조회
  getRestaurantImages: async () => axiosInstance.get('/owner/restaurant/images'),
  // 이미지 업로드
  uploadRestaurantImage: async (formData) => axiosInstance.post('/owner/restaurant/images', formData, {
                                            headers: {'Content-Type': 'multipart/form-data'}
  }),
  // 이미지 삭제
  deleteRestaurantImage: async (imageId) => axiosInstance.delete(`/owner/restaurant/images/${imageId}`),
  // 대표 이미지 지정
  setMainImage: async (imageId) => axiosInstance.put(`/owner/restaurant/images/main/${imageId}`),
  // 메뉴 목록 조회
  getMenus: async () => axiosInstance.get('/owner/menu'),
  // 메뉴 등록
  createMenu: async (formData) => axiosInstance.post('/owner/menu', formData),
  // 메뉴 수정
  updateMenu: async (menuId, formData) => axiosInstance.put(`/owner/menu/${menuId}`, formData),
    //   { headers: { 'Content-Type': 'multipart/form-data' } }
    // ),
  // 메뉴 삭제
  deleteMenu: async (menuId) => axiosInstance.delete(`/owner/menu/${menuId}`),
  // 최대 웨이팅 인원수 수정 (식당정보/웨이팅관리 둘 다에서 사용)
  updateMaxWaitingLimit: async (limit) => axiosInstance.patch('/owner/restaurant/waiting-limit', { maxWaitingLimit: limit }),
  /** 대시보드 읿별 통계 */
  getDailyStats: ({ restaurantId, from, to }) => axiosInstance.get(
      `/owner/statistics/${restaurantId}/reservations/daily`,
      { params: { from, to } }
    ),
  /** 대시보드 월별 통계 */
  getMonthlyStats: ({ restaurantId, from, to }) => axiosInstance.get(
      `/owner/statistics/${restaurantId}/reservations/monthly`,
      { params: { from, to } }
    ),
  /** 리뷰 통계 */
  getReviewSummary: ({ restaurantId, from, to }) => axiosInstance.get(
      `/owner/statistics/${restaurantId}/reviews/summary`,
      { params: { from, to } }
    ),

};
