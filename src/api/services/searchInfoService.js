import apiClient from "api/axiosConfig";

export const searchInfoService = {
    searchCamps: (params) => {
        return apiClient.get('/api/mongo/camps/search', { params });
    }
};