/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./meetHosts.css";
import Footer from "../Component/Footer";
import { useGetAllHostsQuery } from "../services";

const HERO_IMG = "https://images.unsplash.com/photo-1454942901704-3c44c11b2ad1?auto=format&fit=crop&w=1600&q=70";
const BECOME_IMG = "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1400&q=70";
// Clean default cover when a host has no image (no random initials / blank cards)
const DEFAULT_COVER = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=65";
const DEFAULT_BIO = "Curating meaningful travel experiences with Nomadic Townies.";
const truncate = (s, n) => { const t = `${s || ""}`.trim(); return t.length > n ? `${t.slice(0, n).trim()}…` : t; };
// Neutral default avatar icon (used instead of raw initials when no logo)
const AvatarFallback = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);

const StarSvg = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.8 6.6 20l1-6.1L3.2 9.5l6.1-.9L12 3Z" /></svg>);
const PinSvg = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>);

const MeetHosts = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllHostsQuery();
  const hosts = useMemo(() => {
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    return list.filter((h) => h?.isActive !== false);
  }, [data]);

  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [loc, setLoc] = useState("All");
  const [spec, setSpec] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const card = (h) => ({
    id: h?._id,
    name: h?.hostTitle || h?.hostName || "Host",
    specialty: (Array.isArray(h?.specialties) && h.specialties[0]) || h?.hostTitle || "",
    location: [h?.city, h?.state].filter(Boolean).join(", ") || h?.location || "",
    // Card description fallback chain: shortBio → cardDescription → about(trunc) → tagline → safe default
    bio: h?.shortBio || h?.cardDescription || truncate(h?.hostOverview, 150) || h?.tagline || DEFAULT_BIO,
    image: h?.coverImage || h?.brandingLogo || DEFAULT_COVER,
    logo: h?.brandingLogo || "",
    rating: Number(h?.rating) || 4.9,
    experiences: h?.tripsHosted ?? 0,
    verified: h?.isVerified || h?.status === "approved",
    specialties: Array.isArray(h?.specialties) ? h.specialties : [],
    raw: h,
  });

  const cards = useMemo(() => hosts.map(card), [hosts]);

  const locations = useMemo(() => ["All", ...Array.from(new Set(cards.map((c) => c.location).filter(Boolean)))], [cards]);
  const specialties = useMemo(() => ["All", ...Array.from(new Set(cards.flatMap((c) => c.specialties).filter(Boolean)))], [cards]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cards.filter((c) => {
      if (verifiedOnly && !c.verified) return false;
      if (loc !== "All" && c.location !== loc) return false;
      if (spec !== "All" && !c.specialties.includes(spec)) return false;
      if (q) {
        const hay = [c.name, c.location, c.bio, ...c.specialties].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [cards, search, loc, spec, verifiedOnly]);

  return (
    <div className="mhpg">
      <Helmet>
        <title>Meet Our Hosts | Verified Travel Hosts | Nomadic Townies</title>
        <meta name="description" content="Discover verified Nomadic Townies hosts — local experts, retreat leaders and community guides curating meaningful travel experiences across India and beyond." />
        <link rel="canonical" href="https://nomadictownies.com/hosts" />
        <meta property="og:title" content="Meet Our Hosts | Nomadic Townies" />
        <meta property="og:description" content="Discover verified hosts curating meaningful travel experiences." />
      </Helmet>

      {/* HERO */}
      <section className="hero">
        <img src={HERO_IMG} alt="Travellers and hosts in the mountains" />
        <div className="hero-inner">
          <div className="wrap">
            <div className="hero-eyebrow">The people behind the journeys</div>
            <h1>Meet the hosts behind the experiences</h1>
            <p className="sub">Discover verified hosts, creators, retreat leaders, local experts, and communities curating meaningful travel experiences.</p>
          </div>
        </div>
      </section>

      <div className="wrap">
        {/* SEARCH */}
        <div className="search-bar">
          <svg className="search-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setSearch(draft)}
            placeholder="Search hosts by name, location or specialty…"
          />
          <button className="go" onClick={() => setSearch(draft)}>Search</button>
        </div>

        {/* FILTERS (only those backed by real data) */}
        <div className="filters">
          <span className={`filter-sel${loc !== "All" ? " active" : ""}`}>
            <PinSvg />
            <select value={loc} onChange={(e) => setLoc(e.target.value)}>
              {locations.map((l) => <option key={l} value={l}>{l === "All" ? "Location" : l}</option>)}
            </select>
          </span>
          <span className={`filter-sel${spec !== "All" ? " active" : ""}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
            <select value={spec} onChange={(e) => setSpec(e.target.value)}>
              {specialties.map((s) => <option key={s} value={s}>{s === "All" ? "Specialty" : s}</option>)}
            </select>
          </span>
          <div className={`filter-verified${verifiedOnly ? " on" : ""}`} onClick={() => setVerifiedOnly((v) => !v)} role="button" tabIndex={0}>
            <span className="toggle-sw" /> Verified only
          </div>
        </div>

        <div className="result-line"><b>{filtered.length}</b> host{filtered.length === 1 ? "" : "s"}{search || loc !== "All" || spec !== "All" || verifiedOnly ? " match your filters" : ""}</div>

        {/* GRID */}
        {isLoading ? (
          <div className="cat-loading">Loading hosts…</div>
        ) : filtered.length > 0 ? (
          <div className="host-grid">
            {filtered.map((c) => (
              <a key={c.id} className="host-card" onClick={() => { navigate(`/hosts/${c.id}`); window.scrollTo(0, 0); }}>
                <div className="host-cover">
                  {c.image ? <img src={c.image} alt={c.name} loading="lazy" /> : null}
                  <div className="host-badges">
                    {c.verified && <span className="badge badge-verified"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2Z" /></svg>Verified</span>}
                  </div>
                  <div className="host-avatar">{c.logo ? <img src={c.logo} alt={c.name} /> : <AvatarFallback />}</div>
                  <span className="host-rating-pill"><StarSvg />{c.rating.toFixed(1)}</span>
                </div>
                <div className="host-body">
                  <div className="host-name-row">
                    <span className="host-name">{c.name}</span>
                    {c.verified && <span className="vrf"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2Z" /></svg></span>}
                  </div>
                  {c.location && <div className="host-loc"><PinSvg />{c.location}</div>}
                  {c.specialty && <span className="host-specialty">{c.specialty}</span>}
                  {c.bio && <p className="host-bio">{c.bio}</p>}
                  <div className="host-foot">
                    <span className="host-exp"><b>{c.experiences}</b> experience{c.experiences === 1 ? "" : "s"}</span>
                    <span className="host-view">View Profile <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="empty">No hosts match your search — try clearing the filters.</div>
        )}

        {/* BECOME A HOST */}
        <section className="become">
          <img src={BECOME_IMG} alt="" />
          <div className="become-inner">
            <div className="become-eyebrow">For hosts &amp; organizers</div>
            <h2>Share what you love. Host with us.</h2>
            <p>Reach a community of travellers who are actively looking for real, meaningful experiences — not tourist traps. We curate, verify, and help you fill your trips.</p>
            <div className="become-actions">
              <a className="btn-light" onClick={() => navigate("/become-a-host")} style={{ cursor: "pointer" }}>
                Become a Host
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </a>
              <a className="btn-outline" onClick={() => navigate("/about-us")} style={{ cursor: "pointer" }}>How it works</a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default MeetHosts;
