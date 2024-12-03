import apiClient from "api/axiosConfig";


export const userService = {

    getUserInfo: () => {
        return apiClient.get("/api/users/me");
    },

    updateUserInfo: (requestData) => {
        return apiClient.put("/api/users/me", requestData);
    },

    deleteUser: (deleteReason) => {
        return apiClient.delete('/api/users/me', { data: deleteReason });
    },

    logout: () => {
        return apiClient.post("/api/logout");
    }

};