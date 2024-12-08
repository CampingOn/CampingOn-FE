import React, { useState } from "react";
import useAvailableCampSites from "../../hooks/useAvailableCampSites";

const AvailableCampSites = ({ campId }) => {
    const [checkin, setCheckin] = useState("");
    const [checkout, setCheckout] = useState("");

    const { loading, error, data: campSites } = useAvailableCampSites(campId, checkin, checkout);

    const handleSearch = () => {
        if (!checkin || !checkout) {
            alert("체크인과 체크아웃 날짜를 입력하세요.");
            return;
        }
        // 이미 데이터 로드가 자동으로 시작됨
    };

    return (
        <div>
            <h1>예약 가능한 캠핑지 목록</h1>
            <div>
                <label>
                    체크인 날짜:
                    <input
                        type="date"
                        value={checkin}
                        onChange={(e) => setCheckin(e.target.value)}
                    />
                </label>
                <label>
                    체크아웃 날짜:
                    <input
                        type="date"
                        value={checkout}
                        onChange={(e) => setCheckout(e.target.value)}
                    />
                </label>
                <button onClick={handleSearch}>검색</button>
            </div>

            {loading && <p>로딩 중...</p>}
            {error && <p>에러 발생: {error}</p>}
            {campSites.length > 0 ? (
                <ul>
                    {campSites.map((site) => (
                        <li key={site.id}>{site.name}</li>
                    ))}
                </ul>
            ) : (
                !loading && <p>예약 가능한 캠핑지가 없습니다.</p>
            )}
        </div>
    );
};

export default AvailableCampSites;
