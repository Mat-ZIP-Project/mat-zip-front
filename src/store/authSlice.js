import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  accessToken: null,
  userInfo: {
    id: null,
    userId: null,
    name: null,
    role: null
  }
};

// 웹스토리지 정리 함수
const clearStorage = (preserveRememberedId = false) => {
  const rememberedUserId = preserveRememberedId ? localStorage.getItem('rememberedUserId') : null;
  
  // 모든 스토리지 정리
  localStorage.clear();
  sessionStorage.clear();
  
  // IndexedDB 정리
  if ('indexedDB' in window) {
    const deleteReq = indexedDB.deleteDatabase('keyval-store');
    deleteReq.onsuccess = () => console.log('IndexedDB cleared');
  }
  
  // 아이디 저장이 필요한 경우 복원
  if (rememberedUserId) {
    localStorage.setItem('rememberedUserId', rememberedUserId);
  }
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload;
      state.isAuthenticated = true;
      state.accessToken = accessToken;
      state.userInfo = {
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role
      };

      // 쿠키 확인용 디버깅
      console.log('=== 로그인 성공 후 쿠키 확인 ===');
      console.log('document.cookie:', document.cookie);
      console.log('refreshToken이 보이지 않으면 HttpOnly가 정상 작동 중');
    },

    // 토큰 갱신
    updateAccessToken: (state, action) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;

      // 토큰 갱신 후 쿠키 확인
      console.log('=== 토큰 갱신 후 쿠키 확인 ===');
      console.log('새로운 accessToken 설정됨');
      console.log('document.cookie:', document.cookie);
    },

    // 로그아웃
    logout: (state, action) => {
      const forceCompleteLogout = action.payload?.forceComplete || false;
      const rememberedUserId = localStorage.getItem('rememberedUserId');
      
console.log('=== 로그아웃 전 쿠키 확인 ===');
      console.log('document.cookie:', document.cookie);

      Object.assign(state, initialState);
      
      // 스토리지 정리
      clearStorage(!forceCompleteLogout && !!rememberedUserId);
    },

    // Redux Persist 액션
    resetAuth: (state) => {
      Object.assign(state, initialState);
      clearStorage(false);
    },
  },
});

export const { setCredentials, updateAccessToken, logout, resetAuth } = authSlice.actions;
export default authSlice.reducer;