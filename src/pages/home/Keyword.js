import KeywordSelection from "components/main/KeywordSelection";
import { Box } from "@mui/material";

const Keyword = () => {
    return (
        <Box sx={{mt: 16}}>
            <KeywordSelection
                title="나의 캠핑 취향은?"
                skip={true}
            />
        </Box>
    )
}

export default Keyword;
