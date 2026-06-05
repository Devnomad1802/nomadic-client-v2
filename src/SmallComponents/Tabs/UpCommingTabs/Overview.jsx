import { Box, Grid, Typography } from "@mui/material";
import { t1 } from "../../../Images";
import BasicRating from "../../Rating";
import OverviewSwiper from "./OverviewSwiper";
import { useEffect, useState } from "react";

const Overview = ({ overview }) => {
  const [fixedPosition, setFixedPosition] = useState(false);
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = 760;
    const remainingHeight = document.body.scrollHeight - scrollY - 430;

    if (scrollY > 1 * windowHeight && remainingHeight >= windowHeight) {
      setFixedPosition(true);
    } else {
      setFixedPosition(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      // Remove scroll event listener when component unmounts
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Box sx={{}}>
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Grid item xs={12} md={6.725}>
          <Typography
            sx={{
              fontSize: {
                xs: "18px",
                md: "23px",
              },
              fontWeight: "500",
              color: "#000",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            Overviews
          </Typography>
          <Typography
            sx={{
              color: "#000",
              textAlign: { xs: "center", md: "left" },
              mt: 2,
            }}
          >
            {/* Nestled in the heart of the Himalayas, Bhutan, known as the "Land of
            the Thunder Dragon," exudes an irresistible allure. With its
            pristine natural landscapes, vibrant cultural tapestry, and
            unwavering focus on Gross National Happiness, Bhutan offers a unique
            and immersive travel experience. <br /> From the bustling gateway of
            Phuentsholing to the tranquil valleys of Thimphu, Punakha, and Paro,
            each destination reveals a different facet of Bhutan's rich heritage
            and enchanting beauty. Whether exploring the bustling markets of
            Thimphu or embarking on a spiritual trek to the iconic Tiger's Nest
            Temple in Paro, Bhutan beckons with open arms, promising an
            unforgettable journey of discovery and wonder. */}
            {overview}
          </Typography>
        </Grid>
        <Grid
          xs={12}
          md={3.8}
          lg={4.5}
          sx={{
            mt: { xs: 5, md: 0 },
            position: "relative",
          }}
        >
          <Box
            sx={{
              zIndex: { xs: 1, lg: 1000 },
              boxSizing: "border-box",
              width: {
                xs: "100%",
                md: fixedPosition ? "300px" : "100%",
                lg: fixedPosition ? "390px" : "100%",
              },
              position: {
                xs: "relative",
                md: fixedPosition ? "fixed" : "absolute",
              },
              top: { xs: "0px", md: fixedPosition ? "100px" : "0px" },
            }}
          >
            <OverviewSwiper />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
