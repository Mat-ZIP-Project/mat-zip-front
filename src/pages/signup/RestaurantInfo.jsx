import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from '../../assets/styles/pages/signup/RestaurantInfo.module.css';
import FormInput from '../../components/common/FormInput';
import FormButton from '../../components/common/FormButton';
import BusinessVerification from '../../components/signup/BusinessVerification';
import PlaceSearch from '../../components/signup/PlaceSearch';
import { useRestaurantForm } from '../../hooks/useRestaurantForm';
import axiosInstance from '../../api/axiosinstance';

const RestaurantInfo = ({ onNext, onBack, signupData }) => {
    const navigate = useNavigate();
    const [isApiLoaded, setIsApiLoaded] = useState(false);
    
    const {
        restaurantData,
        setRestaurantData,
        errors, setErrors,
        isLoading, setIsLoading,
        isBusinessVerified,
        setIsBusinessVerified,
        handleErrorClear,
        handleInputChange,
        validateForm
    } = useRestaurantForm();

    useEffect(() => {
        const loadKakaoAPI = async () => {
            try {
                if (window.kakao && window.kakao.maps) {
                    setIsApiLoaded(true);
                    return;
                }

                const script = document.createElement('script');
                script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services`;
                script.async = true;
                
                script.onload = () => {
                    if (window.kakao && window.kakao.maps) {
                        window.kakao.maps.load(() => {
                            setIsApiLoaded(true);
                        });
                    }
                };
                
                script.onerror = () => {
                    console.error('카카오맵 API 로드 실패');
                    setIsApiLoaded(false);
                };
                
                document.head.appendChild(script);
            } catch (error) {
                console.error('API 로드 중 오류:', error);
                setIsApiLoaded(false);
            }
        };

        loadKakaoAPI();

        return () => {
            const scripts = document.querySelectorAll('script[src*="kakao"]');
            scripts.forEach(script => {
                if (script.parentNode) {
                    script.parentNode.removeChild(script);
                }
            });
        };
    }, []);

    const handlePlaceSelect = useCallback((placeData) => {
        setRestaurantData(prev => ({
            ...prev,
            ...placeData
        }));
    }, [setRestaurantData]);

    const handleBusinessNumberChange = useCallback((e) => {
        setRestaurantData(prev => ({
            ...prev,
            businessNumber: e.target.value
        }));
    }, [setRestaurantData]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
        }
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const completeSignupData = {
                userId: signupData.userInfo.userId,
                password: signupData.userInfo.password,
                name: signupData.userInfo.name,
                phone: signupData.userInfo.phone,
                termsAgreed: true,
                privacyAgreed: true,
                role: 'ROLE_OWNER',
                businessNumber: restaurantData.businessNumber.replace(/-/g, ''),
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
            
            let errorMessage = '회원가입에 실패했습니다';
            
            if (error.response?.status === 500) {
                errorMessage = '서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            } else if (error.response?.data?.errMsg) {
                errorMessage = error.response.data.errMsg;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setErrors({ general: errorMessage });
            
            await Swal.fire({
                icon: 'error',
                title: '회원가입 실패',
                text: errorMessage,
                confirmButtonText: '확인',
                confirmButtonColor: '#d33',
            });
        } finally {
            setIsLoading(false);
        }
    }, [restaurantData, validateForm, signupData, navigate, setIsLoading, setErrors]);

    const categories = ['한식', '중식', '일식', '양식', '카페'];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>식당 정보 입력</h1>
            <p className={styles.subtitle}>사업자 인증 후 식당 정보를 입력하여 회원가입을 완료해주세요</p>

            <form onSubmit={handleSubmit} className={styles.form} onKeyPress={handleKeyPress}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>사업자등록번호 *</label>
                    <BusinessVerification
                        businessNumber={restaurantData.businessNumber}
                        onChange={handleBusinessNumberChange}
                        onVerified={setIsBusinessVerified}
                        error={errors.businessNumber}
                        onErrorClear={handleErrorClear}
                    />
                </div>

                {isBusinessVerified && (
                    <>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>식당 검색 *</label>
                            {isApiLoaded ? (
                                <PlaceSearch
                                    onPlaceSelect={handlePlaceSelect}
                                    error={errors.address}
                                    onErrorClear={handleErrorClear}
                                />
                            ) : (
                                <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
                                    카카오맵 API 로딩 중...
                                </div>
                            )}
                        </div>

                        <div className={styles.rowGroup}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>식당명 *</label>
                                <FormInput
                                    name="restaurantName" 
                                    type="text"
                                    placeholder="검색으로 자동 입력되거나 직접 입력"
                                    value={restaurantData.restaurantName}
                                    onChange={handleInputChange}
                                    error={errors.restaurantName}
                                    maxLength="50"
                                />
                            </div>

                            <div className={`${styles.formGroup} ${styles.categoryGroup}`}>
                                <label className={styles.label}>카테고리 *</label>
                                <select
                                    name="category"
                                    value={restaurantData.category}
                                    onChange={handleInputChange}
                                    className={`${styles.select} ${errors.category ? styles.selectError : ''}`}
                                >
                                    <option value="">카테고리 선택</option>
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
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>식당 주소 *</label>
                            <FormInput
                                name="address" 
                                type="text"
                                placeholder="검색으로 자동 입력됩니다"
                                value={restaurantData.address}
                                onChange={handleInputChange}
                                error={errors.address}
                                disabled={true}
                            />
                        </div>

                        <div className={styles.rowGroup}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>식당 전화번호 *</label>
                                <FormInput
                                    name="phone" 
                                    type="tel"

                                    value={restaurantData.phone}
                                    onChange={handleInputChange}
                                    error={errors.phone}
                                    maxLength="13"
                                />
                            </div>

                            <div className={`${styles.formGroup} ${styles.waitingGroup}`}>
                                <label className={styles.label}>웨이팅 제한인원 *</label>
                                <FormInput
                                    name="maxWaitingLimit" 
                                    type="number"
                                    placeholder="최대 인원수"
                                    value={restaurantData.maxWaitingLimit}
                                    onChange={handleInputChange}
                                    error={errors.maxWaitingLimit}
                                    min="1"
                                    max="100"
                                />
                            </div>
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