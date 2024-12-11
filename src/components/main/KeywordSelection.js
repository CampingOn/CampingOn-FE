import React, { useEffect, useState } from "react";
import {Box, Chip, Typography, Button, CircularProgress} from "@mui/material";
import { userService } from "api/services/userService"; // userService 경로에 맞게 수정
import { useApi } from "hooks/useApi";
import {useNavigate} from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"; // useApi 경로에 맞게 수정

// 해시태그 매핑 (표시되는 해시태그 : 실제 DB 키워드)
const tagMapping = {
    "#온수_잘_나오는": "온수 잘 나오는",
    "#힐링": "힐링",
    "#친절한": "친절한",
    "#별_보기_좋은": "별 보기 좋은",
    "#커플": "커플",
    "#그늘이_많은": "그늘이 많은",
    "#가족": "가족",
    "#물놀이_하기_좋은": "물놀이 하기 좋은",
    "#바다가_보이는": "바다가 보이는",
    "#아이들_놀기_좋은": "아이들 놀기 좋은",
    "#여유있는": "여유있는",
    "#깨끗한": "깨끗한",
    "#차대기_편한": "차대기 편한",
    "#재미있는": "재미있는",
    "#사이트_간격이_넓은": "사이트 간격이 넓은",
};

const hashtags = Object.keys(tagMapping); // 표시할 해시태그 목록

const MAX_SELECTION_COUNT = 5; // 최대 선택 가능 태그 수

const KeywordSelection = ({ title, skip = false }) => {
    const [selectedTags, setSelectedTags] = useState([]); // 선택된 태그를 추적
    const { execute: fetchSelectedTags, loading } = useApi(userService.getMyKeywordList);
    const { execute: updateSelectedTags } = useApi(userService.updateMyKeyword);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);



    // 초기 로드 시 사용자 선택 태그 불러오기
    useEffect(() => {
        const loadSelectedTags = async () => {
            try {
                const data = await fetchSelectedTags();
                const dbKeywords = data?.keywords || []; // 서버로부터 받은 실제 키워드
                // DB 키워드를 화면의 태그로 변환
                const mappedTags = dbKeywords
                    .map((dbKeyword) => Object.keys(tagMapping).find((key) => tagMapping[key] === dbKeyword))
                    .filter(Boolean); // 매핑된 태그만 남기기 (undefined 제거)
                setSelectedTags(mappedTags);
            } catch (error) {
                console.error("태그 불러오기 실패:", error);
            }
        };

        loadSelectedTags();
    }, []);

    // 태그 클릭 이벤트
    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            // 이미 선택된 태그 -> 선택 해제
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else if (selectedTags.length < MAX_SELECTION_COUNT) {
            // 선택된 태그가 5개 미만일 때만 새 태그 선택
            setSelectedTags([...selectedTags, tag]);
        }
    };

    // 선택 완료 버튼 클릭 이벤트
    const handleComplete = async () => {
        try {
            // 화면의 태그를 DB에 저장할 키워드로 변환
            const dbKeywords = selectedTags.map((tag) => tagMapping[tag]);
            await updateSelectedTags({ keywords: dbKeywords });
            // 키워드 선택 페이지
            if (skip) navigate("/");

            // 마이페이지의 경우
            handleOpen();

        } catch (error) {
            console.error("선택 완료 API 호출 실패:", error);
        }
    };


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <Box
            sx={{
                width: "60vw", // 고정 너비 설정
                margin: "0 auto", // 중앙 정렬
                padding: "2rem", // 내부 여백
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // 수평 중앙 정렬
                gap: 4, // 키워드 목록과 버튼 사이의 간격
            }}
        >
            {loading ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                    <CircularProgress/>
                </div>
            ) : (
                <>
                    {/* 타이틀 부분 */}
                    <Box sx={{mb: 12, textAlign:"center"}}>
                        <Typography variant="h5" sx={{fontWeight: "bold"}}>
                            🏕️ {title} 🏕️
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 4 , color: "grey"}}>
                            최대 5개까지 선택 가능합니다.
                        </Typography>
                    </Box>
                    {/* 키워드 목록 */}
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2, // 줄 간 간격
                        }}
                    >
                        {hashtags
                            .reduce((rows, tag, index) => {
                                const rowIndex = Math.floor(index / 4); // 4개씩 한 줄
                                if (!rows[rowIndex]) rows[rowIndex] = [];
                                rows[rowIndex].push(tag);
                                return rows;
                            }, [])
                            .map((rowTags, rowIndex) => (
                                <Box
                                    key={rowIndex}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: 2, // 태그 간 간격
                                    }}
                                >
                                    {rowTags.map((tag, index) => (
                                        <Chip
                                            key={index}
                                            label={tag}
                                            onClick={() => toggleTag(tag)} // 클릭 시 상태 변경
                                            sx={{
                                                padding: "10px",
                                                fontSize: "1rem",
                                                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                transition: "all 0.3s ease",
                                                backgroundColor: selectedTags.includes(tag)
                                                    ? "#ffca28" // 선택된 태그 (진한 앰버)
                                                    : "white", // 기본 상태
                                                fontWeight: selectedTags.includes(tag) ? "bold" : "",
                                                "&:hover": {
                                                    backgroundColor: selectedTags.includes(tag)
                                                        ? "#ffca28" // 선택된 태그는 색 고정
                                                        : selectedTags.length < MAX_SELECTION_COUNT
                                                            ? "#ffecb3" // 호버 시 연한 앰버
                                                            : "#f5f5f5", // 최대 선택이 이미 되었으면 호버 색 변경 X
                                                },
                                                opacity:
                                                    selectedTags.length >= MAX_SELECTION_COUNT &&
                                                    !selectedTags.includes(tag)
                                                        ? 0.6 // 이미 5개가 선택되었을 때 선택되지 않은 태그는 반투명으로 표시
                                                        : 1,
                                            }}
                                        />
                                    ))}
                                </Box>
                            ))}
                    </Box>

                    {/* 버튼 섹션 */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: skip ? "space-between" : "center",
                            alignItems: "center",
                            width: "100%", // 버튼 섹션이 키워드 박스와 동일한 너비
                            gap: 2, // 버튼 간 간격
                            mt: 12
                        }}
                    >
                        {skip && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#9e9e9e",
                                    cursor: "pointer",
                                    "&:hover": { color: "#616161" }, // 호버 시 색상 변경
                                    fontSize: "0.875rem", // 작은 글씨 크기
                                }}
                                onClick={() => navigate("/")}
                            >
                                건너뛰기 →
                            </Typography>
                        )}

                        <Button
                            variant="contained"
                            onClick={handleComplete}
                            disabled={selectedTags.length === 0}
                            sx={{
                                padding: "8px 20px",
                                fontSize: "1rem",
                                backgroundColor: selectedTags.length > 0 ? "#ff8146" : "#e0e0e0",
                                color: "#f5f5f5",
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                borderRadius: '0.375rem',
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    backgroundColor: selectedTags.length > 0 ? "#ff6927" : "#e0e0e0",
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                },
                            }}
                        >
                            선택 완료
                        </Button>
                    </Box>
                    <Snackbar
                        open={open}
                        autoHideDuration={3000}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                            키워드 업데이트가 완료되었습니다!
                        </Alert>
                    </Snackbar>

                </>
            )}
        </Box>
    );
};

export default KeywordSelection;
