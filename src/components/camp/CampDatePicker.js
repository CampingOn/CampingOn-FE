import React from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/camp-date-picker.css";

const CampDatePicker = ({ checkin, checkout, handleDateChange }) => {
    const today = new Date(); // 오늘 날짜 기준

    return (
        <DatePicker
            locale={ko} // 한글 로케일 적용
            selected={checkin}
            onChange={(dates) => {
                const [start, end] = dates || [null, null];
                if (start && end) {
                    const dayDifference = (end - start) / (1000 * 60 * 60 * 24); // 날짜 차이 계산
                    if (dayDifference < 1) {
                        return dayDifference >= 1;
                    }
                }
                handleDateChange(dates); // 유효한 날짜만 반영
            }}
            startDate={checkin}
            endDate={checkout}
            selectsRange
            inline
            minDate={today} // 오늘 이후 날짜만 선택 가능
        />
    );
};

export default CampDatePicker;