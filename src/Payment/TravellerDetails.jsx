/* eslint-disable react/prop-types */
/**
 * TravellerDetails.jsx — Booking Step 2 (scoped .bkpg).
 * Lead + co-traveller details, special requests, terms. Forwards
 * travellers/emergencyContact/dietary/batchDate/roomType to /booking_overview.
 * Bookings schema + controller already persist these — no backend change.
 */
import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./booking.css";

const UserIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>);
const PeopleIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3" /><path d="M3 19a5.5 5.5 0 0 1 11 0M16 5.2a3 3 0 0 1 0 5.6M21 19a5.5 5.5 0 0 0-3.5-5.1" /></svg>);
const ChatIcon = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>);
const Arrow = () => (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>);

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
  return Number.isNaN(x.getTime()) ? "" : x.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const Fld = ({ label, required, full, type = "text", value, onChange, placeholder, options }) => (
  <div className={`bk-fld${full ? " full" : ""}`}>
    <label>{label} {required && <span>*</span>}</label>
    {options
      ? <select value={value} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o} value={o === "Select" ? "" : o}>{o}</option>)}</select>
      : <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />}
  </div>
);

const TravellerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentDetail, selectedBatch, selections, totalAmount, coupenDiscount } = location.state || {};

  const count = useMemo(() => {
    const q = selections?.quantities || {};
    return Math.max(1, Object.entries(q).filter(([k]) => k.startsWith("0-")).reduce((s, [, n]) => s + (n || 0), 0));
  }, [selections]);

  const roomType = useMemo(() => {
    const q = selections?.quantities || {};
    try {
      const sec = JSON.parse(paymentDetail?.addsection || "[]");
      for (const [k, n] of Object.entries(q)) {
        const [si, ii] = k.split("-");
        if (Number(si) > 0 && n > 0) return sec[si]?.array?.[ii]?.Title || "";
      }
    } catch { /* noop */ }
    return "";
  }, [selections, paymentDetail]);

  const [lead, setLead] = useState({ name: "", age: "", phone: "", email: "", gender: "", city: "" });
  const [emergency, setEmergency] = useState("");
  const [co, setCo] = useState(Array.from({ length: Math.max(0, count - 1) }, () => ({ name: "", age: "", gender: "", relation: "" })));
  const [dietary, setDietary] = useState("");
  const [agree, setAgree] = useState(true);

  const patchCo = (i, p) => setCo((a) => a.map((c, idx) => (idx === i ? { ...c, ...p } : c)));

  const leadOk = lead.name && lead.age && lead.phone && lead.email && lead.gender && lead.city && emergency;
  const coOk = co.every((c) => c.name && c.age && c.gender);
  const canProceed = leadOk && coOk && agree;

  const proceed = () => {
    if (!canProceed) return;
    navigate("/booking_overview", {
      state: {
        paymentDetail, selectedBatch, selections, totalAmount, coupenDiscount,
        travellers: [{ ...lead, isLead: true }, ...co.map((c) => ({ ...c, isLead: false }))],
        emergencyContact: { phone: emergency },
        dietary,
        batchDate: selectedBatch ? `${fmtShort(selectedBatch.startDate)} - ${fmtShort(selectedBatch.endDate)}` : "",
        roomType,
      },
    });
  };

  if (!paymentDetail) {
    return (
      <div className="bkpg"><div className="wrap" style={{ textAlign: "center", paddingTop: 64 }}>
        <p style={{ color: "var(--text-light)" }}>No booking in progress. Please start from a trip.</p>
        <button className="btn btn-orange btn-md" style={{ marginTop: 16 }} onClick={() => navigate("/all-packages")}>Browse trips</button>
      </div></div>
    );
  }

  const dates = selectedBatch ? `${fmtShort(selectedBatch.startDate)} - ${fmtShort(selectedBatch.endDate)}` : "—";
  const cover = paymentDetail?.cardImage || paymentDetail?.bannerImage;

  return (
    <div className="bkpg">
      <Helmet><title>Traveller Details | Nomadic Townies</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <div className="wrap">
        <Stepper active={1} />

        {/* trip strip */}
        <div className="bk-summary-strip">
          {cover ? <img src={cover} alt="" /> : <div className="ph" />}
          <div className="bk-summary-strip-info">
            <h3>{paymentDetail?.title}</h3>
            <div className="bk-summary-strip-meta">
              <span>{dates}</span><span className="bk-batch-meta-dot" /><span>{count} traveller{count === 1 ? "" : "s"}</span>
            </div>
          </div>
          <span className="bk-summary-strip-edit" onClick={() => navigate(-1)}>← Edit</span>
        </div>

        <div className="bk-grid">
          <div>
            {/* lead */}
            <div className="bk-card">
              <div className="bk-card-head"><UserIcon /><h3 className="bk-card-title">Lead Traveller Details</h3></div>
              <p className="bk-card-note">This will be our main point of contact for the trip.</p>
              <div className="bk-traveler-card">
                <div className="bk-traveler-head">
                  <div className="bk-traveler-num"><span className="num">1</span> Traveller 1</div>
                  <span className="bk-traveler-primary">Lead</span>
                </div>
                <div className="bk-form-grid">
                  <Fld label="Full Name" required value={lead.name} onChange={(v) => setLead({ ...lead, name: v })} placeholder="As per government ID" />
                  <Fld label="Age" required type="number" value={lead.age} onChange={(v) => setLead({ ...lead, age: v })} placeholder="Years" />
                  <Fld label="Phone" required type="tel" value={lead.phone} onChange={(v) => setLead({ ...lead, phone: v })} placeholder="10-digit number" />
                  <Fld label="Email" required type="email" value={lead.email} onChange={(v) => setLead({ ...lead, email: v })} placeholder="you@email.com" />
                  <Fld label="Gender" required value={lead.gender} onChange={(v) => setLead({ ...lead, gender: v })} options={["Select", "Male", "Female", "Other"]} />
                  <Fld label="City" required value={lead.city} onChange={(v) => setLead({ ...lead, city: v })} placeholder="e.g. Bengaluru" />
                  <Fld label="Emergency Contact" required full type="tel" value={emergency} onChange={setEmergency} placeholder="Phone of someone who knows you're travelling" />
                </div>
              </div>
            </div>

            {/* co-travellers */}
            {co.map((c, i) => (
              <div className="bk-card" key={i}>
                <div className="bk-card-head"><PeopleIcon /><h3 className="bk-card-title">Co-traveller {i + 1}</h3></div>
                <div className="bk-traveler-card">
                  <div className="bk-traveler-head">
                    <div className="bk-traveler-num"><span className="num">{i + 2}</span> Traveller {i + 2}</div>
                  </div>
                  <div className="bk-form-grid">
                    <Fld label="Full Name" required value={c.name} onChange={(v) => patchCo(i, { name: v })} placeholder="As per government ID" />
                    <Fld label="Age" required type="number" value={c.age} onChange={(v) => patchCo(i, { age: v })} placeholder="Years" />
                    <Fld label="Gender" required value={c.gender} onChange={(v) => patchCo(i, { gender: v })} options={["Select", "Male", "Female", "Other"]} />
                    <Fld label="Relation to lead" value={c.relation} onChange={(v) => patchCo(i, { relation: v })} options={["Select", "Partner", "Friend", "Family"]} />
                  </div>
                </div>
              </div>
            ))}

            {/* special requests */}
            <div className="bk-card">
              <div className="bk-card-head"><ChatIcon /><h3 className="bk-card-title">Special requests <span style={{ fontSize: 12, color: "var(--text-light)", fontWeight: 500, marginLeft: 6 }}>(optional)</span></h3></div>
              <div className="bk-fld full">
                <label>Dietary preferences, allergies, or anything else we should know</label>
                <input type="text" value={dietary} onChange={(e) => setDietary(e.target.value)} placeholder="e.g. Vegetarian, no nuts, vegan options on day 4…" />
              </div>
            </div>

            {/* terms */}
            <div className="bk-terms">
              <input type="checkbox" id="terms" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <label htmlFor="terms">I have read and agree to the <a href="/terms-and-conditions" target="_blank" rel="noreferrer">Terms &amp; Conditions</a>, <a href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>, and <a href="/cancellation-and-refund" target="_blank" rel="noreferrer">Cancellation Policy</a>. I confirm all traveller details are accurate.</label>
            </div>

            {/* actions */}
            <div className="bk-actions">
              <div className="bk-actions-amt">
                <div className="bk-actions-amt-label">You&apos;ll be charged</div>
                <div className="bk-actions-amt-val">₹{Number(totalAmount || 0).toLocaleString("en-IN")}</div>
              </div>
              <div className="bk-actions-buttons">
                <button className="btn btn-ghost btn-md" onClick={() => navigate(-1)}>← Back</button>
                <button className="btn btn-orange btn-md" disabled={!canProceed} onClick={proceed}>Proceed to Payment <Arrow /></button>
              </div>
            </div>
          </div>

          {/* order review */}
          <aside className="bk-side">
            <h3>Order Review</h3>
            <div className="bk-side-row"><span>Trip</span><b style={{ textAlign: "right", maxWidth: 160, fontSize: 13 }}>{paymentDetail?.title}</b></div>
            <div className="bk-side-row"><span>Dates</span><b>{dates}</b></div>
            <div className="bk-side-row"><span>Travellers</span><b>{count}</b></div>
            {roomType && <div className="bk-side-row"><span>Room</span><b>{roomType}</b></div>}
            <div className="bk-side-divider" />
            <div className="bk-side-total">
              <span className="bk-side-total-label">Total</span>
              <span className="bk-side-total-val">₹{Number(totalAmount || 0).toLocaleString("en-IN")}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TravellerDetails;
