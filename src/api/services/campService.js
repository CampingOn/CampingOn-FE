import apiClient from 'api/axiosConfig';

export const campService = {

    // 사용자 키워드 맞춤 캠핑장 목록 조회
    getMatchedCamps: async (page = 0, size = 3) => {
        return apiClient.get(`/api/camps/matched`, {
            params: {page, size}
        });
    },

    // 캠핑장 인기 목록 조회
    getPopularCamps: async (page = 0, size = 9) => {
        return apiClient.get(`/api/camps/popular`, {
            params: {page}
        });
    },

    // 검색한 캠핑장 목록
    searchCamps: async (keyword, city, page = 0, size = 12) => {
        return apiClient.get('/api/camps/search', {
            params: {
                keyword,
                city,
                page,
                size
            }
        });
    },

    // 캠핑장 상세 조회
    getCampDetail: async (campId) => {
        return apiClient.get(`/api/camps/${campId}`);
    },

    // 사용자 찜 목록 조회
    getBookmarkedCamps: async (page = 0, size = 3) => {
        return apiClient.get('/api/camps/bookmarked', {
            params: {page, size}
        });
    }
};