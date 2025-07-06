import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from '../../assets/styles/pages/signup/RestaurantInfo.module.css';
import FormInput from '../../components/login/FormInput';
import FormButton from '../../components/login/FormButton';
import BusinessVerification from '../../components/signup/BusinessVerification'; // 추가: 사업자 인증 컴포넌트
import axiosInstance from '../../api/axiosinstance';

const RestaurantInfo = ({ onNext, onBack, signupData }) => {
    const navigate = useNavigate();
    const businessRef = useRef(null);
    
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
    const [isAddressSearching, setIsAddressSearching] = useState(false);
    const [isBusinessVerified, setIsBusinessVerified] = useState(false);

    // 카카오맵 API 초기화
    useEffect(() => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services`;
        script.async = true;
        script.onload = () => {
            window.kakao.maps.load(() => {
                console.log('카카오맵 API 로드 완료');
            });
        };
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    // 에러 제거 함수
    const handleErrorClear = useCallback((fieldName) => {
        setErrors(prev => ({
            ...prev,
            [fieldName]: ''
        }));
    }, []);

    // 주소 정보 파싱 (다음 우편번호 API 활용)
    const parseAddressInfo = useCallback((addressData) => {
        const { 
            address, 
            roadAddress, 
            sido, 
            sigungu
        } = addressData;

        // 지번주소에서 시/구 정보 추출
        let regionSido = '';
        let regionSigungu = '';

        if (address) {
            // 지번주소에서 시/도, 시/군/구 정보 파싱
            const addressParts = address.split(' ');
            
            if (addressParts.length >= 3) {
                // 첫 번째 부분: 시/도 (경기, 서울특별시, 부산광역시 등)
                regionSido = addressParts[0];
                
                // 두 번째 부분: 시/군/구 (성남시, 강남구 등)
                regionSigungu = addressParts[1];
                
                // 특별시/광역시의 경우 세 번째 부분이 구
                if (regionSido.includes('서울') || regionSido.includes('부산') || 
                    regionSido.includes('대구') || regionSido.includes('인천') || 
                    regionSido.includes('광주') || regionSido.includes('대전') || 
                    regionSido.includes('울산') || regionSido.includes('세종')) {
                    
                    if (addressParts[1] && addressParts[1].includes('구')) {
                        regionSigungu = addressParts[1]; // 구 정보
                    } else if (addressParts[2] && addressParts[2].includes('구')) {
                        regionSigungu = addressParts[2]; // 구 정보
                    }
                }
                // 경기도 등의 경우
                else {
                    regionSigungu = addressParts[1]; // 시/군 정보
                }
            }
        }

        const fullAddress = roadAddress || address;
        
        return {
            fullAddress,
            regionSido,
            regionSigungu
        };
    }, []);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;

        if (name === 'businessNumber') {
            setRestaurantData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        else if (name === 'phone') {
            const numericValue = value.replace(/[^0-9]/g, '');
            const limitedValue = numericValue.slice(0, 11);
            
            let formattedValue = limitedValue;
            if (limitedValue.startsWith('02')) {
                if (limitedValue.length > 2) {
                    formattedValue = limitedValue.slice(0, 2) + '-' + limitedValue.slice(2);
                }
                if (limitedValue.length > 6) {
                    formattedValue = limitedValue.slice(0, 2) + '-' + limitedValue.slice(2, 6) + '-' + limitedValue.slice(6);
                }
            } else if (limitedValue.startsWith('0')) {
                if (limitedValue.length > 3) {
                    formattedValue = limitedValue.slice(0, 3) + '-' + limitedValue.slice(3);
                }
                if (limitedValue.length > 6) {
                    formattedValue = limitedValue.slice(0, 3) + '-' + limitedValue.slice(3, 6) + '-' + limitedValue.slice(6);
                }
            }
            
            setRestaurantData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
        }
        else {
            setRestaurantData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    }, [errors]);

    const handleAddressSearch = useCallback(() => {
        setIsAddressSearching(true);
        
        new window.daum.Postcode({
            oncomplete: function(data) {
                const { fullAddress, regionSido, regionSigungu } = parseAddressInfo(data);
                
                setRestaurantData(prev => ({
                    ...prev,
                    address: fullAddress,
                    regionSido,
                    regionSigungu
                }));
                
                // 카카오맵 API로 위도, 경도 검색
                if (window.kakao && window.kakao.maps) {
                    const geocoder = new window.kakao.maps.services.Geocoder();
                    
                    geocoder.addressSearch(fullAddress, function(result, status) {
                        if (status === window.kakao.maps.services.Status.OK) {
                            setRestaurantData(prev => ({
                                ...prev,
                                latitude: result[0].y,
                                longitude: result[0].x
                            }));
                            
                            // 콘솔에 파싱 결과 출력 (개발 확인용)
                            console.log('주소 파싱 결과:', {
                                originalData: data,
                                parsedAddress: fullAddress,
                                regionSido,
                                regionSigungu,
                                latitude: result[0].y,
                                longitude: result[0].x
                            });
                        }
                    });
                }
                
                setIsAddressSearching(false);
            },
            onclose: function() {
                setIsAddressSearching(false);
            }
        }).open();
    }, [parseAddressInfo]);

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
            if (!/^(02|0[3-9][0-9]?)[0-9]{7,8}$/.test(cleanPhone)) {
                newErrors.phone = '올바른 전화번호를 입력해주세요';
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

        // 위도/경도 및 지역 정보 필수 검증
        if (!restaurantData.latitude || !restaurantData.longitude) {
            newErrors.address = '주소 검색을 통해 정확한 위치 정보를 입력해주세요';
        }

        if (!restaurantData.regionSido || !restaurantData.regionSigungu) {
            newErrors.address = '지역 정보를 정확히 파싱할 수 없습니다. 다시 주소를 검색해주세요';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [restaurantData, isBusinessVerified]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const completeSignupData = {
                // 기본 사용자 정보
                userId: signupData.userInfo.userId,
                password: signupData.userInfo.password,
                name: signupData.userInfo.name,
                phone: signupData.userInfo.phone,
                termsAgreed: true,
                privacyAgreed: true,
                role: 'ROLE_OWNER',
                
                // 사업자 정보
                businessNumber: restaurantData.businessNumber.replace(/-/g, ''),
                
                // 식당 정보
                restaurantName: restaurantData.restaurantName,
                address: restaurantData.address,
                regionSido: restaurantData.regionSido,
                regionSigungu: restaurantData.regionSigungu,
                latitude: parseFloat(restaurantData.latitude),
                longitude: parseFloat(restaurantData.longitude),
                restaurantPhone: restaurantData.phone.replace(/-/g, ''),
                category: restaurantData.category,
                descript: restaurantData.description,
                openTime: restaurantData.openTime + ':00',
                closeTime: restaurantData.closeTime + ':00',
                maxWaitingLimit: parseInt(restaurantData.maxWaitingLimit)
            };

            console.log('회원가입 전송 데이터:', completeSignupData);

            await axiosInstance.post('/signup/owner', completeSignupData);

            await Swal.fire({
                icon: 'success',
                title: '회원가입 완료!',
                text: '식당 업주 회원가입이 성공적으로 완료되었습니다.',
                confirmButtonText: '확인',
                confirmButtonColor: '#ff6b35',
            });
            
            navigate('/');
        } catch (error) {
            console.error('회원가입 실패:', error);
            const errorMessage = error.response?.data?.errMsg || '회원가입에 실패했습니다';
            setErrors({ general: errorMessage });
        } finally {
            setIsLoading(false);
        }
    }, [restaurantData, validateForm, signupData, navigate, isBusinessVerified]);

    const categories = ['한식', '중식', '일식', '양식', '카페'];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>식당 정보 입력</h1>
            <p className={styles.subtitle}>사업자 인증 후 식당 정보를 입력하여 회원가입을 완료해주세요</p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>사업자등록번호 *</label>
                    <BusinessVerification
                        ref={businessRef}
                        businessNumber={restaurantData.businessNumber}
                        onChange={handleInputChange}
                        onVerified={setIsBusinessVerified}
                        error={errors.businessNumber}
                        onErrorClear={handleErrorClear}
                    />
                </div>

                {isBusinessVerified && (
                    <>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>식당명 *</label>
                            <FormInput
                                name="restaurantName" 
                                type="text"
                                placeholder="식당명을 입력해주세요"
                                value={restaurantData.restaurantName}
                                onChange={handleInputChange}
                                error={errors.restaurantName}
                                maxLength="50"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>식당 설명 *</label>
                            <textarea
                                name="description"
                                placeholder="식당에 대한 간단한 설명을 입력해주세요"
                                value={restaurantData.description}
                                onChange={handleInputChange}
                                className={`${styles.textarea} ${errors.description ? styles.textareaError : ''}`}
                                maxLength="500"
                            />
                            {errors.description && (
                                <span className={styles.errorMessage}>{errors.description}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>카테고리 *</label>
                            <select
                                name="category"
                                value={restaurantData.category}
                                onChange={handleInputChange}
                                className={`${styles.select} ${errors.category ? styles.selectError : ''}`}
                            >
                                <option value="">카테고리를 선택해주세요</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <span className={styles.errorMessage}>{errors.category}</span>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>주소 *</label>
                            <div className={styles.inputGroup}>
                                <FormInput
                                    name="address" 
                                    type="text"
                                    placeholder="주소 검색 버튼을 클릭해주세요"
                                    value={restaurantData.address}
                                    onChange={handleInputChange}
                                    error={errors.address}
                                    disabled={true}
                                />
                                <FormButton
                                    type="button" 
                                    variant="secondary"
                                    size="small"
                                    onClick={handleAddressSearch}
                                    disabled={isAddressSearching}
                                    loading={isAddressSearching}
                                    className={styles.addressButton}
                                >
                                    주소 검색
                                </FormButton>
                            </div>
                            {restaurantData.regionSido && restaurantData.regionSigungu && (
                                <div className={styles.addressInfo}>
                                    📍 {restaurantData.regionSido} {restaurantData.regionSigungu}
                                    {restaurantData.latitude && restaurantData.longitude && (
                                        <span className={styles.coordinates}>
                                            (위도: {parseFloat(restaurantData.latitude).toFixed(6)}, 
                                             경도: {parseFloat(restaurantData.longitude).toFixed(6)})
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>식당 전화번호 *</label>
                            <FormInput
                                name="phone" 
                                type="tel"
                                placeholder="02-1234-5678"
                                value={restaurantData.phone}
                                onChange={handleInputChange}
                                error={errors.phone}
                                maxLength="13"
                            />
                        </div>

                        <div className={styles.timeGroup}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>영업 시작 시간 *</label>
                                <FormInput
                                    name="openTime" 
                                    type="time"
                                    value={restaurantData.openTime}
                                    onChange={handleInputChange}
                                    error={errors.openTime}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>영업 종료 시간 *</label>
                                <FormInput
                                    name="closeTime" 
                                    type="time"
                                    value={restaurantData.closeTime}
                                    onChange={handleInputChange}
                                    error={errors.closeTime}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>웨이팅 제한 인원 *</label>
                            <FormInput
                                name="maxWaitingLimit" 
                                type="number"
                                placeholder="최대 웨이팅 가능 인원 수"
                                value={restaurantData.maxWaitingLimit}
                                onChange={handleInputChange}
                                error={errors.maxWaitingLimit}
                                min="1"
                                max="100"
                            />
                        </div>
                    </>
                )}

                {errors.general && (
                    <div className={styles.errorAlert}>
                        {errors.general}
                    </div>
                )}

                <div className={styles.buttonContainer}>
                    <FormButton
                        type="button"
                        variant="secondary"
                        onClick={onBack}
                    >
                        이전
                    </FormButton>
                    <FormButton
                        type="submit"
                        variant="primary"
                        loading={isLoading}
                        disabled={!isBusinessVerified}
                    >
                        회원가입 완료
                    </FormButton>
                </div>
            </form>
        </div>
    );
};

export default RestaurantInfo;