import React, { useEffect, useState } from 'react';
import { useApi } from 'hooks/useApi';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from "@mui/material";
import { campService } from '../../api/services/campService';
import CampingCard from '../../components/CampingCard';
import LoadMoreButton from "../../components/LoadMoreButton";
import ScrollToTopFab from "../../components/ScrollToTopFab";

function Home() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem("accessToken");
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

    const hasMore = popularCampsData?.content?.length % 9 === 0;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
                                {...camp}
                                onClick={() => handleCardClick(camp.campId)}
                            />
                        ))}
                    </Box>
                </>
            )}

            <Typography variant="h5" fontWeight="bold" sx={{ mb: 4 }}>
                인기 캠핑장
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
                {camps.map((camp) => (
                    <CampingCard
                        key={camp.campId}
                        {...camp}
                        onClick={() => handleCardClick(camp.campId)}
                    />
                ))}
            </Box>

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