import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import ReservationPopup from "./components/reservation/ReservationPopup";

function App() {
  return (
    <div className="App">
      {" "}
      {/* 최상위 div로 감싸는 것이 좋습니다. */}
      <h1>mat-zip!!</h1> {/* 제목 */}
      <nav
        style={{
          padding: "10px",
          borderBottom: "1px solid #ccc",
          marginBottom: "20px",
        }}
      >
        <Link
          to="/"
          style={{ marginRight: "15px", textDecoration: "none", color: "blue" }}
        >
          홈
        </Link>
        <Link
          to="/reservation"
          style={{
            textDecoration: "none",
            color: "blue",
            border: "1px solid black",
          }}
        >
          예약하기
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<h2>환영합니다!</h2>} /> {/* 기본 경로 */}
        <Route path="/reservation" element={<ReservationPopup />} />{" "}
        {/* 예약 팝업 경로 */}
        {/* 필요에 따라 다른 경로들을 여기에 추가할 수 있습니다. */}
      </Routes>
    </div>
  );
}

export default App;
