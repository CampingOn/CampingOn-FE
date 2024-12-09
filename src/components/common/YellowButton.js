import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ size }) => ({
    backgroundColor: '#ffc400',
    color: 'white',
    borderRadius: '0.375rem',
    padding: size === 'large' ? '12px 24px' : 
             size === 'small' ? '8px 16px' : 
             size === 'extra-small' ? '8px 16px' :
             '4px 8px',
    fontSize: size === 'large' ? '1.2rem' : 
              size === 'small' ? '1rem' : 
              size === 'extra-small' ? '0.8rem' :
              '0.8rem',
    '&:hover': {
        backgroundColor: '#FCD34D',
    },
    '@media (max-width: 600px)': {
        padding: '10px 20px',
    },
    '@media (min-width: 601px) and (max-width: 960px)': {
        padding: '10px 70px',
    },
    '@media (min-width: 961px)': {
        padding: '10px 150px',
    }
}));

const YellowButton = ({ onClick, children, size = 'extra-small', style }) => {
    return <StyledButton onClick={onClick} size={size} style={style}>{children}</StyledButton>;
};

export default YellowButton;