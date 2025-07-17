export const formatDateDisplay = (dateTimeArray) => {
    if (!dateTimeArray) return "날짜 미정";

    const year = dateTimeArray[0];
    const month = dateTimeArray[1] - 1; // 월은 0부터 시작 (0=1월, 11=12월)
    const day = dateTimeArray[2];
    const hours = dateTimeArray[3] || 0; // 시 정보가 없을 수 있으니 기본값 0
    const minutes = dateTimeArray[4] || 0; // 분 정보가 없을 수 있으니 기본값 0

    const date = new Date(year, month, day, hours, minutes);

    const formatData = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formatTime = date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${formatData} ${formatTime}`;
};
  
