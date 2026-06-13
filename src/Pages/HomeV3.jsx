/* eslint-disable react/prop-types */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "../Component/Home/homeV3.css";

import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import LayersOutlinedIcon from "@mui/icons-material/LayersOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import TripsV3 from "../Component/Home/TripsV3";
import CategoriesV3 from "../Component/Home/CategoriesV3";
import Reviews from "../Component/Home/Reviews";
import Blog from "../Component/Home/Blog";
import Footer from "../Component/Footer";
import EnquirNow from "../Modals/EnquirNow";

const marqueeTags = [
  "Community Trips", "Backpacking Adventures", "Wellness Retreats", "Yoga Retreats",
  "Cultural Immersions", "Creative Workshops", "Digital Nomad", "Offbeat Getaways",
  "Group Travel", "Festivals & Events",
];

const trustBadges = [
  { icon: <GroupsOutlinedIcon />, title: "5,000+", sub: "Happy Travellers" },
  { icon: <VerifiedUserOutlinedIcon />, title: "100% Safe", sub: "Secure Payments" },
  { icon: <EventAvailableOutlinedIcon />, title: "Free", sub: "Cancellation" },
  { icon: <SupportAgentOutlinedIcon />, title: "24/7", sub: "Expert Support" },
];

const heroTrust = [
  { num: "5,000+", label: "Happy Travellers" },
  { num: "100%", label: "Secure Payments" },
  { num: "24/7", label: "Expert Support" },
  { num: "4.8★", label: "Avg. Rating" },
];

const whyCards = [
  { icon: <LayersOutlinedIcon />, title: "Curated, not collected", text: "Every experience is reviewed and approved by our team. We vet hosts, check quality, and only list what we'd join ourselves." },
  { icon: <GroupsOutlinedIcon />, title: "Community-first, always", text: "These aren't tours with strangers. They're experiences designed around connection — with your host, fellow travellers, and the place itself." },
  { icon: <BoltOutlinedIcon />, title: "Transformative, not transactional", text: "We don't sell packages. We surface moments. The kind that change how you see the world — and yourself. Founded in Pune, 2020." },
];

const hostPerks = [
  { title: "Zero listing fees", text: "Pay a commission only when you get a confirmed booking." },
  { title: "Built-in audience", text: "5,000+ travellers actively searching — right now." },
  { title: "Tools that travel", text: "Bookings, payments, updates and communication — all in one place." },
];

