import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

const apiClient = axios.create({
    baseURL: baseUrl,
    timeout: 5000,
    withCredentials: true, // 쿠키 전송을 위해 설정
    headers: {
        "Content-Type": "application/json",
    },
});

const excludedUrls = [
    '/api/login',
    '/api/signup',
    "/api/users/check-duplicate",
    "/api/mongo/camps/search",
    "/api/camps/*/available",
    "/api/camps/*",
    "/api/keywords"];

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
            console.log("🔑 access Token 헤더에 설정함");
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        console.log(`🚀 요청: ${config.url}`);
        return config;
    },
    (error) => {
        console.error("❌ 요청 에러:", error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ 응답: ${response.config.url}`);
        return response;
    },
    async (error) => {
        console.error("🚫️ 응답 에러:", error.message);
        const originalRequest = error.config;

        // 특정 URL에 대해 인터셉터 제외
        if (excludedUrls.some((url) => originalRequest.url.includes(url))) {
            return Promise.reject(error);
        }

        // 401 Unauthorized 처리
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Refresh 토큰 갱신중인 경우 대기
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    // Refresh Token으로 Access Token 재발급
                    const response = await axios.get(`${baseUrl}/api/token/refresh`, {
                        withCredentials: true, // 쿠키를 통한 인증
                    });

                    const newAccessToken = response.data.accessToken;

                    // 로컬 스토리지에 저장
                    localStorage.setItem("accessToken", newAccessToken);

                    // 갱신 대기 중인 요청 처리
                    onTokenRefreshed(newAccessToken);

                    isRefreshing = false;
                    // Authorization Header 업데이트
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest);

                } catch (refreshError) {
                    // 재발급 실패 시 로그아웃 처리
                    localStorage.removeItem("accessToken");
                    window.location.href = "/login";
                    isRefreshing = false;
                    return Promise.reject(refreshError);
                }
            }

            // 토큰 갱신 대기
            return new Promise((resolve) => {
                addRefreshSubscriber((newAccessToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    resolve(apiClient(originalRequest));
                });
            });
        }

        // 다른 에러는 그대로 반환
        return Promise.reject(error);
    }
);

export default apiClient;
