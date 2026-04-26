/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import HeaderBanner from "../SmallComponents/HeaderBanner";
import { blogsbg } from "../Images";
import PhoneNumber from "../SmallComponents/PhoneNumber";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import MailIcon from "@mui/icons-material/Mail";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LanguageIcon from "@mui/icons-material/Language";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import { useEffect } from "react";
import Footer from "../Component/Footer";
export const inputStyle = {
  "& input::-webkit-outer-spin-button,\n input::-webkit-inner-spin-button": {
    WebkitAppearance: "none",
    margin: "0",
  },
  width: "100%",
  "& .css-hfutr2-MuiSvgIcon-root-MuiSelect-icon": {
    color: "#000",
  },
  "& .css-bpeome-MuiSvgIcon-root-MuiSelect-icon": {
    color: "#000",
  },

  "& .MuiOutlinedInput-root": {
    background: "#fff",

    "& fieldset": {
      border: "1px solid #E7E7E7",
    },
    "&:hover fieldset": {
      border: "1px solid #E7E7E7",
    },
    "&.Mui-focused fieldset": {
      border: "1px solid #E7E7E7",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "#253A47", // Change this to the desired placeholder color
    },
    color: "#000",
    height: "45px",
    borderRadius: "8px",
    fontFamily: "Inter",
    textAlign: "left",
  },
};
const contact = [
  {
    icon: <PermContactCalendarIcon sx={{ color: "#393938" }} />,
    title: "Meet Us",
    typo1:
      "Time Square, 1st Floor,  14th Main Rd,  HSR Layout 5th Sector,  Bengaluru, Karnataka 560102",
    col: 4,
  },
  {
    icon: <MailIcon sx={{ color: "#393938" }} />,
    title: "Email",
    typo1: "Digitalprizm@mail.com",
    typo2: "Digitalprizm@mail.com",
  },
  {
    icon: <LocalPhoneIcon sx={{ color: "#393938" }} />,
    title: "Phone",
    typo1: "5446637-8899",
    typo2: "5446637-8899",
  },
  {
    icon: <LanguageIcon sx={{ color: "#393938" }} />,
    title: "Social Media",
    social: [
      {
        socialIcon: <TwitterIcon />,
      },
      {
        socialIcon: <FacebookRoundedIcon />,
      },
      {
        socialIcon: <LinkedInIcon />,
      },
      {
        socialIcon: <InstagramIcon />,
      },
    ],
  },
];

const ContactUs = ({ contactbg }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box>
      <HeaderBanner img={contactbg} text={"Contact Us"} />
      <Container>
        <Grid
          container
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            my: { xs: 5, md: 10 },
          }}
        >
          <Grid item xs={12} md={5.1}>
            <Box>
              <Typography
                sx={{
                  fontSize: "28px",
                  color: "#000",
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                Have questions?
              </Typography>
              <Typography
                sx={{
                  color: "#6D7280",
                  textAlign: { xs: "center", md: "left" },
                  mt: 3,
                }}
              >
                We'd love to hear from you! Whether you have a question,
                feedback, or simply want to say hello, reaching out is as easy
                as filling out the form below. Our team is ready and excited to
                assist you in any way we can.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4.51} sx={{ mt: { xs: 5, md: 0 } }}>
            <form>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px 0px",
                }}
              >
                <Box>
                  <Typography
                    sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                  >
                    Name
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    placeholder="Jhon Smith"
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                  >
                    Mobile
                  </Typography>
                  <PhoneNumber />
                </Box>

                <Box>
                  <Typography
                    sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                  >
                    Email
                  </Typography>
                  <TextField
                    sx={inputStyle}
                    size="small"
                    placeholder="jhon@gmail.com"
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                  >
                    Message
                  </Typography>
                  <textarea
                    style={{
                      border: "1px solid #E7E7E7",
                      width: "100%",
                      outline: "none",
                      borderColor: "#E7E7E7",
                      transition: "border-color 0.3s ease",
                      borderRadius: "10px",
                    }}
                    size="small"
                    placeholder="Enter Your Message"
                    rows="8"
                    onFocus={() => {
                      // Change the border color when the textarea is focused
                      document.querySelector("textarea").style.borderColor =
                        "#E7E7E7";
                    }}
                    onBlur={() => {
                      // Change the border color back to the original when the textarea loses focus
                      document.querySelector("textarea").style.borderColor =
                        "#E7E7E7";
                    }}
                  />
                </Box>
              </Box>
              <Button
                variant="simplebtn"
                sx={{
                  width: "100%",
                  background: "#EC3F18",
                  color: "#fff",
                  mt: 5,
                }}
              >
                Submit
              </Button>
            </form>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            color: "#000",
            background: "#F3F4F6",
            p: { xs: 2, md: 5 },
            borderRadius: "30px",
            mb: { xs: 5, md: 10 },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {contact.map(({ icon, title, typo1, typo2, social }, index) => {
            return (
              <Grid
                key={index}
                item
                xs={5.8}
                sm={6}
                md={2.8}
                lg={3}
                sx={{ my: 3 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-start" },
                    flexDirection: "column",
                    alignItems: { xs: "center", md: "start" },
                    gap: "20px 0px",
                  }}
                >
                  <IconButton>{icon}</IconButton>
                  <Typography
                    sx={{
                      color: "#393938",
                      fontSize: "19px",
                      fontWeight: "700",
                    }}
                  >
                    {title}
                  </Typography>
                  {typo1 && (
                    <>
                      <Typography
                        sx={{
                          color: "#6D7280",
                          textAlign: { xs: "left", md: "left" },
                          fontSize: { xs: "14px", md: "16px" },
                        }}
                      >
                        {typo1}
                      </Typography>
                    </>
                  )}
                  {typo2 && (
                    <>
                      <Typography
                        sx={{
                          fontSize: { xs: "14px", md: "16px" },
                          color: "#6D7280",
                          textAlign: { xs: "left", md: "left" },
                        }}
                      >
                        {typo2}
                      </Typography>
                    </>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "start",
                    }}
                  >
                    {social?.map((icon, ind) => {
                      return (
                        <IconButton key={ind}>{icon.socialIcon}</IconButton>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default ContactUs;
