import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApi } from 'hooks/useApi';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchBar from 'components/SearchBar';
import CampingCard from 'components/CampingCard';
import ScrollToTopFab from 'components/ScrollToTopFab';
import { searchInfoService } from 'api/services/searchInfoService';
import { useLocation, useNavigate } from 'react-router-dom';

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

        if (city || keyword) {
            const initialSearchParams = {
                page: 0,
                size: 12,
                city: city,
                keyword: keyword
            };
            setCamps([]);
            setPage(0);
            searchCamps(initialSearchParams);
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
            const newCamps = data?.content || [];

            setCamps((prev) => [...prev, ...newCamps]);
            setPage((prev) => prev + 1);
            setHasMore(data.totalElements > (page + 1) * 12);
        } catch (error) {
            console.error('캠핑장 검색 중 오류 발생:', error);
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
            { threshold: 1.0 }
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

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <SearchBar
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    initialCity={searchParams.city}
                    initialKeyword={searchParams.keyword}
                />
            </Box>

            {camps.length === 0 && !isLoading && (
                <Typography variant="h6" textAlign="center" sx={{ my: 4 }}>
                    검색 결과가 없습니다.
                </Typography>
            )}

            <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center', px: 4 }}>
                {camps.map((camp) => (
                    <Grid item xs={12} sm={6} md={4} key={camp.campId}>
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
                        />
                    </Grid>
                ))}
            </Grid>

            <div id="load-more-trigger" style={{ height: '1px' }} />

            <ScrollToTopFab />
        </Container>
    );
}

export default Search;