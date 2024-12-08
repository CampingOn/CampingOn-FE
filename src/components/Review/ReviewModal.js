import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';
import { ThumbUp as ThumbUpIcon } from '@mui/icons-material';
import { YellowButton, ImageCarousel } from 'components';

function ReviewModal({ 
    open, 
    onClose,
    review = {},
    onEdit, 
    onDelete,
    isOwner = false,
    campName
}) {
    const [confirmOpen, setConfirmOpen] = React.useState(false);

    const handleDelete = () => {
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        onDelete();
        setConfirmOpen(false);
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {campName} 후기 상세
                </DialogTitle>
                <DialogContent>
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
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        {review.content}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                            variant={review.recommended ? "contained" : "outlined"}
                            color={review.recommended ? "primary" : "inherit"}
                            disabled
                            startIcon={<ThumbUpIcon />}
                            sx={{
                                minWidth: '100px',
                                bgcolor: review.recommended ? 'primary.main' : 'transparent',
                                color: review.recommended ? 'white' : 'text.secondary',
                                borderColor: review.recommended ? 'primary.main' : 'grey.300',
                                '&.Mui-disabled': {
                                    bgcolor: review.recommended ? 'primary.main' : 'transparent',
                                    color: review.recommended ? 'white' : 'text.secondary',
                                    borderColor: review.recommended ? 'primary.main' : 'grey.300',
                                }
                            }}
                        >
                            추천
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    gap: 1,
                    pb: 2 
                }}>
                    {isOwner && (
                        <>
                            <YellowButton 
                                onClick={onEdit}
                            >
                                수정
                            </YellowButton>
                            <Button 
                                onClick={handleDelete}
                                variant="contained"
                                color="error"
                            >
                                삭제
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>후기 삭제</DialogTitle>
                <DialogContent>
                    <Typography>정말 후기를 삭제하시겠습니까?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>취소</Button>
                    <Button 
                        onClick={handleConfirmDelete} 
                        color="error" 
                        variant="contained"
                    >
                        삭제
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ReviewModal;

