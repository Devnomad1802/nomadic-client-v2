/* eslint-disable react/prop-types */
import FirstSection from "../Component/Home/FirstSection";
import { Box, Hidden, Typography } from "@mui/material";

import Banner from "../Component/Home/Banner";
import Categories from "../Component/Home/Categories";
import About from "../Component/Home/About";
import ReviewsBanner from "../Component/Home/ReviewsBanner";
import { banner, banner2 } from "../assets/LandingPage/index";
import Reviews from "../Component/Home/Reviews";
import Blog from "../Component/Home/Blog";

const bannerObj = {
  img: banner,
  heading: "Dubai is waiting for you!",
};

const bannerObj2 = {
  img: banner2,
  heading: "Dubai is waiting for you!",
};
import UpcomingTrip from "../Component/Home/UpcomingTrip";
import { useEffect, useState } from "react";
import Footer from "../Component/Footer";
import { useGetAllBlogsQuery } from "../services";

const Home = ({ homebg, aboutSection, toggle, homeVideo }) => {
  console.log("homeVideo in home page", homeVideo);
  const { isError, isFetching, isLoading, data } = useGetAllBlogsQuery();

  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    if (data) {
      setBlogData(data?.data); // Assuming the structure of your data is { data: [...] }
    }
    // window.scrollTo(0, 0);
  }, [data]);

  return (
    <Box>
      <FirstSection homebg={homebg} toggle={toggle} homeVideo={homeVideo} />
      <ReviewsBanner />
      <UpcomingTrip />
      <Hidden mdDownDown>
        <Typography
          sx={{
            color: "#4B5563",
            textAlign: "center",
            // fontFamily: "Inter",
            fontFamily: "Playfair",
            fontSize: { xs: "22px", sm: "28px", md: "28px",lg:"48px" },
            fontStyle: "normal",
            fontWeight: "bold",
            lineHeight: "140%",
          mt: { xs: 2, md: 5},
          }}
        >
          Handpicked Adventures
        </Typography>
        <Typography
          sx={{
            maxWidth: "800px",
            margin: "0 auto",
            color: "#4B5563",
            textAlign: "center",
            // fontFamily: "Inter",
            fontFamily: "Inter",
            fontSize: { xs: "16px",lg:"20px" },
            fontStyle: "normal",
            fontWeight: "400",
            lineHeight: "140%",
            mb: { xs: 2, md: 5 },
            mt: { xs: 2, md: 1 },
          }}
        >
          Handpicked destinations offering the perfect blend of adventure,
          comfort, and unforgettable experiences that will transform your
          perspective.
        </Typography>

        <Banner bannerObj={bannerObj} />
      </Hidden>

    
      <About aboutSection={aboutSection} />
      <Reviews />
      {/* <Hidden smDown>
        <Box sx={{ pt: 10 }}>
          <Banner bannerObj={bannerObj2} />
        </Box>
      </Hidden> */}
      <Blog />
      <Footer />
    </Box>
  );
};

export default Home;
