/* eslint-disable react/prop-types */
import "swiper/css";
import "swiper/css/pagination";

import "./styles.css";
import { Container } from "@mui/material";
import { comma } from "../Images";
// import required modules
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import BasicRating from "./Rating";

const ReviewSwiper = ({ reviesData }) => {
  const matches = useMediaQuery("(min-width:900px)");
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: { xs: 5, sm: 10, md: 10 },
      }}
    >


      <Box sx={{ color: "#fff" }}>
        <Swiper
          slidesPerView={matches ? 3 : 1}
          spaceBetween={matches ? 10 : 20}
          pagination={{
            clickable: true,
          }}
          modules={[Pagination, Autoplay]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="mySwiper"
          style={{ color: "#000" }}
        >
          {reviesData &&
            reviesData?.map((item, index) => {
              return (
                <SwiperSlide
                  key={index}
                  style={{
                    background: "none",
                    maxWidth: matches ? "100%" : "100%",
                  }}
                >
                  <Box
                    sx={{
                      mb: 6,
                      mx: { xs: 2, md: 0 },
                      backgroundColor: "#FBFBFB",
                      borderRadius: "30px",
                      boxShadow:
                        "0px 10px 15px -3px #0000001A, 0px 4px 6px 0px #0000000D",
                      width: "100%",
                      height: "329px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ width: "81px", height: "54px" }}>
                      <img src={comma} alt="" srcSet="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </Box>
                    <Typography
                      sx={{
                        color: "#4B5563",
                        p: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 4,

                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: "1.7",
                        maxHeight: "6em", // 4 lines * 1.5 line-height
                      }}
                    >
                      {item?.Review}
                    </Typography>
                    <Box sx={{ pt: 1 }}>

                      <BasicRating ratings={item?.rating} />
                    </Box>
                    <Box
                      sx={{
                        height: "1px",
                        background: "#E5E7EB",
                        width: "80%",
                        mx: "auto",
                      }}
                    />
                    <Box
                      sx={{
                        p: 5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "0px 10px",
                      }}
                    >
                      <Box sx={{ width: "50px", height: "50px" }}>
                        <img
                          src={`${item?.Profile_Image}`}
                          alt=""
                          srcSet=""
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "50%",
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ color: "#9CA3AF" }}>
                          {item?.Name}
                        </Typography>
                        <Typography sx={{ color: "#D2D5DA", fontSize: { xs: "12px", md: "14px" } }}>
                          {item?.Job}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </SwiperSlide>
              );
            })}
        </Swiper>
      </Box>
    </Container>
  );
};

export default ReviewSwiper;
