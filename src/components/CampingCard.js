import React, { useState } from "react";

const CampingCard = ({ thumbImage, name, address, keywords, lineIntro, marked }) => {
    const [liked, setLiked] = useState(marked);

    const toggleLike = () => {
        setLiked(!liked);
    };

    return (
        <div className="w-80 h-64 border border-gray-200 rounded-lg shadow-md overflow-hidden"> {/* 크기 조정 */}
            <div className="relative w-full h-36"> {/* 이미지 영역 */}
                <img
                    src={thumbImage}
                    alt={`${name} 사진`}
                    className="w-full h-full object-cover"
                />
                <button
                    onClick={toggleLike}
                    className="absolute top-2 right-2 text-red-500 text-2xl focus:outline-none"
                >
                    {liked ? "❤️" : "🤍"}
                </button>
            </div>
            <div className="p-3"> {/* 텍스트 영역 */}
                <h3 className="text-lg font-bold mb-1 truncate">{name}</h3> {/* 제목 */}
                <p className="text-sm text-gray-500 mb-1 truncate">{address}</p> {/* 주소 */}
                <div className="flex flex-wrap gap-1 mb-1">
                    {keywords.map((keyword, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                    #{keyword}
                </span>
                    ))}
                </div>
                <p className="text-sm text-gray-600 truncate">{lineIntro}</p> {/* 소개 */}
            </div>
        </div>
    );
};

export default CampingCard;
