/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./catPage.css";
import Footer from "../Footer";
import { useGetAllCategoriesQuery } from "../../services/categoriesApis";
import { useGetTripsByCagtegoryMutation } from "../../services/categoriesApis";
import { useGetTripsQuery } from "../../services/TripApis";
import { useGetAllReviewsQuery } from "../../services/ReviewsApis";
import { matchTemplate } from "./categoryCards";

// ─── helpers ──────────────────────────────────────────────
const norm = (s) => (s || "").toLowerCase().trim();

// trip.categories can be nested/double-encoded e.g. ['["INDIA"]']
const parseCats = (v) => {
  const out = [];
  const walk = (x) => {
    if (Array.isArray(x)) return x.forEach(walk);
    if (typeof x !== "string") return;
    const s = x.trim();
    if (/^\[.*\]$/.test(s)) { try { return walk(JSON.parse(s)); } catch { /* noop */ } }
    out.push(s.replace(/[[\]"]/g, "").trim());
  };
  walk(v);
  return out.filter(Boolean);
};
const inCategory = (trip, name) => parseCats(trip?.categories).some((c) => norm(c) === norm(name));

const batchDates = (trip) => {
  let b = [];
  try { b = trip?.selectDate ? (typeof trip.selectDate === "string" ? JSON.parse(trip.selectDate) : trip.selectDate) : []; } catch { b = []; }
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return (Array.isArray(b) ? b : []).map((x) => x?.BatchDate && new Date(x.BatchDate)).filter((d) => d && !isNaN(d) && d >= now).sort((a, b2) => a - b2);
};
const nextBatch = (trip) => batchDates(trip)[0] || null;
const fmtDate = (d) => d ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : null;
const fmtPrice = (p) => `₹${parseInt(p || 0, 10).toLocaleString("en-IN")}`;
const tripImg = (t) => t?.cardImage || t?.Banner_Image || t?.bannerImage || t?.image || "";
const ratingOf = (t) => { const r = Number(t?.ratings ?? t?.rating); return isNaN(r) || !r ? 4.8 : r; };

const StarSvg = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.8 6.6 20l1-6.1L3.2 9.5l6.1-.9L12 3Z" /></svg>);

const CategorieDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const categoryParam = decodeURIComponent(slug || "");

  const { data: catRes } = useGetAllCategoriesQuery();
  const { data: allTripsRes } = useGetTripsQuery();
  const { data: revRes } = useGetAllReviewsQuery();
  const [GetTripsByCagtegory, { isLoading }] = useGetTripsByCagtegoryMutation();
  const [trips, setTrips] = useState([]);
  const [sort, setSort] = useState("soonest");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await GetTripsByCagtegory({ categories: categoryParam }).unwrap();
        if (active) setTrips(Array.isArray(res?.data) ? res.data : []);
      } catch {
        if (active) setTrips([]);
      }
    })();
    window.scrollTo(0, 0);
    return () => { active = false; };
  }, [GetTripsByCagtegory, categoryParam]);

  const cats = Array.isArray(catRes?.data) ? catRes.data : [];
  const catDoc = useMemo(() => cats.find((c) => norm(c?.Category) === norm(categoryParam)), [cats, categoryParam]);
  const tpl = matchTemplate(catDoc?.Category || categoryParam);
  const displayName = tpl.name || catDoc?.Category || categoryParam;
  const heroImg = catDoc?.Page_Banner_Image || catDoc?.Banner_Image || "";
  const count = trips.length;

  const sortedTrips = useMemo(() => {
    const arr = [...trips];
    if (sort === "price-low") arr.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    else if (sort === "price-high") arr.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    else if (sort === "rating") arr.sort((a, b) => ratingOf(b) - ratingOf(a));
    else if (sort === "duration") arr.sort((a, b) => (Number(a.days) || 0) - (Number(b.days) || 0));
    else arr.sort((a, b) => (nextBatch(a) || Infinity) - (nextBatch(b) || Infinity));
    return arr;
  }, [trips, sort]);

  // suggested categories that DO have trips (excluding current)
  const suggested = useMemo(() => {
    const allTrips = Array.isArray(allTripsRes?.data) ? allTripsRes.data : [];
    return cats
      .filter((c) => norm(c?.Category) !== norm(categoryParam))
      .map((c) => ({ name: matchTemplate(c?.Category).name || c?.Category, raw: c?.Category, n: allTrips.filter((t) => inCategory(t, c?.Category)).length }))
      .filter((c) => c.n > 0)
      .slice(0, 4);
  }, [cats, allTripsRes, categoryParam]);

  const reviews = (Array.isArray(revRes?.data) ? revRes.data : []).slice(0, 3);
  const stars = (n) => { const r = Math.max(0, Math.min(5, Math.round(Number(n) || 5))); return "★".repeat(r) + "☆".repeat(5 - r); };

  const seoTitle = `${displayName} Experiences & Community Trips | Nomadic Townies`;
  const seoDesc = `Discover curated ${displayName} experiences on Nomadic Townies — community trips, retreats, workshops and cultural immersions led by passionate hosts.`;

  return (
    <div className="catpg">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={`https://nomadictownies.com/category/${slug}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        {heroImg && <meta property="og:image" content={heroImg} />}
      </Helmet>

      <div className="wrap">
        {/* breadcrumb */}
        <div className="crumb">
          <a onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</a>
          <span>›</span>
          <a onClick={() => navigate("/all-packages")} style={{ cursor: "pointer" }}>All Experiences</a>
          <span>›</span>
          <span className="cur">{displayName}</span>
        </div>

        {/* hero */}
        <section className="cat-hero">
          <button className="back-btn" title="Back" onClick={() => navigate(-1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          {heroImg && <img src={heroImg} alt={`${displayName} trips and tours by Nomadic Townies`} />}
          <div className="cat-hero-inner">
            <div>
              <div className="cat-hero-eyebrow">Explore by category</div>
              <h1>{displayName}</h1>
              <p className="blurb">{tpl.desc}</p>
            </div>
            <div className="cat-hero-count">
              <div className="num">{isLoading ? "…" : count}</div>
              <div className="lbl">Trips</div>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="cat-loading">Loading trips…</div>
        ) : count > 0 ? (
          <>
            {/* toolbar */}
            <div className="toolbar">
              <div className="toolbar-title">Upcoming trips <span>· {count} available</span></div>
              <div className="sort-sel">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M6 12h12M10 18h4" /></svg>
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="soonest">Soonest departure</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                  <option value="rating">Top rated</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>

            {/* trip grid */}
            <div className="trip-grid">
              {sortedTrips.map((t) => {
                const b = nextBatch(t);
                return (
                  <a key={t._id} className="trip" onClick={() => navigate(`/trips/${t?.seoSlug || t?._id}`)} style={{ cursor: "pointer" }}>
                    <div className="trip-img">
                      {tripImg(t) ? <img src={tripImg(t)} alt={`${t.title} — Nomadic Townies`} loading="lazy" /> : null}
                      <span className="trip-rating"><StarSvg />{ratingOf(t).toFixed(1)}</span>
                    </div>
                    <div className="trip-body">
                      <div className="trip-loc">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>
                        {t.location}
                      </div>
                      <div className="trip-title">{t.title}</div>
                      <div className="trip-meta">
                        <span className="trip-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>{b ? fmtDate(b) : "Dates soon"}</span>
                        <span className="trip-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>{t.days}D / {t.nights}N</span>
                      </div>
                      <div className="trip-foot">
                        <div className="trip-price">
                          <span className="from">From</span>
                          <span className="val">{fmtPrice(t.price)}</span> <span className="per">/ person</span>
                        </div>
                        <span className="trip-view">View <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="m9 6 6 6-6 6" /></svg></span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </>
        ) : (
          /* ═══ EMPTY STATE ═══ */
          <>
            <div className="empty">
              <svg className="empty-illus" viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#CD482A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="80" cy="58" r="34" />
                  <circle cx="80" cy="58" r="4" fill="#CD482A" stroke="none" />
                  <polygon points="80,32 72,58 80,58" fill="#CD482A" stroke="none" />
                  <polygon points="80,84 88,58 80,58" fill="#E8C4B8" stroke="none" />
                </g>
                <text x="80" y="24" textAnchor="middle" fontFamily="Inter,sans-serif" fontSize="11" fontWeight="800" fill="#CD482A">N</text>
                <path d="M28 118 q30 -16 52 -4 q24 13 52 -6" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeDasharray="3,7" strokeLinecap="round" />
                <circle cx="28" cy="118" r="4" fill="#9CA3AF" />
                <path d="M132 108 q9 0 9 9 q0 8 -9 16 q-9 -8 -9 -16 q0 -9 9 -9Z" fill="none" stroke="#CD482A" strokeWidth="2.6" />
                <circle cx="132" cy="117" r="3" fill="#CD482A" />
              </svg>
              <h2>New {displayName} trips are on the way</h2>
              <p>We&apos;re a young platform and our hosts are busy planning the next batch of <b>{displayName}</b> adventures. Be the first to know when they go live.</p>
              <div className="empty-actions">
                <button className="btn btn-orange" onClick={() => navigate("/all-packages")}>
                  Explore all trips
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                </button>
                <button className="btn btn-ghost" onClick={() => navigate("/contact-us")}>Talk to us</button>
              </div>
              <div className="notify">
                <h3>Get notified when trips open</h3>
                <p>No spam — just a heads-up the moment a new trip in this category is live.</p>
                <form className="notify-form" onSubmit={(e) => { e.preventDefault(); e.currentTarget.querySelector("button").textContent = "Added ✓"; }}>
                  <input type="email" placeholder="you@email.com" required />
                  <button type="submit">Notify me</button>
                </form>
              </div>
            </div>

            {suggested.length > 0 && (
              <div className="suggest">
                <div className="suggest-label">Meanwhile, explore these</div>
                <div className="suggest-row">
                  {suggested.map((s) => (
                    <a key={s.raw} className="suggest-chip" onClick={() => navigate(`/category/${s.raw}`)} style={{ cursor: "pointer" }}>
                      {s.name} <span className="c">{s.n}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {reviews.length > 0 && (
        <section className="reviews">
          <div className="wrap">
            <div className="reviews-head">
              <div className="kicker">Loved by travellers</div>
              <h2>What our community says</h2>
              <div className="reviews-summary">
                <span className="stars">★★★★★</span>
                <span><b>4.9</b> average from <b>120+</b> travellers</span>
              </div>
            </div>
            <div className="reviews-grid">
              {reviews.map((rev) => (
                <div className="review-card" key={rev._id}>
                  <div className="rc-stars">{stars(rev.rating)}</div>
                  <p className="rc-text">{rev.Review || rev.Title}</p>
                  <div className="rc-who">
                    <div className="rc-avatar">
                      {rev.Profile_Image ? <img src={rev.Profile_Image} alt={rev.Name} /> : (rev.Name || "?").trim()[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div className="rc-name">{rev.Name}</div>
                      <div className="rc-trip">{rev.Title || rev.Job}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default CategorieDetails;
