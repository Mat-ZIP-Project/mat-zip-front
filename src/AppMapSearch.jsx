import React from 'react';
import { Route, Router } from 'react-router-dom';
import SearchMapPage from './pages/searchMap/SearchMapPage';
import './AppCourse.css';


const AppMapSearch = () => {
    return (
        <div className="app-wrapper">
            <div className="app-container">
            
            <SearchMapPage/>
           </div>
        </div>
    );
};

export default AppMapSearch;