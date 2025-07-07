import "../../assets/styles/localAuth/authLogList.css";

export default function AuthLogList({ authLogs }) {
  return (
    <div className="auth-log-list">
      <h2 className="auth-log-title">인증 기록</h2>
      {authLogs.map((log, idx) => (
        <div key={idx} className="auth-log-item">
          {log.regionName} - {log.authCount}회 인증
        </div>
      ))}
    </div>
  );
}
