import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {useNavigate} from "react-router-dom";

const StyledButton = styled(Button)(({ isClicked }) => ({
    backgroundColor: isClicked ? '#FCD34D' : 'white',
    color: isClicked? 'white' : 'black',
    borderRadius: '0.375rem',
    '&:hover': {
        backgroundColor: '#FCD34D',
        color: 'white',
    },
}));

const WhiteButton = ({ to, children }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(to);
    };

    return (
        <StyledButton onClick={handleClick}>
            {children}
        </StyledButton>
    );
};

export default WhiteButton;