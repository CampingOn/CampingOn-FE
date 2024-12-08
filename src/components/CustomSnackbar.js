import { Snackbar, Alert, Grow } from '@mui/material';

const CustomSnackbar = ({ open, message, severity, onClose }) => {
    return (
        <Snackbar 
            open={open} 
            autoHideDuration={2000} 
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            TransitionComponent={Grow}
            TransitionProps={{
                style: {
                    transformOrigin: 'center top'
                }
            }}
        >
            <Alert 
                onClose={onClose} 
                severity={severity}
                sx={{
                    width: '100%',
                    animation: 'bounceIn 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    '&.MuiAlert-standardSuccess': {
                        backgroundColor: 'white',
                        color: '#ff6927',
                        border: '1px solid #ff6927',
                        '& .MuiAlert-icon': {
                            color: '#ff6927'
                        }
                    },
                    '&.MuiAlert-standardError': {
                        backgroundColor: 'white',
                        color: '#d32f2f',
                        border: '1px solid #d32f2f',
                        '& .MuiAlert-icon': {
                            color: '#d32f2f'
                        }
                    },
                    '@keyframes bounceIn': {
                        '0%': { 
                            transform: 'translateY(-40px)'
                        },
                        '45%': { 
                            transform: 'translateY(15px)'
                        },
                        '70%': { 
                            transform: 'translateY(-10px)'
                        },
                        '85%': { 
                            transform: 'translateY(5px)'
                        },
                        '100%': { 
                            transform: 'translateY(0)'
                        }
                    }
                }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
};

export default CustomSnackbar; 