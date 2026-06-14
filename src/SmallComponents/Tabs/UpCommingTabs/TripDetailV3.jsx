/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import "./tripV3.css";
import { useGetTripsQuery } from "../../../services/TripApis";
import { useGetAllReviewsQuery } from "../../../services";
import { useEnquirMutation } from "../../../services/EnquirApi";
import LoginModal from "../../../Modals/LoginModal";

const initial = (n) => (n ? n.trim()[0]?.toUpperCase() : "N");
const avg = (r) => {
  if (Array.isArray(r) && r.length) { const n = r.map(Number).filter((x) => !isNaN(x)); return n.length ? n.reduce((a, b) => a + b, 0) / n.length : 4.8; }
  const x = Number(r); return isNaN(x) || !x ? 4.8 : x;
};
// split a string field (newlines, semicolons, or commas) into clean list items; strip basic HTML
const toList = (s) => {
  if (!s) return [];
  if (Array.isArray(s)) return s.filter(Boolean);
  const txt = `${s}`.replace(/<[^>]+>/g, "\n");
  return txt.split(/\r?\n|;|,/).map((x) => x.trim()).filter(Boolean);
};
const parseBatches = (sd) => {
  let b = [];
  try { b = sd ? (typeof sd === "string" ? JSON.parse(sd) : sd) : []; } catch { b = []; }
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return (Array.isArray(b) ? b : []).map((x) => x?.BatchDate && new Date(x.BatchDate)).filter((d) => d && !isNaN(d) && d >= now).sort((a, b) => a - b);
};
// best-effort itinerary from addsection/addDays
const parseItinerary = (item) => {
  for (const key of ["addsection", "addDays", "itinerary"]) {
    const v = item?.[key];
    if (!v) continue;
    try {
      const p = typeof v === "string" ? JSON.parse(v) : v;
      if (Array.isArray(p) && p.length) {
        return p.map((d, i) => ({
          title: d?.title || d?.heading || d?.day || `Day ${i + 1}`,
          desc: d?.description || d?.desc || d?.details || "",
        }));
      }
    } catch { /* not json */ }
  }
  return [];
};

