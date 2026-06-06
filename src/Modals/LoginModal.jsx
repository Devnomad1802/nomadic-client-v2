/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, IconButton, Slide, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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
import { baseUrl } from "../utils/api";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
Transition.displayName = "Transition";

/* ── Brand colors ── */
const ACCENT = "#d24b2a";
const ACCENT_DEEP = "#b53c20";
const CHARCOAL = "#3a3632";

/* ── Quotes for left panel ── */
const QUOTES = [
  "You don’t have to be rich to travel well.",
  "The world is yours to explore.",
  "If not now, when?",
  "You need six months vacation twice a year.",
];

/* ── Shared input styles ── */
const inpSx = {
  flex: 1,
  border: "1.5px solid rgba(0,0,0,.12)",
  height: "50px",
  padding: "0 14px",
  background: "#fff",
  fontFamily: "Inter, sans-serif",
  fontSize: "16px",
  color: "#1a1208",
  outline: "none",
  width: "100%",
  borderRadius: "14px",
  transition: "border-color .15s, box-shadow .15s",
};

/* ── OTP Boxes ── */
function OTPBoxes({ otp, setOtp, boxRefs }) {
  const handleInput = (idx, val) => {
    const v = val.replace(/\D/g, "");
    const n = [...otp];
    n[idx] = v ? v[0] : "";
    setOtp(n);
    if (v && idx < 5) boxRefs.current[idx + 1]?.focus();
  };
  const handleKey = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      boxRefs.current[idx - 1]?.focus();
      const n = [...otp]; n[idx - 1] = ""; setOtp(n);
    }
    if (e.key === "ArrowLeft" && idx > 0) boxRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) boxRefs.current[idx + 1]?.focus();
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const p = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "").slice(0, 6);
    const n = ["", "", "", "", "", ""];
    [...p].forEach((c, i) => (n[i] = c));
    setOtp(n);
    boxRefs.current[Math.min(p.length, 5)]?.focus();
  };
  return (
    <Box sx={{ display: "flex", gap: "9px", mb: 2.5 }}>
      {otp.map((v, i) => (
        <input
          key={i}
          ref={(el) => (boxRefs.current[i] = el)}
          maxLength={1}
          inputMode="numeric"
          value={v}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          style={{
            width: 48, height: 56, textAlign: "center",
            fontFamily: "Inter, sans-serif", fontSize: 24, fontWeight: 700,
            color: "#1a1208", border: v ? `2px solid ${ACCENT}40` : "2px solid rgba(0,0,0,.12)",
            background: "#fff", outline: "none", caretColor: "transparent",
            borderRadius: 12, transition: "border-color .15s, box-shadow .15s, transform .1s",
          }}
          onFocus={(e) => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = `0 0 0 4px ${ACCENT}1A`; e.target.style.transform = "translateY(-2px)"; }}
          onBlur={(e) => { e.target.style.borderColor = v ? `${ACCENT}40` : "rgba(0,0,0,.12)"; e.target.style.boxShadow = "none"; e.target.style.transform = "none"; }}
        />
      ))}
    </Box>
  );
}

