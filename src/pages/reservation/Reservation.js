import React, {useEffect, useState} from 'react';
import {FormControl, InputLabel, Select, MenuItem, Box, Snackbar, Alert, Grow} from '@mui/material';
import {campSiteService} from 'api/services/campSiteService';
import {reservationService } from "api/services/reservationService";
import {ReservationConfirmCard, YellowButton, OperationPolicy, CustomSnackbar} from 'components';
import {useApi} from "hooks/useApi";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import StyledSelect from 'components/common/StyledSelect';

const Reservation = () => {
    const { campId, siteId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const navigate = useNavigate();
    const [additionalPolicies, setAdditionalPolicies] = useState([]);
    const [guestCnt, setGuestCnt] = useState(1);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

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

    // 쿼리 스트링의 날짜 정보
    const [checkinDate] = useState(queryParams.get('checkin'));
    const [checkoutDate] = useState(queryParams.get('checkout'));

    // 날짜별 총금액 가공 함수
    const calculateTotalPrice = (price, checkinDate, checkoutDate) => {
        const checkin = new Date(checkinDate);
        const checkout = new Date(checkoutDate);
        const nightCount = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
        let totalPrice = price * nightCount;
        const reservationDate = `${checkinDate} ~ ${checkoutDate}`;

        // 게스트 5명 이상일 때 1인당 1만원 추가
        if (guestCnt >= 5) {
            const additionalGuests = guestCnt - 4;
            const additionalFee = additionalGuests * 10000 * nightCount;
            totalPrice += additionalFee;
        }

        return {
            nightCount,
            totalPrice,
            reservationDate
        };
    };

    // 게스트 수, 계산된 총금액, 예약날짜를 OperationPolicy 컴포넌트에 전송
    const calculateReservationInfo = (count = guestCnt) => {
        if (!campSiteData) return null;

        const { totalPrice, reservationDate } = calculateTotalPrice(
            campSiteData.price,
            checkinDate,
            checkoutDate
        );

        return {
            reservationDate,
            totalPrice,
            policies: [
                { label: '예약 날짜', value: reservationDate },
                { label: '결제 금액', value: totalPrice.toLocaleString() + '원' },
                { label: '인원', value: count },
            ]
        };
    };

    // 날짜 유효성 검사
    const validateDates = () => {

        if (!checkinDate || !checkoutDate) {
            setSnackbar({
                open: true,
                message: '예약 날짜를 선택해주세요.',
                severity: 'error'
            });
            return false;
        }

        // 날짜 형식 검사 (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(checkinDate) || !dateRegex.test(checkoutDate)) {
            setSnackbar({
                open: true,
                message: '올바른 날짜 형식이 아닙니다.',
                severity: 'error'
            });
            return false;
        }

        // 유효한 날짜인지 검사
        const checkin = new Date(checkinDate);
        const checkout = new Date(checkoutDate);
        
        if (isNaN(checkin.getTime()) || isNaN(checkout.getTime())) {
            setSnackbar({
                open: true,
                message: '유효하지 않은 날짜입니다.',
                severity: 'error'
            });
            return false;
        }

        // 체크아웃이 체크인보다이후인지 검사
        if (checkout <= checkin) {
            setSnackbar({
                open: true,
                message: '체크아웃 날짜는 체크인 날짜보다 이후여야 합니다.',
                severity: 'error'
            });
            return false;
        }

        return true;
    };

    useEffect(() => {
        const isValid = validateDates();
        if (!isValid) {
            const timer = setTimeout(() => {
                navigate(`/camps/${campId}`);
            }, 2000);
            return () => clearTimeout(timer);
        }

        getCampSite(campId, siteId, checkinDate, checkoutDate);
    }, [checkinDate, checkoutDate, campId, siteId]);

    useEffect(() => {
        if (campSiteData) {
            const { totalPrice, reservationDate } = calculateTotalPrice(
                campSiteData.price,
                checkinDate,
                checkoutDate
            );

            setAdditionalPolicies([
                { label: '예약 날짜', value: reservationDate },
                { label: '결제 금액', value: '￦ ' + totalPrice.toLocaleString() },
                { label: '인원', value: guestCnt + ' 명' },
            ]);
        }
    }, [campSiteData, guestCnt]);

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
            guestCnt,
            totalPrice: info.totalPrice
        };

        console.table([{title: '새 예약 요청', ...requestData}]);

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

    const handleGuestCntChange = (e) => {
        const newGuestCnt = Number(e.target.value);
        setGuestCnt(newGuestCnt);

        const info = calculateReservationInfo(newGuestCnt);
        if (info) {
            setAdditionalPolicies(info.policies);
        }
    };

    // 날짜 포맷팅 함수 추가
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일`;
    };

    // 하루 전 날짜 계산
    const getPreviousDay = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() - 1);
        return formatDate(date);
    };

    // 메인 컨텐츠 렌더링 조건
    const renderContent = () => {
        if (campSiteLoading) return <div>Loading...</div>;
        if (campSiteError) return <div>Error occurred</div>;
        if (!campSiteData) return null;

        return (
            <Box sx={{
                padding: '0 16px',
                minHeight: '100vh',
                paddingBottom: '0px',
                marginTop: '60px'
            }}>
                {campSiteData ? (
                    <div>
                        <div style={{fontSize: '1.8rem', textAlign: 'left', fontWeight: 'bold', marginBottom: '20px'}}>
                            예약 확인
                        </div>
                        <ReservationConfirmCard
                            data={campSiteData}
                        />

                        <div className="camp-detail-intro-box" style={{ margin: '30px 0'}}>
                            <span className="camp-detail-intro-title">예약 안내</span>
                            <div className="camp-detail-description" style={{
                                padding: '10px 5px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                height: '100%',
                            }}>
                                <p style={{marginBottom: '5px'}}>
                                    ▪ 저희 캠핑장은 현장 결제 시스템을 운영하고 있으며, 예약 시에는 결제가 이루어지지 않습니다. 캠핑장 도착 후 현장에서 결제를 완료해 주세요.
                                </p>
                                <p style={{marginBottom: '5px'}}>
                                    ▪ 예약 취소는 {getPreviousDay(checkinDate)} 자정(24:00)까지 가능합니다. 이 시간 이후에는 예약 취소가 불가능하오니, 이 점 유의하시기 바랍니다.
                                </p>
                                <p>
                                    ▪ 5명 이상 예약 시 추가 인원 1명당 1박에 10,000원의 추가 요금이 발생합니다.
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
                            width: '100%'
                        }}>
                            <FormControl variant="outlined" style={{width: '150px'}}>
                                <InputLabel 
                                    id="guestCnt-label"
                                    sx={{
                                        '&.Mui-focused': { 
                                            color: '#ffc400'
                                        }
                                    }}
                                >
                                    게스트 수 선택
                                </InputLabel>
                                <StyledSelect
                                    labelId="guestCnt-label"
                                    id="guestCnt"
                                    value={guestCnt}
                                    onChange={handleGuestCntChange}
                                    label="게스트 수 선택"
                                    style={{width: '170px'}}
                                    MenuProps={{ 
                                        PaperProps: {
                                            sx: {
                                                '& .MuiMenuItem-root': {
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#fcd34d !important',
                                                        color: 'white',
                                                        '&:hover': {
                                                            backgroundColor: '#fcd34d !important',
                                                        },
                                                        '& .MuiTouchRipple-child': {
                                                            backgroundColor: 'rgb(255,255,255)'
                                                        }
                                                    },
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(252,211,77,0.22)'
                                                    },
                                                    '& .MuiTouchRipple-child': {
                                                        backgroundColor: 'rgba(168,131,0,0.38)'
                                                    }
                                                }
                                            }
                                        }
                                    }}
                                >
                                    {[...Array(campSiteData.maximumPeople)].map((_, index) => (
                                        <MenuItem key={index} value={index + 1}>
                                            {index + 1}명
                                        </MenuItem>
                                    ))}
                                </StyledSelect>
                            </FormControl>

                            <YellowButton
                                onClick={handleReserve}
                                size="large"
                                style={{backgroundColor: '#ff8146'}}
                            >
                                예약확정
                            </YellowButton>
                        </Box>
                    </div>
                ) : null}
            </Box>
        );
    };

    return (
        <>
            {renderContent()}
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

