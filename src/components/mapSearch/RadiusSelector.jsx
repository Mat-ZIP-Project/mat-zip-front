
import '../../assets/styles/mapSearch/radiusSelector.css';
const RadiusSelector = ({ radius, setRadius }) => {
  const radii = [300, 1000, 3000];
  return (
    <div className="radius-selector">
      {radii.map((r) => (
        <button
          key={r}
          className={radius === r ? 'active' : ''}
          onClick={() => setRadius(r)}
        >
          {r >= 1000 ? r / 1000 + 'km' : r + 'm'}
        </button>
      ))}
    </div>
  );
};
export default RadiusSelector;