import React, { useEffect, useState } from 'react';
import { useApi } from 'hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from "@mui/material";
import { campService } from '../../api/services/campService';
import CampingCard from '../../components/CampingCard';
import LoadMoreButton from "../../components/LoadMoreButton";
import ScrollToTopFab from "../../components/ScrollToTopFab";
import MainCarousel from "../../components/MainCarousel";
import SearchBar from "../../components/SearchBar";
import {useAuth} from "../../context/AuthContext";
import Grid from "@mui/material/Grid";

function Home() {
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();
    const [camps, setCamps] = useState([]);
    const [page, setPage] = useState(0);

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

    useEffect(() => {
        executePopularCamps(0, 9);
        if (isAuthenticated) {
            executeMatchedCamps(0, 3);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (popularCampsData?.content) {
            if (page === 0) {
                setCamps(popularCampsData.content);
            } else {
                setCamps(prev => [...prev, ...popularCampsData.content]);
            }
        }
    }, [popularCampsData]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        executePopularCamps(nextPage, 9);
        setPage(nextPage);
    };

    const handleCardClick = (campId) => {
        navigate(`/camps/${campId}`);
    };

    const handleSearch = ({ city, keyword }) => {
        // Query parameters 생성
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (keyword) params.append('keyword', keyword);

        // /search로 네비게이트
        navigate(`/search?${params.toString()}`);
    };

    const hasMore = popularCampsData?.content?.length % 9 === 0;

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

            {camps.length > 0 && (
                <LoadMoreButton
                    onClick={handleLoadMore}
                    isLoading={loadingPopularCamps}
                    hasMore={hasMore}
                    disabled={!hasMore || loadingPopularCamps}
                />
            )}

            <ScrollToTopFab />
        </Container>
    );
}

export default Home;
