import React, { useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { campService } from '../../api/services/campService';
import CampingCard from '../../components/CampingCard';

function Home() {
    const { execute: getPopularCamps, loading, error, data } = useApi(campService.getPopularCamps);

    useEffect(() => {
        getPopularCamps(0);
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러 발생: {error}</div>;
    if (!data) return <div>캠핑 데이터가 없습니다.</div>;

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">인기 야영장</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.content.map((camp) => (
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