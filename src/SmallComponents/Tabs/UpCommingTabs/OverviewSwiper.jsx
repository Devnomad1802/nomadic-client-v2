import "swiper/css";
import "swiper/css/pagination";

import "../../styles.css";

// import required modules
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import { t1 } from "../../../Images";
import BasicRating from "../../Rating";

const OverviewSwiper = () => {
  const matches = useMediaQuery("(min-width:900px)");
  return (
    <Box sx={{ color: "#fff" }}>
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
        style={{ color: "#000" }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
          return (
            <SwiperSlide
              key={index}
              style={{ background: "none", maxWidth: "600px" }}
            >
              <Box
                sx={{
                  width: "100%",
                  border: "1px solid #F3F4F6",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "30px 0px",
                  mb: 5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "0px 10px",
                  }}
                >
                  <img
                    src={t1}
                    alt=""
                    srcSet=""
                    style={{ width: "48px", borderRadius: "50%" }}
                  />
                  <Box>
                    <Typography sx={{ color: "#9CA3AF", fontWeight: "500" }}>
                      John Doe
                    </Typography>
                    <Typography sx={{ color: "#D2D5DA" }}>Designer</Typography>
                  </Box>
                </Box>
                <Typography sx={{ color: "#4B5563" }}>
                  Only one word... “Awesome”
                </Typography>

                <BasicRating />
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};

export default OverviewSwiper;
