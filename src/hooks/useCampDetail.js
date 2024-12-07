import { useState, useEffect } from "react";
import { campService } from "../api/services/campService";

export const useCampDetail = (campId) => {
    const [campDetails, setCampDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCampDetails = async () => {
            try {
                const response = await campService.getCampDetail(campId);
                setCampDetails(response.data);
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCampDetails();
    }, [campId]);

    return { campDetails, loading, error };
};