/* ── Left Panel ── */
function LeftPanel({ qIdx }) {
  return (
    <Box sx={{
      width: { md: "340px" }, flexShrink: 0, display: { xs: "none", md: "flex" },
      flexDirection: "column", overflow: "hidden", position: "relative",
      borderRight: "1px solid rgba(0,0,0,.07)", background: "#fff",
    }}>
      {/* Logo */}
      <Box sx={{ px: 3, pt: 2.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "20px" }}>
          <span style={{ color: ACCENT, fontFamily: "Inter" }}>nomadic</span>
          <span style={{ color: CHARCOAL, fontFamily: "Inter", marginLeft: 5 }}>Townies</span>
        </Typography>
      </Box>

      {/* Quotes */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", px: 3.5, py: 2 }}>
        <Typography sx={{ fontFamily: "Georgia, serif", fontSize: 72, lineHeight: 0.78, color: ACCENT, opacity: 0.9, userSelect: "none", mb: 0.5 }}>
          &ldquo;
        </Typography>
        <Box sx={{ position: "relative", minHeight: 108, width: "100%" }}>
          {QUOTES.map((q, i) => (
            <Typography key={i} sx={{
              position: "absolute", inset: 0, fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: 20, lineHeight: 1.5, color: "#1f1208",
              opacity: i === qIdx ? 1 : 0, transform: i === qIdx ? "translateY(0)" : "translateY(10px)",
              transition: "opacity .55s, transform .55s", display: "flex", alignItems: "center",
            }}>
              {q}
            </Typography>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
          {QUOTES.map((_, i) => (
            <Box key={i} sx={{
              height: 6, borderRadius: 3, transition: "width .35s, background .35s", cursor: "pointer",
              width: i === qIdx ? 22 : 6, background: i === qIdx ? ACCENT : "rgba(0,0,0,.15)",
            }} />
          ))}
        </Box>
      </Box>

      <Typography sx={{ px: 3.5, pb: 1.5, fontSize: 11, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(80,50,30,.42)" }}>
        Travel differently
      </Typography>

      {/* Mountain art placeholder — warm gradient */}
      <Box sx={{ height: 140, flexShrink: 0, background: `linear-gradient(180deg, #fff 0%, rgba(255,220,160,.18) 40%, rgba(210,75,42,.15) 100%)` }} />
    </Box>
  );
}

/* ── Main Component ── */
export default function LoginModal({ openL, setOpenL, setOpens }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleClose = () => { setOpenL(false); resetState(); };

  const [sendEmailOtp] = useSendEmailOtpMutation();
  const [verifyEmailOtp] = useVerifyEmailOtpMutation();
  const [phoneLogin] = usePhoneLoginMutation();
  const [verifyCode] = useVerifySmsCodeMutation();

  const [tab, setTab] = useState("phone");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState("login"); // login | otp | success
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: undefined });
  const boxRefs = useRef([]);
  const [qIdx, setQIdx] = useState(0);

  const showToast = (msg, type) => setAlertState({ open: true, message: msg, severity: type });

  const resetState = () => {
    setStep("login"); setOtp(["", "", "", "", "", ""]);
    setEmail(""); setPhone(""); setTab("phone");
  };

  // Quote rotation
  useEffect(() => {
    const id = setInterval(() => setQIdx((i) => (i + 1) % QUOTES.length), 3800);
    return () => clearInterval(id);
  }, []);

  // OTP timer
  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [timer]);

  // ── Send OTP ──
  const handleContinue = useCallback(async (e) => {
    e?.preventDefault();
    if (tab === "phone" && !phone) return showToast("Please enter phone number", "error");
    if (tab === "email" && !email) return showToast("Please enter your email", "error");
    try {
      setLoading(true);
      if (tab === "email") {
        const res = await sendEmailOtp({ email }).unwrap();
        showToast(res.message, "success");
      } else {
        const data = await phoneLogin({ phone });
        showToast(data?.data?.message || "OTP sent", "success");
      }
      setStep("otp");
      setTimer(300);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => boxRefs.current[0]?.focus(), 100);
    } catch (err) {
      showToast(err?.data?.message || "Failed to send OTP", "error");
    } finally {
      setLoading(false);
    }
  }, [tab, phone, email, sendEmailOtp, phoneLogin]);

  // ── Verify OTP ──
  const handleVerify = useCallback(async (e) => {
    e?.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return showToast("Enter 6-digit OTP", "error");
    try {
      setLoading(true);
      if (tab === "email") {
        const res = await verifyEmailOtp({ email, otp: code }).unwrap();
        localStorage.setItem("token", res.token);
        dispatch(setUserDbData(res.user));
        showToast("Login successful!", "success");
        if (res.isNewUser || !res.user?.name) {
          setOpenL(false); navigate("/complete-profile");
        } else {
          setStep("success");
          setTimeout(() => { setOpenL(false); navigate("/"); }, 2000);
        }
      } else {
        const response = await verifyCode({ phone, result: code });
        localStorage.setItem("token", response?.data?.token);
        dispatch(setUserDbData(response?.data?.user));
        showToast("Login successful!", "success");
        setStep("success");
        setTimeout(() => { setOpenL(false); navigate("/"); }, 2000);
      }
    } catch (err) {
      showToast(err?.data?.message || "Invalid OTP", "error");
      setOtp(["", "", "", "", "", ""]);
      boxRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [tab, otp, email, phone, verifyEmailOtp, verifyCode, dispatch, navigate, setOpenL]);

  const handleGoogleLogin = () => {
    window.location.href = baseUrl + "/auth/auth/google";
  };

  const otpFull = otp.every((v) => v);
  const maskedDisplay = tab === "phone"
    ? `+91 ••••••${(phone || "").slice(-4) || "XXXX"}`
    : email || "your email";

  return (
    <Dialog
      open={openL} TransitionComponent={Transition} keepMounted
      fullWidth maxWidth="md" onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: { xs: "20px", md: "28px" },
          overflow: "hidden", p: 0, m: { xs: 2, md: 4 },
          border: "1px solid rgba(255,255,255,.52)",
          boxShadow: "0 40px 90px rgba(30,12,4,.35), 0 1px 0 rgba(255,255,255,.6) inset",
        },
      }}
    >
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />

      <Box sx={{ display: "flex", minHeight: { xs: "auto", md: "520px" } }}>
        {/* ── Left Panel (desktop only) ── */}
        <LeftPanel qIdx={qIdx} />

        {/* ── Close button ── */}
        <IconButton onClick={handleClose} sx={{
          position: "absolute", top: 14, right: 14, zIndex: 10,
          width: 36, height: 36, border: "1px solid rgba(0,0,0,.1)",
          background: "rgba(255,255,255,.8)", backdropFilter: "blur(8px)",
          "&:hover": { background: "rgba(255,255,255,.95)" },
        }}>
          <CloseIcon sx={{ fontSize: 16, color: "#3a2e22" }} />
        </IconButton>

        {/* ── Right Form ── */}
        <Box sx={{
          flex: 1, px: { xs: 3, md: 5 }, py: { xs: 4, md: 5 },
          display: "flex", flexDirection: "column", justifyContent: "center",
          background: "#fff",
        }}>
          {/* ── SUCCESS STATE ── */}
          {step === "success" && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Box sx={{ width: 68, height: 68, borderRadius: "50%", background: "rgba(31,138,91,.1)", display: "grid", placeItems: "center", mx: "auto", mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 32, color: "#1f8a5b" }} />
              </Box>
              <Typography sx={{ fontSize: 30, fontWeight: 800, color: "#1a1208", mb: 1, fontFamily: "Inter" }}>
                You&apos;re in!
              </Typography>
              <Typography sx={{ fontSize: 15, color: "#7a5a48", lineHeight: 1.55, mb: 3, fontFamily: "Inter" }}>
                Welcome to Nomadic Townies.<br />Let&apos;s find your next adventure.
              </Typography>
            </Box>
          )}

          {/* ── OTP STATE ── */}
          {step === "otp" && (
            <>
              <Button onClick={() => setStep("login")} startIcon={<KeyboardBackspaceIcon />} sx={{
                justifyContent: "flex-start", color: "#9a7060", fontWeight: 600, fontSize: 14,
                textTransform: "none", px: 0, mb: 2, "&:hover": { color: ACCENT, background: "transparent" },
              }}>
                Back
              </Button>
              <Box sx={{ width: 52, height: 52, borderRadius: "14px", display: "grid", placeItems: "center", background: `${ACCENT}1A`, mb: 2 }}>
                <PhoneIphoneOutlinedIcon sx={{ fontSize: 26, color: ACCENT }} />
              </Box>
              <Typography sx={{ fontSize: 28, fontWeight: 800, color: "#1a1208", mb: 0.5, fontFamily: "Inter" }}>
                {tab === "phone" ? "Verify number" : "Verify email"}
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#7a5a48", lineHeight: 1.55, mb: 3, fontFamily: "Inter" }}>
                We sent a 6-digit code to <b>{maskedDisplay}</b>.
              </Typography>

              <OTPBoxes otp={otp} setOtp={setOtp} boxRefs={boxRefs} />

              <Button onClick={handleVerify} fullWidth disabled={!otpFull} sx={{
                height: 50, background: ACCENT, color: "#fff", fontFamily: "Inter", fontSize: 16, fontWeight: 700,
                borderRadius: "999px", textTransform: "none", mb: 2,
                boxShadow: `0 12px 26px -10px ${ACCENT}88`,
                opacity: otpFull ? 1 : 0.45,
                "&:hover": { background: ACCENT_DEEP },
                "&:disabled": { background: ACCENT, color: "#fff", opacity: 0.45 },
              }}>
                Verify &amp; Login
              </Button>

              <Box sx={{ fontSize: 13, color: "#9a7060", fontFamily: "Inter" }}>
                {timer > 0 ? (
                  <span>Resend in <b>{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</b></span>
                ) : (
                  <Button onClick={handleContinue} sx={{ color: ACCENT, textTransform: "none", fontWeight: 700, fontSize: 13, p: 0, textDecoration: "underline", "&:hover": { background: "transparent" } }}>
                    Resend code
                  </Button>
                )}
              </Box>
            </>
          )}

          {/* ── LOGIN STATE ── */}
          {step === "login" && (
            <>
              <Typography sx={{ fontSize: 30, fontWeight: 800, color: "#1a1208", mb: 3, fontFamily: "Inter", letterSpacing: "-0.025em" }}>
                Login
              </Typography>

              {/* Phone / Email toggle */}
              <Box sx={{ display: "flex", p: "4px", mb: 2.5, background: "rgba(0,0,0,.06)", borderRadius: "999px" }}>
                {["phone", "email"].map((t) => (
                  <Button key={t} onClick={() => setTab(t)} sx={{
                    flex: 1, borderRadius: "999px", textTransform: "capitalize",
                    fontFamily: "Inter", fontSize: 15, fontWeight: 600, py: 1.2,
                    color: tab === t ? "#fff" : "#7a7060",
                    background: tab === t ? "rgba(30,20,10,.88)" : "transparent",
                    boxShadow: tab === t ? "0 4px 12px rgba(0,0,0,.18)" : "none",
                    "&:hover": { background: tab === t ? "rgba(30,20,10,.88)" : "rgba(0,0,0,.04)" },
                  }}>
                    {t}
                  </Button>
                ))}
              </Box>

              <form onSubmit={handleContinue}>
                {tab === "phone" ? (
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#3a2e22", mb: 1, fontFamily: "Inter" }}>Phone</Typography>
                    <Box sx={{ display: "flex", gap: "10px" }}>
                      <Box sx={{
                        display: "flex", alignItems: "center", gap: 0.5,
                        background: "#fff", border: "1.5px solid rgba(0,0,0,.12)",
                        height: 50, px: 1.5, borderRadius: "14px", fontFamily: "Inter",
                        fontSize: 15, fontWeight: 600, color: "#1a1208", whiteSpace: "nowrap",
                      }}>
                        +91 <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m2 4.5 4 4 4-4" /></svg>
                      </Box>
                      <input
                        type="tel" inputMode="numeric" value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        style={inpSx}
                        onFocus={(e) => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = `0 0 0 4px ${ACCENT}1A`; }}
                        onBlur={(e) => { e.target.style.borderColor = "rgba(0,0,0,.12)"; e.target.style.boxShadow = "none"; }}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "#3a2e22", mb: 1, fontFamily: "Inter" }}>Email</Typography>
                    <input
                      type="email" value={email} placeholder="you@email.com"
                      onChange={(e) => setEmail(e.target.value)}
                      style={inpSx}
                      onFocus={(e) => { e.target.style.borderColor = ACCENT; e.target.style.boxShadow = `0 0 0 4px ${ACCENT}1A`; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(0,0,0,.12)"; e.target.style.boxShadow = "none"; }}
                    />
                  </Box>
                )}

                <Button type="submit" fullWidth sx={{
                  height: 50, background: ACCENT, color: "#fff", fontFamily: "Inter", fontSize: 16, fontWeight: 700,
                  borderRadius: "999px", textTransform: "none", mb: 2,
                  boxShadow: `0 12px 26px -10px ${ACCENT}88`,
                  "&:hover": { background: ACCENT_DEEP, transform: "translateY(-1px)" },
                }}>
                  Continue
                </Button>
              </form>

              {/* OR divider */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box sx={{ flex: 1, height: "1px", background: "#ede6dc" }} />
                <Typography sx={{ color: "#c0b4a8", fontSize: 13, fontWeight: 600, fontFamily: "Inter" }}>Or</Typography>
                <Box sx={{ flex: 1, height: "1px", background: "#ede6dc" }} />
              </Box>

              {/* Google */}
              <Button onClick={handleGoogleLogin} fullWidth sx={{
                height: 48, background: "#fff", border: "1.5px solid rgba(0,0,0,.1)",
                borderRadius: "999px", fontFamily: "Inter", fontSize: 15, fontWeight: 600,
                color: "#1a1208", textTransform: "none", display: "flex", gap: 1,
                "&:hover": { background: "#fafafa" },
              }}>
                <svg width="19" height="19" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.4l7.9 6.1C12.4 13.3 17.7 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.5 24.6c0-1.7-.2-3.3-.5-4.9H24v9.3h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9C43.8 37.9 46.5 31.7 46.5 24.6z" />
                  <path fill="#FBBC05" d="M10.6 28.5a14.6 14.6 0 0 1 0-9.1L2.7 13.4A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.7 10.6l7.9-6.1z" />
                  <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.4l-7.6-5.9c-2 1.4-4.7 2.2-7.6 2.2-6.3 0-11.6-3.8-13.4-9.4l-7.9 6.1C6.6 42.6 14.6 48 24 48z" />
                </svg>
                Continue with Google
              </Button>

              {/* Terms + Sign up link */}
              <Typography sx={{ mt: 2, fontSize: 11.5, color: "#a09080", textAlign: "center", lineHeight: 1.55, fontFamily: "Inter" }}>
                By continuing you agree to our{" "}
                <a href="/terms-and-conditions" style={{ color: ACCENT, textDecoration: "none" }}>Terms</a> and{" "}
                <a href="/privacy-policy" style={{ color: ACCENT, textDecoration: "none" }}>Privacy Policy</a>.
              </Typography>

              {setOpens && (
                <Typography sx={{ mt: 2, fontSize: 14, color: "#939393", textAlign: "center", fontFamily: "Inter" }}>
                  Don&apos;t have an account?
                  <Button onClick={() => { setOpens(true); setOpenL(false); }} sx={{
                    color: ACCENT, textTransform: "none", fontWeight: 700, fontSize: 14, ml: 0.5,
                  }}>
                    Create One
                  </Button>
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
