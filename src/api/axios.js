import axios from 'axios';
import { errorHandler } from './handlers/errorHandler';

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 요청 인터셉터
instance.interceptors.request.use(
    req => {
        console.log('요청 데이터:', req.data);
        return req;
    },
    error => {
        console.log('요청 에러:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터
instance.interceptors.response.use(
    response => {
        console.log('응답 데이터:', response.data);
        return response;
    },
    error => {
        console.log('응답 에러:', error.message);
        return Promise.reject(error);
    }
);

export default instance;