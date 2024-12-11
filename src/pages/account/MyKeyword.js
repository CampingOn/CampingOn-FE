import KeywordSelection from "components/main/KeywordSelection";
import {Box} from "@mui/material";

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
            <KeywordSelection
                title="나만의 키워드"
                skip = {false}/>
        </Box>
    );
};

export default MyKeywords;
