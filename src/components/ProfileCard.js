import React from "react";

const ProfileCard = ({ nickname, email, imageUrl }) => {
    return (
        <div className="w-full flex justify-center" style={{ padding: "20px" }}>
            {/* 프로필 카드 */}
            <div
                className="p-6 border rounded-lg shadow-md bg-white flex items-center space-x-6"
                style={{ minHeight: "150px", maxWidth: "600px", width: "100%" }}
            >
                {/* 프로필 이미지 */}
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {imageUrl ? (
                        <img src={imageUrl} alt={`${nickname} 프로필`} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-500 text-sm">이미지 없음</span>
                    )}
                </div>

                {/* 텍스트 정보 */}
                <div>
                    <p className="text-lg font-bold text-gray-700">{nickname}</p>
                    <p className="text-sm text-gray-600">{email}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
