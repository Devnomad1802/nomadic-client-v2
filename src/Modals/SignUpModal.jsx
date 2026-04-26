import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  Dialog,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { facebook, signUpbg } from "../Images";
import BasicRating from "../SmallComponents/Rating";
import { google } from "../assets/LandingPage";
import { inputStyle } from "../Pages/ContactUs";
import PhoneNumber from "../SmallComponents/PhoneNumber";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import LoginModal from "./LoginModal";
import { useState } from "react";
import Loading from "../SmallComponents/Loading";
import Toastify from "../SmallComponents/Tostify";
import { useCallback } from "react";
import { useRegisterUserMutation } from "../services/authApis";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "859px",
  bgcolor: "background.paper",
  border: "2px solid #FBFBFB",
  boxShadow: 24,
  background: "#FBFBFB",
  borderRadius: "32px",
  p: 4,
};

// eslint-disable-next-line react/display-name
const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

// eslint-disable-next-line react/prop-types
export default function SignUpModal({ opens, setOpens, toggelModel }) {
  const navigate = useNavigate();
  const handleClose = () => setOpens(false);

  // SignUpModal
  const [openL, setOpenL] = useState(false);
  const toggelModelL = () => {
    setOpenL(!openL);
  };

  // Loading
  const [loading, setLoading] = React.useState(false);

  // Show Toast
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });
  const showToast = (msg, type) => {
    return setAlertState({
      open: true,
      message: msg,
      severity: type,
    });
  };
  // show Password
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // Register User
  const [register] = useRegisterUserMutation();

  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };
  const handleRegister = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setLoading(true);
        const data = await register(registerData).unwrap();
        console.log("data", data);
        localStorage.setItem("token", data?.token);
        showToast(data?.message, "success");
        setLoading(false);
        handleClose();
        navigate("/email-verification", {
          state: { email: registerData.email },
        });
      } catch ({ data }) {
        setLoading(false);
        showToast(data?.message, "error");
        console.log("data from Backend", data);
      }
    },
    [handleClose, navigate, register, registerData]
  );

  return (
    <Dialog
      open={opens}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="md"
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{
        color: "#fff",
        "& .MuiDialog-paper": {
          padding: "30px",
          zIndex: 100,
          mx: "auto",
          p: { xs: 2, md: 4 },
          borderRadius: { xs: "16px", sm: "24px" },
          border: "2px solid #FBFBFB",
          background: "#FBFBFB",
          overflowY: "auto",
          height: { xs: "auto", md: "auto" }, // Set an initial height
          "&::-webkit-scrollbar": {
            width: "3px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "none",
            borderRadius: "3px",
            height: "40px", // Adjust the height as needed
          },
          "& *": {
            scrollbarWidth: "auto",
            scrollbarColor: "none #ffffff",
          },
        },
      }}
    >
      <LoginModal
        openL={openL}
        setOpenL={setOpenL}
        toggelModelL={toggelModelL}
        setOpens={setOpens}
      />
      <Loading isLoading={loading} />{" "}
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <Grid
        container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          // alignItems: "center",
        }}
      >
        <Hidden mdDown>
          <Grid item xs={12} md={5.5} sx={{ height: "auto" }}>
            <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
              <Box
                sx={{
                  width: "80%",
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "20px 0px",
                }}
              >
                <Typography
                  sx={{
                    color: "#4B5563",
                  }}
                >
                  I had a Kasol Tosh Solo with NT everything was well arranged.
                </Typography>
                <BasicRating />
                <Typography sx={{ color: "#9CA3AF" }}>Jhon Deo</Typography>
              </Box>
              <img
                src={signUpbg}
                alt=""
                srcSet=""
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "100% 100%",
                }}
              />
            </Box>
          </Grid>
        </Hidden>
        <Grid
          xs={12}
          md={6}
          sx={{
            p: { xs: 1, sm: 2 },
            height: "100%",

            display: "flex",
            flexDirection: "column",
            gap: "20px 0px",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "20px", md: "28px" },
              color: "#000",
              textAlign: "left",

              position: "relative",
            }}
          >
            <IconButton
              onClick={handleClose}
              sx={{ position: "absolute", right: "-30px", top: "-20px" }}
            >
              <CloseIcon
                sx={{
                  color: "#000",
                }}
              />
            </IconButton>
            Create Account
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#F3F4F6",
                borderRadius: "16px",
                gap: "0px 10px",
                width: { xs: "100px", sm: "163px" },
              }}
            >
              <Box
                sx={{
                  width: { xs: "20px", md: "30px" },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src={google} alt="" srcSet="" style={{ width: "100%" }} />
              </Box>
              <Typography
                sx={{
                  color: "#000",
                  textTransform: "lowercase",
                  fontSize: { xs: "13px", sm: "16px" },
                }}
              >
                Google
              </Typography>
            </Button>
            <Button
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#F3F4F6",
                borderRadius: "16px",
                gap: "0px 10px",
                width: { xs: "100px", sm: "163px" },
              }}
            >
              <Box
                sx={{
                  width: { xs: "20px", md: "30px" },
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={facebook}
                  alt=""
                  srcSet=""
                  style={{ width: "100%" }}
                />
              </Box>
              <Typography
                sx={{
                  color: "#000",
                  textTransform: "lowercase",
                  fontSize: { xs: "13px", sm: "16px" },
                }}
              >
                facebook
              </Typography>
            </Button>
          </Box>
          <form onSubmit={handleRegister}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "20px 0px",
              }}
            >
              <Box>
                <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>
                  Name
                </Typography>
                <TextField
                  sx={inputStyle}
                  size="small"
                  placeholder="Jhon Smith"
                  name="name"
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>
                  Mobile
                </Typography>
                <PhoneNumber
                  handleChange={handleChange}
                  setRegisterData={setRegisterData}
                  registerData={registerData}
                />
              </Box>

              <Box>
                <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>
                  Email
                </Typography>
                <TextField
                  name="email"
                  type="email"
                  sx={inputStyle}
                  size="small"
                  placeholder="jhon@gmail.com"
                  onChange={handleChange}
                />
              </Box>
              <Box>
                <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>
                  Password
                </Typography>
                <TextField
                  name="password"
                  onChange={handleChange}
                  sx={inputStyle}
                  size="small"
                  placeholder="#inclu%89Kl.@59"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          sx={{ color: "#393938" }}
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                        >
                          {showPassword ? (
                            <Visibility sx={{ color: "#393938" }} />
                          ) : (
                            <VisibilityOff sx={{ color: "#393938" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
            <Button
              type="submit"
              variant="simplebtn"
              sx={{
                width: "100%",
                background: "#EC3F18",
                color: "#fff",
                mt: 2,
              }}
            >
              Submit
            </Button>
          </form>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "0px 10px",
            }}
          >
            <Typography
              sx={{ color: "#939393", textAlign: "left", fontSize: "13px" }}
            >
              Already have an account ?{" "}
              {/* <Link style={{ color: "#CD482A" }}>Log In</Link> */}
            </Typography>
            <Box>
              <Button
                onClick={() => {
                  setOpenL(true);
                  setOpens(false);
                }}
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
                Login
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
}
