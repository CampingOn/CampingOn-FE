import React, {useState} from "react";
import {getRandomThumbnail} from "../../utils/ThumbnailUtils";
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
import {useApi} from "../../hooks/useApi";
import {reservationService} from "../../api/services/reservationService";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {KeyboardTab, Start} from "@mui/icons-material";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {FestivalOutlined} from "@mui/icons-material";
import {ReviewModal, ReviewForm} from 'components';
import {reviewService} from 'api/services/reviewService';
import {useSnackbar} from "pages/reservation/MyReservation";

const CampReservationCard = ({data, buttonInVisible, onReviewChange}) => {
    const {
        id,
        checkin,
        checkout,
        guestCnt,
        status,
        totalPrice,
        campResponseDto,
        campAddrResponseDto,
        campSiteResponseDto,
        reviewDto,
    } = data;
    const [open, setOpen] = useState(false); // 예약 취소 모달 상태
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar 상태
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // "success" | "error"
    const [cancelReason, setCancelReason] = useState(""); // 취소 사유 상태
    const [selectedReservationId, setSelectedReservationId] = useState(null); // 선택된 예약 ID
    const [localStatus, setLocalStatus] = useState(status);

    const showSnackbar = useSnackbar();

    const [reviewFormOpen, setReviewFormOpen] = useState(false);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    // 리뷰 상세 정보
    const [reviewDetail, setReviewDetail] = useState(null);

    const {
        execute: cancelReservation,
        loading: cancelLoading,
    } = useApi(reservationService.cancelReservation);

    const handleCancelClick = (reservationId) => {
        setSelectedReservationId(reservationId);
        setOpen(true); // 예약 취소 모달 열기
    };

    const handleConfirmCancel = async () => {
        try {
            if (localStatus === "예약완료" && selectedReservationId) {
                const requestData = {
                    id: selectedReservationId,
                    campId: campResponseDto.campId,
                    campSiteId: campSiteResponseDto.siteId,
                    status: localStatus,
                    cancelReason,
                };

                await cancelReservation(selectedReservationId, requestData);

                // 클라이언트 상태 변경
                setLocalStatus("예약취소");
                showSnackbar("예약이 취소되었습니다.", "success");
                setOpen(false); // 모달 닫기
            }
        } catch (error) {
            showSnackbar("예약 취소 중 오류가 발생했습니다.", "error");
        }
    };


    const handleButtonClick = (reservationId) => {
        if (status === "예약완료") {
            handleCancelClick(reservationId);
        } else if (status === "체크인완료") {
            if (!reviewDto) {
                setReviewFormOpen(true);
            } else {
                handleReviewClick();
            }
        }
    };

    // ReviewForm의 작성 핸들러
    const handleReviewSubmit = async (formData) => {
        try {
            await reviewService.createReview(
                campResponseDto.campId,
                data.id,
                formData
            );
            setReviewFormOpen(false);
            setSnackbarMessage("리뷰가 작성되었습니다.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            onReviewChange();
        } catch (error) {
            setSnackbarMessage(error.response?.data?.message || "리뷰 작성 중 오류가 발생했습니다.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleReviewClick = async () => {
        try {
            if (reviewDto?.id) {
                console.log('리뷰 조회 시작 - reviewDto:', reviewDto);
                // 리뷰 상세 정보 API 호출
                const response = await reviewService.getReviewDetail(reviewDto.id);
                console.log('저장된 리뷰 상세 정보:', response.data);
                // 상세 정보 저장
                setReviewDetail(response.data);

                setReviewModalOpen(true);
            }
        } catch (error) {
            setSnackbarMessage("리뷰 정보를 불러오는데 실패했습니다.");
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
                return {text: "예약 취소", variant: "outlined", disabled: false};
            case "예약취소":
                return {text: "예약 취소됨", variant: "outlined", disabled: true};
            case "체크인완료":
                return reviewDto
                    ? {text: "후기 확인", variant: "contained", disabled: false}
                    : {text: "후기 작성", variant: "contained", disabled: false};
            default:
                return {text: "상태 없음", variant: "contained", disabled: true};
        }
    };

    const buttonProps = getButtonProps();
    const thumbnailUrl = campResponseDto.thumbImage || getRandomThumbnail("", campResponseDto.campId);

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: {xs: "column", sm: "column", md: "column", lg: "row"}, // md 이하 column, lg 이상 row
                margin: 2,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": {transform: "scale(1.02)"},
            }}
        >
            {/* 이미지 섹션 */}
            <Box
                sx={{
                    flex: { sm: "2" },
                    height: { xs: 200, sm: "auto" },
                    aspectRatio: { sm: "16 / 9" },
                    width: { xs: "100%", sm: "auto" },
                    backgroundImage: `url(${thumbnailUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: 'relative'
                }}
            >
            </Box>
            {/* 정보 섹션 */}
            <Box sx={{display: "flex", flexDirection: "column", flex: "3", padding: 2}}>
                <CardContent>
                    <Typography
                        variant="h5"
                        sx={{marginBottom: 2, fontWeight: 'bold'}}
                    >
                        <a href={`/camps/${campResponseDto.campId}`} style={{textDecoration: 'none', color: 'inherit'}}>
                            {campResponseDto.campName} - {campSiteResponseDto.siteType}
                        </a>
                    </Typography>
                    <Box sx={{display: "flex", alignItems: "center", marginBottom: 1}}>
                        <LocationOnOutlinedIcon sx={{fontSize: 20, marginRight: 1, color: "green"}}/>
                        <Typography variant="body2">
                            {campAddrResponseDto.streetAddr}
                        </Typography>
                    </Box>
                    <Box sx={{display: "flex", alignItems: "center", marginBottom: 1}}>
                        <FestivalOutlined sx={{fontSize: 20, marginRight: 1, color: "#ff7961"}}/>
                        <Typography variant="body2">
                            {campSiteResponseDto.indoorFacility ? campSiteResponseDto.indoorFacility : "내부시설 정보 없음"}
                        </Typography>
                    </Box>
                    <Box sx={{display: "flex", alignItems: "center", marginBottom: 1}}>
                        <Start sx={{fontSize: 20, marginRight: 1, color: "#2c387e"}}/>
                        <Typography variant="body2">
                            체크인 : {checkin}
                        </Typography>
                    </Box>
                    <Box sx={{display: "flex", alignItems: "center", marginBottom: 1}}>
                        <KeyboardTab sx={{fontSize: 20, marginRight: 1, color: "#ffc107"}}/>
                        <Typography variant="body2">
                            체크아웃: {checkout}
                        </Typography>
                    </Box>
                    <Box sx={{display: "flex", alignItems: "center", marginBottom: 1}}>
                        <PeopleOutlinedIcon sx={{fontSize: 20, marginRight: 1, color: "#6573c3"}}/>
                        <Typography variant="body2">
                            {guestCnt}명
                        </Typography>
                    </Box>

                    <Box sx={{display: "flex", alignItems: "center", marginBottom: 1}}>
                        <ReceiptLongOutlinedIcon sx={{fontSize: 20, marginRight: 1, color: "#ff9800"}}/>
                        <Typography variant="body2">
                            결제금액: {totalPrice.toLocaleString()}원
                        </Typography>
                    </Box>
                </CardContent>

                {/* 예약 관련 처리 버튼 */}
                {!buttonInVisible &&
                    <Box sx={{marginTop: "auto", textAlign: "right"}}>
                        <Button
                            variant={buttonProps.variant}
                            color='warning'
                            onClick={() => handleButtonClick(id)}
                            disabled={buttonProps.disabled}
                            sx={{
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                '&:hover': {
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }
                            }}
                        >
                            {buttonProps.text}
                        </Button>
                    </Box>
                }

            </Box>

            {/* 리뷰 작성 폼 */}
            <ReviewForm
                open={reviewFormOpen}
                onClose={() => setReviewFormOpen(false)}
                onSubmit={handleReviewSubmit}
                campName={campResponseDto.campName}
            />
            {/* 리뷰 상세 모달 */}
            <ReviewModal
                open={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                review={reviewDetail}   // 상세 정보 전달
                campName={campResponseDto.campName}
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
                    <Button onClick={handleClose} color="primary" sx={{ color: '#666666' }}>
                        취소
                    </Button>
                    <Button onClick={handleConfirmCancel} color="error" autoFocus
                            disabled={cancelLoading || !cancelReason} sx={{ color: '#ff6927' }}>
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{vertical: "bottom", horizontal: "left"}}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{width: "100%"}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Card>
    );
};

export default CampReservationCard;
