import { Box, Hidden } from "@mui/material";
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
      <AllPakgaeshome allpkgbg={allpkgbg} />
      <UpcomingTrip />
      {/* <Upcimming /> */}
      <Categories />
      <Hidden smDown>
        <Banner bannerObj={bannerObj} />
      </Hidden>
      <Trending />
      <Hidden smDown>
        <Banner bannerObj={bannerObj2} />
      </Hidden>
      <Reviews />
      <Footer />
    </Box>
  );
};

export default AllPackages;
