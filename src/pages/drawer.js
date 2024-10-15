import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/directories">
          <ListItemText primary="Directories" />
        </ListItem>
        <ListItem button component={Link} to="/admin">
          <ListItemText primary="Admin" />
        </ListItem>
        <ListItem button component={Link} to="/login">
          <ListItemText primary="Login" />
        </ListItem>
        <ListItem button component={Link} to="/main">
          <ListItemText primary="Main" />
        </ListItem>
      </List>
      <Divider />
    </Drawer>
  );
};

export default Sidebar;
