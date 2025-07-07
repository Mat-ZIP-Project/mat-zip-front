import React, { useState, useCallback } from 'react';
import styles from '../../assets/styles/signup/PlaceSearch.module.css';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';

const PlaceSearch = ({ onPlaceSelect, error, onErrorClear }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);

    // 검색한 주소 파싱 로직
    const parseRegionInfo = useCallback((address) => {
        const addressParts = address.split(' ');
        
        if (addressParts.length < 2) {
            return { regionSido: '', regionSigungu: '' };
        }

        const firstPart = addressParts[0];
        const specialCities = ['서울', '인천', '대전', '대구', '울산', '부산', '광주', '세종특별자치시'];
        
        let regionSido = '';
        let regionSigungu = '';

        // 특별시/광역시 처리
        if (specialCities.some(city => firstPart.includes(city))) {
            if (firstPart === '세종특별자치시') {
                regionSido = '세종특별자치시';
            } else {
                regionSido = firstPart + '시';
            }
            regionSigungu = addressParts[1] || '';
        } else {
            // 일반 시/도 처리
            regionSido = addressParts[1] || '';
            regionSigungu = addressParts[2] || '';
        }

        return { regionSido, regionSigungu };
    }, []);


    // 카카오맵 장소 검색
    const handlePlaceSearch = useCallback(async () => {
        if (!searchKeyword.trim()) {
            return;
        }

        if (!window.kakao || !window.kakao.maps) {
            alert('카카오맵 API를 로드하는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        setIsSearching(true);
        const places = new window.kakao.maps.services.Places();

        places.keywordSearch(searchKeyword + ' 식당', (data, status) => {
            setIsSearching(false);
            
            if (status === window.kakao.maps.services.Status.OK) {
                // 식당/카페 관련 결과만 필터링
                const filteredResults = data.filter(place => 
                    place.category_name.includes('음식점') || 
                    place.category_name.includes('카페') ||
                    place.category_name.includes('식당')
                ).slice(0, 30); // 가져올 결과 수 제한

                setSearchResults(filteredResults);
                
                if (filteredResults.length === 0) {
                    alert('검색된 식당이 없습니다. 다른 키워드로 검색해보세요.');
                }
            } else {
                alert('검색에 실패했습니다. 다시 시도해주세요.');
                setSearchResults([]);
            }
        });
    }, [searchKeyword]);

    // 장소 선택
    const handlePlaceClick = useCallback((place) => {
        setSelectedPlace(place);
        
        const fullAddress = place.road_address_name || place.address_name;
        const { regionSido, regionSigungu } = parseRegionInfo(fullAddress);

        const placeData = {
            restaurantName: place.place_name,
            address: fullAddress,
            regionSido,
            regionSigungu,
            latitude: place.y,
            longitude: place.x
        };

        onPlaceSelect(placeData);
        setSearchResults([]);
        setSearchKeyword('');
        
        if (onErrorClear) {
            onErrorClear('address');
        }
    }, [onPlaceSelect, onErrorClear, parseRegionInfo]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            handlePlaceSearch();
        }
    }, [handlePlaceSearch]);

    return (
        <div className={styles.container}>
            <div className={styles.searchGroup}>
                <FormInput
                    name="placeSearch"
                    type="text"
                    placeholder="식당명을 입력하여 검색하세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    error={error}
                />
                <FormButton
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={handlePlaceSearch}
                    loading={isSearching}
                    disabled={!searchKeyword.trim()}
                    className={styles.searchButton}
                >
                    검색
                </FormButton>
            </div>

            {searchResults.length > 0 && (
                <div className={styles.resultsContainer}>
                    <h4 className={styles.resultsTitle}>검색 결과</h4>
                    <ul className={styles.resultsList}>
                        {searchResults.map((place, index) => (
                            <li 
                                key={place.id} 
                                className={styles.resultItem}
                                onClick={() => handlePlaceClick(place)}
                            >
                                <div className={styles.placeName}>
                                    {place.place_name}
                                </div>
                                <div className={styles.placeAddress}>
                                    {place.road_address_name || place.address_name}
                                </div>
                                <div className={styles.placeCategory}>
                                    {place.category_name}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedPlace && (
                <div className={styles.selectedPlace}>
                    📍[{selectedPlace.place_name}] {selectedPlace.road_address_name || selectedPlace.address_name} 
                     (위도: {parseFloat(selectedPlace.y).toFixed(6)}, 경도: {parseFloat(selectedPlace.x).toFixed(6)})
                </div>
            )}
        </div>
    );
};

export default PlaceSearch;