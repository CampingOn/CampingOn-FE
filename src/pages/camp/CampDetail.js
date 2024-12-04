import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { campService } from '../../api/services/campService';
import HomeIcon from '@mui/icons-material/Home';
import CallIcon from '@mui/icons-material/Call';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../../style/camp-detail.css'; // CSS 파일 경로 수정

function CampDetail() {
    const { campId } = useParams();
    const [campDetails, setCampDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampDetails = async () => {
            try {
                const response = await campService.getCampDetail(campId);
                console.log(response.data);
                setCampDetails(response.data);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCampDetails();
    }, [campId]);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러 발생: {error.message}</div>;
    if (!campDetails) return <div>캠핑장 정보를 찾을 수 없습니다.</div>;

    return (
        <div className="camp-detail-container">

            {/* 캠핑장 주소 */}
            {campDetails.campAddr && (
                <p className="camp-detail-small-address">
                    {campDetails.campAddr.city || "도/광역시 정보 없음"} {campDetails.campAddr.state || "시/군/구 정보 없음"}
                </p>
            )}

            {/* 캠핑장 이름 */}
            <h1 className="camp-detail-title">
                {campDetails.name || "캠핑장 이름 없음"}
            </h1>

            <div className="camp-detail-gallery">
                {/* 메인 이미지 */}
                {campDetails.images && campDetails.images.length > 1 && (
                    <div className="main-image">
                        <img
                            src={campDetails.images[1]} // 두 번째 사진
                            alt="메인 이미지"
                            onClick={() => window.open(campDetails.images[1], '_blank')}
                        />
                    </div>
                )}

                {/* 썸네일 이미지들 */}
                <div className="thumbnail-images">
                    {campDetails.images &&
                        campDetails.images.map((image, index) => {
                            // 2번째 이미지는 이미 메인 이미지로 사용했으므로 제외
                            if (index === 1) return null;
                            return (
                                <div key={index} className="thumbnail">
                                    <img
                                        src={image}
                                        alt={`캠핑장 이미지 ${index + 1}`}
                                        onClick={() => window.open(image, '_blank')}
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* 캠핑장 이름, 전화번호, 도로명 주소*/}
            <div className="camp-detail-info-bar">
                {/* 왼쪽: 캠핑장 이름 */}
                <div className="info-bar-section">
                    <HomeIcon style={{verticalAlign: 'middle', marginRight: '8px'}}/>
                    <h2 style={{display: 'inline-block', margin: '0'}}>
                        {campDetails.name || "캠핑장 이름 없음"}
                    </h2>
                </div>

                {/* 가운데: 전화번호 */}
                <div className="info-bar-section">
                    <CallIcon style={{verticalAlign: 'middle', marginRight: '8px'}}/>
                    <span>{campDetails.tel || "연락처 정보 없음"}</span>
                </div>

                {/* 오른쪽: 도로명 주소 */}
                <div className="info-bar-section">
                    <LocationOnIcon style={{verticalAlign: 'middle', marginRight: '8px'}}/>
                    <span>{campDetails.campAddr?.streetAddr || "도로명 주소 정보 없음"}</span>
                </div>
            </div>

            {/* 캠핑장 소개 */}
            <div className="camp-detail-intro-box">
                <span className="camp-detail-intro-title">캠핑장 소개</span>
                <p className="camp-detail-description">
                    {campDetails.intro || "장문 소개 정보 없음"}
                </p>
            </div>


            {/* 짧은 소개 */}
            <p className="camp-detail-description">
                {campDetails.lineIntro || "소개 정보 없음"}
            </p>

            {/* 연락처 */}
            <p className="camp-detail-info">
                <CallIcon style={{verticalAlign: 'middle', marginRight: '8px'}}/>
                {campDetails.tel || "연락처 정보 없음"}
            </p>

            {/* 홈페이지 */}
            <p className="camp-detail-info">
                홈페이지:{" "}
                {campDetails.homepage ? (
                    <a
                        href={campDetails.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        {campDetails.homepage}
                    </a>
                ) : (
                    "홈페이지 정보 없음"
                )}
            </p>

            {/* 부대시설 */}
            <p className="camp-detail-info">
                부대시설: {campDetails.outdoorFacility || "부대시설 정보 없음"}
            </p>

            {/* 업종 */}
            <p className="camp-detail-info">
                업종:{" "}
                {campDetails.indutys && campDetails.indutys.length > 0
                    ? campDetails.indutys.join(", ")
                    : "업종 정보 없음"}
            </p>

            {/* 주소 */}
            {campDetails.campAddr ? (
                <div className="camp-detail-info">
                    <p className="camp-detail-info">
                        <LocationOnIcon style={{verticalAlign: 'middle', marginRight: '8px'}}/>
                        도로명 주소: {campDetails.campAddr.streetAddr || "정보 없음"}
                    </p>
                    <p>상세 주소: {campDetails.campAddr.detailedAddr || "정보 없음"}</p>
                    <p>도/광역시: {campDetails.campAddr.city || "정보 없음"}</p>
                    <p>시/군/구: {campDetails.campAddr.state || "정보 없음"}</p>
                    <p>우편번호: {campDetails.campAddr.zipcode || "정보 없음"}</p>
                    <p>
                        좌표:{" "}
                        {campDetails.campAddr.latitude && campDetails.campAddr.longitude ? (
                            <>
                                경도: {campDetails.campAddr.longitude}, 위도: {campDetails.campAddr.latitude}
                            </>
                        ) : (
                            "위치 정보 없음"
                        )}
                    </p>
                </div>
            ) : (
                <p className="camp-detail-info">주소 정보 없음</p>
            )}


            {/* 추천/찜 수 */}
            {campDetails.campInfo ? (
                <div className="camp-detail-info">
                    <p>추천 수: {campDetails.campInfo.recommendCnt || 0}</p>
                    <p>찜 수: {campDetails.campInfo.bookmarkCnt || 0}</p>
                </div>
            ) : (
                <p className="camp-detail-info">추천 및 찜 정보 없음</p>
            )}


        </div>
    );
}

export default CampDetail;
