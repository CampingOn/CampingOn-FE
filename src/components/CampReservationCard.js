import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import {KeyboardTab, Start} from "@mui/icons-material";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {useNavigate} from "react-router-dom";

const CampReservationCard = ({ data, onClick }) => {
    const { id, campSiteId, checkIn, checkOut, guestCnt, status, totalPrice, campResponseDto, campAddrResponseDto } = data;
    const navigate = useNavigate();

    // 캠핑장 이름 클릭시 상세페이지로 이동 -> 링크 구현 필요
    const handleNameClick = () => {
        navigate(`/details/${id}`);
    };

    // 상태에 따른 버튼 텍스트 및 스타일
    const getButtonProps = () => {
        switch (status) {
            case "RESERVED":
                return { text: "예약 취소", variant: "outlined", disabled: false };
            case "CANCELED":
                return { text: "예약 취소됨", variant: "outlined", disabled: true };
            case "COMPLETED":
                return { text: "후기 작성", variant: "contained", disabled: false };
            default:
                return { text: "상태 없음", variant: "contained", disabled: true };
        }
    };

    const buttonProps = getButtonProps();

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                margin: 2,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.02)" },
            }}
        >
            {/* 이미지 섹션 */}
            <Box
                sx={{
                    flex: { sm: "2" },
                    backgroundImage: `url(${campResponseDto.thumbImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: { xs: 200, sm: "auto" },
                    aspectRatio: { sm: "16 / 9" },
                    width: { xs: "100%", sm: "auto" },
                }}
            />

            {/* 정보 섹션 */}
            <Box sx={{ display: "flex", flexDirection: "column", flex: "3", padding: 2 }}>
                <CardContent>
                    <Typography
                        variant="h5"
                        sx={{marginBottom: 2, fontWeight: 'bold'}}
                        onClick={handleNameClick}
                    >
                        {campResponseDto.name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "green" }} />
                        <Typography variant="body2">
                            {campAddrResponseDto.city} {campAddrResponseDto.state} {campAddrResponseDto.streetAddr} {campAddrResponseDto.city.detailedAddr}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <Start sx={{ fontSize: 20, marginRight: 1, color: "#ffc107" }} />
                        <Typography variant="body2">
                            체크인 : {checkIn.split("T")[0]} 15:00
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <KeyboardTab sx={{ fontSize: 20, marginRight: 1, color: "#2c387e" }} />
                        <Typography variant="body2">
                            체크아웃: {checkOut.split("T")[0]} 11:00
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <PeopleOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "#6573c3" }} />
                        <Typography variant="body2">
                            {guestCnt}명
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <ReceiptLongOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "#ff9800" }} />
                        <Typography variant="body2">
                            결제금액: {totalPrice.toLocaleString()}원
                        </Typography>
                    </Box>
                </CardContent>

                {/* 예약 관련 처리 버튼 */}
                <Box sx={{ marginTop: "auto", textAlign: "right" }}>
                    <Button
                        variant={buttonProps.variant}
                        color='warning'
                        onClick={onClick}
                        disabled={buttonProps.disabled}
                    >
                        {buttonProps.text}
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default CampReservationCard;
