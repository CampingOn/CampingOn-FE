import React, {useEffect, useState, useRef, useCallback} from "react";
import {useApi} from "hooks/useApi";
import {useNavigate} from "react-router-dom";
import {Box, Container, Typography} from "@mui/material";
import {campService} from "../../api/services/campService";
import {searchInfoService} from "../../api/services/searchInfoService";
import {CampingCard, ScrollToTopFab, MainCarousel, SearchBar, } from 'components';
import {useAuth} from "../../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";

function Home() {
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();
    const [camps, setCamps] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true); // 로드 가능한지 여부
    const [snackbarNone, setSnackbarNone] = useState(false);
    const [snackbarBookmark, setSnackbarBookmark] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const handleCloseNone = () => {
        setSnackbarNone(false);
    };

    const handleCloseBookmark = () => {
        setSnackbarBookmark(false);
    };

    const showSnackbarNone = () => {
        setSnackbarMessage("회원만 이용할 수 있는 기능입니다.");
        setSnackbarNone(true);
    };

    const showSnackbarBookmark = () => {
        setSnackbarMessage("찜 상태를 변경하였습니다.");
        setSnackbarBookmark(true);
    };

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
    } = useApi(searchInfoService.getMatchedCamps);

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

    const handleSearch = ({city, keyword}) => {
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
        const observer = new IntersectionObserver(loadMore, {threshold: 1.0});
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [loadMore]);

    return (
        <Container style={{ padding: '0', marginTop: '60px' }}>
            {/* 캐러셀 영역 */}
            <Box mb={4}>
                <MainCarousel/>
            </Box>
            {/* 검색창 영역 */}
            <Box
                mb={4}
                sx={{
                    display: "flex",        // Flexbox 활성화
                    justifyContent: "center", // 가로 방향 중앙 정렬
                    alignItems: "center",    // 세로 방향 중앙 정렬 (필요 시)
                }}
            >
                <SearchBar onSearch={handleSearch} isLoading={false} />
            </Box>
            {/* 추천 캠핑장 목록 */}
            {isAuthenticated && matchedCampsData?.content?.length > 0 && (
                <>
                    <Typography variant="h5" fontWeight="bold" sx={{mb: 4}}>
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
                        mb: 4,
                        width: '100%',
                        margin: '0 auto'
                    }}>
                        {matchedCampsData.content.map((camp) => (
                            <CampingCard
                                key={camp.campId}
                                campId={camp.campId}
                                thumbImage={camp.thumbImage}
                                name={camp.name}
                                address={camp.streetAddr}
                                keywords={camp.keywords || []}
                                lineIntro={camp.lineIntro || `${camp.streetAddr.split(' ').slice(0, 2).join(' ')}에 있는 ${camp.name}`}
                                marked={camp.marked}
                                onClick={() => handleCardClick(camp.campId)}
                                onShowSnackbarNone={showSnackbarNone}
                                onShowSnackbarBookmark={showSnackbarBookmark}
                                className="border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
                            />
                        ))}
                    </Box>
                </>
            )}

            {/* 인기 캠핑장 목록 */}
            <Typography variant="h5" fontWeight="bold" sx={{mb: 4}}>
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
                mb: 4,
                width: '100%',
                margin: '0 auto'
            }}>
                {camps.map((camp) => (
                    <CampingCard
                        key={camp.campId}
                        campId={camp.campId}
                        thumbImage={camp.thumbImage}
                        name={camp.name}
                        address={camp.streetAddr}
                        keywords={camp.keywords || []}
                        lineIntro={camp.lineIntro || `${camp.city} ${camp.state}에 있는 ${camp.name}`}
                        marked={camp.marked}
                        onClick={() => handleCardClick(camp.campId)}
                        onShowSnackbarNone={showSnackbarNone}
                        onShowSnackbarBookmark={showSnackbarBookmark}
                        className="border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
                    />
                ))}
            </Box>

            {/* 무한 스크롤을 위한 Intersection Observer 트리거 */}
            <div ref={observerRef} style={{height: '1px'}}/>

            <Snackbar
                open={snackbarNone}
                autoHideDuration={1500}
                onClose={handleCloseNone}
                message={snackbarMessage}
            />
            <Snackbar
                open={snackbarBookmark}
                autoHideDuration={1500}
                onClose={handleCloseBookmark}
                message={snackbarMessage}
            />

            <ScrollToTopFab/>
        </Container>
    );
}

export default Home;
