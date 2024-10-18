// utils/pdfUtils.js
export const buildPdfUrl = (folderName, subfolderName, fileName) => {
    const baseUrl = 'http://localhost:5000/pdf-viewer';
    const params = new URLSearchParams({
        folder: folderName,
        subfolder: subfolderName,
        file: fileName
    });

    return `${baseUrl}?${params.toString()}`;
};
