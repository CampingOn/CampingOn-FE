import React, { useState } from 'react';
import InputField from "components/common/InputField";
import apiClient from 'api/axiosConfig';

// 회원가입 / 회원 정보 수정 시 중복 확인 필드
export function DuplicateCheckField({ id, label, type, qtype, value, onChange, validateFn, placeholder, successMessage, onStatusChange }) {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleBlur = async () => {
        if (!validateFn(value)) {
            setError(`${label} 형식이 올바르지 않습니다.`);
            setSuccess('');
            onStatusChange(false);
            return;
        }
        try {
            const response = await apiClient.get(
                'api/users/check-duplicate',
                { params: { type: qtype, value: value.trim() } }
            );
            if (response.data) {
                setError(`이미 사용 중인 ${label}입니다.`);
                setSuccess('');
                onStatusChange(false);
            } else {
                setError('');
                setSuccess(`사용 가능한 ${label}입니다.`);
                onStatusChange(true);
            }
        } catch {
            setError(`${label} 확인 중 오류가 발생했습니다.`);
            setSuccess('');
            onStatusChange(false);
        }
    };

    return (
        <InputField
            id={id}
            label={label}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            error={error}
            buttonText="중복 확인"
            onButtonClick={handleBlur}
            buttonVisible={true}
            placeholder={placeholder}
            successMessage={successMessage || success}
        />
    );
}


// 회원 가입, 로그인 시 이메일 형식 검증
export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// 회원가입, 로그인, 회원 정보 수정 시 비밀번호 형식 검증
export const validatePassword = (password) => {
    const lengthCheck = password.length >= 8 && password.length <= 20;
    const letterCheck = /[A-Za-z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return lengthCheck && letterCheck && numberCheck && specialCharCheck;
};

// 회원가입, 회원 정보 수정 시 닉네임 형식 검증
export const validateNickname = (nickname) => nickname.length <= 8;
