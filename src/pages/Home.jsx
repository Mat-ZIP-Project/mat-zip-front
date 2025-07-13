import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/common/Carousel';
import mainBannerList from '../data/mainBannerList';
import CategoryList from '../components/common/CategoryList';

const Home = () => {
    return (
        <div>
            {/* 배너 */}
            <Carousel
                items={mainBannerList}
                width={580} height={280}
                showText={true}
                autoSlide={true}
                showIndex={true}
                />

            {/* 카테고리 */}
            <CategoryList />
            <Link to="/restaurants?category=한식">한식</Link> <br/>
            <Link to="/restaurants?category=중식">중식</Link> <br/>
            <Link to="/restaurants?category=일식">일식</Link> <br/>
            <Link to="/restaurants?category=양식">양식</Link> <br/>
            <Link to="/restaurants?category=카페">카페</Link> <br/>
        </div>
    );
};

export default Home;