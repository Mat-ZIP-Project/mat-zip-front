import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MyPageTest = () => {
    const { userInfo } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const handleLocalAuth = () => {
        navigate('/local-auth');
    };
    return (
        <div style={{ padding: '2rem' }}>
            <h1>마이페이지</h1>
            <div style={{ marginTop: '1rem' }}>
                <p><strong>이름:</strong> {userInfo?.name}</p>
                <p><strong>아이디:</strong> {userInfo?.userId}</p>
                <p><strong>권한:</strong> {userInfo?.role}</p>
            </div>
            <div style={{ marginTop: '2rem' }}>
                <h2>내 활동</h2>
                <button
                    onClick={handleLocalAuth}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#FF5722',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    현지인 인증하기
                </button>
            </div>
        </div>
    );
};

export default MyPageTest;