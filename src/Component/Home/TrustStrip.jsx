import { Box, Container, Grid, Typography } from "@mui/material";

// NOTE: "5,000+" travelers is the existing public claim (from the homepage meta description).
// The other three figures are placeholders — update them to your real numbers before launch.
const stats = [
  { value: "5,000+", label: "Happy Travelers" },
  { value: "200+", label: "Curated Experiences" },
  { value: "50+", label: "Vetted Local Hosts" },
  { value: "4.8★", label: "Average Rating" },
];

const TrustStrip = () => {
  return (
    <Box sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {stats.map((s, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontFamily: "Playfair",
                    fontWeight: "bold",
                    color: "#EC3F18",
                    fontSize: { xs: "28px", md: "40px" },
                    lineHeight: 1.1,
                  }}
                >
                  {s.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    color: "#6B7280",
                    fontSize: { xs: "13px", md: "15px" },
                    mt: 0.5,
                  }}
                >
                  {s.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TrustStrip;
