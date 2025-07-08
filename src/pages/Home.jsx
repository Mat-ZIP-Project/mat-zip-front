import React from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/restaurants");
    };

    return (
        <div>
            <h1>홈</h1>
            <button onClick={handleClick}>식당 보러가기</button>
        </div>
    );
};

export default Home;