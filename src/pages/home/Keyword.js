import KeywordSelection from "../../components/main/KeywordSelection";
import {Box, Typography} from "@mui/material";

const Keyword = () => {
    return (
        <Box>
            <Box sx={{mt: 16, mb: 12, textAlign:"center"}}>
                <Typography variant="h5" sx={{fontWeight: "bold"}}>
                    🏕️ 나의 캠핑 취향은? 🏕️
                </Typography>
                <Typography variant="body2">
                    최대 5개까지 선택 가능합니다.
                </Typography>
            </Box>
            <KeywordSelection skip={true} />
        </Box>
    )
}

export default Keyword;
