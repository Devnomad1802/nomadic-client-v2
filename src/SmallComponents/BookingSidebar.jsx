import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EnquirNow from "../Modals/EnquirNow";

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");

const BookingSidebar = ({ item, onBookNow }) => {
  const [hover, setHover] = useState(false);
  const price = Number(item?.price) || 0;
  const strikePrice = Number(item?.strikePrice) || 0;
  const hasDiscount = strikePrice > price;

  return (
    <Box
      sx={{
        position: { xs: "relative", md: "sticky" },
        top: { md: "24px" },
        display: "flex",
        flexDirection: "column",
        gap: 0,
        background: "#fff",
        borderRadius: "22px",
        border: "1px solid #efeae5",
        boxShadow: "0 18px 44px -22px rgba(31,39,51,.28), 0 2px 8px -2px rgba(31,39,51,.06)",
        overflow: "hidden",
      }}
    >
      {/* Notice strip */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 3,
          py: 1.5,
          background: "#fdf3ee",
          borderBottom: "1px solid #efeae5",
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: "9px",
            display: "grid",
            placeItems: "center",
            background: "#fff",
            color: "#d24b2a",
            border: "1px solid #fbeae3",
            flexShrink: 0,
          }}
        >
          <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />
        </Box>
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 500,
            color: "#383838",
            fontFamily: "Inter",
            lineHeight: 1.4,
          }}
        >
          Partial payment will be enabled on the final payment page.
        </Typography>
      </Box>

      {/* Price body */}
      <Box sx={{ px: 3, pt: 3, pb: 3.5 }}>
        {/* Starting from + discount pill */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
          <Typography sx={{ fontSize: "14px", color: "#8b837b", fontWeight: 600, fontFamily: "Inter" }}>
            Starting from
          </Typography>
          {hasDiscount && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                background: "#e7f4ee",
                color: "#11875b",
                fontSize: "12px",
                fontWeight: 700,
                px: 1.2,
                py: 0.4,
                borderRadius: "999px",
                fontFamily: "Inter",
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 13 }} />
              {Math.round(((strikePrice - price) / strikePrice) * 100)}% OFF
            </Box>
          )}
        </Box>

        {/* Price row */}
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5, flexWrap: "wrap", mb: 2.5 }}>
          <Typography
            sx={{
              fontSize: { xs: "40px", md: "48px" },
              fontWeight: 800,
              color: "#16223a",
              fontFamily: "Inter",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            {fmt(price)}
          </Typography>
          {hasDiscount && (
            <Typography
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                color: "#b3aba3",
                textDecoration: "line-through",
                fontFamily: "Inter",
              }}
            >
              {fmt(strikePrice)}
            </Typography>
          )}
          <Typography sx={{ fontSize: "16px", fontWeight: 600, color: "#8b837b", fontFamily: "Inter" }}>
            / person
          </Typography>
        </Box>

        {/* Book Now CTA */}
        <Button
          onClick={onBookNow}
          fullWidth
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          sx={{
            background: "#d24b2a",
            color: "#fff",
            fontFamily: "Inter",
            fontSize: "18px",
            fontWeight: 700,
            py: 2,
            borderRadius: "16px",
            textTransform: "none",
            display: "flex",
            alignItems: "center",
            gap: 1,
            boxShadow: "0 14px 26px -12px rgba(210,75,42,.65)",
            transition: "background .2s, transform .12s, box-shadow .2s",
            "&:hover": {
              background: "#b53c20",
              transform: "translateY(-1px)",
              boxShadow: "0 18px 30px -12px rgba(181,60,32,.7)",
            },
          }}
        >
          Book Now
          <FlightTakeoffIcon
            sx={{
              fontSize: 20,
              transition: "transform .25s",
              transform: hover ? "translateX(4px)" : "none",
            }}
          />
        </Button>

        {/* Trust note */}
        <Typography
          sx={{
            mt: 2,
            textAlign: "center",
            fontSize: "12px",
            color: "#8b837b",
            fontWeight: 500,
            fontFamily: "Inter",
            lineHeight: 1.5,
          }}
        >
          Free cancellation up to 7 days before departure
        </Typography>

        {/* Enquire section */}
        <Box sx={{ mt: 2 }}>
          <EnquirNow />
        </Box>
      </Box>
    </Box>
  );
};

export default BookingSidebar;
