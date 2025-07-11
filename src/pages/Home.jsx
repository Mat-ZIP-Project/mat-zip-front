import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>홈</h1>
            <h2>음식 카테고리 선택</h2>
            <Link to="/restaurants?category=한식">한식</Link> <br/>
            <Link to="/restaurants?category=중식">중식</Link> <br/>
            <Link to="/restaurants?category=일식">일식</Link> <br/>
            <Link to="/restaurants?category=양식">양식</Link> <br/>
            <Link to="/restaurants?category=카페">카페</Link> <br/>
        </div>
    );
};

export default Home;