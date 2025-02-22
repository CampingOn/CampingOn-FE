import React, {useEffect, useState, useRef, useCallback} from "react";
import {useApi} from "hooks/useApi";
import {useNavigate} from "react-router-dom";
import {Box, Container, Typography} from "@mui/material";
import {campService} from "../../api/services/campService";
import {searchInfoService} from "../../api/services/searchInfoService";
import {CampingCard, ScrollToTopFab, MainCarousel, SearchBar, CustomSnackbar} from 'components';
import {useAuth} from "../../context/AuthContext";

import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Home() {
    const navigate = useNavigate();
    const {isAuthenticated} = useAuth();
    const [camps, setCamps] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true); // 로드 가능한지 여부
    const [snackbarNone, setSnackbarNone] = useState(false);
    const [snackbarBookmark, setSnackbarBookmark] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarKey, setSnackbarKey] = useState(0);
    // 추천 목록 캐러셀 관련 상태들
    const [currentRecommendPage, setCurrentRecommendPage] = useState(0);
    const [slideDirection, setSlideDirection] = useState('right');
    const [isSliding, setIsSliding] = useState(false);
    const [slideAnimation, setSlideAnimation] = useState({
        isAnimating: false,
        direction: null
    });
    // 초기 로딩 완료 여부 (초기 페이지는 무한스크롤로 로드하지 않기 위함)
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

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
        setSnackbarBookmark(false);
        setTimeout(() => {
            setSnackbarMessage("찜 상태를 변경하였습니다.");
            setSnackbarBookmark(true);
            setSnackbarKey(prev => prev + 1);
        }, 100);
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

    const observerRef = useRef(null);

    useEffect(() => {
        // 첫 로딩은 페이지 0의 데이터만 요청
        executePopularCamps(0, 9);
        if (isAuthenticated) {
            executeMatchedCamps(0, 12);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (popularCampsData?.content) {
            // page가 0이면 기존 데이터를 대체, 아니면 추가
            setCamps(prev => (page === 0 ? popularCampsData.content : [...prev, ...popularCampsData.content]));
            setHasMore(popularCampsData.content.length === 9);
            // 첫 로딩이 완료되면 initialLoadComplete를 true로 설정
            if (page === 0) {
                setInitialLoadComplete(true);
            }
        }
    }, [popularCampsData, page]);

    const handleCardClick = (campId) => {
        navigate(`/camps/${campId}`);
    };

    const handleBookmarkClick = (campId) => {
        if (!isAuthenticated) {
            showSnackbarNone();
            return;
        }
        showSnackbarBookmark();
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
            // 초기 로딩이 완료된 경우에만 추가 데이터를 요청
            if (!initialLoadComplete) return;
            if (entry.isIntersecting && hasMore && !loadingPopularCamps) {
                const nextPage = page + 1;
                executePopularCamps(nextPage, 9);
                setPage(nextPage);
            }
        },
        [page, hasMore, loadingPopularCamps, executePopularCamps, initialLoadComplete]
    );

    // Intersection Observer 설정
    useEffect(() => {
        const observer = new IntersectionObserver(loadMore, {threshold: 1.0});
        if (observerRef.current) observer.observe(observerRef.current);
        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current);
        };
    }, [loadMore]);

    // 추천 캠핑장 페이지 이동 핸들러
    const handleNextPage = () => {
        if (!slideAnimation.isAnimating && matchedCampsData?.content &&
            currentRecommendPage < matchedCampsData.content.length - 1) {
            setSlideAnimation({ isAnimating: true, direction: 'next' });
            setTimeout(() => {
                setCurrentRecommendPage(prev => prev + 1);
                setSlideAnimation({ isAnimating: false, direction: null });
            }, 300);
        }
    };

    const handlePrevPage = () => {
        if (!slideAnimation.isAnimating && currentRecommendPage > 0) {
            setSlideAnimation({ isAnimating: true, direction: 'prev' });
            setTimeout(() => {
                setCurrentRecommendPage(prev => prev - 1);
                setSlideAnimation({ isAnimating: false, direction: null });
            }, 300);
        }
    };

    // 현재 페이지에 표시할 아이템들 계산
    const getCurrentPageItems = () => {
        if (!matchedCampsData?.content) return [];
        const items = [];
        for (let i = 0; i < 3; i++) {
            const index = currentRecommendPage + i;
            if (index < matchedCampsData.content.length) {
                items.push(matchedCampsData.content[index]);
            }
        }
        return items;
    };

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
            {isAuthenticated && matchedCampsData?.content?.length > 0 && !loadingMatchedCamps && (
                <>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',  // 세로 방향 배치
                            mb: 4,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#9e9e9e",
                                cursor: "pointer",
                                "&:hover": { color: "#616161" },
                                fontSize: "0.875rem",
                                mb: 1
                            }}
                            onClick={() => navigate("/keyword")}
                        >
                            ← 키워드를 바꾸고싶다면?
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <Typography variant="h5" fontWeight="bold">
                                {matchedCampsData.content[0]?.username}님을 위한 추천 캠핑장 🏕️
                            </Typography>
                            <Box>
                                <IconButton
                                    onClick={handlePrevPage}
                                    disabled={currentRecommendPage === 0 || isSliding}
                                >
                                    <ArrowBackIosNewIcon />
                                </IconButton>
                                <IconButton
                                    onClick={handleNextPage}
                                    disabled={!matchedCampsData?.content ||
                                        currentRecommendPage >= matchedCampsData.content.length - 3 ||
                                        isSliding}
                                >
                                    <ArrowForwardIosIcon />
                                </IconButton>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{
                        position: 'relative',
                        overflow: 'visible', // overflow를 visible로 변경
                        mb: 4
                    }}>
                        <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                sm: 'repeat(2, 1fr)',
                                lg: 'repeat(3, 1fr)'
                            },
                            gap: 3,
                            mb: 2,
                            width: '100%',
                            margin: '0 auto'
                        }}>
                            {getCurrentPageItems().map((camp) => (
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
                    </Box>
                </>
            )}

            {/* 인기 캠핑장 목록 */}
            <Typography variant="h5" fontWeight="bold" sx={{mb: 4, mt: 4}}>
                캠핑온 인기 캠핑장 ✨
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

            <CustomSnackbar
                open={snackbarNone}
                onClose={handleCloseNone}
                message={snackbarMessage}
                severity="warning"
            />
            <CustomSnackbar
                key={snackbarKey}
                open={snackbarBookmark}
                onClose={handleCloseBookmark}
                message={snackbarMessage}
                severity="info"
            />

            <ScrollToTopFab />
        </Container>
    );
}

export default Home;