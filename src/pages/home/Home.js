import React, {useEffect} from 'react';
import {useApi} from '../../hooks/useApi';
import {campService} from '../../api/services/campService';
import CampingCard from '../../components/CampingCard';
import {useSelector} from "react-redux";

function Home() {
    // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // 로그인 상태 가져오기
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

    if (loadingMatchedCamps) return <div>로딩 중...</div>;
    if (errorMatchedCamps) return <div>에러 발생: {errorGetPopularCamps}</div>;

    if (loadingGetPopularCamps) return <div>로딩 중...</div>;
    if (errorGetPopularCamps) return <div>에러 발생: {errorGetPopularCamps}</div>;

    return (
        <div className="p-4">
            {isAuthenticated && matchedCamps?.content?.length > 0 && (
                <>
                    <h1 className="text-xl font-bold mb-4">{matchedCamps.content.username}님을 위한 추천 캠핑장</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-7xl">
                        {matchedCamps.content.map((camp) => (
                            <CampingCard
                                key={camp.id}
                                thumbImage={camp.thumbImage}
                                name={camp.name}
                                address={camp.address}
                                keywords={camp.keywords || []}
                                lineIntro={camp.lineIntro}
                                marked={camp.marked}
                            />
                        ))}
                    </div>
                </>
            )}

            {(isAuthenticated && !matchedCamps?.content?.length) && (
                <div className="text-gray-500 text-center">
                    추천 캠핑 데이터를 불러올 수 없습니다.
                </div>
            )}

            <br/>
            <h1 className="text-xl font-bold mb-4">인기 캠핑장</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto max-w-7xl">
                {popularCamps?.content?.map((camp) => (
                    <CampingCard
                        key={camp.id}
                        thumbImage={camp.thumbImage}
                        name={camp.name}
                        address={camp.streetAddr}
                        keywords={camp.keywords || []}
                        lineIntro={camp.lineIntro}
                        marked={camp.marked}
                    />
                ))}
            </div>
        </div>
    );
}

    export default Home;
