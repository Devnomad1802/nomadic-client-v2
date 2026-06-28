import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateSecureOrderMutation, useConfirmBookingMutation } from "../services";
import Loading from "../SmallComponents/Loading";
import Toastify from "../SmallComponents/Tostify";
import { useSelector } from "react-redux";
import LoginModal from "../Modals/LoginModal";

// Brand tokens — kept consistent with the rest of the website
// (terracotta #CD482A, Inter body + Playfair display headings).
const ACCENT = "#CD482A";
const DISPLAY_FONT = "'Playfair Display','Playfair',serif";
const BODY_FONT = "'Inter',sans-serif";

const inr = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

const BookingOverview = () => {
  const [openL, setOpenL] = useState(false);
  const toggelModelL = () => setOpenL(!openL);

  const { userDbData } = useSelector((store) => store.global);
  const navigate = useNavigate();
  const location = useLocation();

  const { paymentDetail, selectedBatch, selections, totalAmount, coupenDiscount, couponCode, batchIndex } =
    location.state || {};

  // ---------------------------------------------------------------------------
  // Pricing breakdown (display only — the SERVER is the source of truth for the
  // amount actually charged). Order: Base Price -> Discount -> GST -> Final Total.
  // ---------------------------------------------------------------------------
  const calculateBaseAmount = () => {
    let baseAmount = 0;
    if (selections?.quantities) {
      Object.entries(selections.quantities).forEach(([key, quantity]) => {
        if (quantity > 0) {
          const [sectionIndex, itemIndex] = key.split("-");
          const sectionData = JSON.parse(paymentDetail?.addsection || "[]");
          if (sectionData[sectionIndex]?.array?.[itemIndex]) {
            const item = sectionData[sectionIndex].array[itemIndex];
            baseAmount += quantity * (parseInt(item.TitlePrice) || 0);
          }
        }
      });
    }
    return baseAmount;
  };

  const baseAmount = calculateBaseAmount();
  const discountAmount = Number(coupenDiscount) || 0;
  // GST is charged on the discounted base (discount is applied BEFORE GST).
  const gstTax = baseAmount ? (baseAmount - discountAmount) * 0.05 : 0;

  // Transform the data to match expected structure
  const cardData = {
    numberOfTravelers: selections?.quantities
      ? Object.entries(selections.quantities)
          .filter(([key]) => key.startsWith("0-")) // Only count first section (CATEGORY)
          .reduce((sum, [, qty]) => sum + (qty || 0), 0)
      : 0,
    cardDate: {
      batchDate: selectedBatch?.startDate,
      endSelectDate: selectedBatch?.endDate,
      numberOfDays: selectedBatch?.days,
    },
    gstTax,
    cardSectionData: [],
  };

  if (selections?.quantities) {
    Object.entries(selections.quantities).forEach(([key, quantity]) => {
      if (quantity > 0) {
        const [sectionIndex, itemIndex] = key.split("-");
        const sectionData = JSON.parse(paymentDetail?.addsection || "[]");
        if (sectionData[sectionIndex]?.array?.[itemIndex]) {
          cardData.cardSectionData.push({
            ...sectionData[sectionIndex].array[itemIndex],
            quantity,
          });
        }
      }
    });
  }

  if (selections?.toggles) {
    selections.toggles.forEach((key) => {
      const [sectionIndex, itemIndex] = key.split("-");
      const sectionData = JSON.parse(paymentDetail?.addsection || "[]");
      if (sectionData[sectionIndex]?.array?.[itemIndex]) {
        cardData.cardSectionData.push({
          ...sectionData[sectionIndex].array[itemIndex],
          quantity: 1,
        });
      }
    });
  }

  const Total = totalAmount || 0;
  const firstPay = Number(paymentDetail?.firstBookingPrice || 0);
  const balance = Total - firstPay;

  // ---------------------------------------------------------------------------
  // Trip details (top stub of the ticket)
  // ---------------------------------------------------------------------------
  const formatRange = () => {
    const start = cardData?.cardDate?.batchDate;
    const end = cardData?.cardDate?.endSelectDate;
    if (!start || !end) return "—";
    const fmt = (d) =>
      new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return `${fmt(start)} – ${fmt(end)}`;
  };

  const details = [
    { icon: <PlaceOutlinedIcon sx={{ fontSize: 15, color: ACCENT }} />, label: "Location", value: paymentDetail?.location || "—" },
    { icon: <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: ACCENT }} />, label: "Dates", value: formatRange() },
    { icon: <DirectionsWalkIcon sx={{ fontSize: 15, color: ACCENT }} />, label: "Travellers", value: cardData?.numberOfTravelers || 0 },
    { icon: <AccessTimeOutlinedIcon sx={{ fontSize: 15, color: ACCENT }} />, label: "Duration", value: `${paymentDetail?.days || 0}D / ${paymentDetail?.nights || 0}N` },
    { icon: <SwapHorizOutlinedIcon sx={{ fontSize: 16, color: ACCENT }} />, label: "Pick / Drop", value: `${paymentDetail?.pickUp || "—"} – ${paymentDetail?.dropOff || "—"}` },
  ];

  // ---------------------------------------------------------------------------
  // Payment line items — Base items first, then Discount, then GST.
  // ---------------------------------------------------------------------------
  const lineItems = cardData.cardSectionData.flat().map((item) => ({
    label: item?.Title,
    qty: `₹ ${inr(item?.TitlePrice)} × ${item.quantity}`,
    amount: `₹ ${inr(Number(item?.TitlePrice || 0) * item.quantity)}`,
    color: "#3C3228",
  }));
  lineItems.push({
    label: "Discount",
    qty: "",
    amount: `– ₹ ${inr(discountAmount)}`,
    color: "#2E7D4F",
  });
  lineItems.push({
    label: "GST @ 5%",
    qty: "",
    amount: `₹ ${inr(cardData.gstTax)}`,
    color: "#3C3228",
  });

  // ---------------------------------------------------------------------------
  // Payment selection + order flow
  // ---------------------------------------------------------------------------
  const [paymentStatus, setPaymentStatus] = useState("fullPayment");
  const [selectedValue, setSelectedValue] = useState(Total);
  const partial = paymentStatus === "firstPayment";

  const [partialAvailable, setPartialAvailable] = useState(false);

  const pickFull = () => {
    setPaymentStatus("fullPayment");
    setSelectedValue(Total);
  };
  const pickPartial = () => {
    setPaymentStatus("firstPayment");
    setSelectedValue(firstPay);
  };

  const [loading] = useState(false);
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: undefined });
  const showToast = (msg, type) => setAlertState({ open: true, message: msg, severity: type });

  const [createSecureOrder] = useCreateSecureOrderMutation();
  const [confirmBooking] = useConfirmBookingMutation();

  // Secure flow (C1/C2): the SERVER decides the amount and verifies the payment.
  // The browser only sends WHAT was chosen (trip + selections + coupon + batch),
  // never the price, and only the Razorpay receipt codes to confirm.
  const handleOrder = async (event) => {
    event.preventDefault();
    if (!userDbData) {
      setOpenL(true);
      return;
    }

    try {
      const so = await createSecureOrder({
        tripId: paymentDetail?._id,
        quantities: selections?.quantities || {},
        couponCode: couponCode || "",
        batchIndex,
        paymentType: paymentStatus === "firstPayment" ? "firstPayment" : "full",
      }).unwrap();

      if (!so?.orderId || !so?.key) {
        showToast("Payments are temporarily unavailable. Please try again later.", "error");
        return;
      }

      const options = {
        key: so.key, // provided by the server (no client-side key/test fallback)
        amount: so.amount * 100, // server-decided amount, in paise
        currency: so.currency || "INR",
        name: "Nomadic Townies",
        description: "Trip Booking Payment",
        image: "https://i.ibb.co/5Y3m33n/test.png",
        order_id: so.orderId,
        handler: async (response) => {
          try {
            const { data, message } = await confirmBooking({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();
            showToast(message || "Booking confirmed", "success");
            navigate("/paymentsuccess", { state: { data } });
          } catch (err) {
            console.error("confirmBooking failed:", err);
            showToast("Payment received but confirmation failed. Please contact support.", "error");
            navigate("/paymentfail");
          }
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", (resp) => {
        console.error("Payment failed:", resp?.error);
        navigate("/paymentfail");
      });
      rzp1.open();
    } catch (error) {
      console.error("createSecureOrder failed:", error);
      showToast("Could not start payment. Please try again.", "error");
      navigate("/paymentfail");
    }
  };

  // ----------------------- Check User Login -------------------------------
  useEffect(() => {
    if (!userDbData) setOpenL(true);
  }, [userDbData]);

  // ----------------------- Partial-payment window -------------------------
  // Book-now-pay-later is available until 15 days before the batch date.
  useEffect(() => {
    if (cardData?.cardDate?.batchDate && firstPay > 0) {
      const cutoff = new Date(cardData.cardDate.batchDate);
      cutoff.setDate(cutoff.getDate() - 15);
      setPartialAvailable(cutoff > new Date());
    } else {
      setPartialAvailable(false);
    }
  }, [cardData?.cardDate?.batchDate, firstPay]);

  // Keep the selected amount in sync with the recomputed total.
  useEffect(() => {
    if (!partial) setSelectedValue(Total);
  }, [Total, partial]);

  const balanceBy = cardData?.cardDate?.batchDate
    ? new Date(cardData.cardDate.batchDate).toLocaleDateString("en", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  // Selected-card styling helpers
  const cardSx = (active) => ({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    p: "18px",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "14px",
    background: active ? "#FDF1EC" : "#FFFDF9",
    border: active ? `1.5px solid ${ACCENT}` : "1px solid #E6DDCF",
    boxShadow: active ? "0 6px 16px rgba(205,72,42,.16)" : "none",
    transition: "border-color .16s ease, background .16s ease, box-shadow .16s ease",
    "&:hover": { borderColor: ACCENT },
  });

  const dotSx = (active) => ({
    width: 19,
    height: 19,
    borderRadius: "50%",
    border: active ? `6px solid ${ACCENT}` : "2px solid #CDC4B5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: "none",
    transition: "border-color .16s ease",
    "& > span": {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: active ? "#fff" : "transparent",
    },
  });

  return (
    <Box sx={{ background: "#FFFDF9", minHeight: "100vh" }}>
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <LoginModal openL={openL} setOpenL={setOpenL} toggelModelL={toggelModelL} />

      <Box
        sx={{
          minHeight: "100vh",
          px: "clamp(14px,4vw,40px)",
          py: "clamp(20px,4vw,52px)",
          fontFamily: BODY_FONT,
        }}
      >
        <Box sx={{ maxWidth: 740, mx: "auto" }}>
          {/* ---------- Top bar ---------- */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "14px", mb: "clamp(22px,3vw,30px)" }}>
            <Box
              component="button"
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              sx={{
                width: 42,
                height: 42,
                flex: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #D8CDBC",
                background: "#F4EEE4",
                borderRadius: "12px",
                cursor: "pointer",
                fontSize: "19px",
                color: "#221C17",
                transition: "background .16s ease",
                "&:hover": { background: "#DCD2C2" },
              }}
            >
              ←
            </Box>
            <Box
              component="span"
              sx={{
                fontFamily: BODY_FONT,
                fontWeight: 600,
                fontSize: "15px",
                color: "#5A5247",
              }}
            >
              Back to trip details
            </Box>
          </Box>

          {/* ===================== TICKET ===================== */}
          <Box sx={{ position: "relative", filter: "drop-shadow(0 24px 48px rgba(60,42,28,.22))" }}>
            {/* TOP STUB · grey trip header */}
            <Box
              sx={{
                position: "relative",
                background: "linear-gradient(150deg,#54514c,#33312e)",
                borderRadius: "24px 24px 0 0",
                p: "clamp(28px,4vw,40px) clamp(26px,4vw,42px) clamp(34px,4.5vw,44px)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  right: "-40px",
                  top: "-50px",
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "radial-gradient(circle,rgba(233,98,47,.32),transparent 66%)",
                }}
              />
              <Box sx={{ position: "relative" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px" }}>
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 700,
                      fontSize: "12px",
                      lineHeight: 1,
                      letterSpacing: ".2em",
                      textTransform: "uppercase",
                      color: "#F0B49C",
                    }}
                  >
                    Booking overview
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "7px",
                      p: "6px 13px",
                      borderRadius: "99px",
                      background: "rgba(244,238,228,.12)",
                      border: "1px solid rgba(244,238,228,.22)",
                      fontWeight: 600,
                      fontSize: "11px",
                      lineHeight: 1,
                      letterSpacing: ".05em",
                      textTransform: "uppercase",
                      color: "#F4EEE4",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Box component="span" sx={{ width: 7, height: 7, borderRadius: "50%", background: "#5BBF7A" }} />
                    Ready to book
                  </Box>
                </Box>

                <Box
                  component="h1"
                  sx={{
                    m: "16px 0 0",
                    fontFamily: DISPLAY_FONT,
                    fontWeight: 700,
                    fontSize: "clamp(28px,4vw,40px)",
                    lineHeight: 1.04,
                    letterSpacing: "-.02em",
                    color: "#F8F4ED",
                    textWrap: "balance",
                  }}
                >
                  {paymentDetail?.title || "Your trip"}
                </Box>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
                    gap: "20px 16px",
                    mt: "28px",
                  }}
                >
                  {details.map((d, i) => (
                    <Box key={i} sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <Box
                        component="span"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          fontWeight: 600,
                          fontSize: "11px",
                          lineHeight: 1,
                          letterSpacing: ".08em",
                          textTransform: "uppercase",
                          color: "#9C9388",
                        }}
                      >
                        {d.icon}
                        {d.label}
                      </Box>
                      <Box component="span" sx={{ fontWeight: 600, fontSize: "16px", lineHeight: 1.2, color: "#F4EEE4" }}>
                        {d.value}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            {/* PERFORATED SEAM */}
            <Box sx={{ position: "relative", height: 30, background: "#33312e" }}>
              <Box sx={{ position: "absolute", left: "-15px", top: 0, width: 30, height: 30, borderRadius: "50%", background: "#FFFDF9" }} />
              <Box sx={{ position: "absolute", right: "-15px", top: 0, width: 30, height: 30, borderRadius: "50%", background: "#FFFDF9" }} />
              <Box sx={{ position: "absolute", left: "24px", right: "24px", top: "50%", transform: "translateY(-50%)", borderTop: "2px dashed rgba(244,238,228,.30)" }} />
            </Box>

            {/* BOTTOM STUB · payment */}
            <Box
              sx={{
                background: "#FFFDF9",
                borderRadius: "0 0 24px 24px",
                p: "clamp(26px,4vw,38px) clamp(26px,4vw,42px) clamp(28px,4vw,38px)",
              }}
            >
              <Box sx={{ fontWeight: 700, fontSize: "12px", lineHeight: 1, letterSpacing: ".14em", textTransform: "uppercase", color: "#A89C8A", mb: "6px" }}>
                Payment summary
              </Box>

              {lineItems.map((li, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "14px",
                    py: "15px",
                    borderBottom: "1px solid #EFE7DA",
                  }}
                >
                  <Box component="span" sx={{ flex: 1, fontWeight: 600, fontSize: "16px", lineHeight: 1.3, color: "#3C3228" }}>
                    {li.label}
                  </Box>
                  <Box component="span" sx={{ fontWeight: 400, fontSize: "14px", lineHeight: 1.3, color: "#A89C8A", whiteSpace: "nowrap" }}>
                    {li.qty}
                  </Box>
                  <Box component="span" sx={{ minWidth: 104, fontWeight: 600, fontSize: "16px", lineHeight: 1.3, color: li.color, textAlign: "right", whiteSpace: "nowrap" }}>
                    {li.amount}
                  </Box>
                </Box>
              ))}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "14px",
                  mt: "18px",
                  p: "20px 22px",
                  background: "linear-gradient(135deg,#F3F3F3,#EDEDED)",
                  border: "1px solid #E2E2E2",
                  borderRadius: "14px",
                }}
              >
                <Box component="span" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: "clamp(17px,2.2vw,20px)", color: "#3C3228" }}>
                  Total Trip Amount
                </Box>
                <Box component="span" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: "clamp(20px,2.6vw,26px)", color: "#221C17" }}>
                  ₹ {inr(Total)}
                </Box>
              </Box>

              {/* partial note */}
              {partialAvailable && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "12px",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: "16px",
                    p: "16px 20px",
                    background: "#FBF6EE",
                    border: "1px dashed #E0CFBE",
                    borderRadius: "14px",
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Box sx={{ fontWeight: 600, fontSize: "15px", lineHeight: 1.3, color: "#3C3228" }}>
                      Book now, pay the rest later
                    </Box>
                    <Box sx={{ mt: "5px", fontWeight: 400, fontSize: "13px", lineHeight: 1.45, color: "#9A9080" }}>
                      ₹ {inr(balance)} due by <Box component="strong" sx={{ color: "#5A5247" }}>{balanceBy}</Box>
                    </Box>
                  </Box>
                  <Box sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: "clamp(18px,2.2vw,22px)", color: "#2E7D4F", whiteSpace: "nowrap" }}>
                    ₹ {inr(firstPay)}
                  </Box>
                </Box>
              )}

              {/* select amount */}
              <Box sx={{ fontWeight: 700, fontSize: "12px", lineHeight: 1, letterSpacing: ".14em", textTransform: "uppercase", color: "#A89C8A", m: "26px 0 12px" }}>
                Select amount
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: partialAvailable ? { xs: "1fr", sm: "1fr 1fr" } : "1fr",
                  gap: "12px",
                }}
              >
                <Box component="button" type="button" onClick={pickFull} sx={cardSx(!partial)}>
                  <Box component="span" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Box component="span" sx={{ fontWeight: 600, fontSize: "12px", lineHeight: 1, letterSpacing: ".04em", textTransform: "uppercase", color: "#8A8073" }}>
                      Full payment
                    </Box>
                    <Box component="span" sx={dotSx(!partial)}>
                      <span />
                    </Box>
                  </Box>
                  <Box component="span" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: "22px", color: "#221C17" }}>
                    ₹ {inr(Total)}
                  </Box>
                  <Box component="span" sx={{ fontWeight: 400, fontSize: "12px", lineHeight: 1.4, color: "#9A9080" }}>
                    Pay the whole amount today
                  </Box>
                </Box>

                {partialAvailable && (
                  <Box component="button" type="button" onClick={pickPartial} sx={cardSx(partial)}>
                    <Box component="span" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box component="span" sx={{ fontWeight: 600, fontSize: "12px", lineHeight: 1, letterSpacing: ".04em", textTransform: "uppercase", color: "#8A8073" }}>
                        Partial
                      </Box>
                      <Box component="span" sx={dotSx(partial)}>
                        <span />
                      </Box>
                    </Box>
                    <Box component="span" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: "22px", color: "#221C17" }}>
                      ₹ {inr(firstPay)}
                    </Box>
                    <Box component="span" sx={{ fontWeight: 400, fontSize: "12px", lineHeight: 1.4, color: "#9A9080" }}>
                      ₹ {inr(balance)} payable later
                    </Box>
                  </Box>
                )}
              </Box>

              <Box
                component="button"
                type="button"
                onClick={handleOrder}
                sx={{
                  width: "100%",
                  mt: "22px",
                  p: "17px",
                  fontFamily: BODY_FONT,
                  fontWeight: 700,
                  fontSize: "16px",
                  lineHeight: 1,
                  letterSpacing: ".01em",
                  color: "#fff",
                  background: ACCENT,
                  border: "none",
                  borderRadius: "13px",
                  cursor: "pointer",
                  boxShadow: "0 8px 20px rgba(205,72,42,.28)",
                  transition: "transform .18s ease, box-shadow .18s ease, background .18s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 16px 32px rgba(205,72,42,.36)",
                    background: "#B83E21",
                  },
                }}
              >
                Proceed to Pay ₹ {inr(selectedValue)}
              </Box>
              <Box component="p" sx={{ m: "13px 0 0", textAlign: "center", fontWeight: 400, fontSize: "12px", lineHeight: 1.4, color: "#9A9080" }}>
                🔒 You&apos;ll be redirected to the secure payment gateway
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BookingOverview;
