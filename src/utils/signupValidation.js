/** 회원가입 폼 필드별 검증 규칙 정의 */
export const validationRules = {
  userId: {
    required: '아이디를 입력해주세요',
    pattern: /^[a-zA-Z0-9]{4,20}$/,
    message: '아이디는 4-20자의 영문, 숫자만 사용 가능합니다'
  },
  password: {
    required: '비밀번호를 입력해주세요',
    minLength: 10,
    message: '비밀번호는 10자 이상이어야 합니다',
    complexity: {
      pattern: [/[A-Z]/, /[a-z]/, /\d/, /[@$!%*?&]/],
      message: '비밀번호는 영문 대문자, 소문자, 숫자, 특수문자 중 2종류 이상 조합해야 합니다'
    }
  },
  phone: {
    required: '휴대폰번호를 입력해주세요',
    pattern: /^01[0-9]{8,9}$/,
    message: '올바른 휴대폰번호를 입력해주세요'
  },
  name: {
    required: '이름을 입력해주세요',
    pattern: /^[가-힣a-zA-Z\s]{2,20}$/,
    message: '이름은 2-20자의 한글, 영문만 사용 가능합니다'
  },
  businessNumber: {
    required: '사업자등록번호를 입력해주세요',
    pattern: /^\d{10}$/,
    message: '올바른 사업자등록번호를 입력해주세요'
  }
};

/** 단일 필드값 검증 */
export const validateField = (fieldName, value, customRules = {}) => {
  const rules = { ...validationRules[fieldName], ...customRules };
  
  // 필수값 검증
  if (rules.required && !value?.trim()) {
    return rules.required;
  }
  
  // 정규식 패턴 검증
  if (rules.pattern && value && !rules.pattern.test(value.replace(/-/g, ''))) {
    return rules.message;
  }
  
  // 최소 길이 검증
  if (rules.minLength && value && value.length < rules.minLength) {
    return rules.message;
  }
  
  // 비밀번호 복잡도 검증
  if (rules.complexity && value) {
    const typesCount = rules.complexity.pattern.filter(pattern => pattern.test(value)).length;
    if (typesCount < 2) {
      return rules.complexity.message;
    }
  }
  
  return null;
};

/** 전체 폼 데이터를 검증하고 에러 객체 반환 */
export const validateForm = (formData, fieldNames, verificationStatus = {}) => {
  const errors = {};
  
  // 각 필드별 기본 검증 수행
  fieldNames.forEach(fieldName => {
    const error = validateField(fieldName, formData[fieldName]);
    if (error) errors[fieldName] = error;
  });
  
  // 비밀번호 확인 일치 검증
  if (fieldNames.includes('confirmPassword')) {
    if (!formData.confirmPassword) {
      errors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
  }
  
  // 아이디 중복확인 완료 여부 검증
  if (fieldNames.includes('userId') && !verificationStatus.userIdChecked) {
    errors.userId = '아이디 중복확인을 해주세요';
  }
  
  // 휴대폰 인증 완료 여부 검증
  if (fieldNames.includes('phone') && !verificationStatus.phoneVerified) {
    errors.phone = '휴대폰 인증을 완료해주세요';
  }
  
  return errors;
};