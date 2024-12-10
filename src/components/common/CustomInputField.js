import React, { useState } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

function CustomInput({
                         id,
                         label,
                         type = 'text',
                         value,
                         onChange,
                         onBlur,
                         error,
                         placeholder = '',
                         buttonText,
                         onButtonClick,
                         buttonVisible = false,
                         successMessage,
                         disabled,
                     }) {
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // 테두리 색상 결정 로직
    const getBorderColor = () => {
        if (error) return '#f6685e';
        if (successMessage) return '#16A34A';
        return '#e0e0e0';
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <TextField
                    id={id}
                    type={type === 'password' && showPassword ? 'text' : type}
                    value={value}
                    label={label}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    variant="outlined"
                    fullWidth
                    size="small"
                    error={Boolean(error)}
                    helperText={error || successMessage}
                    InputProps={{
                        endAdornment: type === 'password' && (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleTogglePasswordVisibility}
                                    edge="end"
                                    aria-label="toggle password visibility"
                                    sx={{ fontSize: '1rem', padding: '4px' }}
                                >
                                    {showPassword ?
                                        <VisibilityOff sx={{ fontSize: '1rem' }} />
                                        : <Visibility sx={{ fontSize: '1rem' }} />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    InputLabelProps={{
                        sx: {
                            fontSize: '0.9rem',
                            '&.Mui-focused': {
                                fontSize: '1rem',
                            },
                        },
                    }}
                    FormHelperTextProps={{
                        sx: {
                            color: error ? 'red' : successMessage ? 'green' : 'inherit', // 에러는 red, 성공은 green으로 유지
                            marginTop: '8px',
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '0.375rem',
                            '& fieldset': {
                                borderColor: getBorderColor(),
                            },
                            '&:hover fieldset': {
                                borderColor: getBorderColor(),
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#ffc400', // 포커스 상태 테두리 색상 고정
                            },
                            '& input:focus': {
                                outline: 'none !important',
                                boxShadow: 'none !important',
                            },
                        },
                        '& label.Mui-focused': {
                            color: '#ffc400', // 포커스된 라벨 색상 고정
                        },
                        '& input::placeholder': {
                            fontSize: '0.8rem',
                        },
                    }}
                />
                {buttonVisible && (
                    <Button
                        variant="contained"
                        size="medium"
                        onClick={onButtonClick}
                        sx={{
                            backgroundColor: '#ffc400', // 노란색
                            color: 'white',
                            height: '40px',
                            minWidth: '100px',
                            fontWeight: '600',
                            textTransform: 'none',
                            borderRadius: '0.375rem',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                                backgroundColor: '#ff8146', // 주황색
                            },
                            '&:active': {
                                backgroundColor: '#ff8146', // 주황색
                            },
                        }}
                    >
                        {buttonText}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default CustomInput;
