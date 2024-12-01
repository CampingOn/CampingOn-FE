import axios from '../axios';

export const reservationService = {

    // 유저의 예약 목록 조회
    getReservations: async (userId, page) => {
        return axios.get(`/api/reservations?userId=${userId}&page=0`);
    },

    // 단일 예약 조회
    getReservation: async (reservationId) => {
        return axios.get(`/api/reservations/${reservationId}`);
    },

    // 새로운 예약 생성
    createReservation: async (requestData) => {
        return axios.post('/api/reservations', requestData);
    },

    // 예약 취소
    cancelReservation: async (reservationId, requestData) => {
        return axios.patch(`/api/reservations/${reservationId}`, requestData);
    },

    // 예약 가능한 캠프사이트 조회
    getReservedCampSiteIds: async (requestData) => {
        return axios.get('/api/reservations/available', { data: requestData });
    }
};