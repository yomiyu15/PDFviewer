// Sidebar.js
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

const Sidebar = ({
  folderStructure,
  filterFolders,
  handleFileClick,
  searchTerm,
  setSearchTerm,
  drawerOpen,
  setDrawerOpen,
  isMobile,
}) => {
  const renderFolderStructure = (folders, depth = 0) => {
    return folders.map((item) => {
      const paddingLeft = depth * 20;

      if (item.type === "folder") {
        return (
          <Accordion key={item.name} sx={{ boxShadow: "none", padding: 0, margin: 0 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ padding: 0 }}>
              <Typography>{item.name}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingLeft: 0 }}>
              {renderFolderStructure(item.children, depth + 1)}
            </AccordionDetails>
          </Accordion>
        );
      } else if (item.type === "file") {
        return (
          <ListItem
            button
            key={item.name}
            onClick={() => handleFileClick(item.path)}
            sx={{ paddingLeft: `${paddingLeft + 30}px` }}
          >
            <ListItemText primary={item.name.replace(".pdf", "")} />
          </ListItem>
        );
      }
      return null;
    });
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ width: 240, "& .MuiDrawer-paper": { width: 240, zIndex: 1300 } }}
      >
        <Box sx={{ padding: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "1rem", color: "#00adef" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ overflowY: "auto", maxHeight: "calc(100vh - 64px)", paddingLeft: "10px" }}>
          <List>{renderFolderStructure(filterFolders(folderStructure))}</List>
        </Box>
      </Drawer>

      {!isMobile && (
        <List sx={{ width: 300, paddingTop: 5, overflowY: "auto", height: "100vh" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "1.2rem", color: "#00adef" }} />
                </InputAdornment>
              ),
            }}
          />
          {renderFolderStructure(filterFolders(folderStructure))}
        </List>
      )}
    </>
  );
};

export default Sidebar;
