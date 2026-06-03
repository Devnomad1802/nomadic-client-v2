import { Box, Breadcrumbs, Container, Grid, Link, Typography } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RelatedBlogs from "./Blog/RelatedBlogs";
import { useGetAllBlogsQuery } from "../services";
import { baseImage } from "../utils";
import "swiper/css";
import "swiper/css/pagination";
import "../SmallComponents/styles.css";

// import required modules
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Helmet } from "react-helmet-async";

const BlogDetail = () => {
  const { id } = useParams();

  const { isError, isFetching, isLoading, data } = useGetAllBlogsQuery();
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    if (data) {
      setBlogData(data?.data); // Assuming the structure of your data is { data: [...] }
    }
    window.scrollTo(0, 0);
  }, [data]);

  const navigate = useNavigate();
  const item = blogData && blogData.find((item) => item._id === id);
  if (!item) {
    return <Typography>Item not found</Typography>;
  }
  return (
    <Box>
      <Helmet>
        <title>{item?.title ? `${item.title} | Nomadic Townies Blog` : "Travel Blog | Nomadic Townies"}</title>
        <meta name="description" content={item?.description ? item.description.substring(0, 155) : "Read travel blogs and destination guides by Nomadic Townies."} />
        <link rel="canonical" href={`https://nomadictownies.com/blogs/Details/${id}`} />
        <meta property="og:title" content={item?.title || "Travel Blog | Nomadic Townies"} />
        <meta property="og:description" content={item?.description ? item.description.substring(0, 155) : "Read travel blogs and destination guides by Nomadic Townies."} />
        <meta property="og:image" content={item?.Banner_Image || "https://nomadictownies.com/nt.png"} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`https://nomadictownies.com/blogs/Details/${id}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={item?.Date} />
        {item && <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": item.title,
          "image": item.Banner_Image,
          "datePublished": item.Date,
          "dateModified": item.Date,
          "author": {
            "@type": "Organization",
            "name": "Nomadic Townies"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Nomadic Townies",
            "logo": { "@type": "ImageObject", "url": "https://nomadictownies.com/nt.png" }
          },
          "description": item.description ? item.description.substring(0, 155) : "",
          "url": `https://nomadictownies.com/blogs/Details/${id}`
        })}</script>}
      </Helmet>
      <Container maxWidth="xl" sx={{ mt: { xs: 10, md: 2 }, mb: 1 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2, fontSize: "14px" }}
        >
          <Link underline="hover" color="inherit" href="/" sx={{ cursor: "pointer" }}>
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/blogs" sx={{ cursor: "pointer" }}>
            Blogs
          </Link>
          <Typography color="text.primary" sx={{ fontSize: "14px" }}>
            {item?.title || "Blog"}
          </Typography>
        </Breadcrumbs>
      </Container>
      <Container maxWidth="xl" sx={{ mt: 0 }}>
        <Box
          sx={{
            width: "100%",
            height: { xs: "300px", md: "424px" },
          }}
        >
          <img
            src={`${item?.Banner_Image}`}
            alt={item?.title ? `${item.title} - Nomadic Townies` : "Travel blog post by Nomadic Townies"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: " 32px 32px 0px 0px",
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-around",
            width: "100%",
            background: "#393938",
            p: 3,

            borderRadius: "0px 0px 32px 32px",
          }}
        >
          <Box sx={{}}>
            <Typography
              sx={{
                color: "#FBFBFB",
                fontFamily: "Inter",
                fontSize: { xs: "18px", sm: "25px", md: "32px" },
                textAlign: { xs: "left", md: "left" },
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "140%",
              }}
            >
              {item?.title}
            </Typography>
            <Typography
              sx={{
                mt: 4,

                textAlign: { xs: "left", md: "left" },
              }}
            >
              {item?.author}
            </Typography>
          </Box>
          <Box sx={{}}>
            <Box
              sx={{
                display: "flex",
                mt: 2,
                gap: "0px 10px",

                ml: -0.5,
              }}
            >
              <FmdGoodOutlinedIcon sx={{ color: "#fff" }} />
              <Typography>{item?.location}</Typography>
            </Box>
            <Typography
              sx={{
                mt: { xs: 2, md: 7 },
                textAlign: { xs: "left", md: "right" },
              }}
            >
              {(() => {
                const dateObj = new Date(item?.Date);
                const day = dateObj.getDate();
                const month = dateObj.toLocaleString("en-US", {
                  month: "long",
                });
                const year = dateObj.getFullYear();

                const getOrdinalSuffix = (n) => {
                  const s = ["th", "st", "nd", "rd"],
                    v = n % 100;
                  return s[(v - 20) % 10] || s[v] || s[0];
                };

                const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;
                return `${dayWithSuffix} ${month} ${year}`;
              })()}
            </Typography>
          </Box>
        </Box>
      </Container>
      <Container
        maxWidth="md"
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",

          alignItems: "center",
          flexDirection: "column",
          mt: 2,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "20px 0px",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              color: "#6D7280",
              fontFamily: "Inter",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {item?.content1}
          </Typography>
        </Box>
      </Container>
      <Container
        maxWidth="md"
        sx={{
          height: { xs: "220px", sm: "300px", md: "406px" },
          width: "100%",
        }}
      >
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
          {item?.Add_Image &&
            item?.Add_Image.map((item, index) => {
              return (
                <SwiperSlide key={index} style={{ background: "none" }}>
                  <Box
                    sx={{
                      width: "100%",
                      // border: "1px solid #F3F4F6",
                      borderRadius: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "30px 0px",
                      mb: 5,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: "100%", md: "100%" },
                        height: { xs: "200px", md: "320px" },
                        borderRadius: { xs: "15px", md: "32px" },
                        // mx: "auto",
                      }}
                    >
                      <img
                        src={`${item}`}
                        alt=""
                        srcSet=""
                        style={{ width: "100%", borderRadius: "15px" }}
                      />
                    </Box>
                  </Box>
                </SwiperSlide>
              );
            })}
        </Swiper>

        {/* <Box>
          <img
            src={image}
            alt=""
            srcSet=""
            style={{ width: "100%", height: "100%" }}
          />
        </Box> */}
      </Container>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          mt: 2,
          p: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "20px 0px",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              color: "#6D7280",
              fontFamily: "Inter",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {item?.content2}
          </Typography>
        </Box>
      </Container>
      <Box>
        <RelatedBlogs />
      </Box>
    </Box>
  );
};

export default BlogDetail;
