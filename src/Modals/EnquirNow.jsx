/* eslint-disable react/prop-types */
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
  Slide,
  TextField,
} from "@mui/material";
import { enquirbg, facebook, signUpbg } from "../Images";
import BasicRating from "../SmallComponents/Rating";
import { google } from "../assets/LandingPage";
import { inputStyle } from "../Pages/ContactUs";
import PhoneNumber from "../SmallComponents/PhoneNumber";
import CloseIcon from "@mui/icons-material/Close";
import SignUpModal from "./SignUpModal";
import { useEnquirMutation } from "../services/EnquirApi";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
// eslint-disable-next-line react/display-name
const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EnquirNow({ opene, setOpene, toggelModele }) {
  const { userDbData } = useSelector((store) => store.global);
  const handleClose = () => setOpene(false);
  const navigate = useNavigate();

  // Loading
  const [loading, setLoading] = React.useState(false);

  // Show Toast
  const [alertState, setAlertState] = React.useState({
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

  const [enquireNow, setEnquireNow] = React.useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setEnquireNow({ ...enquireNow, [e.target.name]: e.target.value });
  };

  // Enquir handler

  const [enquir] = useEnquirMutation();
  const handleEnquir = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setLoading(true);
        const data = await enquir({
          Name: enquireNow?.name,
          Phone: enquireNow?.phone,
          Email: enquireNow?.email,
          Message: enquireNow?.message,
          userId: userDbData?._id,
        }).unwrap();

        setLoading(false);
        handleClose();
        showToast("Enquire Submited", "success");
      } catch ({ data }) {
        setLoading(false);
        showToast(data?.message, "error");
        console.log("data from Backend", data);
      }
    },
    [
      enquir,
      enquireNow?.email,
      enquireNow?.message,
      enquireNow?.name,
      enquireNow?.phone,
      handleClose,
      userDbData?._id,
    ]
  );

  return (
    <Box sx={{ position: "relative" }}>
      <Dialog
        open={opene}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        sx={{
          color: "#fff",
          "& .MuiDialog-paper": {
            // padding: "30px",
            mb: "0px",
            zIndex: 100,
            mx: "0px",
            width: "100%",
            p: { xs: 2, md: 4 },
            borderRadius: { xs: "16px 16px 0px 0px", md: "24px" },
            border: "2px solid #FBFBFB",
            background: "#FBFBFB",
            overflowY: "auto",
            height: { xs: "auto", md: "auto" }, // Set an initial height
            position: "absolute", // Position absolutely
            // Align to the right
            bottom: { xs: "0%", md: "auto" }, // Align to the bottom for xs and center for md
            left: "50%", // Align to the left
            transform: "translateX(-50%)",
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
        <Box>
          <Grid
            container
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Hidden mdDown>
              <Grid
                item
                xs={12}
                md={5.5}
                sx={{
                  // border: "2px solid red",

                  boxSizing: "border-box",
                }}
              >
                <Box sx={{ width: "100%", position: "relative" }}>
                  <Box sx={{ height: "490px" }}>
                    <img
                      src={enquirbg}
                      alt=""
                      srcSet=""
                      style={{
                        height: "100%",
                        width: "100%",
                        // objectFit: "100% 100%",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Hidden>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                px: 2,
                // border: "2px solid red",
                display: "flex",
                flexDirection: "column",
                gap: "20px 0px",
                width: "100%",
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
                Plan your trip
              </Typography>

              <form onSubmit={handleEnquir}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px 0px",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                    >
                      Name
                    </Typography>
                    <TextField
                      name="name"
                      sx={inputStyle}
                      size="small"
                      placeholder="Jhon Smith"
                      onChange={handleChange}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                    >
                      Email
                    </Typography>
                    <TextField
                      sx={inputStyle}
                      type="email"
                      name="email"
                      size="small"
                      placeholder="jhon@gmail.com"
                      onChange={handleChange}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                    >
                      Mobile
                    </Typography>
                    <PhoneNumber
                      handleChange={handleChange}
                      setRegisterData={setEnquireNow}
                      registerData={enquireNow}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                    >
                      Message
                    </Typography>
                    <TextField
                      sx={inputStyle}
                      name="message"
                      size="small"
                      placeholder="Enter Your Message"
                      onChange={handleChange}
                    />
                  </Box>
                </Box>
                <Button
                  variant="simplebtn"
                  type="submit"
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
              {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "flex-start", md: "space-between" },
                  alignItems: "center",
                  gap: "0px 10px",
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
                    // px: { xs: 2, md: 4 },
                    width: { xs: "90px", sm: "163px" },
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
                      src={google}
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
                    // px: { xs: 2, md: 4 },
                    width: { xs: "110px", sm: "163px" },
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
              </Box> */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: "0px 10px",
                }}
              >
                {/* <Typography
                  sx={{ color: "#939393", textAlign: "left", fontSize: "13px" }}
                >
                  Already have an account ?{" "}
                
                </Typography> */}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Box>
  );
}
