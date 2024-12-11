import React, { useCallback } from 'react';
import { Box, Fab, Zoom } from '@mui/material';
import { KeyboardArrowUp } from '@mui/icons-material';
import { useScrollTrigger } from '@mui/material';

function ScrollToTopFab({
                            bottom = 32,
                            right = 32,
                            size = "small",
                            // color prop 제거 (기본값 사용하지 않음)
                        }) {
    const trigger = useScrollTrigger({
        threshold: 100,
    });

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (React.createElement(Zoom, { in: trigger },
        React.createElement(Box, {
                role: "presentation",
                sx: {
                    position: "fixed",
                    bottom: bottom,
                    right: right,
                    zIndex: 1,

                }
            },
            React.createElement(Fab, {
                    onClick: scrollToTop,
                    size: size,
                    "aria-label": "페이지 최상단으로 이동",
                    sx: {
                        backgroundColor: '#ffc400',
                        '&:hover': {
                            backgroundColor: 'rgba(255,196,0,0.8)',
                        }
                    }
                },
                React.createElement(KeyboardArrowUp, {
                    fontSize: "medium",
                    sx: { color: '#fff' } // 화살표 아이콘을 흰색으로 설정
                })))));
}
export default ScrollToTopFab;