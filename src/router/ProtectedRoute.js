import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// 로그인 한 사용자만 접근 가능한 페이지의 경우엔 <ProtectedRoute>로 감싸주기

function ProtectedRoute({ children }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
