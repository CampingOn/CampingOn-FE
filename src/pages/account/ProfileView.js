import React, { useEffect } from "react";
import ProfileCard from "components/common/ProfileCard";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { userService } from "api/services/userService";
import { useApi } from "hooks/useApi";
import { reservationService } from "api/services/reservationService";
import { CampReservationCard } from "components";


const imageUrl = 'profile.png';

const ProfileView = () => {

    const {
        execute: getUserInfo,
        loading: userLoading,
        error: userError,
        data: userInfo
    } = useApi(userService.getUserInfo);
    const {
        execute: getUpcomingReservation,
        loading: reservationsLoading,
        error: reservationsError,
        data: upcomingReservation
    } = useApi(reservationService.getUpcomingReservation);


    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUserInfo(); // 먼저 유저 정보를 가져옴
                await getUpcomingReservation();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);


    if (userLoading || reservationsLoading) return <div>Loading...</div>;
    if (userError || reservationsError) return <div>Error
        occurred: {userError?.message || reservationsError?.message}</div>;
    if (!userInfo) return <div>No user information found</div>;

    return (
        <div className="justify-center items-center">
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
                        <CampReservationCard data={upcomingReservation}/>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center p-6">
                            <CalendarTodayIcon
                                style={{fontSize: 60, color: "#b0b0b0"}} // 연한 회색, 아이콘 크기 조정
                            />
                            <p className="text-gray-600 mt-4 text-sm">
                                예약된 캠핑장이 없습니다.
                                <br/>
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
