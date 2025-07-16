import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosinstance";
import { useNavigate } from "react-router-dom";
import '../../assets/styles/review/ocrModal.css';
import { showErrorAlert } from "../../utils/sweetAlert";

const OcrModal = ({ onClose ,restaurantId}) => {
  console.log(restaurantId)
  //const restaurantId = 21;
  const [isMobile, setIsMobile] = useState(false);
  const [preview, setPreview] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    const checkMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    setIsMobile(checkMobile);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    axiosInstance
      .post(`/reviews/ocr/${restaurantId}` , formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        setOcrResult(res.data);
      })
      .catch((err) => {
        console.error("OCR 실패", err);
        showErrorAlert("OCR 실패", "다시 시도해주세요.");
      })
      .finally(() => setLoading(false));
  };

  const handleGoToReview = () => {
    if (!ocrResult) return;
    nav("/review", { state: {...ocrResult , restaurantId} }); // 리뷰 페이지로 OCR 데이터 전달
    onClose(); // 모달 닫기
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>✖</button>
        <h3>📄 영수증 인증</h3>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          {...(isMobile ? { capture: "environment" } : {})}
        />

        {preview && (
          <div className="preview-area">
            <img src={preview} alt="미리보기" width="300" />
          </div>
        )}

        {loading && <p>🔍 OCR 분석 중...</p>}

        {ocrResult && (
          <div className="ocr-result">
            <p>📌 식당명: {ocrResult.restaurantName}</p>
            <p>📅 방문일자: {ocrResult.visitDate}</p>
          </div>
        )}

        <button
          className="submit-button"
          onClick={handleGoToReview}
          disabled={!ocrResult}
        >
          리뷰 작성하러 가기
        </button>
      </div>
    </div>
  );
};

export default OcrModal;
