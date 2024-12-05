import { useEffect, useState } from 'react';
import { useApi } from 'hooks/useApi';
import { campSiteService } from 'api/services/campSiteService';
import { ReservationConfirmCard } from "components";
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import YellowButton from 'components/YellowButton';

const Reservation = () => {
    const { execute: getCampSite, loading, error, data } = useApi(campSiteService.getCampSite);
    
    const [campId] = useState(10);
    const [siteId] = useState(5);
    const [guestCount, setGuestCount] = useState(1);

    // 체크인 및 체크아웃 날짜 상태 추가
    const [checkinDate, setCheckinDate] = useState("2023-10-01");
    const [checkoutDate, setCheckoutDate] = useState("2023-10-05");

    useEffect(() => {
        if (campId && siteId) {
            getCampSite(campId, siteId);
        }
    }, [campId, siteId]);

    console.log('Loading:', loading);
    console.log('Error:', error);
    console.log('Data:', data);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error occurred</div>;
    if (!data) return <div>No data</div>;

    const campSiteData = data;

    console.log('Camp Site Data:', campSiteData);

    const handleReserve = () => {
        console.log('예약이 완료되었습니다.');
        // 예약 관련 API 호출 또는 다른 로직을 여기에 추가
    };

    // 체크인 및 체크아웃 날짜 차이 계산
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const nightCount = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
    const totalPrice = campSiteData.price * nightCount;

    return (
        <Box sx={{ padding: '0 16px' }}>
            <div>
                <div style={{ fontSize: '0.9rem', textAlign: 'left', margin: '50px 0 0 0' }}>
                    강원도 춘천시
                </div>
                <div style={{ fontSize: '1.8rem', textAlign: 'left', margin: '5px 0 20px 0', fontWeight: 'bold' }}>
                    OOO캠핑장
                </div>
                
                {campSiteData ? (
                    <>
                        <ReservationConfirmCard
                            data={campSiteData}
                        />


                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                            marginTop: '60px', width: '100%' }}>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' , justifyContent: 'space-between', height: '100%'}}>
                                <Typography variant="body1">{checkinDate} - {checkoutDate}</Typography>
                                <Typography variant={"h6"}>총 결제 금액: {totalPrice.toLocaleString()}원</Typography>
                            </Box>

                            <FormControl variant="outlined" style={{ width: '200px', marginLeft: '40px' }}>
                                <InputLabel id="guestCount-label">게스트 수 선택</InputLabel>
                                <Select
                                    labelId="guestCount-label"
                                    id="guestCount"
                                    value={guestCount}
                                    onChange={(e) => setGuestCount(Number(e.target.value))}
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

                        </Box>

                        <Box sx={{ textAlign: 'right', marginTop: '120px'}}>
                            <YellowButton
                                onClick={handleReserve}
                                size="large"
                            >
                                &nbsp;&nbsp;예약하기&nbsp;&nbsp;
                            </YellowButton>
                        </Box>
                    </>
                ) : (
                    <div></div>
                )}
            </div>
        </Box>
    );
};

export default Reservation;
