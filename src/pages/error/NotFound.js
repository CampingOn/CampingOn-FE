import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column', // 위에서 아래로 배치
            }}
        >
            {/* 상단 여백 박스 */}
            <Box
                sx={{
                    flexGrow: 1,
                    minHeight: '200px',
                }}
            />

            {/* 404 메시지 박스 */}
            <Box
                sx={{
                    textAlign: 'center',
                    p: 3,
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                    maxWidth: 500,
                    width: '100%',
                    mx: 'auto', // 가로 중앙 정렬
                }}
            >
                <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '6rem',
                        color: '#ffca28',
                        mb: 2
                    }}
                >
                    404
                </Typography>
                <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                        fontWeight: 'bold',
                        fontSize: '1.8rem',
                        color: '#333',
                        mb: 2
                    }}
                >
                    페이지를 찾을 수 없습니다.
                </Typography>
                <Typography
                    variant="body1"
                    component="p"
                    sx={{
                        color: '#666',
                        mb: 3
                    }}
                >
                    요청하신 페이지가 존재하지 않거나, 이동된 것 같아요. <br />
                    홈으로 돌아가 다시 시도해주세요.
                </Typography>

                <Button
                    variant="contained"
                    onClick={handleGoHome}
                    sx={{
                        mt: 2,
                        backgroundColor: '#ffca28',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        px: 3,
                        py: 1.2,
                        '&:hover': {
                            backgroundColor: '#FF8C00'
                        }
                    }}
                >
                    홈으로 돌아가기
                </Button>
            </Box>

            {/* 하단 여백 박스 */}
            <Box
                sx={{
                    flexGrow: 1, // 여백을 자동으로 조절
                }}
            />
        </Container>
    );
};

export default NotFoundPage;
