

import '../../assets/styles/mapSearch/categoryFilterBar.css';
const CategoryFilterBar = ({ category, setCategory }) => {
  const categories = ['전체', '한식', '중식', '양식', '일식', '카페'];
  return (
    <div className="category-filter-bar">
      {categories.map((c) => (
        <button
          key={c}
          className={category === c ? 'active' : ''}
          onClick={() => setCategory(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
};
export default CategoryFilterBar;