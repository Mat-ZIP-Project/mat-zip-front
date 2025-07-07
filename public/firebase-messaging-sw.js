/**
 * 서비스 워커 -> 푸시 알림을 처리하기 위한 것
 * 브라우저가 독립적으로 실행하는 JS 파일이라,  public 폴더에 위치
 * 실질적으로 알림의 띄어주는 코드
 */

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function () {
  console.log("fcm sw activate..");
});
self.addEventListener("push", function (e) {
  if (!e.data.json()) return;
  const resultData = e.data.json().notification;
  const notificationTitle = resultData.title;
  const notificationOptions = {
    body: resultData.body,
  };
  console.log(resultData.title, {
    body: resultData.body,
  });
  e.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});
