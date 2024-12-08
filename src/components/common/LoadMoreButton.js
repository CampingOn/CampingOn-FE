import React from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function LoadMoreButton({
                            onClick,
                            isLoading = false,
                            hasMore = true,
                            disabled = false
                        }) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
                width: '100%'
            }}
        >
            {hasMore && (
                <Button
                    variant="outlined"
                    onClick={onClick}
                    disabled={disabled || isLoading}
                    sx={{
                        width: '250px',
                        borderRadius: '20px',
                        color: '#FFC107',
                        borderColor: '#FFC107',
                        '&:hover': {
                            borderColor: '#E5AD06',
                            color: '#E5AD06',
                            backgroundColor: 'rgba(255, 193, 7, 0.04)'
                        }
                    }}
                >
                    {isLoading ? (
                        <CircularProgress size={24} sx={{ color: '#FFC107' }} />
                    ) : (
                        <ExpandMoreIcon fontSize="large" />
                    )}
                </Button>
            )}
        </Box>
    );
}

export default LoadMoreButton;