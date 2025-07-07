import { useState, useCallback } from 'react';

export const useRestaurantForm = () => {
    const [restaurantData, setRestaurantData] = useState({
        businessNumber: '',
        restaurantName: '',
        description: '',
        category: '',
        address: '',
        regionSido: '',
        regionSigungu: '',
        latitude: '',
        longitude: '',
        phone: '',
        openTime: '',
        closeTime: '',
        maxWaitingLimit: 10
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isBusinessVerified, setIsBusinessVerified] = useState(false);

    const handleErrorClear = useCallback((fieldName) => {
        setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }, []);

    // 전화번호 포맷팅
    const formatPhoneNumber = useCallback((value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        const limitedValue = numericValue.slice(0, 11);
        
        let formattedValue = limitedValue;
        
        if (limitedValue.startsWith('02')) {
            if (limitedValue.length > 2) {
                formattedValue = limitedValue.slice(0, 2) + '-' + limitedValue.slice(2);
            }
            if (limitedValue.length > 6) {
                formattedValue = limitedValue.slice(0, 2) + '-' + limitedValue.slice(2, 6) + '-' + limitedValue.slice(6, 10);
            }
        } else if (limitedValue.startsWith('0')) {
            if (limitedValue.length > 3) {
                formattedValue = limitedValue.slice(0, 3) + '-' + limitedValue.slice(3);
            }
            if (limitedValue.length > 7) {
                formattedValue = limitedValue.slice(0, 3) + '-' + limitedValue.slice(3, 7) + '-' + limitedValue.slice(7, 11);
            }
        }
        
        return formattedValue;
    }, []);

    // 주소 파싱 간소화
    const parseAddress = useCallback((address) => {
        const addressParts = address.split(' ');
        return {
            regionSido: addressParts[1] || '',
            regionSigungu: addressParts[2] || ''
        };
    }, []);

    // 입력값 변경 처리
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const formattedPhone = formatPhoneNumber(value);
            setRestaurantData(prev => ({ ...prev, [name]: formattedPhone }));
        } else {
            setRestaurantData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors, formatPhoneNumber]);

    // 폼 검증
    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!isBusinessVerified) {
            newErrors.businessNumber = '사업자 인증을 완료해주세요';
        }

        if (!restaurantData.restaurantName.trim()) {
            newErrors.restaurantName = '식당명을 입력해주세요';
        } else if (restaurantData.restaurantName.length > 50) {
            newErrors.restaurantName = '식당명은 50자 이하로 입력해주세요';
        }

        if (!restaurantData.description.trim()) {
            newErrors.description = '식당 설명을 입력해주세요';
        } else if (restaurantData.description.length > 500) {
            newErrors.description = '식당 설명은 500자 이하로 입력해주세요';
        }

        if (!restaurantData.category.trim()) {
            newErrors.category = '식당 카테고리를 선택해주세요';
        }

        if (!restaurantData.address.trim()) {
            newErrors.address = '주소를 입력해주세요';
        }

        if (!restaurantData.phone.trim()) {
            newErrors.phone = '식당 전화번호를 입력해주세요';
        } else {
            const cleanPhone = restaurantData.phone.replace(/-/g, '');
            if (!/^(02[0-9]{7,8}|0[3-9][0-9]{7,8})$/.test(cleanPhone)) {
                newErrors.phone = '올바른 전화번호를 입력해주세요.';
            }
        }

        if (!restaurantData.openTime.trim()) {
            newErrors.openTime = '영업 시작 시간을 입력해주세요';
        }

        if (!restaurantData.closeTime.trim()) {
            newErrors.closeTime = '영업 종료 시간을 입력해주세요';
        }

        if (!restaurantData.maxWaitingLimit || restaurantData.maxWaitingLimit < 1 || restaurantData.maxWaitingLimit > 100) {
            newErrors.maxWaitingLimit = '웨이팅 제한은 1-100 사이의 숫자로 입력해주세요';
        }

        if (!restaurantData.latitude || !restaurantData.longitude) {
            newErrors.address = '주소 검색을 통해 정확한 위치 정보를 입력해주세요';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [restaurantData, isBusinessVerified]);

    return {
        restaurantData,
        setRestaurantData,
        errors,
        setErrors,
        isLoading,
        setIsLoading,
        isBusinessVerified,
        setIsBusinessVerified,
        handleErrorClear,
        handleInputChange,
        validateForm,
        parseAddress
    };
};