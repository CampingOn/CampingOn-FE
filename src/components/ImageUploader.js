import React, { useState, useCallback, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    ImageList,
    ImageListItem,
    styled
} from '@mui/material';
import { CloudUpload, Close } from '@mui/icons-material';

// 드래그 앤 드롭 영역에 대한 스타일 컴포넌트
const UploadArea = styled(Box)(({ theme, isDragging }) => ({
    border: `2px dashed ${isDragging ? theme.palette.primary.main : theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    backgroundColor: isDragging ? theme.palette.action.hover : theme.palette.background.paper,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    '&:hover': {
        backgroundColor: theme.palette.action.hover,
    }
}));

// 이미지 미리보기 컨테이너 스타일
const PreviewContainer = styled(Box)({
    position: 'relative',
    '&:hover .delete-button': {
        opacity: 1,
    }
});

// 삭제 버튼 스타일
const DeleteButton = styled(IconButton)({
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    }
});

const ImageUploader = ({ onChange, images: initialImages = [] }) => {
    const [images, setImages] = useState(initialImages.map(file => ({    // 여기서 image를 파라미터로 받음
        file,
        preview: typeof file === 'string' ? file : URL.createObjectURL(file)
    })));
    const [isDragging, setIsDragging] = useState(false);

    // 파일 유효성 검사 함수
    const validateFile = (file) => {
        // 파일 타입 검사
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return false;
        }

        // 파일 크기 검사 (10MB)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('파일 크기는 10MB를 초과할 수 없습니다.');
            return false;
        }

        return true;
    };

    // 파일 처리 함수
    const handleFiles = useCallback((files) => {
        const fileList = Array.from(files);

        // 최대 5개 제한
        if (images.length + fileList.length > 5) {
            alert('이미지는 최대 5개까지만 업로드 가능합니다.');
            return;
        }

        // 파일 유효성 검사 및 미리보기 URL 생성
        const validFiles = fileList.filter(validateFile);
        const newImages = validFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));

        setImages(prev => {
            const updated = [...prev, ...newImages];
            onChange(updated.map(img => img.file));  // 여기도 변경
            return updated;
        });
    }, [images, onChange]);

    // 드래그 앤 드롭 이벤트 핸들러
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    }, [handleFiles]);

    // 파일 선택 핸들러
    const handleFileSelect = useCallback((e) => {
        handleFiles(e.target.files);
    }, [handleFiles]);

    // 이미지 삭제 핸들러
    const handleDeleteImage = useCallback((index) => {
        setImages(prev => {
            const updated = prev.filter((_, i) => i !== index);
            onChange(updated.map(img => img.file));  // 여기도 변경
            return updated;
        });
    }, [onChange]);

    // 컴포넌트 언마운트 시 미리보기 URL 정리
    useEffect(() => {
        return () => {
            images.forEach(image => URL.revokeObjectURL(image.preview));
        };
    }, [images]);

    useEffect(() => {
        if (initialImages.length > 0) {
            const formattedImages = initialImages.map(file => ({  // image를 file로 변경
                file,
                preview: typeof file === 'string' ? file : URL.createObjectURL(file)  // image를 file로 변경
            }));
            setImages(formattedImages);
            onChange(initialImages);
        }
    }, [initialImages, onChange]);

    return (
        <Box>
            <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                id="image-upload-input"
                onChange={handleFileSelect}
            />
            <label htmlFor="image-upload-input">
                <UploadArea
                    isDragging={isDragging}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <CloudUpload sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                    <Typography variant="body1">
                        이미지를 끌어다 놓거나 클릭하여 업로드하세요
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        최대 5개, 각 10MB 이하의 이미지 파일
                    </Typography>
                </UploadArea>
            </label>

            {images.length > 0 && (
                <ImageList sx={{ mt: 2 }} cols={4} gap={8}>
                    {images.map((image, index) => (
                        <ImageListItem key={index}>
                            <PreviewContainer>
                                <img
                                    src={image.preview}
                                    alt={`preview-${index}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <DeleteButton
                                    className="delete-button"
                                    size="small"
                                    onClick={() => handleDeleteImage(index)}
                                >
                                    <Close />
                                </DeleteButton>
                            </PreviewContainer>
                        </ImageListItem>
                    ))}
                </ImageList>
            )}
        </Box>
    );
};

export default ImageUploader;