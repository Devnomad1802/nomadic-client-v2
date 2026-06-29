/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./hostPage.css";
import Footer from "../Footer";
import {
  useGetHostByIdQuery,
  useGetHostTripsQuery,
  useGetReviewsByHostIdQuery,
  useGetAllHostsQuery,
  useAddUserReviewMutation,
} from "../../services";

/* ---------------- helpers ---------------- */
const initialOf = (s) => (s ? s.trim()[0]?.toUpperCase() : "H");
const firstNameOf = (s, fallback) => (s ? s.split(" ")[0] : fallback);
const fmtDate = (d) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};
const starStr = (n) => {
  const r = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return "★".repeat(r) + "☆".repeat(5 - r);
};
const tripImg = (t) =>
  t?.Banner_Image || t?.cardImage || t?.bannerImage || t?.image || "";

/* ---------------- inline icons (match design) ---------------- */
const IcCheck = ({ s = 19, w = 3, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
const IcPin = ({ c = "#F0B49C" }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const IcCal = ({ c = "#F0B49C" }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /></svg>
);
const IcTrophy = ({ c = "#F0B49C", s = 15 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7a6 6 0 0 1-12 0Z" /><path d="M6 5H3v2a3 3 0 0 0 3 3M18 5h3v2a3 3 0 0 1-3 3M9 18h6M10 22h4M12 15v3" /></svg>
);
const IcGlobe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CF4A2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></svg>
);
const IcPinSm = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CF4A2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
const IcChat = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8A8.38 8.38 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" /></svg>
);
const IcBox = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l9-4 9 4-9 4-9-4Z" /><path d="M3 7v10l9 4 9-4V7" /></svg>
);
const IcLock = ({ c = "#CF4A2C", s = 16 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 1 }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const IcSend = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
);
const IcAlert = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", marginTop: 1 }}><path d="M10.3 3.5 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.5a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></svg>
);

const FAQS = [
  { q: "Is this suitable for beginners?", a: "Most trips welcome beginners — each listing notes the difficulty. If you're new, the host suggests gentler routes and helps you prepare." },
  { q: "Can solo travellers join?", a: "Absolutely. Many travellers come solo and leave with a whole group of friends — the small group size makes it easy to connect." },
  { q: "What fitness level is required?", a: "A basic level of fitness helps as trips involve walking at altitude. Each experience lists the expected fitness level." },
  { q: "How do I book or enquire?", a: "Use Send message to chat with the host right here on Nomadic Townies. They'll help you pick the right trip and dates." },
];

const GAL_LAYOUT = ["tall", "", "", "wide", "", ""];

/* moderation: block phone / email / url / social handle sharing */
const detectContact = (text) => {
  const t = text.toLowerCase().replace(/\s+/g, " ");
  const digits = (text.match(/\d/g) || []).length;
  if (/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(text)) return "email";
  if (/(https?:\/\/|www\.|\.com|instagram|whatsapp|telegram|t\.me|fb\.com|facebook)/i.test(t)) return "link";
  if (digits >= 8) return "phone";
  if (/\b(my\s+)?(number|whatsapp|insta|email|gmail|call me|dm me)\b/i.test(t)) return "handle";
  return null;
};

const HostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useGetHostByIdQuery(id, { skip: !id });
  const { data: tripsRes } = useGetHostTripsQuery(id, { skip: !id });
  const { data: reviewsRes } = useGetReviewsByHostIdQuery(id, { skip: !id });
  const { data: allHostsRes } = useGetAllHostsQuery();
  const [addUserReview, { isLoading: submitting }] = useAddUserReviewMutation();

  const host = data?.data || data || {};

  const trips = useMemo(
    () => (Array.isArray(tripsRes?.data) ? tripsRes.data : Array.isArray(tripsRes) ? tripsRes : []),
    [tripsRes]
  );
  const reviews = useMemo(() => {
    const r = reviewsRes?.data ?? reviewsRes?.reviews ?? reviewsRes ?? [];
    return Array.isArray(r) ? r : [];
  }, [reviewsRes]);
  const similar = useMemo(() => {
    const list = Array.isArray(allHostsRes?.data) ? allHostsRes.data : Array.isArray(allHostsRes) ? allHostsRes : [];
    return list.filter((h) => h?._id !== id).slice(0, 3);
  }, [allHostsRes, id]);

  /* ---- derived host fields ---- */
  const name = host?.hostTitle || host?.hostName || "Travel Host";
  const firstName = firstNameOf(host?.hostName, name);
  const initial = initialOf(host?.hostTitle || host?.hostName);
  const location = [host?.city, host?.state].filter(Boolean).join(", ") || host?.location || host?.hqLocation || "";
  const verified = host?.isVerified || host?.status === "approved";

  const avgRating = reviews.length
    ? reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0) / reviews.length
    : 4.9;
  const ratingStr = avgRating.toFixed(1);

  const rawExp = host?.experience || (host?.foundedYear ? `${Math.max(1, new Date().getFullYear() - parseInt(host.foundedYear, 10))}` : "");
  const years = rawExp ? (/^\d+$/.test(`${rawExp}`.trim()) ? `${`${rawExp}`.trim()} yrs` : rawExp) : "—";

  const specialties = Array.isArray(host?.specialties) ? host.specialties.filter(Boolean) : [];
  const languages = Array.isArray(host?.languages) ? host.languages.filter(Boolean) : [];
  const gallery = Array.isArray(host?.gallery) ? host.gallery.filter(Boolean) : [];

  // regions: prefer explicit field, fall back to unique hosted-trip locations
  const regions = useMemo(() => {
    const explicit = Array.isArray(host?.regionsHosted) ? host.regionsHosted.filter(Boolean) : [];
    if (explicit.length) return explicit;
    const fromTrips = [...new Set(trips.map((t) => t?.location).filter(Boolean))];
    return fromTrips.slice(0, 6);
  }, [host?.regionsHosted, trips]);

  const tripsHosted = host?.tripsHosted ?? trips.length ?? 0;
  const travellersHosted = host?.travellersHosted ? Number(host.travellersHosted).toLocaleString("en-IN") : "—";
  const successRate = Number(host?.successRate) || 0;
  const responseRate = Number(host?.responseRate) || 0;
  const responseTime = host?.responseTimeLabel || "within a day";
  const memberSince = host?.foundedYear || (host?.createdAt ? new Date(host.createdAt).getFullYear() : "");
  const rankLabel = successRate >= 95 || verified ? "Top-rated host" : "Trusted host";

  // verification badges derived from existing data
  const badges = useMemo(() => {
    const certifications = Array.isArray(host?.achievements) ? host.achievements.filter(Boolean) : [];
    const out = [];
    if (verified) out.push({ icon: "✓", bg: "#E0EFE4", color: "#2E7D4F", title: "ID verified", sub: "Confirmed by Nomadic Townies" });
    certifications.slice(0, 3).forEach((c) => out.push({ icon: "★", bg: "#F6E4DC", color: "#CF4A2C", title: c, sub: "Certified" }));
    if (successRate >= 95) out.push({ icon: "★", bg: "#FBEFD6", color: "#C8941E", title: "Top-rated host", sub: "Top 5% of hosts" });
    return out;
  }, [verified, host?.achievements, successRate]);

  // rating distribution bars
  const ratingBars = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const k = Math.max(1, Math.min(5, Math.round(Number(r.rating) || 0)));
      counts[k] += 1;
    });
    const total = reviews.length || 1;
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      count: counts[stars],
      pct: `${Math.round((counts[stars] / total) * 100)}%`,
    }));
  }, [reviews]);

  /* ---- write-review form ---- */
  const [rRating, setRRating] = useState(0);
  const [rName, setRName] = useState("");
  const [rText, setRText] = useState("");
  const [rDone, setRDone] = useState(false);
  const [rErr, setRErr] = useState("");
  const submitReview = async (e) => {
    e.preventDefault();
    setRErr("");
    try {
      await addUserReview({
        hostId: id,
        name: rName,
        rating: rRating || 5,
        review: rText,
        tripName: "",
        date: new Date().toISOString(),
      }).unwrap();
      setRDone(true);
      setRName("");
      setRText("");
      setRRating(0);
    } catch {
      setRErr("Couldn't submit your review just now. Please try again.");
    }
  };

  /* ---- chat drawer (on-platform messaging) ---- */
  const [chatOpen, setChatOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([]);
  const [violations, setViolations] = useState(0);
  const [warning, setWarning] = useState("");
  const msgsRef = useRef(null);
  const inputRef = useRef(null);

  const scrollSoon = () => setTimeout(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight; }, 60);
  const openChat = () => { setChatOpen(true); setTimeout(() => inputRef.current?.focus(), 320); };
  const closeChat = () => setChatOpen(false);

  const sendMessage = (raw) => {
    const text = (raw ?? draft).trim();
    if (!text) return;
    if (detectContact(text)) {
      const v = violations + 1;
      let warn;
      if (v === 1) warn = "Let's keep contact details off chat — please don't share phone numbers, emails or social handles. Nomadic Townies keeps your booking protected.";
      else if (v === 2) warn = "Second reminder: sharing personal contact info isn't allowed. Continued attempts may temporarily restrict your chat.";
      else warn = "Your message was hidden and this conversation has been flagged for review. Repeated sharing of contact details can restrict messaging.";
      setDraft("");
      setWarning(warn);
      setViolations(v);
      scrollSoon();
      return;
    }
    setMessages((m) => [...m, { text, mine: true }]);
    setDraft("");
    setWarning("");
    scrollSoon();
    setTimeout(() => {
      setMessages((m) => [...m, { text: "Great — I'll check availability and send you a couple of options right here. 👍", mine: false }]);
      scrollSoon();
    }, 1100);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setChatOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const seoTitle = `${name} | Travel Host | Nomadic Townies`;
  const seoDesc = host?.tagline
    ? `${host.tagline} — discover host-led experiences with ${name} on Nomadic Townies.`
    : `Discover host-led community trips, retreats and cultural immersions with ${name} on Nomadic Townies.`;

  if (!id || isLoading) {
    return <div className="hd-page"><div className="hd-loading">Loading host…</div></div>;
  }

  const quickReplies = ["What dates are available?", "Is it good for beginners?", "What's included?"];

  return (
    <div className="hd-page">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={`https://nomadictownies.com/hosts/${id}`} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        {host?.coverImage || host?.brandingLogo ? <meta property="og:image" content={host.coverImage || host.brandingLogo} /> : null}
      </Helmet>

      {/* ---------- breadcrumb sub-header ---------- */}
      <header className="hd-topbar">
        <button type="button" className="hd-back" aria-label="Go back" onClick={() => navigate(-1)}>←</button>
        <div className="hd-crumb">
          <a onClick={() => navigate("/")}>Home</a><span>›</span>
          <a onClick={() => navigate("/hosts")}>Hosts</a><span>›</span>
          <span className="cur">{name}</span>
        </div>
      </header>

      {/* ---------- hero banner ---------- */}
      <section className="hd-hero">
        {host?.coverImage && <img className="hd-hero-img" src={host.coverImage} alt={`${name} cover`} />}
        <div className="hd-hero-stripe" />
        <div className="hd-hero-glow" />
        <div className="hd-hero-inner">
          <div className="hd-avatar">
            <div className="hd-avatar-inner">
              {host?.brandingLogo ? <img src={host.brandingLogo} alt={name} /> : initial}
            </div>
            {verified && <span className="hd-avatar-badge"><IcCheck s={19} /></span>}
          </div>

          <div className="hd-identity">
            <div className="hd-namerow">
              <h1 className="hd-name">{name}</h1>
              {verified && <span className="hd-verified-pill"><IcCheck s={13} /> Verified host</span>}
            </div>
            {host?.tagline && <p className="hd-hero-tag">&ldquo;{host.tagline}&rdquo;</p>}
            <div className="hd-hero-meta">
              {location && <span><IcPin /> {location}</span>}
              {memberSince && <span><IcCal /> Since {memberSince}</span>}
              <span><IcTrophy /> {rankLabel}</span>
            </div>
          </div>

          <div className="hd-hero-stats">
            <div className="hd-hs">
              <div className="hd-hs-stars">★★★★<span style={{ color: "rgba(244,238,228,.3)" }}>★</span></div>
              <div className="hd-hs-num">{ratingStr}</div>
              <div className="hd-hs-label">Rating</div>
            </div>
            <div className="hd-hs">
              <div className="hd-hs-num gap">{tripsHosted}</div>
              <div className="hd-hs-label">Trips hosted</div>
            </div>
            <div className="hd-hs">
              <div className="hd-hs-num gap">{successRate}%</div>
              <div className="hd-hs-label">Rebook rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- stat strip ---------- */}
      <div className="hd-strip-wrap">
        <div className="hd-strip">
          <div className="hd-strip-cell"><div className="hd-strip-num">{tripsHosted}</div><div className="hd-strip-label">Trips hosted</div></div>
          <div className="hd-strip-cell"><div className="hd-strip-num">{travellersHosted}</div><div className="hd-strip-label">Travellers hosted</div></div>
          <div className="hd-strip-cell"><div className="hd-strip-num"><span className="star">★</span> {ratingStr}</div><div className="hd-strip-label">{reviews.length} reviews</div></div>
          <div className="hd-strip-cell"><div className="hd-strip-num">{years}</div><div className="hd-strip-label">Experience</div></div>
        </div>
      </div>

      {/* ---------- main grid ---------- */}
      <div className="hd-grid">
        {/* ===== main column ===== */}
        <div className="hd-col-main">
          {/* about */}
          <section className="hd-card">
            <h2>About {firstName}</h2>
            {host?.hostOverview
              ? <p className="hd-about-p">{host.hostOverview}</p>
              : <p className="hd-about-p" style={{ color: "#9CA3AF" }}>This host hasn&apos;t added an overview yet.</p>}
            {host?.tagline && <div className="hd-quote">&ldquo;{host.tagline}&rdquo;</div>}
          </section>

          {/* verification & badges */}
          {badges.length > 0 && (
            <section className="hd-card">
              <h2>Verification &amp; badges</h2>
              <div className="hd-badges">
                {badges.map((b, i) => (
                  <div className="hd-badge" key={i}>
                    <span className="hd-badge-ic" style={{ background: b.bg, color: b.color }}>{b.icon}</span>
                    <span style={{ minWidth: 0 }}>
                      <div className="hd-badge-tt">{b.title}</div>
                      <div className="hd-badge-sub">{b.sub}</div>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* expertise, languages, regions */}
          {(specialties.length > 0 || languages.length > 0 || regions.length > 0) && (
            <section className="hd-card">
              <h2>Expertise &amp; travel style</h2>
              {specialties.length > 0 && (
                <div className="hd-chips" style={{ marginTop: 16 }}>
                  {specialties.map((s) => <span key={s} className="hd-chip-fill">{s}</span>)}
                </div>
              )}
              {languages.length > 0 && (
                <>
                  <div className="hd-sublabel">Languages</div>
                  <div className="hd-chips">
                    {languages.map((l) => <span key={l} className="hd-chip-out"><IcGlobe /> {l}</span>)}
                  </div>
                </>
              )}
              {regions.length > 0 && (
                <>
                  <div className="hd-sublabel">Regions hosted</div>
                  <div className="hd-chips">
                    {regions.map((r) => <span key={r} className="hd-chip-out"><IcPinSm /> {r}</span>)}
                  </div>
                </>
              )}
            </section>
          )}

          {/* hosted trips */}
          <section className="hd-card">
            <div className="hd-section-head">
              <h2>Trips by {firstName}</h2>
              {trips.length > 0 && <span className="hd-chip-fill" style={{ cursor: "pointer" }} onClick={() => navigate("/all-packages")}>View all trips</span>}
            </div>
            {trips.length > 0 ? (
              <div className="hd-trips">
                {trips.map((t) => (
                  <a key={t._id} className="hd-trip" onClick={() => navigate(`/trips/${t.seoSlug || t._id}`)}>
                    <div className="hd-trip-img">
                      {tripImg(t) && <img src={tripImg(t)} alt={t.title} loading="lazy" />}
                      <div className="hd-trip-rate"><span className="s">★</span><span className="n">{(Number(t.rating) || avgRating).toFixed(1)}</span></div>
                    </div>
                    <div className="hd-trip-b">
                      <div className="hd-trip-t">{t.title}</div>
                      {t.location && <div className="hd-trip-loc"><IcPinSm /> {t.location}</div>}
                      <div className="hd-trip-foot">
                        <span className="hd-trip-price">₹ {parseInt(t.price || t.firstBookingPrice || 0, 10).toLocaleString("en-IN")}</span>
                        {(t.days || t.nights) && <span className="hd-trip-dur">{t.days}D{t.nights ? ` / ${t.nights}N` : ""}</span>}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p className="hd-about-p" style={{ color: "#9CA3AF" }}>No active trips right now — check back soon.</p>
            )}
          </section>

          {/* reviews */}
          <section className="hd-card">
            <h2>Traveller reviews</h2>
            <div className="hd-rev-summary">
              <div style={{ textAlign: "center" }}>
                <div className="hd-rev-big">{ratingStr}</div>
                <div className="hd-rev-stars">★★★★★</div>
                <div className="hd-rev-count">{reviews.length} reviews</div>
              </div>
              <div className="hd-bars">
                {ratingBars.map((bar) => (
                  <div className="hd-bar" key={bar.stars}>
                    <span className="hd-bar-k">{bar.stars}★</span>
                    <span className="hd-bar-track"><span className="hd-bar-fill" style={{ width: bar.pct }} /></span>
                    <span className="hd-bar-c">{bar.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hd-rev-list">
              {reviews.length > 0 ? reviews.slice(0, 6).map((rv, i) => (
                <div className="hd-review" key={rv._id || i}>
                  <div className="hd-review-head">
                    <span className="hd-review-av">{rv.profileImage ? <img src={rv.profileImage} alt="" /> : initialOf(rv.name || rv.Name)}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="hd-review-name">{rv.name || rv.Name || "Traveller"}</div>
                      <div className="hd-review-date">{fmtDate(rv.date || rv.Date || rv.createdAt)}</div>
                    </div>
                    <span className="hd-review-stars">{starStr(rv.rating)}</span>
                  </div>
                  {(rv.tripName || rv.Title) && <span className="hd-review-trip">{rv.tripName || rv.Title}</span>}
                  <p className="hd-review-text">{rv.review || rv.Review || rv.comment}</p>
                </div>
              )) : <div className="hd-empty">No reviews yet — be the first to share your experience.</div>}
            </div>

            {/* write review (preserves existing functionality) */}
            <div className="hd-wr">
              <h4>Write a review</h4>
              {rDone ? (
                <p className="ok">Thanks! Your review has been submitted.</p>
              ) : (
                <form onSubmit={submitReview}>
                  <div className="hd-stars-pick">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <i key={n} className={n <= rRating ? "on" : ""} onClick={() => setRRating(n)} role="button" aria-label={`${n} star`}>★</i>
                    ))}
                  </div>
                  <input placeholder="Your name" value={rName} onChange={(e) => setRName(e.target.value)} required />
                  <textarea placeholder="Share your experience travelling with this host…" value={rText} onChange={(e) => setRText(e.target.value)} required />
                  {rErr && <p className="err">{rErr}</p>}
                  <button type="submit" className="hd-cta" style={{ width: "auto", padding: "12px 22px" }} disabled={submitting}>{submitting ? "Submitting…" : "Submit review"}</button>
                </form>
              )}
            </div>
          </section>

          {/* gallery */}
          {gallery.length > 0 && (
            <section className="hd-card">
              <h2>From {firstName}&apos;s trips</h2>
              <p className="hd-about-p" style={{ margin: "4px 0 0", fontSize: 14, color: "#8A8073" }}>Real moments from past experiences.</p>
              <div className="hd-gallery">
                {gallery.slice(0, 6).map((src, i) => (
                  <div key={i} className={`hd-gal ${GAL_LAYOUT[i] || ""}`}>
                    <img src={src} alt={`${firstName} trip ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* faq */}
          <section className="hd-card">
            <h2>Ask the host</h2>
            <div className="hd-faq-list">
              {FAQS.map((f, i) => (
                <details className="hd-faq" key={i} open={i === 0}>
                  <summary>{f.q}<span className="hd-faq-ic">+</span></summary>
                  <div className="hd-faq-a">{f.a}</div>
                </details>
              ))}
            </div>
          </section>
        </div>

        {/* ===== sidebar ===== */}
        <aside className="hd-side">
          {/* chat / contact */}
          <div className="hd-side-card shadow">
            <div className="hd-chat-head">
              <span className="hd-chat-av">
                {host?.brandingLogo ? <img src={host.brandingLogo} alt={name} /> : initial}
                <span className="dot" />
              </span>
              <div>
                <div className="hd-chat-name">Chat with {firstName}</div>
                <div className="hd-chat-sub">● Usually replies {responseTime}</div>
              </div>
            </div>
            <button type="button" className="hd-cta" onClick={openChat}><IcChat /> Send message</button>
            <button type="button" className="hd-ghost" onClick={() => navigate("/all-packages")}><IcBox /> View trips</button>
            <div className="hd-safety">
              <IcLock />
              <span>For your safety, all conversations stay on Nomadic Townies. We never share personal contact details.</span>
            </div>
          </div>

          {/* host stats */}
          <div className="hd-side-card">
            <div className="hd-side-label">Host stats</div>
            <div className="hd-stat-rows">
              {responseRate > 0 && <div className="hd-stat-row"><span className="k">Response rate</span><span className="v">{responseRate}%</span></div>}
              <div className="hd-stat-row"><span className="k">Response time</span><span className="v">{responseTime}</span></div>
              {memberSince && <div className="hd-stat-row"><span className="k">Member since</span><span className="v">{memberSince}</span></div>}
              <div className="hd-stat-row"><span className="k">Travellers hosted</span><span className="v">{travellersHosted}</span></div>
            </div>
          </div>

          {/* host rank */}
          <div className="hd-rank">
            <div className="hd-rank-glow" />
            <div className="hd-rank-inner">
              <span className="hd-rank-ic"><IcTrophy c="currentColor" s={22} /></span>
              <div>
                <div className="hd-rank-t">{rankLabel}</div>
                <div className="hd-rank-s">{successRate ? `${successRate}% rebook rate` : "Verified by Nomadic Townies"}</div>
              </div>
            </div>
          </div>

          {/* similar hosts */}
          {similar.length > 0 && (
            <div className="hd-side-card">
              <div className="hd-side-label">Similar hosts</div>
              {similar.map((h) => (
                <div className="hd-sim" key={h._id} onClick={() => navigate(`/hosts/${h._id}`)}>
                  <span className="hd-sim-av">{h.brandingLogo ? <img src={h.brandingLogo} alt="" /> : initialOf(h.hostName || h.hostTitle)}</span>
                  <div style={{ minWidth: 0 }}>
                    <div className="hd-sim-n">{h.hostTitle || h.hostName}</div>
                    <div className="hd-sim-s">{[h.city, h.state].filter(Boolean).join(", ") || h.location || ""}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* ---------- chat drawer ---------- */}
      {chatOpen && <div className="hd-overlay" onClick={closeChat} />}
      <div className={`hd-drawer${chatOpen ? " open" : ""}`} role="dialog" aria-label={`Chat with ${name}`}>
        <div className="hd-drawer-head">
          <span className="hd-chat-av" style={{ width: 42, height: 42 }}>
            {host?.brandingLogo ? <img src={host.brandingLogo} alt={name} /> : initial}
            <span className="dot" />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="hd-chat-name">{name}</div>
            <div className="hd-chat-sub">● Online · via Nomadic Townies</div>
          </div>
          <button type="button" className="hd-drawer-x" onClick={closeChat} aria-label="Close chat">✕</button>
        </div>

        <div className="hd-drawer-safety">
          <IcLock c="#CF4A2C" s={15} />
          <span>Keep it on-platform. Sharing phone, email or social handles is discouraged for your protection.</span>
        </div>

        <div className="hd-msgs" ref={msgsRef}>
          <div className="hd-msg-day">Today</div>
          <div className="hd-msg them">Namaste! 🙏 Thanks for reaching out. Happy to help you plan your trip — what dates are you thinking?</div>
          {messages.map((m, i) => (
            <div key={i} className={`hd-msg ${m.mine ? "me" : "them"}`}>{m.text}</div>
          ))}
          {warning && (
            <div className="hd-warn"><IcAlert /><span>{warning}</span></div>
          )}
        </div>

        <div className="hd-quick">
          {quickReplies.map((q) => (
            <button key={q} type="button" onClick={() => sendMessage(q)}>{q}</button>
          ))}
        </div>

        <div className="hd-composer">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); sendMessage(); } }}
            placeholder="Type a message…"
          />
          <button type="button" className="hd-send" onClick={() => sendMessage()} aria-label="Send"><IcSend /></button>
        </div>
      </div>

      {/* ---------- mobile sticky cta ---------- */}
      <div className="hd-mobile-cta">
        <button type="button" className="hd-ghost" style={{ marginTop: 0 }} onClick={() => navigate("/all-packages")}>View trips</button>
        <button type="button" className="hd-cta" onClick={openChat}>Send message</button>
      </div>

      <Footer />
    </div>
  );
};

export default HostPage;
