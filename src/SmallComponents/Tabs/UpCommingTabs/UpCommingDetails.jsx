import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  IconButton,
  Link,
  Typography,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { line } from "../../../Images";
import EnquirNow from "../../../Modals/EnquirNow";
import DetailUpcomming from "./DetailUpcomming";
import BookNowModal from "../../../Payment/BookNowModal";
import LoginModal from "../../../Modals/LoginModal";
import { useGetTripsQuery } from "../../../services/TripApis";
import { extractRating } from "../../../utils";
import { Helmet } from "react-helmet-async";
// import StickyBookingBar from "../../StickyBookingBar";

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

  const { slug } = useParams();
  const { data } = useGetTripsQuery();

  const [tripsData, setTripsData] = useState(data?.data);
  useEffect(() => {
    if (data) {
      setTripsData(data?.data);
    }
  }, [data]);

  // Find by seoSlug first (new SEO-friendly URLs), fall back to _id (legacy links)
  const item =
    tripsData &&
    (tripsData.find((t) => t.seoSlug && t.seoSlug === slug) ||
      tripsData.find((t) => t._id === slug));

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
  ];
  return (
    <Box>
      <Helmet>
        <title>{item?.title ? `${item.title} | Book Now | Nomadic Townies` : "Trip Details | Nomadic Townies"}</title>
        <meta name="description" content={item?.subTitle ? `${item.subTitle} — ${item?.nights}N/${item?.days}D trip from ${item?.pickUp}. Starting ₹${item?.price}/person. Book with Nomadic Townies.` : "Book this amazing trip with Nomadic Townies. Handcrafted adventure travel packages in India."} />
        <link rel="canonical" href={`https://nomadictownies.com/trips/${item?.seoSlug || slug}`} />
        <meta property="og:title" content={item?.title ? `${item.title} | Nomadic Townies` : "Trip Details | Nomadic Townies"} />
        <meta property="og:description" content={item?.subTitle || "Book this amazing trip with Nomadic Townies."} />
        <meta property="og:image" content={item?.bannerImage || "https://nomadictownies.com/nt.png"} />
        <meta property="og:url" content={`https://nomadictownies.com/trips/${item?.seoSlug || slug}`} />
        <meta property="og:type" content="product" />
        {item && <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          "name": item.title,
          "description": item.subTitle,
          "image": item.bannerImage,
          "touristType": "Adventure",
          "offers": {
            "@type": "Offer",
            "price": item.price,
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
          },
          "provider": {
            "@type": "Organization",
            "name": "Nomadic Townies",
            "url": "https://nomadictownies.com"
          },
          "itinerary": {
            "@type": "ItemList",
            "name": `${item.nights} Nights / ${item.days} Days`,
            "numberOfItems": item.days
          }
        })}</script>}
      </Helmet>
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
      <Container maxWidth="xl" sx={{ pt: { xs: 10, lg: 2 }, pb: 0, px: { xs: 2, md: 3 } }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2, fontSize: "14px" }}
        >
          <Link underline="hover" color="inherit" href="/" sx={{ cursor: "pointer" }}>
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/all-packages" sx={{ cursor: "pointer" }}>
            Trips
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            {item?.title || "Trip Details"}
          </Typography>
        </Breadcrumbs>
      </Container>
      <Container maxWidth="xl" sx={{ p: 0 }}>
        <Box
          sx={{
            width: "100%",
            height: "360px",
            borderRadius: "30px",
            mb: 5,
            mt: { xs: 2, lg: 0 },
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
            alt={item?.title ? `${item.title} - ${item.location || ""} Trip | Nomadic Townies` : "Adventure trip by Nomadic Townies"}
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
                mt: { xs: 5, md: 0 },
              }}
            >
              <Box
                sx={{
                  position: { xs: "relative", md: "sticky" },
                  top: { md: "20px" },
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  background: "#fff",
                  border: { md: "1px solid #F3F4F6" },
                  borderRadius: { md: "16px" },
                  p: { xs: 0, md: 3 },
                  boxShadow: { md: "0 2px 12px rgba(0,0,0,0.06)" },
                }}
              >
                {/* Price */}
                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                  <Typography
                    sx={{
                      color: "#1F2937",
                      fontWeight: 700,
                      fontSize: { xs: "28px", md: "32px" },
                      fontFamily: "Inter",
                    }}
                  >
                    &#8377;{item?.price}
                  </Typography>
                  {item?.strikePrice && Number(item.strikePrice) > Number(item.price) && (
                    <Typography
                      sx={{
                        color: "#9CA3AF",
                        fontSize: "16px",
                        textDecoration: "line-through",
                        fontFamily: "Inter",
                      }}
                    >
                      &#8377;{item.strikePrice}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      color: "#6B7280",
                      fontSize: "14px",
                      fontFamily: "Inter",
                    }}
                  >
                    / person
                  </Typography>
                </Box>

                {/* Trip Off badge */}
                {item?.tripOff > 0 && (
                  <Typography
                    sx={{
                      color: "#059669",
                      fontSize: "13px",
                      fontWeight: 600,
                      fontFamily: "Inter",
                    }}
                  >
                    {item.tripOff}% OFF applied
                  </Typography>
                )}

                {/* Book Now */}
                <Button
                  onClick={handleBookNowClick}
                  fullWidth
                  sx={{
                    background: "#CD482A",
                    color: "#fff",
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "16px",
                    fontFamily: "Inter",
                    py: 1.5,
                    "&:hover": { background: "#B03A1F" },
                  }}
                >
                  Book Now
                </Button>

                {/* Enquire */}
                <EnquirNow />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Container>
      <Container>
        <DetailUpcomming tripDetail={item} />
      </Container>

      {/* Mobile fixed Book Now bar */}
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          background: "#fff",
          borderTop: "1px solid #E5E7EB",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
          px: 2,
          py: 1.5,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
            <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "#1F2937", fontFamily: "Inter" }}>
              &#8377;{item?.price}
            </Typography>
            {item?.strikePrice && Number(item.strikePrice) > Number(item.price) && (
              <Typography sx={{ fontSize: "13px", color: "#9CA3AF", textDecoration: "line-through" }}>
                &#8377;{item.strikePrice}
              </Typography>
            )}
          </Box>
          <Typography sx={{ fontSize: "11px", color: "#6B7280", fontFamily: "Inter" }}>
            per person
          </Typography>
        </Box>
        <Button
          onClick={handleBookNowClick}
          sx={{
            background: "#CD482A",
            color: "#fff",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "15px",
            fontFamily: "Inter",
            px: 4,
            py: 1.2,
            "&:hover": { background: "#B03A1F" },
          }}
        >
          Book Now
        </Button>
      </Box>
      {/* Spacer for mobile fixed bar */}
      <Box sx={{ display: { xs: "block", md: "none" }, height: "72px" }} />
    </Box>
  );
};

export default UpcommingDetails;
