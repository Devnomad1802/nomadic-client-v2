import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { logo } from "../../Images";
import SignUpModal from "../../Modals/SignUpModal";
import EnquirNow from "../../Modals/EnquirNow";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const array2 = [
  {
    name: "Home",
    link1: "/",
  },
  {
    name: "All Packages",
    link1: "/all_Packages",
  },
  {
    name: "About Us",
    link1: "/about_us",
  },
  {
    name: "Careers",
    link1: "/careers",
  },
  {
    name: "Blog",
    link1: "/blogs",
  },
  {
    name: "Contact Us",
    link1: "/contact_us",
  },
  // {
  //   name: "Test",
  //   link1: "/test",
  // },
];
const Navbar = () => {
  // SignUpModal
  const [opens, setOpens] = useState(false);
  const toggelModel = () => {
    setOpens(!opens);
  };

  // Enqur Modal
  const [opene, setOpene] = useState(false);
  const toggelModele = () => {
    setOpene(!opene);
  };
  const navigate = useNavigate();

  // Cheack User
  const { userDbData } = useSelector((store) => store.global);

  const styledactivelink = ({ isActive }) => {
    return {
      textDecoration: "none",
      padding: "10px",
      borderRadius: "0px",
      fontSize: "16px",
      color: isActive ? "#CD482A" : "#4B5563",

      alignItems: "center",
      fontWeight: isActive ? "700" : "400",
      fontFamily: "Inter",
      textTransform: "capitalize",
      //   borderBottom: isActive ? " 4px solid #CD482A" : "none",
      //   transition: "border-bottom 0.3s ease", // Add a transition for a smooth effect
      //   ":hover": {
      //     borderBottom: "4px solid red",
      //   },
    };
  };
  return (
    <Box>
      <Container maxWidth="lg">
        <SignUpModal
          opens={opens}
          setOpens={setOpens}
          toggelModel={toggelModel}
        />
        <EnquirNow
          opene={opene}
          setOpene={setOpene}
          toggelModele={toggelModele}
        />
        <Box
          sx={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "start",
            justifyContent: "space-between",
            backgroundColor: "transparent",
            pt: 1.7,
            pb: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "start",
              gap: "0px 60px",
            }}
          >
            <Box
              onClick={() => {
                navigate("/");
                window.scrollTo(0, 0);
              }}
              sx={{
                isolation: "isolate",
                cursor: "pointer",

                mt: 2,
              }}
            >
              <img
                width="160px"
                height="21px"
                src={logo}
                alt="logo"
                srcSet=""
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "0px 10px",
                alignItems: "center",
                borderRadius: "10px",
              }}
            >
              <>
                {array2.map((item, index) => {
                  return (
                    <NavLink
                      onClick={() => {
                        navigate("/");
                        window.scrollTo(0, 0);
                      }}
                      to={item.link1}
                      key={index}
                      style={styledactivelink}
                      className="cool-link"
                    >
                      {item.name.toLocaleLowerCase()}
                    </NavLink>
                  );
                })}
              </>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "0px 15px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "0px 20px",
              }}
            >
              {/* <EnquirNow /> */}
              <Button
                variant="simplebtn"
                sx={{}}
                onClick={() => {
                  setOpene(true);
                }}
              >
                Enquire Now
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "0px 20px",
              }}
            >
              {userDbData ? (
                <Box>
                  <IconButton
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    <AccountCircleIcon />
                  </IconButton>
                  <Typography sx={{ color: "#4B5563", fontSize: "13px" }}>
                    {userDbData?.name}
                  </Typography>
                </Box>
              ) : (
                <Button
                  onClick={() => setOpens(true)}
                  variant="simplebtn"
                  sx={{
                    background: "#393938",
                    color: "#fff",
                    border: "1px solid #393938",
                    "&:hover": {
                      background: "transparent",
                      border: "1px solid #CD482A",
                      color: "#CD482A",
                    },
                  }}
                >
                  Sign UP
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Navbar;
