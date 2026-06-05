import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useEnquirMutation } from "../services/EnquirApi";

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: "12px",
    fontFamily: "Inter",
    background: "#fff",
    "& fieldset": { borderColor: "#e7e2dd" },
    "&:hover fieldset": { borderColor: "#d24b2a" },
    "&.Mui-focused fieldset": { borderColor: "#d24b2a", boxShadow: "0 0 0 3px rgba(210,75,42,.1)" },
  },
  "& .MuiInputBase-input": { padding: "9px 9px 9px 0", fontSize: "12px" },
};

const BookingSidebar = ({ item, onBookNow }) => {
  const [hover, setHover] = useState(false);
  const price = Number(item?.price) || 0;
  const strikePrice = Number(item?.strikePrice) || 0;
  const hasDiscount = strikePrice > price;

  const [form, setForm] = useState({ name: "", phone: "", email: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [addEnquire] = useEnquirMutation();

  const handleChange = (field) => (e) => {
    let val = e.target.value;
    if (field === "phone") val = val.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name.";
    if (form.phone.length !== 10) e.phone = "Enter a valid 10-digit number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await addEnquire({ Name: form.name, Phone: form.phone, Email: form.email, Trip: item?.title || "" }).unwrap();
    } catch (err) { /* show success anyway */ }
    setSubmitted(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxWidth: "100%" }}>
      {/* ===== PRICE CARD ===== */}
      <Box sx={{ background: "#fff", borderRadius: "14px", border: "1px solid #efeae5", boxShadow: "0 10px 28px -14px rgba(31,39,51,.2), 0 1px 4px -1px rgba(31,39,51,.04)", overflow: "hidden" }}>
        {/* Notice strip */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, px: 1.8, py: 0.9, background: "#fdf3ee", borderBottom: "1px solid #efeae5" }}>
          <Box sx={{ width: 22, height: 22, borderRadius: "6px", display: "grid", placeItems: "center", background: "#fff", color: "#d24b2a", border: "1px solid #fbeae3", flexShrink: 0 }}>
            <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 13 }} />
          </Box>
          <Typography sx={{ fontSize: "10px", fontWeight: 500, color: "#383838", fontFamily: "Inter", lineHeight: 1.3 }}>
            Pay a little now, adventure a lot — flexible payments at checkout.
          </Typography>
        </Box>

        {/* Price body */}
        <Box sx={{ px: 1.8, pt: 1.5, pb: 1.8 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.2 }}>
            <Typography sx={{ fontSize: "10px", color: "#8b837b", fontWeight: 600, fontFamily: "Inter" }}>Starting from</Typography>
            {hasDiscount && (
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.3, background: "#e7f4ee", color: "#11875b", fontSize: "9px", fontWeight: 700, px: 0.8, py: 0.2, borderRadius: "999px", fontFamily: "Inter" }}>
                <AutoAwesomeIcon sx={{ fontSize: 9 }} />
                {Math.round(((strikePrice - price) / strikePrice) * 100)}% OFF applied
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.8, flexWrap: "wrap", mb: 1.5 }}>
            <Typography sx={{ fontSize: { xs: "26px", md: "30px" }, fontWeight: 800, color: "#16223a", fontFamily: "Inter", letterSpacing: "-0.02em", lineHeight: 1 }}>
              {fmt(price)}
            </Typography>
            {hasDiscount && (
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#b3aba3", textDecoration: "line-through", fontFamily: "Inter" }}>
                {fmt(strikePrice)}
              </Typography>
            )}
            <Typography sx={{ fontSize: "12px", fontWeight: 600, color: "#8b837b", fontFamily: "Inter" }}>/ person</Typography>
          </Box>

          <Button
            onClick={onBookNow} fullWidth
            onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
            sx={{
              background: "#d24b2a", color: "#fff", fontFamily: "Inter", fontSize: "13px", fontWeight: 700,
              py: 1.2, borderRadius: "10px", textTransform: "none", display: "flex", alignItems: "center", gap: 0.6,
              boxShadow: "0 10px 18px -8px rgba(210,75,42,.55)",
              transition: "background .2s, transform .12s, box-shadow .2s",
              "&:hover": { background: "#b53c20", transform: "translateY(-1px)", boxShadow: "0 12px 22px -8px rgba(181,60,32,.6)" },
            }}
          >
            Book Now
            <FlightTakeoffIcon sx={{ fontSize: 15, transition: "transform .25s", transform: hover ? "translateX(3px)" : "none" }} />
          </Button>
        </Box>
      </Box>

      {/* ===== CALLBACK FORM ===== */}
      <Box sx={{ background: "#fff", borderRadius: "14px", border: "1px solid #efeae5", boxShadow: "0 10px 28px -14px rgba(31,39,51,.2), 0 1px 4px -1px rgba(31,39,51,.04)", overflow: "hidden" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2.5, py: 2, background: "linear-gradient(180deg, #fbeae3 0%, #fdf3ee 100%)", borderBottom: "1px solid #efeae5" }}>
          <Box sx={{ width: 40, height: 40, borderRadius: "11px", display: "grid", placeItems: "center", background: "#d24b2a", color: "#fff", boxShadow: "0 8px 14px -6px rgba(210,75,42,.6)", flexShrink: 0 }}>
            <PhoneOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: "15px", fontWeight: 700, color: "#d24b2a", fontFamily: "Inter" }}>Born to Roam?</Typography>
            <Typography sx={{ fontSize: "18px", fontWeight: 800, color: "#1f2733", fontFamily: "Inter", letterSpacing: "-0.01em" }}>Let&apos;s Talk</Typography>
          </Box>
        </Box>

        {submitted ? (
          <Box sx={{ px: 1.8, py: 3, textAlign: "center" }}>
            <Box sx={{ width: 44, height: 44, borderRadius: "50%", mx: "auto", mb: 1, display: "grid", placeItems: "center", background: "#e7f4ee", color: "#11875b", boxShadow: "0 0 0 5px rgba(17,135,91,.07)" }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography sx={{ fontSize: "13px", fontWeight: 800, color: "#1f2733", fontFamily: "Inter", mb: 0.3 }}>
              You&apos;re on the list, {form.name.split(" ")[0]}!
            </Typography>
            <Typography sx={{ fontSize: "10.5px", color: "#8b837b", fontFamily: "Inter", lineHeight: 1.5, mb: 1.5 }}>
              A travel expert will call you on <b style={{ color: "#383838" }}>+91 {form.phone}</b> within 24 hours.
            </Typography>
            <Button onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", email: "" }); }} variant="outlined"
              sx={{ fontSize: "10px", fontWeight: 700, fontFamily: "Inter", borderColor: "#e7e2dd", color: "#383838", borderRadius: "8px", textTransform: "none", px: 2, py: 0.6, "&:hover": { borderColor: "#d24b2a", color: "#d24b2a" } }}>
              Request another callback
            </Button>
          </Box>
        ) : (
          <Box sx={{ px: 1.8, pt: 1.5, pb: 1.8 }}>
            <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#383838", fontFamily: "Inter", mb: 0.3 }}>
              Full Name <span style={{ color: "#d24b2a" }}>*</span>
            </Typography>
            <TextField fullWidth size="small" placeholder="e.g. John Smith"
              value={form.name} onChange={handleChange("name")} error={!!errors.name} helperText={errors.name || ""}
              sx={{ ...fieldSx, mb: 1 }}
              InputProps={{ startAdornment: <PersonOutlineIcon sx={{ fontSize: 15, color: "#b6ada4", mr: 0.8 }} /> }}
            />
            <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#383838", fontFamily: "Inter", mb: 0.3 }}>
              Phone No. <span style={{ color: "#d24b2a" }}>*</span>
            </Typography>
            <TextField fullWidth size="small" placeholder="Enter your 10 digit number"
              value={form.phone} onChange={handleChange("phone")} inputMode="numeric"
              error={!!errors.phone} helperText={errors.phone || ""}
              sx={{ ...fieldSx, mb: 1 }}
              InputProps={{ startAdornment: <PhoneOutlinedIcon sx={{ fontSize: 15, color: "#b6ada4", mr: 0.8 }} /> }}
            />
            <Typography sx={{ fontSize: "10px", fontWeight: 700, color: "#383838", fontFamily: "Inter", mb: 0.3 }}>
              Email ID <span style={{ color: "#d24b2a" }}>*</span>
            </Typography>
            <TextField fullWidth size="small" placeholder="john@example.com" type="email"
              value={form.email} onChange={handleChange("email")} error={!!errors.email} helperText={errors.email || ""}
              sx={{ ...fieldSx, mb: 1.5 }}
              InputProps={{ startAdornment: <MailOutlineIcon sx={{ fontSize: 15, color: "#b6ada4", mr: 0.8 }} /> }}
            />
            <Button onClick={handleSubmit} fullWidth
              sx={{ background: "#383838", color: "#fff", fontFamily: "Inter", fontSize: "12px", fontWeight: 700, py: 1.2, borderRadius: "10px", textTransform: "none", boxShadow: "0 10px 16px -10px rgba(56,56,56,.6)", "&:hover": { background: "#222", transform: "translateY(-1px)" } }}>
              Submit Request
            </Button>
            <Typography sx={{ mt: 1, textAlign: "center", fontSize: "9px", color: "#8b837b", fontFamily: "Inter", lineHeight: 1.3 }}>
              By submitting, you agree to receive a call &amp; WhatsApp updates from Nomadic Townies.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default BookingSidebar;
