import React, { useEffect, useState } from 'react';
import WaitingSummaryBox from '../../components/owner/WaitingSummaryBox';
import WaitingList from '../../components/owner/WaitingList';
import styles from '../../assets/styles/pages/owner/WaitingManagePage.module.css';
import { ownerApi } from '../../api/ownerApi';
import { showSuccessAlert, showErrorAlert, showQuestionAlert } from '../../utils/sweetAlert';

const WaitingManagePage = () => {
  const [summary, setSummary] = useState({ teamCount: 0, expectedTime: '-' });
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWaitingData = async () => {
    setLoading(true);
    try {
      const summaryRes = await ownerApi.getWaitingSummary();
      const listRes = await ownerApi.getWaitingList();
      setSummary(summaryRes.data);
      setWaitingList(listRes.data);
    } catch {
      if (err?.response?.status !== 404 && err?.response?.status !== 204) {
        showErrorAlert('웨이팅 정보 조회 실패', '데이터를 불러올 수 없습니다.');}
      setSummary({ teamCount: 0, expectedTime: '-' });
      setWaitingList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitingData();
  }, []);

  // 다음 대기자 호출
  const handleCallNext = async (waitingId) => {
    try {
      await ownerApi.callNextWaiting(waitingId);
      showSuccessAlert('호출 완료', '다음 대기자가 호출되었습니다.');
      fetchWaitingData();
    } catch {
      showErrorAlert('호출 실패', '호출에 실패했습니다.');
    }
  };

  // 노쇼 처리
  const handleNoShow = async (waitingId) => {
    const result = await showQuestionAlert('노쇼 처리', '정말 노쇼 처리하시겠습니까?<br/>노쇼 처리 시 해당 대기자는 명단에서 제외됩니다.');
    if (result.isConfirmed) {
      try {
        await ownerApi.markWaitingNoShow(waitingId);
        showSuccessAlert('노쇼 처리 완료', '해당 대기자가 노쇼 처리되었습니다.');
        fetchWaitingData();
      } catch {
        showErrorAlert('노쇼 처리 실패', '노쇼 처리에 실패했습니다.');
      }
    }
  };

  return (
    <div className={styles.waitingPageContainer}>
      <h2 className={styles.title}>[ 웨이팅 관리 ]</h2>
      <WaitingSummaryBox teamCount={summary.teamCount} expectedTime={summary.expectedTime} />
      <WaitingList
        loading={loading}
        waitingList={waitingList}
        onCall={handleCallNext}
        onNoShow={handleNoShow}
      />
    </div>
  );
};

export default WaitingManagePage;