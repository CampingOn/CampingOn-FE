import React, {useEffect, useState} from "react";
import ReservationCard from "components/ReservationCard";
import ProfileCard from "components/ProfileCard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {userService} from "api/services/userService";
import {useApi} from "hooks/useApi";
import {reservationService} from "../../api/services/reservationService";


const imageUrl = 'profile.png';

const ProfileView = () => {

    const { execute: getUserInfo, loading: userLoading, error: userError, data: userInfo } = useApi(userService.getUserInfo);
    const { execute: getReservations, loading: reservationsLoading, error: reservationsError, data: reservations } = useApi(reservationService.getReservations);

    const [upcomingReservation, setUpcomingReservation] = useState(null);



    useEffect(() => {
        getUserInfo();
        getReservations(0);
    }, []);

    // api를 따로 만드는게 좋을지?
    useEffect(() => {
        if (reservations && reservations.length > 0) {
            // 체크인 날짜 기준 가장 가까운 예약 찾기
            const closestReservation = reservations.reduce((closest, current) => {
                const currentDate = new Date(current.checkIn);
                const closestDate = new Date(closest.checkIn);

                return currentDate < closestDate ? current : closest;
            });
            setUpcomingReservation(closestReservation);
        }
    }, [reservations]);



    if (userLoading || reservationsLoading) return <div>Loading...</div>;
    if (userError || reservationsError) return <div>Error occurred: {userError?.message || reservationsError?.message}</div>;
    if (!userInfo) return <div>No user information found</div>;

    return (
        <div className="justify-center items-center min-h-screen">
            {/* 중앙 정렬 및 폭 설정 */}
            <div className="w-full bg-white p-8 shadow-lg rounded-lg">
                <h2 className="text-xl font-bold mb-4">프로필</h2>
                <ProfileCard
                    nickname={userInfo.nickname}
                    email={userInfo.email}
                    imageUrl={imageUrl}
                />
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">다가오는 예약</h2>
                    {upcomingReservation ? (
                        <ReservationCard reservation={upcomingReservation} />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6">
                            <CalendarTodayIcon
                                style={{ fontSize: 60, color: "#b0b0b0" }} // 연한 회색, 아이콘 크기 조정
                            />
                            <p className="text-gray-600 mt-4 text-sm">
                                예약된 캠핑장이 없습니다.
                                <br />
                                마음에 드는 캠핑장에 예약을 진행해보세요!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
