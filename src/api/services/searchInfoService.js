import apiClient from "api/axiosConfig";

// MongoDB Atlas Search 활용
export const searchInfoService = {
    searchCamps: (params) => {
        return apiClient.get('/api/mongo/camps/search', {
            params: {
                city: params.city || '',
                searchTerm: params.keyword || '', // keyword를 searchTerm으로 변경
                page: params.page || 0,
                size: params.size || 12
            }
        });
    },

    // 사용자 키워드 맞춤 캠핑장 목록 조회
    getMatchedCamps: (page = 0, size = 3) => {
        return apiClient.get('/api/mongo/camps/matched', {
            params: { page, size }
        });
    }
};