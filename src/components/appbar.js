import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { debounce } from "lodash";
import axios from "axios";
import { Document, Page } from "react-pdf";
import Sitemark from "./logo1";
import ColorModeIconDropdown from "../shared-theme/ColorModeIconDropdown";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredFiles, setFilteredFiles] = React.useState([]);
  const [files, setFiles] = React.useState([]);
  const [pdfOpen, setPdfOpen] = React.useState(false);
  const [currentPdf, setCurrentPdf] = React.useState(null);

  React.useEffect(() => {
    axios
      .get("http://localhost:5000/api/files/list-all-files")
      .then((response) => {
        setFiles(response.data);
        setFilteredFiles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
      });
  }, []);

  const handleFileClick = (viewUrl) => {
    setCurrentPdf(viewUrl);
    setPdfOpen(true);
  };

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    if (query) {
      const results = files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFiles(results);
    } else {
      setFilteredFiles(files);
    }
  }, 300);

  const handleCloseDialog = () => {
    setPdfOpen(false);
    setCurrentPdf(null);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{ flexGrow: 1, display: "flex", alignItems: "center", px: 0 }}
          >
            <Sitemark />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Link to="/start">
              <Button variant="text" color="info" size="small">
                Product Catalog
              </Button>
              </Link>
              <Button
                variant="text"
                color="info"
                size="small"
                onClick={() =>
                  document
                    .getElementById("products")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Our Products
              </Button>

              <Button variant="text" color="info" size="small"  onClick={() =>
                  document
                    .getElementById("digital-products")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Digital Products
              </Button>
              
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ minWidth: 0 }}
                onClick={() =>
                  document
                    .getElementById("faq")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                FAQ
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <Box sx={{ position: "relative", width: 200 }}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search files"
                onChange={(e) => handleSearch(e.target.value)}
                sx={{ width: "100%" }}
              />

              {filteredFiles.length > 0 && searchQuery && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    backgroundColor: "white",
                    boxShadow: 2,
                    borderRadius: 1,
                    zIndex: 9999,
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                >
                  {filteredFiles.map((file) => (
                    <Box key={file.path} sx={{ mb: 1 }}>
                      <Button
                        onClick={() => handleFileClick(file.viewUrl)}
                        variant="text"
                        sx={{ textAlign: "left", width: "100%" }}
                      >
                        {file.name}
                      </Button>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            <ColorModeIconDropdown />
          </Box>
        </StyledToolbar>
      </Container>

      {/* PDF Dialog */}
      <Dialog
        open={pdfOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "#f5f5f5", // Dark background for PDF viewer
            color: "#fff", // White text color
            borderRadius: "10px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            {currentPdf && (
              <Document file={currentPdf}>
                <Page pageNumber={1} />
              </Document>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}
