import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Typography, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileReader from './filereader';

const directories = [
  {
    name: 'Conventional',
    subDirectories: [
      {
        name: 'Deposite_products',
        subDirectories: [
          {
            name: 'Demand_deposit',
            subDirectories: [
              {
                name: 'Local_currency_deposite_products',
                files: [
                  { name: 'Ordinary Saving Account.pdf', path: '/Pdf/CCF.pdf' },
                  { name: 'Gamme Saving Account.pdf', path: '/Pdf/IMPORT.pdf' },
                  { name: 'Youth Saving Account.pdf', path: '/Pdf/CCF.pdf' },
                  { name: 'Sinqe Women\'s Saving Account.pdf', path: '/Pdf/IMPORT.pdf' },
                  { name: 'Special Saving Account.pdf', path: '/Pdf/Special_Saving_Account.pdf' },
                  { name: 'Gudunfa Saving Account.pdf', path: '/Pdf/Gudunfa_Saving_Account.pdf' },
                  { name: 'Farmers Saving Account.pdf', path: '/Pdf/Farmers_Saving_Account.pdf' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'DigitalBankingProducts',
    subDirectories: [
      {
        name: 'Mobile Banking Products',
        files: [
          { name: 'Card Banking Products.pdf', path: '/Pdf/Card_Banking_Products.pdf' },
        ],
      },
    ],
  },
  {
    name: 'Interest Free Banking Products',
    subDirectories: [
      {
        name: 'Deposite Products',
        subDirectories: [
          {
            name: 'Mudarabah',
            files: [
              { name: 'Mudarabah Savings Account.pdf', path: '/Pdf/Mudarabah_Savings_Account.pdf' },
              { name: 'Mudarabah Investment Account.pdf', path: '/Pdf/Mudarabah_Investment_Account.pdf' },
            ],
          },
        ],
      },
      {
        name: 'Finance Products',
        subDirectories: [
          {
            name: 'Murabaha',
            files: [
              { name: 'Murabaha Home Finance.pdf', path: '/Pdf/Murabaha_Home_Finance.pdf' },
              { name: 'Murabaha Vehicle Finance.pdf', path: '/Pdf/Murabaha_Vehicle_Finance.pdf' },
            ],
          },
          {
            name: 'Ijara',
            files: [
              { name: 'Ijara Equipment Finance.pdf', path: '/Pdf/Ijara_Equipment_Finance.pdf' },
            ],
          },
        ],
      },
    ],
  },
];

const DirectoryItem = ({ item, handleFileSelect, depth }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  const directoryStyle = {
    paddingLeft: `${depth * 10}px`,
    fontSize: '12px',
    backgroundColor: depth === 0 ? '#f4f4f4' : 'inherit',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <Accordion expanded={isOpen} onChange={toggleFolder} disableGutters elevation={0} sx={{ margin: '0', border: 'none' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={directoryStyle}>
        <Typography style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{item.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {item.subDirectories && (
          <List disablePadding>
            {item.subDirectories.map((subDir, index) => (
              <DirectoryItem key={index} item={subDir} handleFileSelect={handleFileSelect} depth={depth + 1} />
            ))}
          </List>
        )}
        {item.files && (
          <List disablePadding>
            {item.files.map((file, idx) => (
              <ListItem
                button
                key={idx}
                onClick={() => handleFileSelect(file.path)}
                sx={{
                  paddingLeft: `${(depth + 1) * 10}px`,
                  fontSize: '10px',
                  color: '#00adef',
                }}
              >
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const DirectoryNavigator = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (filePath) => {
    setSelectedFile(filePath);
  };

  return (
    <Grid container style={{ height: '100vh', overflow: 'hidden' }}>
      <Grid item xs={12} sm={4} md={3} style={{ padding: '10px', background: '#f4f4f4', overflowY: 'auto' }}>
        <Typography variant="h6" gutterBottom style={{ fontSize: '16px', fontWeight: 'bold' }}>
          Product Catalog
        </Typography>
        {directories.map((dir, index) => (
          <DirectoryItem key={index} item={dir} handleFileSelect={handleFileSelect} depth={0} />
        ))}
      </Grid>
      <Grid item xs={12} sm={8} md={9} style={{ padding: '10px' }}>
        {selectedFile ? (
          <FileReader filePath={selectedFile} />
        ) : (
          <Typography>Select a file to view</Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default DirectoryNavigator;
