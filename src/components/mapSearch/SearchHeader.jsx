
import '../../assets/styles/mapSearch/searchHeader.css';

const SearchHeader = () => {
  return (
    <div className="search-header">
      <input type="text" placeholder="식당 또는 지역 검색" />
      <button>검색</button>
    </div>
  );
};
export default SearchHeader;