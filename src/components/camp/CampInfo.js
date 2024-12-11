import React from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PropTypes from "prop-types";

const CampInfo = ({ recommend, bookmark }) => {
    return (
        <div className="flex items-center space-x-6"> {/* space-x-6 클래스를 사용하여 요소 간의 간격을 넓힘 */}
            {/* 추천 수 */}
            <div className="flex items-center space-x-2"> {/* space-x-2 클래스를 사용하여 아이콘과 텍스트 간의 간격을 설정 */}
                <ThumbUpIcon className="text-blue-600" style={{ fontSize: '24px' }} />
                <span className="text-lg font-bold">+{recommend}</span>
            </div>

            {/* 찜 수 */}
            <div className="flex items-center space-x-2"> {/* space-x-2 클래스를 사용하여 아이콘과 텍스트 간의 간격을 설정 */}
                <FavoriteIcon className="text-red-500" style={{ fontSize: '24px' }} />
                <span className="text-lg font-bold">+{bookmark}</span>
            </div>
        </div>
    );
};

// PropTypes로 props 유효성 검증
CampInfo.propTypes = {
    recommend: PropTypes.number.isRequired,
    bookmark: PropTypes.number.isRequired,
};

export default CampInfo;
