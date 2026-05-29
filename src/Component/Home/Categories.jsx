import AcUnitIcon from "@mui/icons-material/AcUnit";
import GroupsIcon from "@mui/icons-material/Groups";
import TerrainIcon from "@mui/icons-material/Terrain";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
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

  return (
    <Container maxWidth="xl" sx={{ zIndex: 1, pt: 10, position: "relative" }}>
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

      <Box sx={{ position: "relative" }}>
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          loop={true}
          autoplay={{
            delay: 3500,
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
          {categoriData?.map((item, index) => (
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
                }}
              >
                <img
                  src={`${item?.Banner_Image}`}
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
                    background: "linear-gradient(transparent, rgb

cat > src/Component/Home/CategoriesStyle.css << 'EOF'
.categories-swiper {
  padding: 40px 20px 60px !important;
  overflow: visible !important;
}

.categories-swiper .swiper-slide {
  width: 320px !important;
  height: 420px !important;
  border-radius: 20px;
  transition: all 0.5s ease !important;
  filter: brightness(0.65) blur(1px);
}

.categories-swiper .swiper-slide-active {
  filter: brightness(1) blur(0px) !important;
  z-index: 2 !important;
}

.categories-swiper .swiper-slide-prev,
.categories-swiper .swiper-slide-next {
  filter: brightness(0.75) blur(0.5px) !important;
}

.categories-swiper .swiper-button-next,
.categories-swiper .swiper-button-prev {
  display: none !important;
}

.categories-swiper .swiper-pagination {
  bottom: 12px !important;
}

.categories-swiper .swiper-pagination-bullet {
  background: #CD482A;
  opacity: 0.4;
  width: 8px;
  height: 8px;
  transition: all 0.3s ease;
}

.categories-swiper .swiper-pagination-bullet-active {
  opacity: 1;
  width: 24px;
  border-radius: 4px;
}

.categories-swiper .swiper-slide:not(.swiper-slide-active):hover {
  filter: brightness(0.88) blur(0px) !important;
  cursor: pointer;
}

@media (max-width: 768px) {
  .categories-swiper {
    padding: 20px 10px 50px !important;
  }
  .categories-swiper .swiper-slide {
    width: 280px !important;
    height: 360px !important;
  }
}
