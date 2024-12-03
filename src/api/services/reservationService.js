import apiClient from "api/axiosConfig";


export const reservationService = {

    // 유저의 예약 목록 조회
    getReservations: () => {
        return apiClient.get(`/api/reservations`);
    },

    // 단일 예약 조회
    getReservation: (reservationId) => {
        return apiClient.get(`/api/reservations/${reservationId}`);
    },

    // 새로운 예약 생성
    createReservation: (requestData) => {
        return apiClient.post('/api/reservations', requestData);
    },

    // 예약 취소
    cancelReservation: (reservationId, requestData) => {
        return apiClient.patch(`/api/reservations/${reservationId}`, requestData);
    },

    // 예약 가능한 캠프사이트 조회
    getReservedCampSiteIds: (requestData) => {
        return apiClient.get('/api/reservations/available', { data: requestData });
    }
};