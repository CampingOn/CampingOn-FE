import React from "react";

const CampDetailIntro = ({ intro }) => (
    <div className="camp-detail-intro-box">
        <span className="camp-detail-intro-title">캠핑장 소개</span>
        <p className="camp-detail-description">
            {intro || "장문 소개 정보 없음"}
        </p>
    </div>
);

export default CampDetailIntro;