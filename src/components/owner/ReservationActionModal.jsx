import React, { useState } from 'react';
import Modal from '../common/Modal';
import FormInput from '../common/FormInput';
import FormButton from '../common/FormButton';
import styles from '../../assets/styles/owner/ReservationItem.module.css';

const ReservationActionModal = ({ open, onClose, onConfirm, title }) => {
  const [reason, setReason] = useState('');
  return (
    <Modal open={open} onClose={onClose} title={title} width={400}>
      <FormInput
        name="reason"
        value={reason}
        onChange={e => setReason(e.target.value)}
        placeholder="거절 사유를 입력하세요"
      />
      <div className={styles.modalBtnGroup}>
        <FormButton onClick={() => onConfirm(reason)}>확인</FormButton>
        <FormButton variant="secondary" onClick={onClose}>취소</FormButton>
      </div>
    </Modal>
  );
};

export default ReservationActionModal;