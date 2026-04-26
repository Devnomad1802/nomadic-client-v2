import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { logof } from "../Images";
import { useGetAllBannerQuery } from "../services";

const socialicon = [
  {
    icon: <TwitterIcon sx={{ color: "#fff" }} />,
    link: "",
  },
  {
    icon: <FacebookRoundedIcon sx={{ color: "#fff" }} />,
    link: "",
  },
  {
    icon: <LinkedInIcon sx={{ color: "#fff" }} />,
    link: "",
  },
  {
    icon: <InstagramIcon sx={{ color: "#fff" }} />,
    link: "",
  },
];
const array2 = [
  {
    name: "Home",
    link1: "/",
  },
  {
    name: "All Packages",
    link1: "/all_Packages",
  },
  {
    name: "About Us",
    link1: "/about_us",
  },

  {
    name: "Blog",
    link1: "/blogs",
  },
  {
    name: "Contact Us",
    link1: "/contact_us",
  },
];

const termsArray = [
  {
    name: "Terms and Conditions",
    link1: "/terms-and-conditions",
  },
  {
    name: "Cancellation and refund",
    link1: "/cancellation-and-refund",
  },
  {
    name: "Privacy Policy",
    link1: "/privacy-policy",
  },
];

const Footer = () => {
  const location = useLocation();
  const routeName = location.pathname;
  const { isError, isFetching, isLoading, data } = useGetAllBannerQuery();

  const [bannerData, setBannerData] = useState([]);
  console.log("bannerData", bannerData);

  useEffect(() => {
    if (data) {
      setBannerData(data?.data); // Assuming the structure of your data is { data: [...] }
    }
  }, [data]);

  const styledactivelink = ({ isActive }) => {
    return {
      textDecoration: "none",
      padding: "10px",
      borderRadius: "0px",
      fontSize: "16px",
      color: isActive ? "#CD482A" : "#fff",
      alignItems: "center",
      fontWeight: isActive ? "700" : "400",
      fontFamily: "Inter",
      textTransform: "capitalize",
      textAlign: "left",
    };
  };
  return (
    <Box sx={{}}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "328px",
            backgroundImage: bannerData.length > 0 ? `url(${bannerData[0]?.footer})` : 'none',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Container sx={{ position: "relative" }}>
            <Box
              sx={{
                width: {
                  xs: "90%",
                  sm: "42%",
                  md: "47%",
                  lg: "45%",
                  xl: "39%",
                },
                position: "absolute",
                left: "10px",
                top: "80px",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "40px", md: "48px" },
                  textAlign: { xs: "left", sm: "left" },
                }}
              >
                The way to experience the world
              </Typography>
            </Box>
          </Container>
          {/* <img
            src={`{bannerData[0]?.footer}`}
            alt=""
            srcSet=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          /> */}
        </Box>
        <Box sx={{ background: "#151515" }}>
          <Container sx={{ p: 5 }}>
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                py: 5,
                gap: 4,
              }}
            >
              <Grid item xs={12} md={5} sx={{}}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "center", md: "start" },
                    justifyContent: { xs: "center", md: "flex-start" },
                    gap: "20px 0px",
                  }}
                >
                  <Box
                    sx={{
                      with: "100px",
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <img
                      src={logof}
                      alt="logo"
                      srcSet=""
                      style={{
                        color: "#000",
                        width: "60%",
                        objectFit: "contain",
                        display: "flex",
                        alignItems: "start",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        color: "#E5E7EB",
                        fontFamily: "Inter",
                        // fontSize: "19px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "140%",

                        textAlign: { xs: "center", md: "left" },
                      }}
                    >
                      We believe in Adventures. Creating a mindful community
                      that embraces every moment.
                    </Typography>
                  </Box>
                  <Box
                    sx={
                      {
                        // display: "flex",
                        // justifyContent: "flex-start",
                        // alignItems: "center",
                      }
                    }
                  >
                    <Button
                      variant="simplebtn"
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "14px",

                        backgroundColor: "#EC3F18",
                        color: "#fff",
                        alignItems: "left",
                        width: "300px",
                      }}
                    >
                      Enquire
                    </Button>
                  </Box>
                  <Box>
                    {socialicon.map((item, index) => {
                      return <IconButton key={index}>{item.icon}</IconButton>;
                    })}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={3} sx={{ color: "#fff" }}>
                {" "}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px 0px",
                    justifyContent: { xs: "center", md: "flex-start" },
                    alignItems: { xs: "center", md: "start" },
                  }}
                >
                  <Typography>Contact Us</Typography>
                  <Typography>+91 98968595847</Typography>
                  <Typography>nomadictownies@mail.com</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={2} sx={{ color: "#fff" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: { xs: "row", md: "column" },
                    flexWrap: "wrap",
                    alignItems: { xs: "center", md: "start" },
                    borderRadius: "10px",
                  }}
                >
                  <Typography sx={{ p: "10px" }}>Quick Links</Typography>
                  {array2.map((item, index) => {
                    return (
                      <NavLink
                        to={item.link1}
                        key={index}
                        style={styledactivelink}
                        onClick={() => {
                          window.scrollTo(0, 0);
                        }}
                      >
                        {item.name.toLocaleLowerCase()}
                      </NavLink>
                    );
                  })}
                </Box>
              </Grid>
            </Grid>
            <Box
              sx={{
                height: "1px",
                backgroundColor: "#8B919C",
                width: "100%",
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: { xs: "column", md: "row" },
                gap: "20px 0px",
                p: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  width: "100%",
                  gap: "10px 10px",
                }}
              >
                {termsArray.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      to={item.link1}
                      style={{ color: "#D2D5DA", textDecoration: "none" }}
                      onClick={() => {
                        window.scrollTo(0, 0);
                      }}
                    >
                      {item?.name}
                    </Link>
                  );
                })}
              </Box>

              <Typography
                sx={{
                  color: "#9CA3AF",
                  textAlign: { xs: "center", md: "right" },
                  width: "100%",
                }}
              >
                All Rights Reserved. 2023 | Nomadic Townies
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
