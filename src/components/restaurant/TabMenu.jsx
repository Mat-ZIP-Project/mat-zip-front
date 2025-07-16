import React from 'react';
import '../../assets/styles/restaurant/TabMenu.css';


const TabMenu = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'home', label: '홈' },
    { key: 'menu', label: '메뉴' },
    { key: 'review', label: '리뷰' },
    { key: 'localReview', label: '로컬 리뷰'}
  ];

  return (
    <div className="tab-menu">
      {tabs.map(tab => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? 'active' : ''}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabMenu;
