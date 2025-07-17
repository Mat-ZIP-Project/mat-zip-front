import React, { useEffect, useState } from 'react';
import WaitingSummaryBox from '../../components/owner/WaitingSummaryBox';
import WaitingList from '../../components/owner/WaitingList';
import styles from '../../assets/styles/pages/owner/WaitingManagePage.module.css';
import { ownerApi } from '../../api/ownerApi';
import { showSuccessAlert, showErrorAlert, showQuestionAlert } from '../../utils/sweetAlert';

const WaitingManagePage = ({ restaurantId }) => {
  const [callList, setCallList] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [loading, setLoading] = useState(true);

  // restaurantId가 없으면 API 호출하지 않음
  const fetchWaitingData = async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      const callListRes = await ownerApi.getWaitingCallList();
      const waitingListRes = await ownerApi.getWaitingList();

      console.log('callListRes:', callListRes.data);
      console.log('waitingListRes:', waitingListRes.data);

      setCallList(callListRes.data);
      setWaitingList(waitingListRes.data);
    } catch (err) {
      console.error('API 에러:', err);
      setCallList([]);
      setWaitingList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitingData();
  }, [restaurantId]);

  // 다음 대기자 호출 (벨 클릭)
  const handleCallNext = async () => {
    try {
      await ownerApi.callNextWaiting(restaurantId);
      showSuccessAlert('호출 완료', '다음 대기자가 호출되었습니다.');
      fetchWaitingData();
    } catch {
      showErrorAlert('호출 실패', '호출에 실패했습니다.');
    }
  };

  // 입장완료 처리
  const handleEnter = async (waitingId) => {
    try {
      await ownerApi.enterWaiting(waitingId);
      showSuccessAlert('입장 완료', '해당 대기자가 입장 처리되었습니다.');
      fetchWaitingData();
    } catch {
      showErrorAlert('입장 처리 실패', '입장 처리에 실패했습니다.');
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
        showErrorAlert('노쇼 처리 실패', '호출 후 15분이 지나야 노쇼 처리 가능합니다.');
      }
    }
  };

  // 대기팀수와 예상입장시간 계산
  const teamCount = waitingList.length;
  const expectedTime = teamCount > 0
    ? `${teamCount * 10}분`
    : '-';

  return (
    <div className={styles.waitingPageContainer}>
      <h2 className={styles.title}>[ 웨이팅 관리 ]</h2>
      <WaitingSummaryBox
        teamCount={teamCount}
        expectedTime={expectedTime}
        onCallNext={handleCallNext}
        loading={loading}
      />
      {/* 호출자 명단 */}
      <WaitingList
        loading={loading}
        waitingList={callList}
        title="호출자 명단"
        showPhone={true}
        onEnter={handleEnter}
        onNoShow={handleNoShow}
        showEnterBtn={true}
        showNoShowBtn={true}
      />
      {/* 입장대기 명단 */}
      <WaitingList
        loading={loading}
        waitingList={waitingList}
        title="입장대기 명단"
        showPhone={false}
        onEnter={null}
        onNoShow={null}
        showEnterBtn={false}
        showNoShowBtn={false}
      />
    </div>
  );
};

export default WaitingManagePage;