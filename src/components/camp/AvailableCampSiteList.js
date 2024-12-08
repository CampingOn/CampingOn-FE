import React from "react";
import CampSiteCard from "./CampSiteCard";

const AvailableCampSiteList = ({ campSites }) => {
    return (
        <div>
            {campSites.map((site) => (
                <CampSiteCard
                    key={site.siteId}
                    data={site}
                    count={1}
                    onReserve={() => alert(`예약: ${site.siteType}`)}
                />
            ))}
        </div>
    );
};

export default AvailableCampSiteList;