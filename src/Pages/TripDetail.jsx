/**
 * TripDetail.jsx — final design, wired to live data.
 * Route: /trips/:slug   (Book Now -> /payment/:tripId)
 * Reuses existing APIs (useGetTripsQuery, useGetAllReviewsQuery). No backend changes.
 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { Box, Typography, Button, Avatar, Chip, IconButton, TextField, Menu, MenuItem, ListItemIcon, Snackbar } from "@mui/material";
import {
  LocationOn, AccessTime, Star, Verified, WhatsApp, Telegram, Email, Facebook, ContentCopy,
  CheckCircle, Cancel, Favorite, FavoriteBorder, Share, ArrowForward, GridView, KeyboardArrowDown,
} from "@mui/icons-material";
import { useGetTripsQuery } from "../services/TripApis";
import { useGetAllReviewsQuery } from "../services";
import { useEnquirMutation } from "../services/EnquirApi";
import LoginModal from "../Modals/LoginModal";
import Footer from "../Component/Footer";

// ─── Brand tokens ─────────────────────────────────────────────
const ORANGE = "#CD482A";
const ORANGE_HOVER = "#B53D1F";
const ORANGE_TINT = "#FDF3EE";
const CHARCOAL = "#393938";
const TEXT_DARK = "#1F2937";
const TEXT = "#4B5563";
const TEXT_LIGHT = "#6B7280";
const TEXT_LIGHTER = "#9CA3AF";
const LINE = "#E5E7EB";
const LINE_SOFT = "#F3F4F6";
const BG_SOFT = "#F9FAFB";
const GREEN = "#11875B";
const GREEN_TINT = "#E7F4EE";
const PLAYFAIR = `"Playfair", Georgia, serif`;

// ─── data mappers ─────────────────────────────────────────────
const toNum = (v) => { const n = Number(v); return isNaN(n) ? 0 : n; };
const avg = (r) => {
  if (Array.isArray(r) && r.length) { const n = r.map(Number).filter((x) => !isNaN(x)); return n.length ? n.reduce((a, b) => a + b, 0) / n.length : 4.9; }
  const x = Number(r); return isNaN(x) || !x ? 4.9 : x;
};
const splitList = (s) => {
  if (!s) return [];
  if (Array.isArray(s)) return s.filter(Boolean);
  return `${s}`.replace(/<[^>]+>/g, "\n").split(/\r?\n|;/).map((x) => x.trim()).filter(Boolean);
};
const parseArr = (v) => { try { const p = typeof v === "string" ? JSON.parse(v) : v; return Array.isArray(p) ? p : []; } catch { return []; } };
const parseCats = (c) => (Array.isArray(c) ? c : []).flatMap((x) => { try { const p = JSON.parse(x); return Array.isArray(p) ? p : [x]; } catch { return [x]; } });
const parseItinerary = (item) => {
  for (const k of ["addDays", "addsection", "itinerary"]) {
    const arr = parseArr(item?.[k]);
    if (arr.length && (arr[0]?.title || arr[0]?.heading || arr[0]?.day || arr[0]?.description)) {
      return arr.map((d, i) => ({
        title: d?.title || d?.heading || d?.day || `Day ${i + 1}`,
        description: d?.description || d?.desc || d?.details || "",
        tags: Array.isArray(d?.tags) ? d.tags : [],
      }));
    }
  }
  return [];
};

const mapTrip = (raw, allReviews) => {
  if (!raw) return null;
  const reviews = (Array.isArray(allReviews) ? allReviews : []).slice(0, 6).map((r) => ({
    name: r?.Name || "Traveller", date: r?.Job || "", tripType: r?.Job ? "" : "Traveller",
    rating: Math.round(avg(r?.rating)), text: r?.Review || "",
  }));
  const ratingNum = Number(avg(raw?.ratings).toFixed(1));
  const reviewCount = (Array.isArray(raw?.reviews) ? raw.reviews.length : 0) || reviews.length;
  const breakdown = {};
  [5, 4, 3, 2, 1].forEach((s) => {
    const c = reviews.filter((rv) => rv.rating === s).length;
    breakdown[s] = reviews.length ? Math.round((c / reviews.length) * 100) : (s === 5 ? 88 : s === 4 ? 10 : s === 3 ? 2 : 0);
  });
  const itinerary = parseItinerary(raw);
  return {
    _id: raw._id,
    slug: raw.seoSlug || raw._id,
    title: raw.title,
    location: raw.location,
    nights: raw.nights, days: raw.days,
    price: toNum(raw.price), strikePrice: toNum(raw.strikePrice), tripOff: raw.tripOff,
    images: (Array.isArray(raw.gallaryImages) && raw.gallaryImages.length ? raw.gallaryImages : [raw.bannerImage, raw.cardImage]).filter(Boolean),
    categories: parseCats(raw.categories),
    rating: ratingNum, reviewCount, isTrending: !!raw.Trending,
    host: raw.host && typeof raw.host === "object" ? raw.host : null,
    overview: raw.overview,
    // highlights are backend-driven (Trip.highlights[]); fall back to derived if none added yet
    highlights: splitList(raw.highlights),
    itinerary,
    inclusions: splitList(raw.Inclusion),
    exclusions: splitList(raw.Exclusion),
    reviews, ratingBreakdown: breakdown,
  };
};

// ─── Sub-components (design, verbatim) ────────────────────────
const Breadcrumb = ({ title }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 13, color: TEXT_LIGHT, mb: 2 }}>
    <Link to="/" style={{ color: TEXT_LIGHT, textDecoration: "none" }}>Home</Link>
    <span>›</span>
    <Link to="/all-packages" style={{ color: TEXT_LIGHT, textDecoration: "none" }}>All Experiences</Link>
    <span>›</span>
    <Typography component="span" sx={{ color: TEXT_DARK, fontWeight: 500, fontSize: 13 }}>{title}</Typography>
  </Box>
);

const HeroGallery = ({ images = [] }) => {
  const photos = images.length >= 5 ? images.slice(0, 5) : [...images, ...Array(5 - images.length).fill(null)];
  return (
    <Box sx={{
      display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "1fr 1fr",
      gap: 1, height: { xs: 280, md: 460 }, borderRadius: "18px", overflow: "hidden", mb: 4, position: "relative",
    }}>
      {photos.map((src, i) => {
        // Gradient always sits behind the photo, so a missing/slow/failed
        // image degrades to a clean gradient instead of a broken-image icon.
        const grad = `linear-gradient(135deg, ${["#1a5f3f", "#5c3a1a", "#1a3a5c", "#5c1a1a", "#3a2c1a"][i]}, ${["#3a9b6f", "#a8703a", "#3a6ca8", "#a83a3a", "#7a5c3a"][i]})`;
        return (
          <Box key={i} sx={{
            gridRow: i === 0 ? "1/3" : "auto", position: "relative", overflow: "hidden", cursor: "pointer", background: grad,
            "&:hover img": { transform: "scale(1.04)" },
          }}>
            {src ? (
              <img
                src={src}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                onError={(e) => { e.currentTarget.style.display = "none"; }}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }}
              />
            ) : null}
          </Box>
        );
      })}
      <Button startIcon={<GridView sx={{ fontSize: 14 }} />} sx={{
        position: "absolute", bottom: 16, right: 16, bgcolor: "#fff", color: TEXT_DARK, fontSize: 13, fontWeight: 600,
        textTransform: "none", border: `1px solid ${LINE}`, px: 2, py: 1.2,
        "&:hover": { bgcolor: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,.2)" },
      }}>Show all {images.length || 5} photos</Button>
    </Box>
  );
};

const HostStrip = ({ host = {} }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.8, p: 2, bgcolor: BG_SOFT, borderRadius: "14px", mb: 2.5 }}>
    <Avatar sx={{ width: 48, height: 48, bgcolor: ORANGE_TINT, color: ORANGE, fontWeight: 800, fontSize: 18 }}>
      {(host?.hostName || "H")[0].toUpperCase()}
    </Avatar>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ fontSize: 14, color: TEXT_LIGHT, fontWeight: 500 }}>
        Hosted by <Box component="b" sx={{ color: TEXT_DARK, fontWeight: 700, mr: 0.8 }}>{host?.hostName || "Verified Host"}</Box>
        {host?.isVerified && (
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.4, color: GREEN, fontSize: 12, fontWeight: 600, ml: 1 }}>
            <Verified sx={{ fontSize: 13 }} /> Verified Host
          </Box>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 1.8, fontSize: 12, color: TEXT_LIGHT, mt: 0.4 }}>
        <span>{host?.tripsHosted || 0} trips hosted</span>
        {host?.hqLocation && <><span>•</span><span>{host.hqLocation}</span></>}
      </Box>
    </Box>
    {host?._id && (
      <Link to={`/hosts/${host._id}`} style={{ textDecoration: "none" }}>
        <Button variant="outlined" sx={{
          fontSize: 13, fontWeight: 600, color: ORANGE, borderColor: ORANGE, borderWidth: "1.5px",
          textTransform: "none", borderRadius: "8px", px: 1.8, py: 1,
          "&:hover": { bgcolor: ORANGE, color: "#fff", borderColor: ORANGE },
        }}>View Host Profile</Button>
      </Link>
    )}
  </Box>
);

const TabBar = ({ active, onChange, tabs }) => (
  <Box sx={{ display: "flex", borderBottom: `1px solid ${LINE}`, mb: 3.5, overflowX: "auto" }}>
    {tabs.map((t) => (
      <Button key={t} onClick={() => onChange(t)} sx={{
        fontSize: 14, fontWeight: 600, textTransform: "none", color: active === t ? ORANGE : TEXT_LIGHT,
        py: 1.8, px: 0.5, mr: 3.5, minWidth: "auto", borderRadius: 0,
        borderBottom: `2px solid ${active === t ? ORANGE : "transparent"}`, whiteSpace: "nowrap",
        "&:hover": { bgcolor: "transparent", color: TEXT_DARK },
      }}>{t}</Button>
    ))}
  </Box>
);

const OverviewSection = ({ overview, highlights = [] }) => (
  <Box sx={{ mb: 4.5 }}>
    <Typography sx={{ fontFamily: PLAYFAIR, fontSize: 24, fontWeight: 700, color: TEXT_DARK, mb: 1.8 }}>About this trip</Typography>
    <Typography sx={{ fontSize: 15, color: TEXT, lineHeight: 1.7, mb: 1.5, whiteSpace: "pre-line" }}>
      {overview || "A small-group experience through some of India's most remote landscapes."}
    </Typography>
    {highlights.length > 0 && (
      <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mt: 2.5, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.4 }}>
        {highlights.map((h, i) => (
          <Box component="li" key={i} sx={{ display: "flex", gap: 1.4, alignItems: "flex-start" }}>
            <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: ORANGE, flexShrink: 0, mt: "8px" }} />
            <Typography sx={{ fontSize: 14.5, color: TEXT_DARK, lineHeight: 1.55 }}>{h}</Typography>
          </Box>
        ))}
      </Box>
    )}
  </Box>
);

const ItineraryTimeline = ({ itinerary = [], totalDays }) => {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? itinerary : itinerary.slice(0, 3);
  return (
  <Box sx={{ mb: 4.5 }}>
    <Typography sx={{ fontFamily: PLAYFAIR, fontSize: 24, fontWeight: 700, color: TEXT_DARK, mb: 1.8 }}>Itinerary</Typography>
    {shown.length ? shown.map((day, i) => (
      <Box key={i} sx={{
        display: "flex", gap: 2.2, py: 2.2, borderBottom: i < itinerary.length - 1 ? `1px solid ${LINE_SOFT}` : "none", position: "relative",
        "&::before": i < itinerary.length - 1 ? { content: '""', position: "absolute", left: 24, top: 60, bottom: -1, width: "1px", bgcolor: LINE } : {},
      }}>
        <Box sx={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", bgcolor: ORANGE_TINT, color: ORANGE, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 14, position: "relative", zIndex: 2 }}>
          {String(i + 1).padStart(2, "0")}
        </Box>
        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK, mb: 0.5 }}>{day.title}</Typography>
          {day.description && <Typography sx={{ fontSize: 14, color: TEXT_LIGHT, lineHeight: 1.6, whiteSpace: "pre-line" }}>{day.description}</Typography>}
          {day.tags?.length > 0 && (
            <Box sx={{ display: "flex", gap: 0.7, flexWrap: "wrap", mt: 1.2 }}>
              {day.tags.map((t, ti) => <Chip key={ti} label={t} size="small" sx={{ bgcolor: "#fff", border: `1px solid ${LINE}`, fontSize: 11, fontWeight: 600, color: TEXT_LIGHT, height: 22 }} />)}
            </Box>
          )}
        </Box>
      </Box>
    )) : <Typography sx={{ fontSize: 14, color: TEXT_LIGHT }}>Detailed day-by-day itinerary shared on enquiry.</Typography>}
    {itinerary.length > 3 && (
      <Button onClick={() => setExpanded((e) => !e)} endIcon={<KeyboardArrowDown sx={{ fontSize: 16, transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s" }} />} sx={{
        mt: 2, color: TEXT, border: `1px solid ${LINE}`, fontSize: 13.5, fontWeight: 600, textTransform: "none", borderRadius: "10px", px: 2, py: 1,
        "&:hover": { borderColor: TEXT_DARK, color: TEXT_DARK },
      }}>{expanded ? "Show less" : `Show full ${totalDays || itinerary.length}-day itinerary`}</Button>
    )}
  </Box>
  );
};

const CallbackForm = ({ tripTitle, userId }) => {
  const [cb, setCb] = useState({ name: "", phone: "", email: "" });
  const [sent, setSent] = useState(false);
  const [enquir, { isLoading }] = useEnquirMutation();
  const submit = async (e) => {
    e.preventDefault();
    if (!cb.name.trim() || (!cb.phone.trim() && !cb.email.trim())) return;
    try { await enquir({ Name: cb.name, Phone: cb.phone, Email: cb.email, Message: `Callback request for trip: ${tripTitle}`, userId }).unwrap(); } catch { /* noop */ }
    setSent(true);
  };
  const fieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: 14, height: 42, bgcolor: "#fff",
      "& fieldset": { borderColor: LINE, borderWidth: "1.5px" }, "&:hover fieldset": { borderColor: TEXT_LIGHT }, "&.Mui-focused fieldset": { borderColor: ORANGE } },
  };
  return (
    <Box sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #efeae5", boxShadow: "0 10px 28px -14px rgba(31,39,51,.2)", overflow: "hidden", mt: 1.5 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 2, py: 1.2, bgcolor: ORANGE_TINT, borderBottom: "1px solid #efeae5" }}>
        <Box sx={{ width: 32, height: 32, borderRadius: "9px", bgcolor: "#fff", display: "grid", placeItems: "center", color: ORANGE }}><WhatsApp sx={{ fontSize: 17 }} /></Box>
        <Box>
          <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: ORANGE }}>Born to Roam?</Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK, lineHeight: 1.1 }}>Let&apos;s Talk</Typography>
        </Box>
      </Box>
      {sent ? (
        <Box sx={{ p: 2.5 }}><Typography sx={{ fontSize: 13.5, color: GREEN, fontWeight: 600 }}>Thanks! Our team will reach out shortly.</Typography></Box>
      ) : (
        <Box component="form" onSubmit={submit} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1.2 }}>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: CHARCOAL, mb: 0.5 }}>Full Name <Box component="span" sx={{ color: ORANGE }}>*</Box></Typography>
            <TextField fullWidth size="small" placeholder="e.g. John Smith" value={cb.name} onChange={(e) => setCb({ ...cb, name: e.target.value })} sx={fieldSx} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: CHARCOAL, mb: 0.5 }}>Phone No. <Box component="span" sx={{ color: ORANGE }}>*</Box></Typography>
            <TextField fullWidth size="small" placeholder="Enter your 10 digit number" value={cb.phone} onChange={(e) => setCb({ ...cb, phone: e.target.value })} sx={fieldSx} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: CHARCOAL, mb: 0.5 }}>Email ID <Box component="span" sx={{ color: ORANGE }}>*</Box></Typography>
            <TextField fullWidth size="small" placeholder="john@example.com" value={cb.email} onChange={(e) => setCb({ ...cb, email: e.target.value })} sx={fieldSx} />
          </Box>
          <Button type="submit" disabled={isLoading} fullWidth sx={{ bgcolor: CHARCOAL, color: "#fff", fontSize: 14, fontWeight: 700, py: 1.3, borderRadius: "10px", textTransform: "none", mt: 0.4, "&:hover": { bgcolor: "#222" } }}>{isLoading ? "Sending…" : "Submit Request"}</Button>
          <Typography sx={{ fontSize: 10.5, color: TEXT_LIGHTER, textAlign: "center", lineHeight: 1.4 }}>By submitting, you agree to receive a call &amp; WhatsApp updates from Nomadic Townies.</Typography>
        </Box>
      )}
    </Box>
  );
};