const TripDetailV3 = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userDbData } = useSelector((s) => s.global);
  const { data } = useGetTripsQuery();
  const { data: revRes } = useGetAllReviewsQuery();
  const [tab, setTab] = useState("Overview");
  const [openL, setOpenL] = useState(false);
  const [cb, setCb] = useState({ name: "", phone: "", email: "" });
  const [cbSent, setCbSent] = useState(false);
  const [enquir, { isLoading: cbLoading }] = useEnquirMutation();

  const item = useMemo(() => {
    const list = Array.isArray(data?.data) ? data.data : [];
    return list.find((t) => t.seoSlug && t.seoSlug === slug) || list.find((t) => t._id === slug);
  }, [data, slug]);

  if (data && !item) return <div className="tdv3"><div className="wrap" style={{ padding: 80, textAlign: "center" }}>Trip not found.</div></div>;
  if (!item) return <div className="tdv3"><div className="wrap" style={{ padding: 80, textAlign: "center" }}>Loading…</div></div>;

  const gallery = (Array.isArray(item.gallaryImages) && item.gallaryImages.length ? item.gallaryImages : [item.bannerImage, item.cardImage]).filter(Boolean);
  const cats = Array.isArray(item.categories) ? item.categories.flatMap((c) => { try { const p = JSON.parse(c); return Array.isArray(p) ? p : [c]; } catch { return [c]; } }) : [];
  const rating = avg(item.ratings);
  const included = toList(item.Inclusion);
  const excluded = toList(item.Exclusion);
  const thingsToCarry = toList(item.ThingsToCarry);
  const cancellation = toList(item.Cancellation);
  const itinerary = parseItinerary(item);
  const reviews = (Array.isArray(revRes?.data) ? revRes.data : []).slice(0, 4);
  const host = item.host && typeof item.host === "object" ? item.host : null;
  const nextBatch = parseBatches(item.selectDate)[0];

  const book = () => {
    if (!userDbData) { setOpenL(true); return; }
    navigate(`/book/${item.seoSlug || item._id}`);
  };

  const submitCallback = async (e) => {
    e.preventDefault();
    if (!cb.name.trim() || (!cb.phone.trim() && !cb.email.trim())) return;
    try {
      await enquir({ Name: cb.name, Phone: cb.phone, Email: cb.email, Message: `Callback request for trip: ${item.title}`, userId: userDbData?._id }).unwrap();
      setCbSent(true);
    } catch { setCbSent(true); }
  };

  const TABS = ["Overview", "Itinerary", "Inclusions", "Reviews", "Other Info"];

  return (
    <div className="tdv3">
      <Helmet>
        <title>{item?.title ? `${item.title} | Book Now | Nomadic Townies` : "Trip Details"}</title>
        <meta name="description" content={item?.subTitle || item?.overview?.slice(0, 150) || "Book this experience with Nomadic Townies."} />
        <link rel="canonical" href={`https://nomadictownies.com/trips/${item?.seoSlug || slug}`} />
      </Helmet>
      <LoginModal openL={openL} setOpenL={setOpenL} />

      <div className="wrap">
        {/* gallery */}
        <div className="td-hero">
          {gallery.slice(0, 5).map((g, i) => (
            <div className="td-hero-cell" key={i}><img src={g} alt={item.title} loading={i === 0 ? "eager" : "lazy"} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
          ))}
          {gallery.length > 5 && <button className="td-hero-show-all">Show all {gallery.length} photos</button>}
        </div>

        <div className="td-main">
          <div>
            <div className="td-tag-row">
              {cats.slice(0, 3).map((c, i) => <span className="td-tag" key={i}>{c}</span>)}
              {item.Trending ? <span className="td-tag td-tag-trending">🔥 Trending</span> : null}
            </div>
            <h1 className="td-title">{item.title}{item.subTitle ? ` — ${item.subTitle}` : ""}</h1>
            <div className="td-meta-row">
              {item.location && <span className="td-meta-item">📍 {item.location}</span>}
              {(item.nights || item.days) && <span className="td-meta-item">🗓 {item.nights}N / {item.days}D</span>}
              <span className="td-meta-item td-meta-rating">★ {rating.toFixed(1)}</span>
            </div>

            {host && (
              <div className="td-host">
                <div className="td-host-avatar">{initial(host.hostName)}</div>
                <div className="td-host-info">
                  <div className="td-host-name">Hosted by <b>{host.hostName}</b> {host.isVerified && <span className="td-host-verified">✓ Verified</span>}</div>
                  {host.hostTitle && <div className="td-host-stats">{host.hostTitle}</div>}
                </div>
                <Link to={`/hosts/${host._id}`} className="td-host-cta">View Host Profile</Link>
              </div>
            )}

            {/* tabs */}
            <div className="td-tabs">
              {TABS.map((t) => <button key={t} className={`td-tab${tab === t ? " on" : ""}`} onClick={() => setTab(t)}>{t}</button>)}
            </div>

            {tab === "Overview" && (
              <div className="td-section">
                <h2>About this trip</h2>
                <p style={{ whiteSpace: "pre-line", color: "var(--text)", lineHeight: 1.7 }}>{item.overview || "An unforgettable, community-first experience."}</p>
                <div className="td-highlights">
                  {[
                    `${item.nights || "—"}N / ${item.days || "—"}D curated itinerary`,
                    item.location ? `Explore ${item.location}` : "Handpicked destinations",
                    host ? "Hosted by a verified local host" : "Community-first small group",
                    "Secure payment & on-trip support",
                  ].map((h, i) => (
                    <div className="td-highlight" key={i}><div className="td-highlight-ic">✦</div><div className="td-highlight-text">{h}</div></div>
                  ))}
                </div>
              </div>
            )}

            {tab === "Itinerary" && (
              <div className="td-section">
                <h2>Day-by-day itinerary</h2>
                {itinerary.length ? (
                  <div className="td-itin">
                    {itinerary.map((d, i) => (
                      <div className="td-itin-day" key={i}>
                        <div className="td-itin-marker">{String(i + 1).padStart(2, "0")}</div>
                        <div className="td-itin-body"><h3>{d.title}</h3>{d.desc && <p style={{ color: "var(--text-light)", fontSize: 14, whiteSpace: "pre-line" }}>{d.desc}</p>}</div>
                      </div>
                    ))}
                  </div>
                ) : <p style={{ color: "var(--text-light)" }}>Detailed day-by-day itinerary shared on enquiry.</p>}
              </div>
            )}

            {tab === "Inclusions" && (
              <div className="td-section">
                <h2>What&apos;s included</h2>
                <div className="td-incl-grid">
                  <div className="td-incl-col included">
                    <h3><span style={{ color: "var(--green)" }}>✓</span> Included</h3>
                    <div className="td-incl-list">{(included.length ? included : ["Details shared on enquiry"]).map((x, i) => <div className="td-incl-item" key={i}><span style={{ color: "var(--green)" }}>✓</span>{x}</div>)}</div>
                  </div>
                  <div className="td-incl-col excluded">
                    <h3><span style={{ color: "var(--red)" }}>✕</span> Not included</h3>
                    <div className="td-incl-list">{(excluded.length ? excluded : ["Anything not mentioned in Included"]).map((x, i) => <div className="td-incl-item" key={i}><span style={{ color: "var(--red)" }}>✕</span>{x}</div>)}</div>
                  </div>
                </div>
              </div>
            )}

            {tab === "Reviews" && (
              <div className="td-section">
                <h2>What travellers are saying</h2>
                <div className="td-rating-overview">
                  <div><div className="td-rating-big">{rating.toFixed(1)}</div><div className="td-rating-stars">{"★".repeat(Math.round(rating))}</div><div className="td-rating-count">{reviews.length} reviews</div></div>
                  <div className="td-rating-bars">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const c = reviews.filter((r) => Math.round(avg(r?.rating)) === star).length;
                      const pct = reviews.length ? (c / reviews.length) * 100 : (star === 5 ? 80 : star === 4 ? 15 : 2);
                      return (
                        <div className="td-rating-bar" key={star}>
                          <span className="td-rating-bar-label">{star}★</span>
                          <span className="td-rating-bar-fill"><div style={{ width: `${pct}%` }} /></span>
                          <span className="td-rating-bar-count">{c}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="td-reviews">
                  {reviews.map((r, i) => (
                    <div className="td-review" key={r?._id || i}>
                      <div className="td-review-head">
                        <div className="td-review-avatar">{initial(r?.Name)}</div>
                        <div><div className="td-review-name">{r?.Name}</div><div className="td-review-date">{r?.Job || "Traveller"}</div></div>
                        <div className="td-review-stars" style={{ marginLeft: "auto" }}>{"★".repeat(Math.round(avg(r?.rating)))}</div>
                      </div>
                      <p className="td-review-text">“{r?.Review}”</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "Other Info" && (
              <div className="td-section">
                <h2>Things to carry</h2>
                <div className="td-incl-list">{(thingsToCarry.length ? thingsToCarry : ["Shared on confirmation"]).map((x, i) => <div className="td-incl-item" key={i}>{x}</div>)}</div>
                <h2 style={{ marginTop: 24 }}>Cancellation policy</h2>
                <div className="td-incl-list">{(cancellation.length ? cancellation : ["As per Nomadic Townies policy"]).map((x, i) => <div className="td-incl-item" key={i}>{x}</div>)}</div>
              </div>
            )}
          </div>

          {/* sidebar */}
          <aside className="td-sidebar">
            <div className="td-side-card">
              <div className="td-side-note"><div className="td-side-note-ic">⚑</div><div className="td-side-note-text">Pay a little now, adventure a lot — flexible payments at checkout.</div></div>
              <div className="td-side-price-body">
                <div className="td-side-price-head">
                  <span className="td-side-price-from">Starting from</span>
                  {item.tripOff ? <span className="td-side-discount-pill">{item.tripOff}% OFF</span> : null}
                </div>
                <div className="td-side-price">
                  ₹{Number(item.price || 0).toLocaleString("en-IN")}
                  {item.strikePrice && Number(item.strikePrice) > Number(item.price) ? <s style={{ fontSize: 16, color: "var(--text-lighter)", marginLeft: 8 }}>₹{Number(item.strikePrice).toLocaleString("en-IN")}</s> : null}
                  <span style={{ fontSize: 14, color: "var(--text-light)", fontWeight: 400 }}> / person</span>
                </div>
                {nextBatch && <div style={{ fontSize: 13, color: "var(--text-light)", marginTop: 6 }}>Next batch: {nextBatch.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>}
                <button className="td-side-book" onClick={book}>Book Now</button>
                <div className="td-side-trust">
                  <div className="td-trust-item">✓ Verified host</div>
                  <div className="td-trust-item">✓ Secure payment</div>
                  <div className="td-trust-item">✓ Community-first experience</div>
                </div>
              </div>
            </div>

            {/* callback / enquiry form */}
            <div className="td-side-form">
              <div className="td-side-form-head">
                <div className="td-side-form-ic">✈</div>
                <div className="td-side-form-titles">
                  <div className="td-side-form-eyebrow">Born to Roam?</div>
                  <div className="td-side-form-title">Let&apos;s Talk</div>
                </div>
              </div>
              {cbSent ? (
                <div className="td-side-form-body"><p style={{ fontSize: 14, color: "var(--green)", fontWeight: 600 }}>Thanks! Our team will reach out shortly.</p></div>
              ) : (
                <form className="td-side-form-body" onSubmit={submitCallback}>
                  <input className="bk-fld" placeholder="Full Name" value={cb.name} onChange={(e) => setCb({ ...cb, name: e.target.value })} style={{ marginBottom: 10 }} />
                  <input className="bk-fld" placeholder="Phone No." value={cb.phone} onChange={(e) => setCb({ ...cb, phone: e.target.value })} style={{ marginBottom: 10 }} />
                  <input className="bk-fld" placeholder="Email ID" value={cb.email} onChange={(e) => setCb({ ...cb, email: e.target.value })} style={{ marginBottom: 12 }} />
                  <button className="td-side-submit" type="submit" disabled={cbLoading} style={{ width: "100%" }}>{cbLoading ? "Sending…" : "Submit Request"}</button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* mobile sticky book bar */}
      <div className="td-mobile-bar">
        <div><b>₹{Number(item.price || 0).toLocaleString("en-IN")}</b> <span>/ person</span></div>
        <button className="td-side-book" style={{ width: "auto", margin: 0, padding: "12px 28px" }} onClick={book}>Book Now</button>
      </div>
    </div>
  );
};

export default TripDetailV3;
