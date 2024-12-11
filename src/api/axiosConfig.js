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
    "/api/keywords"
];

let refreshTokenPromise = null; // Refresh Token 갱신 중일 때 참조할 Promise

// 요청 인터셉터
apiClient.interceptors.request.use(
    (config) => {
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
    (error) => {
        console.error("🚫️ 응답 에러:", error.message);
        const originalRequest = error.config;

        // 특정 URL에 대해 인터셉터 제외
        if (excludedUrls.some((url) => originalRequest.url.includes(url))) {
            return Promise.reject(error);
        }

        // 401 Unauthorized 처리
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!refreshTokenPromise) {
                // **Refresh Token 갱신을 위한 Promise 생성**
                refreshTokenPromise = new Promise((resolve, reject) => {
                    console.log("🔄 Refresh Token으로 새로운 Access Token 발급 요청 중...");

                    axios.get(`${baseUrl}api/token/refresh`, { withCredentials: true })
                        .then((response) => {
                            const newAccessToken = response.data.accessToken;

                            // 새 Access Token을 로컬 스토리지에 저장
                            localStorage.setItem("accessToken", newAccessToken);
                            console.log("🔄 새 Access Token 발급 완료!");

                            // **모든 대기 요청에 대해 resolve() 호출**
                            resolve(newAccessToken);
                        })
                        .catch((refreshError) => {
                            console.error("❌ Refresh Token 갱신 실패", refreshError);
                            localStorage.removeItem("accessToken");
                            window.location.href = "/login"; // 로그인 페이지로 이동
                            reject(refreshError);
                        })
                        .finally(() => {
                            // Promise 해제
                            refreshTokenPromise = null;
                        });
                });
            }

            // 모든 대기 중인 요청들이 Promise에 연결되어, 새 토큰을 기다림
            return refreshTokenPromise.then((newAccessToken) => {
                console.log("🔓 대기 중이던 요청에 새 Access Token 할당");
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest); // 대기 중이던 요청 재시도
            }).catch((refreshError) => {
                console.error("❌ 대기 중인 요청도 실패함", refreshError);
                return Promise.reject(refreshError);
            });
        }

        // 다른 에러는 그대로 반환
        return Promise.reject(error);
    }
);

export default apiClient;
