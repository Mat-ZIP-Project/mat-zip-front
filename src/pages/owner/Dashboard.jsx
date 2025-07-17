import React, { useEffect, useState } from "react";
import { Line, Bar, Doughnut, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ownerApi } from "../../api/ownerApi";
import styles from "../../assets/styles/pages/owner/Dashboard.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Dashboard 컴포넌트 - REST API 호출에 사용할 식당 ID 필요
 */
const Dashboard = ({ restaurantId }) => {
  // --- 1) 날짜 범위 선택 ---
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  });
  const [toDate, setToDate] = useState(new Date());

  // --- 2) 차트용 상태 ---
  const [dailyStats, setDailyStats] = useState(null); // 일별 예약·매출
  const [monthlyRevenueData, setMonthlyRevenueData] = useState(null); // 월별 매출
  const [monthlyReservationData, setMonthlyReservationData] = useState(null); // 월별 예약 건수
  const [reviewSummary, setReviewSummary] = useState(null); // 리뷰 요약
  const [loading, setLoading] = useState(false);

  // 예약 건수 차트 모드: 'daily' 또는 'monthly'
  const [reservationMode, setReservationMode] = useState("daily");
  // 매출 차트 모드: 'daily' 또는 'monthly'
  const [revenueMode, setRevenueMode] = useState("daily");

  // 날짜 포맷 함수 (YYYY-MM-DD → YYYY.MM.DD)
  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  // --- 3) 일별 예약/매출/리뷰 가져오기 ---
  const fetchDailyAndReview = async () => {
    console.log("🔍 fetchDailyAndReview 호출", {
      restaurantId,
      fromDate,
      toDate,
    });
    setLoading(true);
    try {
      const from = fromDate.toISOString().split("T")[0];
      const to = toDate.toISOString().split("T")[0];
      // Promise.all 로 병렬 호출
      const [{ data: daily }, { data: review }] = await Promise.all([
        ownerApi.getDailyStats({ restaurantId, from, to }),
        ownerApi.getReviewSummary({ restaurantId, from, to }),
      ]);
      // daily: [{ date, reservationCount, revenue }, ...]
      setDailyStats(daily);
      setReviewSummary(review);
    } catch (e) {
      console.error("fetchDailyAndReview 에러", e);
    } finally {
      setLoading(false);
    }
  };

  // --- 4) 월별 매출 가져오기 ---
  const fetchMonthlyRevenue = async () => {
    console.log("🔍 fetchMonthlyRevenue 호출", { restaurantId, revenueMode });
    try {
      // 최근 6개월의 월별 매출 데이터
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const from = start.toISOString().split("T")[0];
      const to = now.toISOString().split("T")[0];
      const { data: monthly } = await ownerApi.getMonthlyStats({
        restaurantId,
        from,
        to,
      });
      // monthly: [{ year, month, reservationCount, revenue }, ...]
      const monthLabels = monthly.map(
        (m) => `${m.year}-${String(m.month).padStart(2, "0")}`
      );
      //–– 월별 매출 데이터 세팅
      const revenues = monthly.map((m) => m.revenue);
      setMonthlyRevenueData({
        labels: monthLabels,
        datasets: [
          {
            label: "매출",
            data: revenues,
            borderColor: "#FF6B35",
            backgroundColor: "transparent",
            fill: false,
          },
        ],
      });
      //–– 월별 예약 건수 데이터 세팅
      const reservationCounts = monthly.map((m) => m.reservationCount);
      setMonthlyReservationData({
        labels: monthLabels,
        datasets: [
          {
            label: "월별 예약 건수",
            data: reservationCounts,
            backgroundColor: [
              "#FF6B35",
              "#FF8A50",
              "#FFA76A",
              "#FFD494",
              "#FFEBBB",
              "#FFF3DD",
            ],
          },
        ],
      });
    } catch (e) {
      console.error("fetchMonthlyRevenue 에러", e);
    }
  };

  // 식당 ID 또는 날짜 변경 시 일별/리뷰 재조회
  useEffect(() => {
    console.log("▶️ Dashboard useEffect 실행", { restaurantId });
    if (restaurantId) {
      fetchDailyAndReview();
    }
  }, [restaurantId, fromDate, toDate]);

  // 매출 모드가 monthly 로 바뀔 때만 월별 매출 호출
  useEffect(() => {
    if (restaurantId && revenueMode === "monthly") {
      fetchMonthlyRevenue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId, revenueMode]);

  // 예약 건수 모드가 monthly 로 바뀔 때만 월별 예약도 호출
  useEffect(() => {
    if (restaurantId && reservationMode === "monthly") {
      fetchMonthlyRevenue();
    }
  }, [restaurantId, reservationMode]);

  // 로딩 또는 데이터 준비 전 상태 처리
  if (
    loading ||
    !dailyStats ||
    !reviewSummary ||
    (revenueMode === "monthly" && !monthlyRevenueData)
  ) {
    return <div>⌛ 통계 데이터를 불러오는 중...</div>;
  }

  // 일별 차트용 데이터
  const dates = dailyStats.map((d) => d.date);
  const reservationCounts = dailyStats.map((d) => d.reservationCount);
  const dailyRevenues = dailyStats.map((d) => d.revenue);

  return (
    <div className={styles.ownerDashboard}>
      {/* 날짜 선택 영역 */}
      <div className={styles.datePickers}>
        <div className={styles.datePickerBox}>
          <DatePicker
            selected={toDate}
            onChange={setToDate}
            dateFormat="yyyy.MM.dd"
            className={styles.dateInput}
            popperPlacement="bottom"
          />
          <span className={styles.dateLabel}>~</span>
          <DatePicker
            selected={fromDate}
            onChange={setFromDate}
            dateFormat="yyyy.MM.dd"
            className={styles.dateInput}
          />
        </div>
      </div>

      {/* 1) 예약 건수 - 일별/월별 토글 */}
      <div className={styles.chartContainer}>
        <div className={styles.chartTitle}>
          <h3>예약 건수</h3>
          <div className={styles.toggleButtons}>
            <button
              onClick={() => setReservationMode("daily")}
              className={reservationMode === "daily" ? styles.activeButton : ""}
            >
              일별
            </button>
            <button
              onClick={() => setReservationMode("monthly")}
              className={reservationMode === "monthly" ? styles.activeButton : ""}
            >
              월별
            </button>
          </div>
        </div>
        {reservationMode === "daily" ? (
          <Bar
            data={{
              labels: dailyStats.map((d) => d.date),
              datasets: [
                {
                  label: "예약 건수",
                  data: dailyStats.map((d) => d.reservationCount),
                  backgroundColor: "rgba(255, 107, 53, 0.9)",
                },
              ],
            }}
            options={{ responsive: true }}
          />
        ) : (
          // 월별 예약 건수 차트
          monthlyReservationData && monthlyReservationData.labels ? (
            <Pie
              //data={monthlyReservationData}
              data={{
                  ...monthlyReservationData,
                  datasets: [
                    {
                      ...monthlyReservationData.datasets[0],
                      backgroundColor: [
                        "#FFF3DD",
                        "#FFEBBB",
                        "#FFD494",
                        "#FFA76A",
                        "#FF8A50",
                        "#FF6B35",
                      ],},],}}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "right" },
                  title: { display: true, text: "최근 6개월 예약 비중" },
                },
              }}
            />
          ) : (
            <div>월별 예약 데이터가 없습니다.</div>
          )
        )}
      </div>

      {/* 2) 매출 선형차트 - 일별/월별 토글 */}
      <div className={styles.chartContainer}>
        <div className={styles.chartTitle}>
          <h3>매출액</h3>
          <div className={styles.toggleButtons}>
            <button
              onClick={() => setRevenueMode("daily")}
              className={revenueMode === "daily" ? styles.activeButton : ""}
            >
              일별
            </button>
            <button
              onClick={() => setRevenueMode("monthly")}
              className={revenueMode === "monthly" ? styles.activeButton : ""}
            >
              월별
            </button>
          </div>
        </div>
        {revenueMode === "daily" ? (
          <Line
            data={{
              labels: dates,
              datasets: [
                {
                  label: "매출",
                  data: dailyRevenues,
                  borderColor: "#FF6B35",
                  backgroundColor: "transparent",
                  fill: false,
                },
              ],
            }}
            options={{
              responsive: true,
              scales: {
                x: { title: { display: true, text: "날짜" } },
                y: { title: { display: true, text: "매출액" } },
              },
            }}
          />
        ) : (
          // 월별 매출 차트
          monthlyRevenueData && monthlyRevenueData.labels ? (
            <Line
              data={monthlyRevenueData}
              options={{
                responsive: true,
                scales: {
                  x: { title: { display: true, text: "월" } },
                  y: { title: { display: true, text: "매출액" } },
                },
              }}
            />
          ) : (
            <div>월별 매출 데이터가 없습니다.</div>
          )
        )}
      </div>

      {/* 3) 리뷰 통계 도넛차트 */}
      <div className={styles.chartContainer}>
        <h3>리뷰 통계 (총 {reviewSummary.totalReviews}건)</h3>
        <Doughnut
          data={{
            labels: ["일반 리뷰", "현지인 리뷰"],
            datasets: [
              {
                data: [
                  reviewSummary.totalReviews - reviewSummary.localReviews,
                  reviewSummary.localReviews,
                ],
                backgroundColor: ["#FFCE56", "rgba(255, 99, 132, 0.8)"],
              },
            ],
          }}
          options={{ responsive: true }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
