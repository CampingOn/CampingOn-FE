import React from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DateRangeIcon from "@mui/icons-material/DateRange";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

const ReservationCard = ({ reservation, buttonText, onButtonClick, useButton = false }) => {
    return (
        <div className="flex flex-col md:flex-row p-4 border rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-200 min-h-[200px] mx-auto relative" style={{ maxWidth: "80%" }}>
            {/* 이미지 영역 */}
            <img
                src={reservation.image}
                alt={reservation.title}
                className="w-full md:w-1/3 h-64 object-cover rounded-lg"
            />
            {/* 정보 영역 */}
            <div className="flex flex-col justify-between p-3 md:w-1/2 md:ml-6 space-y-1.5">
                <h3 className="text-2xl font-bold">{reservation.title}</h3>
                <div className="flex items-center text-gray-600 text-sm">
                    <LocationOnIcon className="mr-2 text-amber-500" />
                    {reservation.address}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                    <DateRangeIcon className="mr-2 text-blue-600" />
                    {reservation.date}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                    <GroupIcon className="mr-2 text-green-600" />
                    {reservation.people}명
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                    <AccessTimeIcon className="mr-2 text-indigo-600" />
                    체크인: {reservation.checkInTime} / 체크아웃: {reservation.checkOutTime}
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                    <ConfirmationNumberIcon className="mr-2 text-gray-500" />
                    예약번호: {reservation.reservationNumber}
                </div>
            </div>
            {/* 버튼 영역 */}
            {useButton && (
                <button
                    className="absolute bottom-4 right-4 px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors duration-200"
                    onClick={onButtonClick}
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
};

export default ReservationCard;
