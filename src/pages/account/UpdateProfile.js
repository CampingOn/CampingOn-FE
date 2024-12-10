import React, { useEffect, useState } from 'react';
import { userService } from "api/services/userService";
import { useApi } from "hooks/useApi";
import { validateNickname } from 'utils/Validation';
import { useNavigate } from "react-router-dom";
import { CustomInput } from "components";
import Switch from '@mui/material/Switch';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Typography } from "@mui/material";
import { DuplicateCheckField } from 'utils/Validation'; // 추가

const YellowSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#ffc400',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#ffc400',
    },
}));

const UpdateProfile = () => {
    const { execute: getUserInfo, data: userInfo } = useApi(userService.getUserInfo);
    const { execute: updateUserInfo, loading: updateLoading } = useApi(userService.updateUserInfo);
    const { execute: logout } = useApi(userService.logout);

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [originalNickname, setOriginalNickname] = useState('');
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false); // 추가

    const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const [passwordError, setPasswordError] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const navigate = useNavigate();

    // 사용자 정보 가져오기
    useEffect(() => {
        getUserInfo();
    }, []);

    useEffect(() => {
        if (userInfo) {
            setNickname(userInfo.nickname);
            setOriginalNickname(userInfo.nickname);
            setEmail(userInfo.email);
            setName(userInfo.name);
        }
    }, [userInfo]);

    // 회원 정보 업데이트
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!isPasswordMatch) {
            setSnackbarMessage('새 비밀번호가 일치하지 않습니다.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (nickname !== originalNickname && !isNicknameAvailable) {
            setSnackbarMessage('닉네임 중복 확인이 필요합니다.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        if (isPasswordChangeEnabled && currentPassword === newPassword) {
            setSnackbarMessage('현재 비밀번호와 새 비밀번호는 같을 수 없습니다.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        const requestData = {};
        if (nickname !== originalNickname) requestData.nickname = nickname;

        if (isPasswordChangeEnabled) {
            if (!currentPassword || !newPassword) {
                setSnackbarMessage('비밀번호를 모두 입력해주세요.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
            requestData.currentPassword = currentPassword;
            requestData.newPassword = newPassword;
        }

        try {
            await updateUserInfo(requestData);

            if (isPasswordChangeEnabled) {
                await logout();
                setSnackbarMessage('회원 정보가 성공적으로 업데이트되었습니다. 로그아웃 합니다.');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                navigate("/login");
            } else {
                setSnackbarMessage('회원 정보가 성공적으로 업데이트되었습니다.');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || '회원 정보 수정 중 오류가 발생했습니다.';
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const isUpdateButtonDisabled = () => {
        const isNicknameChanged = nickname !== originalNickname;
        const isPasswordChanged = isPasswordChangeEnabled && currentPassword && newPassword && confirmNewPassword && isPasswordMatch;
        return !isNicknameChanged && !isPasswordChanged;
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
                    <CustomInput id="email" label="이메일" value={email} disabled />
                    <CustomInput id="name" label="이름" value={name} disabled />

                    <DuplicateCheckField
                        id="nickname"
                        label="닉네임"
                        qtype="nickname" // API 요청에 필요한 type
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        validateFn={validateNickname}
                        placeholder="8자 이내의 닉네임"
                        onStatusChange={setIsNicknameAvailable}
                    />

                    <div className="flex items-center">
                        <label htmlFor="password-toggle" className="mr-2">비밀번호 변경</label>
                        <YellowSwitch
                            id="password-toggle"
                            checked={isPasswordChangeEnabled}
                            onChange={(e) => setIsPasswordChangeEnabled(e.target.checked)}
                        />
                        <Typography variant="body2" sx={{ color: 'gray' }}>
                            비밀번호 변경 시 자동 로그아웃 됩니다.
                        </Typography>
                    </div>

                    {isPasswordChangeEnabled && (
                        <>
                            <CustomInput id="current-password" label="현재 비밀번호" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                            <CustomInput id="new-password" label="새 비밀번호" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                            <CustomInput id="confirm-new-password" label="새 비밀번호 확인" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                        </>
                    )}

                    <Button
                        variant="contained"
                        disabled={isUpdateButtonDisabled()}
                        onClick={handleUpdate}
                        sx={{ backgroundColor: '#ffc400', borderRadius: '0.375rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', '&:hover': { backgroundColor: '#ff6927' }}}
                        fullWidth
                    >
                        {updateLoading ? '업데이트 중...' : '정보 업데이트'}
                    </Button>
                </form>
            </div>

            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default UpdateProfile;
