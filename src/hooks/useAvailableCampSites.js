import { useState, useEffect } from "react";
import { campSiteService } from "../api/services/campSiteService";

const useAvailableCampSites = (campId, checkin, checkout) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!checkin || !checkout) return;

        const fetchAvailableCampSites = async () => {
            setLoading(true);
            try {
                const response = await campSiteService.getAvailableCampSites(
                    campId,
                    checkin,
                    checkout
                );
                setData(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAvailableCampSites();
    }, [campId, checkin, checkout]);

    return { loading, error, data };
};

export default useAvailableCampSites;
