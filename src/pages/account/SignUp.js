import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from 'api/axiosConfig';
import InputField from "components/InputField";
import {validateEmail, validatePassword, validateNickname, DuplicateCheckField} from 'utils/Validation';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');

    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const [emailError, setEmailError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!name) setNameError('이름을 입력하세요.');
        if (!email) setEmailError('이메일을 입력하세요.');
        if (!password) setPasswordError('비밀번호를 입력하세요.');
        if(!nickname) setNicknameError('닉네임을 입력하세요.')
        if (password !== confirmPassword) setIsPasswordMatch(false);

        if (name && email && password && password === confirmPassword) {
            try {
                const response = await apiClient.post(
                    '/api/signup',
                    { name, email, password, nickname }
                );
                if (response.status === 201) navigate('/');
            } catch {
                setSnackbarOpen(true); // 실패 시 Snackbar 표시
            }
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8" style={{ marginTop: "10rem", marginBottom: "10rem" }}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-8">
                <Link to="/">
                    <img
                        alt="캠핑온"
                        src={`${process.env.PUBLIC_URL}/logo.svg`}
                        className="mx-auto h-32 w-auto"
                    />
                </Link>
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    회원가입
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSignup} className="space-y-6">
                    <DuplicateCheckField
                        id="email"
                        label="이메일"
                        type="email"
                        qtype="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        validateFn={validateEmail}
                        placeholder="example@example.com"
                        onStatusChange={setIsEmailChecked}
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
                                    ? '비밀번호는 최소 8자 이상이며 숫자와 문자, 특수문자를 포함해야 합니다.'
                                    : ''
                            )
                        }
                        error={passwordError}
                        placeholder={"8자 이상 숫자와 특수문자 포함"}
                    />
                    <InputField
                        id="confirm-password"
                        label="비밀번호 확인"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={() => setIsPasswordMatch(password === confirmPassword)}
                        error={!isPasswordMatch ? '비밀번호가 일치하지 않습니다.' : ''}
                        placeholder="··········"
                    />
                    <InputField
                        id="name"
                        label="이름"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setNameError(!name ? '이름을 입력하세요.' : '')}
                        error={nameError}
                        placeholder="홍길동"
                    />
                    <DuplicateCheckField
                        id="nickname"
                        label="닉네임"
                        qtype="nickname"
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        validateFn={validateNickname}
                        placeholder="8자 이내 한글, 숫자, 영어만 가능"
                        onStatusChange={setIsNicknameChecked}
                    />
                    <button
                        type="submit"
                        className={`flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                            isEmailChecked && isNicknameChecked
                                ? "bg-yellow-400 hover:bg-yellow-300"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}
                        disabled={!isEmailChecked || !isNicknameChecked}
                    >
                        회원가입
                    </button>
                    <p className="flex justify-between items-center p-2.5">
                        <span className="text-gray-500">이미 회원이라면?</span>
                        <a href="/login" className="text-yellow-500 hover:underline no-underline">로그인 하러가기 →</a>
                    </p>
                </form>
            </div>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleSnackbarClose} severity="error" sx={{width: '100%'}}>
                    회원 가입 실패: 잠시 후 다시 시도해주세요
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Signup;
