import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Stack,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  LinkedIn,
} from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.paper",
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        py: 4,
        mt: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Left: About */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Crave Corner 🍽️
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Discover and enjoy your favorite dishes delivered fresh and fast.
            </Typography>
          </Grid>

          {/* Right: Contact */}
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@cravecorner.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +91 98765 43210
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: 123 Food Street, Hyderabad, India
            </Typography>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Follow Us
            </Typography>
            <Stack direction="row" spacing={2}>
              <IconButton href="https://facebook.com" target="_blank">
                <Facebook />
              </IconButton>
              <IconButton href="https://twitter.com" target="_blank">
                <Twitter />
              </IconButton>
              <IconButton href="https://instagram.com" target="_blank">
                <Instagram />
              </IconButton>
              <IconButton href="https://linkedin.com" target="_blank">
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>

        {/* Divider and Copyright */}
        <Divider sx={{ mt: 4, mb: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Crave Corner. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
