import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { TableBarOutlined } from "@mui/icons-material";
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import UpdateOutlinedIcon from '@mui/icons-material/UpdateOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

const getImageBySiteType = (siteType) => {
    const imageMap = {
        "카라반": "/default/카라반.png",
        "일반": "/default/일반.png",
        "오토": "/default/오토.png",
        "글램핑": "/default/글램핑.png",
        "개인자동차": "개인자동차.png"
    };
    return imageMap[siteType] || "profile.png"; // 기본 이미지
};

const ReservationConfirmCard = ({ data }) => {
    const { siteId, maximumPeople, price, checkinTime, checkoutTime, indoorFacility, siteType } = data;

    const image = getImageBySiteType(siteType);

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                margin: 0,
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
                    <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>{siteType}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <TableBarOutlined sx={{ fontSize: 20, marginRight: 1, color: "primary.main" }} />
                        <Typography variant="body2">{indoorFacility}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <PeopleOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "#2c387e" }} />
                        <Typography variant="body2">최대 {maximumPeople}명</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <UpdateOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "#ffc107" }} />
                        <Typography variant="body2">
                            체크인: {checkinTime} / 체크아웃: {checkoutTime}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <ReceiptLongOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "green" }} />
                        <Typography variant="body2">1박당 {price.toLocaleString()}원</Typography>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    );
};

export default ReservationConfirmCard; 