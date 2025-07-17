import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';
import styles from '../../assets/styles/login/FindIdModal.module.css';
import { showErrorAlert, showErrorConfirmAlert, showSuccessAlert } from '../../utils/sweetAlert';
import { formatters } from '../../utils/formatters';
import axiosInstance from '../../api/axiosinstance';

const TIMER_SEC = 300; // 5분

const FindIdModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [timer, setTimer] = useState(TIMER_SEC);
  const [timerActive, setTimerActive] = useState(false);
  const [maskedId, setMaskedId] = useState('');
   const [fullId, setFullId] = useState('');
  const [showFullId, setShowFullId] = useState(false);
  const timerRef = useRef();

  // 타이머 관리
  React.useEffect(() => {
    if (!timerActive) return;
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerActive(false);
          setCodeError('인증 시간이 만료되었습니다.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  // 휴대폰번호 입력 및 유효성
  const handlePhoneChange = (e) => {
    const value = formatters.phone(e.target.value);
    setPhone(value);
    setPhoneError('');
  };

  // 인증번호 입력
  const handleCodeChange = (e) => {
    setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
    setCodeError('');
  };

  // 인증번호 발송
  const handleSendCode = async () => {
    if (!phone || phone.replace(/-/g, '').length !== 11) {
      setPhoneError('휴대폰번호를 정확히 입력하세요.');
      return;
    }
    try {
      await axiosInstance.post('/auth/find-id/sms/send', { phone });
      showSuccessAlert('인증번호가 발송되었습니다.', '5분 이내에 인증번호를 입력해주세요.');
      setStep(2);
      setTimer(TIMER_SEC);
      setTimerActive(true);
    } catch (err) {
      showErrorConfirmAlert('인증번호 발송 실패', '입력하신 휴대폰번호로 가입된 기록이 없습니다.');
    }
  };

  // 인증번호 검증
  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setCodeError('인증번호 6자리를 입력하세요.');
      return;
    }
    try {
      // 인증번호 검증
      await axiosInstance.post('/signup/sms/verify', { phone, code, purpose: 'ID_FIND' });
      // 인증 성공 시 아이디 마스킹 조회
      const idRes = await axiosInstance.post('/auth/find-id', { phone });
      setMaskedId(idRes.data.maskedUserId);
      setFullId(idRes.data.userId);
      setShowFullId(false);
      setStep(3);
      setTimerActive(false);
    } catch (err) {
      setCodeError('인증 실패');
    }
  };

  // 보기 버튼 클릭
  const handleShowFullId = () => {
    setShowFullId(true);
  };

  // 숨기기 버튼 클릭
  const handleHideFullId = () => {
    setShowFullId(false);
  };


  // 모달 닫기 시 상태 초기화
  const handleClose = () => {
    setStep(1);
    setPhone('');
    setPhoneError('');
    setCode('');
    setCodeError('');
    setMaskedId('');
    setFullId('');
    setShowFullId(false);
    setTimer(TIMER_SEC);
    setTimerActive(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="아이디 찾기" width={380}>
      <div className={styles.container}>
        {step === 1 && (
          <>
            <div className={styles.infoText}>회원님의 휴대폰번호를 입력해주세요.</div>
            <FormInput
              name="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="휴대폰번호 입력 (예: 010-1234-5678)"
              error={phoneError}
              maxLength={13}
            />
            <FormButton type="button" onClick={handleSendCode} className={styles.button}>
              인증번호 발송
            </FormButton>
          </>
        )}
        {step === 2 && (
          <>
            <div className={`${styles.infoText} ${styles.timerText}`}>
              인증번호가 발송되었습니다. (남은시간: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')})
            </div>
            <FormInput
              name="code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              placeholder="인증번호 6자리"
              error={codeError}
              maxLength={6}
            />
            <FormButton type="button" onClick={handleVerifyCode} className={styles.button}>
              인증번호 확인
            </FormButton>
          </>
        )}
        {step === 3 && (
          <div className={styles.resultBox}>
            <div className={styles.resultTitle}>회원님의 아이디</div>
            <div className={styles.resultId}>
              {showFullId
                ? fullId
                : maskedId
                  ? (
                    <>
                      {maskedId}
                      <button
                        type="button"
                        className={styles.showIdButton}
                        onClick={handleShowFullId}
                        style={{ marginLeft: 8, fontSize: 12 }}
                      >
                        보기
                      </button>
                    </>
                  )
                  : <span className={styles.emptyId}>아이디를 찾을 수 없습니다.</span>
              }
              {showFullId && (
                <button
                  type="button"
                  className={styles.hideIdButton}
                  onClick={handleHideFullId}
                  style={{ marginLeft: 8, fontSize: 12 }}
                >
                  숨기기
                </button>
              )}
            </div>
            <FormButton type="button" onClick={handleClose} className={styles.button}>
              닫기
            </FormButton>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FindIdModal;