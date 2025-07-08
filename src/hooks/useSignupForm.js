import { useState, useCallback, useRef } from 'react';
import { formatters } from '../utils/formatters';
import { validateForm } from '../utils/signupValidation';

/** 회원가입 유형별 필드 구분 */
const fieldSets = {
  // 공통 필드
  common: {
    userId: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  },
  
  // 일반 회원 전용 필드
  user: {
    preferenceCategory: ''
  },
  
  // 식당업주 전용 필드
  owner: {
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
  }
};

/** 회원 유형에 따른 기본 필드 생성 */
const createDefaultFields = (userType = 'common', customFields = {}) => {
  let fields = { ...fieldSets.common };
  
  if (userType === 'user') {
    fields = { ...fields, ...fieldSets.user };
  } else if (userType === 'owner') {
    fields = { ...fields, ...fieldSets.owner };
  }
  
  return { ...fields, ...customFields };
};

/** 회원가입 폼 상태 관리 훅 */
export const useSignupForm = (initialData = {}, options = {}) => {
  const { 
    userType = 'common',
    validationFields = ['userId', 'password', 'confirmPassword', 'name', 'phone'],
    formatFields = ['phone', 'businessNumber'],
    enableVerification = true 
  } = options;

  // 기본 필드를 한 번만 계산하여 고정
  const defaultFields = createDefaultFields(userType, initialData);

  // Refs를 고정된 필드 목록으로 생성
  const allFieldNames = [
    'userId', 'password', 'confirmPassword', 'name', 'phone',
    'businessNumber', 'restaurantName', 'description', 'category', 
    'address', 'restaurantPhone', 'openTime', 'closeTime', 'maxWaitingLimit'
  ];
  // Refs를 동적으로 생성
  const inputRefs = allFieldNames.reduce((refs, fieldName) => {
    refs[fieldName] = useRef(null);
    return refs;
  }, {});

  const [formData, setFormData] = useState(defaultFields);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({});
  
  // 검증 상태 - 항상 동일하게 초기화
  const [verificationStatus, setVerificationStatus] = useState({
    userIdChecked: false,
    userIdAvailable: false,
    phoneVerified: false,
    phoneChecked: false,
    phoneAvailable: false,
    businessVerified: false
  });

  // 메시지 상태 - 항상 동일하게 초기화
  const [messages, setMessages] = useState({
    userId: { type: '', text: '' },
    phone: { type: '', text: '' },
    business: { type: '', text: '' }
  });

  // 비밀번호 매칭 상태
  const [passwordMatch, setPasswordMatch] = useState({
    isValid: false,
    message: ''
  });

  /** 입력값 변경 핸들러 */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // 포맷팅 적용
    if (formatFields.includes(name) && formatters[name]) {
      formattedValue = formatters[name](value);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));

    // 에러 제거
    setErrors(prev => ({ ...prev, [name]: '' }));

    // 아이디 변경 시 검증 상태 초기화
    if (name === 'userId' && enableVerification) {
      setVerificationStatus(prev => ({
        ...prev,
        userIdChecked: false,
        userIdAvailable: false
      }));
      setMessages(prev => ({ ...prev, userId: { type: '', text: '' } }));
    }

    // 비밀번호 확인 실시간 검증
    if ((name === 'password' || name === 'confirmPassword') && validationFields.includes('confirmPassword')) {
      const currentPassword = name === 'password' ? formattedValue : formData.password;
      const currentConfirmPassword = name === 'confirmPassword' ? formattedValue : formData.confirmPassword;
      
      if (currentConfirmPassword) {
        setPasswordMatch({
          isValid: currentPassword === currentConfirmPassword,
          message: currentPassword === currentConfirmPassword 
            ? '비밀번호가 일치합니다' 
            : '비밀번호가 일치하지 않습니다'
        });
      } else {
        setPasswordMatch({ isValid: false, message: '' });
      }
    }
  }, [formatFields, validationFields, enableVerification, formData.password]);

  /** 에러 제거 */
  const clearError = useCallback((fieldName) => {
    setErrors(prev => ({ ...prev, [fieldName]: '' }));
  }, []);

  /** 포커스 함수 */
  const focusFirstErrorField = useCallback((errorObj, fieldOrder = validationFields) => {
    for (const field of fieldOrder) {
      if (errorObj[field] && inputRefs[field]?.current) {
        inputRefs[field].current.focus();
        break;
      }
    }
  }, [validationFields]);

  /** 폼 검증 */
  const validateFormData = useCallback(() => {
    const newErrors = validateForm(formData, validationFields, verificationStatus);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => focusFirstErrorField(newErrors), 100);
      return false;
    }
    return true;
  }, [formData, validationFields, verificationStatus, focusFirstErrorField]);

  /** 로딩 상태 설정 */
  const setFieldLoading = useCallback((field, isLoading) => {
    setLoading(prev => ({ ...prev, [field]: isLoading }));
  }, []);

  return {
    // 상태
    formData, setFormData,
    errors, setErrors,
    loading, setFieldLoading,
    verificationStatus, setVerificationStatus,
    messages, setMessages,
    passwordMatch,
    inputRefs,
    
    // 함수
    handleInputChange,
    clearError,
    focusFirstErrorField,
    validateForm: validateFormData,
    
    // UserSignupPage에서 필요한 추가 반환값
    isLoading: Object.values(loading).some(Boolean),
    setIsLoading: (value) => setLoading({ general: value }),
    userIdMessage: messages.userId,
    setUserIdMessage: (message) => setMessages(prev => ({ ...prev, userId: message })),
    handleErrorClear: clearError
  };
};

export const useForm = useSignupForm;