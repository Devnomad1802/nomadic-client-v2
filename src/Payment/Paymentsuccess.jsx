import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// ── tiny inline icon set (stroke = currentColor) ──
const Ic = {
  check: (s = 44) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
  ),
  copy: (s = 15) => (
    <svg className="copy-ic" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
  ),
  pin: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
  ),
  cal: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
  ),
  clock: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
  ),
  user: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
  ),
  mail: (s = 14) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 6 10 7L22 6" /></svg>
  ),
  doc: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
  ),
  wallet: (s = 18) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M16 12h.01M3 9h18" /></svg>
  ),
  shield: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>
  ),
  verified: (s = 12) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
  ),
  whatsapp: (s = 17) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.477-.917zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
  ),
  share: (s = 15) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5 8.6 10.5" /></svg>
  ),
  download: (s = 15) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
  ),
  home: (s = 17) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5 12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" /></svg>
  ),
  arrow: (s = 16) => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
};

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const safeParse = (v, fallback) => {
  try {
    if (!v) return fallback;
    return typeof v === "string" ? JSON.parse(v) : v;
  } catch {
    return fallback;
  }
};

const fmtDate = (d, opts = { day: "numeric", month: "short", year: "numeric" }) => {
  if (!d) return "";
  const dt = new Date(d);
  return isNaN(dt) ? "" : dt.toLocaleDateString("en-IN", opts);
};

const Paymentsuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userDbData } = useSelector((store) => store.global) || {};

  const { data } = location?.state || {};
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!data) navigate("/");
  }, [data, navigate]);

  if (!data) return null;

  // ── parse server snapshots ──
  const PaymentDetail = safeParse(data.paymentDetail, {});
  const CardData = safeParse(data.cardData, { cardSectionData: [], cardDate: {}, gstTax: 0 });
  const host = PaymentDetail?.host || null;

  const isPartial = data.paymentStatus === "firstPayment";
  const sections = Array.isArray(CardData?.cardSectionData) ? CardData.cardSectionData : [];

  const subtotal = sections.reduce(
    (s, it) => s + Number(it.TitlePrice || 0) * Number(it.quantity || 0),
    0
  );
  const gst = Number(CardData?.gstTax || 0);
  const discount = Number(data.coupenDiscount || 0);
  const fullTotal = Number(data.fullTripAmount || subtotal + gst - discount);
  const charged = Number(data.total || fullTotal);
  const balance = Math.max(0, fullTotal - charged);

  const travellers = Number(CardData?.numberOfTravelers || data.travellersCount || 1);
  const dateRange = (() => {
    const a = fmtDate(CardData?.cardDate?.batchDate, { day: "numeric", month: "short" });
    const b = fmtDate(CardData?.cardDate?.endSelectDate, { day: "numeric", month: "short", year: "numeric" });
    return a && b ? `${a} – ${b}` : a || b || "Dates to be confirmed";
  })();

  const leadName = userDbData?.name || data.travellers?.[0]?.name || "Traveller";
  const email = userDbData?.email || "your registered email";
  const tripTitle = PaymentDetail?.title || "Your trip";
  const bookingId = data.bookingId || data.razorpayOrderId || "—";

  const copyId = () => {
    navigator.clipboard?.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shareWhatsApp = () => {
    const text = `I just booked ${tripTitle} with Nomadic Townies! Booking ID: ${bookingId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };
  const shareTrip = () => {
    if (navigator.share) {
      navigator.share({ title: "Nomadic Townies", text: `Booked ${tripTitle}!`, url: window.location.origin }).catch(() => {});
    } else {
      shareWhatsApp();
    }
  };

  return (
    <div className="nt-success">
      <style>{css}</style>

      {/* HERO */}
      <div className="confirm-hero">
        <div className="confirm-ic">{Ic.check(44)}</div>
        <h1>Your adventure is booked! 🎉</h1>
        <p className="sub">
          Pack your bags — {tripTitle} is waiting for you. A confirmation email is on its way to your inbox.
        </p>
        <div className="booking-id-pill" onClick={copyId} title="Click to copy">
          {Ic.copy(15)}
          Booking ID: <strong>{bookingId}</strong>
        </div>
        <div className="copied-msg">{copied ? "Copied to clipboard ✓" : ""}</div>
      </div>

      {/* STATUS BANNER */}
      {isPartial ? (
        <div className="status-banner partial">
          {Ic.clock(18)}
          Partial payment received — your spot is reserved. Balance due before departure.
          <span className="remaining">Balance: {inr(balance)}</span>
        </div>
      ) : (
        <div className="status-banner full">
          {Ic.shield(18)}
          Full payment received — your spot is confirmed and secured.
        </div>
      )}

      {/* MAIN GRID */}
      <div className="main-grid">
        {/* LEFT */}
        <div>
          {/* TRIP CARD */}
          <div className="card">
            {PaymentDetail?.bannerImage && (
              <div className="trip-banner">
                <img src={PaymentDetail.bannerImage} alt={tripTitle} loading="lazy" />
              </div>
            )}
            <div className="trip-info">
              <h2 className="trip-name">{tripTitle}</h2>
              <div className="trip-chips">
                {PaymentDetail?.location && (
                  <span className="chip">{Ic.pin(13)} {PaymentDetail.location}</span>
                )}
                {(PaymentDetail?.nights || PaymentDetail?.days) && (
                  <span className="chip">{Ic.clock(13)} {PaymentDetail.nights}N · {PaymentDetail.days}D</span>
                )}
                {dateRange && <span className="chip">{Ic.cal(13)} {dateRange}</span>}
              </div>
            </div>
          </div>

          {/* BOOKING DETAILS */}
          <div className="card">
            <div className="card-head">
              {Ic.doc(18)}
              <h3>Booking Details</h3>
            </div>
            <div className="card-body">
              <div className="det-row">
                <span className="det-lbl">{Ic.user(14)} Lead Traveller</span>
                <span className="det-val">{leadName}</span>
              </div>
              <div className="det-row">
                <span className="det-lbl">{Ic.mail(14)} Confirmation sent to</span>
                <span className="det-val">{email}</span>
              </div>
              <div className="det-row">
                <span className="det-lbl">{Ic.cal(14)} Trip dates</span>
                <span className="det-val">{dateRange}</span>
              </div>
              {PaymentDetail?.location && (
                <div className="det-row">
                  <span className="det-lbl">{Ic.pin(14)} Location</span>
                  <span className="det-val">{PaymentDetail.location}</span>
                </div>
              )}
              <div className="det-row">
                <span className="det-lbl">{Ic.user(14)} Travellers</span>
                <span className="det-val">{travellers} traveller{travellers > 1 ? "s" : ""}</span>
              </div>
              {(PaymentDetail?.nights || PaymentDetail?.days) && (
                <div className="det-row">
                  <span className="det-lbl">{Ic.clock(14)} Duration</span>
                  <span className="det-val">{PaymentDetail.nights} Nights · {PaymentDetail.days} Days</span>
                </div>
              )}
              <div className="det-row">
                <span className="det-lbl">{Ic.cal(14)} Booked on</span>
                <span className="det-val">{fmtDate(data.DateOfBooking, { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" })}</span>
              </div>
              {data.razorpayPaymentId && (
                <div className="det-row">
                  <span className="det-lbl">{Ic.wallet(14)} Razorpay Payment ID</span>
                  <span className="det-val" style={{ fontFamily: "monospace", fontSize: 12 }}>{data.razorpayPaymentId}</span>
                </div>
              )}
              <div className="cta-row" style={{ padding: "14px 0 0", borderTop: "none" }}>
                <div className="share-row">
                  <button className="share-btn" onClick={shareWhatsApp}>{Ic.whatsapp(15)} Share on WhatsApp</button>
                  <button className="share-btn" onClick={shareTrip}>{Ic.share(15)} Share</button>
                  <button className="share-btn" onClick={() => window.print()}>{Ic.download(15)} Download</button>
                </div>
              </div>
            </div>
          </div>

          {/* PAYMENT BREAKDOWN */}
          <div className="card">
            <div className="card-head">
              {Ic.wallet(18)}
              <h3>Payment Breakdown</h3>
              <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: isPartial ? "var(--orange-tint)" : "var(--green-tint)", color: isPartial ? "var(--orange)" : "var(--green)" }}>
                {isPartial ? "Partial Payment" : "Full Payment"}
              </span>
            </div>
            <div className="card-body">
              {sections.map((it, i) => (
                <div className="pay-row" key={i}>
                  <span className="lbl">{it.Title} × {it.quantity}</span>
                  <span className="val">{inr(Number(it.TitlePrice) * Number(it.quantity))}</span>
                </div>
              ))}
              {discount > 0 && (
                <div className="pay-row">
                  <span className="lbl">Coupon{data.couponCode ? ` (${data.couponCode})` : ""}</span>
                  <span className="green">− {inr(discount)}</span>
                </div>
              )}
              {gst > 0 && (
                <div className="pay-row">
                  <span className="lbl">GST @ 5%</span>
                  <span className="val">{inr(gst)}</span>
                </div>
              )}
              <div className="total-row">
                <span className="total-lbl">Total Trip Amount</span>
                <span className="total-val">{inr(fullTotal)}</span>
              </div>

              {isPartial && (
                <div className="partial-card">
                  <h4>{Ic.clock(15)} Partial payment booked</h4>
                  <p>You&apos;ve paid a booking amount to secure your spot. The remaining balance is due before departure.</p>
                  <div className="due">Balance due: {inr(balance)}</div>
                </div>
              )}

              <div style={{ marginTop: 14, padding: "12px 16px", background: "var(--bg-soft)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13.5, color: "var(--text-light)" }}>Amount charged by Razorpay</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "var(--green)" }}>{inr(charged)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sidebar">
          {/* NEXT STEPS */}
          <div className="steps-card">
            <div className="steps-head">
              <h3>What happens next?</h3>
              <p>Here&apos;s your pre-trip checklist</p>
            </div>
            {[
              { h: "Check your email", p: `A booking confirmation + detailed itinerary has been sent to ${email}.` },
              { h: "Get the packing list", p: "Your host will send a custom packing list a few days before departure." },
              { h: "Plan your travel", p: "Confirm your travel to the meeting point in advance — peak season fills up fast." },
              { h: "Get travel insurance", p: "Strongly recommended. Covers emergencies and missed departures." },
              { h: "Trip day — meet your group", p: "Arrive at the meeting point on time. Your host will welcome you." },
            ].map((s, i) => (
              <div className="step-item" key={i}>
                <div className="step-num">{i + 1}</div>
                <div className="step-text">
                  <h4>{s.h}</h4>
                  <p>{s.p}</p>
                </div>
              </div>
            ))}
          </div>

          {/* HOST CARD */}
          {host?.name && (
            <div className="host-card">
              <div className="host-av">{host.name.charAt(0).toUpperCase()}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="host-name">
                  {host.name}
                  {host.verified && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: "var(--green)", background: "var(--green-tint)", padding: "2px 7px", borderRadius: 999, marginLeft: 6, verticalAlign: "middle" }}>
                      {Ic.verified(12)} Verified
                    </span>
                  )}
                </div>
                <div className="host-meta">{host.location || "Verified host"} · Responds within a few hours</div>
                <button className="whatsapp-btn" onClick={shareWhatsApp}>{Ic.whatsapp(17)} Message via Nomadic Townies</button>
                <p style={{ fontSize: 11, color: "var(--text-lighter)", marginTop: 8, textAlign: "center", lineHeight: 1.4 }}>
                  For booking support, contact us via Nomadic Townies only.
                </p>
              </div>
            </div>
          )}

          {/* TRUST FOOTER */}
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 14, padding: "16px 18px" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--text-lighter)", marginBottom: 12 }}>
              Protected by Nomadic Townies
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {["Verified host · platform-protected booking", "No direct payments outside platform", "Support available before + during trip"].map((t, i) => (
                <div key={i} style={{ display: "flex", gap: 9, alignItems: "center", fontSize: 13, color: "var(--text)" }}>
                  <span style={{ color: "var(--green)", display: "flex" }}>{Ic.shield(16)}</span>
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button className="btn-primary" onClick={() => navigate("/")}>{Ic.home(17)} Back to home</button>
            <button className="btn-secondary" onClick={() => navigate("/all-packages")}>Explore more trips {Ic.arrow(16)}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const css = `
:root{
  --orange:#CD482A; --orange-hover:#B53D1F;
  --orange-tint:#FDF3EE; --orange-tint-2:#FBEAE3;
  --charcoal:#393938; --text-dark:#1F2937;
  --text:#4B5563; --text-light:#6B7280; --text-lighter:#9CA3AF;
  --line:#E5E7EB; --line-soft:#F3F4F6;
  --bg:#fff; --bg-soft:#F9FAFB; --bg-cream:#FAF7F2;
  --green:#11875b; --green-tint:#e7f4ee;
  --amber:#f59e0b; --red:#DC2626;
  --playfair:"Playfair Display",Georgia,serif;
  --serif:"Newsreader",Georgia,serif;
  --inter:"Inter",system-ui,sans-serif;
}
.nt-success *,.nt-success *::before,.nt-success *::after{box-sizing:border-box}
.nt-success{font-family:var(--inter);color:var(--text);background:var(--bg-soft);line-height:1.5;-webkit-font-smoothing:antialiased;min-height:100vh}
.nt-success a{text-decoration:none;color:inherit}
.nt-success img{display:block;max-width:100%}
.nt-success h1,.nt-success h2,.nt-success h3,.nt-success h4,.nt-success p{margin:0}
.nt-success button{cursor:pointer;font-family:var(--inter);border:none;background:none;color:inherit}
.nt-success .confirm-hero{background:linear-gradient(135deg,#1a3a2a 0%,#2d6b4a 55%,#1a5f3f 100%);padding:56px 28px;text-align:center;position:relative;overflow:hidden}
.nt-success .confirm-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,rgba(255,255,255,.07),transparent 55%),radial-gradient(circle at 80% 70%,rgba(205,72,42,.18),transparent 55%)}
.nt-success .confirm-ic{width:88px;height:88px;border-radius:50%;background:rgba(255,255,255,.14);border:3px solid rgba(255,255,255,.4);display:grid;place-items:center;margin:0 auto 20px;position:relative}
.nt-success .confirm-ic svg{color:#fff}
.nt-success .confirm-ic::before,.nt-success .confirm-ic::after{content:'';position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.2);animation:nt-ripple 2.8s ease-out infinite}
.nt-success .confirm-ic::before{width:116px;height:116px;animation-delay:.4s}
.nt-success .confirm-ic::after{width:148px;height:148px;animation-delay:.8s}
@keyframes nt-ripple{0%{opacity:.6;transform:scale(.85)}100%{opacity:0;transform:scale(1.1)}}
.nt-success .confirm-hero h1{font-family:var(--playfair);font-size:clamp(28px,4.5vw,42px);font-weight:700;color:#fff;letter-spacing:-.02em;line-height:1.1;margin-bottom:10px;position:relative}
.nt-success .confirm-hero .sub{font-family:var(--serif);font-size:clamp(15px,1.8vw,19px);font-style:italic;color:rgba(255,255,255,.88);max-width:520px;margin:0 auto 24px;position:relative;line-height:1.5}
.nt-success .booking-id-pill{display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,.16);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.3);padding:11px 20px;border-radius:999px;color:#fff;font-size:13.5px;font-weight:700;letter-spacing:.04em;position:relative;cursor:pointer;transition:background .15s}
.nt-success .booking-id-pill:hover{background:rgba(255,255,255,.24)}
.nt-success .booking-id-pill .copy-ic{opacity:.7}
.nt-success .copied-msg{font-size:11px;color:rgba(255,255,255,.7);margin-top:8px;position:relative;height:16px}
.nt-success .status-banner{padding:16px 22px;display:flex;align-items:center;gap:10px 14px;font-size:14px;font-weight:600;flex-wrap:wrap}
.nt-success .status-banner.full{background:#f0fdf6;border-bottom:1px solid #d1fae5;color:var(--green)}
.nt-success .status-banner.partial{background:#fffbeb;border-bottom:1px solid #fef3c7;color:#92400e}
.nt-success .status-banner svg{flex-shrink:0}
.nt-success .status-banner .remaining{margin-left:auto;font-size:13px;font-weight:700;color:var(--orange);background:var(--orange-tint);padding:6px 14px;border-radius:999px;white-space:nowrap}
.nt-success .main-grid{display:grid;grid-template-columns:1fr 360px;gap:24px;margin:28px auto 48px;padding:0 28px;max-width:1020px;align-items:start}
.nt-success .card{background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden;margin-bottom:16px}
.nt-success .card-head{padding:16px 20px;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:10px}
.nt-success .card-head h3{font-size:16px;font-weight:700;color:var(--text-dark)}
.nt-success .card-head svg{color:var(--orange)}
.nt-success .card-body{padding:20px}
.nt-success .trip-banner{aspect-ratio:16/7;overflow:hidden;background:linear-gradient(135deg,#1a5f3f,#2d6b4a)}
.nt-success .trip-banner img{width:100%;height:100%;object-fit:cover}
.nt-success .trip-info{padding:18px 20px;text-align:left}
.nt-success .trip-name{text-align:left}
.nt-success .trip-chips{justify-content:flex-start}
.nt-success .trip-name{font-family:var(--playfair);font-size:22px;font-weight:700;color:var(--text-dark);letter-spacing:-.01em;margin-bottom:10px;line-height:1.2}
.nt-success .trip-chips{display:flex;gap:8px;flex-wrap:wrap}
.nt-success .chip{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;padding:6px 12px;border-radius:999px;border:1px solid var(--line);color:var(--text);background:var(--bg-soft)}
.nt-success .chip svg{color:var(--orange)}
.nt-success .det-row{display:flex;align-items:center;justify-content:space-between;padding:11px 0;border-bottom:1px solid var(--line-soft)}
.nt-success .det-row:last-child{border-bottom:none}
.nt-success .det-lbl{display:flex;align-items:center;gap:9px;font-size:13.5px;color:var(--text-light)}
.nt-success .det-lbl svg{color:var(--text-lighter);flex-shrink:0}
.nt-success .det-val{font-size:13.5px;font-weight:600;color:var(--text-dark);text-align:right}
.nt-success .pay-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--line-soft);font-size:13.5px}
.nt-success .pay-row:last-child{border-bottom:none}
.nt-success .pay-row .lbl{color:var(--text-light)}
.nt-success .pay-row .val{color:var(--text-dark);font-weight:600}
.nt-success .pay-row .green{color:var(--green);font-weight:600}
.nt-success .total-row{display:flex;justify-content:space-between;align-items:baseline;padding-top:14px;border-top:1px solid var(--line);margin-top:4px}
.nt-success .total-lbl{font-size:14.5px;font-weight:700;color:var(--text-dark)}
.nt-success .total-val{font-size:28px;font-weight:800;color:var(--text-dark);letter-spacing:-.02em}
.nt-success .partial-card{background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1px solid #fcd34d;border-radius:12px;padding:16px 18px;margin-top:14px}
.nt-success .partial-card h4{font-size:14px;font-weight:700;color:#92400e;margin-bottom:6px;display:flex;align-items:center;gap:7px}
.nt-success .partial-card p{font-size:13px;color:#78350f;line-height:1.55}
.nt-success .partial-card .due{font-size:18px;font-weight:800;color:var(--orange);margin-top:8px}
.nt-success .sidebar{display:flex;flex-direction:column;gap:16px;position:sticky;top:20px;align-self:start}
@media(max-width:900px){.nt-success .sidebar{position:static}}
.nt-success .steps-card{background:#fff;border:1px solid var(--line);border-radius:18px;overflow:hidden}
.nt-success .steps-head{padding:14px 18px;border-bottom:1px solid var(--line);background:var(--orange-tint)}
.nt-success .steps-head h3{font-size:15px;font-weight:700;color:var(--text-dark)}
.nt-success .steps-head p{font-size:12.5px;color:var(--text-light);margin-top:2px}
.nt-success .step-item{display:flex;gap:13px;padding:14px 18px;border-bottom:1px solid var(--line-soft)}
.nt-success .step-item:last-child{border-bottom:none}
.nt-success .step-num{width:28px;height:28px;border-radius:50%;background:var(--orange-tint);color:var(--orange);display:grid;place-items:center;font-size:13px;font-weight:800;flex-shrink:0}
.nt-success .step-text h4{font-size:13.5px;font-weight:700;color:var(--text-dark);margin-bottom:2px}
.nt-success .step-text p{font-size:12.5px;color:var(--text-light);line-height:1.45}
.nt-success .host-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:18px;display:flex;gap:13px;align-items:flex-start}
.nt-success .host-av{width:48px;height:48px;border-radius:50%;background:var(--orange-tint);color:var(--orange);display:grid;place-items:center;font-family:var(--playfair);font-weight:700;font-size:19px;flex-shrink:0}
.nt-success .host-name{font-size:14px;font-weight:700;color:var(--text-dark);margin-bottom:3px}
.nt-success .host-meta{font-size:12.5px;color:var(--text-light)}
.nt-success .whatsapp-btn{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;background:#25D366;color:#fff;font-size:13.5px;font-weight:700;padding:11px;border-radius:10px;margin-top:12px;transition:background .15s}
.nt-success .whatsapp-btn:hover{background:#1faa53}
.nt-success .cta-row{display:flex;gap:10px;padding:20px;border-top:1px solid var(--line);flex-wrap:wrap}
.nt-success .btn-primary{flex:1;height:48px;background:var(--orange);color:#fff;font-size:14.5px;font-weight:700;border-radius:10px;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 8px 16px -8px rgba(205,72,42,.55);transition:all .18s}
.nt-success .btn-primary:hover{background:var(--orange-hover);transform:translateY(-1px)}
.nt-success .btn-secondary{flex:1;height:48px;border:1.5px solid var(--line);border-radius:10px;font-size:14px;font-weight:600;color:var(--text-dark);display:flex;align-items:center;justify-content:center;gap:7px;transition:all .15s}
.nt-success .btn-secondary:hover{border-color:var(--text-dark)}
.nt-success .btn-ghost-sm{font-size:13px;font-weight:600;color:var(--text-light);padding:8px 14px;border:1px solid var(--line);border-radius:8px;transition:all .15s}
.nt-success .btn-ghost-sm:hover{color:var(--orange);border-color:var(--orange)}
.nt-success .share-row{display:flex;gap:8px;flex-wrap:wrap}
.nt-success .share-btn{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;padding:8px 14px;border-radius:999px;border:1.5px solid var(--line);background:#fff;color:var(--text);transition:all .15s}
.nt-success .share-btn:hover{border-color:var(--text-dark)}
@media(max-width:900px){.nt-success .main-grid{grid-template-columns:1fr;padding:0 16px}}
@media(max-width:700px){.nt-success .confirm-hero{padding:40px 20px}.nt-success .trip-chips{gap:6px}.nt-success .cta-row{flex-direction:column}.nt-success .btn-primary,.nt-success .btn-secondary{flex:none;width:100%}}
@media print{
  body *{visibility:hidden!important}
  .nt-success,.nt-success *{visibility:visible!important}
  .nt-success{position:absolute;left:0;top:0;width:100%;background:#fff}
  .nt-success .share-row,.nt-success .btn-ghost-sm,.nt-success .whatsapp-btn,.nt-success .btn-primary,.nt-success .btn-secondary,.nt-success .sidebar>div:last-child{display:none!important}
  .nt-success .confirm-hero{background:#1a5f3f!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .nt-success .main-grid{grid-template-columns:1fr 320px}
}
`;

export default Paymentsuccess;
