import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { campService } from '../../api/services/campService';
import WebIcon from '@mui/icons-material/Web';
import CallIcon from '@mui/icons-material/Call';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Calendar from '../../components/Calendar';
import OperationPolicy from '../../components/OperationPolicy';
import KakaoMap from "../../components/KakaoMap";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import '../../style/camp-detail.css';

function CampDetail() {
    const { campId } = useParams();
    const [campDetails, setCampDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false); // 모달 상태 관리

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

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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

            {/* 이미지 갤러리 */}
            <div className="camp-detail-gallery">
                {/* 왼쪽 대표 이미지 */}
                {campDetails.images && campDetails.images.length > 1 && (
                    <div className="main-image">
                        <img
                            src={campDetails.images[1]} // 두 번째 사진을 대표 이미지로 사용
                            alt="대표 이미지"
                            onClick={() => window.open(campDetails.images[1], '_blank')}
                        />
                    </div>
                )}

                {/* 오른쪽 썸네일 이미지들 (1, 3, 4, 5번째 사진) */}
                <div className="thumbnail-images-grid">
                    {campDetails.images &&
                        [0, 2, 3, 4].map((index) => (
                            campDetails.images[index] && (
                                <div key={index} className="thumbnail">
                                    <img
                                        src={campDetails.images[index]}
                                        alt={`캠핑장 이미지 ${index + 1}`}
                                        onClick={() => window.open(campDetails.images[index], '_blank')}
                                    />
                                    {/* "더보기" 버튼을 5번째 이미지의 구석에 표시 */}
                                    {index === 4 && campDetails.images.length > 5 && (
                                        <button onClick={handleOpen} className="view-more-button">
                                            더보기
                                        </button>
                                    )}
                                </div>
                            )
                        ))}
                </div>
            </div>

            {/* 모달을 통한 전체 이미지 보기 */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        p: 4,
                        backgroundColor: 'white',
                        maxHeight: '83vh',
                        overflow: 'auto',
                        width: '87%',              // 모달의 너비 조정
                        position: 'absolute',      // 절대 위치 지정
                        top: '50%',                // 수직 중앙으로 설정
                        left: '50%',               // 수평 중앙으로 설정
                        transform: 'translate(-50%, -50%)', // 정가운데로 이동
                        boxShadow: 24,             // 그림자 효과 추가
                        borderRadius: 2            // 모달 테두리 둥글게
                    }}
                >
                    <div className="modal-content">
                        {campDetails.images &&
                            campDetails.images.map((image, index) => (
                                <div key={index} className="modal-thumbnail">
                                    <img
                                        src={image}
                                        alt={`캠핑장 이미지 ${index + 1}`}
                                        className="modal-image"
                                    />
                                </div>
                            ))}
                    </div>
                </Box>
            </Modal>

            {/* 홈페이지, 전화번호, 도로명 주소*/}
            <div className="camp-detail-info-bar">
                {/* 왼쪽: 홈페이지 */}
                <div className="info-bar-section">
                    <LocationOnIcon style={{verticalAlign: 'middle', marginRight: '8px'}}/>
                    <span>{campDetails.campAddr?.streetAddr || "도로명 주소 정보 없음"}</span>
                </div>

                {/* 가운데: 전화번호 */}
                <div className="info-bar-section">
                    <CallIcon style={{verticalAlign: 'middle', marginRight: '8px'}}/>
                    <span>{campDetails.tel || "연락처 정보 없음"}</span>
                </div>

                {/* 오른쪽: 홈페이지 */}
                <div className="info-bar-section">
                    <WebIcon style={{verticalAlign: 'middle', marginRight: '8px'}}/>
                    {campDetails.homepage ? (
                        <a
                            href={campDetails.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="homepage-link"  // 'homepage-link' 클래스 사용
                        >
                            {campDetails.homepage}
                        </a>
                    ) : (
                        "홈페이지 정보 없음"
                    )}
                </div>
            </div>

            {/* 캠핑장 소개 */}
            <div className="camp-detail-intro-box">
                <span className="camp-detail-intro-title">캠핑장 소개</span>
                <p className="camp-detail-description">
                    {campDetails.intro || "장문 소개 정보 없음"}
                </p>
            </div>

            {/* 운영정책 */}
            <div>
                {/* 다른 캠프 세부사항들 */}
                <OperationPolicy
                    industries={campDetails.indutys || []}
                    outdoorFacility={campDetails.outdoorFacility || "부대시설 정보 없음"}
                />
            </div>

            {/* 위치 정보 및 카카오맵 섹션 */}
            <div className="map-wrapper">
                <h2 className="location-info-title">
                    <LocationOnIcon style={{verticalAlign: 'middle', marginRight: '8px'}}/>
                    위치 정보
                </h2>
                <div className="map-container">
                    <KakaoMap
                        latitude={campDetails.campAddr.latitude}
                        longitude={campDetails.campAddr.longitude}
                        locationName={campDetails.name}
                    />
                </div>
            </div>

            {/* Calendar 컴포넌트 추가 */}
            <div className="camp-detail-calendar">
                <h2>예약 가능한 날짜 선택</h2>
                <Calendar/>
            </div>


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
