
import '../../assets/styles/mapSearch/resultList.css';
import RestaurantCard from './RestaurantCard';
const ResultList = ({restaurants,setMarkers}) => {
  console.log(restaurants);
  return (
    <div className="result-list">
      {restaurants.map((r)=>(<RestaurantCard 
      key={r.restaurntId} restaurant={r} onClick={""}/>))}
    </div>
  );
};
export default ResultList;