import apiClient from 'api/axiosConfig';

export const reviewService = {
    // 리뷰 생성
    createReview: (campId, reservationId, formData) => {
        return apiClient.post(`/api/camps/${campId}/reviews/${reservationId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // 리뷰 수정
    updateReview: (campId, reviewId, formData) => {
        return apiClient.put(`/api/camps/${campId}/reviews/${reviewId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // 캠핑장 리뷰 목록 조회
    getReviewsByCampId: (campId) => {
        return apiClient.get(`/api/camps/${campId}/reviews`);
    },

    // 리뷰 상세 조회
    getReviewDetail: (campId, reviewId) => {
        return apiClient.get(`/api/camps/${campId}/reviews/${reviewId}`);
    },

    // 리뷰 삭제
    deleteReview: (reviewId) => {
        return apiClient.delete(`/api/camps/reviews/${reviewId}`);
    }
}