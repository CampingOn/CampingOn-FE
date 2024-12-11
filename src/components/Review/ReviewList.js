import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, CircularProgress, Button, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { reviewService } from "../../api/services/reviewService";

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
        <Box sx={{ marginTop: 4 }}>
            <Typography variant="h5" gutterBottom>
                캠핑장 리뷰
            </Typography>
            {loading && page === 0 ? (
                <CircularProgress />
            ) : reviews.length > 0 ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", // 반응형 카드
                        gap: 5, // 카드 간 간격
                        alignItems: "start", // 카드 위쪽 정렬
                    }}
                >
                    {reviews.map((review) => (
                        <Box
                            key={review.reviewId}
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                background: "#fff",
                                cursor: "pointer",
                                transition: "transform 0.3s",
                                '&:hover': {
                                    transform: "scale(1.02)",
                                },
                            }}
                            onClick={() => navigate(`/camps/reviews/${review.reviewId}`)}
                        >
                            <Box
                                sx={{
                                    height: "200px", // 이미지 높이 고정
                                    overflow: "hidden",
                                }}
                            >
                                <img
                                    src={review.images && review.images.length > 0 ? review.images[0] : DEFAULT_IMAGE}
                                    alt="리뷰 이미지"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover", // 이미지 크기에 맞게 조정
                                    }}
                                />
                            </Box>
                            <Box
                                sx={{
                                    padding: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: "bold", marginBottom: "8px" }}
                                >
                                    {review.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "#666",
                                        lineHeight: "1.5",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {review.content}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: review.recommended ? "#4caf50" : "#f44336",
                                        marginTop: "8px",
                                    }}
                                >
                                    {review.recommended ? "추천" : "비추천"}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            ) : (
                <Typography>리뷰를 작성해주세요.</Typography>
            )}

            {/* 더보기 버튼 */}
            {hasMore && !loading && (
                <Button
                    variant="contained"
                    onClick={handleLoadMore}
                    sx={{ marginTop: 4, display: "block", marginLeft: "auto", marginRight: "auto" }}
                >
                    더보기
                </Button>
            )}
            {loading && <CircularProgress sx={{ marginTop: 2, display: "block", marginLeft: "auto", marginRight: "auto" }} />}

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
