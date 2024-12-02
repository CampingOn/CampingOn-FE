import axios from '../axios';

export const bookmarkService = {
    // 캠핑장 찜하기/취소하기 토글
    toggleBookmark: async (campId) => {
        return axios.patch(`/api/camps/${campId}/bookmarks`);
    }
};