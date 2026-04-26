/* eslint-disable react/prop-types */
import { Box, Container, Grid, Typography, Button } from "@mui/material";
import HeaderBanner from "../SmallComponents/HeaderBanner";
import { eye, img1, rocket, logo3 } from "../Images";
import { useEffect, useState } from "react";
import { useGetTeamMembersQuery } from "../services";
import Footer from "../Component/Footer";
import { locationiocn, aboutbg1, aboutbg2, about1, about2, about3, about4, about5, about6, about7, about8, travelicon, earthicon, budgtfriendlyIcon } from "../assets/LandingPage/index.js";
import Marquee from "react-fast-marquee";
import { aboutBannerbg } from "../Images";




const whyTravelCards = [
  {
    icon: earthicon,
    title: "Purposeful Journeys",
    description: "Rooted in cultural immersion, sustainability, and community engagement.",
  },
  {
    icon: budgtfriendlyIcon,
    title: "Budget-Friendly Adventures",
    description: "For students, solo travelers, and budget-conscious wanderers alike.",
  },
  {
    icon: travelicon,
    title: "For Every Kind of Explorer",
    description: "Whether you're just starting out or seeking something deeper, there's a journey here for you.",
  },
];

const AboutUs = ({ aboutbg }) => {
  const { data } = useGetTeamMembersQuery();

  const [aboutData, setAboutData] = useState(data?.data);
  console.log("About page ", aboutData);

  useEffect(() => {
    if (data) {
      setAboutData(data?.data);
    }
    window.scrollTo(0, 0);
  }, [data]);
  return (
    <>

      <Box>
        {/* <HeaderBanner img={aboutbg} text={"About Us"} /> */}
        <Container maxWidth="xl" sx={{ py: { xs: 5, sm: 8, md: 10 }, px: { xs: 3, sm: 4, md: 6 } }}>
          <Box
            sx={{
              background: "#ce482a",
              borderRadius: { xs: "16px", md: "23px" },
              minHeight: { xs: "400px", sm: "450px", md: "550px" },
              position: "relative",
              overflow: "hidden",
              // px: { xs: 3, sm: 4, md: 6 },
              // py: { xs: 4, sm: 6, md: 8 },
            }}
          >
            {/* Header with Logo */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: { xs: 4, md: 6 },
                pt: 10,
                maxWidth: "md",
                margin: "auto",

              }}
            >



              {/* Text Content */}
              <Box
                sx={{
                  maxWidth: { xs: "100%", md: "60%" },

                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: { xs: "16px", sm: "19px", md: "22px" },
                    fontWeight: 400,
                    color: "#FFFFFF",
                    mb: 1,
                    textAlign: "left",
                  }}
                >
                  Hey Explorer,
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: { xs: "18px", sm: "26px", md: "38px" },
                    fontWeight: 700,
                    color: "#FFFFFF",
                    mb: 1,
                    textAlign: "left",
                    lineHeight: "120%",
                  }}
                >
                  Welcome to Nomadic Townies!
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: { xs: "16px", sm: "19px", md: "22px" },
                    fontWeight: 400,
                    color: "#FFFFFF",
                    textAlign: "left",


                    textDecorationColor: "#3B82F6",
                    textUnderlineOffset: "4px",
                  }}
                >
                  Ever wondered how it all began?
                </Typography>
              </Box>
              <Box
                component="img"
                src={logo3}
                alt="Nomadic Townies Logo"
                sx={{
                  width: { xs: "60px", md: "80px" },
                  height: "auto",
                }}
              />
            </Box>

            {/* Background Image */}
            <Box
              sx={{
                position: "absolute",
                bottom: { xs: -60, sm: -80, md: -90 },
                left: 0,
                width: "100%",
                height: "65%",
                zIndex: 1,
              }}
            >
              <img
                src={aboutBannerbg}
                alt="about banner"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>
        </Container>

        {/* first section */}
        <Container sx={{ py: { xs: 5, sm: 8, md: 10 } }}>
          <Box sx={{ position: "relative", mb: { xs: 4, md: 6 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: { xs: "flex-start", md: "center" },
                justifyContent: "space-between",
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 2, md: 4 },
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: { xs: "24px", sm: "32px", md: "40px" },
                  fontWeight: 700,
                  lineHeight: "140%",
                  color: "#1F2937",
                  flex: 1,
                  textAlign: "left",
                }}
              >
                Let&apos;s rewind to 2020
                <br />
                Pune, India.
              </Typography>

              {/* Location Icon/Graphic */}
              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                  position: "relative",
                  width: "200px",
                  height: "120px",
                  flexShrink: 0,
                }}
              >
                <img
                  src={locationiocn}
                  alt="Location path"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Grid container spacing={{ xs: 3, md: 4 }}>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: { xs: "16px", md: "18px" },
                  fontWeight: 400,
                  lineHeight: "160%",
                  color: "#4B5563",
                  textAlign: "left",
                }}
              >
                Amid dreams and wanderlust, a group of passionate friends came
                together with one mission: to make travel more meaningful,
                mindful, and accessible for everyone. And just like that,{" "}
                <Box component="span" sx={{ fontWeight: 600, color: "#1F2937" }}>
                  Nomadic Townies
                </Box>{" "}
                was born.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: { xs: "16px", md: "18px" },
                  fontWeight: 400,
                  lineHeight: "160%",
                  color: "#4B5563",
                  textAlign: "left",
                }}
              >
                But we&apos;re not just a travel company. For us, travel is a way of
                life — a journey that fuels the soul, connects us with diverse
                cultures, and leaves us richer in spirit. It&apos;s not about ticking
                off places; it&apos;s about feeling alive in every moment.
              </Typography>
            </Grid>
          </Grid>
        </Container>

        {/* 2nd section */}
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "100%",
              minHeight: { xs: "600px", md: "600px" },
              backgroundImage: `url(${aboutbg1})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              display: "flex",
              alignItems: "center",
              py: { xs: 6, md: 10 },
              px: { xs: 3, sm: 4, md: 6 },
              borderRadius: { xs: "16px", md: "24px" },
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)",
                zIndex: 1,
              },
            }}
          >
            <Container
              maxWidth="xl"
              sx={{
                position: "relative",
                zIndex: 2,
                width: "100%",
                px: 0,
              }}
            >
              <Grid container spacing={{ xs: 4, md: 6 }}>
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: { xs: "24px", sm: "32px", md: "40px" },
                      fontWeight: 700,
                      lineHeight: "120%",
                      color: "#FFFFFF",
                      mb: 3,
                      textAlign: "left",
                    }}
                  >
                    How We&apos;ve Grown?
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: { xs: "14px", sm: "15px", md: "16px" },
                      fontWeight: 400,
                      lineHeight: "160%",
                      color: "#1F2937",
                      textAlign: "left",
                      mb: 2,
                    }}
                  >
                    Over the years, we&apos;ve evolved into a vibrant, purpose-driven
                    community of explorers, dreamers, and change-makers.
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: { xs: "14px", sm: "15px", md: "16px" },
                      fontWeight: 400,
                      lineHeight: "160%",
                      color: "#1F2937",
                      textAlign: "left",
                    }}
                  >
                    Our curated experiences blend offbeat adventures with
                    self-discovery, wellness, and social impact — because we believe
                    travel should transform not just places, but people too.
                  </Typography>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: { xs: "24px", sm: "32px", md: "40px" },
                      fontWeight: 700,
                      lineHeight: "120%",
                      color: "#1F2937",
                      mb: 3,
                      textAlign: "left",
                    }}
                  >
                    And now, we&apos;re stepping into an exciting new chapter.
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: { xs: "14px", sm: "15px", md: "16px" },
                      fontWeight: 400,
                      lineHeight: "160%",
                      color: "#1F2937",
                      textAlign: "left",
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      Nomadic Townies
                    </Box>{" "}
                    is becoming your go-to hub for all things adventure. We&apos;re
                    building a platform where modern nomads like you can discover and
                    book handpicked trips, retreats, events, and unique experiences
                    from our network of trusted partners — all under one roof.
                  </Typography>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Container>

        {/* 3rd section */}
        <Box sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
          {/* Text Section */}
          <Box sx={{ mb: { xs: 5, md: 8 }, textAlign: "center" }}>
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: { xs: "18px", sm: "20px", md: "22px" },
                fontWeight: 600,
                lineHeight: "160%",
                color: "#CD482A",
                maxWidth: "900px",
                mx: "auto",
              }}
            >
              Whether you&apos;re chasing Himalayan sunrises, joining a forest wellness
              retreat, or looking for spontaneous weekend plans — we&apos;ve made it
              easier than ever to explore the world, connect deeply, and travel with
              purpose.
            </Typography>
          </Box>

          {/* Images Row */}
          <Marquee
            speed={50}
            gradient={false}
            pauseOnHover={true}
            style={{
              width: "100%",
            }}
          >
            {[about1, about2, about3, about4, about5, about6, about7, about8, about1, about2, about3, about4, about5, about6, about7, about8, about1, about2, about3, about4, about5, about6, about7, about8, about1, about2, about3, about4, about5, about6, about7, about8, about1, about2, about3, about4, about5, about6, about7, about8, about1, about2, about3, about4, about5, about6, about7, about8, about1, about2, about3, about4, about5, about6, about7, about8, about1, about2, about3, about4, about5, about6, about7, about8, about1, about2, about3, about4, about5, about6, about7, about8, about1, about2, about3, about4, about5, about6, about7, about8].map(
              (image, index) => (
                <Box
                  key={index}
                  sx={{
                    flexShrink: 0,
                    width: { xs: "80px", sm: "120px", md: "120px" },
                    height: { xs: "80px", sm: "120px", md: "120px" },
                    borderRadius: "16px",
                    overflow: "hidden",
                    marginRight: { xs: 2, sm: 3, md: 4 },
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
                    },
                  }}
                >
                  <img
                    src={image}
                    alt={`About ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </Box>
              )
            )}
          </Marquee>
        </Box>

        {/* 4th section */}
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box
            sx={{
              backgroundColor: "#111827",
              py: { xs: 6, sm: 8, md: 10 },
              px: { xs: 4, sm: 5, md: 6 },
              width: "100%",
              borderRadius: { xs: "16px", md: "24px" },
            }}
          >
            {/* Title */}
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: { xs: "28px", sm: "36px", md: "48px" },
                fontWeight: 700,
                lineHeight: "120%",
                color: "#FFFFFF",
                textAlign: "center",
                mb: { xs: 5, md: 8 },
              }}
            >
              Why Travel With Us?
            </Typography>

            {/* Cards Grid */}
            <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
              {whyTravelCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    sx={{
                      backgroundColor: "#111827",
                      borderRadius: "16px",
                      p: { xs: 3, md: 4 },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      border: "1px solid #172135",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#172135",
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={card.icon}
                      alt={card.title}
                      sx={{
                        width: { xs: "40px", md: "48px" },
                        height: { xs: "40px", md: "48px" },
                        mb: 2,
                        objectFit: "contain",
                      }}
                    />
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: { xs: "20px", md: "24px" },
                        fontWeight: 700,
                        color: "#CD482A",
                        mb: 2,
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Inter",
                        fontSize: { xs: "14px", md: "16px" },
                        fontWeight: 400,
                        lineHeight: "160%",
                        color: "#FFFFFF",
                        textAlign: "left",
                      }}
                    >
                      {card.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>

        {/* 5th section */}
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 4, md: 2 } }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              minHeight: { xs: "500px", sm: "600px", md: "600px" },
              backgroundImage: `url(${aboutbg2})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              display: "flex",
              alignItems: "center",
              py: { xs: 6, md: 10 },
              px: { xs: 4, sm: 5, md: 6 },
              borderRadius: { xs: "16px", md: "24px" },
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)",
                zIndex: 1,
              },
            }}
          >
            <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2, px: 0 }}>
              <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                {/* Left Column - Main Headline */}
                <Grid item xs={12} md={6}>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: { xs: "32px", sm: "40px", md: "46px" },
                      fontWeight: 700,
                      lineHeight: "120%",
                      color: "#FFFFFF",
                      textAlign: { xs: "center", md: "left" },
                      mb: { xs: 4, md: 0 },
                    }}
                  >
                    Come Be a
                    <br />
                    Part of the Story
                  </Typography>
                </Grid>

                {/* Right Column - Description and CTA */}
                <Grid item xs={12} md={6}>
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontSize: { xs: "16px", md: "18px" },
                      fontWeight: 400,
                      lineHeight: "160%",
                      color: "#FFFFFF",
                      textAlign: { xs: "center", md: "left" },
                      mb: 3,
                    }}
                  >
                    At Nomadic Townies, we don&apos;t just take you places — we help
                    you discover yourself along the way. Join our growing tribe and
                    let&apos;s wander the world with purpose, together.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: { xs: "center", md: "flex-start" },
                    }}
                  >
                    <Button
                      sx={{
                        backgroundColor: "#CD482A",
                        color: "#FFFFFF",
                        px: { xs: 4, md: 5 },
                        py: { xs: 1.5, md: 2 },
                        borderRadius: "12px",
                        fontSize: { xs: "14px", md: "16px" },
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#B03A1F",
                        },
                      }}
                    >
                      Join Our Community
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Logo in Bottom Right */}
              <Box
                sx={{
                  position: "absolute",
                  top: { xs: "-20px", md: "200px" },
                  right: { xs: "20px", md: "30px" },
                  zIndex: 3,
                }}
              >
                <Box
                  component="img"
                  src={logo3}
                  alt="Nomadic Townies Logo"
                  sx={{
                    width: { xs: "60px", md: "150px" },
                    height: "auto",
                  }}
                />
              </Box>
            </Container>
          </Box>
        </Container>



        <Footer />
      </Box >
    </>
  );
};

export default AboutUs;





// /* eslint-disable react/prop-types */
// import { Box, Container, Grid, Typography } from "@mui/material";
// import HeaderBanner from "../SmallComponents/HeaderBanner";
// import { blogsbg, eye, img1, rocket, t1, t2, t3, t4, t5, t6 } from "../Images";
// import { useEffect, useState } from "react";
// import { useGetTeamMembersQuery } from "../services";
// import { baseImage, baseUrl } from "../utils";
// import Footer from "../Component/Footer";

// const array = [
//   {
//     img: eye,
//     heading: "Our Vision",
//     text: "Lorem ipsum dolor sit amet consectetur. Pulvinar vestibulum erat mi massa massa ultrices tincidunt blandit pulvinar. Id pellentesque tincidunt vitae elementum. In tempor dignissim nulla id pulvinar. Quisque dolor id mauris tincidunt leo varius facilisis. Lorem ipsum dolor sit amet",
//   },
//   {
//     img: rocket,
//     heading: "Our Mission",
//     text: "Lorem ipsum dolor sit amet consectetur. Pulvinar vestibulum erat mi massa massa ultrices tincidunt blandit pulvinar. Id pellentesque tincidunt vitae elementum. In tempor dignissim nulla id pulvinar. Quisque dolor id mauris tincidunt leo varius facilisis. Lorem ipsum dolor sit amet",
//   },
// ];

// const array2 = [
//   {
//     heading: "5000 +",
//     text: "Travellers",
//   },
//   {
//     heading: "333 +",
//     text: "Successful Trips",
//     borderl: "2px solid gray",
//     borderr: "2px solid gray",
//   },
//   {
//     heading: "5000 +",
//     text: "Travellers",
//   },
// ];
// const ourTeam = [
//   {
//     img: t1,
//     name: "John Doe",
//     position: "Senior Designer",
//   },
//   {
//     img: t2,
//     name: "John Doe",
//     position: "Senior Designer",
//   },
//   {
//     img: t3,
//     name: "John Doe",
//     position: "Senior Designer",
//   },
//   {
//     img: t4,
//     name: "John Doe",
//     position: "Senior Designer",
//   },
//   {
//     img: t5,
//     name: "John Doe",
//     position: "Senior Designer",
//   },
//   {
//     img: t6,
//     name: "John Doe",
//     position: "Senior Designer",
//   },
// ];

// const AboutUs = ({ aboutbg }) => {
//   const { isError, isFetching, isLoading, data } = useGetTeamMembersQuery();

//   const [aboutData, setAboutData] = useState(data?.data);
//   console.log("About page ", aboutData);

//   useEffect(() => {
//     if (data) {
//       setAboutData(data?.data);
//     }
//     window.scrollTo(0, 0);
//   }, [data]);
//   return (
//     <Box>
//       <HeaderBanner img={aboutbg} text={"About Us"} />
//       <Container sx={{ py: { xs: 5, sm: 10, md: 10 } }}>
//         <Typography
//           sx={{
//             textAlign: { xs: "center", md: "left" },
//             width: "100%",
//             fontFamily: "Inter",
//             fontSize: "28px",
//             fontStyle: "normal",
//             fontWeight: 500,
//             lineHeight: "140%",
//             color: "#000",
//             mb: 2,
//           }}
//         >
//           Our Story
//         </Typography>
//         <Grid
//           container
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             gap: "30px 30px",
//           }}
//         >
//           <Grid item xs={12} md={5.8} sx={{ width: "100%" }}>
//             <Typography
//               sx={{
//                 width: "100%",

//                 textAlign: { xs: "center", md: "left" },
//                 fontFamily: "Inter",
//                 fontSize: { xs: "16px", md: "19px" },
//                 fontStyle: "normal",
//                 fontWeight: 400,
//                 lineHeight: "140%",
//                 color: "#6D7280",
//               }}
//             >
//               Lorem ipsum dolor sit amet consectetur. Pulvinar vestibulum erat
//               mi massa massa ultrices tincidunt blandit pulvinar. Id
//               pellentesque tincidunt vitae elementum. In tempor dignissim nulla
//               id pulvinar. Quisque dolor id mauris tincidunt leo varius
//               facilisis. Lorem ipsum dolor sit amet{" "}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} md={5.8} sx={{ width: "100%" }}>
//             <Typography
//               sx={{
//                 width: "100%",
//                 textAlign: { xs: "center", md: "left" },
//                 fontFamily: "Inter",
//                 fontSize: { xs: "16px", md: "19px" },
//                 fontStyle: "normal",
//                 fontWeight: 400,
//                 lineHeight: "140%",
//                 color: "#6D7280",
//               }}
//             >
//               Lorem ipsum dolor sit amet consectetur. Pulvinar vestibulum erat
//               mi massa massa ultrices tincidunt blandit pulvinar. Id
//               pellentesque tincidunt vitae elementum. In tempor dignissim nulla
//               id pulvinar. Quisque dolor id mauris tincidunt leo varius
//               facilisis. Lorem ipsum dolor sit amet{" "}
//             </Typography>
//           </Grid>
//         </Grid>
//         <Box
//           sx={{
//             width: "100%",
//             height: { xs: "200px", md: "423px", sm: "300px" },
//             my: 4,
//           }}
//         >
//           <img
//             src={img1}
//             alt=""
//             srcSet=""
//             style={{ width: "100%", height: "100%" }}
//           />
//         </Box>

//         <Grid
//           container
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: { xs: "center", md: "left" },
//             // mt: 10,
//           }}
//         >
//           {array.map((item, index) => {
//             return (
//               <Grid item key={index} xs={12} md={5.8} sx={{ mt: 3 }}>
//                 <Box
//                   sx={{
//                     border: "1px solid #E5E7EB",
//                     borderRadius: "32px",
//                     p: { xs: 2, md: 3 },
//                     backgroundColor: "#F9FAFB",
//                     gap: 3,
//                     width: "100%",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       justifyContent: { xs: "center", md: "left" },
//                       gap: 3,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         width: "48px",
//                         height: "48px",
//                       }}
//                     >
//                       <img
//                         src={item.img}
//                         alt=""
//                         srcSet=""
//                         style={{ height: "100%", width: "100%" }}
//                       />
//                     </Box>
//                     <Typography
//                       sx={{
//                         color: "#000",
//                         fontFamily: "Inter",
//                         fontSize: "28px",
//                         fontStyle: "normal",
//                         fontWeight: 500,
//                         lineHeight: "140%",
//                       }}
//                     >
//                       {item.heading}
//                     </Typography>
//                   </Box>
//                   <Typography
//                     sx={{
//                       color: "#6D7280",
//                       fontFamily: "Inter",
//                       fontSize: { xs: "16px", md: "19px" },
//                       fontStyle: "normal",
//                       fontWeight: 400,
//                       lineHeight: "140%",
//                       textAlign: { xs: "center", md: "left" },
//                       mt: 3,
//                     }}
//                   >
//                     {item.text}
//                   </Typography>
//                 </Box>
//               </Grid>
//             );
//           })}
//         </Grid>

//         <Container
//           maxWidth="xl"
//           sx={{
//             backgroundColor: "#393938",
//             width: "100%",
//             border: "2px solid #E5E7EB",
//             borderRadius: " 32px",
//             p: { xs: 2, sm: 4, md: 5 },
//             mt: { xs: 5, md: 10 },
//           }}
//         >
//           <Box
//             sx={{
//               maxWidth: "sm",
//               mx: "auto",
//             }}
//           >
//             <Typography
//               sx={{
//                 color: "#FBFBFB",
//                 textAlign: "center",
//                 fontFamily: "Inter",
//                 fontSize: { xs: "22px", md: "30px" },
//                 fontStyle: "normal",
//                 fontWeight: 400,
//                 lineHeight: "140%",
//               }}
//             >
//               From creative concepts in design & motion, to engaging websites
//               and innovative marketing campaigns, ideas are our DNA.
//             </Typography>
//           </Box>
//           <Container maxWidth="md">
//             <Grid
//               container
//               sx={{
//                 mt: 5,
//                 display: "flex",
//                 justifyContent: "space-between",
//               }}
//             >
//               {array2.map((item, index) => {
//                 return (
//                   <Grid
//                     item
//                     key={index}
//                     xs={12}
//                     md={3.4}
//                     sm={4}
//                     sx={{
//                       borderLeft: {
//                         xs: "none",
//                         md: item.borderl ? item.borderl : "none",
//                       },
//                       borderRight: {
//                         xs: "none",
//                         md: item.borderr ? item.borderr : "none",
//                       },
//                       my: 2,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         color: "#CD482A",
//                         textAlign: "center",
//                         textShadow: "0px 4px 2px rgba(86, 255, 255, 0.06)",
//                         fontFamily: "Inter",
//                         fontSize: { xs: "30px", md: "48px" },
//                         fontStyle: "normal",
//                         fontWeight: 700,
//                         lineHeight: "140%",
//                       }}
//                     >
//                       {item.heading}
//                       <Typography
//                         sx={{
//                           color: "#E5E7EB",
//                           fontFamily: "Inter",
//                           fontSize: "19px",
//                           fontStyle: "normal",
//                           fontWeight: 400,
//                           lineHeight: "140%",
//                         }}
//                       >
//                         {item.text}
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 );
//               })}
//             </Grid>
//           </Container>
//         </Container>
//         <Container>
//           <Grid
//             container
//             sx={{ display: "flex", justifyContent: "space-between", pt: 10 }}
//           >
//             <Grid item xs={12} md={4}>
//               <Typography
//                 sx={{
//                   color: "#000",
//                   fontSize: { xs: "25px", md: "33px" },
//                   fontWeight: "600px",
//                   mt: 3,
//                 }}
//               >
//                 Meet Our Team
//               </Typography>
//             </Grid>
//             <Grid item xs={12} md={8} sx={{ mt: { xs: 5, md: 0 } }}>
//               <Grid
//                 container
//                 sx={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 {aboutData?.map((item, id) => {
//                   return (
//                     <Grid key={id} item xs={12} sm={5.8}>
//                       <Box>
//                         <Box
//                           sx={{
//                             width: "100%",
//                             height: { xs: "320px", sm: "380px" },
//                             my: { xs: 3, md: 5 },
//                           }}
//                         >
//                           <img
//                             // src={baseUrl + item.Photo}
//                             src={`${item.Photo}`}
//                             alt=""
//                             srcSet=""
//                             style={{
//                               width: "100%",
//                               height: "100%",
//                               objectFit: "cover",
//                             }}
//                           />
//                         </Box>
//                         <Box sx={{ py: 2 }}>
//                           <Typography
//                             sx={{
//                               color: "#6D7280",
//                               fontSize: { xs: "17px", md: "23px" },
//                               textAlign: "left",
//                             }}
//                           >
//                             {item?.Name}
//                           </Typography>
//                           <Typography
//                             sx={{ color: "#9CA3AF", textAlign: "left", mt: 1 }}
//                           >
//                             {item?.Position}
//                           </Typography>
//                         </Box>
//                       </Box>
//                     </Grid>
//                   );
//                 })}
//               </Grid>
//             </Grid>
//           </Grid>
//         </Container>
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default AboutUs;
