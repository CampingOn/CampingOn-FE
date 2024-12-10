import React from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/camp-date-picker.css";
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';

const CampDatePicker = ({ checkin, checkout, handleDateChange }) => {
    const today = new Date(); // 오늘 날짜 기준

    const clearDates = () => {
        handleDateChange([null, null]); // 입실일과 퇴실일 초기화
    };

    const handleDateSelection = (dates) => {
        const [start, end] = dates || [null, null];
        const today = new Date(); // 오늘 날짜
        today.setHours(0, 0, 0, 0); // 시간 제거하여 날짜만 비교

        if (start) {
            const isTodaySelected = start.getTime() === today.getTime(); // 입실일이 오늘인지 확인
            if (isTodaySelected && end) {
                // 당일을 입실일로 선택한 경우 퇴실일 무효화
                handleDateChange([start, null]);
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
                />
                {/* 캘린더 입실일 초기화 버튼 (DisabledByDefaultIcon 사용) */}
                {(checkin && !checkout) && (
                    <DisabledByDefaultIcon
                        className="clear-dates-icon"
                        onClick={clearDates} // 초기화 이벤트 핸들러
                        style={{
                            color: "black", // 아이콘 색상
                            cursor: "pointer", // 클릭 가능
                            position: "absolute", // 위치 조정
                            top: "73px", // 적절한 위치 설정
                            right: "1px", // 적절한 위치 설정
                            fontSize: "35px", // 아이콘 크기
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default CampDatePicker;