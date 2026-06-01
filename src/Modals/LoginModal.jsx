/* eslint-disable react/prop-types */
import React, { useCallback, useState } from "react";
import {
  Box, Button, Typography, Dialog, Grid, Hidden,
  IconButton, Slide, TextField, Tooltip,
} from "@mui/material";
import { signUpbg } from "../Images";
import { google } from "../assets/LandingPage";
import { inputStyle } from "../Pages/ContactUs";
import PhoneNumber from "../SmallComponents/PhoneNumber";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Loading from "../SmallComponents/Loading";
import Toastify from "../SmallComponents/Tostify";
import {
  useSendEmailOtpMutation,
  useVerifyEmailOtpMutation,
  usePhoneLoginMutation,
  useVerifySmsCodeMutation,
} from "../services/authApis";
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
  const handleClose = () => { setOpenL(false); resetState(); };

  const [sendEmailOtp] = useSendEmailOtpMutation();
  const [verifyEmailOtp] = useVerifyEmailOtpMutation();
  const [phoneLogin] = usePhoneLoginMutation();
  const [verifyCode] = useVerifySmsCodeMutation();

  const [activeMethod, setActiveMethod] = useState("Phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: undefined });

  const showToast = (msg, type) => setAlertState({ open: true, message: msg, severity: type });

  const resetState = () => {
    setOtpSent(false);
    setOtpCode("");
    setEmail("");
    setPhone("");
    setActiveMethod("Phone");
  };

  // Send Email OTP
  const handleSendEmailOtp = useCallback(async (e) => {
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

  // Verify Email OTP
  const handleVerifyEmailOtp = useCallback(async (e) => {
    e.preventDefault();
    if (otpCode.length < 6) return showToast("Enter 6-digit OTP", "error");
    try {
      setLoading(true);
      const res = await verifyEmailOtp({ email, otp: otpCode }).unwrap();
      localStorage.setItem("token", res.token);
      dispatch(setUserDbData(res.user));
      showToast("Login successful!", "success");
      setLoading(false);
      if (res.isNewUser || !res.user?.name) {
        setOpenL(false);
        navigate("/complete-profile");
      } else {
        setTimeout(() => { setOpenL(false); navigate("/"); }, 1000);
      }
    } catch (err) {
      showToast(err?.data?.message || "Invalid OTP", "error");
      setLoading(false);
    }
  }, [email, otpCode, verifyEmailOtp, dispatch, navigate, setOpenL]);

  // Send Phone OTP
  const handleSendPhoneOtp = useCallback(async (e) => {
    e.preventDefault();
    if (!phone) return showToast("Please enter phone number", "error");
    try {
      setLoading(true);
      const data = await phoneLogin({ phone });
      showToast(data?.data?.message || "OTP sent", "success");
      setOtpSent(true);
      setLoading(false);
    } catch (err) {
      showToast(err?.data?.message || "Failed to send OTP", "error");
      setLoading(false);
    }
  }, [phone, phoneLogin]);

  // Verify Phone OTP
  const handleVerifyPhoneOtp = useCallback(async (e) => {
    e.preventDefault();
    if (otpCode.length < 6) return showToast("Enter 6-digit OTP", "error");
    try {
      setLoading(true);
      const response = await verifyCode({ phone, result: otpCode });
      localStorage.setItem("token", response?.data?.token);
      dispatch(setUserDbData(response?.data?.user));
      showToast("Login successful!", "success");
      setLoading(false);
      setTimeout(() => { setOpenL(false); navigate("/"); }, 1000);
    } catch (err) {
      showToast(err?.data?.message || "Invalid OTP", "error");
      setLoading(false);
    }
  }, [phone, otpCode, verifyCode, dispatch, navigate, setOpenL]);

  const handleGoogleLogin = () => {
    window.location.href = baseUrl + "/auth/auth/google";
  };

  return (
    <Dialog
      open={openL} TransitionComponent={Transition} keepMounted
      fullWidth maxWidth="md" onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          zIndex: 100, mx: "auto", p: { xs: 2, md: 4 },
          borderRadius: { xs: "16px", sm: "24px" },
          border: "2px solid #FBFBFB", background: "#FBFBFB",
          overflowY: "auto",
        },
      }}
    >
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <Box>
        <Grid container sx={{ display: "flex", justifyContent: "space-between" }}>
          <Hidden mdDown>
            <Grid item xs={12} md={5.5} sx={{ height: "auto" }}>
              <Box sx={{ height: "500px", width: "100%", position: "relative" }}>
                <Box sx={{
                  width: "80%", position: "absolute", left: "50%", top: "40%",
                  transform: "translate(-50%, -50%)",
                  display: "flex", justifyContent: "center",
                  flexDirection: "column", gap: "12px 0px", textAlign: "center",
                }}>
                  <Typography sx={{ fontSize: "40px", lineHeight: 1 }}>\u201C\u201D</Typography>
                  <Typography sx={{ color: "#4B5563", fontSize: "15px" }}>
                    I had a Kasol Tosh Solo with NT everything was well arranged.
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
                    {"\u2B50\u2B50\u2B50\u2B50".split("").map((s, i) => (
                      <span key={i} style={{ fontSize: "18px" }}>{s}</span>
                    ))}
                    <span style={{ fontSize: "18px", opacity: 0.3 }}>\u2B50</span>
                  </Box>
                  <Typography sx={{ color: "#CD482A", fontSize: "14px" }}>John Doe</Typography>
                </Box>
                <img src={signUpbg} alt="" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
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
              <>
                {/* Phone / Email Tabs */}
                <Box sx={{
                  display: "flex", background: "#F7F7F7", borderRadius: "32px",
                  justifyContent: "space-between", gap: "0px 20px",
                }}>
                  {["Phone", "Email"].map((method) => (
                    <Button key={method} onClick={() => setActiveMethod(method)} sx={{
                      textTransform: "capitalize", minWidth: "140.6px",
                      fontSize: "14px", borderRadius: "32px", fontFamily: "Inter",
                      px: 2, width: "100%", height: "45px",
                      border: "1.5px solid transparent",
                      color: activeMethod === method ? "#fff" : "#CD482A",
                      background: activeMethod === method ? "#393938" : "#FBFBFB",
                      "&:hover": { color: "#CD482A", border: "1.5px solid #393938" },
                    }}>
                      {method}
                    </Button>
                  ))}
                </Box>

                {activeMethod === "Email" ? (
                  <form onSubmit={handleSendEmailOtp}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0px" }}>
                      <Box>
                        <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Email</Typography>
                        <TextField required type="email" sx={inputStyle} size="small"
                          placeholder="your@email.com" value={email}
                          onChange={(e) => setEmail(e.target.value)} />
                      </Box>
                    </Box>
                    <Button variant="simplebtn" type="submit" sx={{
                      width: "100%", background: "#EC3F18", color: "#fff", mt: 2,
                    }}>Continue</Button>
                  </form>
                ) : (
                  <form onSubmit={handleSendPhoneOtp}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0px" }}>
                      <Box sx={{ mt: 2 }}>
                        <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Phone</Typography>
                        <PhoneNumber setRegisterData={setPhone} registerData={phone} />
                      </Box>
                    </Box>
                    <Button variant="simplebtn" type="submit" sx={{
                      width: "100%", background: "#EC3F18", color: "#fff", mt: 2,
                    }}>Continue</Button>
                  </form>
                )}
              </>
            ) : (
              <>
                <IconButton onClick={() => setOtpSent(false)} sx={{ display: "flex", justifyContent: "flex-start", width: "40px" }}>
                  <Tooltip placement="right" title="Back"><KeyboardBackspaceIcon /></Tooltip>
                </IconButton>
                <form onSubmit={activeMethod === "Email" ? handleVerifyEmailOtp : handleVerifyPhoneOtp}>
                  <Typography sx={{ color: "#4B5563", mb: 1 }}>
                    OTP sent to <strong>{activeMethod === "Email" ? email : phone}</strong>
                  </Typography>
                  <Typography sx={{ color: "#737373", mb: 2, fontSize: "14px" }}>Enter 6-digit code</Typography>
                  <AuthCode allowedCharacters="numeric" onChange={(val) => setOtpCode(val)}
                    containerClassName="custom-container" inputClassName="custom-input" length={6} />
                  <Button variant="simplebtn" type="submit" sx={{
                    width: "100%", background: "#EC3F18", color: "#fff", mt: 2,
                  }}>Verify & Login</Button>
                </form>
                <Button onClick={activeMethod === "Email" ? handleSendEmailOtp : handleSendPhoneOtp}
                  sx={{ color: "#CD482A", textTransform: "none", fontSize: "14px" }}>
                  Resend OTP
                </Button>
              </>
            )}

            <Typography sx={{ color: "#A4ACB2", textAlign: "center" }}>Or</Typography>

            <Button onClick={handleGoogleLogin} sx={{
              display: "flex", justifyContent: "center", alignItems: "center",
              background: "#F3F4F6", borderRadius: "16px", gap: "0px 10px",
              width: "100%", px: { xs: 2, md: 4 }, py: 1.5,
            }}>
              <img src={google} alt="Google" style={{ width: "24px" }} />
              <Typography sx={{ color: "#000", textTransform: "none", ml: 1 }}>Google</Typography>
            </Button>

            <Typography sx={{ color: "#939393", textAlign: "left" }}>
              Don&apos;t have an account?
              <Button sx={{ color: "#CD482A", ml: 1 }} onClick={() => { setOpens(true); setOpenL(false); }}>
                Create One
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
