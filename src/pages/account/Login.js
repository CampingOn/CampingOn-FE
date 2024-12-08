import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from 'api/axiosConfig';
import InputField from "components/common/InputField";
import { validateEmail, validatePassword } from 'utils/Validation';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {useAuth} from "context/AuthContext";
import {useApi} from "../../hooks/useApi";
import {userService} from "../../api/services/userService";

function Login() {
    const [logo, setLogo] = useState(`/logo/logo.svg`);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const { login } = useAuth();
    const { execute: fetchSelectedTags, loading } = useApi(userService.getMyKeywordList);


    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setLogo(`/logo/logoClicked.svg`);
    };

    const handleMouseLeave = () => {
        setLogo(`/logo/logo.svg`);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        let valid = true;

        if (!email) {
            setEmailError('이메일을 입력하세요.');
            valid = false;
        }
        if (!password) {
            setPasswordError('비밀번호를 입력하세요.');
            valid = false;
        }

        if (valid) {
            try {
                const response = await apiClient.post('/api/login', { email, password });

                // AccessToken을 저장
                localStorage.setItem('accessToken', response.data.accessToken);
                login();

                // 사용자 키워드 목록 가져오기
                const keywordResponse = await fetchSelectedTags();
                const userKeywords = keywordResponse?.keywords || []; // 키워드 목록 가져오기

                navigate(userKeywords.length === 0 ? '/keyword' : '/');

            } catch (error) {
                // 오류 메시지 표시
                setSnackbarMessage('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
                setSnackbarOpen(true);
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleEmailCheck = () => {
        if (!validateEmail(email)) {
            setEmailError('올바른 이메일 형식이 아닙니다.');
            return;
        }
        setEmailError('');
    };

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.REACT_APP_API_URL}/oauth2/authorization/google`;
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8" style={{ marginTop: "10rem", marginBottom: "10rem" }}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Link to="/">
                    <img
                        alt="캠핑온"
                        src={logo}
                        className="mx-auto h-32 w-auto"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                </Link>
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    로그인
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleLogin} className="space-y-6">
                    <InputField
                        id="email"
                        label="이메일"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailCheck}
                        error={emailError}
                        placeholder="example@example.com"
                    />
                    <InputField
                        id="password"
                        label="비밀번호"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onBlur={() =>
                            setPasswordError(
                                !validatePassword(password)
                                    ? '비밀번호는 최소 8자 이상의 숫자와 문자를 포함해야 합니다.'
                                    : ''
                            )
                        }
                        error={passwordError}
                        placeholder="··········"
                    />
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                    >
                        로그인
                    </button>
                    <p className="flex justify-between items-center p-2.5">
                        <span className="text-gray-500">회원이 아니라면?</span>
                        <a href="/signup" className="text-yellow-500 hover:underline no-underline">회원가입 하러가기 →</a>
                    </p>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"/>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-white px-2 text-gray-500">또는</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handleGoogleLogin}
                            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                        >
                            <img
                                src={"google-logo.png"}
                                alt="Google logo"
                                className="h-5 w-5 mr-2"
                            />
                            Google로 로그인하기
                        </button>
                    </div>
                </div>
            </div>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={"error"} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Login;
