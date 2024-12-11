import React from "react";
import WebIcon from "@mui/icons-material/Web";
import CallIcon from "@mui/icons-material/Call";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const AddressInfo = ({ address, tel, homepage }) => (
    <div className="camp-detail-info-bar">
        {/* 도로명 주소 */}
        <div className="info-bar-section">
            <LocationOnIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
            <span>{address || "도로명 주소 정보 없음"}</span>
        </div>
        {/* 연락처 */}
        <div className="info-bar-section">
            <CallIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
            <span>{tel || "연락처 정보 없음"}</span>
        </div>
        {/* 홈페이지 */}
        <div className="info-bar-section">
            <WebIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
            {homepage ? (
                <a
                    href={homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="homepage-link"
                >
                    홈페이지 바로가기
                </a>
            ) : (
                "홈페이지 정보 없음"
            )}
        </div>
    </div>
);

export default AddressInfo;