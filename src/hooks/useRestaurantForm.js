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

        // 식당 전화번호 검증 (02: 02-000-0000, 그 외: 000-000-0000)
        if (!restaurantData.phone.trim()) {
            newErrors.phone = '식당 전화번호를 입력해주세요';
        } else {
            if (restaurantData.phone.startsWith('02')) {
                if (!/^02-\d{3}-\d{4}$/.test(restaurantData.phone)) {
                    newErrors.phone = '02 지역번호는 02-000-0000 형태여야 합니다.';
                }
            } else {
                if (!/^\d{3}-\d{3}-\d{4}$/.test(restaurantData.phone)) {
                    newErrors.phone = '연락처는 000-000-0000 형태여야 합니다.';
                }
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