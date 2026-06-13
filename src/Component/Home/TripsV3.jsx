/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VerifiedIcon from "@mui/icons-material/Verified";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useGetTripsQuery } from "../../services/TripApis";
import { useGetAllCategoriesQuery } from "../../services/categoriesApis";
import { TripCardSkeleton } from "../../SmallComponents/Skeletons";

const inCategory = (t, cat) =>
  Array.isArray(t?.categories) &&
  t.categories.some((c) => (c || "").toLowerCase() === cat.toLowerCase());

const nextBatchDate = (trip) => {
  let batches = [];
  try {
    batches = trip?.selectDate ? (typeof trip.selectDate === "string" ? JSON.parse(trip.selectDate) : trip.selectDate) : [];
  } catch { batches = []; }
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const upcoming = (Array.isArray(batches) ? batches : [])
    .map((b) => b?.BatchDate && new Date(b.BatchDate))
    .filter((d) => d && !isNaN(d) && d >= now)
    .sort((a, b) => a - b);
  return upcoming[0] || null;
};

const fmtDate = (d) => d ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : null;
const initial = (name) => (name ? name.trim()[0]?.toUpperCase() : "N");

const TripsV3 = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetTripsQuery();
  const { data: catData } = useGetAllCategoriesQuery();
  const [filter, setFilter] = useState("All");

  const filters = useMemo(() => {
    const names = Array.isArray(catData?.data)
      ? catData.data.map((c) => c?.Category).filter(Boolean)
      : [];
    return ["All", ...names];
  }, [catData]);

  const trips = useMemo(() => {
    const all = Array.isArray(data?.data) ? data.data : [];
    // only trips with an upcoming batch, sorted by soonest
    const upcoming = all
      .map((t) => ({ t, next: nextBatchDate(t) }))
      .filter((x) => x.next)
      .sort((a, b) => a.next - b.next)
      .map((x) => x.t);
    const list = filter === "All" ? upcoming : upcoming.filter((t) => inCategory(t, filter));
    return list.slice(0, 8);
  }, [data, filter]);

  return (
    <section className="section" id="upcoming">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <div className="section-label"><span className="section-label-bar" />Hand-picked &amp; host-verified</div>
            <h2 className="section-h">Upcoming Trips</h2>
            <p className="section-sub" style={{ marginTop: 8 }}>Curated experiences leaving in the next few weeks — browse, filter and book your spot.</p>
          </div>
          <Link to="/all-packages" className="btn btn-outline btn-md">
            View All Packages <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </Link>
        </div>

        <div className="chips-row">
          {filters.map((f) => (
            <button key={f} className={`chip${filter === f ? " on" : ""}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>

        {isLoading ? (
          <TripCardSkeleton count={4} />
        ) : trips.length === 0 ? (
          <p className="section-sub">No upcoming trips in this category right now — check back soon.</p>
        ) : (
          <div className="trips-grid">
            {trips.map((trip) => {
              const date = fmtDate(nextBatchDate(trip));
              const tags = (Array.isArray(trip.categories) ? trip.categories : []).slice(0, 2);
              const verified = Boolean(trip?.host);
              return (
                <Link key={trip._id} to={`/trips/${trip.seoSlug || trip._id}`} className="tc">
                  <div className="tc-img">
                    {trip.cardImage
                      ? <img className="tc-img-inner" src={trip.cardImage} alt={trip.title} loading="lazy" />
                      : <div className="tc-img-inner" style={{ background: "linear-gradient(135deg,#2c3e50,#4a6741)" }} />}
                    <button className="tc-fav" aria-label="Save" onClick={(e) => { e.preventDefault(); e.currentTarget.classList.toggle("on"); }}>
                      <FavoriteIcon sx={{ fontSize: 14 }} />
                    </button>
                    {trip.tripOff ? <span className="tc-off">{trip.tripOff}% OFF</span> : null}
                    {tags.length > 0 && (
                      <div className="tc-tags">{tags.map((t, i) => <span className="tc-tag" key={i}>{t}</span>)}</div>
                    )}
                  </div>
                  <div className="tc-body">
                    <div className="tc-host">
                      <div className="tc-avatar">{initial(trip?.host?.hostName)}</div>
                      <span>Hosted by <b style={{ color: "var(--text-dark)" }}>{trip?.host?.hostName || "Nomadic Townies"}</b></span>
                      {verified && <span className="tc-verified"><VerifiedIcon sx={{ fontSize: 13 }} />Verified</span>}
                    </div>
                    <h3 className="tc-title">{trip.title}</h3>
                    <div className="tc-meta">
                      {trip.location && <span className="tc-meta-item"><PlaceOutlinedIcon sx={{ fontSize: 12 }} />{trip.location}</span>}
                      {(trip.nights || trip.days) && <span className="tc-meta-item"><AccessTimeIcon sx={{ fontSize: 12 }} />{trip.nights}N / {trip.days}D</span>}
                      {date && <span className="tc-meta-item"><CalendarTodayIcon sx={{ fontSize: 11 }} />{date}</span>}
                    </div>
                    <div className="tc-foot">
                      <div className="tc-price">
                        <b>₹{Number(trip.price || 0).toLocaleString("en-IN")}</b>
                        {trip.strikePrice ? <s>₹{Number(trip.strikePrice).toLocaleString("en-IN")}</s> : null}
                        <em>/ person</em>
                      </div>
                      <span className="btn btn-outline btn-sm" onClick={(e) => { e.preventDefault(); navigate(`/trips/${trip.seoSlug || trip._id}`); }}>View</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TripsV3;
