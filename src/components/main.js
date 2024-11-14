import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppAppBar from "./appbar";
import Features from "./features";
import Footer from "./footer";
import AppTheme from "../../src/shared-theme/apptheme";

export default function MarketingPage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
       <Features />
       <Footer />
    </AppTheme>
  );
}
