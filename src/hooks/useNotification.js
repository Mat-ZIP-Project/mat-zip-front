import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setFeedback } from "../components/reservation/store/reservationSlice";

export const useNotification = () => {
  const [notificationPermission, setNotificationPermission] = useState(
    Notification.permission
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setNotificationPermission(Notification.permission);
  }, []);

  const handleNotificationRequest = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === "granted") {
        dispatch(
          setFeedback({
            message: "알림 허용되었습니다.",
            isSuccess: true,
          })
        );
      } else {
        dispatch(
          setFeedback({ message: "알림 거부되었습니다.", isSuccess: false })
        );
      }
    } catch (error) {
      console.error("알림 설정 실패", error);
    }
  };

  return { notificationPermission, handleNotificationRequest };
};
