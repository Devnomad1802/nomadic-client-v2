import { Box, Container, Grid, IconButton, Typography } from "@mui/material";
import { c1, cardab } from "../../assets/LandingPage";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { useCallback, useEffect, useState } from "react";
import { CategoriesConstent } from "../../Constant/HomePageConstant";
import Reviews from "./Reviews";
import { useGetTripsByCagtegoryMutation } from "../../services/categoriesApis";
import { baseImage } from "../../utils";
import Footer from "../Footer";

const CategorieDetails = () => {
  const currentDate = new Date();
  const location = useLocation();
  const { item } = location.state || {};
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const { id } = useParams();
  const [GetTripsByCagtegory] = useGetTripsByCagtegoryMutation();
  const [categoryData, setCategoryData] = useState([]);
  console.log("categorData", categoryData);

  const postCategory = useCallback(async () => {
    const res = await GetTripsByCagtegory({ categories: id }).unwrap();
    if (res) {
      const parsedData = res?.data?.map((trip) => {
        return {
          ...trip,
          selectDate: JSON.parse(trip.selectDate),
        };
      });
      setCategoryData(parsedData);
    }
  }, [GetTripsByCagtegory, id]);
  useEffect(() => {
    postCategory();
  }, [postCategory]);

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          width: "100%",
          height: "360px",
          position: "relative",
          borderRadius: "32px",
          boxSizing: "border-box",
          p: 0,
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            background: "#F9FAFB",
            position: "absolute",
            top: "20px",
            left: "88px",
            "&:hover": {
              background: "#e1e2e3",
            },
          }}
        >
          <KeyboardBackspaceIcon sx={{ color: "#4B5563" }} />
        </IconButton>
        <img
          src={`${item?.Banner_Image}`}
          alt=""
          srcSet=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "32px",
          }}
        />
        <Box
          sx={{
            position: "relative",
            // bottom: "0px",
            // left: "50%",
            // width: "100%",
            // transform: "translate(-50%, -0%)",
            borderRadius: "0px 0px 32px 32px",
            background: "rgba(0, 0, 0, 0.81)",
            filter: "blur(0.45px)",
            px: { xs: 2, md: 10 },
            height: "100px",
            boxSizing: "border-box",
            mt: "-120px",
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontSize: { xs: "20px", md: "40px" },
              textAlign: "left",
              mt: 2.1,
            }}
          >
            {item?.Category}
          </Typography>
          <Box
            sx={{
              position: "absolute",
              right: { xs: "30px", md: "80px" },
              top: "-20px",
              height: { xs: "55px", md: "75px" },
              width: { xs: "50px", md: "70px" },
            }}
          >
            <img
              src={cardab}
              alt=""
              srcSet=""
              style={{ width: "100%", height: "100%" }}
            />
            <Typography
              sx={{
                position: "absolute",
                color: "#fff",
                left: "50%",
                bottom: "20px",
                transform: "translate(-50%, 0%)",
                fontSize: { xs: "14px", md: "18px" },
              }}
            >
              {categoryData?.length}
            </Typography>
            <Typography>Packages</Typography>
          </Box>
        </Box>
      </Container>
      <Container>
        <Box sx={{ my: 5 }}>
          <Typography
            sx={{
              color: "#4B5563",
              // display: "flex",
              // textAlign: "center",
              fontFamily: "Inter",
              fontSize: { xs: "22px", sm: "28px", md: "28px" },
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "140%",
              mb: { xs: 2, md: 5 },
              mt: { xs: 3 },
            }}
          >
            Upcoming Trips
          </Typography>
          <Grid
            container
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {categoryData &&
              categoryData.map((citem, index) => {
                return (
                  <Grid
                    component={Link}
                    to={`/UpCommingDetails/${citem?._id}`}
                    item
                    key={index}
                    xs={12}
                    sm={5.7}
                    md={3.8}
                    sx={{
                      height: { xs: "342px", sm: "430px" },
                      width: "100%",
                      color: "#000",
                      boxShadow: 1,
                      my: 3,
                      borderRadius: "16px",
                      textDecoration: "none",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: { xs: "210px", sm: "278px" },
                        position: "relative",
                        borderRadius: "16px",
                      }}
                    >
                      <Box
                        sx={{
                          color: "#fff",

                          position: "absolute",
                          top: "20px",
                          right: "20px",
                          borderRadius: "50%",
                        }}
                      >
                        <IconButton size="small" sx={{ background: "#F1F7F9" }}>
                          <FavoriteRoundedIcon sx={{ color: "#FF0E07" }} />
                        </IconButton>
                      </Box>
                      <img
                        src={`${citem?.cardImage}`}
                        alt=""
                        srcSet=""
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "16px 16px 0px 0px",
                        }}
                      />

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "0px 10px",
                          position: "absolute",
                          bottom: "0px",
                          left: "0px",

                          width: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            padding: "10px 24px",
                            background: "#FFD703",
                            borderRadius: "0px 8px 0px 0px",
                          }}
                        >
                          <Typography sx={{ color: "#000" }}>
                            &#8377; {citem?.price} / Person
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            border: "1px solid #4B5563",
                            borderRadius: "15px",
                            background: "#5D5F71",
                            gap: "0px 3px",
                            px: 0.5,
                            py: 0.2,
                            mr: 2,
                          }}
                        >
                          <StarRoundedIcon
                            style={{ color: "#FBC800", fontSize: "25px" }}
                          />
                          <Typography
                            sx={{
                              color: "#FBC800",
                              fontSize: "18px",
                              fontWeight: 500,
                            }}
                          >
                            {citem?.ratings}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "flex-start",
                        p: { xs: 1.5, md: 3 },
                        gap: "10px 0px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#111827",
                          fontWeight: 500,
                          fontSize: { xs: "18px", sm: "21px" },
                          textAlign: "left",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
                          overflow: "hidden",
                        }}
                      >
                        {citem?.title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          mt: 1,
                          gap: "0px 10px",
                        }}
                      >
                        {" "}
                        <FmdGoodOutlinedIcon sx={{ color: "#4B5563" }} />
                        <Typography sx={{ color: "#4B5563" }}>
                          {citem?.location}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",

                          width: "100%",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: "0px 10px" }}>
                          {" "}
                          <CalendarMonthRoundedIcon sx={{ color: "#4B5563" }} />
                          <Typography
                            sx={{
                              color: "#4B5563",
                              fontSize: { xs: "14px", sm: "16px" },
                            }}
                          >
                            {Array.isArray(citem?.selectDate) &&
                              citem?.selectDate
                                .map((item) => {
                                  const batchDate = new Date(item?.BatchDate);
                                  return {
                                    batchDate,
                                    difference: Math.abs(
                                      batchDate - currentDate
                                    ), // Absolute difference
                                  };
                                })
                                .sort((a, b) => a.difference - b.difference)
                                .filter(
                                  (dateObject) =>
                                    dateObject.batchDate > currentDate
                                )
                                .slice(0, 1) // Get the closest date
                                .map((closestDateObject) =>
                                  closestDateObject.batchDate.toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "2-digit",
                                      day: "2-digit",
                                      year: "numeric",
                                    }
                                  )
                                )}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            border: "1px solid #4B5563",
                            borderRadius: "15px",
                            background: "#F9FAFB",
                            px: 0.5,
                            py: 0.2,
                          }}
                        >
                          <AccessTimeRoundedIcon style={{ color: "#4B5563" }} />
                          <Typography sx={{ color: "#4B5563" }}>
                            {citem?.days}D/{citem?.nights}N
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Container>
      <Reviews />
      <Footer />
    </>
  );
};

export default CategorieDetails;
