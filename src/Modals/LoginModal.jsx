/* eslint-disable react/prop-types */
import React, { useCallback, useState } from "react";
import {
  Box, Button, Typography, Dialog, Grid, Hidden,
  IconButton, Slide, TextField,
} from "@mui/material";
import { signUpbg } from "../Images";
import { google } from "../assets/LandingPage";
import { inputStyle } from "../Pages/ContactUs";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Loading from "../SmallComponents/Loading";
import Toastify from "../SmallComponents/Tostify";
import { useSendEmailOtpMutation, useVerifyEmailOtpMutation } from "../services/authApis";
import { useDispatch } from "react-redux";
import { setUserDbData } from "../slices";
import { useNavigate } from "react-router-dom";
import AuthCode from "react-auth-code-input";
import { baseUrl } from "../utils/api";

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});
Transition.displayName = "Transition";

export default function LoginModal({ openL, setOpenL, setOpens }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClose = () => setOpenL(false);

  const [sendEmailOtp] = useSendEmailOtpMutation();
  const [verifyEmailOtp] = useVerifyEmailOtpMutation();

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: undefined });

  const showToast = (msg, type) => setAlertState({ open: true, message: msg, severity: type });

  const handleSendOtp = useCallback(async (e) => {
    e.preventDefault();
    if (!email) return showToast("Please enter your email", "error");
    try {
      setLoading(true);
      const res = await sendEmailOtp({ email }).unwrap();
      showToast(res.message, "success");
      setOtpSent(true);
      setLoading(false);
    } catch (err) {
      showToast(err?.data?.message || "Failed to send OTP", "error");
      setLoading(false);
    }
  }, [email, sendEmailOtp]);

  const handleVerifyOtp = useCallback(async (e) => {
    e.preventDefault();
    if (otpCode.length < 6) return showToast("Enter 6-digit OTP", "error");
    try {
      setLoading(true);
      const res = await verifyEmailOtp({ email, otp: otpCode }).unwrap();
      localStorage.setItem("token", res.token);
      dispatch(setUserDbData(res.user));
      showToast("Login successful!", "success");
      setLoading(false);
      setTimeout(() => {
        setOpenL(false);
        navigate("/");
      }, 1000);
    } catch (err) {
      showToast(err?.data?.message || "Invalid OTP", "error");
      setLoading(false);
    }
  }, [email, otpCode, verifyEmailOtp, dispatch, navigate, setOpenL]);

  const handleGoogleLogin = () => {
    window.location.href = baseUrl.replace("/api", "") + "/api/auth/auth/google";
  };

  return (
    <Dialog
      open={openL}
      TransitionComponent={Transition}
      keepMounted
      fullWidth
      maxWidth="md"
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          zIndex: 100, mx: "auto", p: { xs: 2, md: 4 },
          borderRadius: { xs: "16px", sm: "24px" },
          border: "2px solid #FBFBFB", background: "#FBFBFB",
        },
      }}
    >
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <Box>
        <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Hidden mdDown>
            <Grid item xs={12} md={5.5}>
              <Box sx={{
                height: "500px", width: "100%", borderRadius: "16px",
                overflow: "hidden", position: "relative",
                background: "linear-gradient(135deg, #CD482A 0%, #FF6B35 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column", p: 4,
              }}>
                <Typography sx={{ color: "#fff", fontSize: "28px", fontWeight: 700, textAlign: "center", mb: 2 }}>
                  Welcome Back!
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", textAlign: "center", lineHeight: 1.6 }}>
                  Login to explore handpicked trips, retreats, and unique experiences.
                </Typography>
              </Box>
            </Grid>
          </Hidden>
          <Grid item xs={12} md={6} sx={{
            px: 2, display: "flex", flexDirection: "column", gap: "20px 0px",
          }}>
            <Typography sx={{
              fontSize: { xs: "20px", md: "28px" }, color: "#000",
              textAlign: "left", position: "relative",
            }}>
              <IconButton onClick={handleClose} sx={{ position: "absolute", right: "-30px", top: "-20px" }}>
                <CloseIcon sx={{ color: "#000" }} />
              </IconButton>
              Login
            </Typography>

            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0px" }}>
                  <Box>
                    <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Email</Typography>
                    <TextField
                      required type="email" sx={inputStyle} size="small"
                      placeholder="your@email.com" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Box>
                </Box>
                <Button variant="simplebtn" type="submit" sx={{
                  width: "100%", background: "#EC3F18", color: "#fff", mt: 2,
                }}>
                  Send OTP
                </Button>
              </form>
            ) : (
              <>
                <IconButton onClick={() => setOtpSent(false)} sx={{ display: "flex", justifyContent: "flex-start", width: "40px" }}>
                  <KeyboardBackspaceIcon />
                </IconButton>
                <form onSubmit={handleVerifyOtp}>
                  <Typography sx={{ color: "#4B5563", mb: 1 }}>
                    OTP sent to <strong>{email}</strong>
                  </Typography>
                  <Typography sx={{ color: "#737373", mb: 2, fontSize: "14px" }}>Enter 6-digit code</Typography>
                  <AuthCode
                    allowedCharacters="numeric"
                    onChange={(val) => setOtpCode(val)}
                    containerClassName="custom-container"
                    inputClassName="custom-input"
                    length={6}
                  />
                  <Button variant="simplebtn" type="submit" sx={{
                    width: "100%", background: "#EC3F18", color: "#fff", mt: 2,
                  }}>
                    Verify & Login
                  </Button>
                </form>
                <Button onClick={handleSendOtp} sx={{ color: "#CD482A", textTransform: "none", fontSize: "14px" }}>
                  Resend OTP
                </Button>
              </>
            )}

            <Typography sx={{ color: "#A4ACB2", textAlign: "center" }}>or</Typography>

            <Button onClick={handleGoogleLogin} sx={{
              display: "flex", justifyContent: "center", alignItems: "center",
              background: "#F3F4F6", borderRadius: "16px", gap: "0px 10px",
              width: "100%", px: { xs: 2, md: 4 }, py: 1.5,
            }}>
              <img src={google} alt="Google" style={{ width: "24px" }} />
              <Typography sx={{ color: "#000", textTransform: "none", ml: 1 }}>
                Continue with Google
              </Typography>
            </Button>

            <Typography sx={{ color: "#939393", textAlign: "left" }}>
              Don&apos;t have an account?
              <Button sx={{ color: "#CD482A", ml: 1 }} onClick={() => { setOpens(true); setOpenL(false); }}>
                Sign Up
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
