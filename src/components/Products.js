import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/system';

// Sample Product Data
const productCatalog = [
  {
    logo: <Avatar alt="Product 1" src="/static/images/product1.jpg" />,
    name: 'Deposit Products',
    description: "A high-interest savings account to help you grow your money securely. Enjoy competitive interest rates and easy access to your funds.",
  },
  {
    logo: <Avatar alt="Product 2" src="/static/images/product2.jpg" />,
    name: 'E Banking',
    description: "Flexible personal loan options for your various needs, from home improvements to unexpected expenses. Quick approval process.",
  },
  {
    logo: <Avatar alt="Product 3" src="/static/images/product3.jpg" />,
    name: 'Loans & Advances',
    description: "A credit card designed to offer great rewards and cashback. Benefit from low interest rates and a range of services for your convenience.",
  },
  // Add more products as needed
];

const logoStyle = {
  width: '64px',
  opacity: 0.7,
};

export default function ProductCatalog() {
  const theme = useTheme();

  return (
    <Container
      id="products"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: '#00adef' }}
        >
          Our Banking Products
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Explore our range of banking products tailored to meet your needs. From savings accounts to personal loans, we offer comprehensive solutions.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {productCatalog.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: 'flex' }}>
            <Card
              variant="outlined"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flexGrow: 1,
              }}
            >
              <CardContent>
                <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
                  {product.description}
                </Typography>
              </CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <CardHeader
                  avatar={product.logo}
                  title={product.name}
                  subheader="Financial Product"
                />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
