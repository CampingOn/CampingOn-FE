import React, { useEffect, useState } from "react";
import { useApi } from "hooks/useApi";
import { reservationService } from "api/services/reservationService";
import { CampReservationCard, ScrollToTopFab } from "components";
import { Box, Typography, CircularProgress } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useInView } from "react-intersection-observer";

const MyReservation = () => {
    const {
        execute: getReservations,
        loading: loadingReservations,
        error: errorReservations,
        data: reservationData,
    } = useApi(reservationService.getReservations);

    const [reservations, setReservations] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const { ref: loadMoreRef, inView } = useInView({
        threshold: 1.0, // 요소가 100% 보일 때 감지
        triggerOnce: false,
    });

    const refreshReservations = () => {
        setPage(0);  // 페이지를 0으로 리셋
        getReservations(0);  // 데이터 새로 로드
    };

    useEffect(() => {
        // 페이지 0부터 데이터 로드 시작
        getReservations(page);
    }, [page]);

    useEffect(() => {
        if (reservationData?.content) {
            setReservations((prev) => (page === 0 ? reservationData.content : [...prev, ...reservationData.content]));
            setHasMore(reservationData.content.length >= 5); // 데이터 5개 이하로 로드 되면 더이상 데이터 없다고 판단
        }
    }, [reservationData]);

    // 무한 스크롤 트리거
    useEffect(() => {
        if (inView && hasMore && !loadingReservations) {
            setPage((prev) => prev + 1);
        }
    }, [inView, hasMore, loadingReservations]);

    if (loadingReservations && page === 0)
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

    if (errorReservations)
        return (
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", marginTop: 4 }}>
                    나의 예약 목록
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100vh",
                    }}
                >
                    <Typography variant="h6" color="error">
                        에러가 발생했습니다. 다시 시도해주세요.
                    </Typography>
                </Box>
            </Box>
        );

    if (!reservations || reservations.length === 0)
        return (
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", marginTop: 4 }}>
                    나의 예약 목록
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80vh",
                    }}
                >
                    <CalendarTodayIcon sx={{ fontSize: 100, color: "#ccc", marginBottom: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        예약된 캠핑장이 없습니다.
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        마음에 드는 캠핑장에 예약을 진행해보세요!
                    </Typography>
                </Box>
            </Box>
        );

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", marginTop: 4 }}>
                나의 예약 목록
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {reservations.map((reservation) => (
                    <CampReservationCard key={reservation.id} data={reservation} onReviewChange={refreshReservations} />
                ))}
            </Box>
            {/* 로딩 중이면 로딩 표시 */}
            {loadingReservations && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <CircularProgress size={24} />
                </Box>
            )}
            {/* 로드 더보기 트리거 */}
            <Box ref={loadMoreRef} sx={{ height: 20, mt: 2 }} />
            <ScrollToTopFab />
        </Box>
    );
};

export default MyReservation;
