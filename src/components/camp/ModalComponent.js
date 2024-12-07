import React from "react";
import "../../style/modal-component.css";

const ModalComponent = ({ open, onClose, title, message }) => {
    if (!open) return null; // 모달이 닫힌 상태이면 렌더링하지 않음

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <p>{message}</p>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default ModalComponent;