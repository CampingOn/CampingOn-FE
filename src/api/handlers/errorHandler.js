// export const errorHandler = (error) => {
//
//     // 서버에서 전달된 에러 메시지 추출
//     const errorMessage = error.response?.data?.message
//         || error.message
//         || '알 수 없는 에러가 발생했습니다.';
//
//     alert(errorMessage);
//
//     return Promise.reject(error);
// };