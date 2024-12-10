import React from "react";

const ReviewCard = ({ image, address, name, title, review, isRecommended }) => {
    return (
        <div className="flex border border-gray-300 rounded-lg shadow-md overflow-hidden w-[500px] h-[170px]">
            {/* 이미지 영역 */}
            <div className="w-1/3 h-full">
                {image ? (
                    <img
                        src={image}
                        alt={`${name} 이미지`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        이미지 없음
                    </div>
                )}
            </div>

            {/* 내용 영역 */}
            <div className="w-2/3 p-4 flex flex-col justify-between">
                {/* 주소와 이름 */}
                <h3 className="text-sm font-medium text-blue-500 mb-1 truncate">
                    {address} | {name}
                </h3>
                {/* 리뷰 제목 */}
                <h4 className="text-base font-semibold text-black mb-1 truncate">
                    {title}
                </h4>
                {/* 리뷰 내용 */}
                <p className="text-sm text-gray-600 mb-2 overflow-hidden overflow-ellipsis">
                    {review}
                </p>
                {/* 추천 여부 */}
                <div className="flex justify-end">
                    <span
                        className={`text-sm font-semibold ${
                            isRecommended ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {isRecommended ? "추천합니다!" : "추천하지 않습니다"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;