/**
 * TripDetail.jsx — final design, wired to live data.
 * Route: /trips/:slug   (Book Now -> /payment/:tripId)
 * Reuses existing APIs (useGetTripsQuery, useGetAllReviewsQuery). No backend changes.
 */
import React, { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { Box, Typography, Button, Avatar, Chip, IconButton } from "@mui/material";
import {
  LocationOn, AccessTime, Star, Verified,
  CheckCircle, Cancel, Favorite, FavoriteBorder, Share, ArrowForward, GridView,
} from "@mui/icons-material";
import { useGetTripsQuery } from "../services/TripApis";
import { useGetAllReviewsQuery } from "../services";
import LoginModal from "../Modals/LoginModal";

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
    highlights: [
      `${raw.nights || "—"}N / ${raw.days || "—"}D curated itinerary`,
      raw.location ? `Explore ${raw.location}` : "Handpicked destinations",
      raw.host?.hostName ? `Hosted by ${raw.host.hostName}` : "Community-first small group",
      "Secure payment & on-trip support",
    ],
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
    <Link to="/all-packages" style={{ color: TEXT_LIGHT, textDecoration: "none" }}>All Packages</Link>
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
      {photos.map((src, i) => (
        <Box key={i} sx={{
          gridRow: i === 0 ? "1/3" : "auto", position: "relative", overflow: "hidden", cursor: "pointer", bgcolor: BG_SOFT,
          "&:hover img": { transform: "scale(1.04)" },
        }}>
          {src ? (
            <img src={src} alt="" loading={i === 0 ? "eager" : "lazy"} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s" }} />
          ) : (
            <Box sx={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${["#1a5f3f", "#5c3a1a", "#1a3a5c", "#5c1a1a", "#3a2c1a"][i]}, ${["#3a9b6f", "#a8703a", "#3a6ca8", "#a83a3a", "#7a5c3a"][i]})` }} />
          )}
        </Box>
      ))}
      <Button startIcon={<GridView sx={{ fontSize: 14 }} />} sx={{
        position: "absolute", bottom: 16, right: 16, bgcolor: "#fff", color: TEXT_DARK, fontSize: 13, fontWeight: 600,
        textTransform: "none", border: `1px solid ${LINE}`, px: 2, py: 1.2,
        "&:hover": { bgcolor: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,.2)" },
      }}>Show all {images.length || 5} photos</Button>
    </Box>
  );
};

const HostStrip = ({ host = {} }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.8, p: 2.2, bgcolor: BG_SOFT, borderRadius: "14px", mb: 4 }}>
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
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mt: 2 }}>
      {highlights.map((h, i) => (
        <Box key={i} sx={{ display: "flex", gap: 1.5, p: 1.8, bgcolor: BG_SOFT, borderRadius: "12px" }}>
          <Box sx={{ width: 34, height: 34, borderRadius: "9px", bgcolor: ORANGE_TINT, color: ORANGE, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Star sx={{ fontSize: 18 }} />
          </Box>
          <Typography sx={{ fontSize: 13.5, color: TEXT_DARK, fontWeight: 500, lineHeight: 1.4 }}>{h}</Typography>
        </Box>
      ))}
    </Box>
  </Box>
);

const ItineraryTimeline = ({ itinerary = [] }) => (
  <Box sx={{ mb: 4.5 }}>
    <Typography sx={{ fontFamily: PLAYFAIR, fontSize: 24, fontWeight: 700, color: TEXT_DARK, mb: 1.8 }}>Day-by-day itinerary</Typography>
    {itinerary.length ? itinerary.map((day, i) => (
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
  </Box>
);

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
    <Box sx={{ p: "16px 18px 18px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#8b837b" }}>Starting from</Typography>
        {trip.tripOff ? <Box sx={{ bgcolor: GREEN_TINT, color: GREEN, fontSize: 10, fontWeight: 700, px: 1, py: 0.4, borderRadius: "999px" }}>✦ {trip.tripOff}% OFF</Box> : null}
      </Box>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap", mb: 1.8 }}>
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

  const raw = useMemo(() => {
    const list = Array.isArray(tripsRes?.data) ? tripsRes.data : [];
    return list.find((t) => t.seoSlug === slug) || list.find((t) => t._id === slug);
  }, [tripsRes, slug]);

  const trip = useMemo(() => mapTrip(raw, revRes?.data), [raw, revRes]);

  if (tripsRes && !raw) return <Box sx={{ bgcolor: BG_SOFT, minHeight: "60vh", display: "grid", placeItems: "center", color: TEXT_LIGHT }}>Trip not found.</Box>;
  if (!trip) return <Box sx={{ bgcolor: BG_SOFT, minHeight: "60vh", display: "grid", placeItems: "center", color: TEXT_LIGHT }}>Loading…</Box>;

  const handleBookNow = () => {
    if (!userDbData) { setOpenL(true); return; }
    // Phase 2: keep the existing, working booking flow. Phase 4 repoints to /payment/:tripId (BookingFlow).
    navigate("/payment", { state: { paymentDetail: raw } });
  };

  return (
    <Box sx={{ bgcolor: BG_SOFT, minHeight: "100vh" }}>
      <Helmet>
        <title>{trip.title ? `${trip.title} | Book Now | Nomadic Townies` : "Trip Details"}</title>
        <meta name="description" content={trip.overview ? trip.overview.slice(0, 150) : "Book this experience with Nomadic Townies."} />
        <link rel="canonical" href={`https://nomadictownies.com/trips/${trip.slug}`} />
      </Helmet>
      <LoginModal openL={openL} setOpenL={setOpenL} />

      <Box sx={{ maxWidth: "1280px", mx: "auto", px: { xs: 2, md: 4 }, pt: 3, pb: 8 }}>
        <Breadcrumb title={trip.title} />
        <HeroGallery images={trip.images} />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 400px" }, gap: { xs: 3, lg: 4.5 }, alignItems: "start" }}>
          <Box>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
              {trip.categories?.map((c, i) => (
                <Chip key={i} label={c} size="small" sx={{ bgcolor: ORANGE_TINT, color: ORANGE, fontSize: 11.5, fontWeight: 700, letterSpacing: ".02em", textTransform: "uppercase", height: 24 }} />
              ))}
              {trip.isTrending && <Chip label="🔥 Trending" size="small" sx={{ bgcolor: GREEN_TINT, color: GREEN, fontSize: 11.5, fontWeight: 700, letterSpacing: ".02em", textTransform: "uppercase", height: 24 }} />}
            </Box>

            <Typography sx={{ fontFamily: PLAYFAIR, fontSize: { xs: 28, md: 38 }, fontWeight: 700, color: TEXT_DARK, lineHeight: 1.1, letterSpacing: "-.02em", mb: 1.8 }}>{trip.title}</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, fontSize: 14, color: TEXT_LIGHT, flexWrap: "wrap", mb: 3 }}>
              {trip.location && <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}><LocationOn sx={{ fontSize: 16, color: TEXT_LIGHTER }} /> {trip.location}</Box>}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}><AccessTime sx={{ fontSize: 16, color: TEXT_LIGHTER }} /> {trip.nights}N · {trip.days}D</Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7, color: TEXT_DARK, fontWeight: 600 }}>
                <Star sx={{ fontSize: 16, color: "#f59e0b" }} />{trip.rating} <Box component="span" sx={{ color: TEXT_LIGHT, fontWeight: 500 }}>({trip.reviewCount} reviews)</Box>
              </Box>
              <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                <IconButton onClick={() => setFavorited(!favorited)} size="small">{favorited ? <Favorite sx={{ color: ORANGE }} /> : <FavoriteBorder sx={{ color: TEXT_LIGHT }} />}</IconButton>
                <IconButton size="small"><Share sx={{ color: TEXT_LIGHT }} /></IconButton>
              </Box>
            </Box>

            {trip.host && <HostStrip host={trip.host} />}
            <TabBar active={activeTab} onChange={setActiveTab} tabs={["Overview", "Itinerary", "Inclusions", "Reviews", "Other Info"]} />

            {activeTab === "Overview" && <OverviewSection overview={trip.overview} highlights={trip.highlights} />}
            {activeTab === "Itinerary" && <ItineraryTimeline itinerary={trip.itinerary} />}
            {activeTab === "Inclusions" && <InclusionsGrid included={trip.inclusions} excluded={trip.exclusions} />}
            {activeTab === "Reviews" && <ReviewsSection rating={trip.rating} reviewCount={trip.reviewCount} breakdown={trip.ratingBreakdown} reviews={trip.reviews} />}
            {activeTab === "Other Info" && <InclusionsGrid included={splitList(raw?.ThingsToCarry)} excluded={splitList(raw?.Cancellation)} />}
          </Box>

          <Box sx={{ position: { lg: "sticky" }, top: { lg: 80 } }}>
            <PriceSidebar trip={trip} onBookNow={handleBookNow} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
