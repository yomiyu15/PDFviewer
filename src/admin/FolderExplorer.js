import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const FolderExplorer = ({ structure, onFolderClick, parentPath = '' }) => {
  return (
    <List>
      {structure.map((item, index) => {
        const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name;

        if (item.type === 'folder') {
          return (
            <ListItem button key={index} onClick={() => onFolderClick(currentPath)}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={item.name} />
              {item.children && item.children.length > 0 && (
                <Box pl={2}>
                  <FolderExplorer structure={item.children} onFolderClick={onFolderClick} parentPath={currentPath} />
                </Box>
              )}
            </ListItem>
          );
        } else if (item.type === 'file') {
          return (
            <ListItem button key={index} onClick={() => onFolderClick(currentPath)}>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItem>
          );
        }
        return null;
      })}
    </List>
  );
};

export default FolderExplorer;
