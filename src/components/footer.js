import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from "lucide-react";
import { Box, Typography, Tooltip } from "@mui/material";

export function Footer() {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #ccc',
        height: '60px',
        backgroundColor: '#f5f5f5',
        zIndex: 1000,
       
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="16px"
        sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }} // Make it wrap on smaller screens
      >
        <Typography variant="body2" style={{ margin: 0 }}>
          <a
            href="https://coopbankoromia.com.et"
            style={{ textDecoration: 'none', color: "#00adef", fontWeight: 'bold' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            https://coopbankoromia.com.et
          </a>
        </Typography>

        <FooterButtons />
      </Box>
    </footer>
  );
}

export function FooterButtons() {
  return (
    <Box display="flex" gap="16px">
      <Tooltip title="Facebook" arrow>
        <a href="https://facebook.com" target="_blank" aria-label="Facebook">
          <FacebookIcon style={iconStyle} />
        </a>
      </Tooltip>
      <Tooltip title="Twitter" arrow>
        <a href="https://twitter.com" target="_blank" aria-label="Twitter">
          <TwitterIcon style={iconStyle} />
        </a>
      </Tooltip>
      <Tooltip title="Instagram" arrow>
        <a href="https://instagram.com" target="_blank" aria-label="Instagram">
          <InstagramIcon style={iconStyle} />
        </a>
      </Tooltip>
      <Tooltip title="LinkedIn" arrow>
        <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
          <LinkedinIcon style={iconStyle} />
        </a>
      </Tooltip>
    </Box>
  );
}

// Styles for social media icons
const iconStyle = {
  width: '20px',  // Increased size for better visibility
  height: '20px', // Increased size for better visibility
  transition: 'color 0.3s, transform 0.3s', // Added transform for a hover effect
  color: "#555", // Default color for icons
  '&:hover': {
    transform: 'scale(1.1)', // Slightly scale up on hover
  },
};

export default Footer; // Ensure you export the Footer for use in other components
