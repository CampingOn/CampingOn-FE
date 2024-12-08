import React, { useState } from "react";
import { Card, CardContent, Typography, Box, IconButton, Chip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from "react-router-dom";
import { bookmarkService } from "../../api/services/bookmarkService";

const CampBookmarkedCard = ({ data, onBookmarkChange }) => {
    const { campId, name, lineIntro, thumbImage, streetAddr, keywords, isMarked } = data;
    const summary = lineIntro.length > 100 ? `${lineIntro.slice(0, 100)} ...` : lineIntro;
    const navigate = useNavigate();
    const [liked, setLiked] = useState(isMarked);

    const handleNameClick = () => {
        navigate(`/camps/${campId}`);
    };

    const toggleLike = async (event) => {
        event.stopPropagation(); // 부모의 onClick 이벤트가 실행되지 않도록 중단

        try {
            console.log("campId: " + campId);
            await bookmarkService.toggleBookmark(campId);
            setLiked(!liked);
            onBookmarkChange("찜 상태를 변경하였습니다"); // 부모에게 알리기
        } catch (error) {
            console.error("찜 클릭 에러 : ", error);
        }
    };

    const imageUrl = thumbImage === "" ? `${process.env.PUBLIC_URL}/default/NoThumb.jpg` : thumbImage;
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
                    backgroundImage: `url(${imageUrl})`,
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
                        sx={{ marginBottom: 2, fontWeight: 'bold' }}
                        onClick={handleNameClick}
                    >
                        {name}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "green" }} />
                        <Typography variant="body2">{streetAddr}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "flex-start", marginBottom: 3 }}>
                        <InfoOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "gray" }} />
                        <Typography variant="body2">{summary}</Typography>
                    </Box>

                    {/* 입실 퇴실 시간 섹션 */}
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
                        <AccessTimeIcon sx={{ fontSize: 20, marginRight: 1, color: "gray" }} />
                        <Typography variant="body2">입실: 15:00 | 퇴실: 11:00</Typography>
                    </Box>

                    {/* 해시태그 섹션 */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1 }}>
                        {keywords.map((tag, index) => (
                            <Chip
                                key={index}
                                label={`#${tag}`}
                                sx={{
                                    fontSize: "0.75rem",
                                    backgroundColor: "#f0f0f0",
                                    color: "#333",
                                }}
                            />
                        ))}
                    </Box>
                </CardContent>

                {/* 하트 버튼 */}
                <Box sx={{ marginTop: "auto", textAlign: "right" }}>
                    <IconButton color="error" onClick={toggleLike}>
                        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                </Box>
            </Box>
        </Card>
    );
};

export default CampBookmarkedCard;
