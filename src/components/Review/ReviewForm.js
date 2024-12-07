import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import { 
    Close as CloseIcon,
    ThumbUp as ThumbUpIcon 
} from '@mui/icons-material';
import ImageUploader from '../ImageUploader';

function ReviewForm({ open, onClose, onSubmit, initialData = null, campName }) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',      // title 추가
        content: initialData?.content || '',
        recommended: initialData?.recommended || false,
        images: initialData?.images || []
    });

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}>
                <Typography variant="h6">
                    {campName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        variant={formData.recommended ? "contained" : "outlined"}
                        color={formData.recommended ? "primary" : "inherit"}
                        startIcon={<ThumbUpIcon />}
                        onClick={() => setFormData(prev => ({ ...prev, recommended: !prev.recommended }))}
                        sx={{
                            minWidth: '100px',
                            bgcolor: formData.recommended ? 'primary.main' : 'transparent',
                            '&:hover': {
                                bgcolor: formData.recommended ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        추천
                    </Button>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Box>

            <DialogContent>
                <Box sx={{ my: 2 }}>
                    <ImageUploader
                        images={formData.images}
                        onChange={(images) => setFormData(prev => ({ ...prev, images }))}
                    />
                </Box>

                <TextField
                    fullWidth
                    label="제목"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="후기 내용"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                />
            </DialogContent>

            <DialogActions sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'center',
                gap: 2 
            }}>
                {initialData && (
                    <Button 
                        onClick={onClose}
                        variant="outlined"
                        color="error"
                        sx={{ minWidth: '120px' }}
                    >
                        삭제
                    </Button>
                )}
                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        minWidth: '120px',
                        bgcolor: '#FCD34D',
                        '&:hover': {
                            bgcolor: '#F6AD55'
                        }
                    }}
                >
                    {initialData ? '수정 완료' : '작성 완료'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ReviewForm;