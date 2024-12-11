import React, {useState, useEffect, useRef} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from 'context/AuthContext';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';

const Header = () => {
    const location = useLocation();
    const [logo, setLogo] = useState(`/logo/logoWide.svg`);
    const {isAuthenticated, logout, isLoading} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {

        // 최종 상태 체크를 위해 지연
        const timer = setTimeout(() => {
            console.log('👀 최종 로그인 상태:', isAuthenticated);
        }, 100);

        // 타이머 제거
        return () => clearTimeout(timer);
    }, [isAuthenticated]);

    useEffect(() => {
        setValue(getTabValue(location.pathname));
    }, [location.pathname]);

    // URL 경로에 따라 탭 값 설정
    const getTabValue = (pathname) => {
        switch (pathname) {
            case '/my-reservation':
                return 1;
            case '/my-bookmark':
                return 2;
            case '/my-page':
                return 3;
            default:
                return 0;
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
            case 1:
                navigate('/my-reservation');
                break;
            case 2:
                navigate('/my-bookmark');
                break;
            case 3:
                navigate('/my-page');
                break;
            default:
                navigate('/');
                setValue(0);
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
                                    },
                                }}
                            >
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
                            </Tabs>
                        </div>
                    )}
                    <div onClick={handleAuthClick} style={{cursor: 'pointer', display: 'flex', alignItems: 'center'}}>
                        {isAuthenticated ? (
                            <>
                                <span style={{color: "#ffc400", marginTop: '5px'}}>LOGOUT</span>
                                <LockTwoToneIcon sx={{fontSize: 30, color: "#ffc400", margin: '5px 5px'}}/>
                            </>
                        ) : (
                            <>
                                <span style={{color: "#ffc400", marginTop: '5px'}}>LOGIN</span>
                                <LockOpenTwoToneIcon sx={{fontSize: 30, color: "#ffc400", margin: '5px 5px'}}/>
                            </>
                        )}
                    </div>
                </Toolbar>
            </AppBar>

            <div style={{borderBottom: '1px solid #ddd'}}></div>
        </>
    );
};

export default Header;
