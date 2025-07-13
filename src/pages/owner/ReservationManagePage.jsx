import React, { useEffect, useState } from 'react';
import { ownerApi } from '../../api/ownerApi';
import PendingReservationList from '../../components/owner/PendingReservationList';
import NoShowList from '../../components/owner/NoShowList';
import ReservationActionModal from '../../components/owner/ReservationActionModal';
import { showQuestionAlert, showSuccessAlert, showErrorAlert } from '../../utils/sweetAlert';
import styles from '../../assets/styles/pages/owner/ReservationManagePage.module.css';

const ReservationManagePage = () => {
  const [pending, setPending] = useState([]);
  const [noShow, setNoShow] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, nRes] = await Promise.all([
          ownerApi.getPendingReservations(),
          ownerApi.getNoShowCandidates()
        ]);
        setPending(pRes.data);
        setNoShow(nRes.data);
      } catch (err) {
        showErrorAlert('오류', '예약 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshLists = async () => {
    setLoading(true);
    try {
      const [pRes, nRes] = await Promise.all([
        ownerApi.getPendingReservations(),
        ownerApi.getNoShowCandidates()
      ]);
      setPending(pRes.data);
      setNoShow(nRes.data);
    } catch {
      showErrorAlert('오류', '데이터 갱신에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await ownerApi.updateReservationStatus({ reservationId: id, reservationStatus: '예약 완료', ownerNotes: '' });
      showSuccessAlert('승인 완료', '예약이 승인되었습니다.');
      refreshLists();
    } catch {
      showErrorAlert('실패', '예약 승인에 실패했습니다.');
    }
  };

  const handleReject = (item) => {
    setSelected(item);
    setModalOpen(true);
  };

  const confirmReject = async (reason) => {
    setModalOpen(false);
    try {
      await ownerApi.updateReservationStatus({ reservationId: selected.reservationId, reservationStatus: '예약 거절', ownerNotes: reason });
      showSuccessAlert('거절 완료', '예약이 거절되었습니다.');
      refreshLists();
    } catch {
      showErrorAlert('실패', '예약 거절에 실패했습니다.');
    }
  };

  const handleNoShow = (id) => {
    showQuestionAlert('만료된 예약', '정말 노쇼 처리하시겠습니까? <br/>만료된 예약에 대한 예약금은 정산됩니다.').then((result) => {
      if (result.isConfirmed) {
        ownerApi.markNoShow({ reservationId: id })
          .then(() => {
            showSuccessAlert('완료', '노쇼 처리되었습니다.');
            refreshLists();
          })
          .catch(() => showErrorAlert('실패', '노쇼 처리에 실패했습니다.'));
      }
    });
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>[ 예약 관리 ]</h2>
      <div className={styles.splitArea}>
        <h3 className={styles.subtitle}>예약 신청 목록</h3>
        <section className={styles.section + ' ' + styles.topSection}>
          <div className={styles.listScroll}>
            <PendingReservationList
              items={pending}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
        </section>
        <h3 className={styles.subtitle}>만료된 예약 목록</h3>
        <section className={styles.section + ' ' + styles.bottomSection}>
          <div className={styles.listScroll}>
            <NoShowList
              items={noShow}
              onMark={handleNoShow}
            />
          </div>
        </section>
      </div>
      {modalOpen && (
        <ReservationActionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={confirmReject}
          title="예약 거절 사유"
        />
      )}
    </div>
  );
}

export default ReservationManagePage;