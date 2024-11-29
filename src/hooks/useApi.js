import { useState } from 'react';

export const useApi = (apiFunc) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const execute = async (...args) => {
        try {
            setLoading(true);
            const response = await apiFunc(...args);
            setData(response.data);
            return response.data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { execute, loading, error, data };
};