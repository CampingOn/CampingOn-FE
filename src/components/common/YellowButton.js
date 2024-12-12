import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ size, customColor }) => ({
    backgroundColor: customColor || '#ffc400',
    color: 'white',
    borderRadius: '0.375rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    padding: size === 'large' ? '12px 150px' : 
             size === 'small' ? '8px 40px' :
             size === 'extra-small' ? '8px 30px' :
             '4px 20px',
    fontSize: size === 'large' ? '1.2rem' : 
              size === 'small' ? '1rem' : 
              size === 'extra-small' ? '0.8rem' :
              '0.8rem',
    '&:hover': {
        backgroundColor: customColor ? 
            `#ff6927` :
            '#ff8146',
    },
    '&.Mui-disabled': {
        backgroundColor: 'transparent',
        border: '1px solid #B2B2B2',
        color: '#B2B2B2',
        cursor: 'not-allowed',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        '&:hover': {
            backgroundColor: 'transparent',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }
    },
    '@media (max-width: 600px)': {
        padding: size === 'large' ? '10px 30px' :
                size === 'small' ? '8px 30px' : 
                size === 'extra-small' ? '6px 20px' :
                '4px 15px',
    },
    '@media (min-width: 601px) and (max-width: 960px)': {
        padding: size === 'large' ? '10px 80px' :
                size === 'small' ? '8px 40px' : 
                size === 'extra-small' ? '8px 25px' :
                '4px 18px',
    }
}));

const YellowButton = ({ onClick, children, size = 'extra-small', style, disabled }) => {
    const customColor = style?.backgroundColor;
    return (
        <StyledButton 
            onClick={onClick} 
            size={size} 
            customColor={customColor}
            disabled={disabled}
            style={{...style, backgroundColor: undefined}}
        >
            {children}
        </StyledButton>
    );
};

export default YellowButton;