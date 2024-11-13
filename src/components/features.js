import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import MuiChip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Document, Page } from "react-pdf";
import Introduction from "./introduction";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

const Chip = styled(MuiChip)(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        background:
          "linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))",
        color: "hsl(0, 0%, 100%)",
        borderColor: (theme.vars || theme).palette.primary.light,
        "& .MuiChip-label": {
          color: "hsl(0, 0%, 100%)",
        },
        ...theme.applyStyles("dark", {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

const getRelativePath = (absolutePath) => {
  const prefix =
    "C:\\Users\\coop\\Desktop\\Product catalog\\backend\\uploads\\";
  return absolutePath.replace(prefix, "").replace(/\\/g, "/");
};

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!selectedFeature) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: "flex", sm: "none" },
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, overflow: "auto" }}>
        {selectedFeature.map(({ name }, index) => (
          <Chip
            size="medium"
            key={index}
            label={name}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>
      <Card variant="outlined">
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography
            gutterBottom
            sx={{ color: "text.primary", fontWeight: "medium" }}
          >
            {selectedFeature[selectedItemIndex]?.name}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.array.isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export default function Features() {
  const [folderStructure, setFolderStructure] = React.useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);
  const [pdfUrl, setPdfUrl] = React.useState("");
  const [isPdfSelected, setIsPdfSelected] = React.useState(false);
  const [selectedPdf, setSelectedPdf] = React.useState(null); // State for selected PDF
  const [numPages, setNumPages] = React.useState(null); // State for number of pages
  const [pdfScale, setPdfScale] = React.useState(1.0); // State for PDF scale

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const handleFileClick = (filePath) => {
    const relativePath = getRelativePath(filePath);
    const pathParts = relativePath.split("/");
    const fileName = pathParts.pop();
    const folderPath = pathParts.join("/");

    if (folderPath && fileName) {
      const pdfUrl = `http://localhost:5000/api/files/view-pdf?folderPath=${encodeURIComponent(
        folderPath
      )}&fileName=${encodeURIComponent(fileName)}`;
      console.log("Generated PDF URL:", pdfUrl);
      setPdfUrl(pdfUrl);
      setIsPdfSelected(true); // Mark as PDF selected
      setSelectedPdf(pdfUrl); // Set the selected PDF URL
    } else {
      console.error("Error: Missing folderPath or fileName");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages); // Set the number of pages when the document is loaded
  };

  React.useEffect(() => {
    const fetchFolderStructure = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/folders/folder-structure"
        );
        setFolderStructure(response.data);
      } catch (error) {
        console.error("Error fetching folder structure:", error);
      }
    };

    fetchFolderStructure();
  }, []);

  const renderFolderStructure = (folders) => {
    return folders.map((item, index) => {
      if (item.type === "folder") {
        return (
          <Accordion key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
            >
              <Typography>{item.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {item.children && item.children.length > 0 ? (
                <Box sx={{ pl: 2 }}>{renderFolderStructure(item.children)}</Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No files available
                </Typography>
              )}
            </AccordionDetails>
          </Accordion>
        );
      } else if (item.type === "file") {
        return (
          <Button key={index} onClick={() => handleFileClick(item.path)}>
            {item.name}
          </Button>
        );
      }
      return null;
    });
  };

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: "100%", md: "60%" } }}>
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: "#00adef" }}
        >
          Product Catalog
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mb: { xs: 2, sm: 4 } }}
        >
          Provide a brief overview of the key features of the product. For
          example, you could list the number of features, their types or
          benefits, and add-ons.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
       <Box
  sx={{
    display: { xs: "none", sm: "flex" },
    flexDirection: "column",
    gap: 2,
    height: "100%",
    width: { sm: "250px", md: "400px" }, // Set width for different breakpoints
  }}
>
  {renderFolderStructure(folderStructure)}
</Box>

        <MobileLayout
          selectedItemIndex={selectedItemIndex}
          handleItemClick={handleItemClick}
          selectedFeature={folderStructure}
        />
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            width: { xs: "100%", md: "70%" },
          }}
        >
    <Card variant="outlined" sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
  <Box sx={{ px: 2, pb: 1 }}>
    {/* <Typography gutterBottom sx={{ color: 'text.primary', fontWeight: 'medium' }}>
      {folderStructure[selectedItemIndex]?.name}
    </Typography> */}
  </Box>
  <Box sx={{ width: '100%', height: '100%' }}>
    {!isPdfSelected ? (
      <Introduction />
    ) : (
      <Document
        file={selectedPdf}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Loading PDF...</div>}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            scale={pdfScale}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        ))}
      </Document>
    )}
  </Box>
</Card>


        </Box>
      </Box>
    </Container>
  );
}
