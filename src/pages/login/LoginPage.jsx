import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosinstance.js';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice.js';
import styles from '../../assets/styles/pages/login/LoginPage.module.css';
import FormInput from '../../components/common/FormInput.jsx';
import FormButton from '../../components/common/FormButton.jsx'; 
import CheckboxWithLinks from '../../components/login/CheckboxWithLinks.jsx';
import inputStyles from '../../assets/styles/common/FormInput.module.css';
import FindIdModal from '../../components/login/FindIdModal.jsx';
import FindPasswordModal from '../../components/login/FindPasswordModal.jsx';


const Login = () => {
    const [formData, setForm] = useState({ userId: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showFindId, setShowFindId] = useState(false);
    const [showFindPw, setShowFindPw] = useState(false);

    // 아이디 저장
    useEffect(() => {
        const savedUserId = localStorage.getItem('rememberedUserId');   
        if (savedUserId) {
            setForm(prev => ({
                ...prev,
                userId: savedUserId
            }));
            setIsRememberMe(true);
        }}, []);

    // input 에 값이 입력될 때 상태 값 수정
    const changeValue = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        // 사용자가 값입력시 에러 제거
        if (value.trim().length > 0 && errors.general) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                delete newErrors.general;
                return newErrors;
            });
        }
    }, [errors.general]);

    // 아이디 저장 체크박스 변경 핸들러
    const handleRememberMeChange = useCallback((e) => {
        const checked = e.target.checked;
        setIsRememberMe(checked);
        
        if (!checked) {
            localStorage.removeItem('rememberedUserId');
        }
    }, []);
    
    // 폼 검증 함수
    const validateForm = useCallback(() => {
        const newErrors = {};
        
        if (!formData.userId.trim()) {
            newErrors.userId = '아이디를 입력해주세요';
        }
        
        if (!formData.password.trim()) {
            newErrors.password = '비밀번호를 입력해주세요';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        setErrors({});

        try {
            const { data } = await axiosInstance({
                method: "POST",
                url: "/login",
                data: formData,
            });

            // 로그인 성공 시 아이디 저장
            if (isRememberMe) {
                localStorage.setItem('rememberedUserId', formData.userId);
            } else {
                localStorage.removeItem('rememberedUserId');
            }

            dispatch(setCredentials({
                accessToken: data.accessToken,
                user: data.user
            }));   

            navigate('/');    
        } catch (error) {
            console.error('로그인 에러:', error);
            const errorMessage = error.response?.data?.errMsg || '정보를 다시확인해주세요.';

            // 비밀번호만 초기화
            setForm(prev => ({
                ...prev,
                password: ''
            }));
            
            setErrors({ 
                general: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    }, [formData, isRememberMe, validateForm, dispatch, navigate]);

    // const helpLinks = [
    //     { text: '아이디 찾기', path: '/find-id' },
    //     { text: '비밀번호 찾기', path: '/find-password' }
    // ];

    const isFormValid = formData.userId.trim() && formData.password.trim();

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* 모달 컴포넌트 렌더링 */}
                <FindIdModal open={showFindId} onClose={() => setShowFindId(false)} />
                <FindPasswordModal open={showFindPw} onClose={() => setShowFindPw(false)} />

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <h1 className={styles.title}>로그인</h1>

                    <FormInput
                        name="userId" type="text"
                        placeholder="아이디를 입력해주세요"
                        value={formData.userId}
                        onChange={changeValue}
                        error={errors.userId}
                        autoComplete="username"
                        className={inputStyles.loginInput}
                    />

                    <FormInput
                        name="password" type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={formData.password}
                        onChange={changeValue}
                        error={errors.password}
                        autoComplete="current-password"
                        className={inputStyles.loginInput}
                    />

                    {errors.general && (
                        <div className={styles.errorAlert} key="login-error">
                            {errors.general}
                        </div>
                    )}

                    <CheckboxWithLinks
                        checked={isRememberMe}
                        onChange={handleRememberMeChange}
                        checkboxText="아이디 저장"
                        links={[
                            { text: '아이디 찾기', onClick: () => setShowFindId(true) },
                            { text: '비밀번호 찾기', onClick: () => setShowFindPw(true) }
                        ]}
                    />

                    <FormButton
                        type="submit" variant="primary"
                        loading={isLoading}
                        disabled={!isFormValid}
                    >
                        로그인
                    </FormButton>

                    <FormButton
                        type="button" variant="secondary"
                        onClick={() => navigate('/signup')}
                    >
                        회원가입
                    </FormButton>
                </form>
            </div>
        </div>
    );
};

export default Login;