/* eslint-disable react/prop-types */
/**
 * Paymentsuccess.jsx — Booking Success / Confirmation (scoped .bkpg).
 * Reads the saved booking doc from location.state.data (newBooking response).
 * No backend change — all fields already persisted.
 */
import { Helmet } from "react-helmet-async";
import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./booking.css";

const fmtDate = (d) => {
  if (!d) return "—";
  const x = new Date(d);
  if (Number.isNaN(x.getTime())) return `${d}`;
  return x.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};
const inr = (n) => `₹${Math.round(Number(n) || 0).toLocaleString("en-IN")}`;

const Paymentsuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = location?.state || {};

  const safeParse = (s, fb = null) => {
    try { if (!s) return fb; return typeof s === "string" ? JSON.parse(s) : s; } catch { return fb; }
  };
  const CardData = safeParse(data?.cardData, { cardSectionData: [], cardDate: {}, gstTax: 0 });
  const PaymentDetail = safeParse(data?.paymentDetail, { title: "", location: "" });

  useEffect(() => { if (!data) navigate("/"); }, [data, navigate]);

  const { travellers, paymentStatus, bookingId, roomType } = data || {};
  const travArr = Array.isArray(travellers) ? travellers : [];
  const lead = travArr.find((t) => t?.isLead) || travArr[0];

  const fullTotal = useMemo(() => {
    const base = (CardData?.cardSectionData || []).reduce((s, i) => s + Number(i.TitlePrice || 0) * (i.quantity || 1), 0);
    return Math.round(base - (Number(data?.coupenDiscount) || 0) + (Number(CardData?.gstTax) || 0));
  }, [CardData, data]);

  const amountPaid = Number(data?.total) || 0;
  const isPartial = paymentStatus === "firstPayment";
  const remaining = isPartial ? Math.max(0, fullTotal - amountPaid) : 0;

  const batchRange = data?.batchDate
    || (CardData?.cardDate?.batchDate
      ? `${fmtDate(CardData.cardDate.batchDate)} - ${fmtDate(CardData.cardDate.endSelectDate)}`
      : "—");

  if (!data) return null;

  return (
    <div className="bkpg">
      <Helmet><title>Booking Confirmed | Nomadic Townies</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="wrap">
        {/* stepper all done */}
        <div className="stepper">
          {["Select Batch", "Your Details", "Confirmation"].map((label, i) => (
            <div key={label} style={{ display: "contents" }}>
              <div className="step done"><div className="step-num">✓</div><span className="lbl">{label}</span></div>
              {i < 2 && <div className="step-line done" />}
            </div>
          ))}
        </div>

        <div className="sc-wrap">
          <div className="sc-icon">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m4.5 12.5 5 5 10-10" /></svg>
          </div>
          <h1 className="sc-title">Booking Confirmed 🎉</h1>
          <p className="sc-sub">
            {lead?.email ? <>A confirmation has been sent to <b>{lead.email}</b>. </> : null}
            Your trip lead will reach out on WhatsApp within 24 hours.
          </p>

          {/* booking card */}
          <div className="sc-card">
            <div className="sc-card-head">
              <div className="sc-card-head-left">
                <h3>{PaymentDetail?.title || "Your Trip"}</h3>
                <div className="sc-card-head-meta">{PaymentDetail?.location ? `${PaymentDetail.location} · ` : ""}Nomadic Townies</div>
              </div>
              {bookingId && <div className="sc-booking-id">#{bookingId}</div>}
            </div>

            <div className="sc-card-body">
              <div>
                <div className="sc-detail-label">Batch Date</div>
                <div className="sc-detail-val">{batchRange}</div>
              </div>
              <div>
                <div className="sc-detail-label">Travellers</div>
                <div className="sc-detail-val">{travArr.length || CardData?.numberOfTravelers || 1}{roomType ? ` · ${roomType}` : ""}</div>
                {lead?.name && <div className="sc-detail-sub">Lead: {lead.name}</div>}
              </div>
              <div>
                <div className="sc-detail-label">Payment Status</div>
                <div className="sc-detail-val" style={{ color: isPartial ? "#D97706" : "var(--green)" }}>{isPartial ? "Partially paid" : "Paid in full"}</div>
                <div className="sc-detail-sub">Booked on {fmtDate(data?.DateOfBooking || Date.now())}</div>
              </div>
              <div>
                <div className="sc-detail-label">Amount Paid</div>
                <div className="sc-detail-val">{inr(amountPaid)}</div>
                {isPartial && remaining > 0 && <div className="sc-detail-sub">Balance {inr(remaining)} due before trip</div>}
              </div>
            </div>

            {/* travellers list */}
            {travArr.length > 0 && (
              <div style={{ padding: "0 24px 20px" }}>
                <div className="sc-detail-label" style={{ marginBottom: 10 }}>Traveller Details</div>
                {travArr.map((t, i) => (
                  <div className="bk-traveler-card" key={i} style={{ marginTop: i ? 8 : 0 }}>
                    <div className="bk-traveler-head">
                      <div className="bk-traveler-num"><span className="num">{i + 1}</span> {t?.name || `Traveller ${i + 1}`}</div>
                      {t?.isLead && <span className="bk-traveler-primary">Lead</span>}
                    </div>
                    <div className="bk-summary-strip-meta">
                      {t?.age && <span>{t.age} yrs</span>}
                      {t?.gender && <><span className="bk-batch-meta-dot" /><span>{t.gender}</span></>}
                      {t?.phone && <><span className="bk-batch-meta-dot" /><span>{t.phone}</span></>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="sc-total">
              <span className="sc-total-label">{isPartial ? "Paid now" : "Paid in full"}</span>
              <span className="sc-total-val">{inr(amountPaid)}</span>
            </div>
            {isPartial && remaining > 0 && (
              <div className="sc-total" style={{ background: "var(--orange-tint)", borderTop: "none" }}>
                <span className="sc-total-label">Balance due before trip</span>
                <span className="sc-total-val" style={{ fontSize: 18 }}>{inr(remaining)}</span>
              </div>
            )}
          </div>

          {/* next steps */}
          <div className="bk-card" style={{ textAlign: "left", marginBottom: 24 }}>
            <div className="bk-card-head"><h3 className="bk-card-title">Next steps</h3></div>
            {[
              "Your trip lead will WhatsApp you within 24 hours with the group invite.",
              "We'll send a packing checklist + weather brief 5 days before departure.",
              ...(isPartial ? [`Pay the remaining ${inr(remaining)} before the trip start date.`] : []),
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10, fontSize: 14, color: "var(--text)" }}>
                <span style={{ color: "var(--orange)", fontWeight: 700 }}>{i + 1}.</span>{s}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="sc-next">
            <button className="btn btn-orange btn-md" onClick={() => navigate("/profile")}>
              View My Booking
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </button>
            <a className="btn btn-ghost btn-md" href="https://wa.me/918623929751" target="_blank" rel="noreferrer">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
              Contact Support
            </a>
            <button className="btn btn-ghost btn-md" onClick={() => navigate("/all-packages")}>Explore more trips</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paymentsuccess;
