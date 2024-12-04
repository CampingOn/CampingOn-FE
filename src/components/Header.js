import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from 'context/AuthContext';
import {YellowButton} from "components";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const Header = () => {
    const [logo, setLogo] = useState(`${process.env.PUBLIC_URL}/logoWide.svg`);
    const {isAuthenticated, logout} = useAuth();
    const [value, setValue] = useState(0);
    const navigate = useNavigate();

    const handleMouseEnter = () => {
        setLogo(`${process.env.PUBLIC_URL}/logoWideClicked.svg`);
    };

    const handleMouseLeave = () => {
        setLogo(`${process.env.PUBLIC_URL}/logoWide.svg`);
    };

    console.log('유저로그인상태', isAuthenticated);
    const handleAuthClick = () => {
        if (isAuthenticated) {
            logout();
        } else {
            navigate('/login');
        }
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);

        switch (newValue) {
            case 0:
                navigate('/my-reservation');
                break;
            case 1:
                navigate('/');
                break;
            case 2:
                navigate('/my-page');
                break;
            default:
                break;
        }
    };

    return (
        <>
            <AppBar position="static" style={{backgroundColor: 'transparent', boxShadow: 'none', marginTop: '20px'}}>
                <Toolbar style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '-10px'}}>
                    <Link to="/" style={{display: 'flex', alignItems: 'center'}}>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{width: '200px'}}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                    </Link>
                    <div style={{ display: 'flex', justifyContent: 'center', width: 'calc(100% - 500px)', marginLeft: '-145px'}}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="header tabs"
                            sx={{
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#ffc400',
                                },
                                marginBottom: '0',
                            }}
                        >
                            <Tab
                                label="예약확인" style={{paddingBottom: '25px' }}
                                sx={{
                                    '&.Mui-selected': {
                                        color: '#ffc400',
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                            <Tab
                                label="찜한캠핑장" style={{paddingBottom: '25px' }}
                                sx={{
                                    '&.Mui-selected': {
                                        color: '#ffc400',
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                            <Tab
                                label="마이페이지" style={{paddingBottom: '25px' }}
                                sx={{
                                    '&.Mui-selected': {
                                        color: '#ffc400',
                                        fontWeight: 'bold',
                                    },
                                }}
                            />
                        </Tabs>
                    </div>

                    <YellowButton onClick={handleAuthClick}>
                        {isAuthenticated ? 'Logout' : 'Login'}
                    </YellowButton>
                </Toolbar>
            </AppBar>

            <div style={{borderBottom: '1px solid #ddd'}}></div>
        </>
    );
};

export default Header;
