import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Replace with your backend URL

export const fetchFolderStructure = async () => {
    try {
        const response = await axios.get(`${API_URL}/folder-structure`);
        return response.data;
    } catch (error) {
        console.error('Error fetching folder structure:', error);
        return [];
    }
};

export const fetchFiles = async (folderName) => {
    try {
        const response = await axios.get(`${API_URL}/uploads`, {
            params: { folder: folderName }, // Adjust based on your endpoint
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
};
