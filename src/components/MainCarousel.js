import React, { useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Typography } from '@mui/material';

function MainCarousel() {
    const carouselItems = [
        {
            id: 1,
            image: 'carousel/carousel-3.jpg',
            title: '겨울 분위기 한가득! 겨울에 가기 좋은 캠핑지는?',
            link: 'https://camping-on.site',
        },
        {
            id: 2,
            image: 'carousel/carousel-1.jpg',
            title: '캠핑 A to Z - 캠린이를 위한 꿀팁 총정리',
            link: 'https://m.blog.naver.com/kbcheckcard/220727060943',
        },
        {
            id: 3,
            image: 'carousel/carousel-4.jpg',
            title: '별 보러 갈래? 별 보기 좋은 캠핑장 🌌',
            link: 'https://camping-on.site',
        },
        {
            id: 4,
            image: 'carousel/carousel-2.jpg',
            title: '지금 당장 🏃‍♀️‍➡️🏃‍♀️‍➡️ 내 근처 캠핑장은?',
            link: 'https://camping-on.site',
        },
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    const handleRedirect = (url) => {
        window.open(url, '_blank');
    };

    const handleChange = (index) => {
        setActiveIndex(index);
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', height: '450px' }}>
            {/* Carousel */}
            <Carousel
                autoPlay={true}
                interval={5000}
                animation="slide"
                navButtonsAlwaysInvisible
                cycleNavigation  // 하단 동그라미
                onChange={(now) => handleChange(now)}
            >
                {carouselItems.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            position: 'relative',
                            width: '100%',
                            height: '400px',
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                zIndex: 1,
                            },
                        }}
                        onClick={() => handleRedirect(item.link)}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                color: '#fff',
                                zIndex: 2,
                                padding: '10px 20px',
                                borderRadius: '8px',
                            }}
                        >
                            {item.title}
                        </Typography>
                    </Box>
                ))}
            </Carousel>
        </Box>
    );
}

export default MainCarousel;
