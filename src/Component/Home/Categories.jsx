import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGetAllCategoriesQuery } from "../../services/categoriesApis";
import "./CategoriesStyle.css";

const Categories = () => {
  const navigate = useNavigate();
  const { data } = useGetAllCategoriesQuery();
  const [categoriData, setCategoriData] = useState([]);

  useEffect(() => {
    if (data?.data) setCategoriData(data.data);
  }, [data]);

  const getTripCount = (categoryName) => {
    const counts = { trek: 12, himalayan: 12, snow: 8, winter: 8, motorcycle: 6, bike: 6, group: 15, adventure: 15 };
    const name = categoryName?.toLowerCase();
    for (const [key, count] of Object.entries(counts)) {
      if (name?.includes(key)) return count;
    }
    return 10;
  };

  const CategoriesDetail = (cInfo, clink) => {
    navigate(clink, { state: { item: cInfo } });
  };

  const slides = categoriData.length > 0 && categoriData.length < 5
    ? [...categoriData, ...categoriData, ...categoriData].slice(0, Math.max(5, categoriData.length))
    : categoriData;

  return (
    <Box sx={{ zIndex: 1, pt: 10, position: "relative" }}>

      <Container maxWidth="xl">
        <Typography
          sx={{
            color: "#4B5563",
            textAlign: "center",
            fontFamily: "Playfair",
            fontSize: { xs: "22px", sm: "28px", md: "28px", lg: "48px" },
            fontWeight: "bold",
            lineHeight: "140%",
            mt: { xs: 2, md: 0 },
          }}
        >
          Choose Your Adventure
        </Typography>
        <Typography
          sx={{
            maxWidth: "700px",
            margin: "0 auto",
            color: "#4B5563",
            textAlign: "center",
            fontFamily: "Inter",
            fontSize: { xs: "16px", lg: "20px" },
            fontWeight: "400",
            lineHeight: "140%",
            mb: { xs: 2, md: 5 },
            mt: { xs: 2, md: 1 },
          }}
        >
          From serene mountain treks to adrenaline-pumping expeditions, find your
          perfect adventure.
        </Typography>
      </Container>

      <Box sx={{ width: "100%", overflow: "hidden", py: 2 }}>
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={3}
          loop={true}
          speed={600}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 18,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Autoplay, Pagination]}
          className="categories-swiper"
        >
          {slides?.map((item, index) => (
            <SwiperSlide key={index}>
              <Box
                onClick={() =>
                  CategoriesDetail(item, `/CategorieDetails/${item?.Category}`)
                }
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "20px",
                  position: "relative",
                  cursor: "pointer",
                  overflow: "hidden",
                  boxShadow: "0px 12px 40px rgba(0,0,0,0.30)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { transform: "translateY(-8px)", boxShadow: "0px 20px 50px rgba(0,0,0,0.45)" },
                }}
              >
                <img
                  src={item?.Banner_Image}
                  alt={item?.Category}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "20px",
                    display: "block",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "55%",
                    background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
                    borderRadius: "0 0 20px 20px",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "16px",
                    right: "0px",
                    backgroundColor: "#fff",
                    borderRadius: "8px 0 0 8px",
                    padding: "8px 12px",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                    zIndex: 2,
                  }}
                >
                  <Typography sx={{ fontSize: "11px", color: "#4B5563", fontWeight: 500, lineHeight: 1 }}>
                    Starting from:
                  </Typography>
                  <Typography sx={{ fontSize: "15px", color: "#CD482A", fontWeight: 700, lineHeight: 1.2, mt: 0.5 }}>
                    ₹{parseInt(item?.Starting_From || 0).toLocaleString()}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "24px",
                    left: "20px",
                    zIndex: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "22px",
                      fontWeight: 700,
                      fontFamily: "Inter",
                      textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                      lineHeight: 1.2,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {item?.Category}
                  </Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,255,255,0.85)",
                      fontSize: "13px",
                      fontFamily: "Inter",
                      mt: "4px",
                    }}
                  >
                    {getTripCount(item?.Category)} trips available
                  </Typography>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      <Container maxWidth="xl">
        <Box sx={{ textAlign: "center", mt: 2, mb: 4 }}>
          <Button
            variant="simplebtn"
            sx={{
              backgroundColor: "#FF6B35",
              color: "#fff",
              px: 4,
              py: 1.5,
              "&:hover": { backgroundColor: "#E55A2B" },
            }}
          >
            View All
          </Button>
        </Box>
      </Container>

    </Box>
  );
};

export default Categories;
