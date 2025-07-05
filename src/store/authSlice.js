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

// 웹스토리지 완전 초기화 함수
const clearAllStorage = () => {
  localStorage.clear();
  sessionStorage.clear();
  // IndexedDB 관련 데이터 있다면 정리
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
};

// 선택적 스토리지 정리 유틸리티 함수
const clearStorageExceptRememberedId = (rememberedUserId) => {
  // persist 데이터만 삭제
  localStorage.removeItem('persist:auth');
  sessionStorage.clear();
  // 저장된 아이디 다시 설정
  localStorage.setItem('rememberedUserId', rememberedUserId);
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
    },

    // 토큰 갱신
    updateAccessToken: (state, action) => {
      const { accessToken } = action.payload;
      state.accessToken = accessToken;
    },

    logout: (state, action) => {
      const forceCompleteLogout = action.payload?.forceComplete || false;
      const rememberedUserId = localStorage.getItem('rememberedUserId');
      
      // Redux 상태 초기화
      Object.assign(state, initialState);
      
      // 아이디 저장여부에 따라 스토리지 정리
      if (forceCompleteLogout || !rememberedUserId) {
        clearAllStorage();
      } else {
        clearStorageExceptRememberedId(rememberedUserId);
      }
    },

    // Redux Persist 완전 초기화용 액션
    resetAuth: (state) => {
      Object.assign(state, initialState);
      clearAllStorage();
    },
  },
});

export const { setCredentials, updateAccessToken, logout, resetAuth } = authSlice.actions;
export default authSlice.reducer;