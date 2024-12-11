import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { reviewService } from "../../api/services/reviewService";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';


const DEFAULT_IMAGE = "/default/reviewImage.jpg";

const ReviewList = ({ campId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const navigate = useNavigate();

    // 리뷰 데이터 가져오기
    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true);
            const response = await reviewService.getReviewsByCampId(campId, { page: page, size: 4 });
            const data = response.data;

            setReviews((prevReviews) => [...prevReviews, ...data.content]);
            setHasMore(!data.last); // 마지막 페이지 여부 확인
        } catch (error) {
            console.error("리뷰 데이터를 불러오는 중 오류가 발생했습니다.", error);
            setSnackbarMessage("리뷰 데이터를 불러오는 중 오류가 발생했습니다.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    }, [campId, page]);

    // 캠핑장이 변경되었을 때 초기화
    useEffect(() => {
        setReviews([]);
        setPage(0);
    }, [campId]);

    // 페이지 변경 시 데이터 로드
    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    return (
        <Box sx={{ }}>
            <Typography variant="h5" gutterBottom>
            </Typography>
            {loading && page === 0 ? (
                <CircularProgress />
            ) : reviews.length > 0 ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                        gap: 5,
                        alignItems: "start",
                    }}
                >
                    {reviews.map((review) => (
                        <Box
                            key={review.reviewId}
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                overflow: "hidden",
                                background: "#fff",
                                padding: 2,
                                cursor: "pointer",
                                transition: "transform 0.3s",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                },
                                gap: 3, // 사진과 내용 사이 간격 추가
                            }}
                            onClick={() => navigate(`/camps/reviews/${review.reviewId}`)}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "flex-start",
                                    gap: 2,
                                    flex: 1, // 부모 컨테이너의 크기를 차지
                                    minHeight: "140px", // 전체 최소 높이 설정
                                }}
                            >
                                {/* 제목 */}
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: "bold",
                                        height: "24px", // 고정 높이
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        marginBottom: "4px", // 아래 여백 추가
                                    }}
                                >
                                    {review.title}
                                </Typography>

                                {/* 본문 */}
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#666",
                                        lineHeight: "1.5",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3, // 최대 3줄까지 표시
                                        WebkitBoxOrient: "vertical",
                                        marginBottom: "8px", // 추가 여백
                                    }}
                                >
                                    {review.content}
                                </Typography>

                                {/* 추천 여부 */}
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: review.recommended ? "#4caf50" : "#f44336",
                                        visibility: review.recommended ? "visible" : "hidden", // "추천"이 아닐 때 숨김
                                        marginTop: "auto", // 추천 여부를 항상 아래에 배치
                                    }}
                                >
                                    {review.recommended ? "추천해요! 👍" : "비추천"}
                                </Typography>
                            </Box>
                            {/* Right Side: Image */}
                            <Box
                                sx={{
                                    width: "140px", // Fixed image size
                                    height: "140px",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                    border: "1px solid #f5f5f5", // Border matching the screenshot
                                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <img
                                    src={review.images && review.images.length > 0 ? review.images[0] : DEFAULT_IMAGE}
                                    alt="리뷰 이미지"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box
                    sx={{
                        border: "1px dashed #ddd",
                        borderRadius: "8px",
                        height: "400px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                        marginTop: 4,
                    }}
                >
                    <RateReviewOutlinedIcon sx={{ fontSize: 48, marginBottom: 2, color: "#ccc" }} />
                    <Typography variant="body1">
                        리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
                    </Typography>
                </Box>
            )}

            {/* 더보기 버튼 */}
            {hasMore && !loading && reviews.length > 0 && (
                <Box
                    onClick={handleLoadMore}
                    sx={{
                        marginTop: 4,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        width: "50px",
                        height: "50px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "25px",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                        marginLeft: "auto",
                        marginRight: "auto",
                        "&:hover": {
                            backgroundColor: "#d6d6d6",
                        },
                    }}
                >
                    <KeyboardArrowDownIcon sx={{ fontSize: "24px", color: "#000" }} />
                </Box>
            )}
            {loading && (
                <CircularProgress
                    sx={{
                        marginTop: 2,
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }}
                />
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ReviewList;
