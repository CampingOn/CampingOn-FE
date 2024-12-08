import KeywordSelection from "../../components/KeywordSelection";
import {Box, Typography} from "@mui/material";

const MyKeywords = () => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography variant="h5" sx={{fontWeight: "bold", mt: 4}}>
                🏕️ 나만의 키워드 🏕️
            </Typography>
            <Typography variant="body2" sx={{ mb: 4 , color: "grey"}}>
                최대 5개까지 등록 가능합니다.
            </Typography>
            <KeywordSelection skip = {false}/>
        </Box>
    );
};

export default MyKeywords;
