import React, { useEffect, useState } from "react";
import {useApi} from "hooks/useApi";
import {reservationService} from "api/services/reservationService";
import {CampReservationCard, ScrollToTopFab} from "components";
import {Box, Typography, CircularProgress} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";


const MyReservation = () => {
    const {
        execute: getReservations,
        loading: loadingReservations,
        error: errorReservations,
        data: reservationData
    } = useApi(reservationService.getReservations);
    const [reservations, setReservations] = useState([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);


    useEffect(() => {
        getReservations(0, 5);
    }, []);

    useEffect(() => {
        if (reservations?.content) {
            setReservations((prev) => (page === 0 ? reservationData.content : [...prev, ...reservationData.content]));
            setHasMore(reservationData.content.length === 5); // 5개씩 로드 되었는지 확인
        }
    }, [reservationData]);


    if (loadingReservations)
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress/>
            </Box>
        );

    if (errorReservations)
        return (
            <Box sx={{padding: 4}}>
                <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', marginTop: 4}}>
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

    if (!reservationData || reservationData.content.length === 0)
        return (
            <Box sx={{padding: 4}}>
                <Typography variant="h4" gutterBottom sx={{fontWeight: 'bold', marginTop: 4}}>
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
                    <CalendarTodayIcon sx={{fontSize: 100, color: "#ccc", marginBottom: 2}}/>
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

        <Box sx={{padding: 4}}>
            <Typography variant="h5" gutterBottom sx={{fontWeight: 'bold', marginTop: 4}}>
                나의 예약 목록
            </Typography>
            <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                {reservationData.content.map((reservation) => (
                    <CampReservationCard
                        key={reservation.id}
                        data={reservation}
                    />
                ))}
            </Box>
            <ScrollToTopFab/>
        </Box>

    );
};

export default MyReservation;
