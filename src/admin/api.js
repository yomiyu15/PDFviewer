import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/folders',  // Your backend URL
});

export const createFolder = (data) => api.post('/create-folder', data);
export const uploadFile = (data) => api.post('/upload-file', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const renameItem = (data) => api.put('/rename-item', data);
export const deleteItem = (data) => api.delete('/delete-item', { data });
export const getFolderStructure = () => api.get('/folder-structure');
