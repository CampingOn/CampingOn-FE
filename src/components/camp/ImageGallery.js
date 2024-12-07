import React from "react";

const ImageGallery = ({ images, onMoreClick }) => {
    // 이미지 클릭 핸들러
    const handleImageClick = (imageSrc) => {
        window.open(imageSrc, "_blank"); // 새 탭에서 이미지 열기
    };

    return (
        <div className="camp-detail-gallery">
            {/* 대표 이미지 */}
            {images && images.length > 1 && (
                <div className="main-image" onClick={() => handleImageClick(images[1])}>
                    <img src={images[1]} alt="대표 이미지" /> {/* 두 번째 사진 */}
                </div>
            )}
            {/* 썸네일 이미지 */}
            <div className="thumbnail-images-grid">
                {images &&
                    [0, 2, 3, 4].map(
                        (index) =>
                            images[index] && (
                                <div
                                    key={index}
                                    className="thumbnail"
                                    onClick={() => handleImageClick(images[index])}
                                >
                                    <img src={images[index]} alt={`이미지 ${index + 1}`} />
                                </div>
                            )
                    )}
                {images.length > 5 && (
                    <button onClick={onMoreClick} className="view-more-button">
                        더보기
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImageGallery;