/** 포맷팅 로직 */
export const formatters = {
  /** 휴대폰번호 포맷팅 (010-XXXX-XXXX) */
  phone: (value) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  },

  /** 식당 전화번호 포맷팅 (지역번호에 따라 다양한 형식) */
  restaurantPhone: (value) => {
    const numbers = value.replace(/[^\d]/g, '');
    
    // 02 지역번호 (서울)
    if (numbers.startsWith('02')) {
      if (numbers.length <= 2) return numbers;
      if (numbers.length <= 6) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6, 10)}`;
    }
    
    // 070 (인터넷전화)
    if (numbers.startsWith('070')) {
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
    
    // 기타 지역번호 (031, 032, 033, 041, 042, 043, 044, 051, 052, 053, 054, 055, 061, 062, 063, 064)
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    if (numbers.length === 10) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  },

  businessNumber: (value) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
  },

  time: (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

/** 식당 주소 포맷팅 */
export const parseAddress = (address) => {
  const addressParts = address.split(' ');
  if (addressParts.length < 2) return { regionSido: '', regionSigungu: '' };

  const firstPart = addressParts[0];
  const specialCities = ['서울', '인천', '대전', '대구', '울산', '부산', '광주', '세종특별자치시'];
  
  let regionSido = '';
  let regionSigungu = '';

  if (specialCities.some(city => firstPart.includes(city))) {
    regionSido = firstPart === '세종특별자치시' ? '세종특별자치시' : firstPart + '시';
    regionSigungu = addressParts[1] || '';
  } else {
    regionSido = addressParts[1] || '';
    regionSigungu = addressParts[2] || '';
  }

  return { regionSido, regionSigungu };
};