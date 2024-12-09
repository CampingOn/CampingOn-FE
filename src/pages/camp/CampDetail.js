import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCampDetail } from "../../hooks/useCampDetail";
import useAvailableCampSites from "../../hooks/useAvailableCampSites";
import {
    ImageGallery,
    AddressInfo,
    CampDetailIntro,
    OperationPolicy,
    MapSection,
    ModalGallery,
    CampSiteCard,
    CampDatePicker,
    ModalComponent
} from 'components';
import { getRandomThumbnail } from "utils/ThumbnailUtils";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/camp-detail.css";
import "../../style/available-list.css";

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
    const { campId } = useParams();
    const [checkin, setCheckin] = useState(null); // 체크인 날짜
    const [checkout, setCheckout] = useState(null); // 체크아웃 날짜
    const [modalOpen, setModalOpen] = useState(false);

    const { data: availableSites, loading, error } = useAvailableCampSites(
        campId,
        checkin ? checkin.toISOString().split("T")[0] : null,
        checkout ? checkout.toISOString().split("T")[0] : null
    );

    const handleDateChange = (dates) => {
        const [start, end] = dates;
        setCheckin(start);
        setCheckout(end);

        const today = new Date();
        today.setHours(0, 0, 0, 0); // 날짜만 비교하도록 시간 제거

        if (start && start.toDateString() === today.toDateString()) {
            setModalOpen(true); // 당일 예약인 경우 모달 열기
        }
    };

    const { campDetails, loading: detailLoading, error: detailError } = useCampDetail(campId);
    const [openModal, setOpenModal] = useState(false);

    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러 발생: {error}</div>;
    if (detailError) return <div>에러 발생: {detailError}</div>;
    if (!campDetails) return <div>캠핑장 정보를 찾을 수 없습니다.</div>;
    if (detailLoading) return <div>로딩 중...</div>;

    const { campAddr, images, intro, name, tel, homepage } = campDetails;

    // 박 수 계산
    const nights = calculateNights(checkin, checkout);
    console.log('🔍 checkin:', checkin, 'checkout:', checkout, '박 수 (nights):', nights); // 디버깅 로그

    return (
        <div className="camp-detail-container">
            <h1 className="camp-detail-title">{name || "캠핑장 이름 없음"}</h1>
            {/* images가 빈 배열일 경우 랜덤 썸네일로 채우기 */}
            {(!images || images.length === 0) ? (
                <div className="main-image" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', marginBottom: '20px'}}>
                    <img 
                        src={getRandomThumbnail("")}
                        alt="랜덤 썸네일" 
                        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                </div>
            ) : (
                <ImageGallery images={images} onMoreClick={handleModalOpen} />
            )}
            <ModalGallery open={openModal} onClose={handleModalClose} images={images || []} />
            <AddressInfo address={campAddr?.streetAddr} tel={tel} homepage={homepage} />
            <CampDetailIntro intro={intro} />
            <OperationPolicy
                industries={campDetails.indutys || []}
                outdoorFacility={campDetails.outdoorFacility || "부대시설 정보 없음"}
            />
            <MapSection
                latitude={campAddr?.latitude}
                longitude={campAddr?.longitude}
                name={name}
                state={campAddr?.state}
            />

            <div className="camp-date-picker-container">
                <h2>예약 가능한 날짜 선택</h2>
                <CampDatePicker
                    checkin={checkin}
                    checkout={checkout}
                    handleDateChange={handleDateChange}
                />
                <div className="date-info">
                    <div className="date-box">
                        <span className="label">입실</span>
                        <span className="date">{checkin ? checkin.toLocaleDateString("ko-KR") : "날짜를 선택하세요"}</span>
                    </div>
                    <div className="date-box">
                        <span className="label">퇴실</span>
                        <span className="date">{checkout ? checkout.toLocaleDateString("ko-KR") : "날짜를 선택하세요"}</span>
                    </div>
                </div>
            </div>

            <div className="camp-site-list-available">
                <h2>예약 가능한 캠핑지 목록</h2>
                {availableSites && availableSites.length > 0 ? (
                    availableSites.map((site, index) => (
                        <CampSiteCard
                            locale={ko}
                            key={index}
                            campId={campId}
                            data={site}
                            checkin={checkin}
                            checkout={checkout}
                            count={nights} // 박 수 전달
                            onReserve={() => console.log(`${site} 예약하기`)}
                        />
                    ))
                ) : (
                    <p>예약 가능한 캠핑지가 없습니다.</p>
                )}
                <ModalComponent
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="당일 예약 안내"
                    message="※ 당일 예약�� 전화로만 가능합니다."
                />
            </div>
        </div>
    );
}

export default CampDetail;
