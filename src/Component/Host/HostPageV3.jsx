/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./hostV3.css";
import { useGetHostByIdQuery, useGetHostTripsQuery, useGetAllReviewsQuery } from "../../services";
import EnquirNow from "../../Modals/EnquirNow";

const initial = (n) => (n ? n.trim()[0]?.toUpperCase() : "H");
const avg = (r) => {
  if (Array.isArray(r) && r.length) { const n = r.map(Number).filter((x) => !isNaN(x)); return n.length ? (n.reduce((a, b) => a + b, 0) / n.length) : 4.9; }
  const x = Number(r); return isNaN(x) || !x ? 4.9 : x;
};

const HostPageV3 = () => {
  const { id } = useParams();
  const { data: hostRes } = useGetHostByIdQuery(id, { skip: !id });
  const { data: tripsRes } = useGetHostTripsQuery(id, { skip: !id });
  const { data: revRes } = useGetAllReviewsQuery();
  const host = hostRes?.data || {};
  const trips = useMemo(() => (Array.isArray(tripsRes?.data) ? tripsRes.data : []), [tripsRes]);
  const reviews = useMemo(() => (Array.isArray(revRes?.data) ? revRes.data : []).slice(0, 6), [revRes]);

  const [tab, setTab] = useState("About");
  const [opene, setOpene] = useState(false);

  const specialties = Array.isArray(host.specialties) ? host.specialties : [];
  const languages = Array.isArray(host.languages) ? host.languages : [];
  const achievements = Array.isArray(host.achievements) ? host.achievements : [];
  const gallery = Array.isArray(host.gallery) ? host.gallery : [];
  const ratingNum = reviews.length ? (reviews.reduce((a, r) => a + avg(r.rating), 0) / reviews.length) : 4.9;

  const TripCard = (t, i) => (
    <Link key={t?._id || i} to={`/trips/${t?.seoSlug || t?._id}`} className="trip-card">
      <div className="trip-img">
        {t?.cardImage ? <img className="ph" src={t.cardImage} alt={t?.title} loading="lazy" style={{ objectFit: "cover" }} /> : <div className={`ph ph-${(i % 4) + 1}`} />}
        <span className="trip-rating-pill">★ {avg(t?.ratings).toFixed(1)}</span>
        {t?.Trending ? <span className="trip-tag">Trending</span> : null}
      </div>
      <div className="trip-body">
        <h3 className="trip-name">{t?.title}</h3>
        <div className="trip-meta"><span>📍 {t?.location || "—"}</span>{(t?.nights || t?.days) && <><span className="trip-meta-dot" /><span>{t.days}D/{t.nights}N</span></>}</div>
        <div className="trip-foot">
          <div className="trip-price"><b>₹{Number(t?.price || 0).toLocaleString("en-IN")}</b><em>/ person</em></div>
          <div className="trip-arrow">View →</div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="hpv3">
      <Helmet>
        <title>{host?.hostName ? `${host.hostName} — Host | Nomadic Townies` : "Host | Nomadic Townies"}</title>
        <meta name="description" content={host?.hostOverview?.slice(0, 155) || "Meet a verified Nomadic Townies host."} />
      </Helmet>
      <EnquirNow opene={opene} setOpene={setOpene} toggelModele={() => setOpene(!opene)} />

      <div className="wrap">
        <div className="crumb"><Link to="/">Home</Link> › <span className="cur">{host?.hostName || "Host"}</span></div>

        {/* hero */}
        <div className="hero">
          {host?.coverImage ? <img src={host.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div className="hero-bg" />}
        </div>

        {/* profile header */}
        <div className="profile-card">
          <div className="avatar">
            {host?.brandingLogo ? <img src={host.brandingLogo} alt={host?.hostName} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : initial(host?.hostName)}
            {host?.isVerified && <span className="avatar-badge">✓</span>}
          </div>
          <div className="profile-info">
            <div className="name-row">
              <h1 className="name">{host?.hostName || "Host"}</h1>
              {host?.isVerified && <span className="verified-pill">✓ Verified</span>}
            </div>
            <div className="title-line">{host?.hostTitle || host?.tagline || "Experience Host"}</div>
            <div className="meta-line">
              {host?.hqLocation && <span>📍 {host.hqLocation}</span>}
              {host?.experience && <span>🗓 {host.experience}</span>}
              {host?.responseTimeLabel && <span>⚡ {host.responseTimeLabel}</span>}
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn btn-orange" onClick={() => setOpene(true)}>Enquire</button>
          </div>
        </div>

        {/* stats */}
        <div className="stats">
          <div className="stat"><div className="stat-num">{host?.tripsHosted ?? trips.length}</div><div className="stat-label">TRIPS HOSTED</div></div>
          <div className="stat"><div className="stat-num"><span className="star">★</span> {ratingNum.toFixed(1)}</div><div className="stat-label">RATING</div></div>
          <div className="stat"><div className="stat-num">{reviews.length}</div><div className="stat-label">REVIEWS</div></div>
          <div className="stat"><div className="stat-num">{host?.successRate ? `${host.successRate}%` : "—"}</div><div className="stat-label">SUCCESS RATE</div></div>
        </div>

        {/* main grid */}
        <div className="main-grid">
          <div>
            <div className="tabs">
              {["About", `Trips (${trips.length})`, `Reviews (${reviews.length})`, "Gallery"].map((label) => {
                const key = label.split(" ")[0];
                return <button key={key} className={`tab${tab === key ? " on" : ""}`} onClick={() => setTab(key)}>{label}</button>;
              })}
            </div>

            {tab === "About" && (
              <>
                <div className="section">
                  <h2 className="section-h">About {host?.hostName?.split(" ")[0] || "the host"}</h2>
                  <p className="about-p">{host?.hostOverview || "This host curates meaningful, community-first travel experiences."}</p>
                  {host?.tagline && <div className="about-quote">“{host.tagline}”</div>}
                </div>

                {specialties.length > 0 && (
                  <div className="section">
                    <h2 className="section-h">Specialities</h2>
                    <div className="chip-row">{specialties.map((s, i) => <span className="spec-chip" key={i}>✦ {s}</span>)}</div>
                  </div>
                )}

                {languages.length > 0 && (
                  <div className="section">
                    <h2 className="section-h">Languages</h2>
                    <div className="chip-row">{languages.map((l, i) => <span className="spec-chip" key={i}>🗣 {l}</span>)}</div>
                  </div>
                )}

                {achievements.length > 0 && (
                  <div className="section">
                    <h2 className="section-h">Why travellers come back to {host?.hostName?.split(" ")[0] || "this host"}</h2>
                    <div className="highlights">
                      {achievements.map((a, i) => (
                        <div className="highlight" key={i}><div className="highlight-ic">★</div><div className="highlight-text">{a}</div></div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {tab === "Trips" && (
              <div className="section">
                <h2 className="section-h">Active trips by {host?.hostName?.split(" ")[0] || "this host"}</h2>
                {trips.length ? <div className="trips-grid">{trips.map(TripCard)}</div> : <p>No active trips right now.</p>}
              </div>
            )}

            {tab === "Reviews" && (
              <div className="section">
                <h2 className="section-h">Traveller reviews</h2>
                {reviews.length ? reviews.map((r, i) => (
                  <div className="review" key={r?._id || i}>
                    <div className="review-head">
                      <div className="review-avatar">{initial(r?.Name)}</div>
                      <div><div className="review-name">{r?.Name}</div><div className="review-date">{r?.Job || "Traveller"}</div></div>
                      <div className="review-stars">{"★".repeat(Math.round(avg(r?.rating)))}</div>
                    </div>
                    <p className="review-text">“{r?.Review}”</p>
                  </div>
                )) : <p>No reviews yet.</p>}
              </div>
            )}

            {tab === "Gallery" && (
              <div className="section">
                <h2 className="section-h">Gallery</h2>
                {gallery.length ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                    {gallery.map((g, i) => <img key={i} src={g} alt="" loading="lazy" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12 }} />)}
                  </div>
                ) : <p>No gallery photos yet.</p>}
              </div>
            )}
          </div>

          {/* sidebar */}
          <aside className="sidebar">
            <div className="contact-card">
              <h4>Contact {host?.hostName?.split(" ")[0] || "host"}</h4>
              {host?.phoneNumber && <div className="contact-row">📞 <div><span className="label">Phone</span><b>{host.phoneNumber}</b></div></div>}
              {host?.emailAddress && <div className="contact-row">✉️ <div><span className="label">Email</span><b>{host.emailAddress}</b></div></div>}
              {host?.supportHours && <div className="contact-row">🕑 <div><span className="label">Support hours</span><b>{host.supportHours}</b></div></div>}
              <button className="contact-cta" onClick={() => setOpene(true)}>Send an enquiry</button>
              {host?.whatsapp && <a className="contact-secondary" href={`https://wa.me/${host.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">WhatsApp</a>}
            </div>

            <div className="trust-card">
              <h4>Verified by Nomadic Townies</h4>
              <div className="trust-item">✓ Identity &amp; documents verified</div>
              <div className="trust-item">✓ Experiences reviewed by our team</div>
              <div className="trust-item">✓ Secure payments &amp; support</div>
            </div>

            {(host?.responseTimeLabel || host?.successRate) && (
              <div className="response-card">
                <h4>This host is on a streak</h4>
                <p>Quick to respond and consistently rated by travellers.</p>
                {host?.responseTimeLabel && <div className="row"><span>Response time</span><b>{host.responseTimeLabel}</b></div>}
                {host?.successRate ? <div className="row"><span>Success rate</span><b>{host.successRate}%</b></div> : null}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HostPageV3;
