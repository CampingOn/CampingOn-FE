import React, {useState} from "react";
import {useParams} from "react-router-dom";
import {useCampDetail} from "../../hooks/useCampDetail";
import useAvailableCampSites from "../../hooks/useAvailableCampSites";
import ImageGallery from "../../components/camp/ImageGallery";
import AddressInfo from "../../components/camp/AddressInfo";
import CampDetailIntro from "../../components/camp/CampDetailIntro";
import OperationPolicy from "../../components/OperationPolicy";
import MapSection from "../../components/camp/MapSection";
import ModalGallery from "../../components/camp/ModalGallery";
import CampSiteCard from "../../components/camp/CampSiteCard";
import CampDatePicker from "../../components/camp/CampDatePicker";
import ModalComponent from "../../components/camp/ModalComponent";

import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";


import "../../style/camp-detail.css";
import "../../style/available-list.css";

function CampDetail() {
    const {campId} = useParams();
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

    const {campDetails, loading: detailLoading, error: detailError} = useCampDetail(campId);
    const [openModal, setOpenModal] = useState(false);

    const handleModalOpen = () => setOpenModal(true);
    const handleModalClose = () => setOpenModal(false);


    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>에러 발생: {error}</div>;
    if (detailError) return <div>에러 발생: {detailError}</div>;
    if (!campDetails) return <div>캠핑장 정보를 찾을 수 없습니다.</div>;
    if (detailLoading) return <div>로딩 중...</div>;

    const {campAddr, images, intro, name, tel, homepage} = campDetails;
    return (
        <div className="camp-detail-container">
            {/* 캠핑장 이름 */}
            <h1 className="camp-detail-title">{name || "캠핑장 이름 없음"}</h1>
            {/* 캠핑장 이미지 */}
            <ImageGallery images={images || []} onMoreClick={handleModalOpen}/>
            {/* 캠핑장 이미지 모달창 */}
            <ModalGallery open={openModal} onClose={handleModalClose} images={images || []}/>
            {/* 주소 정보 */}
            <AddressInfo address={campAddr?.streetAddr} tel={tel} homepage={homepage}/>
            {/* 캠핑장 장문 소개 */}
            <CampDetailIntro intro={intro}/>
            {/* 운영정책 */}
            <div>
                {/* 다른 캠프 세부사항들 */}
                <OperationPolicy
                    industries={campDetails.indutys || []}
                    outdoorFacility={campDetails.outdoorFacility || "부대시설 정보 없음"}
                />
            </div>
            {/* 카카오 인터랙티브 맵 */}
            <MapSection
                latitude={campAddr?.latitude}
                longitude={campAddr?.longitude}
                name={name}
                state={campAddr?.state}
            />

            {/* 날짜 선택 */}
            <div className="camp-date-picker-container">
                <h2>예약 가능한 날짜 선택</h2>
                {/* 달력 */}
                <CampDatePicker
                    checkin={checkin}
                    checkout={checkout}
                    handleDateChange={handleDateChange}
                />
                {/* 체크인/체크아웃 날짜 표시 */}
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

            {/* 예약 가능한 캠핑지 목록 */}
            <div className="camp-site-list-available">
                <h2>예약 가능한 캠핑지 목록</h2>
                {availableSites && availableSites.length > 0 ? (
                    availableSites
                        .filter((site) => {
                            const today = new Date(); // 오늘 날짜
                            const checkinValid = !checkin || checkin >= today; // 체크인 날짜가 오늘 이후인지 확인
                            const checkoutValid = !checkout || checkout >= checkin; // 체크아웃 날짜가 체크인 이후인지 확인
                            return checkinValid && checkoutValid;
                        })
                        .map((site, index) => (
                            <CampSiteCard
                                locale={ko}
                                key={index}
                                data={site}
                                count={1}
                                onReserve={() => console.log(`${site.name} 예약하기`)}
                            />
                        ))
                ) : (
                    <p>예약 가능한 캠핑지가 없습니다.</p>
                )}

                {/* 당일 예약 모달 */}
                <ModalComponent
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title="당일 예약 안내"
                    message="※ 당일 예약은 전화로만 가능합니다."
                />
            </div>
        </div>
    );
}

export default CampDetail;