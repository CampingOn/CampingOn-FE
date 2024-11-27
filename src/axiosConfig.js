import axios from "axios";
import { isTokenExpired } from "jwtUtils";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// 요청 인터셉터
instance.interceptors.request.use(
    async (config) => {
        // 로그인 또는 비로그인 페이지 예외처리
        const nonAuthUrls = [
            "/api/signup",
            "/api/login",
            "/oauth2/authorization/google",
            "/api/users/check-duplicate",
        ]; // 인증 제외 경로
        if (nonAuthUrls.some((url) => config.url.includes(url))) {
            return config; // 토큰 검사 없이 요청 진행
        }

        const accessToken = localStorage.getItem("accessToken");

        // Access Token이 없는 경우 로그아웃 처리
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject("No access token");
        }

        // Access Token 만료 여부 확인
        if (isTokenExpired(accessToken)) {
            const refreshToken = localStorage.getItem("refreshToken");

            // Refresh Token이 없는 경우 로그아웃 처리
            if (!refreshToken || isTokenExpired(refreshToken)) {
                alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject("No valid refresh token");
            }

            // Refresh Token으로 Access Token 재발급 요청
            try {
                const response = await axios.post("http://localhost:8080/api/token/refresh", {
                    refreshToken,
                });

                const newAccessToken = response.data.accessToken;

                // 새 Access Token 저장
                localStorage.setItem("accessToken", newAccessToken);

                // Authorization 헤더에 새 Access Token 추가
                config.headers.Authorization = `Bearer ${newAccessToken}`;
            } catch (error) {
                console.error("Token refresh failed:", error);
                localStorage.clear();
                window.location.href = "/login";
                return Promise.reject(error);
            }
        } else {
            // Access Token이 유효한 경우 Authorization 헤더 설정
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
