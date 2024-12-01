import React, { useState } from "react";

const CampingCard = ({ image, name, address, keywords, intro, isLiked }) => {
    const [liked, setLiked] = useState(isLiked);

    const toggleLike = () => {
        setLiked(!liked);
    };

    return (
        <div className="max-w-xs border border-gray-200 rounded-lg shadow-md overflow-hidden">
            <div className="relative">
                <img
                    src={image}
                    alt={`${name} 사진`}
                    className="w-full h-44 object-cover"
                />
                <button
                    onClick={toggleLike}
                    className="absolute top-2 right-2 text-red-500 text-2xl focus:outline-none"
                >
                    {liked ? "❤️" : "🤍"}
                </button>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold mb-2">{name}</h3>
                <p className="text-sm text-gray-500 mb-2">{address}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                    {keywords.map((keyword, index) => (
                        <span
                            key={index}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
              #{keyword}
            </span>
                    ))}
                </div>
                <p className="text-sm text-gray-600">{intro}</p>
            </div>
        </div>
    );
};

export default CampingCard;
