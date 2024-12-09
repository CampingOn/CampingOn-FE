import React from "react";
import KakaoMap from "./KakaoMap";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const MapSection = ({ latitude, longitude, name, state }) => (
    <div className="map-wrapper">
        <h2 className="location-info-title">
            <LocationOnIcon style={{ verticalAlign: "middle", marginRight: "8px" }} />
            위치 정보
        </h2>
        <div className="map-container">
            <KakaoMap
                latitude={latitude}
                longitude={longitude}
                locationName={name}
                state={state}
            />
        </div>
    </div>
);

export default MapSection;