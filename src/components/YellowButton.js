import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)({
    backgroundColor: '#ffc400',
    color: 'white',
    borderRadius: '0.375rem',
    '&:hover': {
        backgroundColor: '#FCD34D',
    },
});

const YellowButton = ({ onClick, children }) => {
    return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default YellowButton;