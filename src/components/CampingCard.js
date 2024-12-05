import React, {useState} from "react";
import {bookmarkService} from "../api/services/bookmarkService";
import {Snackbar} from "@mui/material";

const CampingCard = ({thumbImage, name, address, intro, keywords, lineIntro, marked, onClick, campId}) => {
    const isAuthenticated = localStorage.getItem("accessToken");
    const [liked, setLiked] = useState(marked);
    const [snackbarNone, setSnackbarNone] = useState(false);
    const [snackbarBookmark, setSnackbarBookmark] = useState(false);

    const toggleLike = async (event) => {
        event.stopPropagation(); // 부모의 onClick 이벤트가 실행되지 않도록 중단

        if (!isAuthenticated) {
            setSnackbarNone(true); // Snackbar 열기
        } else {
            try {
                console.log("campId: " + campId);
                await bookmarkService.toggleBookmark(campId);
                setLiked(!liked);
                setSnackbarBookmark(true);
            } catch (error) {
                console.error("찜 클릭 에러 : ", error);
            }
        }
    };

    const handleCloseNone = () => {
        setSnackbarNone(false);
    };

    const handleCloseBookmark = () => {
        setSnackbarBookmark(false);
    };

    return (
        <div
            onClick={onClick} // 부모 컴포넌트에서 전달받은 onClick 이벤트 연결
            className="w-80 h-64 border border-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer"
        >
            <div className="relative w-full h-36"> {/* 이미지 영역 */}
                <img
                    src={thumbImage}
                    alt={`${name} 사진`}
                    className="w-full h-full object-cover"
                />
                <button
                    onClick={toggleLike} // 좋아요 버튼 클릭 이벤트
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
            <Snackbar
                open={snackbarNone}
                autoHideDuration={1500}
                onClose={handleCloseNone}
                message="회원만 이용할 수 있는 기능입니다."
            />
            <Snackbar
                open={snackbarBookmark}
                autoHideDuration={1500}
                onClose={handleCloseBookmark}
                message="찜 상태를 변경하였습니다"
            />
        </div>
    );
};

export default CampingCard;