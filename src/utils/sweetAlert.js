import Swal from 'sweetalert2';

/** 스윗알러트 유틸리티 함수들 */ 
export const showSuccessAlert = (title, text, timer = 1500) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export const showErrorAlert = (title, text, timer = 1500) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export const showInfoAlert = (title, text, timer = 2000) => {
  return Swal.fire({
    icon: 'info',
    title,
    text,
    timer,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export const showConfirmAlert = (title, text) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: '확인',
    confirmButtonColor: '#ff6b35',
  });
};

export const showSuccessConfirmAlert = (title, text) => {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    showConfirmButton: true,
    confirmButtonText: '확인',
    confirmButtonColor: '#ff6b35',
    allowOutsideClick: false,
    allowEscapeKey: true
  });
};

export const showErrorConfirmAlert = (title, text) => {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    showConfirmButton: true,
    confirmButtonText: '확인',
    confirmButtonColor: '#ff6b35',
    allowOutsideClick: false,
    allowEscapeKey: true
  });
};

export const showLoadingAlert = (title, text, timer = 2000) => {
  return Swal.fire({
    title,
    text,
    icon: 'info',
    showConfirmButton: false,
    timer,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

export const showQuestionAlert = (title, html) => {
  return Swal.fire({
    icon: 'question',
    title,
    html, // text 대신 html 사용 (두 줄 출력)
    showCancelButton: true,
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    confirmButtonColor: '#ff6b35',
    cancelButtonColor: '#aaa',
    allowOutsideClick: false,
    allowEscapeKey: true
  });
};

