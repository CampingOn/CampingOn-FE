import React, {useEffect, useState} from 'react';
import {useApi} from "../../hooks/useApi";
import {campService} from "../../api/services/campService";
import CampingCard from "../../components/CampingCard";

function Home() {
    // Redux 스토어에서 accessToken 가져오기
/*
    const accessToken = useSelector((state) => state.auth.accessToken);
*/
    // const { execute: getPopularCamps, loading, error, data } = useApi(campService.getPopularCamps);
    //
    // useEffect(() => {
    //     getPopularCamps(1);
    // }, []);
    //
    // if (loading) return <div>Loading...</div>;
    // if (error) return <div>Error occurred</div>;
    // if (!data) return <div>No data</div>;

    const [campData, setCampData] = useState([]); // 캠핑 데이터를 저장
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        const fetchCampData = async () => {
            try {
                const response = await campService.getPopularCamps(0);
                setCampData(response.data.content); // content 배열 저장
            } catch (err) {
                setError(err.message); // 에러 처리
            } finally {
                setLoading(false); // 로딩 상태 변경
            }
        };

        fetchCampData();
    }, []);

    if (loading) {
        return <div>로딩 중...</div>; // 로딩 상태일 때 표시
    }

    if (error) {
        return <div>에러 발생: {error}</div>; // 에러 발생 시 표시
    }

    if (campData.length === 0) {
        return <div>캠핑 데이터가 없습니다.</div>; // 데이터가 없을 때 표시
    }

    return (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campData.map((camp) => (
                <CampingCard
                    key={camp.id} // 고유 ID 사용
                    image={camp.image}
                    name={camp.name}
                    address={camp.address}
                    keywords={camp.keywords || []} // 키워드가 없을 경우 빈 배열
                    intro={camp.intro}
                    isLiked={camp.isLiked} // 좋아요 상태
                />
            ))}
        </div>
    );
}

export default Home;
