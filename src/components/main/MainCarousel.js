import React, {useState} from 'react';
import Carousel from 'react-material-ui-carousel';
import {Box, Typography} from '@mui/material';

function MainCarousel() {
    const carouselItems = [
        {
            id: 1,
            image: 'https://campingon.s3.ap-northeast-2.amazonaws.com/banner/carousel4.jpg',
            title: '반려동물과 함께하는 특별한 캠핑 🐕',
            link: `${process.env.REACT_APP_DOMAIN_URL}/search?keyword=반려동물`,
        },
        {
            id: 2,
            image: 'https://campingon.s3.ap-northeast-2.amazonaws.com/banner/carousel1.jpg',
            title: '별 보러 갈래? 별 보기 좋은 캠핑장 🌌',
            link: `${process.env.REACT_APP_DOMAIN_URL}/search?keyword=별보기좋은`,
        },
        {
            id: 3,
            image: 'https://campingon.s3.ap-northeast-2.amazonaws.com/banner/carousel2.jpg',
            title: '오늘은 즉흥 캠핑!🏃‍➡️🏃‍♀️‍➡️당장 떠나기 좋은 서울 근교 캠핑장️',
            link: `${process.env.REACT_APP_DOMAIN_URL}/search?city=서울`,
        },
        {
            id: 4,
            image: 'https://campingon.s3.ap-northeast-2.amazonaws.com/banner/carousel3.jpg',
            title: '하얀 눈 내리는 겨울캠핑, 따뜻한 온수가 필요해!🔥🔥',
            link: `${process.env.REACT_APP_DOMAIN_URL}/search?keyword=온수`,
        },
    ];
    const [activeIndex, setActiveIndex] = useState(0);

    const handleChange = (index) => {
        setActiveIndex(index);
    };

    return (
        <Box sx={{position: 'relative', height: '450px'}}>
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
                    <a
                        key={item.id}
                        href={item.link}
                        style={{textDecoration: 'none'}}
                    >
                        <Box
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
                                transition: 'all 0.3s ease',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                    zIndex: 1,
                                    transition: 'all 0.3s ease',
                                },
                                '&:hover::before': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                },
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                }
                            }}
                        >

                            <Typography
                                variant="h4"
                                sx={{
                                    color: '#fff',
                                    zIndex: 2,
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    textShadow: '0 0 10px rgba(0, 0, 0, 0.9)',
                                }}
                            >
                                {item.title}
                            </Typography>
                        </Box>
                    </a>
                ))}
            </Carousel>
        </Box>
    );
}

export default MainCarousel;
