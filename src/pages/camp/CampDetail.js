import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {useCampDetail} from "../../hooks/useCampDetail";
import useAvailableCampSites from "../../hooks/useAvailableCampSites";
import {
    ImageGallery,
    AddressInfo,
    CampDetailIntro,
    OperationPolicy,
    KakaoMap,
    ModalGallery,
    CampSiteCard,
    CampDatePicker,
    ModalComponent
} from 'components';
import {getRandomThumbnail} from "utils/ThumbnailUtils";
import {ko} from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/camp-detail.css";
import "../../style/available-list.css";
import CampInfo from "../../components/camp/CampInfo";
import ReviewList from "../../components/Review/ReviewList";
import { Box, Typography } from "@mui/material";


function calculateNights(checkin, checkout) {
    if (!checkin || !checkout) return 1; // 체크인 또는 체크아웃이 없으면 기본 1박
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const checkinOnlyDate = new Date(checkinDate.getFullYear(), checkinDate.getMonth(), checkinDate.getDate());
    const checkoutOnlyDate = new Date(checkoutDate.getFullYear(), checkoutDate.getMonth(), checkoutDate.getDate());
    const differenceInDays = (checkoutOnlyDate - checkinOnlyDate) / (1000 * 3600 * 24);
    return differenceInDays > 0 ? differenceInDays : 1; // 최소 1박 보장
}

function CampDetail() {
    const {campId} = useParams();
    const [checkin, setCheckin] = useState(null); // 체크인 날짜
    const [checkout, setCheckout] = useState(null); // 체크아웃 날짜
    const [modalOpen, setModalOpen] = useState(false);
    const [localAvailableSites, setLocalAvailableSites] = useState([]);

    const {data: availableSites, error} = useAvailableCampSites(
        campId,
        checkin ? checkin.toISOString().split("T")[0] : null,
        checkout ? checkout.toISOString().split("T")[0] : null
    );

    useEffect(() => {
        setLocalAvailableSites(availableSites || []);
    }, [availableSites]);

    const handleDateChange = (dates, isClearing = false) => {
        const [start, end] = dates;
        setCheckin(start);
        setCheckout(end);

        if (isClearing) {
            setLocalAvailableSites([]);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (start && start.toDateString() === today.toDateString()) {
            setModalOpen(true);
        }
    };

    const {campDetails, loading: detailLoading, error: detailError} = useCampDetail(campId);
    const [openModal, setOpenModal] = useState(false);

    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);


    if (error) return <div>에러 발생: {error}</div>;
    if (detailError) return <div>에러 발생: {detailError}</div>;
    if (!campDetails) return <div>캠핑장 정보를 찾을 수 없습니다.</div>;
    if (detailLoading) return <div>로딩 중...</div>;

    const {campAddr, images, intro, name, tel, homepage, campInfo} = campDetails;

    // 박 수 계산
    const nights = calculateNights(checkin, checkout);
    console.log('🔍 checkin:', checkin, 'checkout:', checkout, '박 수 (nights):', nights); // 디버깅 로그

    return (
        <div className="camp-detail-container" style={{ padding: '0', marginTop: '60px' }}>
            <div className="camp-detail-header"
                 style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '20px'}}
            >
                <h1 className="camp-detail-title">{name || "캠핑장 이름 없음"}</h1>
                <CampInfo
                    recommend={campInfo.recommendCnt} // 추천 수
                    bookmark={campInfo.bookmarkCnt} // 찜 수
                /></div>

            {/* images가 빈 배열일 경우 랜덤 썸네일로 채우기 */}
            {(!images || images.length === 0) ? (
                <div className="main-image" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '20px'
                }}>
                    <img
                        src={getRandomThumbnail("", campId)}
                        alt="랜덤 썸네일"
                        style={{objectFit: 'cover', width: '100%', height: '100%'}}
                    />
                </div>
            ) : (
                <ImageGallery images={images} onMoreClick={handleModalOpen}/>
            )}
            <ModalGallery open={openModal} onClose={handleModalClose} images={images || []}/>
            <AddressInfo address={campAddr?.streetAddr} tel={tel} homepage={homepage}/>
            <CampDetailIntro intro={intro}/>
            <div style={{
                display: 'flex', 
                gap: '16px', 
                width: '100%', 
                marginTop: '30px',
                alignItems: 'stretch'
            }}>
                <Box style={{
                    flex: '1',
                    display: 'flex',
                }}>
                    <OperationPolicy
                        style={{ flex: '1' }}
                        industries={campDetails.indutys || []}
                        outdoorFacility={campDetails.outdoorFacility || "부대시설 정보 없음"}
                        animalAdmission={campDetails.animalAdmission}
                    />
                </Box>
                <Box style={{
                    flex: '1',
                    display: 'flex',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid #000000'
                }}>
                    <KakaoMap
                        style={{ flex: '1' }}
                        latitude={campAddr?.latitude}
                        longitude={campAddr?.longitude}
                        locationName={name}
                        state={campAddr?.state}
                    />
                </Box>
            </div>

            <div className="camp-date-picker-container" style={{ marginTop: '80px' }}>
                <h2 style={{fontSize: '1.1rem', fontWeight: 'initial'}}>
                    <span>🏕️ 캠핑을 원하시는 날짜를 선택하고,</span>
                    <span>특별한 여행을 시작하세요! 🏕</span>
                </h2>
                <CampDatePicker
                    checkin={checkin}
                    checkout={checkout}
                    handleDateChange={handleDateChange}
                />
            </div>

            <div className="camp-site-list-available">
                <h1 style={{fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px'}}>예약 가능한 캠핑지 목록</h1>
                {/* 캠핑지가 없을 때 빈 카드 표시 */}
                {!localAvailableSites || localAvailableSites.length === 0 ? (
                    <div
                        className="placeholder-card"
                        style={{
                            border: "1px dashed #ddd",
                            borderRadius: "8px",
                            height: "370px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "20px 0",
                            color: "#999",
                        }}
                    >
                        날짜를 선택하여 캠핑지를 확인하세요.
                    </div>
                ) : (
                    <div style={{ marginBottom: '40px' }}>
                        {localAvailableSites.map((site, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                <CampSiteCard
                                    locale={ko}
                                    campId={campId}
                                    data={site}
                                    checkin={checkin}
                                    checkout={checkout}
                                    count={nights}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <ModalComponent
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="당일 예약 안내"
                    message="※ 당일 예약은 전화로만 가능합니다."
                />
            </div>
            <Box sx={{paddingTop: 4}}>
                <Typography gutterBottom sx={{fontSize: '1.8rem', fontWeight: "bold", marginBottom: '20px'}}>
                    후기
                </Typography>
                <ReviewList campId={campId}/>
            </Box>
        </div>
    );
}

export default CampDetail;
