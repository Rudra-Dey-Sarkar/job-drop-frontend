export const formatVideoURLForBrand = (url: string) => {
    if (!url) return url;

    // normal watch URL → embed
    if (url.includes("watch?v=")) {
        const id = url.split("watch?v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${id}`;
    }

    // shorts URL → embed
    if (url.includes("shorts/")) {
        const id = url.split("shorts/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
    }

    return url; // non-youtube URLs
};
