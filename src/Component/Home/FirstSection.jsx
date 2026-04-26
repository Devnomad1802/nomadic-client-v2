/* eslint-disable react/prop-types */
import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import EnquirNow from "../../Modals/EnquirNow";
import tourCanada from "../../video/tourCanada.mp4";

const FirstSection = ({ homebg, toggle, homeVideo }) => {


  console.log("homelink", homeVideo);
  const [opene, setOpene] = useState(false);
  const toggelModele = () => {
    setOpene(!opene);
  };

  return (
    <>
      {toggle ? (
        // Video Section (when toggle is true)
        <Box
          sx={{
            position: "relative",
            height: { xs: "600px", sm: "80vh" },
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <Box
            component="video"
            src={homeVideo || tourCanada}
            // src="https://youtu.be/B9ygY75pKPU"
            autoPlay
            muted
            loop
            playsInline
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              zIndex: 0,
            }}
          />
          {/* Overlay for opacity */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2,
            }}
          >
            <EnquirNow
              opene={opene}
              setOpene={setOpene}
              toggelModele={toggelModele}
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 2 }}
            >
              <Container
                maxWidth="md"
                sx={{
                  height: "100%",
                  // border: "2px solid red",
                  mb: 5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    flexDirection: "column",
                    mt: 5,
                    gap: "20px 0px",
                  }}
                >
                  <Typography
                    // variant="heading1"
                    sx={{
                      color: "#fff",
                      fontFamily: "Playfair",
                      fontSize: { xs: "33px", sm: "40px", md: "48px" },
                    }}
                  >
                    The way to experience the world.{" "}
                  </Typography>
                  <Typography sx={{ textAlign: "center", opacity: 0.9, fontSize: { xs: "16px", sm: "18px", md: "20px" } }}>
                    Discover breathtaking destinations, create unforgettable memories, and embark on adventures that will transform your perspective.
                  </Typography>

                  <Button
                    variant="simplebtn"
                    onClick={() => {
                      setOpene(true);
                    }}
                    sx={{
                      textTransform: "capitalize",
                      fontSize: "14px",
                      backgroundColor: "#EC3F18",
                      color: "#fff",
                      alignItems: "left",
                      width: "300px",
                      "&:hover": {
                        border: "1.5px solid #fff",
                        background: "#393938",
                      },
                    }}
                  >
                    Enquire Now
                  </Button>
                </Box>
              </Container>
            </motion.div>
          </Box>
        </Box>
      ) : (
        // Image Swiper Section (when toggle is false)
        <Box
          sx={{
            position: "relative",
            height: { xs: "600px", sm: "734px" },
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
            "& .swiper": {
              height: "100%",
              width: "100%",
              overflow: "hidden",
              borderRadius: "0px",
            },
            "& .swiper-wrapper": {
              height: "100%",
              width: "100%",
            },
            "& .swiper-slide": {
              height: "100%",
              width: "100%",
              overflow: "hidden",
            },
            "& .swiper-pagination": {
              bottom: "20px",
              zIndex: 10,
            },
            "& .swiper-pagination-bullet": {
              width: "12px",
              height: "12px",
              backgroundColor: "#fff",
              opacity: 0.5,
            },
            "& .swiper-pagination-bullet-active": {
              opacity: 1,
              backgroundColor: "#EC3F18",
            },
          }}
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={0}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            loop={true}
            style={{ height: "100%", width: "100%" }}
          >
            {homebg?.map((image, index) => (
              <SwiperSlide key={index}>
                <Box
                  sx={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={`Banner ${index + 1}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <EnquirNow
                      opene={opene}
                      setOpene={setOpene}
                      toggelModele={toggelModele}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 100 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 100 }}
                      transition={{ duration: 2 }}
                    >
                      <Container
                        maxWidth="md"
                        sx={{
                          height: "100%",
                          mb: 5,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            flexDirection: "column",
                            mt: 5,
                            gap: "20px 0px",
                          }}
                        >
                          <Typography
                            variant="heading1"
                            sx={{
                              color: "#fff",
                              fontFamily: "Playfair",
                              fontSize: { xs: "33px", sm: "40px", md: "48px" },
                            }}
                          >
                            The way to experience the world.{" "}
                          </Typography>
                          <Typography sx={{ textAlign: "center", opacity: 0.9, fontSize: { xs: "16px", sm: "18px", md: "20px" } }}>
                            Discover breathtaking destinations, create unforgettable memories, and embark on adventures that will transform your perspective.
                          </Typography>

                          <Button
                            variant="simplebtn"
                            onClick={() => {
                              setOpene(true);
                            }}
                            sx={{
                              textTransform: "capitalize",
                              fontSize: "14px",
                              backgroundColor: "#EC3F18",
                              color: "#fff",
                              alignItems: "left",
                              width: "300px",
                              "&:hover": {
                                border: "1.5px solid #fff",
                                background: "#393938",
                              },
                            }}
                          >
                            Enquire Now
                          </Button>
                        </Box>
                      </Container>
                    </motion.div>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}
    </>
  );
};

export default FirstSection;
