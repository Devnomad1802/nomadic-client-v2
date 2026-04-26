/* eslint-disable react/prop-types */
import { Box, Button, Container } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Overview from "./Overview";
import Itinerary from "./Itinerary";
import BatchListTab from "../BatchListTabs/BatchListTab";
import InclusionExclusion from "./InclusionExclusion";
import OtherInfo from "./OtherInfo";
import Gallary from "./Gallary";
import TabReview from "./TabReview";

const DetailUpcomming = ({ tripDetail }) => {
  const [activeSection, setActiveSection] = useState("Overview");
  const [fixedPosition, setFixedPosition] = useState(false);

  const OverviewRef = useRef(null);
  const ItineraryRef = useRef(null);
  const BatchListRef = useRef(null);
  const InclusionExclusionRef = useRef(null);
  const OtherInfoRef = useRef(null);
  const GalleryRef = useRef(null);
  const ReviewRef = useRef(null);
  const FAQRef = useRef(null);

  // Button Array
  const detailArray = [
    {
      name: "Overview",
      refrance: OverviewRef,
    },
    {
      name: "Itinerary",
      refrance: ItineraryRef,
    },
    {
      name: "Batch List",
      refrance: BatchListRef,
    },
    {
      name: "Inclusion & Exclusion",
      refrance: InclusionExclusionRef,
    },
    {
      name: "Other Info",
      refrance: OtherInfoRef,
    },
    {
      name: "Gallery",
      refrance: GalleryRef,
    },
    {
      name: "Review",
      refrance: ReviewRef,
    },
    {
      name: "FAQ",
      refrance: FAQRef,
    },
  ];
  // handle scroll
  const scrollToSection = (ref, section) => {
    ref.current.scrollIntoView({
      behavior: "smooth",
    });
    setActiveSection(section);
  };

  // Detect the active section based on scroll position
  const handleScroll = () => {
    // absolute and fixed posion control
    const scrollY = window.scrollY;
    const windowHeight = 760;
    const remainingHeight = document.body.scrollHeight - scrollY - 400;

    if (scrollY > 1 * windowHeight && remainingHeight >= windowHeight) {
      setFixedPosition(true);
    } else {
      setFixedPosition(false);
    }
  };
  // Attach scroll event listener when component mounts
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Remove scroll event listener when component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Box>
      <Box sx={{ position: "relative", px: 0 }}>
        <Box
          sx={{
            width: "100%",
            overflowX: { xs: "auto", lg: "none" },
            // overflowX: { xs: "scroll", md: "none" }, // Use "auto" to allow the browser to decide whether to show the scroll bar
            minWidth: "100%", // Set a minimum width to ensure content is not hidden on small screens
            "&::-webkit-scrollbar": {
              height: "0px",
              width: "0px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#6B7280", // Color of the scrollbar thumb
              borderRadius: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#D1D5DB", // Color of the scrollbar track
              borderRadius: "6px",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              background: "#FBFBFB",
              border: "2px solid #F3F4F6",
              justifyContent: "flex-start",
              alignItems: "center",
              px: { xs: 0.5, sm: 1, md: 5 },
              py: { xs: 1, md: 1.5 },

              zIndex: { xs: 1, lg: 1000 },
              gap: "0px 30px",
              width: {
                xs: "977px",
                sm: "990px",
                md: "1100px",
                lg: fixedPosition ? "1148px" : "100%",
              },
              boxSizing: "border-box",
              position: {
                xs: "relative",
                lg: fixedPosition ? "fixed" : "absolute",
              },
              top: { xs: "0px", md: fixedPosition ? "0px" : "0px" },
            }}
          >
            {detailArray.map(({ name, refrance }, index) => {
              return (
                <Button
                  sx={{
                    color: "#111827",
                    borderRadius: "0px",
                    borderBottom:
                      activeSection === name ? "3px solid red" : "none",
                  }}
                  key={index}
                  onClick={() => scrollToSection(refrance, name)}
                >
                  {name}
                </Button>
              );
            })}
          </Box>
        </Box>
        <Box
          sx={{
            background: "#FBFBFB",
            mt: { xs: 5, md: 10 },
            py: { xs: 2, md: 2 },
            px: { xs: 1, sm: 3, md: 5 },
          }}
        >
          <Box
            ref={OverviewRef}
            sx={{
              color: "#000",
              pt: { xs: 0, md: 0 },
            }}
          >
            <Overview overview={tripDetail?.overview} />
          </Box>
          <Box
            ref={ItineraryRef}
            sx={{
              color: "#000",
              maxWidth: { xs: "100%", md: "sm" },
              pt: 10,
            }}
          >
            <Itinerary
              ItineraryFile={tripDetail?.itenarryImg}
              addDays={tripDetail?.addDays}
            />
          </Box>
          <Box
            ref={BatchListRef}
            sx={{
              color: "#000",
              maxWidth: { xs: "100%", md: "sm" },
              pt: 10,
            }}
          >
            <BatchListTab
              selectDate={JSON.parse(tripDetail?.selectDate)}
              endSelectDate={JSON.parse(tripDetail?.endSelectDate)}
              numberOfSeats={JSON.parse(tripDetail?.numberOfSeats)}
              numberOfDays={JSON.parse(tripDetail?.numberOfDays)}
            />
          </Box>
          <Box
            ref={InclusionExclusionRef}
            sx={{
              color: "#000",
              maxWidth: { xs: "100%", md: "sm" },
              pt: 10,
            }}
          >
            <InclusionExclusion
              Inclusion={tripDetail?.Inclusion}
              Exclusion={tripDetail?.Exclusion}
            />
          </Box>
          <Box
            ref={OtherInfoRef}
            sx={{
              color: "#000",
              maxWidth: { xs: "100%", md: "sm" },
              pt: 10,
            }}
          >
            <OtherInfo
              ThingsToCarry={tripDetail?.ThingsToCarry}
              Cancellation={tripDetail?.Cancellation}
            />
          </Box>
          <Box
            ref={GalleryRef}
            sx={{
              color: "#000",
              maxWidth: { xs: "100%", md: "sm" },
              pt: 10,
            }}
          >
            <Gallary Gallary={tripDetail?.gallaryImages} />
          </Box>
          <Box
            ref={ReviewRef}
            sx={{
              color: "#000",
              pt: 10,
              maxWidth: { xs: "100%", md: "sm" },
            }}
          >
            <TabReview />
          </Box>
          
        </Box>
      </Box>
    </Box>
  );
};

export default DetailUpcomming;
