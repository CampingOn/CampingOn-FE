import apiClient from 'api/axiosConfig';
import {useAuth} from "../../context/AuthContext";

export const campService = {

    // 사용자 키워드 맞춤 캠핑장 목록 조회
    getMatchedCamps: (page = 0, size = 3) => {
        return apiClient.get(`/api/camps/matched`, {
            params: {page, size}
        });
    },

    // 캠핑장 인기 목록 조회
    getPopularCamps: (page = 0, size = 9) => {
        return apiClient.get(`/api/camps/popular`, {
            params: {page, size}
        });
    },

    // 검색한 캠핑장 목록
    /*searchCamps: (keyword, city, page = 0, size = 12) => {
        return apiClient.get('/api/camps/search', {
            params: {
                keyword,
                city,
                page,
                size
            }
        });
    },*/

    // 캠핑장 상세 조회
    getCampDetail: (campId) => {
        return apiClient.get(`/api/camps/${campId}`);
    },

    // 사용자 찜 목록 조회
    getBookmarkedCamps: (token, page = 0, size = 3) => {
        return apiClient.get('/api/camps/bookmarked', {
            headers: {
                Authorization: `Bearer ${token}`, // JWT 추가
            },
            params: {page, size}
        });
    }
};