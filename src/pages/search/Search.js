import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApi } from 'hooks/useApi';
import { Box, Container, Typography, CircularProgress } from '@mui/material';
import {ScrollToTopFab, SearchBar, CampingCard,  NoResultsFound} from 'components';
import { searchInfoService } from 'api/services/searchInfoService';
import { useLocation, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';

function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const [camps, setCamps] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchParams, setSearchParams] = useState({
        city: '',
        keyword: ''
    });
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarNone, setSnackbarNone] = useState(false);
    const [snackbarBookmark, setSnackbarBookmark] = useState(false);

    const observerRef = useRef(null); // Intersection Observer ref

    const {
        execute: searchCamps,
        loading: isLoading,
        data: searchResults
    } = useApi(searchInfoService.searchCamps);

    // URL 파라미터에서 검색값 초기화 및 검색 실행
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const city = params.get('city') || '';
        const keyword = params.get('keyword') || '';

        setSearchParams({ city, keyword });
        setCamps([]); // 캠프 목록 초기화
        setPage(0);   // 페이지 초기화
        setHasMore(true); // hasMore 초기화

        if (city || keyword) {
            const initialSearchParams = {
                page: 0,
                size: 12,
                city: city,
                keyword: keyword
            };
            searchCamps(initialSearchParams).then(data => {
                if (data?.content) {
                    setCamps(data.content);
                    setHasMore(data.totalElements > 12);
                    setPage(1); // 다음 페이지를 위해 1로 설정
                }
            });
        }
    }, [location.search]);

    // 무한 스크롤 데이터 로드
    const loadCamps = useCallback(async () => {
        if (isLoading || !hasMore) return;

        try {
            const params = {
                page,
                size: 12,
                city: searchParams.city,
                keyword: searchParams.keyword
            };
            const data = await searchCamps(params);

            if (data?.content) {
                setCamps(prev => [...prev, ...data.content]);
                setHasMore(data.totalElements > (page + 1) * 12);
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('캠핑장 검색 중 오류 발생:', error);
            setHasMore(false);
        }
    }, [page, hasMore, isLoading, searchParams, searchCamps]);

    // Intersection Observer 설정
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    loadCamps();
                }
            },
            {threshold: 1.0}
        );

        const target = document.querySelector('#load-more-trigger');
        if (target) observer.observe(target);
        observerRef.current = observer;

        return () => observer.disconnect();
    }, [loadCamps, hasMore, isLoading]);

    const handleCardClick = (campId) => {
        navigate(`/camps/${campId}`);
    };

    const handleSearch = (searchValues) => {
        const params = new URLSearchParams();
        if (searchValues.city) params.append('city', searchValues.city);
        if (searchValues.keyword) params.append('keyword', searchValues.keyword);
        navigate(`/search?${params.toString()}`);

        setCamps([]);
        setPage(0);
        setSearchParams(searchValues);
    };

    const showSnackbarNone = () => {
        setSnackbarMessage('회원만 이용할 수 있는 기능입니다');
        setSnackbarNone(true);
    };

    const showSnackbarBookmark = () => {
        setSnackbarMessage('찜 상태를 변경하였습니다');
        setSnackbarBookmark(true);
    };

    const handleCloseNone = () => {
        setSnackbarNone(false);
    };

    const handleCloseBookmark = () => {
        setSnackbarBookmark(false);
    };

    return (
        <Container maxWidth="lg" sx={{py: 4}}>
            <Box sx={{mb: 4}}>
                <SearchBar
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    initialCity={searchParams.city}
                    initialKeyword={searchParams.keyword}
                />
            </Box>

            {camps.length === 0 && !isLoading && (
                <NoResultsFound />
            )}

            <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    lg: 'repeat(3, 1fr)'
                },
                gap: 3,
                mb: 4
            }}>
                {camps.map((camp) => (
                    <CampingCard
                        key={camp.campId}
                        campId={camp.campId}
                        thumbImage={camp.thumbImage}
                        name={camp.name}
                        address={camp.streetAddr}
                        keywords={camp.keywords || []}
                        lineIntro={camp.lineIntro}
                        marked={camp.marked}
                        onClick={() => handleCardClick(camp.campId)}
                        onShowSnackbarNone={showSnackbarNone}   // 전달
                        onShowSnackbarBookmark={showSnackbarBookmark} // 전달
                    />
                ))}
            </Box>

            <div id="load-more-trigger" style={{height: '1px'}}/>

            {/* Snackbar 컴포넌트 */}
            <Snackbar
                open={snackbarNone}
                autoHideDuration={6000}
                onClose={handleCloseNone}
                message={snackbarMessage}
            />
            <Snackbar
                open={snackbarBookmark}
                autoHideDuration={6000}
                onClose={handleCloseBookmark}
                message={snackbarMessage}
            />

            <ScrollToTopFab/>
        </Container>
    );
}

export default Search;