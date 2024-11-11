import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppAppBar from './appbar';
import Highlights from './highlights';
import Pricing from './services';
import Features from './features';
import Testimonials from './Products';
import FAQ from './faq';
import Footer from './footer';
import AppTheme from '../../src/shared-theme/apptheme';

export default function MarketingPage(props) {
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      
      <Features />
      <div>
        <Testimonials />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}