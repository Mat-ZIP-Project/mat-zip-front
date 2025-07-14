import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';
import styles from '../../assets/styles/login/FindPasswordModal.module.css';
import { showErrorAlert, showErrorConfirmAlert, showSuccessAlert } from '../../utils/sweetAlert';
import { formatters } from '../../utils/formatters';
import axiosInstance from '../../api/axiosinstance';

const TIMER_SEC = 300; // 5분

const passwordValid = (pw) => {
  // 10자리 이상, 2종류 이상(대소문자/숫자/특수문자)
  const lengthValid = pw.length >= 10;
  const types = [
    /[A-Z]/.test(pw),
    /[a-z]/.test(pw),
    /[0-9]/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ];
  const typeCount = types.filter(Boolean).length;
  return lengthValid && typeCount >= 2;
};

const FindPasswordModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [idError, setIdError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [timer, setTimer] = useState(TIMER_SEC);
  const [timerActive, setTimerActive] = useState(false);
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwCheckError, setPwCheckError] = useState('');
  const [pwValid, setPwValid] = useState(false);
  const [pwMatch, setPwMatch] = useState(null);
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

  // 아이디/휴대폰번호 입력
  const handleIdChange = (e) => {
    setUserId(e.target.value.trim());
    setIdError('');
  };
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

  // 1단계: 정보 매칭 검증
  const handleValidateInfo = async () => {
    if (!userId) {
      setIdError('아이디를 입력하세요.');
      return;
    }
    if (!phone || phone.replace(/-/g, '').length !== 11) {
      setPhoneError('휴대폰번호를 정확히 입력하세요.');
      return;
    }
    try {
      const res = await axiosInstance.post('/auth/find-password/validate', { userId, phone });
      // 성공 시 인증번호 발송
      await axiosInstance.post('/auth/find-password/sms/send', { userId, phone });
      showSuccessAlert('인증번호가 발송되었습니다.');
      setStep(2);
      setTimer(TIMER_SEC);
      setTimerActive(true);
    } catch (err) {
      showErrorConfirmAlert('아이디와 휴대폰번호가 일치하지 않습니다.', '입력하신 정보를 확인해주세요.');
    }
  };

  // 2단계: 인증번호 검증
  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setCodeError('인증번호 6자리를 입력하세요.');
      return;
    }
    try {
      await axiosInstance.post('/signup/sms/verify', { phone, code, purpose: 'PASSWORD_RESET' });
      showSuccessAlert('인증에 성공했습니다.');
      setStep(3); // 비밀번호 재설정 단계로 이동
      setTimerActive(false);
    } catch (err) {
      setCodeError('인증 실패');
    }
  };

  // 3단계: 비밀번호 재설정
  const handlePwChange = (e) => {
    const value = e.target.value;
    setPw(value);
    setPwValid(passwordValid(value));
    setPwError('');
    setPwMatch(value && pwCheck ? value === pwCheck : null); // 실시간 일치 여부 체크
  };

  // 비밀번호 확인 입력 변경
  const handlePwCheckChange = (e) => {
    const value = e.target.value;
    setPwCheck(value);
    setPwCheckError('');
    setPwMatch(pw ? pw === value : null); // 실시간 일치 여부 체크
  };

  const handleResetPassword = async () => {
    if (!pwValid) {
      setPwError('비밀번호 조건을 확인하세요.');
      return;
    }
    if (pw !== pwCheck) {
      setPwCheckError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      await axiosInstance.post('/auth/find-password/reset', { userId, phone, newPassword: pw });
      showSuccessAlert('비밀번호가 변경되었습니다.');
      setStep(4);
    } catch (err) {
      showErrorAlert('비밀번호 변경 실패');
    }
  };

  // 모달 닫기 시 상태 초기화
  const handleClose = () => {
    setStep(1);
    setUserId('');
    setPhone('');
    setIdError('');
    setPhoneError('');
    setCode('');
    setCodeError('');
    setPw('');
    setPwCheck('');
    setPwError('');
    setPwCheckError('');
    setPwValid(false);
    setTimer(TIMER_SEC);
    setTimerActive(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="비밀번호 찾기" width={380}>
      <div className={styles.container}>
        {step === 1 && (
          <>
            <div className={styles.infoText}>아이디와 휴대폰번호를 입력하세요.</div>
            <FormInput
              name="userId"
              value={userId}
              onChange={handleIdChange}
              placeholder="아이디 입력"
              error={idError}
              maxLength={30}
            />
            <FormInput
              name="phone"
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="휴대폰번호 입력 (예: 010-1234-5678)"
              error={phoneError}
              maxLength={13}
            />
            <FormButton type="button" onClick={handleValidateInfo} className={styles.button}>
              인증번호 발송
            </FormButton>
          </>
        )}
        {step === 2 && (
          <>
            <div className={styles.infoText}>
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
          <>
          <div className={styles.infoText}>새로운 비밀번호를 설정하세요.</div>
            <FormInput
              name="pw"
              type="password"
              value={pw}
              onChange={handlePwChange}
              placeholder="새 비밀번호 입력"
              error={pwError}
              maxLength={30}
            />
            <div
              className={
                pw
                  ? pwValid
                    ? styles.pwMessageValid
                    : styles.pwMessageError
                  : ''
              }
            >
              {pw && (
                pwValid ? (
                  <>
                    <span className={styles.checkIcon}>✔</span>
                    비밀번호는 최소 10자리, 영문 대소문자/숫자/특수문자 중 2종류 이상 조합해야 합니다.
                  </>
                ) : (
                  <>비밀번호는 최소 10자리, 영문 대소문자/숫자/특수문자 중 2종류 이상 조합해야 합니다.</>
                )
              )}
            </div>
            <FormInput
              name="pwCheck"
              type="password"
              value={pwCheck}
              onChange={handlePwCheckChange}
              placeholder="비밀번호 확인"
              error={pwCheckError}
              maxLength={30}
            />
            <div className={pwMatch === false ? styles.pwMatchError : pwMatch === true ? styles.pwMatchValid : ''}>
              {pwMatch === false && <span>비밀번호가 일치하지 않습니다.</span>}
              {pwMatch === true && <span className={styles.checkIcon}>✔ 비밀번호가 일치합니다.</span>}
            </div>
            <FormButton type="button" onClick={handleResetPassword} className={styles.button}>
              비밀번호 변경
            </FormButton>
          </>
        )}
        {step === 4 && (
          <div className={styles.resultBox}>
            <div className={styles.resultTitle}>비밀번호가 성공적으로 변경되었습니다.</div>
            <FormButton type="button" onClick={handleClose} className={styles.button}>
              닫기
            </FormButton>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FindPasswordModal;