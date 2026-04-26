import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { line } from "../../../Images";
import EnquirNow from "../../../Modals/EnquirNow";
import DetailUpcomming from "./DetailUpcomming";
import BookNowModal from "../../../Payment/BookNowModal";
import LoginModal from "../../../Modals/LoginModal";
import { useGetTripsQuery } from "../../../services/TripApis";
import { extractRating } from "../../../utils";

const UpcommingDetails = () => {
  const [opens, setOpens] = useState(false);
  const [openL, setOpenL] = useState(false);
  
  const toggelModel = () => {
    setOpens(!opens);
  };
  
  const toggelModelL = () => {
    setOpenL(!openL);
  };
  
  const { userDbData } = useSelector((store) => store.global);

  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { id } = useParams();
  const { data } = useGetTripsQuery();

  const [tripsData, setTripsData] = useState(data?.data);
  useEffect(() => {
    if (data) {
      setTripsData(data?.data); // Assuming the structure of your data is { data: [...] }
      // const parsedData = data.data.map((trip) => ({
      //   ...trip,
      //   ratings: JSON.parse(trip.ratings),
      // }));
      // console.log("parsedData...", parsedData);
    }
  }, [data]);

  const item = tripsData && tripsData.find((item) => item._id === id);
  console.log("item.....", item);

  if (!item) {
    return <Typography>Item not found</Typography>;
  }

  // Navigate to payment
  const handleBookNowClick = () => {
    // Check if user is logged in before proceeding
    if (!userDbData) {
      setOpenL(true);
      return;
    }
    
    // Navigate to the '/payment' route with data
    navigate("/payment", { state: { paymentDetail: item } });
  };

  const iconArry = [
    {
      icon: <AccessTimeIcon />,
      text: `${item?.nights}N / ${item?.days}D`,
    },
    {
      icon: <FmdGoodOutlinedIcon />,
      text: item.location,
    },
    {
      icon: <CalendarTodayOutlinedIcon sx={{ fontSize: "25px", p: 0.3 }} />,
      text: "Select Batch Date",
    },
  ];
  return (
    <Box>
      <LoginModal
        openL={openL}
        setOpenL={setOpenL}
        toggelModelL={toggelModelL}
      />
      <BookNowModal
        opens={opens}
        setOpens={setOpens}
        toggelModel={toggelModel}
      />
      <Container maxWidth="xl" sx={{ p: 0 }}>
        <Box
          sx={{
            width: "100%",
            height: "360px",
            borderRadius: "30px",
            mb: 5,
            mt: { xs: 10, lg: 0 },
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "absolute",
              top: "30px",
              width: "100%",
              px: { xs: 1, md: 2 },
            }}
          >
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                background: "#F9FAFB",

                "&:hover": {
                  background: "#e1e2e3",
                },
              }}
            >
              <KeyboardBackspaceIcon sx={{ color: "#4B5563" }} />
            </IconButton>
            <Box sx={{ display: "flex", gap: "0px 10px" }}>
              <IconButton
                sx={{
                  background: "#F9FAFB",
                  "&:hover": {
                    background: "#e1e2e3",
                  },
                }}
              >
                <ShareIcon sx={{ color: "#4B5563" }} />
              </IconButton>
              <IconButton
                sx={{
                  background: "#F9FAFB",
                  "&:hover": {
                    background: "#e1e2e3",
                  },
                }}
              >
                <FavoriteBorderIcon sx={{ color: "#4B5563" }} />
              </IconButton>
            </Box>
          </Box>
          <img
            src={`${item?.bannerImage}`}
            alt=""
            srcSet=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "20px",
            }}
          />
        </Box>
        <Container>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              mb: 5,
            }}
          >
            <Grid
              item
              xs={12}
              md={7}
              sx={{ display: "flex", flexDirection: "column", gap: "20px 0px" }}
            >
              <Typography
                sx={{
                  color: "#4B5563",
                  fontWeight: 500,
                  fontSize: { xs: "20px", sm: "25px", lg: "33px" },
                  textAlign: "left",
                }}
              >
                {item.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignContent: "center",
                  gap: "10px 10px",
                  // flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Typography
                  sx={{
                    color: "#6D7280",
                    fontSize: { xs: "13", sm: "16px" },
                    textAlign: "left",
                    mt: 0.5,
                  }}
                >
                  {item.subTitle}
                </Typography>
                <Box
                  sx={{
                    background: "#F4C95D",
                    borderRadius: "32px",
                    display: "flex",
                    justifyContent: "center",
                    // width: { xs: "90px", sm: "86px" },
                    px: 1.5,
                    height: "30px",
                    alignItems: "center",
                  }}
                >
                  <StarBorderIcon />
                  <Typography> {extractRating(item?.ratings)}</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "10px 10px",
                  flexWrap: "wrap",
                }}
              >
                {iconArry.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        background: "#F9FAFB",
                        border: "1px solid #F3F4F6",
                        borderRadius: "32px",
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        gap: "0px 15px",
                        pr: 1,
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          background: "#7DCD85",
                          color: "#fff",
                          "&:hover": {
                            color: "#7DCD85",
                          },
                        }}
                      >
                        {item.icon}
                      </IconButton>
                      <Typography
                        sx={{
                          color: "#111827",
                          fontSize: { xs: "13px", sm: "16px" },
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
              <Box
                sx={{
                  background: "#F9FAFB",
                  border: "1px solid #F3F4F6",
                  borderRadius: "32px",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  // flexDirection: { xs: "column", sm: "row" },

                  py: { xs: 1, sm: 1 },
                  width: { xs: "100%", sm: "auto" },
                  gap: "20px 10px",
                }}
              >
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Typography
                    sx={{
                      color: "#6D7280",
                      fontSize: { xs: "13px", sm: "16px" },
                    }}
                  >
                    Pick Up :{" "}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#111827",
                      fontSize: { xs: "13px", sm: "16px" },
                    }}
                  >
                    {item.pickUp}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: {
                      xs: "35px",
                      sm: "50px",
                      display: "flex",
                      alignItems: "center",
                    },
                  }}
                >
                  <img
                    src={line}
                    alt={line}
                    srcSet=""
                    style={{ width: "100%" }}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                  <Typography
                    sx={{
                      color: "#6D7280",
                      fontSize: { xs: "13px", sm: "16px" },
                    }}
                  >
                    Drop Off :{" "}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#111827",
                      fontSize: { xs: "13px", sm: "16px" },
                    }}
                  >
                    {item.dropOff}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              md={3.5}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: "5px 0px", md: "20px 0px" },
                mt: { xs: 5, md: 0 },
              }}
            >
              <Typography
                sx={{
                  color: "#4B5563",
                  fontWeight: 500,
                  fontSize: { xs: "20px", sm: "25px", lg: "33px" },
                  textAlign: "center",
                  display: "flex",
                  alignItems: { xs: "start", md: "center" },
                  justifyContent: { xs: "flex-start", md: "center" },
                }}
              >
                &#8377;{item?.price}
                <span style={{ fontSize: "20px", fontWeight: 400 }}>
                  / Person
                </span>
              </Typography>
              <EnquirNow />
              <Button
                // onClick={() => setOpens(true)}
                onClick={handleBookNowClick}
                variant="simplebtn"
                sx={{ background: "#CD482A", color: "#fff" }}
              >
                Book Now
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Container>
      <Container>
        <DetailUpcomming tripDetail={item} />
        {/* <Test /> */}
        {/* <DetailTabs /> */}
      </Container>
    </Box>
  );
};

export default UpcommingDetails;
