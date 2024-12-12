import React, { useEffect } from 'react';

const KakaoMap = ({ latitude, longitude, locationName, state }) => {
    useEffect(() => {
        const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY;
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoApiKey}&autoload=false`;
        script.async = true;

        document.head.appendChild(script);

        script.onload = () => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map');
                const options = {
                    center: new window.kakao.maps.LatLng(latitude, longitude),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(container, options);

                const markerPosition = new window.kakao.maps.LatLng(latitude, longitude);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                });
                marker.setMap(map);

                // 확대/축소 컨트롤 추가
                const zoomControl = new window.kakao.maps.ZoomControl();
                map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

                // 커스텀 오버레이 추가 (마커에 마우스 올렸을 때 표시될 내용)
                const overlayContent = `<div style="padding:5px; background-color: white; border: 1px solid #ccc; border-radius: 4px; box-shadow: 0 0 5px rgba(0,0,0,0.3);">${locationName}</div>`;
                const customOverlay = new window.kakao.maps.CustomOverlay({
                    content: overlayContent,
                    position: markerPosition,
                    yAnchor: 2.5,
                    zIndex: 3,
                    map: null // 기본적으로 보이지 않도록 설정
                });

                // 마커에 마우스를 올렸을 때 오버레이 보이기
                window.kakao.maps.event.addListener(marker, 'mouseover', () => {
                    customOverlay.setMap(map);
                });

                // 마커에서 마우스를 뗐을 때 오버레이 숨기기
                window.kakao.maps.event.addListener(marker, 'mouseout', () => {
                    customOverlay.setMap(null);
                });

                // 마커 클릭 시 카카오맵 웹 페이지로 이동 (검색된 상태)
                const kakaoMapLink = `https://map.kakao.com/link/search/${encodeURIComponent(`${state} ${locationName}`)}`;
                window.kakao.maps.event.addListener(marker, 'click', () => {
                    window.open(kakaoMapLink, '_blank');
                });
            });
        };
    }, [latitude, longitude, locationName, state]);

    return <div id="map" style={{ 
        width: '100%', 
        height: '100%',  // 부모 컨테이너의 높이에 맞춤
        minHeight: '324px'  // 최소 높이 설정
    }}></div>;
};

export default KakaoMap;