import React, { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * 회원가입 전역 상태 관리 Context
 * - 폼 데이터, 에러, 검증 상태, 로딩 상태를 중앙에서 관리
 * - props drilling 방지 및 상태 일관성 보장
 */
const SignupContext = createContext();

// 액션 타입 정의 - 상태 변경을 위한 액션들
const ACTIONS = {
  SET_FIELD: 'SET_FIELD',           // 개별 필드 값 설정
  SET_ERRORS: 'SET_ERRORS',         // 에러 객체 전체 설정
  CLEAR_ERROR: 'CLEAR_ERROR',       // 특정 필드 에러 클리어
  SET_VERIFICATION: 'SET_VERIFICATION', // 검증 상태 설정
  SET_LOADING: 'SET_LOADING',       // 로딩 상태 설정
  RESET_FORM: 'RESET_FORM'          // 폼 전체 초기화
};

// 초기 상태 정의 - 모든 회원가입 관련 상태를 포함
const initialState = {
  formData: {
    // 공통 필드 (일반 사용자 + 업주 공통)
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    preferenceCategory: '',
    
    // 사업자 전용 필드
    businessNumber: '',
    restaurantName: '',
    description: '',
    category: '',
    address: '',
    regionSido: '',
    regionSigungu: '',
    latitude: '',
    longitude: '',
    restaurantPhone: '',
    openTime: '',
    closeTime: '',
    maxWaitingLimit: 10
  },
  errors: {},                       // 폼 검증 에러 메시지들
  verification: {                   // 각종 인증/확인 상태
    userIdChecked: false,           // 아이디 중복확인 완료 여부
    userIdAvailable: false,         // 아이디 사용 가능 여부
    phoneVerified: false,           // 휴대폰 인증 완료 여부
    phoneChecked: false,            // 휴대폰 중복확인 완료 여부
    phoneAvailable: false,          // 휴대폰 사용 가능 여부
    businessVerified: false         // 사업자 인증 완료 여부
  },
  loading: {                        // 각 작업별 로딩 상태
    submit: false,                  // 폼 제출 중
    userIdCheck: false,             // 아이디 중복확인 중
    phoneCheck: false,              // 휴대폰 관련 작업 중
    businessCheck: false            // 사업자 인증 중
  }
};

/**
 * 상태 변경을 처리하는 리듀서 함수
 * @param {Object} state - 현재 상태
 * @param {Object} action - 실행할 액션 (type, payload 포함)
 * @returns {Object} 새로운 상태
 */
function signupReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_FIELD:
      // 개별 필드 값 업데이트 (예: 아이디 입력, 비밀번호 입력)
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value
        }
      };
    
    case ACTIONS.SET_ERRORS:
      // 에러 객체 전체 교체 (폼 검증 후 모든 에러 설정)
      return {
        ...state,
        errors: action.errors
      };
    
    case ACTIONS.CLEAR_ERROR:
      // 특정 필드의 에러만 제거 (사용자가 입력을 수정할 때)
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: undefined
        }
      };
    
    case ACTIONS.SET_VERIFICATION:
      // 검증 상태 업데이트 (아이디 확인, 휴대폰 인증 등)
      return {
        ...state,
        verification: {
          ...state.verification,
          ...action.verification
        }
      };
    
    case ACTIONS.SET_LOADING:
      // 특정 작업의 로딩 상태 설정
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.field]: action.value
        }
      };
    
    case ACTIONS.RESET_FORM:
      // 폼 전체를 초기 상태로 리셋
      return initialState;
    
    default:
      return state;
  }
}

/**
 * SignupContext Provider 컴포넌트
 * - 전체 회원가입 플로우에서 상태를 제공
 * - children 컴포넌트들이 Context를 사용할 수 있게 함
 */
export const SignupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(signupReducer, initialState);

  // 액션 생성자들 - 컴포넌트에서 호출할 함수들
  
  /**
   * 개별 필드 값 설정
   * @param {string} field - 필드명 (예: 'userId', 'password')
   * @param {any} value - 설정할 값
   */
  const setField = useCallback((field, value) => {
    dispatch({ type: ACTIONS.SET_FIELD, field, value });
  }, []);

  /**
   * 여러 에러를 한 번에 설정
   * @param {Object} errors - 에러 객체 {fieldName: errorMessage}
   */
  const setErrors = useCallback((errors) => {
    dispatch({ type: ACTIONS.SET_ERRORS, errors });
  }, []);

  /**
   * 특정 필드의 에러 제거
   * @param {string} field - 에러를 제거할 필드명
   */
  const clearError = useCallback((field) => {
    dispatch({ type: ACTIONS.CLEAR_ERROR, field });
  }, []);

  /**
   * 검증 상태 업데이트
   * @param {Object} verification - 검증 상태 객체
   */
  const setVerification = useCallback((verification) => {
    dispatch({ type: ACTIONS.SET_VERIFICATION, verification });
  }, []);

  /**
   * 로딩 상태 설정
   * @param {string} field - 로딩 상태를 설정할 작업명
   * @param {boolean} value - 로딩 여부
   */
  const setLoading = useCallback((field, value) => {
    dispatch({ type: ACTIONS.SET_LOADING, field, value });
  }, []);

  /**
   * 폼 전체 초기화
   */
  const resetForm = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_FORM });
  }, []);

  // Context에 제공할 값들
  const value = {
    ...state,              // 현재 상태 (formData, errors, verification, loading)
    setField,              // 액션 생성자들
    setErrors,
    clearError,
    setVerification,
    setLoading,
    resetForm
  };

  return (
    <SignupContext.Provider value={value}>
      {children}
    </SignupContext.Provider>
  );
};

/**
 * SignupContext를 사용하는 커스텀 훅
 * @returns {Object} Context 값 (상태 + 액션 생성자들)
 * @throws {Error} Provider 없이 사용시 에러 발생
 */
export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignup must be used within SignupProvider');
  }
  return context;
};