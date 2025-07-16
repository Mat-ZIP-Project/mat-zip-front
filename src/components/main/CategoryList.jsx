import React from "react";
import CategoryItem from "./CategoryItem";
import "../../assets/styles/common/Category.css";

const CATEGORY_LIST = [
  { name: "한식", img: "https://matzip-kosta295.s3.ap-northeast-2.amazonaws.com/assets/icon/%ED%95%9C%EC%8B%9D_1.png" },
  { name: "중식", img: "https://matzip-kosta295.s3.ap-northeast-2.amazonaws.com/assets/icon/%EC%A4%91%EC%8B%9D_1.png" },
  { name: "일식", img: "https://matzip-kosta295.s3.ap-northeast-2.amazonaws.com/assets/icon/%EC%9D%BC%EC%8B%9D_1.png" },
  { name: "양식", img: "https://matzip-kosta295.s3.ap-northeast-2.amazonaws.com/assets/icon/%EC%96%91%EC%8B%9D_1.png" },
  { name: "카페", img: "https://matzip-kosta295.s3.ap-northeast-2.amazonaws.com/assets/icon/%EC%B9%B4%ED%8E%98_1.png" },
];

const CategoryList = () => (
  <div className="category-list">
    {CATEGORY_LIST.map((cat) => (
      <CategoryItem key={cat.name} name={cat.name} img={cat.img} />
    ))}
  </div>
);

export default CategoryList;