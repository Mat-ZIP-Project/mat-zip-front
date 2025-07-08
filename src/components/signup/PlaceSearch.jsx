import React, { useState, useCallback } from 'react';
import styles from '../../assets/styles/signup/PlaceSearch.module.css';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';

/** 식당명 주소 검색 컴포넌트 
 *  - 카카오맵 API를 사용하여 식당명으로 주소 검색
 *  - 식당 선택시 주소와 지역 정보를 파싱하여 상위 컴포넌트로 전달 (위도, 경도 정보 포함)
 */
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
        let allResults = [];

        // 첫 번째 페이지 검색
        places.keywordSearch(searchKeyword + ' 식당', (data, status, pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
                // 식당/카페 관련 결과만 필터링
                const filteredData = data.filter(place => 
                    place.category_name.includes('음식점') || 
                    place.category_name.includes('카페') ||
                    place.category_name.includes('식당')
                );
                
                allResults = [...allResults, ...filteredData];

                // 다음 페이지가 있고, 결과가 60개 미만이면 추가 검색
                if (pagination.hasNextPage && allResults.length < 60) {
                    pagination.nextPage();
                } else {
                    const finalResults = allResults.slice(0, 60); //가져올 개수
                    setSearchResults(finalResults);
                    setIsSearching(false);
                    
                    if (finalResults.length === 0) {
                        alert('검색된 식당이 없습니다. 다른 키워드로 검색해보세요.');
                    }
                }
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                setIsSearching(false);
                alert('검색된 식당이 없습니다. 다른 키워드로 검색해보세요.');
                setSearchResults([]);
            } else {
                setIsSearching(false);
                alert('검색에 실패했습니다. 다시 시도해주세요.');
                setSearchResults([]);
            }
        }, {
            page: 1,
            size: 15 // 한 페이지당 15개씩
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

    // 엔터키 검색 처리
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            
            // 검색 중이 아니고 키워드가 있을 때만 검색 실행
            if (!isSearching && searchKeyword.trim()) {
                handlePlaceSearch();
            }
        }
    }, [handlePlaceSearch, isSearching, searchKeyword]);

    return (
        <div className={styles.container}>
            <div className={styles.searchGroup}>
                <FormInput
                    name="placeSearch"
                    type="text"
                    placeholder="식당명을 입력하여 검색하세요"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyPress={handleKeyDown}
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