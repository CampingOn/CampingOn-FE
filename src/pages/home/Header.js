import React, {useState, useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from 'context/AuthContext';
import {YellowButton} from "components";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const Header = () => {
    const location = useLocation();
    const [logo, setLogo] = useState(`/logo/logoWide.svg`);
    const {isAuthenticated, logout, isLoading} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setValue(getTabValue(location.pathname));
    }, [location.pathname]);

    // URL 경로에 따라 탭 값 설정
    const getTabValue = (pathname) => {
        switch (pathname) {
            case '/my-reservation':
                return 0;
            case '/my-bookmark':
                return 1;
            case '/my-page':
                return 2;
            default:
                return 3;  // 숨겨진 탭의 인덱스
        }
    };

    const [value, setValue] = useState(getTabValue(location.pathname));

    // URL 변경 시 탭 값 업데이트
    useEffect(() => {
        setValue(getTabValue(location.pathname));
    }, [location.pathname]);

    const handleMouseEnter = () => {
        setLogo(`/logo/logoWideClicked.svg`);
    };

    const handleMouseLeave = () => {
        setLogo(`/logo/logoWide.svg`);
    };

    if (isLoading) {
        return null;
    }

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
                navigate('/my-bookmark');
                break;
            case 2:
                navigate('/my-page');
                break;
            default:
                navigate('/');
                setValue(null);
                break;
        }
    };

    return (
        <>
            <AppBar position="static" style={{backgroundColor: 'transparent', boxShadow: 'none', marginTop: '20px'}}>
                <Toolbar style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '-5px'
                }}>
                    <Link to="/" style={{display: 'flex', alignItems: 'center'}}>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{width: '200px'}}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                    </Link>
                    {isAuthenticated && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: 'calc(100% - 500px)',
                            marginLeft: '-130px'
                        }}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                aria-label="header tabs"
                                sx={{
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: '#ffc400',
                                        height: '2.5px',
                                        display: value === 3 ? 'none' : 'block'
                                    },
                                }}
                            >
                                <Tab
                                    label="나의예약" style={{paddingBottom: '30px'}}
                                    sx={{
                                        '&.Mui-selected': {
                                            color: '#ffc400',
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />
                                <Tab
                                    label="찜한캠핑장" style={{paddingBottom: '30px'}}
                                    sx={{
                                        '&.Mui-selected': {
                                            color: '#ffc400',
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />
                                <Tab
                                    label="마이페이지" style={{paddingBottom: '30px'}}
                                    sx={{
                                        '&.Mui-selected': {
                                            color: '#ffc400',
                                            fontWeight: 'bold',
                                        },
                                    }}
                                />
                                <Tab
                                    label="" style={{paddingBottom: '30px'}}
                                    sx={{
                                        padding: 0,
                                        minWidth: 0,
                                        width: 0,
                                        overflow: 'hidden',
                                        opacity: 0,
                                        pointerEvents: 'none'
                                    }}
                                />
                            </Tabs>
                        </div>
                    )}

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
