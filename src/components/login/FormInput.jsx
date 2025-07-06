// import React from 'react';
// import styles from '../../assets/styles/login/FormInput.module.css'; 

// export default function FormInput({ 
//   type = 'text', name, value, onChange, placeholder, error,   disabled = false,
//   autoComplete
// }) {
//   return (
//     <div className={styles.inputGroup}>
//       {/* <label className={styles.label} htmlFor={name}>{label}</label> */}
//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className={`${styles.input} ${error ? styles.inputError : ''}`}
//         disabled={disabled}
//         autoComplete={autoComplete}
//       />
//       {error && (
//         <span className={styles.errorMessage}>{error}</span>
//       )}
//     </div>
//   );
// }

import React, { forwardRef } from 'react';
import styles from '../../assets/styles/login/FormInput.module.css'; 

const FormInput = forwardRef(({ 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  error,   
  disabled = false,
  autoComplete,
  className = '',
}, ref) => {

  const inputGroupClass = `${styles.inputGroup} ${className}`.trim();

  return (
    <div className={inputGroupClass}>
      <input
        ref={ref}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        disabled={disabled}
        autoComplete={autoComplete}
      />
      {error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;