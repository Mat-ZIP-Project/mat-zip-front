
import '../../assets/styles/mapSearch/regionSeletor.css';

const RegionSelector = () => {
  return (
    <div className="region-selector">
      <select>
        <option>시도 선택</option>
      </select>
      <select>
        <option>시군구 선택</option>
      </select>
    </div>
  );
};
export default RegionSelector;