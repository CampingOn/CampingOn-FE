import React from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    Typography,
    Box,
    IconButton
} from '@mui/material';
import { ThumbUp as ThumbUpIcon, Close as CloseIcon } from '@mui/icons-material';
import { ImageCarousel } from 'components';

function ReviewModal({
                         open,
                         onClose,
                         review = {},
                         campName
                     }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            {/* 상단 영역 */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textIndent: '1em' }}>
                    {campName} 후기
                </Typography>
                <IconButton aria-label="close" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent>
                {/* 이미지 */}
                <Box sx={{ mb: 3 }}>
                    {review?.images && review.images.length > 0 ? (
                        <ImageCarousel images={review.images} />
                    ) : (
                        <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <img
                                src="/default/review-image.jpg"
                                alt="기본 이미지"
                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                            />
                        </Box>
                    )}
                </Box>

                {/* 제목 */}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', textIndent: '1em', mb: 2 }}>
                    {review?.title}
                </Typography>

                {/* 내용 */}
                <Typography variant="body1" sx={{ textIndent: '1em', mb: 3 }}>
                    {review?.content}
                </Typography>

                {/* 추천 버튼 */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 2 }}>
                    <Button
                        variant={review?.isRecommend ? "contained" : "outlined"}
                        color={review?.isRecommend ? "primary" : "inherit"}
                        disabled
                        startIcon={<ThumbUpIcon />}
                        sx={{
                            minWidth: '100px',
                            bgcolor: review?.isRecommend ? 'primary.main' : 'transparent',
                            color: review?.isRecommend ? 'white' : 'text.secondary',
                            borderColor: review?.isRecommend ? 'primary.main' : 'grey.300',
                            '&.Mui-disabled': {
                                bgcolor: review?.isRecommend ? 'primary.main' : 'transparent',
                                color: review?.isRecommend ? 'white' : 'text.secondary',
                                borderColor: review?.isRecommend ? 'primary.main' : 'grey.300',
                            }
                        }}
                    >
                        추천
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default ReviewModal;