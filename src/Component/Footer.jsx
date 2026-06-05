import {
  Box,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { logof } from "../Images";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

const quickLinks = [
  { name: "Co-working Retreats", link: "#" },
  { name: "Skill-Share Workshops", link: "#" },
  { name: "Productivity Hacks", link: "#" },
  { name: "Local Business Meets", link: "#" },
  { name: "Freelancer Networking", link: "#" },
  { name: "Van life Meetups", link: "#" },
  { name: "Nomadic Mentorships", link: "#" },
];

const exploreIndia = [
  { name: "Himalayan Tech Hubs", link: "#" },
  { name: "Goa Coworking space", link: "#" },
  { name: "Bangalore Startup Vibe", link: "#" },
  { name: "Cultural Immersions", link: "#" },
  { name: "Rural Coworking initiatives", link: "#" },
  { name: "Rajasthan Artist Residencies", link: "#" },
];

const townieSpecial = [
  { name: "Exclusive Discounts", link: "#" },
  { name: "Mentorship Programs", link: "#" },
  { name: "Local Partnerships", link: "#" },
  { name: "Coliving Discounts", link: "#" },
  { name: "Community Fund Access", link: "#" },
  { name: "Resource Library Access", link: "#" },
];

const usefulLinks = [
  { name: "Join Nomadic Townies", link: "#" },
  { name: "About Us", link: "/about-us" },
  { name: "Careers", link: "/careers" },
  { name: "Terms and Services", link: "/terms-and-conditions" },
  { name: "Privacy Policy", link: "/privacy-policy" },
  { name: "Legal Notice", link: "/cancellation-and-refund" },
  { name: "Contact Support", link: "/contact-us" },
  { name: "Investor Pitch Day", link: "#" },
];

const linkStyle = {
  color: "#D1D5DB",
  textDecoration: "none",
  fontSize: "14px",
  fontFamily: "Inter",
  lineHeight: "32px",
  "&:hover": { color: "#fff" },
};

const headingStyle = {
  color: "#fff",
  fontSize: "16px",
  fontWeight: 700,
  fontFamily: "Inter",
  mb: 2,
};

const Footer = () => {
  return (
    <Box sx={{ background: "#1A1A1A" }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 5, md: 8 }, pb: 3 }}>
        {/* 4-Column Link Grid */}
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Quick Links */}
          <Grid item xs={6} sm={3}>
            <Typography sx={headingStyle}>Quick Links</Typography>
            {quickLinks.map((item, i) => (
              <Link key={i} to={item.link} style={linkStyle} onClick={() => window.scrollTo(0, 0)}>
                <Typography sx={linkStyle}>{item.name}</Typography>
              </Link>
            ))}
          </Grid>

          {/* Explore India */}
          <Grid item xs={6} sm={3}>
            <Typography sx={headingStyle}>Explore India</Typography>
            {exploreIndia.map((item, i) => (
              <Link key={i} to={item.link} style={linkStyle} onClick={() => window.scrollTo(0, 0)}>
                <Typography sx={linkStyle}>{item.name}</Typography>
              </Link>
            ))}
          </Grid>

          {/* Townie Special */}
          <Grid item xs={6} sm={3}>
            <Typography sx={headingStyle}>Townie Special</Typography>
            {townieSpecial.map((item, i) => (
              <Link key={i} to={item.link} style={linkStyle} onClick={() => window.scrollTo(0, 0)}>
                <Typography sx={linkStyle}>{item.name}</Typography>
              </Link>
            ))}
          </Grid>

          {/* Useful Links */}
          <Grid item xs={6} sm={3}>
            <Typography sx={headingStyle}>Useful Links</Typography>
            {usefulLinks.map((item, i) => (
              <Link key={i} to={item.link} style={linkStyle} onClick={() => window.scrollTo(0, 0)}>
                <Typography sx={linkStyle}>{item.name}</Typography>
              </Link>
            ))}
          </Grid>
        </Grid>

        {/* Divider */}
        <Box sx={{ height: "1px", background: "#333", my: { xs: 4, md: 6 } }} />

        {/* Bottom Section — Logo, GST, Address, Contacts */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 2,
            pb: 4,
          }}
        >
          {/* Logo */}
          <Box sx={{ width: { xs: "200px", md: "260px" } }}>
            <img
              src={logof}
              alt="Nomadic Townies"
              style={{ width: "100%", objectFit: "contain" }}
            />
          </Box>

          {/* GST Number */}
          <Typography
            sx={{
              color: "#9CA3AF",
              fontSize: "14px",
              fontFamily: "Inter",
            }}
          >
            GST No: 27BNZPM9706J1Z0
          </Typography>

          {/* Address */}
          <Typography
            sx={{
              color: "#D1D5DB",
              fontSize: "14px",
              fontFamily: "Inter",
              maxWidth: "400px",
            }}
          >
            Nanded City Pune - 411041
          </Typography>

          {/* Contact Row */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: { xs: 2, md: 4 },
              mt: 1,
            }}
          >
            <Box
              component="a"
              href="mailto:hello@nomadictownies.com"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#D1D5DB",
                textDecoration: "none",
                fontSize: "14px",
                fontFamily: "Inter",
                "&:hover": { color: "#fff" },
              }}
            >
              <EmailOutlinedIcon sx={{ fontSize: 18 }} />
              hello@nomadictownies.com
            </Box>

            <Box
              component="a"
              href="tel:+918623929751"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#D1D5DB",
                textDecoration: "none",
                fontSize: "14px",
                fontFamily: "Inter",
                "&:hover": { color: "#fff" },
              }}
            >
              <PhoneOutlinedIcon sx={{ fontSize: 18 }} />
              8623949801
            </Box>

            <Box
              component="a"
              href="https://www.nomadictownies.com"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "#D1D5DB",
                textDecoration: "none",
                fontSize: "14px",
                fontFamily: "Inter",
                "&:hover": { color: "#fff" },
              }}
            >
              <LanguageOutlinedIcon sx={{ fontSize: 18 }} />
              www.nomadictownies.com
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
