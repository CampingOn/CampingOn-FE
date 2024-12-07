import React from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "../../style/camp-date-picker.css";

const CampDatePicker = ({ checkin, checkout, handleDateChange }) => (
    <DatePicker
        locale={ko} // 한글 로케일 적용
        selected={checkin}
        onChange={handleDateChange}
        startDate={checkin}
        endDate={checkout}
        selectsRange
        inline
    />
);

export default CampDatePicker;