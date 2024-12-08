import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Button, Box, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

function SearchBar({ onSearch, isLoading, initialCity = '', initialKeyword = '' }) {
    const [city, setCity] = useState(initialCity);
    const [keyword, setKeyword] = useState(initialKeyword);
    const [keywordSuggestions, setKeywordSuggestions] = useState([]);

    useEffect(() => {
        setCity(initialCity);
        setKeyword(initialKeyword);
    }, [initialCity, initialKeyword]);

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
        // 검색어 앞뒤 공백 제거
        const trimmedKeyword = keyword ? keyword.trim() : '';
        onSearch({ 
            city: city || '', 
            keyword: trimmedKeyword
        });
    };

    // Enter 키 이벤트 처리 추가
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const commonStyles = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '15px',
            '& .MuiOutlinedInput-input': {
                '&::selection': {
                    backgroundColor: 'transparent'
                },
                // 파란색 포커스 효과 제거
                '&:focus': {
                    outline: 'none'
                }
            }
        },
        // Autocomplete의 파란색 포커스 효과 제거
        '& .MuiAutocomplete-input': {
            '&:focus': {
                outline: 'none !important',
                boxShadow: 'none !important'
            }
        },
        // focused 스타일을 밖으로 이동
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#F6AD55 !important',
            borderWidth: 2
        },
        // 라벨 스타일을 별도로 지정
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#F6AD55 !important'
        }
    };

    // 검색 버튼 비활성화 조건 추가
    const isSearchDisabled = (!city && !keyword.trim()) || isLoading;

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
                onKeyDown={handleKeyPress}
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
                disabled={isSearchDisabled}
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