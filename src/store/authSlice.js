import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  accessToken: null, // localStorage에 저장
  userInfo: {
    id: null,
    userId: null,
    name: null,
    role: null
  }
};

// 웹스토리지 정리
const clearStorage = (preserveRememberedId = false) => {
  const rememberedUserId = preserveRememberedId ? localStorage.getItem('rememberedUserId') : null;
  
  localStorage.clear();
  sessionStorage.clear();
  
  // 아이디 저장이 필요한 경우 복원
  if (rememberedUserId) {
    localStorage.setItem('rememberedUserId', rememberedUserId);
  }
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 로그인 성공 시 AccessToken 저장
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
    },

    // 토큰 갱신 시 새 AccessToken으로 교체
    updateAccessToken: (state, action) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
    },

    // 로그아웃 (RefreshToken은 서버에서 쿠키 삭제)
    logout: (state, action) => {
      const forceCompleteLogout = action.payload?.forceComplete || false;
      const rememberedUserId = localStorage.getItem('rememberedUserId');
      
      Object.assign(state, initialState);
      clearStorage(!forceCompleteLogout && !!rememberedUserId);
    },

    // 완전 초기화
    resetAuth: (state) => {
      Object.assign(state, initialState);
      clearStorage(false);
    },
  },
});

export const { setCredentials, updateAccessToken, logout, resetAuth } = authSlice.actions;
export default authSlice.reducer;