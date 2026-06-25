/* eslint-disable react/prop-types */
import FirstSection from "../Component/Home/FirstSection";
import { Box } from "@mui/material";
import { Helmet } from "react-helmet-async";

import HowItWorks from "../Component/Home/HowItWorks";
import Categories from "../Component/Home/Categories";
import About from "../Component/Home/About";
import Reviews from "../Component/Home/Reviews";
import TrustStrip from "../Component/Home/TrustStrip";
import ForHosts from "../Component/Home/ForHosts";
import Blog from "../Component/Home/Blog";
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
          "description": "Curated community trips, backpacking adventures, retreats, workshops and cultural immersions across India and the world.",
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
      <HowItWorks />
      <UpcomingTrip />
      <Categories />
      <About aboutSection={aboutSection} />
      <TrustStrip />
      <Reviews />
      <ForHosts />
      <Blog />
      <Footer />
    </Box>
  );
};

export default Home;
