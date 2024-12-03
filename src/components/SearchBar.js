import React, { useState } from 'react';
import { TextField, Autocomplete, Button, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

function SearchBar({ onSearch }) {
    const [city, setCity] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [keywordSuggestions, setKeywordSuggestions] = useState([]);

    const cityOptions = [
        '서울특별시', '부산광역시', '대구광역시', '인천광역시',
        '광주광역시', '대전광역시', '울산광역시', '세종특별자치시',
        '경기도', '강원도', '충청북도', '충청남도',
        '전라북도', '전라남도', '경상북도', '경상남도',
        '제주특별자치도'
    ];

    const handleSearch = () => {
        // 검색어를 suggestions에 추가
        if (keyword && !keywordSuggestions.includes(keyword)) {
            setKeywordSuggestions(prev => [...prev, keyword].slice(-5)); // 최근 5개만 유지
        }
        onSearch({
            city: city || '',
            keyword
        });
    };

    const commonStyles = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '15px'
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'flex-end',
            width: '100%'
        }}>
            <Autocomplete
                sx={{
                    width: '30%',
                    ...commonStyles
                }}
                options={cityOptions}
                value={city}
                onChange={(event, newValue) => setCity(newValue)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="전체 시/도"
                        variant="outlined"
                        size="small"
                    />
                )}
                freeSolo
                autoSelect
            />
            <Autocomplete
                sx={{
                    width: '50%',
                    ...commonStyles
                }}
                freeSolo
                options={keywordSuggestions}
                value={keyword}
                onChange={(event, newValue) => setKeyword(newValue || '')}
                onInputChange={(event, newValue) => setKeyword(newValue)}
                disableClearable
                renderInput={(params) => {
                    const modifiedParams = {
                        ...params,
                        InputProps: {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    {keyword && (
                                        <IconButton
                                            size="small"
                                            onClick={() => setKeyword('')}
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                    {params.InputProps.endAdornment}
                                </>
                            )
                        }
                    };
                    return (
                        <TextField
                            {...modifiedParams}
                            label="키워드"
                            placeholder="검색어를 입력하세요"
                            size="small"
                            variant="outlined"
                        />
                    );
                }}
            />
            <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                sx={{
                    width: '20%',
                    bgcolor: '#FCD34D',
                    '&:hover': {
                        bgcolor: '#F6AD55',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        opacity: 0.9
                    },
                    px: 3,
                    py: 1,
                    borderRadius: '10px',
                    height: '40px'
                }}
            >
                검색
            </Button>
        </Box>
    );
}

export default SearchBar;