import { getToken } from "firebase/messaging";
import { messaging } from "./FcmSetting";
import { axiosInstance, adminAxiosInstance } from "./axiosinstance";

/**
 *  FCM 토큰 발급, 알림 권한 요청, 서비스 워커 등
 *  알림 처리 담당
 */

/**
 *  서비스 워커 등록 요청을 하는 코드
 */
async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log("Service Worker 등록 성공 : ", registration);

      await navigator.serviceWorker.ready;
      console.log("Service Worker가 활성 상태이며, 페이지 시작합니다...");
      return registration;
    } catch (error) {
      console.log("Service Worker 등록 실패 : ", error);
      throw error;
    }
  } else {
    console.warn("서비스 워커를 지원하지 않는 브라우저입니다.");
    throw new Error("서비스 워커를 지원하지 않는 브라우저입니다.");
  }
}

// Fcm 토큰을 백엔드 서버로 전송
async function sendTokenToServer(token) {
  const serverApiEndpoint = "/api/v1/fcm/registerToken";
  try {
    const response = await axiosInstance.post(serverApiEndpoint, {
      deviceToken: token,
    });
    console.log("토큰 서버 전송 성공:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("서버 응답 오류:", error.response.data);
      alert("서버 응답 오류: " + error.response.data.message);
    }
    throw error;
  }
}

async function getDeviceToken() {
  try {
    const vapidKey = import.meta.env.VITE_VAPIDKEY;

    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log("Fcm 토큰 가져오기 성공:", currentToken);

      await sendTokenToServer(currentToken);

      return currentToken;
    } else {
      console.log(
        "Fcm 토큰을 가져올 수 없습니다. 사용자가 알림 권한을 거부했을 수 있습니다."
      );
      alert(
        "Fcm 토큰을 가져올 수 없습니다. 사용자가 알림 권한을 거부했을 수 있습니다."
      );
      return null;
    }
  } catch (error) {
    console.error("Fcm 토큰 가져오기 실패:", error);
    alert("Fcm 토큰 가져오기 실패: " + error.message);
    throw error;
  }
}

export async function handleNotification() {
  try {
    // 알림 권한 요청
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.error("알림 권한이 거부되었습니다.");
      return;
    }
    console.log("알림 권한이 허용되었습니다.");

    // 서비스 워커 등록 및 활성화 대기
    await registerServiceWorker();

    // FCM 토큰 가져오기
    await getDeviceToken();
  } catch (error) {
    console.error("알림 처리 중 오류 발생:", error);
  }
}
