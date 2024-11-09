import React, { useState } from 'react';
import axios from 'axios';
import { Button, Input } from '@mui/material';

function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', file);
    axios.post('/api/files/upload', formData).then((response) => console.log(response.data));
  };

  return (
    <div>
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload}>Upload File</Button>
    </div>
  );
}

export default FileUpload;
