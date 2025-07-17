import axiosInstance from './axiosinstance';

/** 
 * 회원가입 관련 API
 */
export const signupApi = {
  // 아이디 중복 확인
  checkUserId: async (userId) => {
    return axiosInstance.post('/signup/check/userid', { userId });
  },

  // 휴대폰 중복 확인
  checkPhone: async (phone) => {
    return axiosInstance.post('/signup/check/phone', { phone });
  },

  // SMS 발송
  sendSMS: async (phone, purpose = 'SIGNUP') => {
    return axiosInstance.post('/signup/sms/send', {
      phone,
      purpose
    });
  },

  // SMS 인증
  verifySMS: async (phone, code, purpose = 'SIGNUP') => {
    return axiosInstance.post('/signup/sms/verify', {
      phone,
      code,
      purpose
    });
  },

  // 사업자 인증
  verifyBusiness: async (businessNumber) => {
    return axiosInstance.post('/signup/verify/business', {
      businessNumber: businessNumber.replace(/-/g, '')
    });
  },

  // 회원가입
  signupUser: async (userData) => {
    return axiosInstance.post('/signup/user', userData);
  },

  signupOwner: async (ownerData) => {
    return axiosInstance.post('/signup/owner', ownerData);
  }
};