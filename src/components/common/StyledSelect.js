import { styled } from '@mui/material/styles';
import { Select } from '@mui/material';

const StyledSelect = styled(Select)({
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(0, 0, 0, 0.23)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ffc400',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#ffc400',
    },
    '&.Mui-focused + .MuiInputLabel-root': {
        color: '#ffc400',
    },
});

export default StyledSelect;