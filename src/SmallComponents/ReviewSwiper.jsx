/* eslint-disable react/prop-types */
import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";
import { Container, Box, Typography, useMediaQuery } from "@mui/material";
import { Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import BasicRating from "./Rating";

const ReviewSwiper = ({ reviesData }) => {
  const matches = useMediaQuery("(min-width:900px)");
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 5, sm: 8, md: 8 } }}>
      <Box sx={{ color: "#fff" }}>
        <Swiper
          slidesPerView={matches ? 3 : 1}
          spaceBetween={matches ? 24 : 20}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="mySwiper"
          style={{ color: "#000" }}
        >
          {reviesData &&
            reviesData?.map((item, index) => (
              <SwiperSlide key={index} style={{ background: "none" }}>
                <Box
                  sx={{
                    mb: 6,
                    mx: { xs: 2, md: 0 },
                    backgroundColor: "#FFFFFF",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                    width: "100%",
                    maxWidth: "352px",
                    minHeight: "376px",
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                    boxSizing: "border-box",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "14px",
                      mb: 2,
                    }}
                  >
                    {/* Left col: photo + stars stacked */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        flexShrink: 0,
                        gap: "6px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={`${item?.Profile_Image}`}
                          alt={item?.Name}
                          style={{
                            height: "100%",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                      <BasicRating ratings={item?.rating} />
                    </Box>

                    {/* Right col: name + job */}
                    <Box sx={{ pt: "4px" }}>
                      <Typography
                        sx={{
                          color: "#111827",
                          fontWeight: 700,
                          fontSize: "16px",
                          fontFamily: "Inter",
                          lineHeight: "1.4",
                        }}
                      >
                        {item?.Name}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#6B7280",
                          fontSize: "13px",
                          fontFamily: "Inter",
                          lineHeight: "1.4",
                        }}
                      >
                        {item?.Job}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Review text */}
                  <Typography
                    sx={{
                      color: "#4B5563",
                      fontSize: "14px",
                      fontFamily: "Inter",
                      lineHeight: "1.7",
                      textAlign: "left",
                    }}
                  >
                    {item?.Review}
                  </Typography>
                </Box>
              </SwiperSlide>
            ))}
        </Swiper>
      </Box>
    </Container>
  );
};

export default ReviewSwiper;
