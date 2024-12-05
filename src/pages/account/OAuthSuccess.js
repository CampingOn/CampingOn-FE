import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress"; // Material-UI 스피너 import
import Box from "@mui/material/Box";

const OAuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/token/refresh`, {
                    withCredentials: true, // 쿠키 포함
                });

                // 토큰 저장 (예: Local Storage)
                localStorage.setItem("accessToken", response.data.accessToken);

                // 페이지 이동
                navigate("/");
            } catch (error) {
                console.error("Error fetching tokens:", error);
            }
        };

        fetchTokens();
    }, [navigate]);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress /> {/* Material-UI 스피너 */}
        </Box>
    );
};

export default OAuthSuccess;
