import { regionData } from './regionData';
import '../../assets/styles/mapSearch/regionSeletor.css';
import { useState } from 'react';

const RegionSelector = ({setSelectedSido,setSelectedSigungu,selectedSigungu,onSearch}) => {
  const [selectedSido, setLocalSelectedSido] = useState("");

  return (
    <div className="region-selector">
      <select value={selectedSido} onChange={(e)=>{
        setLocalSelectedSido(e.target.value);
        setSelectedSido(e.target.value);
        setSelectedSigungu("");
      }}>
        <option value="">시도 선택</option>
        {
          Object.keys(regionData).map((sido)=>(
            <option key={sido} value={sido}>{sido}</option>
          ))
        }
      </select>
      <select
        value={selectedSigungu}
        onChange={(e) => setSelectedSigungu(e.target.value)}
        disabled={!selectedSido}
      >
        <option value="">시군구 선택</option>
        {selectedSido&&
          regionData[selectedSido].map((sigungu)=>(
            <option key={sigungu} value={sigungu}>{sigungu}</option>
          ))
        }
      </select>
      <button
        className="region-search-btn"
         onClick={() => onSearch()}
        disabled={!selectedSido}
      >
        검색
      </button>
    </div>
  );
};
export default RegionSelector;