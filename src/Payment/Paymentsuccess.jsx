import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const inr = (n) => `₹ ${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
const safeParse = (v, f) => { try { return typeof v === "string" ? JSON.parse(v) : (v ?? f); } catch { return f; } };
const fmt = (d, opts = { day: "numeric", month: "short" }) => {
  if (!d) return "";
  const t = new Date(d);
  return isNaN(t) ? "" : t.toLocaleDateString("en-IN", opts);
};

const Paymentsuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userDbData } = useSelector((store) => store.global) || {};
  const { data } = location?.state || {};

  // Direct URL / refresh: no booking payload → send home (booking lives in My Trips).
  useEffect(() => {
    if (!data) navigate("/");
  }, [data, navigate]);
  if (!data) return null;

  // ── live booking snapshot (nothing hardcoded) ──
  const pd = safeParse(data.paymentDetail, {});
  const cd = safeParse(data.cardData, { cardSectionData: [], cardDate: {}, gstTax: 0 });
  const host = pd?.host || null;

  const isPartial = data.paymentStatus === "firstPayment";
  const items = Array.isArray(cd?.cardSectionData) ? cd.cardSectionData : [];
  const subtotal = items.reduce((s, it) => s + Number(it.TitlePrice || 0) * Number(it.quantity || 0), 0);
  const fullTotal = Number(data.fullTripAmount || subtotal + Number(cd?.gstTax || 0) - Number(data.coupenDiscount || 0));
  const paid = Number(data.total || fullTotal);
  const remaining = Math.max(0, Math.round(fullTotal - paid));

  const travellers = Number(cd?.numberOfTravelers || data.travellersCount || 1);
  const start = cd?.cardDate?.batchDate;
  const end = cd?.cardDate?.endSelectDate;
  const nights = pd?.nights, days = pd?.days;
  const batchStr = [
    start && end ? `${fmt(start)}–${fmt(end)}` : fmt(start) || "Dates to be confirmed",
    nights && days ? `${nights}N/${days}D` : null,
  ].filter(Boolean).join(" · ");
  const daysToGo = (() => {
    if (!start) return null;
    const diff = Math.ceil((new Date(start) - new Date()) / 86400000);
    return diff > 0 ? diff : null;
  })();

  const firstName = (userDbData?.name || "Traveller").split(" ")[0];
  const email = userDbData?.email || "your registered email";
  const tripTitle = pd?.title || "Your trip";
  const bookingId = data.bookingId || data.razorpayOrderId || "—";
  const paymentRef = data.razorpayPaymentId || null;

  const openChat = () => { if (host?._id) navigate(`/hosts/${host._id}?chat=1`); };
  const viewExperience = () => navigate(`/trips/${pd?.seoSlug || pd?._id || ""}`);

  // summary rows — optional ones drop out cleanly
  const rows = [
    { label: "Booking ID", value: bookingId, mono: true },
    { label: "Booking status", value: isPartial ? "Reserved — balance due" : "Confirmed", color: isPartial ? "#C8941E" : "#2E7D4F" },
    { label: "Payment status", value: isPartial ? "Partially paid" : "Fully paid", color: isPartial ? "#C8941E" : "#2E7D4F" },
    { label: "Batch · Duration", value: batchStr },
    { label: "Travellers", value: `${travellers} guest${travellers > 1 ? "s" : ""}` },
    { label: "Amount paid", value: inr(paid), color: "#2E7D4F" },
    remaining > 0 && { label: "Remaining · due before departure", value: inr(remaining), color: "#C0392B" },
    paymentRef && { label: "Payment reference", value: paymentRef, mono: true },
  ].filter(Boolean);

  const steps = isPartial
    ? [
        { title: "✓ Confirmed", sub: "Seats secured", color: "#2E7D4F" },
        { title: "2 · Host chat", sub: "Pickup details soon", color: "#CF4A2C" },
        { title: "3 · Balance", sub: `${inr(remaining)} before departure`, color: "#C8941E" },
      ]
    : [
        { title: "✓ Confirmed", sub: "Seats secured", color: "#2E7D4F" },
        { title: "2 · Host chat", sub: "Pickup details soon", color: "#CF4A2C" },
        { title: "3 · Trip day", sub: start ? `Departs ${fmt(start, { day: "numeric", month: "short", year: "numeric" })}` : "Get packing", color: "#3C3228" },
      ];

  return (
    <div className="psx">
      <style>{css}</style>

      <main className="psx-main">
        {/* celebration header */}
        <div className="psx-hero">
          <svg className="psx-spark" style={{ "--r": "-12deg", left: "8%", top: 0 }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CF4A2C" strokeWidth="1.8" strokeLinecap="round"><path d="M12 3v5M12 16v5M3 12h5M16 12h5" /></svg>
          <svg className="psx-spark" style={{ "--r": "16deg", right: "10%", top: 30, animationDelay: ".9s" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E0922F" strokeWidth="1.9" strokeLinecap="round"><path d="M12 3v5M12 16v5M3 12h5M16 12h5" /></svg>
          <div className="psx-badge-wrap">
            <span className="psx-ring" />
            <div className="psx-check">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2E7D4F" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
          </div>
          <div className="psx-kicker">Payment successful</div>
          <h1 className="psx-h1">
            You&apos;re booked, {firstName}.<br />
            <span className="psx-h1-em">The mountains are expecting you.</span>
          </h1>
          <div className="psx-chips">
            <span className="psx-chip psx-chip--dark">{tripTitle}</span>
            {start && (
              <span className="psx-chip">{fmt(start)}{daysToGo ? ` · in ${daysToGo} day${daysToGo > 1 ? "s" : ""}` : ""}</span>
            )}
          </div>
          <p className="psx-mail">Confirmation sent to {email}</p>
        </div>

        {/* summary */}
        <div className="psx-card">
          {rows.map((r, i) => (
            <div className="psx-row" key={r.label} style={{ borderBottom: i === rows.length - 1 ? "none" : "1px solid #F1EADD" }}>
              <span className="psx-row-k">{r.label}</span>
              <span className="psx-row-v" style={{ color: r.color || "#3C3228", fontFamily: r.mono ? "monospace" : undefined, fontSize: r.mono ? 12 : undefined }}>{r.value}</span>
            </div>
          ))}
        </div>

        {/* host */}
        {host?.name && (
          <div className="psx-host">
            <div className="psx-host-av-wrap">
              {host.logo
                ? <img className="psx-host-av psx-host-av--img" src={host.logo} alt={host.name} />
                : <div className="psx-host-av">{host.name.charAt(0).toUpperCase()}</div>}
              {host.verified && (
                <span className="psx-host-tick">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                </span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="psx-host-name">{host.name}</div>
              <div className="psx-host-sub">Your host · will message you here</div>
            </div>
            {host._id && (
              <button type="button" className="ps-cta psx-host-btn" onClick={openChat}>Message</button>
            )}
          </div>
        )}

        {/* next steps */}
        <div className="psx-steps">
          {steps.map((s) => (
            <div className="psx-step" key={s.title}>
              <div className="psx-step-t" style={{ color: s.color }}>{s.title}</div>
              <div className="psx-step-s">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* actions */}
        <button type="button" className="ps-cta psx-primary" onClick={() => navigate("/profile")}>View booking →</button>
        <div className="psx-ghost-grid">
          <button type="button" className="ps-ghost psx-ghost" onClick={() => navigate("/profile")}>Go to My Trips</button>
          <button type="button" className="ps-ghost psx-ghost" onClick={viewExperience}>View experience</button>
        </div>
        <button type="button" className="ps-ghost psx-ghost psx-ghost--full" onClick={() => navigate("/experiences")}>Explore more experiences</button>

        <p className="psx-foot">All conversations stay on Nomadic Townies — no phone or WhatsApp needed.</p>
      </main>
    </div>
  );
};

const css = `
.psx{background:#F4EEE4;min-height:100vh;font-family:'Hanken Grotesk','Inter',system-ui,sans-serif}
.psx *{box-sizing:border-box}
.psx-main{width:100%;max-width:560px;margin:0 auto;padding:clamp(32px,5vw,52px) clamp(16px,4vw,24px) 56px}
.psx-hero{position:relative;text-align:center;margin-bottom:32px}
.psx-spark{position:absolute;animation:psFloat 3.4s ease-in-out infinite}
.psx-badge-wrap{position:relative;width:80px;height:80px;margin:0 auto}
.psx-ring{position:absolute;inset:0;border-radius:50%;border:2px solid #5BBF7A;animation:psRing 2.2s cubic-bezier(.22,.61,.36,1) infinite}
.psx-check{position:relative;width:80px;height:80px;border-radius:50%;background:linear-gradient(150deg,#E9F5EC,#D3EBDB);border:1px solid #BBDFC8;display:flex;align-items:center;justify-content:center;box-shadow:0 12px 28px -10px rgba(46,125,79,.35);animation:psPop .6s cubic-bezier(.22,.61,.36,1) both}
.psx-kicker{margin-top:20px;font-weight:700;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#2E7D4F}
.psx-h1{margin:10px 0 0;font-family:'Bricolage Grotesque','Playfair Display',Georgia,serif;font-weight:700;font-size:clamp(28px,5.4vw,32px);line-height:1.08;letter-spacing:-.02em;color:#221C17;text-wrap:balance}
.psx-h1-em{font-style:italic;font-weight:600;color:#CF4A2C}
.psx-chips{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:18px}
.psx-chip{padding:8px 14px;border-radius:99px;background:#FFFDF9;border:1px solid #E6DDCF;color:#3C3228;font-weight:600;font-size:12px;line-height:1}
.psx-chip--dark{background:#221C17;border-color:#221C17;color:#F4EEE4;font-weight:700}
.psx-mail{margin:14px 0 0;font-size:13px;line-height:1.5;color:#9A9080}
.psx-card{background:#FFFDF9;border:1px solid #E6DDCF;border-radius:16px;overflow:hidden}
.psx-row{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:13px 18px}
.psx-row-k{font-weight:500;font-size:13px;line-height:1.3;color:#8A8073}
.psx-row-v{font-weight:600;font-size:13.5px;line-height:1.3;text-align:right;word-break:break-all}
.psx-host{margin-top:14px;background:#221C17;border-radius:16px;padding:18px 20px;display:flex;align-items:center;gap:14px}
.psx-host-av-wrap{position:relative;flex:none}
.psx-host-av{width:50px;height:50px;border-radius:13px;background:linear-gradient(150deg,#E9622F,#CF4A2C);display:flex;align-items:center;justify-content:center;font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:20px;color:#FFF6EF}
.psx-host-av--img{object-fit:cover}
.psx-host-tick{position:absolute;right:-5px;bottom:-5px;width:19px;height:19px;border-radius:50%;background:#5BBF7A;border:2px solid #221C17;display:flex;align-items:center;justify-content:center;color:#fff}
.psx-host-name{font-weight:700;font-size:15px;line-height:1.2;color:#F8F4ED}
.psx-host-sub{margin-top:3px;font-size:12px;line-height:1.4;color:#C9BFAE}
.psx-host-btn{flex:none;padding:10px 15px;font-weight:700;font-size:12.5px;line-height:1;color:#fff;background:#CF4A2C;border:none;border-radius:9px;cursor:pointer}
.psx-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-top:14px}
.psx-step{background:#FFFDF9;border:1px solid #E6DDCF;border-radius:13px;padding:13px 14px}
.psx-step-t{font-weight:700;font-size:12px;line-height:1}
.psx-step-s{margin-top:5px;font-size:11.5px;line-height:1.4;color:#8A8073}
.psx-primary{width:100%;margin-top:16px;padding:15px;font-weight:700;font-size:14.5px;line-height:1;color:#fff;background:#CF4A2C;border:none;border-radius:12px;cursor:pointer;box-shadow:0 8px 20px rgba(207,74,44,.24)}
.psx-ghost-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.psx-ghost{padding:12px;font-weight:700;font-size:13px;line-height:1;color:#221C17;background:#FFFDF9;border:1px solid #E6DDCF;border-radius:11px;cursor:pointer}
.psx-ghost--full{width:100%;margin-top:10px}
.psx-foot{margin:22px 0 0;text-align:center;font-size:12px;line-height:1.5;color:#9A9080}
.ps-cta{transition:transform .18s ease,box-shadow .18s ease,background .18s ease}
.ps-cta:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(207,74,44,.3);background:#C0421F}
.ps-ghost{transition:background .16s ease,border-color .16s ease}
.ps-ghost:hover{background:#FBF6EE;border-color:#CF4A2C}
@keyframes psPop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
@keyframes psRing{0%{transform:scale(.7);opacity:.7}100%{transform:scale(1.9);opacity:0}}
@keyframes psFloat{0%,100%{transform:translateY(0) rotate(var(--r,0deg))}50%{transform:translateY(-7px) rotate(var(--r,0deg))}}
@media (prefers-reduced-motion:reduce){.psx-ring,.psx-spark,.psx-check{animation:none}}
@media(max-width:480px){.psx-ghost-grid{grid-template-columns:1fr}}
`;

export default Paymentsuccess;