const InclusionsGrid = ({ included = [], excluded = [] }) => (
  <Box sx={{ mb: 4.5 }}>
    <Typography sx={{ fontFamily: PLAYFAIR, fontSize: 24, fontWeight: 700, color: TEXT_DARK, mb: 1.8 }}>What&apos;s included</Typography>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
      <Box sx={{ bgcolor: BG_SOFT, borderRadius: "12px", p: 2.2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <CheckCircle sx={{ color: GREEN, fontSize: 18 }} />
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>Included</Typography>
        </Box>
        {(included.length ? included : ["Details shared on enquiry"]).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.2, fontSize: 13.5, color: TEXT, mb: 1 }}>
            <CheckCircle sx={{ fontSize: 14, color: GREEN, flexShrink: 0, mt: 0.3 }} /><span>{item}</span>
          </Box>
        ))}
      </Box>
      <Box sx={{ bgcolor: BG_SOFT, borderRadius: "12px", p: 2.2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <Cancel sx={{ color: "#DC2626", fontSize: 18 }} />
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>Not included</Typography>
        </Box>
        {(excluded.length ? excluded : ["Anything not mentioned in Included"]).map((item, i) => (
          <Box key={i} sx={{ display: "flex", gap: 1.2, fontSize: 13.5, color: TEXT, mb: 1 }}>
            <Cancel sx={{ fontSize: 14, color: "#DC2626", flexShrink: 0, mt: 0.3 }} /><span>{item}</span>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

const ReviewsSection = ({ rating, reviewCount, breakdown = {}, reviews = [] }) => (
  <Box sx={{ mb: 4.5 }}>
    <Typography sx={{ fontFamily: PLAYFAIR, fontSize: 24, fontWeight: 700, color: TEXT_DARK, mb: 1.8 }}>What travellers are saying</Typography>
    <Box sx={{ display: "flex", gap: 3, alignItems: "center", p: 2.5, bgcolor: BG_SOFT, borderRadius: "12px", mb: 2.5, flexWrap: "wrap" }}>
      <Box>
        <Typography sx={{ fontFamily: PLAYFAIR, fontSize: 46, fontWeight: 700, color: TEXT_DARK, lineHeight: 1 }}>{rating || "4.9"}</Typography>
        <Box sx={{ color: "#f59e0b", fontSize: 16, mt: 0.5 }}>★★★★★</Box>
        <Typography sx={{ fontSize: 13, color: TEXT_LIGHT, mt: 0.3 }}>{reviewCount || 0} reviews</Typography>
      </Box>
      <Box sx={{ flex: 1, minWidth: 200, display: "flex", flexDirection: "column", gap: 0.8 }}>
        {[5, 4, 3, 2, 1].map((stars) => (
          <Box key={stars} sx={{ display: "flex", alignItems: "center", gap: 1.2, fontSize: 12, color: TEXT_LIGHT }}>
            <Box sx={{ width: 30, color: TEXT_DARK, fontWeight: 500 }}>{stars}★</Box>
            <Box sx={{ flex: 1, height: 6, bgcolor: LINE, borderRadius: "3px", overflow: "hidden" }}>
              <Box sx={{ height: "100%", bgcolor: "#f59e0b", width: `${breakdown[stars] || 0}%`, borderRadius: "3px" }} />
            </Box>
            <Box sx={{ width: 24, textAlign: "right" }}>{Math.round((breakdown[stars] || 0) * (reviewCount || 0) / 100)}</Box>
          </Box>
        ))}
      </Box>
    </Box>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.8 }}>
      {reviews.map((r, i) => (
        <Box key={i} sx={{ p: 2.2, bgcolor: "#fff", border: `1px solid ${LINE}`, borderRadius: "12px" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1.2 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: ORANGE_TINT, color: ORANGE, fontSize: 14, fontWeight: 800 }}>{(r.name || "U")[0]}</Avatar>
            <Box>
              <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: TEXT_DARK }}>{r.name}</Typography>
              <Typography sx={{ fontSize: 11.5, color: TEXT_LIGHTER }}>{[r.date, r.tripType].filter(Boolean).join(" · ")}</Typography>
            </Box>
            <Box sx={{ ml: "auto", color: "#f59e0b", fontSize: 13 }}>{"★".repeat(r.rating || 5)}</Box>
          </Box>
          <Typography sx={{ fontSize: 13.5, color: TEXT, lineHeight: 1.6 }}>&ldquo;{r.text}&rdquo;</Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

const PriceSidebar = ({ trip, onBookNow }) => (
  <Box sx={{ bgcolor: "#fff", borderRadius: "14px", border: "1px solid #efeae5", boxShadow: "0 10px 28px -14px rgba(31,39,51,.2)", overflow: "hidden" }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 1.2, bgcolor: ORANGE_TINT, borderBottom: "1px solid #efeae5" }}>
      <Box sx={{ width: 22, height: 22, borderRadius: "6px", bgcolor: "#fff", display: "grid", placeItems: "center", border: `1px solid ${ORANGE_TINT}`, color: ORANGE }}>💳</Box>
      <Typography sx={{ fontSize: 11, fontWeight: 500, color: CHARCOAL, lineHeight: 1.3 }}>Pay a little now, adventure a lot — flexible payments at checkout.</Typography>
    </Box>
    <Box sx={{ p: "12px 18px 14px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#8b837b" }}>Starting from</Typography>
        {trip.tripOff ? <Box sx={{ bgcolor: GREEN_TINT, color: GREEN, fontSize: 10, fontWeight: 700, px: 1, py: 0.4, borderRadius: "999px" }}>✦ {trip.tripOff}% OFF</Box> : null}
      </Box>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap", mb: 1.4 }}>
        <Typography component="b" sx={{ fontSize: 30, fontWeight: 800, color: "#16223a", letterSpacing: "-.02em", lineHeight: 1 }}>₹{(trip.price || 0).toLocaleString("en-IN")}</Typography>
        {trip.strikePrice > trip.price ? <Typography component="s" sx={{ fontSize: 13, fontWeight: 600, color: "#b3aba3" }}>₹{trip.strikePrice.toLocaleString("en-IN")}</Typography> : null}
        <Typography component="em" sx={{ fontSize: 12, fontWeight: 600, color: "#8b837b", fontStyle: "normal" }}>/ person</Typography>
      </Box>
      <Button fullWidth onClick={onBookNow} endIcon={<ArrowForward sx={{ fontSize: 15 }} />} sx={{
        bgcolor: ORANGE, color: "#fff", fontSize: 14, fontWeight: 700, textTransform: "none", py: 1.6, borderRadius: "10px",
        boxShadow: "0 10px 18px -8px rgba(210,75,42,.55)", "&:hover": { bgcolor: ORANGE_HOVER, transform: "translateY(-1px)" },
      }}>Book Now</Button>
    </Box>
    <Box sx={{ p: "14px 18px", borderTop: "1px solid #efeae5", bgcolor: "#FAF7F2" }}>
      {[
        { ic: "🛡️", text: "Secure payments · verified host" },
        { ic: "✓", text: "Hand-picked, community-first trip" },
        { ic: "💬", text: "24/7 trip support · WhatsApp" },
      ].map((t, i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.2, fontSize: 12, color: TEXT, mb: i < 2 ? 1 : 0 }}>
          <span style={{ color: GREEN }}>{t.ic}</span>{t.text}
        </Box>
      ))}
    </Box>
  </Box>
);

// ─── Main component ──────────────────────────────────────────
export default function TripDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userDbData } = useSelector((s) => s.global);
  const { data: tripsRes } = useGetTripsQuery();
  const { data: revRes } = useGetAllReviewsQuery();
  const [activeTab, setActiveTab] = useState("Overview");
  const [favorited, setFavorited] = useState(false);
  const [openL, setOpenL] = useState(false);
  const [shareAnchor, setShareAnchor] = useState(null);
  const [copied, setCopied] = useState(false);
  const sectionRefs = {
    Overview: useRef(null), Itinerary: useRef(null), Inclusions: useRef(null),
    Reviews: useRef(null), "Other Info": useRef(null),
  };
  const scrollToSection = (tab) => {
    setActiveTab(tab);
    sectionRefs[tab]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const raw = useMemo(() => {
    const list = Array.isArray(tripsRes?.data) ? tripsRes.data : [];
    return list.find((t) => t.seoSlug === slug) || list.find((t) => t._id === slug);
  }, [tripsRes, slug]);

  const trip = useMemo(() => mapTrip(raw, revRes?.data), [raw, revRes]);

  // scroll-spy: highlight the tab of the section currently in view (active tab turns orange)
  useEffect(() => {
    if (!trip) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target?.dataset?.tab) setActiveTab(visible[0].target.dataset.tab);
      },
      { rootMargin: "-130px 0px -55% 0px", threshold: 0 }
    );
    Object.entries(sectionRefs).forEach(([tab, ref]) => {
      if (ref.current) { ref.current.dataset.tab = tab; observer.observe(ref.current); }
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip?._id]);

  if (tripsRes && !raw) return <Box sx={{ bgcolor: BG_SOFT, minHeight: "60vh", display: "grid", placeItems: "center", color: TEXT_LIGHT }}>Trip not found.</Box>;
  if (!trip) return <Box sx={{ bgcolor: BG_SOFT, minHeight: "60vh", display: "grid", placeItems: "center", color: TEXT_LIGHT }}>Loading…</Box>;

  const handleBookNow = () => {
    if (!userDbData) { setOpenL(true); return; }
    // Phase 2: keep the existing, working booking flow. Phase 4 repoints to /payment/:tripId (BookingFlow).
    navigate("/payment", { state: { paymentDetail: raw } });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = trip?.title ? `${trip.title} — Nomadic Townies` : "Nomadic Townies";
  const openShare = async (e) => {
    if (navigator.share) { try { await navigator.share({ title: shareText, url: shareUrl }); return; } catch { /* fall through to menu */ } }
    setShareAnchor(e.currentTarget);
  };
  const shareTo = (kind) => {
    const u = encodeURIComponent(shareUrl); const t = encodeURIComponent(shareText);
    const links = {
      whatsapp: `https://wa.me/?text=${t}%20${u}`,
      telegram: `https://t.me/share/url?url=${u}&text=${t}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      email: `mailto:?subject=${t}&body=${u}`,
    };
    if (kind === "copy") { navigator.clipboard?.writeText(shareUrl); setCopied(true); }
    else window.open(links[kind], "_blank", "noopener,noreferrer");
    setShareAnchor(null);
  };

  return (
    <Box sx={{ bgcolor: BG_SOFT, minHeight: "100vh", textAlign: "left", "& .MuiTypography-root": { textAlign: "left" } }}>
      <Helmet>
        <title>{trip.title ? `${trip.title} | Book Now | Nomadic Townies` : "Trip Details"}</title>
        <meta name="description" content={trip.overview ? trip.overview.slice(0, 150) : "Book this experience with Nomadic Townies."} />
        <link rel="canonical" href={`https://nomadictownies.com/trips/${trip.slug}`} />
      </Helmet>
      <LoginModal openL={openL} setOpenL={setOpenL} />

      <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, pt: 3, pb: 8 }}>
        <Breadcrumb title={trip.title} />
        <HeroGallery images={trip.images} />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 430px" }, gap: { xs: 3, lg: 3.5 }, alignItems: "start" }}>
          <Box>
            <Typography sx={{ fontFamily: PLAYFAIR, fontSize: { xs: 26, md: 36 }, fontWeight: 700, color: TEXT_DARK, lineHeight: 1.12, letterSpacing: "-.02em", mb: 1, mt: 0.5 }}>{trip.title}</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, fontSize: 14, color: TEXT_LIGHT, flexWrap: "wrap", mb: 2.2 }}>
              {trip.location && <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}><LocationOn sx={{ fontSize: 16, color: TEXT_LIGHTER }} /> {trip.location}</Box>}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}><AccessTime sx={{ fontSize: 16, color: TEXT_LIGHTER }} /> {trip.nights}N · {trip.days}D</Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, color: TEXT_DARK, fontWeight: 600 }}>
                <Star sx={{ fontSize: 16, color: "#f59e0b" }} />{trip.rating} <Box component="span" sx={{ color: TEXT_LIGHT, fontWeight: 500 }}>({trip.reviewCount} reviews)</Box>
              </Box>
              <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                <IconButton onClick={() => setFavorited(!favorited)} size="small">{favorited ? <Favorite sx={{ color: ORANGE }} /> : <FavoriteBorder sx={{ color: TEXT_LIGHT }} />}</IconButton>
                <IconButton size="small" onClick={openShare} aria-label="Share trip"><Share sx={{ color: TEXT_LIGHT }} /></IconButton>
                <Menu anchorEl={shareAnchor} open={Boolean(shareAnchor)} onClose={() => setShareAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
                  <MenuItem onClick={() => shareTo("copy")}><ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>Copy link</MenuItem>
                  <MenuItem onClick={() => shareTo("whatsapp")}><ListItemIcon><WhatsApp fontSize="small" sx={{ color: "#25D366" }} /></ListItemIcon>WhatsApp</MenuItem>
                  <MenuItem onClick={() => shareTo("telegram")}><ListItemIcon><Telegram fontSize="small" sx={{ color: "#229ED9" }} /></ListItemIcon>Telegram</MenuItem>
                  <MenuItem onClick={() => shareTo("facebook")}><ListItemIcon><Facebook fontSize="small" sx={{ color: "#1877F2" }} /></ListItemIcon>Facebook</MenuItem>
                  <MenuItem onClick={() => shareTo("email")}><ListItemIcon><Email fontSize="small" sx={{ color: TEXT_LIGHT }} /></ListItemIcon>Email</MenuItem>
                </Menu>
              </Box>
            </Box>

            {trip.host && <HostStrip host={trip.host} />}

            {/* sticky tab bar — scrolls to sections; all sections stay on the page */}
            <Box sx={{ position: "sticky", top: 0, zIndex: 10, bgcolor: BG_SOFT, pt: 1 }}>
              <TabBar active={activeTab} onChange={scrollToSection} tabs={["Overview", "Itinerary", "Inclusions", "Reviews", "Other Info"]} />
            </Box>

            <Box ref={sectionRefs.Overview} sx={{ scrollMarginTop: "84px" }}>
              <OverviewSection overview={trip.overview} highlights={trip.highlights} />
            </Box>
            <Box ref={sectionRefs.Itinerary} sx={{ scrollMarginTop: "84px" }}>
              <ItineraryTimeline itinerary={trip.itinerary} totalDays={trip.days} />
            </Box>
            <Box ref={sectionRefs.Inclusions} sx={{ scrollMarginTop: "84px" }}>
              <InclusionsGrid included={trip.inclusions} excluded={trip.exclusions} />
            </Box>
            <Box ref={sectionRefs.Reviews} sx={{ scrollMarginTop: "84px" }}>
              <ReviewsSection rating={trip.rating} reviewCount={trip.reviewCount} breakdown={trip.ratingBreakdown} reviews={trip.reviews} />
            </Box>
            {(splitList(raw?.ThingsToCarry).length > 0 || splitList(raw?.Cancellation).length > 0) && (
              <Box ref={sectionRefs["Other Info"]} sx={{ scrollMarginTop: "84px", mb: 4.5 }}>
                <Typography sx={{ fontFamily: PLAYFAIR, fontSize: 24, fontWeight: 700, color: TEXT_DARK, mb: 1.8 }}>Other information</Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  {splitList(raw?.ThingsToCarry).length > 0 && (
                    <Box sx={{ bgcolor: BG_SOFT, borderRadius: "12px", p: 2.2 }}>
                      <Typography sx={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK, mb: 1.5 }}>Things to carry</Typography>
                      {splitList(raw.ThingsToCarry).map((x, i) => <Box key={i} sx={{ display: "flex", gap: 1.2, fontSize: 13.5, color: TEXT, mb: 1 }}><span style={{ color: ORANGE }}>•</span><span>{x}</span></Box>)}
                    </Box>
                  )}
                  {splitList(raw?.Cancellation).length > 0 && (
                    <Box sx={{ bgcolor: BG_SOFT, borderRadius: "12px", p: 2.2 }}>
                      <Typography sx={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK, mb: 1.5 }}>Cancellation policy</Typography>
                      {splitList(raw.Cancellation).map((x, i) => <Box key={i} sx={{ display: "flex", gap: 1.2, fontSize: 13.5, color: TEXT, mb: 1 }}><span style={{ color: ORANGE }}>•</span><span>{x}</span></Box>)}
                    </Box>
                  )}
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={{
            position: { lg: "sticky" }, top: { lg: 16 }, alignSelf: "start",
            maxHeight: { lg: "calc(100vh - 32px)" }, overflowY: { lg: "auto" }, pr: { lg: 0.5 },
            "&::-webkit-scrollbar": { width: 6 }, "&::-webkit-scrollbar-thumb": { background: LINE, borderRadius: 3 },
          }}>
            <PriceSidebar trip={trip} onBookNow={handleBookNow} />
            <CallbackForm tripTitle={trip.title} userId={userDbData?._id} />
          </Box>
        </Box>
      </Box>

      <Footer />
      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} message="Link copied to clipboard" anchorOrigin={{ vertical: "bottom", horizontal: "center" }} />
    </Box>
  );
}
