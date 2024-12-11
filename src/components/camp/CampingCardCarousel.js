import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { CampingCard } from 'components';

function CampingCardCarousel({ camps, itemsPerView = 3, handleCardClick, showSnackbarNone, showSnackbarBookmark  }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const handlePrevious = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? Math.max(camps.length - itemsPerView, 0) : prevIndex - itemsPerView
        );

        setTimeout(() => setIsAnimating(false), 500); // 애니메이션 시간과 동일하게 설정
    };

    const handleNext = () => {
        if (isAnimating) return;

        setIsAnimating(true);
        setCurrentIndex((prevIndex) =>
            prevIndex + itemsPerView >= camps.length ? 0 : prevIndex + itemsPerView
        );

        setTimeout(() => setIsAnimating(false), 500);
    };

    if (!camps || camps.length === 0) return null;

    return (
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: `repeat(${itemsPerView}, 1fr)`
                },
                gap: 3,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                opacity: isAnimating ? 0.7 : 1,
                filter: isAnimating ? 'blur(1px)' : 'none',
            }}>
                {camps.map((camp) => (
                    <Box
                        key={camp.campId}
                        sx={{
                            transition: 'transform 0.5s ease',
                            transform: isAnimating ? 'scale(0.98)' : 'scale(1)',
                        }}
                    >
                        <CampingCard
                            campId={camp.campId}
                            thumbImage={camp.thumbImage}
                            name={camp.name}
                            address={camp.streetAddr}
                            keywords={camp.keywords || []}
                            lineIntro={camp.lineIntro || `${camp.city} ${camp.state}에 있는 ${camp.name}`}
                            marked={camp.marked}
                            onClick={() => handleCardClick(camp.campId)}
                            onShowSnackbarNone={showSnackbarNone}
                            onShowSnackbarBookmark={showSnackbarBookmark}
                            className="w-96 h-100 border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
                        />
                    </Box>
                ))}
            </Box>

            {camps.length > itemsPerView && (
                <>
                    <IconButton
                        size="small"
                        disabled={isAnimating}
                        sx={{
                            position: 'absolute',
                            left: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            '&.Mui-disabled': {
                                opacity: 0.5,
                                bgcolor: 'rgba(255,255,255,0.6)'
                            },
                            borderRadius: '50%',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            width: 32,
                            height: 32,
                            transition: 'all 0.3s ease'
                        }}
                        onClick={handlePrevious}
                    >
                        <KeyboardArrowLeft fontSize="small" />
                    </IconButton>

                    <IconButton
                        size="small"
                        disabled={isAnimating}
                        sx={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            bgcolor: 'rgba(255,255,255,0.8)',
                            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                            '&.Mui-disabled': {
                                opacity: 0.5,
                                bgcolor: 'rgba(255,255,255,0.6)'
                            },
                            borderRadius: '50%',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                            width: 32,
                            height: 32,
                            transition: 'all 0.3s ease'
                        }}
                        onClick={handleNext}
                    >
                        <KeyboardArrowRight fontSize="small" />
                    </IconButton>
                </>
            )}
        </Box>
    );
}

export default CampingCardCarousel;