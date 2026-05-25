export const getImageUrl = (image, backendUrl) => {
    if (!image) return "";
    if (image.startsWith("http") || image.startsWith("data:")) return image;
    if (image.startsWith("/uploads")) return `${backendUrl}${image}`;
    if (image.startsWith("/")) return image;

    const fileName = image.split(/[\\/]/).pop();
    if (fileName) return `/car-images/${fileName}`;

    return image;
};
