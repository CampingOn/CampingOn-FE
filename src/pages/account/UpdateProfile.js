import React, {useEffect, useState} from 'react';
import apiClient from 'api/axiosConfig';
import InputField from "components/InputField";
import {userService} from "../../api/services/userService";
import { useApi } from "../../hooks/useApi";
import { validatePassword, validateNickname } from 'utils/Validation';
import {useNavigate} from "react-router-dom";


const UpdateProfile = () => {
    const { execute: getUserInfo, data: userInfo, loading: userLoading } = useApi(userService.getUserInfo);
    const { execute: updateUserInfo, loading: updateLoading } = useApi(userService.updateUserInfo);
    const { execute: logout, loading: logoutLoading } = useApi(userService.logout);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [nickname, setNickname] = useState('');

    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const [nicknameError, setNicknameError] = useState('');
    const [nicknameSuccessMessage, setNicknameSuccessMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // 사용자 정보를 로드
        getUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo) {
            setNickname(userInfo.nickname);
            setEmail(userInfo.email);
            setName(userInfo.name);
        }
    }, [userInfo]);

    const handleNicknameCheck = async () => {
        if (!validateNickname(nickname)) {
            setNicknameError('닉네임은 8자 이내로 입력해주세요.');
            setNicknameSuccessMessage('');
            return;
        }
        try {
            const response = await apiClient.get('/api/users/check-duplicate', {
                params: { type: 'nickname', value: nickname.trim() },
            });
            if (response.data) {
                setNicknameError('이미 사용 중인 닉네임입니다.');
                setNicknameSuccessMessage('');
            } else {
                setNicknameError('');
                setNicknameSuccessMessage('사용 가능한 닉네임입니다.');
            }
        } catch (error) {
            setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
            setNicknameSuccessMessage('');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!isPasswordMatch) {
            alert('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        // 요청 데이터 생성
        const requestData = {
            nickname,
            currentPassword,
            newPassword: newPassword || null, // 비밀번호가 없을 경우 null 전송
        };

        try {
            const response = await updateUserInfo(requestData);

            await logout();
            alert('회원 정보가 성공적으로 업데이트되었습니다. 로그아웃 합니다.');
            navigate("/login");
            // 필요한 경우 사용자 정보를 다시 로드
        } catch (error) {
            // 백엔드에서 반환된 오류 메시지 표시
            const errorMessage = error.response?.data?.message || '회원 정보 수정 중 오류가 발생했습니다.';
            alert(errorMessage);
        }
    };


    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
                    회원 정보 수정
                </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6">
                    {/* 이메일 (수정 불가) */}
                    <InputField
                        id="email"
                        label="이메일"
                        value={email}
                        disabled

                    />
                    {/* 이름 (수정 불가) */}
                    <InputField
                        id="name"
                        label="이름"
                        value={name}
                        disabled
                    />
                    {/* 현재 비밀번호 */}
                    <InputField
                        id="current-password"
                        label="현재 비밀번호"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="현재 비밀번호를 입력하세요"
                    />
                    {/* 새 비밀번호 */}
                    <InputField
                        id="new-password"
                        label="새 비밀번호"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onBlur={() =>
                            setPasswordError(
                                validatePassword(newPassword)
                                    ? ''
                                    : '비밀번호는 최소 8자 이상의 숫자, 문자, 특수문자이어야 합니다.'
                            )
                        }
                        error={passwordError}
                        placeholder="새 비밀번호를 입력하세요"
                    />
                    {/* 새 비밀번호 확인 */}
                    <InputField
                        id="confirm-new-password"
                        label="새 비밀번호 확인"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        onBlur={() => setIsPasswordMatch(newPassword === confirmNewPassword)}
                        error={!isPasswordMatch ? '비밀번호가 일치하지 않습니다.' : ''}
                        placeholder="비밀번호를 다시 입력하세요"
                    />
                    {/* 닉네임 */}
                    <InputField
                        id="nickname"
                        label="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        onBlur={handleNicknameCheck}
                        buttonText="중복 확인"
                        onButtonClick={handleNicknameCheck}
                        buttonVisible={true}
                        error={nicknameError}
                        successMessage={nicknameSuccessMessage}
                        placeholder="8자 이내의 닉네임"
                    />
                    <button
                        type="submit"
                        disabled={updateLoading}
                        onClick={handleUpdate}
                        className="flex w-full justify-center rounded-md bg-yellow-400 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-yellow-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                    >
                        {updateLoading ? '업데이트 중...' : '정보 업데이트'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
