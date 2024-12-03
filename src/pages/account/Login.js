import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from 'api/axiosConfig';
import InputField from "components/InputField";
import { useDispatch } from "react-redux";
import { setCredentials } from "slices/authSlice";


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) =>
        password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email) setEmailError('이메일을 입력하세요.');
        if (!password) setPasswordError('비밀번호를 입력하세요.');

        if (email && password) {
            try {
                const response = await apiClient.post('/api/login', { email, password });

                // AccessToken을 Redux 상태에 저장
                dispatch(setCredentials({ accessToken: response.data.accessToken }));

                navigate("/"); // 홈페이지로 이동
            } catch (error) {
                setEmailError('이메일 또는 비밀번호가 잘못되었습니다.');
            }
        }
    };

    const handleEmailCheck = () => {
        if (!validateEmail(email)) {
            setEmailError('올바른 이메일 형식이 아닙니다.');
            return;
        }
        setEmailError('');
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="캠핑온"
                    src={`${process.env.PUBLIC_URL}/logo.svg`}
                    className="mx-auto h-32 w-auto"
                />
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
            </div>
        </div>
    );
}

export default Login;
