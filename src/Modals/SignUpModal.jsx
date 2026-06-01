/* eslint-disable react/prop-types */
import React, { useState, useCallback } from "react";
import {
  Box, Button, Typography, Dialog, Grid, Hidden,
  IconButton, Slide, TextField,
} from "@mui/material";
import { google } from "../assets/LandingPage";
import { signUpbg } from "../Images";
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

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
Transition.displayName = "Transition";

export default function SignUpModal({ opens, setOpens }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sendEmailOtp] = useSendEmailOtpMutation();
  const [verifyEmailOtp] = useVerifyEmailOtpMutation();
  const [phoneLogin] = usePhoneLoginMutation();
  const [verifySmsCode] = useVerifySmsCodeMutation();

  const [activeMethod, setActiveMethod] = useState("Mobile");
  const [step, setStep] = useState("input"); // "input" | "otp"
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: undefined });

  const showToast = (msg, type) => setAlertState({ open: true, message: msg, severity: type });

  const resetState = () => {
    setStep("input");
    setOtpCode("");
    setEmail("");
    setPhone("");
    setActiveMethod("Mobile");
  };

  const handleClose = () => { setOpens(false); resetState(); };

  const handleAfterAuth = (token, user, isNewUser) => {
    localStorage.setItem("token", token);
    dispatch(setUserDbData(user));
    if (isNewUser || !user?.name) {
      setOpens(false);
      resetState();
      navigate("/complete-profile");
    } else {
      showToast("Login successful!", "success");
      setTimeout(() => { setOpens(false); resetState(); }, 1000);
    }
  };

  const handleSendOtp = useCallback(async (e) => {
    if (e?.preventDefault) e.preventDefault();
    try {
      setLoading(true);
      if (activeMethod === "Email") {
        if (!email) { showToast("Please enter your email", "error"); return; }
        const res = await sendEmailOtp({ email }).unwrap();
        showToast(res.message || "OTP sent!", "success");
      } else {
        if (!phone || phone.length <= 4) { showToast("Please enter a valid phone number", "error"); return; }
        const res = await phoneLogin({ phone }).unwrap();
        showToast(res?.message || "OTP sent!", "success");
      }
      setStep("otp");
    } catch (err) {
      showToast(err?.data?.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  }, [activeMethod, email, phone, sendEmailOtp, phoneLogin]);

  const handleVerifyOtp = useCallback(async (e) => {
    e.preventDefault();
    if (otpCode.length < 6) return showToast("Enter 6-digit OTP", "error");
    try {
      setLoading(true);
      if (activeMethod === "Email") {
        const res = await verifyEmailOtp({ email, otp: otpCode }).unwrap();
        handleAfterAuth(res.token, res.user, res.isNewUser);
      } else {
        const res = await verifySmsCode({ phone, result: otpCode }).unwrap();
        handleAfterAuth(res.token, res.user, res.isNewUser);
      }
    } catch (err) {
      showToast(err?.data?.message || "Invalid OTP", "error");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMethod, email, phone, otpCode, verifyEmailOtp, verifySmsCode, dispatch, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = baseUrl + "/auth/auth/google";
  };

  const tabBtnSx = (active) => ({
    textTransform: "capitalize",
    fontSize: "14px",
    borderRadius: "32px",
    fontFamily: "Inter",
    px: 2,
    width: "100%",
    height: "45px",
    border: "1.5px solid transparent",
    color: active ? "#fff" : "#CD482A",
    background: active ? "#393938" : "#FBFBFB",
    "&:hover": { color: "#CD482A", border: "1.5px solid #393938" },
  });

  return (
    <Dialog
      open={opens} TransitionComponent={Transition} keepMounted
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
                <Typography sx={{ fontSize: "40px", lineHeight: 1 }}>{"“”"}</Typography>
                <Typography sx={{ color: "#4B5563", fontSize: "15px" }}>
                  I had a Kasol Tosh Solo with NT, everything was well arranged.
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", gap: "2px" }}>
                  {"⭐⭐⭐⭐".split("").map((s, i) => (
                    <span key={i} style={{ fontSize: "18px" }}>{s}</span>
                  ))}
                  <span style={{ fontSize: "18px", opacity: 0.3 }}>{"⭐"}</span>
                </Box>
                <Typography sx={{ color: "#CD482A", fontSize: "14px" }}>John Doe</Typography>
              </Box>
              <img src={signUpbg} alt="" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
            </Box>
          </Grid>
        </Hidden>

        <Grid item xs={12} md={6} sx={{ px: 2, display: "flex", flexDirection: "column", gap: "20px 0px" }}>
          <Typography sx={{ fontSize: { xs: "20px", md: "28px" }, color: "#000", textAlign: "left", position: "relative" }}>
            <IconButton onClick={handleClose} sx={{ position: "absolute", right: "-30px", top: "-20px" }}>
              <CloseIcon sx={{ color: "#000" }} />
            </IconButton>
            Login or Sign Up
          </Typography>

          {step === "input" ? (
            <>
              {/* Method tabs */}
              <Box sx={{ display: "flex", background: "#F7F7F7", borderRadius: "32px", justifyContent: "space-between" }}>
                {["Mobile", "Email"].map((method) => (
                  <Button key={method} onClick={() => setActiveMethod(method)} sx={tabBtnSx(activeMethod === method)}>
                    {method}
                  </Button>
                ))}
              </Box>

              <form onSubmit={handleSendOtp}>
                {activeMethod === "Mobile" ? (
                  <Box>
                    <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Mobile Number</Typography>
                    <PhoneNumber
                      setRegisterData={(data) => setPhone(data?.phone || "")}
                      registerData={{ phone }}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Email</Typography>
                    <TextField
                      required type="email" sx={inputStyle} size="small"
                      placeholder="your@email.com" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Box>
                )}
                <Button variant="simplebtn" type="submit" sx={{ width: "100%", background: "#EC3F18", color: "#fff", mt: 2 }}>
                  Continue
                </Button>
              </form>

              <Typography sx={{ color: "#A4ACB2", textAlign: "center" }}>Or</Typography>

              <Button onClick={handleGoogleLogin} sx={{
                display: "flex", justifyContent: "center", alignItems: "center",
                background: "#F3F4F6", borderRadius: "16px", gap: "0px 10px",
                width: "100%", px: { xs: 2, md: 4 }, py: 1.5,
              }}>
                <img src={google} alt="Google" style={{ width: "24px" }} />
                <Typography sx={{ color: "#000", textTransform: "none", ml: 1 }}>Continue with Google</Typography>
              </Button>
            </>
          ) : (
            <>
              <IconButton
                onClick={() => { setStep("input"); setOtpCode(""); }}
                sx={{ display: "flex", justifyContent: "flex-start", width: "40px" }}
              >
                <KeyboardBackspaceIcon />
              </IconButton>
              <form onSubmit={handleVerifyOtp}>
                <Typography sx={{ color: "#4B5563", mb: 1 }}>
                  OTP sent to <strong>{activeMethod === "Email" ? email : phone}</strong>
                </Typography>
                <Typography sx={{ color: "#737373", mb: 2, fontSize: "14px" }}>Enter 6-digit code</Typography>
                <AuthCode
                  key={`${activeMethod}-${step}`}
                  allowedCharacters="numeric"
                  onChange={(val) => setOtpCode(val)}
                  containerClassName="custom-container"
                  inputClassName="custom-input"
                  length={6}
                />
                <Button variant="simplebtn" type="submit" sx={{ width: "100%", background: "#EC3F18", color: "#fff", mt: 2 }}>
                  Verify &amp; Login
                </Button>
              </form>
              <Button onClick={handleSendOtp} sx={{ color: "#CD482A", textTransform: "none", fontSize: "14px" }}>
                Resend OTP
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Dialog>
  );
}
