import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

// Using your brand color
const color = '#00adef';

const FeatureCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  '& .MuiTypography-root': {
    color: theme.palette.text.primary,
  },
}));

const features = [
  {
    title: 'Secure Transactions',
    description:
      'Ensure safe and seamless transactions with top-level encryption and real-time fraud detection.',
    icon: '🔒',
  },
  {
    title: 'Instant Transfers',
    description:
      'Send money across accounts in real-time, anywhere in the world, at any time.',
    icon: '💸',
  },
  {
    title: 'User-Friendly Interface',
    description:
      'Navigate our platform with ease, with an intuitive and responsive interface for all your banking needs.',
    icon: '📱',
  },
  {
    title: '24/7 Customer Support',
    description:
      'Our support team is available around the clock to assist with any inquiries or issues.',
    icon: '📞',
  },
];

export default function BankingOverview() {
  return (
    <Container
      id="productoverview"
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
    

      <Grid
        container
        spacing={4}
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <FeatureCard>
              <Box
                sx={{
                  fontSize: 40,
                  color: color,
                }}
              >
                {feature.icon}
              </Box>
              <Typography variant="h6">{feature.title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {feature.description}
              </Typography>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button variant="contained" sx={{ backgroundColor: color }}>
          Get Started
        </Button>
      </Box>
    </Container>
  );
}
