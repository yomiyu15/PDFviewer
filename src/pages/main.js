import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Introduction from "../components/introdction";

const App = () => {
  const [folderStructure, setFolderStructure] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [pdfScale, setPdfScale] = useState(1.5);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [selectedSubfolder, setSelectedSubfolder] = useState("");
  const [selectedFile, setSelectedFile] = useState("");

  // Fetch folder structure from API
  useEffect(() => {
    fetch("http://localhost:5000/api/folders/structure")
      .then((res) => res.json())
      .then((data) => setFolderStructure(data))
      .catch((err) => console.error("Error fetching folder structure:", err));
  }, []);

  // Handle PDF file selection
  const handleFileClick = (path) => {
    const parts = path.split("\\");
    
    // Assuming the folder and subfolder are correctly indexed
    const folderName = parts[parts.length - 3]; // Adjust this index based on your path structure
    const subfolderName = parts[parts.length - 2]; // Adjust as needed
    let fileName = parts[parts.length - 1];
  
    // Keep the original file name with ".pdf" for constructing the URL
    const pdfFileName = fileName;
  
    // Construct the PDF URL with encoding
    const pdfUrl = `http://localhost:5000/api/files/pdf-viewer?folder=${encodeURIComponent(folderName)}&subfolder=${encodeURIComponent(subfolderName)}&file=${encodeURIComponent(pdfFileName)}`;
  
    console.log("Constructed PDF URL:", pdfUrl); // Log the URL to check if it’s correct
  
    setSelectedPdf(pdfUrl);
    setSelectedFolder(folderName);
    setSelectedSubfolder(subfolderName);
    setSelectedFile(fileName.replace(/\.pdf$/, "")); // Set fileName without ".pdf" for display
    setDrawerOpen(false);
  };
  
  

  

  // Filter folders based on search term
  const filterFolders = (folders) => {
    return folders.filter((item) => {
      if (item.type === "folder") {
        return (
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          filterFolders(item.children).length > 0
        );
      } else if (item.type === "file") {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
  };

  // Responsive design: Update mobile/desktop state on resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 900;
      setIsMobile(isMobileView);
      setPdfScale(isMobileView ? 0.7 : 1.5);
      if (!isMobileView) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load all pages when the PDF document is loaded
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // Render folder structure
 // Render folder structure
 const renderFolderStructure = (folders, depth = 0) => {
  return folders.map((item) => {
    const paddingLeft = depth * 20;

    if (item.type === "folder") {
      return (
        <Accordion
          key={item.name}
          sx={{
            boxShadow: "none",
            padding: 0,
            margin: 0,
            position: "relative",
            paddingLeft: `${paddingLeft + 10}px`,
            "&::before": {
              content: '""',
              position: "absolute",
              left: `${paddingLeft - 10}px`, // adjust line position based on depth
              top: 0,
              bottom: 0,
              width: "2px",
              backgroundColor: "#00adef",
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ padding: 0 }}
          >
            {/* Apply bold style to folder name only */}
            <Typography
              sx={{
                fontWeight: "bold", // Bold only the folder name
              }}
            >
              {capitalizeFileName(item.name)}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ paddingLeft: 0 }}>
            {renderFolderStructure(item.children, depth + 1)}
          </AccordionDetails>
        </Accordion>
      );
    } else if (item.type === "file") {
      let displayFileName = item.name;
      if (displayFileName.toLowerCase().endsWith(".pdf")) {
        displayFileName = capitalizeFileName(displayFileName.slice(0, -4));
      }

      return (
        <ListItem
          button
          key={item.name}
          onClick={() => handleFileClick(item.path)}
          sx={{
            paddingLeft: `${paddingLeft + 30}px`,
            paddingTop: "2px",
            paddingBottom: "2px",
            borderBottom: "none",
            display: "flex",
            alignItems: "flex-start",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              left: `${paddingLeft - 10}px`, // adjust line position based on depth
              top: 0,
              bottom: 0,
              width: "2px",
              backgroundColor: "#00adef",
            },
          }}
        >
          <ListItemText
            primary={displayFileName}
            sx={{
              "& .MuiTypography-root": {
                whiteSpace: "normal",
                textAlign: "left",
                textIndent: "0",
                paddingLeft: "2px",
                fontSize: "13px",
              },
            }}
          />
        </ListItem>
      );
    }
    return null;
  });
};

  
  // Helper function to capitalize the first letter of each word in the filename
  const capitalizeFileName = (fileName) => {
    return fileName
      .replace(/_/g, " ") // Replace underscores with spaces
      .split(" ") // Split into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter, lowercase the rest
      .join(" "); // Join the words back into a string
  };
  
  

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Drawer for mobile sidebar */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: 240,
          "& .MuiDrawer-paper": {
            width: 240,
            zIndex: 1300,
            
          },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              marginBottom: 2,
              borderRadius: "30px",
              backgroundColor: "#f5f5f5",
              "& .MuiOutlinedInput-root": {
                borderRadius: "30px",
                padding: "4px 8px",
                fontSize: "0.85rem",
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "transparent",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "transparent",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: "1rem", color: "#00adef" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "calc(100vh - 64px)",
            paddingLeft: "10px",
          }}
        >
          <List>{renderFolderStructure(filterFolders(folderStructure))}</List>
        </Box>
      </Drawer>

      {/* Persistent Sidebar for desktop */}
      <List
        sx={{
          width: 300,
          display: { xs: "none", md: "block" },
          paddingTop: 5,
          overflowY: "auto",
          height: "100vh",
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search..."
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            marginBottom: 2,
            borderRadius: "30px",
            backgroundColor: "#f5f5f5",
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              padding: "4px 8px",
              fontSize: "0.85rem",
              "& fieldset": {
                borderColor: "transparent",
              },
              "&:hover fieldset": {
                borderColor: "transparent",
              },
              "&.Mui-focused fieldset": {
                borderColor: "transparent",
              },
            },
          }}
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

      {/* Main content area for displaying PDFs */}
      <div style={{ flexGrow: 1, padding: 16, overflow: "auto" }}>
        {selectedPdf ? (
          <>
            {/* Display selected folder, subfolder, and file name */}
            <Typography
              variant="body2"
              sx={{
                marginBottom: 1,
                color: "#333",
                fontSize: { xs: "0.9rem", md: "1rem" },
                lineHeight: 1.5,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {`${selectedFolder}`}
              
              <span
                style={{
                  fontSize: "1.2rem",
                  margin: "0 4px",
                  color: "#00adef",
                }}
              >
                {">"}
              </span>
              {`${selectedSubfolder}`}
              <span
                style={{
                  fontSize: "1.2rem",
                  margin: "0 4px",
                  color: "#00adef",
                }}
              >
                {">"}
              </span>
              {`${selectedFile}`}
            </Typography>

            <Document file={selectedPdf} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={pdfScale}
                />
              ))}
            </Document>
          </>
        ) : (
          <Introduction />
        )}
      </div>

      {/* Mobile hamburger icon */}
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(true)}
          sx={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 1500,
           
            color: "#333",
            
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
    </div>
  );
};

export default App;
