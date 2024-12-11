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
        handleDateChange([null, null]); // 입실일과 퇴실일 초기화
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

        handleDateChange(dates); // 유효한 날짜만 반영
    };

    return (
        <div className="camp-date-picker-container">
            <div className="datepicker-wrapper">
                <DatePicker
                    locale={ko} // 한글 로케일 적용
                    selected={checkin}
                    onChange={handleDateSelection} // 선택 처리
                    startDate={checkin}
                    endDate={checkout}
                    selectsRange
                    inline
                    minDate={today} // 오늘 이후 날짜만 선택 가능
                    monthsShown={2} // 두 달 표시
                />
                {/* 캘린더 입실일 초기화 버튼 (DisabledByDefaultIcon 사용) */}
                {(checkin || checkout) && (
                    <DisabledByDefaultIcon
                        className="clear-dates-icon"
                        onClick={clearDates} // 초기화 이벤트 핸들러
                        style={{
                            color: "black", // 아이콘 색상
                            cursor: "pointer", // 클릭 가능
                            position: "absolute", // 위치 조정
                            top: "114px", // 적절한 위치 설정
                            right: "-121px", // 적절한 위치 설정
                            fontSize: "30px", // 아이콘 크기
                        }}
                    />
                )}
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