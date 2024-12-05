import axios from "axios";
import { errorHandler } from "api/handlers/errorHandler";

const baseUrl = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    withCredentials: true, // 쿠키 전송을 위해 설정
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터
apiClient.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            console.log("access Token 헤더에 설정함");
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        console.log("요청 데이터:", config.data);
        return config;
    },
    (error) => {
        console.error("요청 에러:", error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
    (response) => {
        console.log("응답 데이터:", response.data);
        return response;
    },
    async (error) => {
        console.error("응답 에러:", error.message);
        const originalRequest = error.config;

        // 401 Unauthorized 처리
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh Token으로 Access Token 재발급
                const response = await axios.get(`${baseUrl}/api/token/refresh`, {
                    withCredentials: true, // 쿠키를 통한 인증
                });

                const newAccessToken = response.data.accessToken;

                // 로컬 스토리지에 저장
                localStorage.setItem("accessToken", newAccessToken);

                // Authorization 헤더 업데이트
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                // 원래의 요청을 다시 실행
                return apiClient(originalRequest);
            } catch (refreshError) {
                // 재발급 실패 시 로그아웃 처리
                localStorage.removeItem("accessToken");
                window.location.href = "/login"
                return Promise.reject(refreshError);
            }
        }

        // 다른 에러는 중앙 에러 핸들러로 위임
        return errorHandler ? errorHandler(error) : Promise.reject(error);
    }
);

export default apiClient;
