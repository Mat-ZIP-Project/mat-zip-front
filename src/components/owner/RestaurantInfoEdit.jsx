import React, { useState, useRef } from 'react';
import { ownerApi } from '../../api/ownerApi';
import BlackButton from './BlackButton';
import PlaceSearch from '../signup/PlaceSearch';
import FormInput from '../common/FormInput';
import styles from '../../assets/styles/owner/RestaurantInfoEdit.module.css';
import { showErrorAlert, showSuccessAlert } from '../../utils/sweetAlert';
import { formatters } from '../../utils/formatters';

const CATEGORY_OPTIONS = ['한식', '중식', '일식', '양식', '카페'];

const RestaurantInfoEdit = ({ info, onComplete, onCancel }) => {
  const refs = {
    restaurantName: useRef(),
    address: useRef(),
    phone: useRef(),
    category: useRef(),
    openTime: useRef(),
    closeTime: useRef(),
    maxWaitingLimit: useRef(),
    descript: useRef(),
  };

  const [form, setForm] = useState({
    restaurantName: info.restaurantName || '',
    address: info.address || '',
    regionSido: info.regionSido || '',
    regionSigungu: info.regionSigungu || '',
    latitude: info.latitude || '',
    longitude: info.longitude || '',
    phone: info.phone || '',
    category: info.category || '',
    openTime: info.openTime || '',
    closeTime: info.closeTime || '',
    maxWaitingLimit: info.maxWaitingLimit || '',
    descript: info.descript || '',
  });
  const [errors, setErrors] = useState({});
  const [phoneStatus, setPhoneStatus] = useState({ valid: false, message: '' });

  // 주소 검색 결과 반영
  const handlePlaceSelect = (placeData) => {
    setForm(prev => ({
      ...prev,
      restaurantName: placeData.restaurantName,
      address: placeData.address,
      regionSido: placeData.regionSido,
      regionSigungu: placeData.regionSigungu,
      latitude: placeData.latitude,
      longitude: placeData.longitude,
    }));
    setErrors(prev => ({
      ...prev,
      restaurantName: '',
      address: '',
      regionSido: '',
      regionSigungu: '',
      latitude: '',
      longitude: '',
    }));
  };

  // 전화번호 실시간 검증
  const validatePhone = (value) => {
    const numbers = value.replace(/-/g, '');
    // 02-000-0000 형태 체크
    if (numbers.startsWith('02')) {
      if (!/^02-\d{3}-\d{4}$/.test(value)) {
        setPhoneStatus({ valid: false, message: '02 지역번호는 02-000-0000 형태여야 합니다.' });
        return;
      }
    } else {
      // 000-000-0000 형태 체크
      if (!/^\d{3}-\d{3}-\d{4}$/.test(value)) {
        setPhoneStatus({ valid: false, message: '연락처는 000-000-0000 형태여야 합니다.' });
        return;
      }
    }
    setPhoneStatus({ valid: true, message: '사용 가능한 전화번호입니다.' });
  };

  // 필드별 검증 함수
  const validate = (data) => {
    const newErrors = {};
    if (!data.restaurantName.trim()) newErrors.restaurantName = '식당명을 입력해주세요';
    if (!data.address.trim()) newErrors.address = '주소를 입력해주세요';
    if (!data.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요';
    } else {
      // 02 지역번호
      if (data.phone.startsWith('02')) {
        if (!/^02-\d{3}-\d{4}$/.test(data.phone)) {
          newErrors.phone = '02 지역번호는 02-000-0000 형태여야 합니다.';
        }
      } else {
        if (!/^\d{3}-\d{3}-\d{4}$/.test(data.phone)) {
          newErrors.phone = '연락처는 000-000-0000 형태여야 합니다.';
        }
      }
    }
    if (!data.category) newErrors.category = '카테고리를 선택해주세요';
    if (!data.openTime) newErrors.openTime = '오픈 시간을 입력해주세요';
    if (!data.closeTime) newErrors.closeTime = '마감 시간을 입력해주세요';
    if (!data.maxWaitingLimit || Number(data.maxWaitingLimit) < 1) newErrors.maxWaitingLimit = '최대 웨이팅 제한을 입력해주세요';
    if (!data.descript.trim()) newErrors.descript = '식당 소개글을 입력해주세요';
    return newErrors;
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'phone') {
      newValue = formatters.restaurantPhone(value);
      validatePhone(newValue);
    }
    setForm(prev => ({ ...prev, [name]: newValue }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      if (refs[firstErrorField] && refs[firstErrorField].current) {
        refs[firstErrorField].current.focus();
      }
      showErrorAlert('필수 입력값을 모두 입력해주세요.');
      return;
    }
    try {
      await ownerApi.updateRestaurantInfo(form);
      showSuccessAlert('수정이 완료되었습니다!');
      if (onComplete) onComplete();
    } catch (err) {
      showErrorAlert('수정 실패');
    }
  };

  return (
    <form className={styles.editForm} onSubmit={handleSubmit}>
      <div className={styles.headerRow}>
        <span className={styles.title}>식당 정보 수정</span>
        <div className={styles.buttonRow}>
          <BlackButton type="submit">수정완료</BlackButton>
          <BlackButton type="button" onClick={onCancel}>취소</BlackButton>
        </div>
      </div>
      <div className={styles.formRow}>
        <label>식당명</label>
        <FormInput
          name="restaurantName"
          value={form.restaurantName}
          onChange={handleChange}
          error={errors.restaurantName}
          maxLength={50}
          placeholder="식당명을 입력하세요"
          ref={refs.restaurantName}
        />
      </div>
      <div className={styles.formRow}>
        <label>주소</label>
        <PlaceSearch onPlaceSelect={handlePlaceSelect} />
        <FormInput
          name="address"
          value={form.address}
          onChange={handleChange}
          error={errors.address}
          disabled
          placeholder="주소를 입력하세요"
          ref={refs.address}
        />
      </div>
      <div className={styles.formRow}>
        <label>연락처</label>
        <FormInput
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          error={errors.phone}
          maxLength={13}
          placeholder="ex) 02-1234-5678"
          ref={refs.phone}
        />
        {form.phone && (
          <span
            className={
              phoneStatus.valid
                ? styles.phoneMessageValid
                : styles.phoneMessageError
            }
          >
            {phoneStatus.valid ? (
              <>
                <span className={styles.checkIcon}>✔</span>
                {phoneStatus.message}
              </>
            ) : (
              phoneStatus.message
            )}
          </span>
        )}
      </div>
      <div className={styles.formRow}>
        <label>식당 카테고리</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={styles.input}
          ref={refs.category}
        >
          <option value="">카테고리 선택</option>
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {errors.category && (
          <span className={styles.errorMessage}>
            {errors.category}
          </span>
        )}
      </div>
      <div className={styles.formRow}>
        <label>오픈 시간</label>
        <FormInput
          name="openTime"
          type="time"
          value={form.openTime}
          onChange={handleChange}
          error={errors.openTime}
          ref={refs.openTime}
        />
      </div>
      <div className={styles.formRow}>
        <label>마감 시간</label>
        <FormInput
          name="closeTime"
          type="time"
          value={form.closeTime}
          onChange={handleChange}
          error={errors.closeTime}
          ref={refs.closeTime}
        />
      </div>
      <div className={styles.formRow}>
        <label>최대 웨이팅 팀 제한</label>
        <FormInput
          name="maxWaitingLimit"
          type="number"
          value={form.maxWaitingLimit}
          onChange={handleChange}
          error={errors.maxWaitingLimit}
          min={1}
          max={100}
          placeholder="최대 웨이팅 팀 수"
          ref={refs.maxWaitingLimit}
        />
      </div>
      <div className={styles.formRow}>
        <label>식당 소개글</label>
        <textarea
          name="descript"
          value={form.descript}
          onChange={handleChange}
          className={styles.textarea}
          rows={5}
          placeholder="식당 소개글을 입력하세요"
          ref={refs.descript}
        />
        {errors.descript && <span className={styles.errorMessage}>{errors.descript}</span>}
      </div>
    </form>
  );
};

export default RestaurantInfoEdit;