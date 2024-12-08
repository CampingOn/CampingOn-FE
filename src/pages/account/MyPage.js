import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import ProfileView from './ProfileView';
import UpdateProfile from './UpdateProfile';
import DeleteAccount from './DeleteAccount';
import MyKeywords from './MyKeyword';

const MyPage = () => {
    const [value, setValue] = useState(0);

    // 화면 크기에 따라 반응형 적용
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
                flexDirection: isSmallScreen ? 'column' : 'row', // 화면 크기에 따라 방향 변경
                width: '100%',
                backgroundColor: '#ffffff',
                margin: 0,
                padding: 0,
                boxSizing: 'border-box',
            }}
        >
            {/* Tabs 영역 */}
            <Box
                sx={{
                    width: isSmallScreen ? '100%' : '20%', // 좁은 화면에서는 전체 폭 차지
                    backgroundColor: 'white',
                    borderRight: isSmallScreen ? 'none' : '1px solid #ddd',
                    borderBottom: isSmallScreen ? '1px solid #ddd' : 'none', // 좁은 화면에서는 아래쪽에 경계선 추가
                    paddingTop: '16px',
                }}
            >
                <Tabs
                    orientation={isSmallScreen ? 'horizontal' : 'vertical'} // 좁은 화면에서는 수평 방향
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Responsive tabs example"
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#ffc400', // 선택된 탭 아래의 인디케이터 색상 변경
                        },
                    }}
                >
                    <Tab
                        label="내 정보"
                        sx={{
                            height: '6vh',
                            '&.Mui-selected': {
                                color: '#ffc400',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Tab
                        label="회원 정보 수정"
                        sx={{
                            height: '6vh',
                            '&.Mui-selected': {
                                color: '#ffc400',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Tab
                        label="나만의 키워드"
                        sx={{
                            height: '6vh',
                            '&.Mui-selected': {
                                color: '#ffc400',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Tab
                        label="회원 탈퇴"
                        sx={{
                            height: '6vh',
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
                    width: isSmallScreen ? '100%' : '80%', // 좁은 화면에서는 전체 폭 차지
                    padding: '16px',
                    paddingTop: '32px',
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
                    <DeleteAccount />
                </TabPanel>
            </Box>
        </Box>
    );
};

export default MyPage;
