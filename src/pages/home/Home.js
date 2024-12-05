import React, {useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useApi} from '../../hooks/useApi';
import {campService} from '../../api/services/campService';
import CampingCard from '../../components/CampingCard';
import {Box, Container, Typography} from "@mui/material";
import SearchBar from "../../components/SearchBar";
import LoadMoreButton from "../../components/LoadMoreButton";
import ScrollToTopFab from "../../components/ScrollToTopFab";
import {searchInfoService} from "../../api/services/searchInfoService";

function Home() {
    const navigate = useNavigate(); // 네비게이션 함수
    const isAuthenticated = localStorage.getItem("accessToken");
    const [camps, setCamps] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    // const [searchParams, setSearchParams] = useState({
    //     city: '', // URL 파라미터나 상태에서 초기값 가져오기
    //     keyword: ''
    // });

    //인기 캠핑장 목록
    const {
        execute: getPopularCamps,
        loading: loadingGetPopularCamps,
        error: errorGetPopularCamps,
        data: popularCamps,
    } = useApi(campService.getPopularCamps);

    //추천 캠핑장 목록
    const {
        execute: getMatchedCamps,
        loading: loadingMatchedCamps,
        error: errorMatchedCamps,
        data: matchedCamps,
    } = useApi(campService.getMatchedCamps);

    useEffect(() => {
        if (isAuthenticated) {
            getMatchedCamps(0, 3);
        }
    }, [isAuthenticated]);

    // 첫 로딩 시 전체 데이터를 가져오는 효과
    useEffect(() => {
        loadCamps(true);  // 컴포넌트 마운트 시 초기 데이터 로드
    }, []);

    const handleCardClick = (campId) => {
        console.log("Clicked Camp ID:", campId);
        navigate(`/camps/${campId}`); // campId를 포함한 경로로 이동
    };

    const loadCamps = async (newSearch = false) => {
        try {
            const currentPage = newSearch ? 0 : page;
            const params = {
                page: currentPage,  // 페이지 파라미터 추가
                size: 9           // 사이즈도 명시적으로 전달
            };

            const data = await getPopularCamps(params);
            const newCamps = data?.content || [];

            if (newSearch) {
                setCamps(newCamps);  // 새로운 검색시 데이터 초기화
                setPage(1);         // 다음 페이지를 위해 1로 설정
            } else {
                setCamps(prev => [...prev, ...newCamps]);  // 기존 데이터에 추가
                setPage(prev => prev + 1);
            }

            // totalElements를 사용하여 더 정확한 hasMore 계산
            setHasMore(data.totalElements > (currentPage + 1) * 9);

        } catch (error) {
            console.error('캠핑장 검색 중 오류 발생:', error);
            if (newSearch) {
                setCamps([]);
                setPage(0);
            }
        }
    };

    // const handleSearch = (searchValues) => {
    //     setCamps([]);
    //     setPage(0);
    //     setSearchParams(searchValues);
    //     loadCamps(true);
    // };

    const handleLoadMore = () => {
        loadCamps();  // 추가 데이터 로드
    };

    if (loadingMatchedCamps) return <div>로딩 중...</div>;
    if (errorMatchedCamps) return <div>에러 발생: {errorGetPopularCamps}</div>;

    if (loadingGetPopularCamps) return <div>로딩 중...</div>;
    if (errorGetPopularCamps) return <div>에러 발생: {errorGetPopularCamps}</div>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* 검색바 */}
            {/*<Box sx={{ mb: 4 }}>*/}
            {/*    <SearchBar onSearch={handleSearch} isLoading={loadingGetPopularCamps} />*/}
            {/*</Box>*/}

            {isAuthenticated && matchedCamps?.content?.length > 0 && (
                <>
                    <h1 className="text-xl font-bold mb-4">{matchedCamps.content.username}님을 위한 추천 캠핑장</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matchedCamps.content.map((camp) => (
                            <CampingCard
                                key={camp.campId} // key 추가
                                campId={camp.campId}
                                thumbImage={camp.thumbImage}
                                name={camp.name}
                                address={camp.address}
                                keywords={camp.keywords || []}
                                lineIntro={camp.lineIntro}
                                marked={camp.marked}
                                onClick={() => handleCardClick(camp.campId)} // 이벤트 핸들러 수정
                            />
                        ))}
                    </div>
                </>
            )}

            {isAuthenticated && !matchedCamps?.content?.length && (
                <div className="text-gray-500 text-center">
                    추천 캠핑 데이터를 불러올 수 없습니다.
                </div>
            )}

            <br/>
            <h1 className="text-xl font-bold mb-4">인기 캠핑장</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-7xl">
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
                    />
                ))}
            </div>

            {/* 더보기 버튼 */}
            {camps.length > 0 && (
                <LoadMoreButton
                    onClick={handleLoadMore}
                    isLoading={loadingGetPopularCamps}
                    hasMore={hasMore}
                    disabled={!hasMore || loadingGetPopularCamps}
                />
            )}

            {/* 위로가기 버튼 */}
            <ScrollToTopFab />
        </Container>
    );
}

export default Home;
