import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/common/Category.css";

const CategoryItem = ({ name, img }) => (
  <Link to={`/restaurants?category=${encodeURIComponent(name)}`} className="category-item">
    <div className="category-img">
      {img ? <img src={img} alt={name} /> : null}
    </div>
    <div className="category-name">{name}</div>
  </Link>
);

export default CategoryItem;