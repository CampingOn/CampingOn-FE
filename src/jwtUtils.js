import { jwtDecode } from 'jwt-decode';
export const isTokenExpired = (token) => {
    if (!token) return true; // 토큰이 없으면 만료로 간주

    try {
        const { exp } = jwtDecode(token); // jwt-decode를 이용해 payload에서 exp 추출
        const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (초 단위)
        return exp < currentTime; // 만료 여부 반환
    } catch (error) {
        console.error("Invalid token:", error);
        return true; // 토큰이 유효하지 않으면 만료로 간주
    }

};
