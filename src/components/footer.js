import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from "lucide-react";
import { Box, Typography } from "@mui/material";

export function Footer() {
  return (
    <footer style={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      borderTop: '1px solid #ccc', 
      height: '64px', 
      backgroundColor: '#f9f9f9', 
      zIndex: 1000, // Ensure it stays above other content
      boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)' // Add subtle shadow for depth
    }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" padding="16px">
        <Typography variant="body2" style={{ margin: 0 }}>
          <a
            href="https://coopbankoromia.com.et"
            style={{ textDecoration: 'none', color: "#00adef" }}
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
    <div style={{ display: 'flex', gap: '16px' }}>
      <a href="https://facebook.com" target="_blank" aria-label="Facebook">
        <FacebookIcon style={{ width: '24px', height: '24px', color: "#1877F2", transition: 'color 0.3s' }} />
      </a>
      <a href="https://twitter.com" target="_blank" aria-label="Twitter">
        <TwitterIcon style={{ width: '24px', height: '24px', color: "#1DA1F2", transition: 'color 0.3s' }} />
      </a>
      <a href="https://instagram.com" target="_blank" aria-label="Instagram">
        <InstagramIcon style={{ width: '24px', height: '24px', color: "#C13584", transition: 'color 0.3s' }} />
      </a>
      <a href="https://linkedin.com" target="_blank" aria-label="LinkedIn">
        <LinkedinIcon style={{ width: '24px', height: '24px', color: "#0077B5", transition: 'color 0.3s' }} />
      </a>
    </div>
  );
}
