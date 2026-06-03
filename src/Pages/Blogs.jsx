/* eslint-disable react/prop-types */
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../Component/Footer";
import { useGetAllBlogsQuery } from "../services";
import HeaderBanner from "../SmallComponents/HeaderBanner";
import { baseImage } from "../utils";
import { Helmet } from "react-helmet-async";

const Blogs = ({ blogbg }) => {
  const { isError, isFetching, isLoading, data } = useGetAllBlogsQuery();

  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    if (data) {
      setBlogData(data?.data); // Assuming the structure of your data is { data: [...] }
    }
  }, [data]);

  return (
    <Box sx={{ py: { xs: 0, md: 0 } }}>
      <Helmet>
        <title>Travel Blogs &amp; Destination Guides | Nomadic Townies</title>
        <meta name="description" content="Explore travel blogs, destination guides, trip itineraries &amp; travel tips by Nomadic Townies. Get inspired for your next adventure in India &amp; beyond." />
        <link rel="canonical" href="https://nomadictownies.com/blogs" />
        <meta property="og:title" content="Travel Blogs &amp; Destination Guides | Nomadic Townies" />
        <meta property="og:description" content="Explore travel blogs, destination guides, trip itineraries &amp; travel tips by Nomadic Townies." />
        <meta property="og:url" content="https://nomadictownies.com/blogs" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Nomadic Townies Blog",
          "url": "https://nomadictownies.com/blogs",
          "description": "Travel blogs, destination guides and trip itineraries by Nomadic Townies",
          "publisher": {
            "@type": "Organization",
            "name": "Nomadic Townies",
            "logo": { "@type": "ImageObject", "url": "https://nomadictownies.com/nt.png" }
          }
        })}</script>
      </Helmet>
      <HeaderBanner img={blogbg} text={"Blogs"} />
      <Container sx={{ pb: { xs: 3, md: 5 } }}>
        <Grid
          container
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 5,
          }}
        >
          {blogData &&
            blogData.map((item, index) => {
              return (
                <Grid
                  component={Link}
                  to={`/blogs/Details/${item?._id}`}
                  item
                  key={index}
                  xs={12}
                  sm={5.7}
                  md={3.8}
                  sx={{
                    height: { xs: "342px", sm: "410px" },
                    width: "100%",
                    color: "#000",
                    boxShadow: 1,
                    my: 3,
                    borderRadius: "16px",
                    textDecoration: "none",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: { xs: "210px", sm: "278px" },
                      position: "relative",
                      borderRadius: "16px",
                    }}
                  >
                    <img
                      src={`${item?.Banner_Image}`}
                      alt={item?.title ? `${item.title} - Nomadic Townies Blog` : "Travel blog by Nomadic Townies"}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "16px 16px 0px 0px",
                      }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: "0px 10px",
                        position: "absolute",
                        bottom: "20px",
                        left: "20px",
                      }}
                    >
                      <FmdGoodOutlinedIcon sx={{ color: "#fff" }} />
                      <Typography>{item?.location}</Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      justifyContent: "flex-start",
                      p: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#111827",
                        fontWeight: 500,
                        fontSize: { xs: "19px", sm: "20px", lg: "23px" },
                        textAlign: "left",
                      }}
                    >
                      {item?.title} <br />
                    </Typography>
                    <Typography
                      sx={{
                        color: "#4B5563",
                        display: "flex",
                        alignItems: "center",
                        mt: 2,
                      }}
                    >
                      <CalendarMonthRoundedIcon sx={{ color: "#4B5563" }} />
                      {(() => {
                        const dateObj = new Date(item?.Date);
                        const day = dateObj.getDate();
                        const month = dateObj.toLocaleString("en-US", {
                          month: "long",
                        });
                        const year = dateObj.getFullYear();

                        const getOrdinalSuffix = (n) => {
                          const s = ["th", "st", "nd", "rd"],
                            v = n % 100;
                          return s[(v - 20) % 10] || s[v] || s[0];
                        };

                        const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
                        return `${dayWithSuffix} ${month} ${year}`;
                      })()}
                    </Typography>
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

export default Blogs;
