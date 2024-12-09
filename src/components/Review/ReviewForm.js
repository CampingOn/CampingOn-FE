import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    DialogTitle,
    DialogContentText,
} from '@mui/material';
import {
    Close as CloseIcon,
    ThumbUp as ThumbUpIcon
} from '@mui/icons-material';
import ImageUploader from './ImageUploader';

function ReviewForm({open, onClose, onSubmit, campName}) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        isRecommend: false,
        images: []
    });
    // 확인 다이얼로그 상태
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');

    const handleSubmitClick = () => {
        setConfirmDialogOpen(true);
    };

    const handleConfirmedSubmit = async () => {
        try {
            await onSubmit(formData);
            setConfirmDialogOpen(false);
            onClose();
        } catch (error) {
            console.error('리뷰 저장 실패:', error);
        }
    };

    // 필수 입력값 검증
    const isFormValid = formData.title.trim() !== '' && formData.content.trim() !== '';

    const handleTitleChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({...prev, title: value}));
        setTitleError(value.trim() === '' ? '제목을 입력하세요.' : '');
    };

    const handleContentChange = (e) => {
        const value = e.target.value;
        setFormData(prev => ({...prev, content: value}));
        setContentError(value.trim() === '' ? '내용을 입력하세요.' : '');
    };

    // 입력창 공통 스타일
    const commonTextFieldStyles = {
        '& .MuiOutlinedInput-root': {
            '& .MuiOutlinedInput-input': {
                '&::selection': {
                    backgroundColor: 'transparent'
                },
                '&:focus': {
                    outline: 'none'
                }
            },
            '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)'
            },
            '&:hover fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)'
            },
            // focused 스타일 수정
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.23) !important',
                borderWidth: 1
            },
            '&.Mui-focused fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23) !important',
                borderWidth: 1
            }
        },
        // 라벨 스타일 수정
        '& .MuiInputLabel-root.Mui-focused': {
            color: 'rgba(0, 0, 0, 0.6) !important'
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                        {campName}
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                        >
                            <CloseIcon/>
                        </IconButton>
                    </Box>
                </Box>

                <DialogContent>
                    <Box sx={{my: 2}}>
                        <ImageUploader
                            images={formData.images}
                            onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                        />
                    </Box>

                    <TextField
                        fullWidth
                        label="제목"
                        required
                        value={formData.title}
                        onChange={handleTitleChange}
                        onBlur={() => setTitleError(formData.title.trim() === '' ? '제목을 입력하세요.' : '')}
                        error={!!titleError}
                        helperText={titleError}
                        sx={{mb: 2, ...commonTextFieldStyles}}
                    />

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="후기 내용"
                        required
                        value={formData.content}
                        onChange={handleContentChange}
                        onBlur={() => setContentError(formData.content.trim() === '' ? '내용을 입력하세요.' : '')}
                        error={!!contentError}
                        helperText={contentError}
                        sx={commonTextFieldStyles}
                    />

                    <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1}}>
                        <Button
                            variant={formData.isRecommend ? "contained" : "outlined"}
                            color={formData.isRecommend ? "primary" : "inherit"}
                            startIcon={<ThumbUpIcon/>}
                            onClick={() => setFormData(prev => ({...prev, isRecommend: !prev.isRecommend}))}
                            sx={{
                                minWidth: '100px',
                                bgcolor: formData.isRecommend ? 'primary.main' : 'transparent',
                                '&:hover': {
                                    bgcolor: formData.isRecommend ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            추천
                        </Button>
                    </Box>
                </DialogContent>

                <DialogActions sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2
                }}>
                    <Button
                        onClick={handleSubmitClick}
                        variant="contained"
                        disabled={!isFormValid}
                        sx={{
                            minWidth: '120px',
                            bgcolor: isFormValid ? '#FCD34D' : '#E5E7EB',
                            '&:hover': {
                                bgcolor: isFormValid ? '#F6AD55' : '#E5E7EB'
                            }
                        }}
                    >
                        작성 완료
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 확인 다이얼로그 */}
            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
            >
                <DialogTitle>후기 작성 확인</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        작성된 후기는 수정 및 삭제가 불가능합니다.
                        그래도 작성하시겠습니까?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleConfirmedSubmit} color="warning" variant="contained">
                        작성
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ReviewForm;