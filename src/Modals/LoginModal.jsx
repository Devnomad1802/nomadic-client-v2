/* eslint-disable react/prop-types */
import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Dialog,
  Grid,
  Hidden,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
  Tooltip,
} from "@mui/material";
import { facebook, signUpbg } from "../Images";
import BasicRating from "../SmallComponents/Rating";
import { google } from "../assets/LandingPage";
import { inputStyle } from "../Pages/ContactUs";
import PhoneNumber from "../SmallComponents/PhoneNumber";
import { Link, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Loading from "../SmallComponents/Loading";
import Toastify from "../SmallComponents/Tostify";
import {
  useLoginUserMutation,
  usePhoneLoginMutation,
  useSendMailConfirmationMutation,
  useSendSmsCodeMutation,
  useVerifySmsCodeMutation,
} from "../services/authApis";
import { useDispatch } from "react-redux";
import { setUserDbData } from "../slices";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import AuthCode from "react-auth-code-input";

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

export default function LoginModal({
  openL,
  toggelModelL,
  setOpenL,
  setOpens,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClose = () => setOpenL(false);

  // Auth Api
  const [login] = useLoginUserMutation();
  const [sendMail] = useSendMailConfirmationMutation();
  const [phoneLogin] = usePhoneLoginMutation();
  // Login
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);

  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });

  // Show Toast
  const showToast = (msg, type) => {
    return setAlertState({
      open: true,
      message: msg,
      severity: type,
    });
  };
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleChange = (e) => {
    setSignInData({ ...signInData, [e.target.name]: e.target.value });
  };

  //Login Function
  const handleLogin = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setLoading(true);
        const data = await login(signInData).unwrap();

        localStorage.setItem("token", data?.token);
        showToast(data?.message, "success");
        // If Email Not Verified
        if (!data?.user?.isVerified) {
          const res = await sendMail().unwrap();
          showToast(res?.data?.message, "success");
          navigate("/email-verification", {
            state: { email: data?.user?.email },
          });
        }
        dispatch(setUserDbData(data?.user));
        navigate("/");
        setLoading(false);
        setTimeout(() => {
          setOpenL(false);
        }, [2000]);

        setLoading(false);
      } catch (error) {
        showToast(error?.data?.message, "error");
        console.log(error);
        setLoading(false);
      }
    },
    [dispatch, login, navigate, sendMail, setOpenL, signInData]
  );

  // active login
  const [activeMethord, setActiveMethord] = useState("Email");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(false);
  //Login With Phone
  const handlePhoneLogin = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setLoading(true);
        const data = await phoneLogin(phone); // Pass number inside an object
        // console.log("res....", data);
        showToast(data?.data?.message, "success");
        setOtp(true);

        setLoading(false);
      } catch (error) {
        showToast(error?.data?.message, "error");
        console.log(error);
        setLoading(false);
      }
    },
    [phone, phoneLogin]
  );

  // Auth Code

  const [result, setResult] = useState();
  const handleAtuhCode = (res) => {
    setResult(res);
  };

  const [verifyCode] = useVerifySmsCodeMutation();
  const handleVerifySmsCode = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
        if (result.length < 6) {
          showToast("Invalid Code", "error");
          setLoading(false);
        } else {
          console.log("phone restul ", phone);
          const response = await verifyCode({ phone, result });
          console.log("responce ", response);
            localStorage.setItem("token", response?.data?.token);
            dispatch(setUserDbData(response?.data?.user));
            setLoading(false);
            showToast(`${response?.data?.message}`, "success")
            navigate("/");
            setOpenL(false);
            setOtp(false);
         
        }
      } catch (err) {
        setLoading(false);
      }
    },
    [dispatch, navigate, phone, result, setOpenL, verifyCode]
  );

  const gotoReset = () => {
    navigate("/forget-password");
    setOpenL(false);
  };

  return (
    <Dialog
      open={openL}
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
      <Loading isLoading={loading} />{" "}
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <Box>
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
              <Box
                sx={{ height: "500px", width: "100%", position: "relative" }}
              >
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
                    I had a Kasol Tosh Solo with NT everything was well
                    arranged.
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
              px: 2,
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
              Login
            </Typography>
            {!otp ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    background: "#F7F7F7",
                    borderRadius: "32px",
                    justifyContent: "space-between",
                    gap: "0px 20px",
                  }}
                >
                  <Button
                    onClick={() => {
                      setActiveMethord("Phone");
                    }}
                    sx={{
                      textTransform: "capitalize",
                      minWidth: "140.6px",
                      fontSize: "14px",
                      borderRadius: "32px",
                      fontFamily: "Inter",
                      px: 2,
                      color: activeMethord === "Phone" ? "#fff" : "#CD482A",
                      background:
                        activeMethord === "Phone" ? "#393938" : "#FBFBFB",
                      height: "45px",
                      border: "1.5px solid transparent",

                      width: "100%",
                      "&:hover": {
                        // background: "#393938",
                        color: "#CD482A",
                        border: "1.5px solid #393938",
                      },
                    }}
                  >
                    Phone
                  </Button>
                  <Button
                    onClick={() => {
                      setActiveMethord("Email");
                    }}
                    sx={{
                      textTransform: "capitalize",
                      minWidth: "140.6px",
                      fontSize: "14px",
                      borderRadius: "32px",
                      fontFamily: "Inter",
                      width: "100%",
                      px: 2,
                      color: activeMethord === "Email" ? "#fff" : "#CD482A",
                      background:
                        activeMethord === "Email" ? "#393938" : "#FBFBFB",
                      height: "45px",
                      border: "1.5px solid transparent",
                      "&:hover": {
                        // background: "#393938",
                        color: "#CD482A",
                        border: "1.5px solid #393938",
                      },
                    }}
                  >
                    Email
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <IconButton
                  onClick={() => {
                    setOtp(false);
                  }}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "40px",
                  }}
                >
                  <Tooltip placement="right" title="Back">
                    <KeyboardBackspaceIcon />
                  </Tooltip>
                </IconButton>
              </>
            )}

            {activeMethord === "Email" ? (
              <>
                <form onSubmit={handleLogin}>
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
                        Email
                      </Typography>
                      <TextField
                        required
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
                        Password
                      </Typography>
                      <TextField
                        required
                        sx={inputStyle}
                        size="small"
                        placeholder="#inclu%89Kl.@59"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={handleChange}
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
              </>
            ) : (
              <>
                {otp ? (
                  <>
                    <form onSubmit={handleVerifySmsCode}>
                      <Typography sx={{ color: "#000" }}>
                        Set up two-step verification
                      </Typography>
                      <Typography sx={{ color: "#000" }}>Enter Code</Typography>
                      <AuthCode
                        allowedCharacters="numeric"
                        onChange={handleAtuhCode}
                        containerClassName="custom-container"
                        inputClassName="custom-input"
                        length={6}
                      />
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
                  </>
                ) : (
                  <>
                    <form onSubmit={handlePhoneLogin}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "20px 0px",
                        }}
                      >
                        <Box sx={{ mt: 2 }}>
                          <Typography
                            sx={{ color: "#737373", textAlign: "left", mb: 1 }}
                          >
                            Mobile
                          </Typography>
                          <PhoneNumber
                            handleChange={handleChange}
                            setRegisterData={setPhone}
                            registerData={phone}
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
                  </>
                )}
              </>
            )}

            <Typography sx={{ color: "#A4ACB2" }}>or</Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // mt: 5,
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
                  width: "100%",
                  px: { xs: 2, md: 4 },
                }}
              >
                <img src={google} alt="" srcSet="" style={{ width: "30px" }} />
                <Typography sx={{ color: "#000", textTransform: "lowercase" }}>
                  Google
                </Typography>
              </Button>
            </Box>
            <Button
              onClick={gotoReset}
              sx={{
                textAlign: "left",
                color: "#939393",
                // border: "2px solid red",
                // width: "200px",
              }}
            >
              Rest Password
            </Button>
            <Typography sx={{ color: "#939393", textAlign: "left" }}>
              Don’t have an account yet?
              <Button
                sx={{ color: "#CD482A", marginLeft: "10px" }}
                onClick={() => {
                  setOpens(true);
                  setOpenL(false);
                }}
              >
                Create One
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
