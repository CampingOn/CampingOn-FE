import React, {useContext, useEffect, useState} from "react";
import CampBookmarkedCard from "../../components/CampBookmarkedCard";
import {campService} from "../../api/services/campService";
import {Box, Typography} from "@mui/material";
import AuthContext from "../../context/AuthContext";

function MyBookmark() {
    const token = localStorage.getItem("accessToken");
    const [bookmarkCardData, setBookmarkCardData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // API 호출하여 북마크된 캠프 데이터를 가져옴
        const fetchBookmarkedCamps = async () => {
            try {
                const response = await campService.getBookmarkedCamps(token, 0, 3); // 페이지 번호와 크기는 예시
                setBookmarkCardData(response.data.content); // 데이터 형식에 맞게 수정
            } catch (error) {
                console.error("Failed to fetch bookmarked camps:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookmarkedCamps();
    }, []);

    // 북마크 상태 토글 함수 (예시)
    const toggleFavorite = (campId) => {
        setBookmarkCardData((prev) =>
            prev.map((camp) =>
                camp.campId === campId ? {...camp, isMarked: !camp.isMarked} : camp
            )
        );
    };

    return (
        <Box sx={{padding: 2}}>
            <br/>
            <Typography
                variant="h4"
                sx={{
                    marginBottom: 2,
                    fontWeight: "bold",
                    fontSize: "1.5rem", // 크기 줄이기
                    fontFamily: "'Roboto', sans-serif", // 폰트 변경 (이쁜 폰트로 변경)
                    color: "#333", // 폰트 색상 조정 (옵션)
                    textAlign: "center", // 텍스트 가운데 정렬 (옵션)
                }}
            >
                ♥️내가 찜한 캠핑장♥️
            </Typography>

            <br/>


            {loading ? (
                <Typography>로딩 중...</Typography>
            ) : bookmarkCardData.length > 0 ? (
                bookmarkCardData.map((camp) => (
                    <CampBookmarkedCard
                        key={camp.campId}
                        data={{
                            campId: camp.campId,
                            name: camp.name,
                            lineIntro: camp.lineIntro,
                            thumbImage: camp.thumbImage,
                            streetAddr: camp.streetAddr,
                            keywords: camp.keywords,
                            isMarked: camp.marked // JSON의 "marked"는 "isMarked"로 이름을 변경
                        }}
                        onToggleFavorite={() => toggleFavorite(camp.campId)}
                    />
                ))
            ) : (
                <Typography>북마크된 캠핑장이 없습니다.</Typography>
            )}
        </Box>
    );
}

export default MyBookmark;
