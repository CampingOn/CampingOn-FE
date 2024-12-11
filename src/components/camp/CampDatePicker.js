import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/camp-date-picker.css";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import ModalComponent from "../../components/camp/ModalComponent";

const CampDatePicker = ({ checkin, checkout, handleDateChange }) => {
    const today = new Date(); // 오늘 날짜 기준
    const [modalOpen, setModalOpen] = useState(false); // 모달 상태

    const clearDates = () => {
        handleDateChange([null, null], true); // 두 번째 파라미터로 초기화 여부 전달
        setModalOpen(false); // 모달 닫기
    };

    const handleDateSelection = (dates) => {
        const [start, end] = dates || [null, null];
        const today = new Date(); // 오늘 날짜
        today.setHours(0, 0, 0, 0); // 시간 제거하여 날짜만 비교

        if (start && end) {
            const isSameDay = start.getTime() === end.getTime(); // 입실일과 퇴실일이 같은지 확인
            if (isSameDay) {
                handleDateChange([start, null]); // 퇴실일을 무효화
                return;
            }

            const maxNights = 6; // 최대 6박
            const differenceInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // 날짜 차이 계산
            if (differenceInDays > maxNights) {
                handleDateChange([start, null]); // 6박 초과 시 퇴실일 초기화
                setModalOpen(true); // 모달 열기
                return;
            }
        }

        if (start) {
            const isToday = start.getTime() === today.getTime(); // 입실일이 오늘인지 확인
            if (isToday) {
                handleDateChange([start, null]); // 입실일이 오늘이면 퇴실일을 초기화
                return;
            }
        }

        handleDateChange(dates, false); // 일반 날짜 선택은 초기화 아님을 표시
    };

    return (
        <div className="camp-date-picker-container">
            <div className="datepicker-wrapper">
                <div className="picker-content-wrapper">
                    <div className="react-datepicker-container">
                        <DatePicker
                            locale={ko}
                            selected={checkin}
                            onChange={handleDateSelection}
                            startDate={checkin}
                            endDate={checkout}
                            selectsRange
                            inline
                            minDate={today}
                            monthsShown={2}
                        />
                        {(checkin || checkout) && (
                            <DisabledByDefaultIcon
                                className="clear-dates-icon"
                                onClick={clearDates}
                                style={{
                                    color: "black",
                                    cursor: "pointer",
                                    fontSize: "30px",
                                }}
                            />
                        )}
                    </div>
                    <div className="date-info">
                        <div className={`date-box ${checkin ? 'selected' : ''}`}>
                            <span className="label">체크인</span>
                            <span className="date">
                                {checkin ? checkin.toLocaleDateString("ko-KR") : "날짜를 선택해주세요"}
                            </span>
                        </div>
                        <div className={`date-box ${checkout ? 'selected' : ''}`}>
                            <span className="label">체크아웃</span>
                            <span className="date">
                                {checkout ? checkout.toLocaleDateString("ko-KR") : "날짜를 선택해주세요"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* 모달 컴포넌트 */}
            <ModalComponent
                open={modalOpen}
                onClose={() => setModalOpen(false)} // 모달 닫기
                title="예약 제한"
                message="최대 6박까지 예약이 가능합니다."
            />
        </div>
    );
};

export default CampDatePicker;