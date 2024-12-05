import React from "react";
import {Card, CardContent, Typography, Box, IconButton, Chip} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {useNavigate} from "react-router-dom";

const CampBookmarkedCard = ({ data, onToggleFavorite }) => {
    const { campId, name, lineIntro, thumbImage, streetAddr, keywords, isMarked } = data;
    const summary = lineIntro.length > 100 ? `${lineIntro.slice(0, 100)} ...` : lineIntro;
    const navigate = useNavigate();

    // 캠핑장 이름 클릭시 상세페이지로 이동 -> 링크 구현 필요
    const handleNameClick = () => {
        navigate(`/details/${campId}`);
    };



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
                    backgroundImage: `url(${thumbImage})`,
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
                    {/* 해시태그 섹션 */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, marginTop: 1, }}>
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
                    <IconButton color="error" onClick={onToggleFavorite}>
                        {isMarked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                </Box>
            </Box>
        </Card>
    );
};

export default CampBookmarkedCard;
