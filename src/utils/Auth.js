import apiClient from 'axiosConfig';
import { setCredentials, logout } from 'slices/authSlice';
import store from 'store';

export const refreshToken = async () => {
    try {
        const response = await apiClient.get('/api/token/refresh', { withCredentials: true });
        const newAccessToken = response.data.accessToken;
        store.dispatch(setCredentials({ accessToken: newAccessToken }));
        return newAccessToken;
    } catch (error) {
        store.dispatch(logout());
        throw error;
    }
};