const HomeV3 = ({ homebg, homeVideo, toggle }) => {
  const navigate = useNavigate();
  const [opene, setOpene] = useState(false);
  const toggelModele = () => setOpene(!opene);
  const heroImg = Array.isArray(homebg) ? homebg[0] : homebg;

  return (
    <div className="ntv3">
      <Helmet>
        <title>Curated Travel Experiences &amp; Community Trips | Nomadic Townies</title>
        <meta name="description" content="Nomadic Townies is a curated marketplace for transformative travel experiences — community trips, wellness retreats, cultural immersions &amp; workshops hosted by passionate communities. Join 5000+ travelers." />
        <link rel="canonical" href="https://nomadictownies.com/" />
        <meta property="og:title" content="Curated Travel Experiences &amp; Community Trips | Nomadic Townies" />
        <meta property="og:description" content="A curated marketplace for transformative travel experiences hosted by passionate communities across India and the world." />
        <meta property="og:url" content="https://nomadictownies.com/" />
        <meta property="og:type" content="website" />
      </Helmet>

      <EnquirNow opene={opene} setOpene={setOpene} toggelModele={toggelModele} />

      {/* ── HERO ── */}
      <section className="hero">
        {toggle && homeVideo ? (
          <video className="hero-media" src={homeVideo} autoPlay muted loop playsInline />
        ) : heroImg ? (
          <img className="hero-media" src={heroImg} alt="Nomadic Townies experiences" />
        ) : (
          <div className="hero-media" style={{ background: "linear-gradient(145deg,#1a1410,#2c2018 40%,#3d2b1a 70%,#1a1208)" }} />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="wrap">
            <div className="hero-badge"><span />Curated marketplace for transformative travel</div>
            <h1 className="hero-h1">The way to <em>experience</em><br />the world.</h1>
            <p className="hero-sub">
              Discover breathtaking destinations, community trips, wellness retreats and cultural
              immersions — run by passionate independent hosts. Not a tour operator. A marketplace
              built for real travel.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-orange btn-xl" onClick={() => setOpene(true)}>
                Enquire Now <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </button>
              <button
                className="btn btn-lg"
                style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,.3)", backdropFilter: "blur(6px)" }}
                onClick={() => navigate("/all-packages")}
              >
                Explore All Packages
              </button>
            </div>
            <div className="hero-trust">
              {heroTrust.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <div>
                    <div className="hero-trust-num">{t.num}</div>
                    <div className="hero-trust-label">{t.label}</div>
                  </div>
                  {i < heroTrust.length - 1 && <div className="hero-trust-div" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-strip">
        <div className="marquee-inner">
          {[...marqueeTags, ...marqueeTags].map((tag, i) => (
            <span className="marquee-tag" key={i}><span className="marquee-dot" />{tag}</span>
          ))}
        </div>
      </div>

      {/* ── TRUST BADGES BAR ── */}
      <div className="trust-bar">
        <div className="wrap">
          <div className="trust-items">
            {trustBadges.map((b, i) => (
              <div key={i} style={{ display: "contents" }}>
                <div className="trust-item">
                  <div className="trust-item-icon">{b.icon}</div>
                  <div>
                    <div className="trust-item-title">{b.title}</div>
                    <div className="trust-item-sub">{b.sub}</div>
                  </div>
                </div>
                {i < trustBadges.length - 1 && <div className="trust-divider" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── UPCOMING TRIPS (live, design cards) ── */}
      <TripsV3 />

      {/* ── CATEGORIES (live, design cards) ── */}
      <CategoriesV3 />

      {/* ── WHY NOMADIC TOWNIES ── */}
      <section className="section" style={{ background: "#fff" }}>
        <div className="wrap">
          <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 52px" }}>
            <div className="section-label" style={{ justifyContent: "center" }}>
              <span className="section-label-bar" />Why Nomadic Townies<span className="section-label-bar" />
            </div>
            <h2 className="section-h">Not just another travel site.</h2>
            <p className="section-sub">Most platforms sell you a package. We help you find an experience. Real hosts. Real communities. Real transformation.</p>
          </div>
          <div className="why-grid">
            {whyCards.map((c, i) => (
              <div className="why-card" key={i}>
                <div className="why-ic">{c.icon}</div>
                <h3 className="why-title">{c.title}</h3>
                <p className="why-text">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="section" style={{ background: "var(--orange-tint)", position: "relative", overflow: "hidden" }}>
        <div className="wrap">
          <div className="about-grid">
            <div>
              <div className="section-label"><span className="section-label-bar" />About Us</div>
              <h2 className="section-h" style={{ marginBottom: 16 }}>
                Hey Explorer,<br />
                <em style={{ fontFamily: "var(--playfair)", fontStyle: "italic", color: "var(--orange)" }}>Welcome to Nomadic Townies!</em>
              </h2>
              <p style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.7, marginBottom: 16 }}>
                Ever wondered how it all began? Let's rewind to 2020 — Pune, India. Amid dreams and
                wanderlust, a group of passionate friends came together with one mission: to make
                travel more meaningful, mindful, and accessible for everyone.
              </p>
              <p style={{ fontSize: 16, color: "var(--text)", lineHeight: 1.7, marginBottom: 28 }}>
                We're a curated marketplace for transformative travel experiences — not a tour
                operator, not a travel agency. A platform where passionate independent hosts bring
                their best experiences to people who are ready to be changed by travel.
              </p>
              <button className="btn btn-orange btn-md" onClick={() => navigate("/about-us")}>More About Us</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div className="about-circle">
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--playfair)", fontSize: 48, fontWeight: 800, color: "var(--orange)", lineHeight: 1 }}>NT</div>
                  <div style={{ fontFamily: "var(--playfair)", fontSize: 14, color: "var(--text)", marginTop: 8, fontStyle: "italic" }}>Since 2020 · Pune</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS (live) ── */}
      <Reviews />

      {/* ── BLOG (live) ── */}
      <Blog />

      {/* ── HOST BAND ── */}
      <section className="host-band">
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(145deg,#1a1208 0%,#2c2018 60%,#1a0e06 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(90deg,rgba(20,15,8,.96) 42%,rgba(20,15,8,.6) 100%)" }} />
        <div className="wrap" style={{ position: "relative", zIndex: 2 }}>
          <div className="host-grid">
            <div>
              <div className="section-label" style={{ color: "#f0b59f" }}>
                <span style={{ width: 22, height: 2, background: "#f0b59f", borderRadius: 2, display: "block" }} />
                For hosts &amp; organizers
              </div>
              <h2 style={{ fontFamily: "var(--playfair)", color: "#fff", fontSize: "clamp(26px,3.5vw,46px)", fontWeight: 700, margin: "14px 0 16px", lineHeight: 1.1, letterSpacing: "-.02em" }}>
                Your community is already<br />out there.
                <em style={{ color: "#f0b59f", fontStyle: "italic" }}> Let&apos;s bring them to you.</em>
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", lineHeight: 1.65, maxWidth: 500, marginBottom: 32 }}>
                You run the experience. We bring the audience. List once — reach thousands of
                travellers actively looking for what you offer. Zero listing fees. Pay only when you
                fill seats.
              </p>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                <button className="btn btn-orange btn-lg" onClick={() => setOpene(true)}>Start Hosting</button>
                <button className="btn btn-lg" style={{ background: "rgba(255,255,255,.1)", color: "rgba(255,255,255,.9)", border: "1.5px solid rgba(255,255,255,.22)" }} onClick={() => setOpene(true)}>How It Works</button>
              </div>
            </div>
            <div className="host-perks">
              {hostPerks.map((p, i) => (
                <div className="host-perk" key={i}>
                  <CheckCircleIcon sx={{ color: "#5fcf9b", flexShrink: 0, mt: "2px", fontSize: 22 }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 3 }}>{p.title}</div>
                    <div style={{ fontSize: 13.5, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>{p.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="cta-band">
        <div className="wrap">
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.15)", color: "rgba(255,255,255,.9)", fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,.25)", marginBottom: 24 }}>
            Join 5,000+ community travellers
          </span>
          <h2 style={{ fontFamily: "var(--playfair)", color: "#fff", fontSize: "clamp(28px,4vw,54px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-.02em", marginBottom: 16 }}>
            Your next experience is waiting.
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,.82)", lineHeight: 1.6, maxWidth: 500, margin: "0 auto 36px" }}>
            Stop scrolling for travel inspiration. Start finding experiences designed to actually change you.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-lg" style={{ background: "#fff", color: "var(--orange)", fontWeight: 700, boxShadow: "0 6px 20px rgba(0,0,0,.2)" }} onClick={() => navigate("/all-packages")}>Explore All Packages</button>
            <button className="btn btn-lg" style={{ background: "rgba(255,255,255,.12)", color: "#fff", border: "1.5px solid rgba(255,255,255,.3)" }} onClick={() => setOpene(true)}>Enquire Now</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomeV3;
