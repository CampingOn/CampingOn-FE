import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useApi } from 'hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from "@mui/material";
import { campService } from '../../api/services/campService';
import CampingCard from '../../components/CampingCard';
import ScrollToTopFab from "../../components/ScrollToTopFab";
import MainCarousel from "../../components/MainCarousel";
import SearchBar from "../../components/SearchBar";
import { useAuth } from "../../context/AuthContext";
import Grid from "@mui/material/Grid";

function Home() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [camps, setCamps] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true); // 로드 가능한지 여부

    const {
        data: popularCampsData,
        loading: loadingPopularCamps,
        error: errorPopularCamps,
        execute: executePopularCamps
    } = useApi(campService.getPopularCamps);

    const {
        data: matchedCampsData,
        loading: loadingMatchedCamps,
        error: errorMatchedCamps,
        execute: executeMatchedCamps
    } = useApi(campService.getMatchedCamps);

    const observerRef = useRef(null); // Intersection Observer 참조

    useEffect(() => {
        executePopularCamps(0, 9);
        if (isAuthenticated) {
            executeMatchedCamps(0, 3);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (popularCampsData?.content) {
            setCamps((prev) => (page === 0 ? popularCampsData.content : [...prev, ...popularCampsData.content]));
            setHasMore(popularCampsData.content.length === 9); // 9개씩 로드되었는지 확인
        }
    }, [popularCampsData]);

    const handleCardClick = (campId) => {
        navigate(`/camps/${campId}`);
    };

    const handleSearch = ({ city, keyword }) => {
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (keyword) params.append('keyword', keyword);
        navigate(`/search?${params.toString()}`);
    };

    // Intersection Observer의 콜백
    const loadMore = useCallback(
        (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && hasMore && !loadingPopularCamps) {
                const nextPage = page + 1;
                executePopularCamps(nextPage, 9);
                setPage(nextPage);
            }
        },
        [page, hasMore, loadingPopularCamps, executePopularCamps]
    );

    // Intersection Observer 설정
    useEffect(() => {
        const observer = new IntersectionObserver(loadMore, { threshold: 1.0 });
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [loadMore]);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* 캐러셀 영역 */}
            <Box mb={4}>
                <MainCarousel />
            </Box>
            {/* 검색창 영역 */}
            <Box mb={4}>
                <SearchBar onSearch={handleSearch} isLoading={false}/>
            </Box>
            {/* 추천 캠핑장 목록 */}
            {isAuthenticated && matchedCampsData?.content?.length > 0 && (
                <>
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
                        {matchedCampsData.content[0]?.username}님을 위한 추천 캠핑장
                    </Typography>
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
                        {matchedCampsData.content.map((camp) => (
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
                        ))}
                    </Box>
                </>
            )}

            {/* 인기 캠핑장 목록 */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
                인기 캠핑장
            </Typography>
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

            {/* 무한 스크롤을 위한 Intersection Observer 트리거 */}
            <div ref={observerRef} style={{ height: '1px' }} />

            <ScrollToTopFab />
        </Container>
    );
}

export default Home;
