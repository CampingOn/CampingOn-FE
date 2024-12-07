import React, {useEffect, useState} from 'react';
import {FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Alert, Grow} from '@mui/material';
import {campSiteService} from 'api/services/campSiteService';
import {reservationService } from "api/services/reservationService";
import {ReservationConfirmCard, YellowButton, OperationPolicy} from 'components';
import {useApi} from "hooks/useApi";
import CustomSnackbar from 'components/CustomSnackbar';
import { Link, useNavigate } from 'react-router-dom';

const Reservation = () => {
    const navigate = useNavigate();

    const {
        execute: getCampSite, 
        loading: campSiteLoading, 
        error: campSiteError, 
        data: campSiteData
    } = useApi(campSiteService.getCampSite);

    const {
        execute: createReservation, 
        error: reservationError,
    } = useApi(reservationService.createReservation);

    const [additionalPolicies, setAdditionalPolicies] = useState([]);
    const [guestCount, setGuestCount] = useState(1);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // TODO: 하드코딩. 캠프상세페이지와 연결되면 받아올 데이터
    const [campId] = useState(10);
    const [siteId] = useState(5);
    const [checkinDate, setCheckinDate] = useState("2023-10-01");
    const [checkoutDate, setCheckoutDate] = useState("2023-10-05");

    // 날짜와 금액 데이터 가공 함수
    const calculateReservationInfo = (count = guestCount) => {
        if (!campSiteData) return null;

        const checkin = new Date(checkinDate);
        const checkout = new Date(checkoutDate);
        const nightCount = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        const totalPrice = campSiteData.price * nightCount;

        return {
            reservationDate: `${checkinDate} ~ ${checkoutDate}`,
            nightCount,
            totalPrice,
            policies: [
                { label: '예약 날짜', value: `${checkinDate} ~ ${checkoutDate}` },
                { label: '결제 금액', value: totalPrice.toLocaleString() + '원' },
                { label: '인원', value: count },
            ]
        };
    };

    useEffect(() => {
        console.log('Request params:', {
            campId,
            siteId,
            checkinDate,
            checkoutDate
        });
        
        getCampSite(campId, siteId, checkinDate, checkoutDate).then(response => {
            if (response) {
                console.log('캠핑지 정보:', response);
                const reservationDate = `${checkinDate} ~ ${checkoutDate}`;
                const checkin = new Date(checkinDate);
                const checkout = new Date(checkoutDate);
                const nightCount = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
                const totalPrice = response.price * nightCount;

                setAdditionalPolicies([
                    { label: '예약 날짜', value: reservationDate },
                    { label: '결제 금액', value: totalPrice.toLocaleString() + '원' },
                    { label: '인원', value: guestCount },
                ]);
            }
        });
    }, [campId, siteId, checkinDate, checkoutDate]);

    if (campSiteLoading) return <div>Loading...</div>;
    if (campSiteError) return <div>Error occurred</div>;
    if (!campSiteData) return <div>No data</div>;

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleReserve = async () => {
        const info = calculateReservationInfo();
        if (!info) return;

        const requestData = {
            campId,
            campSiteId: siteId,
            checkin: checkinDate,
            checkout: checkoutDate,
            guestCnt: guestCount,
            totalPrice: info.totalPrice
        };

        await createReservation(requestData);
        
        if (reservationError) {
            setSnackbar({
                open: true,
                message: reservationError.message || '예약 중 오류가 발생했습니다.',
                severity: 'error'
            });
            return;
        }

        setSnackbar({
            open: true,
            message: '예약이 완료되었습니다.',
            severity: 'success'
        });
        setTimeout(() => {
            navigate('/my-reservation');
        }, 1800);
    };

    const handleGuestCountChange = (e) => {
        const newGuestCount = Number(e.target.value);
        setGuestCount(newGuestCount);

        const info = calculateReservationInfo(newGuestCount);
        if (info) {
            setAdditionalPolicies(info.policies);
        }
    };

    return (
        <>
            <Box sx={{
                padding: '0 16px',
                minHeight: '100vh',
                paddingBottom: '100px'
            }}>
                {campSiteData ? (
                    <div>
                        <div style={{fontSize: '0.9rem', textAlign: 'left', margin: '30px 0 0 0'}}>
                            {campSiteData.campSimpleDto.city} {campSiteData.campSimpleDto.state}
                        </div>
                        <div style={{fontSize: '1.8rem', textAlign: 'left', margin: '5px 0 20px 0', fontWeight: 'bold'}}>
                            <Link 
                                to={`/camps/${campSiteData.campSimpleDto.campId}`}
                                style={{ 
                                    textDecoration: 'none', 
                                    color: 'inherit',
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                {campSiteData.campSimpleDto.campName}
                            </Link>
                        </div>
                        <ReservationConfirmCard
                            data={campSiteData}
                        />

                        <div className="camp-detail-intro-box" style={{ marginTop: '50px'}}>
                            <span className="camp-detail-intro-title">예약 안내</span>
                            <div className="camp-detail-description" style={{
                                padding: '10px 5px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                            }}>
                                <p style={{marginBottom: '5px'}}>
                                    ▪︎ 저희 캠핑장은 현장 결제 시스템을 운영하고 있으며, 예약 시에는 결제가 이루어지지 않습니다. 캠핑장 도착 후 현장에서 결제를 완료해 주세요.
                                </p>
                                <p>
                                    ▪︎ 예약 취소는 당일 전 날 자정(24:00)까지 가능합니다. 이 시간 이후에는 예약 취소가 불가능하오니, 이 점 유의하시기 바랍니다.
                                </p>
                            </div>
                        </div>

                        <OperationPolicy
                            additionalPolicies={additionalPolicies}
                            title="예약 정보"
                            showDefaultPolicies={false}
                        />

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '30px',
                            marginBottom: '60px',
                            width: '100%'
                        }}>
                            <FormControl variant="outlined" style={{width: '150px'}}>
                                <InputLabel id="guestCount-label">게스트 수 선택</InputLabel>
                                <Select
                                    labelId="guestCount-label"
                                    id="guestCount"
                                    value={guestCount}
                                    onChange={handleGuestCountChange}
                                    label="게스트 수 선택"
                                    variant="outlined"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#ffc400',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#ffc400',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#ffc400',
                                            },
                                        },
                                    }}
                                >
                                    {[...Array(campSiteData.maximumPeople)].map((_, index) => (
                                        <MenuItem key={index} value={index + 1}>
                                            {index + 1}명
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <YellowButton
                                onClick={handleReserve}
                                size="large" 
                                style={{padding: '10px 50px'}}
                            >
                                예약하기
                            </YellowButton>
                        </Box>
                    </div>
                ) : null}
            </Box>

            <CustomSnackbar 
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </>
    );
};

export default Reservation;

