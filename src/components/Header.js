import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import YellowButton from 'components/YellowButton';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'slices/authSlice';
import WhiteButton from "./WhiteButton";

function Header() {
    const [logo, setLogo] = useState(`${process.env.PUBLIC_URL}/logoWide.svg`);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // 로그인 상태 가져오기

    const handleMouseEnter = () => {
        setLogo(`${process.env.PUBLIC_URL}/logoWideClicked.svg`);
    };

    const handleMouseLeave = () => {
        setLogo(`${process.env.PUBLIC_URL}/logoWide.svg`);
    };

    console.log('회원 상태:', isAuthenticated);

    const handleAuthClick = () => {

        if (isAuthenticated) {
            dispatch(logout()); // 로그아웃
        } else {
            navigate('/login'); // 로그인 페이지로 이동
        }
    };

    return (
        <AppBar position="static" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
            <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
                        <WhiteButton>예약확인</WhiteButton>
                        <WhiteButton s>찜한캠핑장</WhiteButton>
                        <WhiteButton style={{ margin: '0 10px' }}>마이페이지</WhiteButton>
                    </div>
                <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{width: '200px'}}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    />
                </Link>
                {isAuthenticated && (
                    <div style={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
                        <WhiteButton style={{margin: '0 10px'}}>Button 1</WhiteButton>
                        <WhiteButton style={{margin: '0 10px'}}>Button 2</WhiteButton>
                        <WhiteButton style={{ margin: '0 10px' }}>Button 3</WhiteButton>
                    </div>
                )}
                <YellowButton onClick={handleAuthClick}>
                    {isAuthenticated ? 'Logout' : 'Login'}
                </YellowButton>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
