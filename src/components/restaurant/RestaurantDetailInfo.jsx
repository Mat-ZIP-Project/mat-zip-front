import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/restaurant/RestaurantDetailInfo.css";

const RestaurantDetailInfo = ({ data }) => {
  const {
    restaurantName,
    address,
    avg_rating,
    avg_rating_local,
    phone,
    category,
    descript,
    openTime,
    closeTime,
  } = data;

  useEffect(() => {
    console.log("식당 데이터 확인:", data);
  }, [data]);

  return (
    <div className="restaurant-detail-info">
      <h1>{restaurantName}</h1>
      {descript && <p>{descript}</p>}

      <p>📍 주소: {address}</p>
      <p>
        ⭐ 평균 별점:{" "}
        {avg_rating !== null && avg_rating !== undefined
          ? avg_rating
          : "정보 없음"}{" "}
        / 지역 별점:{" "}
        {avg_rating_local !== null && avg_rating_local !== undefined
          ? avg_rating_local
          : "정보 없음"}
      </p>
      <p>🍽️ 카테고리: {category}</p>
      {phone && <p>📞 연락처: {phone}</p>}
      <div className="info-row">
        {typeof openTime === "string" && typeof closeTime === "string" ? (
          <p>
            🕒 영업시간: {openTime.slice(0, 5)} - {closeTime.slice(0, 5)}
          </p>
        ) : (
          <p>🕒 영업시간 정보 없음</p>
        )}

        <Link
          to={`/reservation/${data.restaurantId}`}
          className="restaurant-reservation-button inline"
        >
          예약하기
        </Link>
      </div>
    </div>
  );
};

export default RestaurantDetailInfo;
