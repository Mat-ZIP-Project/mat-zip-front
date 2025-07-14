import React from 'react';
import styles from '../../assets/styles/owner/BlackButton.module.css';

const BlackButton = ({ children, ...props }) => (
  <button className={styles.blackButton} {...props}>
    {children}
  </button>
);

export default BlackButton;