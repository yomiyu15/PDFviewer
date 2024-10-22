import React, { useEffect, useState } from 'react';
import {
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Typography,
    Divider,
    Collapse,
    Select,
    MenuItem,
    Card,
    CardContent,
    CardActions,
    Grid,
    Container,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

const AdminPanel = () => {
    const [folderStructure, setFolderStructure] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newFolderName, setNewFolderName] = useState('');
    const [newSubfolderName, setNewSubfolderName] = useState('');
    const [selectedParentFolder, setSelectedParentFolder] = useState('');
    const [selectedSubfolder, setSelectedSubfolder] = useState('');
    const [file, setFile] = useState(null);
    const [openFolders, setOpenFolders] = useState({});
    
    // Edit states
    const [editFolderName, setEditFolderName] = useState('');
    const [currentEditingFolder, setCurrentEditingFolder] = useState('');
    const [editSubfolderName, setEditSubfolderName] = useState('');
    const [currentEditingSubfolder, setCurrentEditingSubfolder] = useState('');

    useEffect(() => {
        fetchFolderStructure();
    }, []);

    const fetchFolderStructure = async () => {
        try {
            const response = await fetch('http://localhost:5000/folder-structure');
            const data = await response.json();
            setFolderStructure(data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const createFolder = async () => {
        if (!newFolderName) {
            alert('Please enter a folder name.');
            return;
        }
        await fetch('http://localhost:5000/create-folder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folderName: newFolderName }),
        });
        setNewFolderName('');
        fetchFolderStructure();
    };

    const createSubfolder = async () => {
        if (!selectedParentFolder || !newSubfolderName) {
            alert('Please select a parent folder and enter a subfolder name.');
            return;
        }
        await fetch('http://localhost:5000/create-subfolder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ parentFolderName: selectedParentFolder, subfolderName: newSubfolderName }),
        });
        setNewSubfolderName('');
        fetchFolderStructure();
    };

    const uploadFile = async () => {
        if (!selectedParentFolder || !selectedSubfolder || !file) {
            alert('Please select a parent folder, subfolder, and choose a file.');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        formData.append('parentName', selectedParentFolder);
        formData.append('subfolderName', selectedSubfolder);
        await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        });
        setFile(null);
        fetchFolderStructure();
    };

    const deleteFolder = async (folderName) => {
        await fetch('http://localhost:5000/delete-folder', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folderName }),
        });
        fetchFolderStructure();
    };

    const deleteFile = async (filePath) => {
        if (window.confirm(`Are you sure you want to delete the file?`)) {
            const relativePath = filePath.replace(/\\/g, '/').replace(/^.*\/uploads\//, '');
            const response = await fetch('http://localhost:5000/delete-file', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filePath: relativePath }),
            });

            if (response.ok) {
                fetchFolderStructure();
            } else {
                const errorMessage = await response.text();
                console.error('Error deleting file:', errorMessage);
            }
        }
    };

    const handleToggleFolder = (folderName) => {
        setOpenFolders((prev) => ({
            ...prev,
            [folderName]: !prev[folderName],
        }));
    };

    // New edit functions
    const startEditingFolder = (folderName) => {
        setEditFolderName(folderName);
        setCurrentEditingFolder(folderName);
    };

    const saveEditFolder = async () => {
        if (!editFolderName) {
            alert('Please enter a new folder name.');
            return;
        }
        await fetch('http://localhost:5000/edit-folder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentFolderName: currentEditingFolder, newFolderName: editFolderName }),
        });
        setEditFolderName('');
        setCurrentEditingFolder('');
        fetchFolderStructure();
    };

    const startEditingSubfolder = (subfolderName) => {
        setEditSubfolderName(subfolderName);
        setCurrentEditingSubfolder(subfolderName);
    };

    const saveEditSubfolder = async () => {
        if (!editSubfolderName) {
            alert('Please enter a new subfolder name.');
            return;
        }
    
        console.log("Parent Folder:", selectedParentFolder);
        console.log("Current Subfolder:", currentEditingSubfolder);
        console.log("New Subfolder Name:", editSubfolderName);
    
        try {
            const response = await fetch('http://localhost:5000/edit-subfolder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    parentFolderName: selectedParentFolder,
                    currentSubfolderName: currentEditingSubfolder,
                    newSubfolderName: editSubfolderName
                }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }
    
            setEditSubfolderName('');
            setCurrentEditingSubfolder('');
            fetchFolderStructure();
        } catch (error) {
            alert(error.message);
        }
    };
    

    const renderFiles = (files, level) => (
        files.map((file) => (
            <ListItem key={file.path} style={{ paddingLeft: `${(level + 1) * 20}px`, fontSize: 'inherit' }}>
                <PictureAsPdfIcon />
                <ListItemText primary={file.name} style={{ fontSize: 'inherit' }} />
                <IconButton onClick={() => deleteFile(file.path)} size="small">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </ListItem>
        ))
    );

    const renderSubfolders = (subfolders, parentFolderName, level) => (
        subfolders.map((subfolder) => (
            <div key={subfolder.name}>
                <ListItem button onClick={() => handleToggleFolder(subfolder.name)} style={{ paddingLeft: `${(level + 1) * 20}px`, fontSize: 'inherit' }}>
                    <FolderIcon style={{ color: '#FFD54F' }} />
                    {currentEditingSubfolder === subfolder.name ? (
                        <TextField
                            value={editSubfolderName}
                            onChange={(e) => setEditSubfolderName(e.target.value)}
                            onBlur={saveEditSubfolder}
                            style={{ width: '60%', marginLeft: '10px' }}
                        />
                    ) : (
                        <ListItemText primary={subfolder.name} style={{ fontSize: 'inherit' }} />
                    )}
                    <IconButton onClick={() => startEditingSubfolder(subfolder.name)} size="small">
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => deleteFolder(subfolder.name)} size="small">
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </ListItem>
                <Collapse in={openFolders[subfolder.name]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {renderFiles(subfolder.children || [], level + 1)}
                    </List>
                </Collapse>
                <Divider />
            </div>
        ))
    );

    const renderFolder = (folder) => (
        <div key={folder.name}>
            <ListItem button onClick={() => handleToggleFolder(folder.name)} style={{ paddingLeft: '0', fontSize: 'inherit' }}>
                <FolderIcon style={{ color: '#FFD54F' }} />
                {currentEditingFolder === folder.name ? (
                    <TextField
                        value={editFolderName}
                        onChange={(e) => setEditFolderName(e.target.value)}
                        onBlur={saveEditFolder}
                        style={{ width: '60%', marginLeft: '10px' }}
                    />
                ) : (
                    <ListItemText primary={folder.name} style={{ fontSize: 'inherit' }} />
                )}
                <IconButton sx={{color:"#4caf50 "}} onClick={() => startEditingFolder(folder.name)} size="small">
                    <EditIcon fontSize="small" />
                </IconButton>
                <IconButton sx={{color:"#f44336"}} onClick={() => deleteFolder(folder.name)} size="small">
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </ListItem>
            <Collapse in={openFolders[folder.name]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {renderSubfolders(folder.children || [], folder.name, 0)}
                </List>
            </Collapse>
            <Divider />
        </div>
    );

    return (
        <Container maxWidth="lg" style={{ marginTop: '100px', fontSize: '12px', height: '200vh' }}>
            <Typography variant="h4" gutterBottom style={{ fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }}>
                Admin Panel
            </Typography>
            {loading && <Typography style={{ fontSize: '12px', textAlign: 'center' }}>Loading...</Typography>}
            {error && <Typography color="error" style={{ fontSize: '12px', textAlign: 'center' }}>Error: {error.message}</Typography>}
            
            <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                    <Card style={{ padding: '8px' }}>
                        <CardContent>
                            <Typography variant="h6" style={{ fontSize: '16px', fontWeight: "bold" }}>Folder Structure</Typography>
                            <List>
                                {folderStructure.map((folder) => renderFolder(folder))}
                            </List>
                        </CardContent>
                    </Card>
                    
                </Grid>

                <Grid item xs={12} md={8}>
                    {/* Upload File Section */}
                    <Card style={{ marginBottom: '10px', padding: '8px' }}>
                        <CardContent>
                            <Typography variant="h6" style={{ fontSize: '16px',fontWeight: "bold" }}>Upload File</Typography>
                            <Select
                                value={selectedParentFolder}
                                onChange={(e) => {
                                    setSelectedParentFolder(e.target.value);
                                    setSelectedSubfolder(''); // Reset subfolder selection
                                }}
                                displayEmpty
                                style={{ marginBottom: '16px', width: '100%', fontSize: '12px' }}
                            >
                                <MenuItem value="">
                                    <em>Select Parent Folder</em>
                                </MenuItem>
                                {folderStructure.map(folder => (
                                    <MenuItem key={folder.name} value={folder.name}>{folder.name}</MenuItem>
                                ))}
                            </Select>
                            <Select
                                value={selectedSubfolder}
                                onChange={(e) => setSelectedSubfolder(e.target.value)}
                                displayEmpty
                                style={{ marginBottom: '16px', width: '100%', fontSize: '12px' }}
                            >
                                <MenuItem value="">
                                    <em>Select Subfolder</em>
                                </MenuItem>
                                {selectedParentFolder && folderStructure
                                    .find(folder => folder.name === selectedParentFolder)?.children.map(subfolder => (
                                        <MenuItem key={subfolder.name} value={subfolder.name}>{subfolder.name}</MenuItem>
                                    ))}
                            </Select>
                            <input
                                type="file"
                                onChange={(e) => setFile(e.target.files[0])}
                                style={{ marginBottom: '16px', width: '100%', fontSize: '12px' }}
                            />
                        </CardContent>
                        <CardActions>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: '#00adef', color: '#fff', marginTop: 2 }}
                                onClick={uploadFile}
                                style={{ width: '100%', fontSize: '10px' }}
                            >
                                Upload File
                            </Button>
                        </CardActions>
                    </Card>

                    {/* Create Folder Section */}
                    <Card style={{ marginBottom: '10px', padding: '8px' }}>
                        <CardContent>
                            <Typography variant="h6" style={{ fontSize: '16px' ,fontWeight: "bold"}}>Create Folder</Typography>
                            <TextField
                                label="New Folder Name"
                                variant="outlined"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                style={{ marginBottom: '16px', width: '100%' }}
                            />
                        </CardContent>
                        <CardActions>
                            <Button
                                 variant="contained"
                                 sx={{ backgroundColor: '#00adef', color: '#fff', marginTop: 2 }}
                                onClick={createFolder}
                                style={{ width: '100%', fontSize: '10px' }}
                            >
                                Create Folder
                            </Button>
                        </CardActions>
                    </Card>

                    {/* Create Subfolder Section */}
                    <Card style={{ marginBottom: '10px', padding: '8px' }}>
                        <CardContent>
                            <Typography variant="h6" style={{ fontSize: '16px',fontWeight: "bold" }}>Create Subfolder</Typography>
                            <Select
                                value={selectedParentFolder}
                                onChange={(e) => setSelectedParentFolder(e.target.value)}
                                displayEmpty
                                style={{ marginBottom: '16px', width: '100%', fontSize: '10px' }}
                            >
                                <MenuItem value="">
                                    <em>Select Parent Folder</em>
                                </MenuItem>
                                {folderStructure.map(folder => (
                                    <MenuItem key={folder.name} value={folder.name}>{folder.name}</MenuItem>
                                ))}
                            </Select>
                            <TextField
                                label="New Subfolder Name"
                                variant="outlined"
                                value={newSubfolderName}
                                onChange={(e) => setNewSubfolderName(e.target.value)}
                                style={{ marginBottom: '16px', width: '100%' }}
                            />
                        </CardContent>
                        <CardActions>
                            <Button
                             variant="contained"
                             sx={{ backgroundColor: '#00adef', color: '#fff', marginTop: 2 }}
                               
                                onClick={createSubfolder}
                                style={{ width: '100%', fontSize: '10px' }}
                            >
                                Create Subfolder
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminPanel;
