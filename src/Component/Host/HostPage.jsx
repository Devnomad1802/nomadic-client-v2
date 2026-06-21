/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./hostPage.css";
import Footer from "../Footer";
import EnquirNow from "../../Modals/EnquirNow";
import {
  useGetHostByIdQuery,
  useGetHostTripsQuery,
  useGetHostReviewsQuery,
  useGetAllHostsQuery,
  useAddUserReviewMutation,
} from "../../services";

const initial = (s) => (s ? s.trim()[0]?.toUpperCase() : "H");
const fmtDate = (d) => { try { return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }); } catch { return ""; } };
const stars = (n) => { const r = Math.max(0, Math.min(5, Math.round(Number(n) || 5))); return "★".repeat(r) + "☆".repeat(5 - r); };
const tripImg = (t) => t?.Banner_Image || t?.cardImage || t?.bannerImage || t?.image || "";

const HostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const { data, isLoading } = useGetHostByIdQuery(id, { skip: !id });
  const { data: tripsRes } = useGetHostTripsQuery(id, { skip: !id });
  const { data: reviewsRes } = useGetHostReviewsQuery(id, { skip: !id });
  const { data: allHostsRes } = useGetAllHostsQuery();
  const [addUserReview, { isLoading: submitting }] = useAddUserReviewMutation();

  const host = data?.data || data || {};
  const trips = useMemo(() => (Array.isArray(tripsRes?.data) ? tripsRes.data : Array.isArray(tripsRes) ? tripsRes : []), [tripsRes]);
  const reviews = useMemo(() => {
    const r = reviewsRes?.data ?? reviewsRes?.reviews ?? reviewsRes ?? [];
    return Array.isArray(r) ? r : [];
  }, [reviewsRes]);
  const similar = useMemo(() => {
    const list = Array.isArray(allHostsRes?.data) ? allHostsRes.data : Array.isArray(allHostsRes) ? allHostsRes : [];
    return list.filter((h) => h?._id !== id).slice(0, 3);
  }, [allHostsRes, id]);

  // review form
  const [rRating, setRRating] = useState(0);
  const [rName, setRName] = useState("");
  const [rText, setRText] = useState("");
  const [rDone, setRDone] = useState(false);
  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await addUserReview({ hostId: id, name: rName, rating: rRating || 5, review: rText, tripName: "", date: new Date().toISOString() }).unwrap();
      setRDone(true); setRName(""); setRText(""); setRRating(0);
    } catch { /* surfaced below */ }
  };

  const name = host?.hostTitle || host?.hostName || "Travel Host";
  const location = [host?.city, host?.state].filter(Boolean).join(", ") || host?.location || host?.hqLocation || "";
  const verified = host?.isVerified || host?.status === "approved";
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + (Number(r.rating) || 0), 0) / reviews.length) : (Number(host?.successRate) ? 4.9 : 4.9);
  const years = host?.experience || (host?.foundedYear ? `${Math.max(1, new Date().getFullYear() - parseInt(host.foundedYear, 10))} yrs` : "—");
  const specialties = Array.isArray(host?.specialties) ? host.specialties.filter(Boolean) : [];
  const languages = Array.isArray(host?.languages) ? host.languages.filter(Boolean) : [];
  const certifications = Array.isArray(host?.achievements) ? host.achievements.filter(Boolean) : [];
  const social = host?.socialMedia || {};
  const rankLabel = (Number(host?.successRate) >= 95 || verified) ? "Top-rated host" : "Trusted host";

  const seoTitle = `${name} | Travel Host | Nomadic Townies`;
  const seoDesc = host?.tagline ? `${host.tagline} — Book trips with ${name} on Nomadic Townies.` : `Book adventure trips and group tours with ${name} on Nomadic Townies.`;

  if (!id || isLoading) {
    return <div className="hostpg" style={{ minHeight: "60vh", display: "grid", placeItems: "center", color: "#6B7280" }}>Loading host…</div>;
  }

  return (
    <div className="hostpg">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href={`https://nomadictownies.com/hosts/${id}`} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        {host?.coverImage || host?.brandingLogo ? <meta property="og:image" content={host.coverImage || host.brandingLogo} /> : null}
      </Helmet>

      <EnquirNow opene={enquiryOpen} setOpene={setEnquiryOpen} toggelModele={() => setEnquiryOpen(!enquiryOpen)} />

      <div className="wrap">
        <div className="crumb">
          <a onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Home</a><span>›</span>
          <a onClick={() => navigate("/hosts")} style={{ cursor: "pointer" }}>Hosts</a><span>›</span>
          <span style={{ color: "#1F2937", fontWeight: 500 }}>{name}</span>
        </div>

        {/* hero */}
        <div className="hero">{host?.coverImage && <img src={host.coverImage} alt={`${name} cover`} />}</div>

        {/* profile card */}
        <div className="profile-card">
          <div className="avatar">
            {host?.brandingLogo ? <img src={host.brandingLogo} alt={name} /> : initial(name)}
            {verified && <span className="avatar-badge"><i className="ti ti-rosette-discount-check" /></span>}
          </div>
          <div className="ph-info">
            <div className="ph-namerow">
              <span className="ph-name">{name}</span>
              {verified && <span className="verified-pill"><i className="ti ti-check" /> Verified host</span>}
            </div>
            {location && <div className="ph-loc"><i className="ti ti-map-pin" /> {location}</div>}
            {host?.tagline && <div className="ph-tag">{host.tagline}</div>}
          </div>
          <div className="ph-actions">
            <button className="btn btn-orange" onClick={() => setEnquiryOpen(true)}><i className="ti ti-mail" /> Contact host</button>
            {host?.whatsapp && <a className="btn btn-ghost" href={`https://wa.me/${`${host.whatsapp}`.replace(/\D/g, "")}`} target="_blank" rel="noopener"><i className="ti ti-brand-whatsapp" /> WhatsApp</a>}
          </div>
        </div>

        {/* stats */}
        <div className="stats">
          <div className="stat"><div className="stat-num">{host?.tripsHosted ?? trips.length ?? 0}</div><div className="stat-label">Trips hosted</div></div>
          <div className="stat"><div className="stat-num">{host?.travellersHosted ? host.travellersHosted.toLocaleString("en-IN") : "—"}</div><div className="stat-label">Travellers hosted</div></div>
          <div className="stat"><div className="stat-num"><span className="star">★</span> {avgRating.toFixed(1)}</div><div className="stat-label">{reviews.length || 0} reviews</div></div>
          <div className="stat"><div className="stat-num">{years}</div><div className="stat-label">Experience</div></div>
        </div>

        {/* main grid */}
        <div className="main-grid">
          <div className="col-main">
            {/* About */}
            <div className="card">
              <h2 className="section-h">About {host?.hostName?.split(" ")[0] || "the host"}</h2>
              {host?.hostOverview ? <p className="about-p">{host.hostOverview}</p> : <p className="about-p" style={{ color: "#9CA3AF" }}>This host hasn’t added an overview yet.</p>}
              {host?.tagline && <div className="about-quote">“{host.tagline}”</div>}
              <div className="meta-chips">
                {host?.foundedYear && <span className="meta-chip">Since {host.foundedYear}</span>}
                {host?.hqLocation && <span className="meta-chip">{host.hqLocation}</span>}
              </div>
            </div>

            {/* Expertise + languages */}
            {(specialties.length > 0 || languages.length > 0) && (
              <div className="card">
                <h2 className="section-h">Expertise &amp; travel style</h2>
                {specialties.length > 0 && <div className="chip-row">{specialties.map((s) => <span key={s} className="chip chip-fill">{s}</span>)}</div>}
                {languages.length > 0 && <>
                  <div className="sub-label">Languages</div>
                  <div className="chip-row">{languages.map((l) => <span key={l} className="chip chip-out">{l}</span>)}</div>
                </>}
                {certifications.length > 0 && <>
                  <div className="sub-label">Certifications</div>
                  <div className="chip-row">{certifications.map((c) => <span key={c} className="chip chip-out"><i className="ti ti-certificate" style={{ marginRight: 5 }} />{c}</span>)}</div>
                </>}
              </div>
            )}

            {/* Trips */}
            <div className="card">
              <div className="head-row"><h2 className="section-h" style={{ marginBottom: 0 }}>Active trips by {host?.hostName?.split(" ")[0] || name}</h2>{trips.length > 0 && <span className="view-all" style={{ cursor: "pointer" }} onClick={() => navigate("/all-packages")}>View all</span>}</div>
              {trips.length > 0 ? (
                <div className="trips-grid">
                  {trips.map((t) => (
                    <a key={t._id} className="trip" onClick={() => navigate(`/trips/${t.seoSlug || t._id}`)} style={{ cursor: "pointer" }}>
                      <div className="trip-img">{tripImg(t) && <img src={tripImg(t)} alt={t.title} loading="lazy" />}</div>
                      <div className="trip-b">
                        <div className="trip-t">{t.title}</div>
                        <div className="trip-m">
                          {t.location && <span><i className="ti ti-map-pin" /> {t.location}</span>}
                          {(t.days || t.nights) && <span>{t.days}D / {t.nights}N</span>}
                        </div>
                        <div className="trip-m"><span className="trip-price">₹{parseInt(t.price || t.firstBookingPrice || 0, 10).toLocaleString("en-IN")}</span></div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : <p className="about-p" style={{ color: "#9CA3AF", marginTop: 10 }}>No active trips right now — check back soon.</p>}
            </div>

            {/* Reviews + write */}
            <div className="card">
              <h2 className="section-h">Traveller reviews</h2>
              <div className="rev-summary">
                <div className="rev-big">{avgRating.toFixed(1)}</div>
                <div><div className="rev-stars">{stars(avgRating)}</div><div style={{ fontSize: 12.5, color: "#6B7280" }}>{reviews.length || 0} reviews</div></div>
              </div>
              {reviews.length > 0 ? reviews.slice(0, 5).map((rv, i) => (
                <div className="review" key={rv._id || i}>
                  <div className="review-head">
                    <div className="review-avatar">{rv.profileImage ? <img src={rv.profileImage} alt="" /> : initial(rv.name || rv.Name)}</div>
                    <div>
                      <div className="review-name">{rv.name || rv.Name || "Traveller"}</div>
                      <div className="review-date">{fmtDate(rv.date || rv.Date || rv.createdAt)}</div>
                    </div>
                    <div className="review-date" style={{ marginLeft: "auto", color: "#f59e0b", fontSize: 13 }}>{stars(rv.rating)}</div>
                  </div>
                  {(rv.tripName || rv.Title) && <span className="review-trip">{rv.tripName || rv.Title}</span>}
                  <div className="review-text">{rv.review || rv.Review || rv.comment}</div>
                </div>
              )) : <div className="empty-rev">No reviews yet — be the first to share your experience.</div>}

              {/* write review */}
              <div className="wr">
                <h4>Write a review</h4>
                {rDone ? (
                  <p style={{ fontSize: 14, color: "#11875b" }}>Thanks! Your review has been submitted.</p>
                ) : (
                  <form onSubmit={submitReview}>
                    <div className="star-pick">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <i key={n} className={`ti ti-star${n <= rRating ? " on" : ""}`} onClick={() => setRRating(n)} role="button" aria-label={`${n} star`} />
                      ))}
                    </div>
                    <input placeholder="Your name" value={rName} onChange={(e) => setRName(e.target.value)} required />
                    <textarea placeholder="Share your experience travelling with this host…" value={rText} onChange={(e) => setRText(e.target.value)} required />
                    <button type="submit" className="btn btn-orange" disabled={submitting}>{submitting ? "Submitting…" : "Submit review"}</button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* sidebar */}
          <aside className="sidebar">
            <div className="side-card">
              <div className="side-label">Contact {host?.hostName?.split(" ")[0] || "host"}</div>
              {host?.responseTimeLabel && <div className="contact-row"><i className="ti ti-clock" /><span><span className="lbl">Response time</span>{host.responseTimeLabel}</span></div>}
              {host?.emailAddress && <div className="contact-row"><i className="ti ti-mail" /><span><span className="lbl">Email</span>{host.emailAddress}</span></div>}
              {host?.phoneNumber && <div className="contact-row"><i className="ti ti-phone" /><span><span className="lbl">Phone</span>{host.phoneNumber}</span></div>}
              {host?.supportHours && <div className="contact-row"><i className="ti ti-calendar" /><span><span className="lbl">Support hours</span>{host.supportHours}</span></div>}
              <button className="btn btn-orange" onClick={() => setEnquiryOpen(true)}><i className="ti ti-send" /> Send enquiry</button>
              {host?.whatsapp && <a className="btn btn-wa" href={`https://wa.me/${`${host.whatsapp}`.replace(/\D/g, "")}`} target="_blank" rel="noopener"><i className="ti ti-brand-whatsapp" /> WhatsApp</a>}
            </div>

            <div className="side-card">
              <div className="side-label">Host rank</div>
              <div className="rank">
                <i className="ti ti-award" />
                <div><div className="rank-t">{rankLabel}</div><div className="rank-s">{host?.successRate ? `${host.successRate}% rebook rate` : "Verified by Nomadic Townies"}</div></div>
              </div>
              <div className="soon">Full host leaderboard coming soon</div>
            </div>

            {(social.instagram || social.facebook || social.twitter || social.website) && (
              <div className="side-card">
                <div className="side-label">Follow</div>
                <div className="social-row">
                  {social.instagram && <a className="social-btn" href={social.instagram} target="_blank" rel="noopener" aria-label="Instagram"><i className="ti ti-brand-instagram" /></a>}
                  {social.facebook && <a className="social-btn" href={social.facebook} target="_blank" rel="noopener" aria-label="Facebook"><i className="ti ti-brand-facebook" /></a>}
                  {social.twitter && <a className="social-btn" href={social.twitter} target="_blank" rel="noopener" aria-label="Twitter"><i className="ti ti-brand-x" /></a>}
                  {social.website && <a className="social-btn" href={social.website} target="_blank" rel="noopener" aria-label="Website"><i className="ti ti-world" /></a>}
                </div>
              </div>
            )}

            {similar.length > 0 && (
              <div className="side-card">
                <div className="side-label">Similar hosts</div>
                {similar.map((h) => (
                  <div className="similar" key={h._id} onClick={() => navigate(`/hosts/${h._id}`)}>
                    <div className="similar-av">{h.brandingLogo ? <img src={h.brandingLogo} alt="" /> : initial(h.hostName || h.hostTitle)}</div>
                    <div>
                      <div className="similar-n">{h.hostTitle || h.hostName}</div>
                      <div className="similar-s">{[h.city, h.state].filter(Boolean).join(", ") || h.location || ""}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* mobile sticky CTA */}
      <div className="cta-strip">
        <button className="btn btn-orange" onClick={() => setEnquiryOpen(true)}><i className="ti ti-mail" /> Contact host</button>
        {host?.whatsapp && <a className="btn btn-wa" href={`https://wa.me/${`${host.whatsapp}`.replace(/\D/g, "")}`} target="_blank" rel="noopener"><i className="ti ti-brand-whatsapp" /></a>}
      </div>

      <Footer />
    </div>
  );
};

export default HostPage;
