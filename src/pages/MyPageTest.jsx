import React from 'react';
import { useSelector } from 'react-redux';

const MyPageTest = () => {
    const { userInfo } = useSelector(state => state.auth);

    return (
        <div style={{ padding: '2rem' }}>
            <h1>마이페이지</h1>
            <div style={{ marginTop: '1rem' }}>
                <p><strong>이름:</strong> {userInfo?.name}</p>
                <p><strong>아이디:</strong> {userInfo?.userId}</p>
                <p><strong>권한:</strong> {userInfo?.role}</p>
            </div>
        </div>
    );
};

export default MyPageTest;