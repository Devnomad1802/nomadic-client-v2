import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Footer from "../Footer";
import AboutUs from "./AboutUs";
import Contact from "./Contact";
import HostCards from "./HostCards";
import HostFilter from "./HostFilter";
import HostHeader from "./HostHeader";
import HostTabs from "./HostTabs";
import Reviews from "./Reviews";
import { useParams } from "react-router-dom";
import { useGetHostByIdQuery, useGetHostTripsQuery } from "../../services";
import { Helmet } from "react-helmet-async";

const HostPage = () => {
  const [activeTab, setActiveTab] = useState(0); // Set to 0 for "Upcoming Trips" tab

  const { id } = useParams();
  
  // Only run queries if id exists
  const { data, isLoading: isLoadingHost, isError: isErrorHost } = useGetHostByIdQuery(id, {
    skip: !id
  });
  
  const {
    data: hostDataTrips,
  } = useGetHostTripsQuery(id, {
    skip: !id
  });

  const [hostData, setHostData] = useState(data?.data);

  useEffect(() => {
    if (data) {
      setHostData(data?.data);
    }
  }, [data]);

  // Show loading state while waiting for id or data
  if (!id || isLoadingHost) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        flexDirection: "column",
        gap: 2
      }}>
        <Typography variant="h6">Loading host information...</Typography>
      </Box>
    );
  }

  // Show error state if host not found
  if (isErrorHost) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        flexDirection: "column",
        gap: 2
      }}>
        <Typography variant="h6" color="error">Host not found</Typography>
        <Typography variant="body2">The requested host does not exist.</Typography>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <>
            <HostFilter />
            <Box sx={{ flex: 1 }}>
              <HostCards hostData={hostData} />
            </Box>
          </>
        );
      case 1:
        return <AboutUs hostData={hostData} />;
      case 2:
        return <Reviews hostData={hostData} />;
      case 3:
        return <Contact hostData={hostData} />;
      default:
        return <AboutUs hostData={hostData} />;
    }
  };

  const hostName = hostData?.hostTitle || hostData?.hostName || "Travel Host";
  const hostTagline = hostData?.tagline || "";
  const seoTitle = `${hostName} | Expert Travel Host | Nomadic Townies`;
  const seoDescription = hostTagline
    ? `${hostTagline} — Book trips with ${hostName} on Nomadic Townies. Discover handcrafted adventure tours and group travel experiences.`
    : `Book adventure trips and group tours with ${hostName} on Nomadic Townies. Trusted travel host with curated experiences across India.`;
  const canonicalUrl = `https://nomadictownies.com/hosts/${id}`;
  const ogImage =
    hostData?.brandingLogo ||
    "https://nomadic-townies-assets.sgp1.cdn.digitaloceanspaces.com/about-images/aboutbg1.jpg";

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      {/* Host Header */}
      <HostHeader hostData={hostData} />

      {/* Host Tabs */}
      <HostTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hostData={hostData}
      />

      {/* Dynamic Content */}
      <Box sx={{ flex: 1 }}>{renderContent()}</Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default HostPage;
