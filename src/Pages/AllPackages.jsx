import { Box } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import ReviewsBanner from "../Component/Home/ReviewsBanner";
import Banner from "../Component/Home/Banner";
import Categories from "../Component/Home/Categories";
import { banner, banner2 } from "../assets/LandingPage";
import Upcimming from "../Component/AllPackegs/Upcimming";
import Reviews from "../Component/Home/Reviews";
import AllPakgaeshome from "../Component/AllPackegs/AllPakgaeshome";
import Trending from "../Component/AllPackegs/Trending";
import UpcomingTrip from "../Component/Home/UpcomingTrip";
import Footer from "../Component/Footer";

const bannerObj = {
  img: banner,
  heading: "Dubai is waiting for you!",
};

const bannerObj2 = {
  img: banner2,
  heading: "Dubai is waiting for you!",
};

const AllPackages = ({ allpkgbg }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box>
      <Helmet>
        <title>All Travel Packages | Group &amp; Adventure Tours in India | Nomadic Townies</title>
        <meta name="description" content="Browse all Nomadic Townies travel packages — group tours, adventure trips, international packages &amp; more. Find your perfect trip today." />
        <link rel="canonical" href="https://nomadictownies.com/all-packages" />
        <meta property="og:title" content="All Travel Packages | Nomadic Townies" />
        <meta property="og:description" content="Browse all Nomadic Townies travel packages — group tours, adventure trips, international packages &amp; more." />
        <meta property="og:url" content="https://nomadictownies.com/all-packages" />
      </Helmet>
      <AllPakgaeshome allpkgbg={allpkgbg} />
      <UpcomingTrip />
      {/* <Upcimming /> */}
      <Categories />
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Banner bannerObj={bannerObj} />
      </Box>
      <Trending />
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        <Banner bannerObj={bannerObj2} />
      </Box>
      <Reviews />
      <Footer />
    </Box>
  );
};

export default AllPackages;
