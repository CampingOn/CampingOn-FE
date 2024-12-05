import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ size }) => ({
    backgroundColor: '#ffc400',
    color: 'white',
    borderRadius: '0.375rem',
    padding: size === 'large' ? '12px 24px' : 
             size === 'small' ? '8px 16px' : 
             size === 'extra-small' ? '8px 16px' : // 추가된 크기
             '4px 8px', // 기본값 (extra-small)
    fontSize: size === 'large' ? '1.2rem' : 
              size === 'small' ? '1rem' : 
              size === 'extra-small' ? '0.8rem' : // 추가된 크기
              '0.8rem', // 기본값 (extra-small)
    '&:hover': {
        backgroundColor: '#FCD34D',
    },
}));

const YellowButton = ({ onClick, children, size = 'extra-small' }) => {
    return <StyledButton onClick={onClick} size={size}>{children}</StyledButton>;
};

export default YellowButton;