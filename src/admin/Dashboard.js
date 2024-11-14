import * as React from "react";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import LayersIcon from "@mui/icons-material/Layers";
import Page from "./page.js";
import Faq from "./faq.js";
import { FolderIcon } from "lucide-react";

const NAVIGATION = [
  { segment: "folders", title: "Folders", icon: <FolderIcon /> },
  { segment: "faq", title: "FAQ", icon: <HelpOutlineIcon /> },
  { kind: "divider" },
  { kind: "header", title: "Products" },
  {
    segment: "reports",
    title: "Digital Banking Products",
    icon: <BarChartIcon />,
  },
  {
    segment: "sales",
    title: "Conventional Banking Products",
    icon: <DescriptionIcon />,
  },
  {
    segment: "traffic",
    title: "Intrest Free Banking Products",
    icon: <DescriptionIcon />,
  },
];

const demoTheme = createTheme({
  palette: {
    primary: { main: "#00adef" },
    background: { default: "#f9f9f9" },
    action: { hover: "#f0f0f0" },
  },
  typography: {
    fontSize: 12,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
  paddingLeft: theme.spacing(2),
}));

export default function DashboardLayoutBasic() {
  const [open, setOpen] = React.useState(true);
  const [selectedPage, setSelectedPage] = React.useState("folders");

  const handleDrawerToggle = () => setOpen(!open);

  const handleNavigation = (segment) => setSelectedPage(segment);

  const handleLogout = () => {
    // Remove the JWT from storage
    localStorage.removeItem("authToken"); // Or sessionStorage, depending on where you're storing the token
    // Optionally redirect user to login page or homepage
    window.location.href = "/login";
  };

  const renderPageContent = () => {
    switch (selectedPage) {
      case "folders":
        return <Page />;
      case "faq":
        return <Faq />;
      default:
        return <Page />;
    }
  };

  return (
    <ThemeProvider theme={demoTheme}>
      <div style={{ display: "flex" }}>
        <AppBar position="fixed" sx={{ bgcolor: "#fff" }}>
          <Toolbar>
            <div
              onClick={handleDrawerToggle}
              style={{
                cursor: "pointer",
                fontSize: 18,
                fontWeight: "bold",
                color: "white",
              }}
            >
              {open ? "☰" : "☰"}
            </div>
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{
                marginLeft: "auto",
                textTransform: "none",
                fontSize: "14px",
              }} 
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        <Drawer
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              backgroundColor: "#fff",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <h2
              style={{ fontSize: 16, fontWeight: 700, margin: 0, marginTop: 5 }}
            >
              Admin
            </h2>
          </DrawerHeader>
          <List>
            {NAVIGATION.map((item, index) => (
              <React.Fragment key={index}>
                {item.kind === "header" ? (
                  <ListItem>
                    <ListItemText
                      primary={item.title}
                      sx={{ fontWeight: "bold", color: "#888" }}
                    />
                  </ListItem>
                ) : item.kind === "divider" ? (
                  <Divider />
                ) : (
                  <ListItem
                    button
                    onClick={() => handleNavigation(item.segment)}
                    sx={{ pl: 3 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{ fontSize: 14 }}
                    />
                  </ListItem>
                )}
              </React.Fragment>
            ))}
          </List>
        </Drawer>

        <main style={{ flexGrow: 1, padding: "24px", marginTop: 64 }}>
          <Container>{renderPageContent()}</Container>
        </main>
      </div>
    </ThemeProvider>
  );
}
