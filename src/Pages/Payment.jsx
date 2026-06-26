/* eslint-disable react/prop-types */
/**
 * Payment.jsx — Booking Step 1: Select Batch + Category/Room + Summary.
 * Faithful to "Trip Detail & Booking Flow" design (scoped .bkpg).
 * Wired to existing Trip data (selectDate[]/endSelectDate[]/numberOfSeats[]/
 * numberOfDays[]/discount[]/addsection[]). No backend change. Logic preserved.
 */
import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../Payment/booking.css";

const CalIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>);
const PeopleIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 19a5.5 5.5 0 0 1 11 0M16 5.2a3 3 0 0 1 0 5.6M21 19a5.5 5.5 0 0 0-3.5-5.1" /></svg>);
const RoomIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V8l9-5 9 5v13M3 21h18M9 21V12h6v9" /></svg>);
const Minus = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14" /></svg>);
const Plus = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>);
const Arrow = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
const Shield = () => (<svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2Z" /></svg>);

const Stepper = ({ active }) => (
  <div className="stepper">
    {["Select Batch", "Your Details", "Confirmation"].map((label, i) => (
      <div key={label} style={{ display: "contents" }}>
        <div className={`step ${i < active ? "done" : i === active ? "on" : ""}`}>
          <div className="step-num">{i < active ? "✓" : i + 1}</div>
          <span className="lbl">{label}</span>
        </div>
        {i < 2 && <div className={`step-line ${i < active ? "done" : ""}`} />}
      </div>
    ))}
  </div>
);

const fmtShort = (d) => {
  if (!d) return "";
  const x = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(x.getTime())) return "";
  return x.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
const wd = (d) => { const x = d instanceof Date ? d : new Date(d); return Number.isNaN(x.getTime()) ? "" : x.toLocaleDateString("en-US", { weekday: "short" }); };

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentDetail } = location.state || {};

  const selectDate = useMemo(() => JSON.parse(paymentDetail?.selectDate || "[]"), [paymentDetail]);
  const endSelectDate = useMemo(() => JSON.parse(paymentDetail?.endSelectDate || "[]"), [paymentDetail]);
  const numberOfDays = useMemo(() => JSON.parse(paymentDetail?.numberOfDays || "[]"), [paymentDetail]);
  const numberOfSeats = useMemo(() => JSON.parse(paymentDetail?.numberOfSeats || "[]"), [paymentDetail]);
  const discount = useMemo(() => JSON.parse(paymentDetail?.discount || "[]"), [paymentDetail]);
  const AddSection = useMemo(() => JSON.parse(paymentDetail?.addsection || "[]"), [paymentDetail]);

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [couponCode, setCouponCode] = useState("");
  const [coupenDiscount, setCoupenDiscount] = useState(0);
  const [quantities, setQuantities] = useState({});

  const batchData = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return selectDate.map((dObj, i) => {
      const startDate = new Date(dObj.BatchDate);
      const endDate = new Date(endSelectDate[i]?.EndBatchDate);
      if (Number.isNaN(startDate.getTime()) || startDate < today) return null;
      return {
        id: i, startDate, endDate,
        month: startDate.toLocaleDateString("en-US", { month: "short" }),
        year: startDate.getFullYear(),
        seatsLeft: numberOfSeats[i]?.batchSeats || 0,
        totalSeats: numberOfSeats[i]?.batchSeats || 0,
        days: numberOfDays[i]?.selectDays || 0,
      };
    }).filter(Boolean);
  }, [selectDate, endSelectDate, numberOfSeats, numberOfDays]);

  const months = useMemo(() => ["All", ...Array.from(new Set(batchData.map((b) => b.month)))], [batchData]);
  const filteredBatches = selectedMonth === "All" ? batchData : batchData.filter((b) => b.month === selectedMonth);

  const { totalAmount, totalTravelers } = useMemo(() => {
    let amt = 0, trav = 0;
    AddSection.forEach((section, si) => {
      (section.array || []).forEach((item, ii) => {
        const q = quantities[`${si}-${ii}`] || 0;
        amt += q * (parseInt(item.TitlePrice) || 0);
        if (si === 0) trav += q;
      });
    });
    return { totalAmount: amt, totalTravelers: trav };
  }, [AddSection, quantities]);

  const gstAmount = (totalAmount - coupenDiscount) * 0.05;
  const finalAmount = Math.round(totalAmount - coupenDiscount + gstAmount);

  const changeQty = (id, delta, title = "") => {
    setQuantities((prev) => {
      const cur = prev[id] || 0;
      const si = parseInt(id.split("-")[0]);
      const isGroup = `${title}`.toLowerCase().includes("group");
      let next;
      if (si === 0 && isGroup) {
        if (delta > 0) next = cur === 0 ? 5 : cur + 1;
        else next = cur <= 5 ? 0 : cur - 1;
      } else next = Math.max(0, cur + delta);
      return { ...prev, [id]: next };
    });
  };

  const applyCoupon = (code) => {
    const c = code?.trim();
    if (!c) { setCoupenDiscount(0); return; }
    const ok = discount.some((d) => d?.toLowerCase?.() === c.toLowerCase());
    setCoupenDiscount(ok ? totalAmount * 0.1 : 0);
  };

  const selectedBatchObj = selectedBatch !== null ? batchData.find((b) => b.id === selectedBatch) : null;
  const canProceed = totalTravelers > 0 && selectedBatch !== null;

  const selections = { quantities };

  const proceed = () => {
    if (!canProceed) return;
    navigate("/booking_details", {
      state: { paymentDetail, selectedBatch: selectedBatchObj, selections, totalAmount: finalAmount, coupenDiscount },
    });
  };

  const QtyRow = (item, id, title) => {
    const q = quantities[id] || 0;
    const sub = item.SubTitle || item.subTitle || item.description || "";
    const isGroup = `${item.Title || ""}`.toLowerCase().includes("group");
    return (
      <div className="bk-qty-row" key={id}>
        <div>
          <div className="bk-qty-title">{item.Title}{isGroup && <span className="bk-qty-badge">5+ people</span>}</div>
          {sub && <div className="bk-qty-title-sub">{sub}</div>}
        </div>
        <div className="bk-qty-price">₹{parseInt(item.TitlePrice || 0).toLocaleString("en-IN")}</div>
        <div className="bk-qty-control">
          <button className="bk-qty-btn" onClick={() => changeQty(id, -1, title)} disabled={q === 0}><Minus /></button>
          <span className="bk-qty-num">{q}</span>
          <button className="bk-qty-btn plus" onClick={() => changeQty(id, 1, title)}><Plus /></button>
        </div>
      </div>
    );
  };

  if (!paymentDetail) {
    return (
      <div className="bkpg"><div className="wrap" style={{ textAlign: "center", paddingTop: 64 }}>
        <p style={{ color: "var(--text-light)" }}>No trip selected. Please pick a trip first.</p>
        <button className="btn btn-orange btn-md" style={{ marginTop: 16 }} onClick={() => navigate("/all-packages")}>Browse trips</button>
      </div></div>
    );
  }

  return (
    <div className="bkpg">
      <Helmet><title>Book Your Trip | Nomadic Townies</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="wrap">
        <Stepper active={0} />
        <div className="bk-grid">
          {/* LEFT */}
          <div>
            {/* Batch */}
            <div className="bk-card">
              <div className="bk-card-head"><CalIcon /><h3 className="bk-card-title">Select Batch Date</h3></div>
              <div className="bk-months">
                {months.map((m) => {
                  const yr = m === "All" ? null : batchData.find((b) => b.month === m)?.year;
                  return (
                    <button key={m} className={`bk-month ${selectedMonth === m ? "on" : ""}`} onClick={() => setSelectedMonth(m)}>
                      <span className="bk-month-name">{m}</span>
                      {yr && <span className="bk-month-year">{yr}</span>}
                    </button>
                  );
                })}
              </div>
              <div className="bk-batches">
                {filteredBatches.length ? filteredBatches.map((b) => {
                  const tier = b.seatsLeft <= 2 ? "urgent" : b.seatsLeft <= 5 ? "low" : "ok";
                  return (
                    <div key={b.id} className={`bk-batch ${selectedBatch === b.id ? "on" : ""}`} onClick={() => setSelectedBatch(b.id)}>
                      <div className="bk-batch-radio" />
                      <div className="bk-batch-dates">
                        <div className="bk-batch-range">{fmtShort(b.startDate)} - {fmtShort(b.endDate)}, {b.year}</div>
                        <div className="bk-batch-meta">
                          {wd(b.startDate) && <span>{wd(b.startDate)}-{wd(b.endDate)}</span>}
                          {b.days ? (<><span className="bk-batch-meta-dot" /><span>{b.days} days</span></>) : null}
                        </div>
                      </div>
                      <span className={`bk-batch-seats ${tier === "ok" ? "" : tier}`}>
                        {b.seatsLeft} of {b.totalSeats} seats left{tier === "urgent" ? " — booking fast" : ""}
                      </span>
                    </div>
                  );
                }) : <div className="bk-empty">No batches available for {selectedMonth === "All" ? "any month" : selectedMonth}.</div>}
              </div>
            </div>

            {/* Category + other sections */}
            {AddSection.map((section, si) => (
              <div className="bk-card" key={si}>
                <div className="bk-card-head">{si === 0 ? <PeopleIcon /> : <RoomIcon />}<h3 className="bk-card-title">{section.sectionTitle || (si === 0 ? "Category" : `Section ${si + 1}`)}</h3></div>
                <div className="bk-qty-head">
                  <span className="ph-c">Type</span>
                  <span className="qc price">{si === 0 ? "Price per person" : "Price"}</span>
                  <span className="qc">Qty</span>
                </div>
                {(section.array || []).length ? section.array.map((item, ii) => QtyRow(item, `${si}-${ii}`, item.Title))
                  : <div className="bk-empty">No options in this section.</div>}
              </div>
            ))}
          </div>

          {/* RIGHT — summary */}
          <aside className="bk-side">
            <h3>Booking Summary</h3>
            <div className="bk-side-row">
              <span className="bk-side-meta"><CalIcon /> Selected Date</span>
              <b>{selectedBatchObj ? `${fmtShort(selectedBatchObj.startDate)} - ${fmtShort(selectedBatchObj.endDate)}` : "Not selected"}</b>
            </div>
            <div className="bk-side-row">
              <span className="bk-side-meta"><PeopleIcon /> Travellers</span>
              <b>{totalTravelers}</b>
            </div>

            <div className="bk-side-coupon">
              <div className="bk-side-coupon-label">Have a coupon?</div>
              <div className="bk-side-coupon-row">
                <input type="text" placeholder="Enter coupon code" value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value); applyCoupon(e.target.value); }} />
                <button className="bk-side-coupon-apply" onClick={() => applyCoupon(couponCode)}>Apply</button>
              </div>
              {coupenDiscount > 0 && <div className="bk-side-coupon-ok">✓ Coupon applied — ₹{coupenDiscount.toLocaleString("en-IN")} off</div>}
            </div>

            <div className="bk-side-divider" />
            <div className="bk-side-summary"><span>Trip total</span><b>₹{totalAmount.toLocaleString("en-IN")}</b></div>
            <div className="bk-side-summary discount"><span>Discount</span><b>−₹{coupenDiscount.toLocaleString("en-IN")}</b></div>
            <div className="bk-side-summary"><span>GST (5%)</span><b>₹{Number(gstAmount.toFixed(0)).toLocaleString("en-IN")}</b></div>

            <div className="bk-side-total">
              <span className="bk-side-total-label">Amount to pay</span>
              <span className="bk-side-total-val">₹{finalAmount.toLocaleString("en-IN")}</span>
            </div>

            <button className="bk-side-cta" disabled={!canProceed} onClick={proceed}>Continue to Details <Arrow /></button>
            <div className="bk-side-secure"><Shield /> Secured by Razorpay · 256-bit encryption</div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Payment;
