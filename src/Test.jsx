import { Box, Button, Container } from "@mui/material";
import React, { useRef, useState, useEffect } from "react";
import Overview from "./SmallComponents/Tabs/UpCommingTabs/Overview";
import Itinerary from "./SmallComponents/Tabs/UpCommingTabs/Itinerary";
import BatchListTab from "./SmallComponents/Tabs/BatchListTabs/BatchListTab";
import InclusionExclusion from "./SmallComponents/Tabs/UpCommingTabs/InclusionExclusion";
import OtherInfo from "./SmallComponents/Tabs/UpCommingTabs/OtherInfo";
import Gallary from "./SmallComponents/Tabs/UpCommingTabs/Gallary";
import TabReview from "./SmallComponents/Tabs/UpCommingTabs/TabReview";

const Test = () => {
  const [activeSection, setActiveSection] = useState("Overview");
  const [fixedPosition, setFixedPosition] = useState(false);

  // Create refs for each section
  const overviewRef = useRef(null);
  const itenaryRef = useRef(null);
  const batchListRef = useRef(null);
  const inclusionExclusionRef = useRef(null);
  const otherInfoRef = useRef(null);
  const galleryRef = useRef(null);
  const reviewRef = useRef(null);
  const faqRef = useRef(null);

  // Scroll to the target section when a button is clicked
  const scrollToSection = (ref, section) => {
    ref.current.scrollIntoView({
      behavior: "smooth",
    });
    setActiveSection(section);
  };

  // Detect the active section based on scroll position
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = 760;
    const remainingHeight = document.body.scrollHeight - scrollY - 400;

    if (scrollY > 1 * windowHeight && remainingHeight >= windowHeight) {
      setFixedPosition(true);
    } else {
      setFixedPosition(false);
    }
    const scrollPosition = window.scrollY;
    const sections = [
      { ref: overviewRef, id: "Overview" },
      { ref: itenaryRef, id: "Itinerary" },
      { ref: batchListRef, id: "Batch List" },
      { ref: inclusionExclusionRef, id: "Inclusion & Exclusion" },
      { ref: otherInfoRef, id: "Other Info" },
      { ref: galleryRef, id: "Gallery" },
      { ref: reviewRef, id: "Review" },
      { ref: faqRef, id: "FAQ" },
    ];

    for (const section of sections) {
      const { ref, id } = section;
      if (
        scrollPosition >= ref.current.offsetTop &&
        scrollPosition < ref.current.offsetTop + ref.current.offsetHeight
      ) {
        setActiveSection(id);
        break; // Stop checking once we find the active section
      }
    }
  };

  // Attach scroll event listener when component mounts
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Remove scroll event listener when component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <Container>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "flex",
            background: "#FBFBFB",
            border: "2px solid #F3F4F6",
            justifyContent: "flex-start",
            alignItems: "center",
            px: { xs: 0.5, sm: 1, md: 2 },
            py: { xs: 1, md: 1.5 },
            // overflowX: "scroll",
            zIndex: 1000,
            gap: "0px 30px",
            width: { xs: "100%", lg: fixedPosition ? "1148px" : "100%" },
            boxSizing: "border-box",
            position: {
              xs: "relative",
              lg: fixedPosition ? "fixed" : "absolute",
            },
            top: { xs: "0px", md: fixedPosition ? "0px" : "0px" },
          }}
        >
          <Button
            onClick={() => scrollToSection(overviewRef, "Overview")}
            style={{
              color: "#111827",
              borderRadius: "0px",
              borderBottom:
                activeSection === "Overview" ? "3px solid red" : "none",
            }}
          >
            overview
          </Button>
          <Button
            onClick={() => scrollToSection(itenaryRef, "Itinerary")}
            style={{
              color: "#111827",
              borderRadius: "0px",
              borderBottom:
                activeSection === "Itinerary" ? "3px solid red" : "none",
            }}
          >
            itenary
          </Button>
          <Button
            onClick={() => scrollToSection(batchListRef, "Batch List")}
            style={{
              color: "#111827",
              borderRadius: "0px",
              borderBottom:
                activeSection === "Batch List" ? "3px solid red" : "none",
            }}
          >
            Batch List
          </Button>
          <Button
            onClick={() =>
              scrollToSection(inclusionExclusionRef, "Inclusion & Exclusion")
            }
            style={{
              color: "#111827",
              borderRadius: "0px",
              borderBottom:
                activeSection === "Inclusion & Exclusion"
                  ? "3px solid red"
                  : "none",
            }}
          >
            Inclusion & Exclusion
          </Button>
          <Button
            onClick={() => scrollToSection(otherInfoRef, "Other Info")}
            style={{
              color: "#111827",
              borderRadius: "0px",
              borderBottom:
                activeSection === "Other Info" ? "3px solid red" : "none",
            }}
          >
            Other Info
          </Button>
          <Button
            onClick={() => scrollToSection(galleryRef, "Gallery")}
            style={{
              color: "#111827",
              borderRadius: "0px",
              borderBottom:
                activeSection === "Gallery" ? "3px solid red" : "none",
            }}
          >
            Gallery
          </Button>
          <Button
            onClick={() => scrollToSection(reviewRef, "Review")}
            style={{
              color: "#111827",
              borderRadius: "0px",
              borderBottom:
                activeSection === "Review" ? "3px solid red" : "none",
            }}
          >
            Review
          </Button>
          <Button
            onClick={() => scrollToSection(faqRef, "FAQ")}
            style={{
              color: "#111827",
              borderRadius: "0px",
              borderBottom: activeSection === "FAQ" ? "3px solid red" : "none",
            }}
          >
            FAQ
          </Button>
        </Box>
        {/* Use refs to associate each section with a reference */}
        <Box ref={overviewRef} sx={{ color: "#000", border: "2px solid red" }}>
          <Overview />
        </Box>
        <Box ref={itenaryRef} sx={{ color: "#000", border: "2px solid red" }}>
          <Itinerary />
        </Box>
        <Box ref={batchListRef} sx={{ color: "#000", border: "2px solid red" }}>
          <BatchListTab />
        </Box>
        <Box
          ref={inclusionExclusionRef}
          sx={{ color: "#000", border: "2px solid red" }}
        >
          <InclusionExclusion />
        </Box>
        <Box ref={otherInfoRef} sx={{ color: "#000", border: "2px solid red" }}>
          <OtherInfo />
        </Box>
        <Box ref={galleryRef} sx={{ color: "#000", border: "2px solid red" }}>
          <Gallary />
        </Box>
        <Box ref={reviewRef} sx={{ color: "#000", border: "2px solid red" }}>
          <TabReview />
        </Box>
        <Box ref={faqRef} sx={{ color: "#000", border: "2px solid red" }}>
          <OtherInfo />
        </Box>
      </Box>
    </Container>
  );
};

export default Test;
