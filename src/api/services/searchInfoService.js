import apiClient from "api/axiosConfig";

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
    }
};