import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

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
                    src="/default/reviewImage.jpg"
                    alt="기본 이미지"
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative', width: '100%', height: 300 }}>
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
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                        }}
                        onClick={handlePrevious}
                    >
                        <ArrowBack />
                    </IconButton>
                    <IconButton
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                        }}
                        onClick={handleNext}
                    >
                        <ArrowForward />
                    </IconButton>

                    <Box sx={{
                        position: 'absolute',
                        bottom: 8,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1
                    }}>
                        {currentIndex + 1} / {images.length}
                    </Box>
                </>
            )}
        </Box>
    );
}

export default ImageCarousel;