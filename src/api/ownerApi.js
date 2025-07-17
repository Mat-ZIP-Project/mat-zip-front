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

  /////// 메뉴 관리 API ////////////////////////////////////////////////
  // 메뉴 목록 조회
  getMenus: async () => axiosInstance.get('/owner/menu'),
  // 메뉴 등록
  createMenu: async (formData) => axiosInstance.post('/owner/menu', formData),
  // 메뉴 수정
  updateMenu: async (menuId, formData) => axiosInstance.post(`/owner/menu/${menuId}`, formData,  {
                                            headers: {'Content-Type': 'multipart/form-data'}
  }),
  // 메뉴 삭제
  deleteMenu: async (menuId) => axiosInstance.delete(`/owner/menu/${menuId}`),
  
  /////// 대시보드 API ////////////////////////////////////////////////
  /** 대시보드 일별 통계 */
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
  /////// 예약관리 API ////////////////////////////////////////////////
  /** 예약 전체 목록 조회 */
  getAllReservations: async () => axiosInstance.get('/owner/reservations/all'),
  /** 오늘 예약 목록 조회 */
  getTodayReservations: async () => axiosInstance.get('/owner/reservation/today'),
  /** 대기 중인 예약 목록 조회 */
  getPendingReservations: async () =>
    axiosInstance.get('/owner/reservations/pending'),
  /** 노쇼 후보 목록 조회 */
  getNoShowCandidates: async () =>
    axiosInstance.get('/owner/reservations/noshow'),
  /** 예약 승인/거절 */
  updateReservationStatus: async ({ reservationId, reservationStatus, ownerNotes }) =>
    axiosInstance.post('/reservation/owner/approve', { reservationId, reservationStatus, ownerNotes }),
  /** 노쇼 처리 */
  markNoShow: async ({ reservationId }) =>
    axiosInstance.post('/owner/reservations/noshow', { reservationId }),


  /////// 웨이팅 관리 API ////////////////////////////////////////////////
  /** 웨이팅 요약 정보 조회 */
  getWaitingSummary: async (restaurantId) => axiosInstance.get(`/api/waiting/status/${restaurantId}`),
  /** 웨이팅 입장대기 목록 조회 */ 
  getWaitingList: async () => axiosInstance.get('/owner/waiting/list'),
  /** 다음 대기자 호출 */
  callNextWaiting: async (restaurantId) => axiosInstance.put(`/api/waiting/next/${restaurantId}`),
  /** 호출자 명단 */
  getWaitingCallList: async () => axiosInstance.get(`/owner/waiting/call-list`),
  /** 웨이팅 입장 */
  enterWaiting: async (waitingId) => axiosInstance.put(`/api/waiting/enter/${waitingId}`),
  /** 노쇼 처리 */
  markWaitingNoShow: async (waitingId) => axiosInstance.put(`/api/waiting/noshow/${waitingId}`),

  ////////////////////////////////////////////////////////////////////
  /** 리뷰 목록 조회 */
  getRestaurantReviews: async () => axiosInstance.get('/owner/reviews/all'),
};
