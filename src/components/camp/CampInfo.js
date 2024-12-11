import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PropTypes from "prop-types";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const CampInfo = ({ recommend, bookmark }) => {
    return (
        <div className="flex items-center space-x-6"
             style={{ marginTop: 'auto' }} // 하단으로 밀어내기
        > {/* space-x-6 클래스를 사용하여 요소 간의 간격을 넓힘 */}
            {/* 추천 수 */}
            <div className="flex items-center space-x-2"> {/* space-x-2 클래스를 사용하여 아이콘과 텍스트 간의 간격을 설정 */}
                <ThumbUpIcon style={{ fontSize: '24px', color: "#5c6bc0"}} />
                <span className="text-lg font-bold"> {recommend}</span>
            </div>

            {/* 찜 수 */}
            <div className="flex items-center space-x-2"> {/* space-x-2 클래스를 사용하여 아이콘과 텍스트 간의 간격을 설정 */}
                <FavoriteIcon style={{ fontSize: '24px', color: "#ff7961" }} />
                <span className="text-lg font-bold"> {bookmark}</span>
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
