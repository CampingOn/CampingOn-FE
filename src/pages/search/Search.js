import React, { useState, useEffect } from 'react';
import { useApi } from 'hooks/useApi';
import { Box, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchBar from 'components/SearchBar';
import CampingCard from 'components/CampingCard';
import LoadMoreButton from 'components/LoadMoreButton';
import ScrollToTopFab from 'components/ScrollToTopFab';
import {searchInfoService} from "api/services/searchInfoService";

function Search() {
    const [camps, setCamps] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchParams, setSearchParams] = useState({
        city: '', // URL 파라미터나 상태에서 초기값 가져오기
        keyword: ''
    });

    const {
        execute: searchCamps,
        loading: isLoading,
        error,
        data: searchResults
    } = useApi(searchInfoService.searchCamps);

    // 첫 로딩 시 전체 데이터를 가져오는 효과
    useEffect(() => {
        loadCamps(true);  // 컴포넌트 마운트 시 초기 데이터 로드
    }, []);

    // 검색 파라미터 변경 시에만 새로운 검색 수행
    useEffect(() => {
        if (searchParams.city || searchParams.keyword) {
            loadCamps(true);
        }
    }, [searchParams]);

    const loadCamps = async (newSearch = false) => {
        try {
            const currentPage = newSearch ? 0 : page;
            const params = {
                city: searchParams.city,
                name: searchParams.keyword,
                page: currentPage,  // 페이지 파라미터 추가
                size: 12           // 사이즈도 명시적으로 전달
            };

            const data = await searchCamps(params);
            const newCamps = data?.content || [];

            if (newSearch) {
                setCamps(newCamps);  // 새로운 검색시 데이터 초기화
                setPage(1);         // 다음 페이지를 위해 1로 설정
            } else {
                setCamps(prev => [...prev, ...newCamps]);  // 기존 데이터에 추가
                setPage(prev => prev + 1);
            }

            // totalElements를 사용하여 더 정확한 hasMore 계산
            setHasMore(data.totalElements > (currentPage + 1) * 12);

        } catch (error) {
            console.error('캠핑장 검색 중 오류 발생:', error);
            if (newSearch) {
                setCamps([]);
                setPage(0);
            }
        }
    };


    const handleSearch = (searchValues) => {
        setCamps([]);
        setPage(0);
        setSearchParams(searchValues);
        loadCamps(true);
    };

    const handleLoadMore = () => {
        loadCamps();  // 추가 데이터 로드
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* 검색바 */}
            <Box sx={{ mb: 4 }}>
                <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </Box>

            {/* 검색 결과가 없을 때 메시지 */}
            {camps.length === 0 && !isLoading && (
                <Typography variant="h6" textAlign="center" sx={{ my: 4 }}>
                    검색 결과가 없습니다.
                </Typography>
            )}

            {/* 캠핑장 카드 그리드 */}
            <Grid container spacing={4} sx={{ mb: 4, justifyContent: 'center', px: 4 }}>
                {camps.map((camp) => (
                    <Grid item xs={12} sm={6} md={4} key={camp.campId}>
                        <CampingCard
                            thumbImage={camp.thumbImage}
                            name={camp.name}
                            address={camp.streetAddr}  // address.streetAddr -> streetAddr로 수정
                            keywords={camp.keywords}
                            lineIntro={camp.lineIntro}
                            marked={camp.isMarked}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* 더보기 버튼 */}
            {camps.length > 0 && (
                <LoadMoreButton
                    onClick={handleLoadMore}
                    isLoading={isLoading}
                    hasMore={hasMore}
                    disabled={!hasMore || isLoading}
                />
            )}

            {/* 위로가기 버튼 */}
            <ScrollToTopFab />
        </Container>
    );
}

export default Search;