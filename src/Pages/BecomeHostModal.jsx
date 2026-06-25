/* eslint-disable react/prop-types */
/**
 * BecomeHostModal — compact popup host enquiry form (design: Become a Host).
 * Opened from "Become a Host" in Meet Our Hosts. Submits via useEnquirMutation.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./becomeHost.css";
import { useEnquirMutation } from "../services/EnquirApi";

const CATEGORIES = [
  "Homestays & living", "Trekking & guiding", "Backpacking & trips",
  "Workshops — pottery, crafts, painting, cooking", "Spiritual & wellness",
  "Nature & adventure", "Other",
];
const YEARS = ["Less than 1 year", "1–3 years", "3–5 years", "5+ years"];
const GROUPS = ["1–2 guests", "3–6 guests", "7–12 guests", "12+ guests"];
const REQUIRED = {
  fullName: "Please enter your full name.",
  email: "Please enter your email address.",
  mobile: "Please enter a mobile number.",
  city: "Please tell us your city and country.",
  category: "Please choose a category.",
  about: "Tell us a little about your experience.",
  years: "Please select your experience level.",
  groupSize: "Please select an expected group size.",
};
const empty = { fullName: "", email: "", mobile: "", city: "", category: "", categoryOther: "", about: "", years: "", groupSize: "", website: "" };
const Caret = () => <span className="caret">▾</span>;

const BecomeHostModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { userDbData } = useSelector((s) => s.global);
  const [enquir, { isLoading }] = useEnquirMutation();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  // lock body scroll while open
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => (er[k] ? { ...er, [k]: undefined } : er));
  };
  const validate = () => {
    const er = {};
    Object.entries(REQUIRED).forEach(([k, msg]) => { if (!`${form[k]}`.trim()) er[k] = msg; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Please enter a valid email address.";
    if (form.about && form.about.trim().length < 20) er.about = "A sentence or two helps us understand your experience.";
    if (form.category === "Other" && !form.categoryOther.trim()) er.categoryOther = "Let us know what you offer.";
    return er;
  };
  const submit = async (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) { document.querySelector(`[name="${Object.keys(er)[0]}"]`)?.focus(); return; }
    const cat = form.category === "Other" ? form.categoryOther : form.category;
    const Message = [
      "Become a Host application", `Category: ${cat}`, `City/Country: ${form.city}`,
      `Experience: ${form.years}`, `Group size: ${form.groupSize}`,
      form.website ? `Website/Social: ${form.website}` : null, "", `About: ${form.about}`,
    ].filter(Boolean).join("\n");
    try { await enquir({ Name: form.fullName, Email: form.email, Phone: form.mobile, Message, userId: userDbData?._id }).unwrap(); } catch { /* follow up regardless */ }
    setDone(true);
  };
  const reset = () => { setForm(empty); setErrors({}); setDone(false); };
  const firstName = form.fullName.trim().split(" ")[0];

  const field = (name, label, props = {}) => (
    <div className={`bh-fld${props.full ? " full" : ""}`}>
      <label>{label}</label>
      <input className={`bh-in${errors[name] ? " invalid" : ""}`} name={name} value={form[name]} onChange={set(name)} placeholder={props.placeholder} type={props.type || "text"} />
      {errors[name] && <span className="bh-err">{errors[name]}</span>}
    </div>
  );
  const selectField = (name, label, options) => (
    <div className="bh-fld">
      <label>{label}</label>
      <div className="bh-select">
        <select className={`bh-in${errors[name] ? " invalid" : ""}`} name={name} value={form[name]} onChange={set(name)} style={{ color: form[name] ? "var(--ink)" : "var(--placeholder)" }}>
          <option value="">Select…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <Caret />
      </div>
      {errors[name] && <span className="bh-err">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="bhm-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className="bhm" role="dialog" aria-modal="true" aria-label="Become a Host">
        <div className="bhm-head">
          <button className="bhm-close" onClick={onClose} aria-label="Close">×</button>
          <div className="bhm-eyebrow">Become a host</div>
          <h2>{done ? "You're in 🎉" : "Tell us about you"}</h2>
          {!done && <p>A few details and our hosting team will be in touch. ~3 minutes.</p>}
        </div>

        <div className="bhm-body">
          <div className="bhpg">
            {done ? (
              <div className="bh-success">
                <div className="bh-success-in">
                  <div className="bh-check">✓</div>
                  <h2>Welcome to the journey{firstName ? `, ${firstName}` : ""}.</h2>
                  <p>Your inquiry is in. Our hosting team reviews every application personally — once approved, we&apos;ll send your host welcome and next steps, usually within 3 days.</p>
                  <div className="bh-steps">
                    <div className="bh-step done"><span className="bh-step-dot done">✓</span><span>Submitted</span></div>
                    <div className="bh-step-line a" />
                    <div className="bh-step now"><span className="bh-step-dot now">2</span><span>Under review</span></div>
                    <div className="bh-step-line b" />
                    <div className="bh-step next"><span className="bh-step-dot next">3</span><span>Approved</span></div>
                  </div>
                  <div className="bh-success-actions">
                    <button className="bh-btn-light" onClick={() => { onClose?.(); navigate("/all-packages"); }}>Explore experiences</button>
                    <button className="bh-btn-ghost" onClick={reset}>Submit another</button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                <div className="bh-grid">
                  {field("fullName", "Full name")}
                  {field("email", "Email address", { type: "email" })}
                  {field("mobile", "Mobile number")}
                  {field("city", "City / country")}

                  <div className="bh-fld full">
                    <label>Experience category</label>
                    <div className="bh-select">
                      <select className={`bh-in${errors.category ? " invalid" : ""}`} name="category" value={form.category} onChange={set("category")} style={{ color: form.category ? "var(--ink)" : "var(--placeholder)" }}>
                        <option value="">Select what you offer…</option>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c === "Other" ? "Other (tell us)" : c}</option>)}
                      </select>
                      <Caret />
                    </div>
                    {errors.category && <span className="bh-err">{errors.category}</span>}
                  </div>

                  {form.category === "Other" && field("categoryOther", "Tell us what you offer", { full: true, placeholder: "e.g. Mountain photography walks…" })}

                  <div className="bh-fld full">
                    <label>Tell us about your experience</label>
                    <textarea className={`bh-in${errors.about ? " invalid" : ""}`} name="about" rows={3} value={form.about} onChange={set("about")} placeholder="What will travellers do, see and feel with you?" />
                    {errors.about && <span className="bh-err">{errors.about}</span>}
                  </div>

                  {selectField("years", "Years of experience", YEARS)}
                  {selectField("groupSize", "Expected group size", GROUPS)}
                  {field("website", "Website / social profile", { full: true, placeholder: "instagram.com/yourhandle" })}
                </div>
                <div className="bh-actions">
                  <button type="submit" className="bh-cta" disabled={isLoading}>
                    {isLoading ? "Sending…" : "Send your inquiry"} <span style={{ fontSize: 16 }}>→</span>
                  </button>
                  <span className="bh-note">We review every application personally. No fees to apply.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeHostModal;
