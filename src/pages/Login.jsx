import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosinstance';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import styles from '../assets/styles/pages/Login.module.css';
import FormInput from '../components/login/FormInput';
import FormButton from '../components/login/FormButton'; 
import CheckboxWithLinks from '../components/login/CheckboxWithLinks.jsx';

const Login = () => {
    const [formData, setForm] = useState({ userId: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 아이디 저장
    useEffect(() => {
        const savedUserId = localStorage.getItem('rememberedUserId');
        if (savedUserId) {
            setForm(prev => ({
                ...prev,
                userId: savedUserId
            }));
            setIsRememberMe(true);
        }
    }, []);

    // input 에 값이 입력될 때 상태 값 수정
    const changeValue = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        // 입력 시 해당 필드 에러 제거
        setErrors(prev => {
            if (prev[name] || prev.general) {
                const newErrors = { ...prev };
                delete newErrors[name];
                delete newErrors.general;
                return newErrors;
            }
            return prev;
        });
    }, []);

    // 아이디 저장 체크박스 변경 핸들러
    const handleRememberMeChange = useCallback((e) => {
        const checked = e.target.checked;
        setIsRememberMe(checked);
        
        // 체크 해제 시 저장된 아이디 삭제
        if (!checked) {
            localStorage.removeItem('rememberedUserId');
        }
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("로그인 정보: ", formData);

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

            // accessToken과 user 정보 Redux에 저장
            dispatch(setCredentials({
                accessToken: data.accessToken,
                user: data.user
            }));   

            navigate('/');    
        } catch (error) {
            console.error('로그인 에러:', error);
            const errorMessage = error.response?.data?.errMsg || '아이디 또는 비밀번호가 올바르지 않습니다.';
            
            // 에러 발생 시 비밀번호 초기화
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
    };

    const helpLinks = [
        { text: '아이디 찾기', path: '/find-id' },
        { text: '비밀번호 찾기', path: '/find-password' }
    ];

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h1 className={styles.title}>로그인</h1>

                    <FormInput
                        name="userId" type="text"
                        placeholder="아이디를 입력해주세요"
                        value={formData.userId}
                        onChange={changeValue}
                        error={errors.userId}
                        autoComplete="username"
                    />

                    <FormInput
                        name="password" type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={formData.password}
                        onChange={changeValue}
                        error={errors.password}
                        autoComplete="current-password"
                    />

                    {errors.general && (
                        <div className={styles.errorAlert}>
                            {errors.general}
                        </div>
                    )}

                    <CheckboxWithLinks
                        checked={isRememberMe}
                        onChange={handleRememberMeChange}
                        checkboxText="아이디 저장"
                        links={helpLinks}
                    />

                    <FormButton
                        type="submit" variant="primary"
                        loading={isLoading}
                        disabled={!formData.userId && !formData.password}
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