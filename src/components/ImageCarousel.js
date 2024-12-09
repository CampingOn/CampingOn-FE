import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

function ImageCarousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    if (!images || images.length === 0) {
        return (
            <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                    src="/default/review-image.jpg"
                    alt="기본 이미지"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative', width: '80%', margin: '0 auto', height: 300 }}>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'background.paper'
                }}
            >
                <img
                    src={images[currentIndex]}
                    alt={`리뷰 이미지 ${currentIndex + 1}`}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                    }}
                />
            </Box>

            {images.length > 1 && (
                <>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            left: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            borderRadius: '50%',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                        }}
                        onClick={handlePrevious}
                    >
                        <KeyboardArrowLeft fontSize="large" />
                    </IconButton>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            borderRadius: '50%',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                        }}
                        onClick={handleNext}
                    >
                        <KeyboardArrowRight fontSize="large" />
                    </IconButton>

                    {/* 페이지 인디케이터 점 */}
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 16,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            gap: 1
                        }}
                    >
                        {images.map((_, index) => (
                            <Box
                                key={index}
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    bgcolor: currentIndex === index
                                        ? '#FCD34D'
                                        : 'rgba(0, 0, 0, 0.25)',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.2)'
                                    }
                                }}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </Box>
                </>
            )}
        </Box>
    );
}

export default ImageCarousel;
