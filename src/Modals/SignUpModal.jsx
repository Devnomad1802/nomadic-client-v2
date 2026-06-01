/* eslint-disable react/prop-types */
import * as React from "react";
import {
  Box, Button, Typography, Dialog, Grid, Hidden,
  IconButton, Slide, TextField,
} from "@mui/material";
import { google } from "../assets/LandingPage";
import { inputStyle } from "../Pages/ContactUs";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import LoginModal from "./LoginModal";
import { useState, useCallback } from "react";
import Loading from "../SmallComponents/Loading";
import Toastify from "../SmallComponents/Tostify";
import { useSendEmailOtpMutation, useVerifyEmailOtpMutation, useRegisterUserMutation } from "../services/authApis";
import { useDispatch, useSelector } from "react-redux";
import { setUserDbData } from "../slices";
import { useNavigate } from "react-router-dom";
import AuthCode from "react-auth-code-input";
import { baseUrl } from "../utils/api";

const Transition = React.forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});
Transition.displayName = "Transition";

export default function SignUpModal({ opens, setOpens }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.global.userDbData);
  const handleClose = () => setOpens(false);

  const [openL, setOpenL] = useState(false);
  const [sendEmailOtp] = useSendEmailOtpMutation();
  const [verifyEmailOtp] = useVerifyEmailOtpMutation();
  

  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=details
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
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
      setStep(2);
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
      if (res.user?.name) {
        localStorage.setItem("token", res.token);
        dispatch(setUserDbData(res.user));
        showToast("Login successful!", "success");
        setLoading(false);
        setTimeout(() => { setOpens(false); navigate("/"); }, 1000);
      } else {
        localStorage.setItem("token", res.token);
        setStep(3);
        setLoading(false);
      }
    } catch (err) {
      showToast(err?.data?.message || "Invalid OTP", "error");
      setLoading(false);
    }
  }, [email, otpCode, verifyEmailOtp, dispatch, navigate, setOpens]);

  const handleCompleteProfile = useCallback(async (e) => {
    e.preventDefault();
    if (!name) return showToast("Please enter your name", "error");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(baseUrl + "/auth/editUser", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ userId: user?._id, name, phone }),
      });
      const data = await res.json();
      dispatch(setUserDbData({ ...user, name, phone }));
      showToast("Account created!", "success");
      setLoading(false);
      setTimeout(() => { setOpens(false); navigate("/"); }, 1000);
    } catch (err) {
      showToast(err?.data?.message || "Registration failed", "error");
      setLoading(false);
    }
  }, [name, email, phone, register, dispatch, navigate, setOpens]);

  const handleGoogleLogin = () => {
    window.location.href = baseUrl.replace("/api", "") + "/api/auth/auth/google";
  };

  return (
    <Dialog
      open={opens}
      TransitionComponent={Transition}
      keepMounted fullWidth maxWidth="md"
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          zIndex: 100, mx: "auto", p: { xs: 2, md: 4 },
          borderRadius: { xs: "16px", sm: "24px" },
          border: "2px solid #FBFBFB", background: "#FBFBFB",
        },
      }}
    >
      <LoginModal openL={openL} setOpenL={setOpenL} setOpens={setOpens} />
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
        <Hidden mdDown>
          <Grid item xs={12} md={5.5}>
            <Box sx={{
              height: "100%", minHeight: "500px", width: "100%", borderRadius: "16px",
              overflow: "hidden",
              background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", p: 4,
            }}>
              <Typography sx={{ color: "#fff", fontSize: "28px", fontWeight: 700, textAlign: "center", mb: 2 }}>
                Join Nomadic Townies
              </Typography>
              <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", textAlign: "center", lineHeight: 1.6 }}>
                Discover handpicked trips, retreats, and adventures crafted for modern explorers.
              </Typography>
            </Box>
          </Grid>
        </Hidden>
        <Grid item xs={12} md={6} sx={{ p: { xs: 1, sm: 2 }, display: "flex", flexDirection: "column", gap: "20px 0px" }}>
          <Typography sx={{
            fontSize: { xs: "20px", md: "28px" }, color: "#000",
            textAlign: "left", position: "relative",
          }}>
            <IconButton onClick={handleClose} sx={{ position: "absolute", right: "-30px", top: "-20px" }}>
              <CloseIcon sx={{ color: "#000" }} />
            </IconButton>
            {step === 3 ? "Complete Profile" : "Create Account"}
          </Typography>

          {step === 1 && (
            <>
              <Button onClick={handleGoogleLogin} sx={{
                display: "flex", justifyContent: "center", alignItems: "center",
                background: "#F3F4F6", borderRadius: "16px", gap: "0px 10px",
                width: "100%", py: 1.5,
              }}>
                <img src={google} alt="Google" style={{ width: "24px" }} />
                <Typography sx={{ color: "#000", textTransform: "none", ml: 1 }}>
                  Continue with Google
                </Typography>
              </Button>
              <Typography sx={{ color: "#A4ACB2", textAlign: "center" }}>or</Typography>
              <form onSubmit={handleSendOtp}>
                <Box>
                  <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Email</Typography>
                  <TextField
                    required type="email" sx={inputStyle} size="small"
                    placeholder="your@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Box>
                <Button variant="simplebtn" type="submit" sx={{
                  width: "100%", background: "#EC3F18", color: "#fff", mt: 2,
                }}>
                  Send OTP
                </Button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <IconButton onClick={() => setStep(1)} sx={{ display: "flex", justifyContent: "flex-start", width: "40px" }}>
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
                  Verify
                </Button>
              </form>
              <Button onClick={handleSendOtp} sx={{ color: "#CD482A", textTransform: "none", fontSize: "14px" }}>
                Resend OTP
              </Button>
            </>
          )}

          {step === 3 && (
            <form onSubmit={handleCompleteProfile}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0px" }}>
                <Box>
                  <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Name *</Typography>
                  <TextField required sx={inputStyle} size="small" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                </Box>
                <Box>
                  <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Phone (optional)</Typography>
                  <TextField sx={inputStyle} size="small" placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Box>
              </Box>
              <Button variant="simplebtn" type="submit" sx={{
                width: "100%", background: "#EC3F18", color: "#fff", mt: 2,
              }}>
                Complete Sign Up
              </Button>
            </form>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "0px 10px" }}>
            <Typography sx={{ color: "#939393", textAlign: "left", fontSize: "13px" }}>
              Already have an account?
            </Typography>
            <Button onClick={() => { setOpenL(true); setOpens(false); }}
              variant="simplebtn" sx={{
                background: "#393938", color: "#fff", border: "1px solid #393938",
                "&:hover": { background: "transparent", border: "1px solid #CD482A", color: "#CD482A" },
              }}>
              Login
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Dialog>
  );
}
