import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {useApi} from '../../hooks/useApi';
import {campService} from '../../api/services/campService';
import CampingCard from '../../components/CampingCard';
import MainCarousel from "components/MainCarousel";
import SearchBar from "components/SearchBar";

function Home() {
    const navigate = useNavigate(); // 네비게이션 함수
    const isAuthenticated = localStorage.getItem("accessToken");

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
        getPopularCamps(0, 9);

        if (isAuthenticated) {
            getMatchedCamps(0, 3);
        }
    }, [isAuthenticated]);

    const handleCardClick = (campId) => {
        console.log("Clicked Camp ID:", campId);
        navigate(`/camps/${campId}`); // campId를 포함한 경로로 이동
    };

    const handleSearch = ({ city, keyword }) => {
        // Query parameters 생성
        const params = new URLSearchParams();
        if (city) params.append('city', city);
        if (keyword) params.append('keyword', keyword);

        // /search로 네비게이트
        navigate(`/search?${params.toString()}`);
    };

    if (loadingMatchedCamps) return <div>로딩 중...</div>;
    if (errorMatchedCamps) return <div>에러 발생: {errorGetPopularCamps}</div>;

    if (loadingGetPopularCamps) return <div>로딩 중...</div>;
    if (errorGetPopularCamps) return <div>에러 발생: {errorGetPopularCamps}</div>;

    return (
        <div className="p-4">
            {/* 캐러셀 섹션 */}
            <div className={"mb-8"}>
                <MainCarousel />
            </div>

            {/* 검색창 섹션 */}
            <div className={"mb-8"} >
                <SearchBar onSearch={handleSearch} isLoading={false} />
            </div>


            {isAuthenticated && matchedCamps?.content?.length > 0 && (
                <>

                    {/* 추천 섹션 */}
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
            {/* 인기 캠핑장 섹션 */}
            <h1 className="text-xl font-bold mb-4">인기 캠핑장</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-7xl">
                {popularCamps?.content?.map((camp) => (
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
        </div>
    );
}

export default Home;
