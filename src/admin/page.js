import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import CreateFolder from "./createfolders";
import CreateSubfolder from "./createsubfolder";
import UploadFile from "./uploadfile";
import FolderStructure from "./folderstructure";

const AdminPanel = () => {
  const [folderStructure, setFolderStructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openFolders, setOpenFolders] = useState({});
  const [editingFolder, setEditingFolder] = useState(null);
  const [editingSubfolder, setEditingSubfolder] = useState(null); // New state for subfolder editing
  const [newFolderName, setNewFolderName] = useState('');
  const [newSubfolderName, setNewSubfolderName] = useState(''); // New state for new subfolder name
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState('');
  const [subfolderToDelete, setSubfolderToDelete] = useState(''); // New state for subfolder deletion

  useEffect(() => {
    fetchFolderStructure();
  }, []);

  const fetchFolderStructure = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/folders/structure");
      const data = await response.json();
      setFolderStructure(data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleToggleFolder = (folderName) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const startEditingFolder = (folderName) => {
    setEditingFolder(folderName);
    setNewFolderName(folderName);
  };

  const startEditingSubfolder = (subfolderName) => {
    setEditingSubfolder(subfolderName);
    setNewSubfolderName(subfolderName); // Pre-fill the input with the current subfolder name
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/folders/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentFolderName: editingFolder, newFolderName }),
      });

      if (response.ok) {
        await fetchFolderStructure();
      } else {
        const errorMessage = await response.text();
        console.error("Error editing folder:", errorMessage);
      }
    } catch (err) {
      console.error("Error editing folder:", err);
    } finally {
      setEditingFolder(null);
      setNewFolderName('');
    }
  };

  const handleEditSubfolderSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/subfolders/edit-subfolder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentSubfolderName: editingSubfolder, newSubfolderName }),
      });

      if (response.ok) {
        await fetchFolderStructure();
      } else {
        const errorMessage = await response.text();
        console.error("Error editing subfolder:", errorMessage);
      }
    } catch (err) {
      console.error("Error editing subfolder:", err);
    } finally {
      setEditingSubfolder(null);
      setNewSubfolderName('');
    }
  };

  const openDeleteConfirmation = (folderName) => {
    setFolderToDelete(folderName);
    setDeleteConfirmationOpen(true);
  };

  const openDeleteSubfolderConfirmation = (subfolderName) => {
    setSubfolderToDelete(subfolderName);
    setDeleteConfirmationOpen(true);
  };

  const handleDeleteFolder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/folders/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderName: folderToDelete }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting folder:", errorData);
        return; // Exit if the response is not OK
      }

      await fetchFolderStructure();
    } catch (err) {
      console.error("Error deleting folder:", err);
    } finally {
      setDeleteConfirmationOpen(false);
      setFolderToDelete('');
    }
  };

  const handleDeleteSubfolder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/folders/delete-subfolder`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          // Assuming you might need to include a parent folder name
          parentFolder: "YourParentFolderName", // Replace with the actual parent folder name
          subfolderName: subfolderToDelete 
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.text(); // Use text() to capture non-JSON responses
        console.error("Error deleting subfolder:", errorData);
        return; // Exit if the response is not OK
      }
  
      await fetchFolderStructure();
    } catch (err) {
      console.error("Error deleting subfolder:", err);
    } finally {
      setDeleteConfirmationOpen(false);
      setSubfolderToDelete('');
    }
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading folders</div>;

  return (
    <Container sx={{ marginTop: "100px", display: "flex", flexDirection: "column", minHeight: "calc(100vh - 64px)" }}>
      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Folder Structure</Typography>
              <FolderStructure
                folderStructure={folderStructure}
                openFolders={openFolders}
                handleToggleFolder={handleToggleFolder}
                startEditingFolder={startEditingFolder}
                startEditingSubfolder={startEditingSubfolder} // Pass the editing function
                deleteFolder={handleDeleteFolder} // Pass the delete folder function
                deleteSubfolder={handleDeleteSubfolder} // Pass the delete subfolder function
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 1 }}>
                <CreateFolder fetchFolderStructure={fetchFolderStructure} />
              </Box>
              <Box sx={{ mb: 3 }}>
                <CreateSubfolder fetchFolderStructure={fetchFolderStructure} />
              </Box>
              <Box>
                <UploadFile fetchFolderStructure={fetchFolderStructure} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Folder Dialog */}
      <Dialog open={Boolean(editingFolder)} onClose={() => setEditingFolder(null)}>
        <DialogTitle>Edit Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Folder Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingFolder(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subfolder Dialog */}
      <Dialog open={Boolean(editingSubfolder)} onClose={() => setEditingSubfolder(null)}>
        <DialogTitle>Edit Subfolder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Subfolder Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newSubfolderName}
            onChange={(e) => setNewSubfolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingSubfolder(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubfolderSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this folder/subfolder?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={folderToDelete ? handleDeleteFolder : handleDeleteSubfolder} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
