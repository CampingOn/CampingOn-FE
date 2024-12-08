import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import YellowButton from "../common/YellowButton";
import {FestivalOutlined} from "@mui/icons-material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import { Link } from "react-router-dom";

const getImageBySiteType = (siteType) => {
    const imageMap = {
        "카라반": "/default/카라반.png",
        "일반야영장": "/default/일반.png",
        "자동차야영장": "/default/자동차야영장.png",
        "글램핑": "/default/글램핑.png",
        "카라반(개인)": "/default/캠핑카.png"
    };
    return imageMap[siteType] || "profile.png"; // 기본 이미지
};

const formatDate = (date) => {
    if (!date) return ""; // 유효하지 않은 값 처리
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};


const CampSiteCard = ({ data = {}, campId, count, checkin, checkout }) => {
    // 기본값 설정
    const {
        siteType = "알 수 없음",
        maximumPeople = 0,
        price = 0,
        indoorFacility = "내부시설 정보 없음",
        siteId,
    } = data;


    const image = getImageBySiteType(siteType);

    // 날짜 변환 적용
    const formattedCheckin = formatDate(checkin);
    const formattedCheckout = formatDate(checkout);



    // price가 숫자가 아니면 0으로 변환
    const numericPrice = Number(price) || 0;
    // 총 결제 금액 계산
    const totalPrice = numericPrice * count;



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
                    backgroundImage: `url(${image})`,
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
                    <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: "bold" }}>
                        {siteType}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }} />
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <FestivalOutlined sx={{ fontSize: 20, marginRight: 1, color: "#ff7961" }} />
                        <Typography variant="body2">{indoorFacility?.trim() || "내부시설 정보 없음"}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <PeopleOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "#2c387e" }} />
                        <Typography variant="body2">최대 {maximumPeople}명</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <UpdateOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "#ffc107" }} />
                        <Typography variant="body2">
                            체크인: 15:00 / 체크아웃: 11:00
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <ReceiptLongOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "green" }} />
                        <Typography variant="body2">
                            1박당 {price.toLocaleString()}원
                        </Typography>
                    </Box>
                </CardContent>

                {/* 액션 버튼 */}
                <Box sx={{ marginTop: "auto", textAlign: "right" }}>
                    {/* 총액 */}
                    <Typography variant={"h6"}>
                        총 결제 금액: {totalPrice.toLocaleString()}원
                    </Typography>
                    {/* 예약 버튼 */}
                    <YellowButton>
                        <Link
                            to={`/camps/${campId}/sites/${siteId}?checkin=${formattedCheckin}&checkout=${formattedCheckout}`}
                        >
                            예약하기
                        </Link>
                    </YellowButton>
                </Box>
            </Box>
        </Card>
    );
};

export default CampSiteCard;
