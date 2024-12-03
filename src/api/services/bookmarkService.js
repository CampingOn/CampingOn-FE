import apiClient from 'api/axiosConfig';

export const bookmarkService = {
    // 캠핑장 찜하기/취소하기 토글
    toggleBookmark: async (campId) => {
        return apiClient.patch(`/api/camps/${campId}/bookmarks`);
    }
};