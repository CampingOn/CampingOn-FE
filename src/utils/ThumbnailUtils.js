export const defaultThumbnails = [
    `${process.env.PUBLIC_URL}/default/thumbnail/image1.png`,
    `${process.env.PUBLIC_URL}/default/thumbnail/image2.png`,
    `${process.env.PUBLIC_URL}/default/thumbnail/image3.png`,
];

export const getRandomThumbnail = (thumbImage, id) => {
    if (thumbImage === "") {
        const index = id % defaultThumbnails.length;
        return defaultThumbnails[index];
    }
    return thumbImage;
}; 