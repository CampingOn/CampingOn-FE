import axios from "axios";
/*
import { errorHandler } from "api/handlers/errorHandler";
*/

const baseUrl = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    withCredentials: true, // 쿠키 전송을 위해 설정
    headers: {
        "Content-Type": "application/json",
    },
});

let isRefreshing = false; // Refresh Token 갱신 중 여부
let refreshSubscribers = []; // 갱신 후 재요청 대기열

// Refresh Token 갱신 시 대기 중인 요청 처리
function onTokenRefreshed(newAccessToken) {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
}

// 갱신 대기열에 요청 추가
function addRefreshSubscriber(callback) {
    refreshSubscribers.push(callback);
}

// 요청 인터셉터
apiClient.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            console.log("Access Token 헤더에 설정함");
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        console.log("요청 데이터:", config.data);
        return config;
    },
    (error) => {
        console.error("요청 에러:", error);
        // 중앙 에러 핸들러로 요청 에러 전달
/*
        return errorHandler ? errorHandler(error) : Promise.reject(error);
*/
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

            // Refresh Token 갱신 중인 경우 대기
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    // Refresh Token으로 Access Token 재발급 요청
                    const response = await axios.get(`${baseUrl}/api/token/refresh`, {
                        withCredentials: true, // 쿠키를 통한 인증
                    });

                    const newAccessToken = response.data.accessToken;

                    // 로컬 스토리지에 새 Access Token 저장
                    localStorage.setItem("accessToken", newAccessToken);

                    // 모든 대기 중인 요청에 새 Access Token 전달
                    onTokenRefreshed(newAccessToken);

                    // 갱신 상태 초기화
                    isRefreshing = false;

                    // Authorization 헤더 업데이트
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest);
                } catch (refreshError) {
                    // Refresh Token 갱신 실패 시 로그아웃 처리
                    isRefreshing = false;
                    localStorage.removeItem("accessToken");
                    window.location.href = "/login";
                    return errorHandler
                        ? errorHandler(refreshError)
                        : Promise.reject(refreshError);
                }
            }

            // 다른 요청 대기 중이라면 새 토큰 적용 후 재요청
            return new Promise((resolve) => {
                addRefreshSubscriber((newAccessToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    resolve(apiClient(originalRequest));
                });
            });
        }

        // 다른 에러는 중앙 에러 핸들러로 위임
/*
        return errorHandler ? errorHandler(error) : Promise.reject(error);
*/
    }
);

export default apiClient;
