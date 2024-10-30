import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  Divider,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const FolderStructure = ({
  folderStructure,
  openFolders,
  handleToggleFolder,
  startEditingFolder,
  startEditingSubfolder, // Add this line
  deleteFolder,
  deleteSubfolder, // Add this line
}) => {
  const renderSubfolders = (subfolders, level) =>
    subfolders.map((subfolder) => (
      <div key={subfolder.name}>
        <ListItem
          button
          onClick={() => handleToggleFolder(subfolder.name)}
          style={{ paddingLeft: `${(level + 1) * 20}px`, fontSize: "inherit" }}
        >
          <ListItemText primary={subfolder.name} style={{ fontSize: "inherit" }} />
          <IconButton onClick={() => startEditingSubfolder(subfolder.name)} size="small">
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => deleteSubfolder(subfolder.name)} size="small">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </ListItem>
        <Collapse in={openFolders[subfolder.name]} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* Render subfolders and files recursively */}
            {renderSubfolders(subfolder.children || [], level + 1)}
          </List>
        </Collapse>
        <Divider />
      </div>
    ));
  
  const renderFolder = (folder) => (
    <div key={folder.name}>
      <ListItem
        button
        onClick={() => handleToggleFolder(folder.name)}
        style={{ paddingLeft: "0", fontSize: "inherit" }}
      >
        <FolderIcon style={{ color: "#FFD54F" }} />
        <ListItemText primary={folder.name} style={{ fontSize: "inherit" }} />
        <IconButton
          sx={{ color: "#4caf50 " }}
          onClick={() => startEditingFolder(folder.name)}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          sx={{ color: "#f44336" }}
          onClick={() => deleteFolder(folder.name)}
          size="small"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </ListItem>
      <Collapse in={openFolders[folder.name]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {renderSubfolders(folder.children || [], 1)}
        </List>
      </Collapse>
      <Divider />
    </div>
  );

  return (
    <List>
      {folderStructure.map((folder) => renderFolder(folder))}
    </List>
  );
};

export default FolderStructure;
