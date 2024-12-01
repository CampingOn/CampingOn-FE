import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { Box, Button, TextField, Typography } from "@mui/material";
import "style/calendar.css"

const Calendar = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // 시간대를 제거하고 날짜를 정확히 처리
    const clearTime = (date) => {
        if (!date) return null;
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };

    // 날짜를 YYYY-MM-DD 형식으로 변환
    const formatDateForInput = (date) => {
        if (!date) return "";
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
        const day = String(date.getUTCDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // YYYY-MM-DD 문자열을 Date 객체로 변환
    const parseInputToDate = (input) => {
        const parts = input.split("-");
        return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])); // UTC 시간으로 생성
    };

    const handleDateChange = (dates) => {
        const [start, end] = dates.map(clearTime);
        setStartDate(start);
        setEndDate(end);
    };

    const handleInputChange = (value, type) => {
        const date = parseInputToDate(value);
        if (type === "start") {
            setStartDate(date);
            if (endDate && date > endDate) setEndDate(null); // 시작일이 퇴실일보다 크면 초기화
        } else {
            setEndDate(date);
            if (startDate && date < startDate) setStartDate(null); // 퇴실일이 시작일보다 작으면 초기화
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                p: 4,
                justifyContent: "center",
            }}
        >
            {/* 캘린더 */}
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                monthsShown={2}
                minDate={new Date()}
                locale={ko}
                dateFormat="yyyy-MM-dd"
                fixedHeight
                showMonthYearDropdown={false}
            />
            {/* 입력 필드 */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                    <Typography
                        variant="body1"
                        sx={{ textAlign: "left", fontWeight: "bold", mb: 1 }}
                    >
                        입실일
                    </Typography>
                    <TextField
                        type="date"
                        value={formatDateForInput(startDate)} // YYYY-MM-DD 형식으로 표시
                        onChange={(e) => handleInputChange(e.target.value, "start")}
                        fullWidth
                    />
                </Box>
                <Box>
                    <Typography
                        variant="body1"
                        sx={{ textAlign: "left", fontWeight: "bold", mb: 1 }}
                    >
                        퇴실일
                    </Typography>
                    <TextField
                        type="date"
                        value={formatDateForInput(endDate)} // YYYY-MM-DD 형식으로 표시
                        onChange={(e) => handleInputChange(e.target.value, "end")}
                        fullWidth
                    />
                </Box>
                <Button
                    variant="contained"
                    onClick={() => console.log("날짜 선택됨:", startDate, endDate)}
                    sx={{
                        backgroundColor: "#FCD34D", // TailwindCSS amber-300
                        color: "black", // 텍스트 색상
                        "&:hover": {
                            backgroundColor: "#FBBF24", // TailwindCSS amber-400
                        },
                    }}
                >
                    날짜 선택
                </Button>
            </Box>
        </Box>
    );
};

export default Calendar;
