import { useState, useCallback } from 'react';
import { formatters } from '../utils/formatters';

/** 식당 업주 회원가입시 입력할 식당정보 폼 */
export const useRestaurantForm = () => {
    const [restaurantData, setRestaurantData] = useState({
        businessNumber: '',
        restaurantName: '',
        address: '',
        regionSido: '',
        regionSigungu: '',
        latitude: '',
        longitude: '',
        phone: '',
        category: '',
        description: '',
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

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // 전화번호 포맷팅 (식당 전화번호)
        if (name === 'phone') {
            formattedValue = formatters.restaurantPhone(value);
        }

        setRestaurantData(prev => ({ ...prev, [name]: formattedValue }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    }, []);

    const validateForm = useCallback(() => {
        const newErrors = {};

        // 사업자등록번호 검증
        if (!restaurantData.businessNumber.trim()) {
            newErrors.businessNumber = '사업자등록번호를 입력해주세요';
        }

        // 식당명 검증
        if (!restaurantData.restaurantName.trim()) {
            newErrors.restaurantName = '식당명을 입력해주세요';
        }

        // 주소 검증
        if (!restaurantData.address.trim()) {
            newErrors.address = '식당 주소를 검색해주세요';
        }

        // 카테고리 검증
        if (!restaurantData.category) {
            newErrors.category = '카테고리를 선택해주세요';
        }

        // 식당 전화번호 검증 (일반 전화번호 형식)
        if (!restaurantData.phone.trim()) {
            newErrors.phone = '식당 전화번호를 입력해주세요';
        } else {
            const cleanPhone = restaurantData.phone.replace(/-/g, '');
            // 일반 전화번호 형식: 02-XXXX-XXXX, 031~064-XXX(X)-XXXX, 070-XXXX-XXXX
            const phonePattern = /^(02|031|032|033|041|042|043|044|051|052|053|054|055|061|062|063|064|070)\d{7,8}$/;
            if (!phonePattern.test(cleanPhone)) {
                newErrors.phone = '올바른 전화번호를 입력해주세요';
            }
        }

        // 영업시간 검증
        if (!restaurantData.openTime) {
            newErrors.openTime = '영업 시작 시간을 선택해주세요';
        }

        if (!restaurantData.closeTime) {
            newErrors.closeTime = '영업 종료 시간을 선택해주세요';
        }

        // 웨이팅 제한인원 검증
        if (!restaurantData.maxWaitingLimit || restaurantData.maxWaitingLimit < 1) {
            newErrors.maxWaitingLimit = '웨이팅 제한인원을 입력해주세요';
        }

        // 설명 검증
        if (!restaurantData.description.trim()) {
            newErrors.description = '식당 설명을 입력해주세요';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [restaurantData]);

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
        validateForm
    };
};