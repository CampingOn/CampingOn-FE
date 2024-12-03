import React, {useEffect} from 'react';
import {useApi} from '../../hooks/useApi';
import {campService} from '../../api/services/campService';
import CampingCard from '../../components/CampingCard';

function Home() {
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
        getPopularCamps(0);
        getMatchedCamps(0, 3);
    }, []);

    if (loadingMatchedCamps) return <div>로딩 중...</div>;
    if (errorMatchedCamps) return <div>에러 발생: {errorGetPopularCamps}</div>;
    if (!matchedCamps) return <div>캠핑 데이터가 없습니다.</div>;

    if (loadingGetPopularCamps) return <div>로딩 중...</div>;
    if (errorGetPopularCamps) return <div>에러 발생: {errorGetPopularCamps}</div>;
    if (!popularCamps) return <div>캠핑 데이터가 없습니다.</div>;

    return (
        <div className="p-4">
            {matchedCamps.content && matchedCamps.content.length > 0 && (
                <>
                    <h1 className="text-xl font-bold mb-4">{matchedCamps.content.userName}님을 위한 추천 캠핑장</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <br/>
            <h1 className="text-xl font-bold mb-4">인기 캠핑장</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularCamps.content.map((camp) => (
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
        </div>
    );
}

export default Home;
