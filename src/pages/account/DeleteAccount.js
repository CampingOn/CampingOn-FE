import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {userService} from "../../api/services/userService";

const AccountDeletionPage = () => {
    const [reason, setReason] = useState(""); // 탈퇴 사유
    const [password, setPassword] = useState(""); // 비밀번호
    const [open, setOpen] = useState(false); // 모달 열림 여부

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteAccount = async () => {
        try {
            // 탈퇴 사유만 서버로 전송
            await userService.deleteUser(reason);

            // 로그아웃 처리
            localStorage.removeItem("accessToken"); // 로컬 스토리지 토큰 제거
            alert("회원 탈퇴가 완료되었습니다.");

            setOpen(false);

            // 로그아웃 후 리다이렉트
            window.location.href = "/"; // 메인 페이지로 리다이렉트
        } catch (error) {
            // 오류 메시지 표시
            console.error("회원 탈퇴 오류:", error);
            alert(error.response?.data?.message || "회원 탈퇴 중 오류가 발생했습니다.");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start", // 상단에 배치
                padding: "40px 20px", // 상단 여백 조정
                backgroundColor: "#ffffff",
            }}
        >
            <h2 className="text-xl font-bold mb-4">회원 탈퇴</h2>

            {/* 탈퇴 사유 입력칸 */}
            <TextField
                label="탈퇴 사유"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ maxWidth: "500px", marginBottom: "20px" }}
            />

            {/* 비밀번호 입력칸 */}
            <TextField
                label="비밀번호"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ maxWidth: "500px", marginBottom: "20px" }}
            />

            {/* 회원 탈퇴 버튼 */}
            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#3f51b5',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#002984',
                    },
                }}
                onClick={handleClickOpen}
                style={{ maxWidth: "500px", width: "100%" }}
            >
                회원 탈퇴
            </Button>

            {/* 모달 창 */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>회원 탈퇴 확인</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        정말로 회원 탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleDeleteAccount} color="error">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default AccountDeletionPage;
