export function formatTime(value) {
  if (!value) return "";
  // 배열 [19, 10] 형태
  if (Array.isArray(value)) {
    const [hh, mm] = value;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }
  // 객체 {hour: 19, minute: 10} 형태
  if (typeof value === "object" && value !== null) {
    if ('hour' in value && 'minute' in value) {
      const hh = String(value.hour).padStart(2, '0');
      const mm = String(value.minute).padStart(2, '0');
      return `${hh}:${mm}`;
    }
    if (value instanceof Date) {
      const hh = String(value.getHours()).padStart(2, '0');
      const mm = String(value.getMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    }
    return String(value);
  }
  // 문자열 "19,10" 또는 "19:10"
  if (typeof value === "string") {
    const parts = value.includes(",") ? value.split(",") : value.split(":");
    if (parts.length < 2) return value;
    const [hh, mm] = parts;
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  }
  // 숫자 (timestamp)
  if (typeof value === "number") {
    const d = new Date(value);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  return String(value);
}

// 날짜를 yyyy-mm-dd 형태로 변환하는 함수
export function formatDate(dateStr) {
  if (!dateStr) return "";
  if (dateStr instanceof Date) {
    const yyyy = dateStr.getFullYear();
    const mm = String(dateStr.getMonth() + 1).padStart(2, "0");
    const dd = String(dateStr.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  if (typeof dateStr === "number") {
    const d = new Date(dateStr);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  if (typeof dateStr !== "string") dateStr = String(dateStr);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  return dateStr.replace(/[.,\/]/g, "-");
}
