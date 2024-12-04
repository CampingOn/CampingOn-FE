import apiClient from "api/axiosConfig";

export const reviewService = {
    // 리뷰 생성 (정확하지않음 수정필요)
    createReview: (campId, reservationId, formData) => {
        return apiClient.post(`/api/camps/${campId}/reviews/${reservationId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    // 리뷰 수정 (정확하지않음 수정 필요)
    updateReview: (campId, reviewId, formData) => {
        return apiClient.put(`/api/camps/${campId}/reviews/${reviewId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    // 캠핑장 리뷰 조회
    getReviewsByCampId: (campId) => {
        return apiClient.get(`/api/camps/camp/${campId}`);
    },

    // 캠핑 사이트 리뷰 조회 (필요 없을 수도 있음)
    getReviewsByCampSiteId: (campSiteId) => {
        return apiClient.get(`/api/camps/campsite/${campSiteId}`);
    },

    // 리뷰 삭제
    deleteReview: (reviewId) => {
        return apiClient.delete(`/api/camps/reviews/${reviewId}`);
    },

    // 리뷰 추천/추천 취소 토글
    toggleRecommend: (reviewId) => {
        return apiClient.patch(`/api/camps/${reviewId}/recommend`);
    },
};
