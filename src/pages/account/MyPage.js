import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import ProfileView from './ProfileView';
import UpdateProfile from "./UpdateProfile";
import DeleteAccount from "./DeleteAccount";
import MyKeywords from "./MyKeyword";

const MyPage = () => {
    const [value, setValue] = useState(0);

    // 화면 크기 감지
    const isSmallScreen = useMediaQuery('(max-width: 768px)');

    // TabPanel 컴포넌트
    function TabPanel(props) {
        const { children, value, index } = props;
        return (
            <div hidden={value !== index} style={{ width: '100%' }}>
                {value === index && <div>{children}</div>}
            </div>
        );
    }

    // 탭 변경 핸들러
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row', // 화면 크기에 따라 레이아웃 변경
                minHeight: '100vh', // 화면 전체 높이
                width: '100%', // 화면 전체 너비
                backgroundColor: '#ffffff',
                margin: 0, // 상하 좌우 여백 제거
                padding: 0, // 상하 좌우 패딩 제거
                boxSizing: 'border-box',
            }}
        >
            {/* Tabs 영역 */}
            <Box
                sx={{
                    width: isSmallScreen ? '100%' : '20%', // 작은 화면에서는 전체 너비 사용
                    backgroundColor: 'white',
                    borderRight: isSmallScreen ? 'none' : '1px solid #ddd', // 작은 화면에서는 경계선 제거
                    borderBottom: isSmallScreen ? '1px solid #ddd' : 'none', // 작은 화면에서는 아래 경계선 추가
                    paddingTop: '16px', // 추가적인 상단 여백 제거
                }}
            >
                <Tabs
                    orientation={isSmallScreen ? "horizontal" : "vertical"} // 화면 크기에 따라 orientation 변경
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Responsive tabs example"
                    sx={{
                        height: isSmallScreen ? 'auto' : '100%', // 작은 화면에서는 자동 높이
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#ffc400', // 선택된 탭 아래의 인디케이터 색상 변경
                        },
                    }}
                >
                    <Tab
                        label="내 정보"
                        sx={{
                            height: isSmallScreen ? 'auto' : '6vh',
                            '&.Mui-selected': {
                                color: '#ffc400', // 선택된 탭의 글자 색상 변경
                                fontWeight: 'bold', // 선택된 탭 글자를 굵게
                            },
                        }}
                    />
                    <Tab
                        label="회원 정보 수정"
                        sx={{
                            height: isSmallScreen ? 'auto' : '6vh',
                            '&.Mui-selected': {
                                color: '#ffc400',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Tab
                        label="나만의 키워드"
                        sx={{
                            height: isSmallScreen ? 'auto' : '6vh',
                            '&.Mui-selected': {
                                color: '#ffc400',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Tab
                        label="회원 탈퇴"
                        sx={{
                            height: isSmallScreen ? 'auto' : '6vh',
                            '&.Mui-selected': {
                                color: '#ffc400',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </Tabs>
            </Box>

            {/* 콘텐츠 영역 */}
            <Box
                sx={{
                    width: isSmallScreen ? '100%' : '80%', // 작은 화면에서는 전체 너비 사용
                    padding: '16px',
                    paddingTop: '32px', // 상단 여백 추가
                }}
            >
                <TabPanel value={value} index={0}>
                    <ProfileView />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <UpdateProfile />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <MyKeywords />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <DeleteAccount/>
                </TabPanel>
            </Box>
        </Box>
    );
};

export default MyPage;
