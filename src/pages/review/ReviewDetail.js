import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Container,
    IconButton,
} from "@mui/material";
import { ThumbUp as ThumbUpIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { reviewService } from "../../api/services/reviewService";
import { ImageCarousel } from "components";

function ReviewDetail() {
    const { reviewId } = useParams(); // URL의 리뷰 ID
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviewWithCampName = async () => {
            setLoading(true);
            try {
                const reviewData = await reviewService.getReviewDetailWithCampName(reviewId); // API 호출
                setReview(reviewData);
            } catch (err) {
                console.error("리뷰 데이터를 불러오는 중 오류 발생:", err);
                setError("리뷰 데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviewWithCampName();
    }, [reviewId]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    flexDirection: "column",
                }}
            >
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
                <Button variant="contained" onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    돌아가기
                </Button>
            </Box>
        );
    }

    if (!review) return null;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            {/* 상단 영역 */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <IconButton aria-label="back" onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", color: "#000000" }}>
                        {review.campName || "캠핑장 이름"}
                    </Typography>
                </Box>
            </Box>

            {/* 이미지 섹션 */}
            <Box sx={{ mb: 4 }}>
                {review.images && review.images.length > 0 ? (
                    <ImageCarousel images={review.images} />
                ) : (
                    <Box
                        sx={{
                            width: "100%",
                            height: 300,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#f5f5f5",
                        }}
                    >
                        <img
                            src="/default/reviewImage.jpg"
                            alt="기본 이미지"
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                        />
                    </Box>
                )}
            </Box>

            {/* 리뷰 내용 */}
            <Box sx={{ p: 3, border: "1px solid #ddd", borderRadius: 4, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    {review.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
                    {review.content}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <Button
                        variant={review.recommended ? "contained" : "outlined"}
                        color={review.recommended ? "primary" : "inherit"}
                        disabled
                        startIcon={<ThumbUpIcon />}
                        sx={{
                            minWidth: "100px",
                            bgcolor: review.recommended ? "primary.main" : "transparent",
                            color: review.recommended ? "white" : "text.secondary",
                            borderColor: review.recommended ? "primary.main" : "grey.300",
                            "&.Mui-disabled": {
                                bgcolor: review.recommended ? "primary.main" : "transparent",
                                color: review.recommended ? "white" : "text.secondary",
                                borderColor: review.recommended ? "primary.main" : "grey.300",
                            },
                        }}
                    >
                        추천
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default ReviewDetail;