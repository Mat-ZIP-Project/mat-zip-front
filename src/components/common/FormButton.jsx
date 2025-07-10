import React from 'react';
import styles from '../../assets/styles/common/FormButton.module.css';

const FormButton = ({ 
  type = 'button',
  variant = 'primary', 
  size = 'large',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
  ...props 
}) => {
  const buttonClass = `
    ${styles.button} 
    ${styles[variant]} 
    ${styles[size]} 
    ${disabled ? styles.disabled : ''} 
    ${loading ? styles.loading : ''}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? '처리중...' : children}
    </button>
  );
};

export default FormButton;