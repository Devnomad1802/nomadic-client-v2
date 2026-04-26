import { Box, Button, Container, Grid, Typography } from "@mui/material";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import { blogsConstant } from "../../Constant/BlogsPageConstant";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGetAllBlogsQuery } from "../../services";
import { baseImage } from "../../utils";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";

const RelatedBlogs = () => {
  const { isError, isFetching, isLoading, data } = useGetAllBlogsQuery();

  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    if (data) {
      setBlogData(data?.data); // Assuming the structure of your data is { data: [...] }
    }
    window.scrollTo(0, 0);
  }, [data]);
  const GoTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Box sx={{ py: { xs: 10, md: 10 } }}>
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "28px",
              color: "#4B5563",
              fontFamily: "Inter",
              fontWeight: "500",
              mb: 5,
            }}
          >
            Related Blogs
          </Typography>
          <Button>View All</Button>
        </Box>
        <Box sx={{ color: "#000" }}>
          <Grid
            container
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {blogData &&
              blogData.map((item, index) => {
                return (
                  <Grid
                    component={Link}
                    to={`/blogs/Details/${item?._id}`}
                    onClick={GoTop}
                    item
                    key={index}
                    xs={12}
                    sm={5.7}
                    md={3.8}
                    sx={{
                      height: "410px",
                      width: "100%",
                      color: "#000",
                      boxShadow: 1,
                      textDecoration: "none",
                      my: 3,
                      borderRadius: "16px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "278px",
                        position: "relative",
                        borderRadius: "16px",
                      }}
                    >
                      <img
                        src={`${item?.Banner_Image}`}
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
                          justifyContent: "flex-start",
                          alignItems: "center",
                          gap: "0px 10px",
                          position: "absolute",
                          bottom: "20px",
                          left: "20px",
                        }}
                      >
                        <FmdGoodOutlinedIcon sx={{ color: "#fff" }} />
                        <Typography>{item?.location}</Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "flex-start",
                        p: 3,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#111827",
                          fontWeight: 500,
                          fontSize: { xs: "19px", sm: "20px", lg: "23px" },
                          textAlign: "left",
                        }}
                      >
                        {item?.title} <br />
                        {item.subtitle}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#4B5563",
                          display: "flex",
                          alignItems: "center",
                          mt: 2,
                        }}
                      >
                        <CalendarMonthRoundedIcon sx={{ color: "#4B5563" }} />
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

                          const dayWithSuffix = `${day}${getOrdinalSuffix(
                            day
                          )}`;
                          return `${dayWithSuffix} ${month} ${year}`;
                        })()}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default RelatedBlogs;
