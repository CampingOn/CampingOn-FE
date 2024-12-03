import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from 'api/axiosConfig';
import InputField from "components/InputField";


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
    const [emailSuccessMessage, setEmailSuccessMessage] = useState('');
    const [nicknameSuccessMessage, setNicknameSuccessMessage] = useState('');

    const navigate = useNavigate();

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) =>
        password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    const validateNickname = (nickname) => nickname.length <= 8;

    const handleCheckDuplicate = async (type, value, setError, setSuccess) => {
        const trimmedValue = value.trim();
        if (!trimmedValue) {
            setError(`${type === 'email' ? '이메일' : '닉네임'}을 입력하세요.`);
            setSuccess('');
            return;
        }
        try {
            const response = await apiClient.get(
                'api/users/check-duplicate',
                { params: { type, value } }
            );
            if (response.data) {
                setError(`이미 사용 중인 ${type === 'email' ? '이메일' : '닉네임'}입니다.`);
                setSuccess('');
            } else {
                setError('');
                setSuccess(`사용 가능한 ${type === 'email' ? '이메일' : '닉네임'}입니다.`);
            }
        } catch (error) {
            setError(`${type === 'email' ? '이메일' : '닉네임'} 확인 중 오류가 발생했습니다.`);
            setSuccess('');
        }
    };

    const handleEmailCheck = () => {
        if (!validateEmail(email)) {
            setEmailError('올바른 이메일 형식이 아닙니다.');
            setEmailSuccessMessage('');
            return;
        }
        handleCheckDuplicate('email', email, setEmailError, setEmailSuccessMessage);
    };

    const handleNicknameCheck = () => {
        if (!validateNickname(nickname)) {
            setNicknameError('닉네임은 8자 이내 한글, 숫자, 영어만 가능합니다.');
            setNicknameSuccessMessage('');
            return;
        }
        handleCheckDuplicate('nickname', nickname, setNicknameError, setNicknameSuccessMessage);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!name) setNameError('이름을 입력하세요.');
        if (!email) setEmailError('이메일을 입력하세요.');
        if (!password) setPasswordError('비밀번호를 입력하세요.');
        if (password !== confirmPassword) setIsPasswordMatch(false);

        if (name && email && password && password === confirmPassword) {
            try {
                const response = await apiClient.post(
                    '/api/signup',
                    { name, email, password, nickname }
                );
                if (response.status === 201) navigate('/');
            } catch {
                setEmailError('회원가입 실패: 이미 존재하는 이메일 또는 닉네임입니다.');
            }
        }
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8" style={{ marginTop: "10rem", marginBottom: "10rem" }}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm space-y-8">
                <img
                    alt="캠핑온"
                    src={`${process.env.PUBLIC_URL}/logo.svg`}
                    className="mx-auto h-32 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                    회원가입
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleSignup} className="space-y-6">
                    <InputField
                        id="email"
                        label="이메일"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailCheck}
                        error={emailError}
                        buttonText="중복 확인"
                        onButtonClick={handleEmailCheck}
                        buttonVisible={true}
                        placeholder="example@example.com"
                        successMessage={emailSuccessMessage}
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
                                    ? '비밀번호는 최소 8자 이상이며 숫자와 문자를 포함해야 합니다.'
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
                    <InputField
                        id="nickname"
                        label="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        onBlur={handleNicknameCheck}
                        error={nicknameError}
                        buttonText="중복 확인"
                        onButtonClick={handleNicknameCheck}
                        buttonVisible={true}
                        placeholder={"8자 이내의 한글, 영어, 숫자만 가능"}
                        successMessage={nicknameSuccessMessage}
                    />
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                    >
                        회원가입
                    </button>
                    <p className="flex justify-between items-center p-2.5">
                        <span className="text-gray-500">이미 회원이라면?</span>
                        <a href="/login" className="text-yellow-500 hover:underline no-underline">로그인 하러가기 →</a>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;
