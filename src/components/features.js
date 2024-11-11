import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MuiChip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Document, Page } from 'react-pdf'; 
import Introduction from './introduction';

const Chip = styled(MuiChip)(({ theme }) => ({
  variants: [
    {
      props: ({ selected }) => selected,
      style: {
        background: 'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))',
        color: 'hsl(0, 0%, 100%)',
        borderColor: (theme.vars || theme).palette.primary.light,
        '& .MuiChip-label': {
          color: 'hsl(0, 0%, 100%)',
        },
        ...theme.applyStyles('dark', {
          borderColor: (theme.vars || theme).palette.primary.dark,
        }),
      },
    },
  ],
}));

// Define `getRelativePath` before usage
const getRelativePath = (absolutePath) => {
  const prefix = "C:\\Users\\coop\\Desktop\\Product catalog\\backend\\uploads\\";
  return absolutePath.replace(prefix, "").replace(/\\/g, "/");  // Convert backslashes to forward slashes
};

// Define MobileLayout component
function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!selectedFeature) {
    return null;
  }

  return (
    <Box
      sx={{
        display: { xs: 'flex', sm: 'none' },
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, overflow: 'auto' }}>
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
          <Typography gutterBottom sx={{ color: 'text.primary', fontWeight: 'medium' }}>
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
  const [pdfUrl, setPdfUrl] = React.useState('');
  const [isPdfSelected, setIsPdfSelected] = React.useState(false);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const handleFileClick = (filePath) => {
    const relativePath = getRelativePath(filePath);
    const pathParts = relativePath.split('/');
    const fileName = pathParts.pop();
    const folderPath = pathParts.join('/');

    if (folderPath && fileName) {
      const pdfUrl = `http://localhost:5000/api/files/view-pdf?folderPath=${encodeURIComponent(folderPath)}&fileName=${encodeURIComponent(fileName)}`;
      console.log('Generated PDF URL:', pdfUrl);
      setPdfUrl(pdfUrl);
      setIsPdfSelected(true);  // Mark as PDF selected
    } else {
      console.error("Error: Missing folderPath or fileName");
    }
  };

  React.useEffect(() => {
    const fetchFolderStructure = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/folders/folder-structure');
        setFolderStructure(response.data);
      } catch (error) {
        console.error('Error fetching folder structure:', error);
      }
    };

    fetchFolderStructure();
  }, []);

  const renderFolderStructure = (folders) => {
    return folders.map((item, index) => {
      if (item.type === 'folder') {
        return (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
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
      } else if (item.type === 'file') {
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
      <Box sx={{ width: { sm: '100%', md: '60%' } }}>
        <Typography component="h2" variant="h4" gutterBottom sx={{ color: '#00adef' }}>
          Product Catalog
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: { xs: 2, sm: 4 } }}>
          Provide a brief overview of the key features of the product. For example, you could list the number of features, their types or benefits, and add-ons.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', gap: 2, height: '100%' }}>
          {renderFolderStructure(folderStructure)}
        </Box>
        <MobileLayout
          selectedItemIndex={selectedItemIndex}
          handleItemClick={handleItemClick}
          selectedFeature={folderStructure}
        />
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, width: { xs: '100%', md: '70%' } }}>
          <Card variant="outlined" sx={{ height: '100%', width: '100%' }}>
            <Box sx={{ px: 2, pb: 2 }}>
              <Typography gutterBottom sx={{ color: 'text.primary', fontWeight: 'medium' }}>
                {folderStructure[selectedItemIndex]?.name}
              </Typography>
            </Box>
            {!isPdfSelected ? (
             <Introduction/>
            ) : (
              <Document file={pdfUrl}>
                <Page pageNumber={1} width={600} height={300} />
              </Document>
            )}
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
