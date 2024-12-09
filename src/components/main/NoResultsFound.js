import React from 'react';
import { Box, Typography, SvgIcon } from '@mui/material';

// Tent Icon (커스텀 SVG 아이콘)
const TentIcon = (props) => (
    <SvgIcon {...props}>
        <path d="M12 2L1 21h22L12 2zm0 3.27L19.74 19H4.26L12 5.27zM11 13h2v2h-2v-2zm0-4h2v3h-2V9z" />
    </SvgIcon>
);

const NoResultsFound = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center', // 정중앙 배치
                height: '50vh', // 화면 전체 높이를 기준으로 중앙 정렬
                color: 'text.secondary',
            }}
        >
            <TentIcon sx={{ fontSize: 64, mb: 2, color: '#999' }} />
            <Typography variant="body2" color="text.secondary">
                검색 내용에 대한 캠핑장 검색 결과가 없습니다.
            </Typography>
        </Box>
    );
};

export default NoResultsFound;
