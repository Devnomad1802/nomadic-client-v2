/* eslint-disable react/prop-types */
import FirstSection from "../Component/Home/FirstSection";
import { Box, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";

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
      <Helmet>
        <title>Curated Travel Experiences &amp; Community Trips | Nomadic Townies</title>
        <meta name="description" content="Nomadic Townies is a curated marketplace for transformative travel experiences — community trips, wellness retreats, cultural immersions &amp; workshops hosted by passionate communities. Join 5000+ travelers." />
        <link rel="canonical" href="https://nomadictownies.com/" />
        <meta property="og:title" content="Curated Travel Experiences &amp; Community Trips | Nomadic Townies" />
        <meta property="og:description" content="A curated marketplace for transformative travel experiences hosted by passionate communities across India and the world. Discover experiences that matter." />
        <meta property="og:url" content="https://nomadictownies.com/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Nomadic Townies",
          "url": "https://nomadictownies.com",
          "logo": "https://nomadictownies.com/nt.png",
          "description": "Handcrafted adventure trips, group tours and travel packages across India and the world.",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"]
          },
          "sameAs": [
            "https://www.instagram.com/nomadictownies",
            "https://www.facebook.com/nomadictownies"
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Nomadic Townies",
          "url": "https://nomadictownies.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://nomadictownies.com/all-packages?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}</script>
      </Helmet>
      <FirstSection homebg={homebg} toggle={toggle} homeVideo={homeVideo} />
      {/* <ReviewsBanner /> */}
      <UpcomingTrip />
      <Categories />
      <Box sx={{ display: { xs: "none", md: "block" } }}>
        <Typography
          sx={{
            color: "#4B5563",
            textAlign: "center",
            fontFamily: "Playfair",
            fontSize: { xs: "22px", sm: "28px", md: "28px", lg: "48px" },
            fontStyle: "normal",
            fontWeight: "bold",
            lineHeight: "140%",
            mt: { xs: 2, md: 5 },
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
            fontFamily: "Inter",
            fontSize: { xs: "16px", lg: "20px" },
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
      </Box>

    
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
