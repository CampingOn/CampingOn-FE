import axios from "axios";
import store from "store";
import { logout, setCredentials } from "slices/authSlice";
import {useNavigate} from "react-router-dom";

const baseUrl = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
    baseURL: baseUrl,
    withCredentials: true  // 쿠키 전송을 위해 설정
});

// 요청 인터셉터
apiClient.interceptors.request.use(
    async (config) => {
        const state = store.getState();
        const accessToken = state.auth.accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const navigate = useNavigate();

        // 401 Unauthorized 에러 처리
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh Token으로 Access Token 재발급
                const response = await axios.get(`${baseUrl}/api/token/refresh`);

                const newAccessToken = response.data.accessToken;

                // Redux 상태 업데이트
                store.dispatch(setCredentials({ accessToken: newAccessToken }));

                // Authorization 헤더 업데이트
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // 원래의 요청을 다시 실행
                return apiClient(originalRequest);
            } catch (refreshError) {
                // 재발급 실패 시 로그아웃 처리
                store.dispatch(logout());
                navigate('/login')
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
