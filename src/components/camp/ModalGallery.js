import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const ModalGallery = ({ open, onClose, images }) => (
    <Modal open={open} onClose={onClose}>
        <Box
            sx={{
                p: 4,
                backgroundColor: "white",
                maxHeight: "83vh",
                overflow: "auto",
                width: "87%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                boxShadow: 24,
                borderRadius: 2,
            }}
        >
            <div className="modal-content">
                {images.map((image, index) => (
                    <div key={index} className="modal-thumbnail">
                        <img src={image} alt={`이미지 ${index + 1}`} className="modal-image" />
                    </div>
                ))}
            </div>
        </Box>
    </Modal>
);

export default ModalGallery;