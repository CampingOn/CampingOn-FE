import React, { useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    Alert,
    TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { reservationService } from "../api/services/reservationService";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {KeyboardTab, Start} from "@mui/icons-material";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {FestivalOutlined} from "@mui/icons-material";
import { ReviewModal, ReviewForm } from 'components';
import { reviewService } from 'api/services/reviewService';

const CampReservationCard = ({ data, onReviewChange }) => {
    const {
        id,
        checkinDate,
        checkoutDate,
        checkinTime,
        checkoutTime,
        guestCnt,
        status,
        totalPrice,
        campResponseDto,
        campAddrResponseDto,
        campSiteResponseDto,
        reviewDto,
    } = data;
    const navigate = useNavigate();
    const [open, setOpen] = useState(false); // 예약 취소 모달 상태
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar 상태
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error"
    const [cancelReason, setCancelReason] = useState(""); // 취소 사유 상태
    const [selectedReservationId, setSelectedReservationId] = useState(null); // 선택된 예약 ID
    const [localStatus, setLocalStatus] = useState(status);
    const [reviewFormOpen, setReviewFormOpen] = useState(false);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [detailedReview, setDetailedReview] = useState(null);
    const {
        execute: cancelReservation,
        loading: cancelLoading,
        error: cancelError,
    } = useApi(reservationService.cancelReservation);

    const handleNameClick = () => {
        navigate(`/camps/${campResponseDto.id}`);
    };

    const handleCancelClick = (reservationId) => {
        setSelectedReservationId(reservationId);
        setOpen(true); // 예약 취소 모달 열기
    };


    const handleConfirmCancel = async () => {
        try {
            if (localStatus === "예약완료" && selectedReservationId) {
                const requestData = {
                    id: selectedReservationId,
                    campId: campResponseDto.id,
                    campSiteId: campSiteResponseDto.id,
                    status: localStatus,
                    cancelReason,
                };

                await cancelReservation(selectedReservationId, requestData);

                // 클라이언트 상태 변경
                setLocalStatus("예약취소");
                setOpen(false); // 모달 닫기
                setSnackbarMessage(`예약번호 ${selectedReservationId}: 취소되었습니다.`);
                setSnackbarSeverity("success");
                setSnackbarOpen(true); // Snackbar 표시
            }
        } catch (error) {
            console.error("예약 취소 실패:", error);
            setSnackbarMessage("예약 취소 중 문제가 발생했습니다. 다시 시도해주세요.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true); // Snackbar 표시
        }
    };

    const handleButtonClick = (reservationId) => {
        if (status === "예약완료") {
            handleCancelClick(reservationId);
        } else if (status === "체크인완료") {
            if (reviewDto) {
                handleReviewClick();
            } else {
                setReviewFormOpen(true);
            }
        }
    };

    // ReviewForm의 작성 핸들러
    const handleReviewSubmit = async (formData) => {
        try {
            const response = await reviewService.createReview(campResponseDto.id, id, formData);
            const createdReview = response.data;

            // 상세 정보 가져오기
            const { data: detailData } = await reviewService.getReviewDetail(
                campResponseDto.id,
                createdReview.id
            );
            setDetailedReview(detailData);

            setReviewFormOpen(false);
            setSnackbarMessage("리뷰가 성공적으로 작성되었습니다.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            onReviewChange?.();
        } catch (error) {
            console.error("리뷰 작성 실패:", error.response?.data);
            setSnackbarMessage(error.response?.data?.message || "리뷰 작성 중 오류가 발생했습니다.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleReviewClick = async () => {
        try {
            if (reviewDto.id) {
                const { data } = await reviewService.getReviewDetail(
                    campResponseDto.id,
                    reviewDto.id
                );

                setDetailedReview({
                    ...data,
                    images: data.images || []
                });
                setReviewModalOpen(true);  // 데이터를 받아온 후에 모달을 열기
            }
        } catch (error) {
            console.error('Review detail error:', error);
            setSnackbarMessage("리뷰 정보를 불러오는데 실패했습니다.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    // ReviewModal의 삭제 핸들러
    const handleReviewDelete = async () => {
        try {
            if (!reviewDto?.id) {
                setSnackbarMessage("리뷰 정보를 찾을 수 없습니다.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                return;
            }
            await reviewService.deleteReview(reviewDto.id);
            setReviewModalOpen(false);
            setSnackbarMessage("리뷰가 삭제되었습니다.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            onReviewChange();  // 목록 새로고침
        } catch (error) {
            setSnackbarMessage("리뷰 삭제 중 오류가 발생했습니다.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };


    const handleClose = () => {
        setOpen(false); // 모달 닫기
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false); // Snackbar 닫기
    };

    const getButtonProps = () => {
        switch (localStatus) {
            case "예약완료":
                return { text: "예약 취소", variant: "outlined", disabled: false };
            case "예약취소":
                return { text: "예약 취소됨", variant: "outlined", disabled: true };
            case "체크인완료":
                return reviewDto
                    ? { text: "후기 확인", variant: "contained", disabled: false }
                    : { text: "후기 작성", variant: "contained", disabled: false };
            default:
                return { text: "상태 없음", variant: "contained", disabled: true };
        }
    };

    const buttonProps = getButtonProps();

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "column", md: "column", lg: "row" }, // md 이하 column, lg 이상 row
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
                        {campResponseDto.campName} - {campSiteResponseDto.siteType}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "green" }} />
                        <Typography variant="body2">
                            {campAddrResponseDto.streetAddr} {campAddrResponseDto.city.detailedAddr}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <Start sx={{ fontSize: 20, marginRight: 1, color: "#2c387e" }} />
                        <Typography variant="body2">
                            체크인 : {checkinDate} {checkinTime}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <KeyboardTab sx={{ fontSize: 20, marginRight: 1, color: "#ffc107" }} />
                        <Typography variant="body2">
                            체크아웃: {checkoutDate} {checkoutTime}
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <PeopleOutlinedIcon sx={{ fontSize: 20, marginRight: 1, color: "#6573c3" }} />
                        <Typography variant="body2">
                            {guestCnt}명
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
                        <FestivalOutlined sx={{ fontSize: 20, marginRight: 1, color: "#ff7961" }} />
                        <Typography variant="body2">
                            내부시설: {campSiteResponseDto.indoorFacility}
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
                        onClick={() => handleButtonClick(id)}
                        disabled={buttonProps.disabled}
                    >
                        {buttonProps.text}
                    </Button>
                </Box>
            </Box>

            {/* 리뷰 작성 폼 */}
            <ReviewForm
                open={reviewFormOpen}
                onClose={() => setReviewFormOpen(false)}
                onSubmit={handleReviewSubmit}
                campName={campResponseDto.campName}
                initialData={detailedReview}  // 상세 리뷰 데이터 전달
            />
            {/* 리뷰 상세 모달 */}
            <ReviewModal
                open={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                review={detailedReview || (reviewDto?.id ? reviewDto : {})}
                isOwner={true}
                campName={campResponseDto.campName}
                onEdit={() => {
                    setReviewModalOpen(false);
                    // 수정 폼 열기 전에 상세 데이터 확인
                    if (!detailedReview) {
                        // 상세 데이터가 없으면 가져오기
                        reviewService.getReviewDetail(campResponseDto.id, reviewDto.id)
                            .then(({ data }) => {
                                setDetailedReview(data);
                                setReviewFormOpen(true);
                            })
                            .catch(error => {
                                setSnackbarMessage("리뷰 정보를 불러오는데 실패했습니다.");
                                setSnackbarSeverity("error");
                                setSnackbarOpen(true);
                            });
                    } else {
                        setReviewFormOpen(true);
                    }
                }}
                onDelete={handleReviewDelete}
            />

            {/* 예약 취소 확인 모달 */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>예약 취소</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        정말로 예약을 취소하시겠습니까? 취소 사유를 입력해주세요.
                    </DialogContentText>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        margin="normal"
                        placeholder="취소 사유를 입력하세요."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleConfirmCancel} color="error" autoFocus disabled={cancelLoading || !cancelReason}>
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default CampReservationCard;
