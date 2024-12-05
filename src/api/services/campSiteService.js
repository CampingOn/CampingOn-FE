import apiClient from "api/axiosConfig";

export const campSiteService = {

    // 특정 캠핑장의 예약 가능한 캠핑지 목록 조회
    getAvailableCampSites: (campId, checkin, checkout) => {
        return apiClient.get(`/api/camps/${campId}/available`, {
            params: {
                checkin,
                checkout,
            },
        });
    },

    // 특정 캠핑지 정보 조회
    getCampSite: (campId, siteId) => {
        return apiClient.get(`/api/camps/${campId}/sites/${siteId}`);
    },
};
