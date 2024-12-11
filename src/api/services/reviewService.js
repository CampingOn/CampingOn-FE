import apiClient from 'api/axiosConfig';

export const reviewService = {
    // 리뷰 생성
    createReview: (campId, reservationId, reviewData) => {
        const formData = new FormData();
        formData.append('title', reviewData.title);
        formData.append('content', reviewData.content);
        formData.append('recommended', reviewData.recommended ? 'true' : 'false');  // boolean을 string으로 변환

        // 이미지 파일들 처리
        if (reviewData.images?.length > 0) {
            reviewData.images.forEach(file => {
                if (file instanceof File) {  // File 객체인 경우만 추가
                    formData.append('s3Images', file);
                }
            });
        }

        // FormData 내용 확인
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        return apiClient.post(`/api/camps/${campId}/reviews/${reservationId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
    },

    // 캠핑장 리뷰 목록 조회
    getReviewsByCampId: (campId, params) => {
        return apiClient.get(`/api/camps/${campId}/reviews`, { params });
    },

    // 리뷰 상세 조회
    getReviewDetail: (reviewId) => {
        return apiClient.get(`/api/camps/reviews/${reviewId}`);
    },

    getReviewDetailWithCampName: async (reviewId) => {
        const reviewDetail = await apiClient.get(`/api/camps/reviews/${reviewId}`);

        const campId = reviewDetail.data.campId;
        const campDetail = await apiClient.get(`/api/camps/${campId}`);

        return {
            ...reviewDetail.data,
            campName: campDetail.data.name
        };
    }
}