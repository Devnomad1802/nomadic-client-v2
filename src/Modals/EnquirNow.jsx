/* eslint-disable react/prop-types */
import { useCallback, useState } from "react";
import Modal from "@mui/material/Modal";
import { useSelector } from "react-redux";
import { useEnquirMutation } from "../services/EnquirApi";
import { logo } from "../Images";
import "./enquiryModal.css";

export default function EnquirNow({ opene, setOpene }) {
  const { userDbData } = useSelector((store) => store.global);
  const [enquir, { isLoading }] = useEnquirMutation();

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleClose = () => {
    setOpene(false);
    // reset shortly after close so the closing animation isn't janky
    setTimeout(() => { setSuccess(false); setError(""); }, 200);
  };

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      setError("");
      if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
        setError("Please add your name and a phone number or email.");
        return;
      }
      try {
        await enquir({
          Name: form.name.trim(),
          Phone: form.phone.trim() ? `+91 ${form.phone.trim()}` : "",
          Email: form.email.trim(),
          Message: form.message.trim(),
          userId: userDbData?._id,
        }).unwrap();
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      } catch (err) {
        setError(err?.data?.message || "Something went wrong. Please try again.");
      }
    },
    [enquir, form, userDbData?._id]
  );

  return (
    <Modal open={!!opene} onClose={handleClose} slotProps={{ backdrop: { sx: { background: "transparent" } } }}>
      <div className="enq-root">
        <div className="modal">
          <button className="close-btn" onClick={handleClose} aria-label="Close">
            <svg width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M1 1l12 12M13 1L1 13" /></svg>
          </button>

          {/* LEFT — illustration */}
          <div className="l-panel">
            <div className="l-brand"><img src={logo} alt="Nomadic Townies" /></div>
            <div className="l-illus-wrap">
              <svg viewBox="0 0 240 200" fill="none" stroke="#CD482A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M30 150 C70 120, 90 60, 150 70" stroke="#e7bca9" strokeDasharray="5 8" />
                <path d="M150 30 L210 55 L165 78 L158 110 L142 82 L150 30 Z" fill="#fff" />
                <path d="M150 30 L165 78 L158 110" />
                <path d="M150 30 L158 110" stroke="#e7bca9" />
                <circle cx="30" cy="150" r="5" fill="#CD482A" stroke="none" />
                <path d="M196 120 c6 -8 16 -8 18 0 c8 -3 14 6 8 12 h-34 c-6 -6 0 -15 8 -12" stroke="#e7bca9" />
                <path d="M40 60 c5 -7 14 -7 16 0 c7 -2 12 5 7 10 h-30 c-5 -5 0 -13 7 -10" stroke="#e7bca9" />
              </svg>
            </div>
            <div className="l-caption">
              <h3>One quick <em>note</em>,<br />and we&apos;re on it.</h3>
              <p>Share where you&apos;d like to go — our team replies within a few hours with handpicked options.</p>
            </div>
          </div>

          {/* RIGHT — form / success */}
          {success ? (
            <div className="success-panel">
              <div className="success-icon">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
              </div>
              <h2>Enquiry sent.</h2>
              <p>Thanks — your message is on its way. Expect a reply from our team within the next few hours.</p>
              <button className="submit-btn" style={{ width: "auto", padding: "0 28px" }} onClick={handleClose}>Continue browsing</button>
            </div>
          ) : (
            <form className="r-form" onSubmit={handleSubmit}>
              <div className="r-head">
                <div className="r-eyebrow">Plan your trip</div>
                <h2>Send us an enquiry.</h2>
                <p>Tell us a little about your trip. We&apos;ll handle the rest.</p>
              </div>

              <div className="field">
                <label htmlFor="enq-name">Your name</label>
                <input className="inp" type="text" id="enq-name" name="name" value={form.name} onChange={onChange} placeholder="Jane Doe" autoComplete="name" />
              </div>

              <div className="f-grid">
                <div className="field">
                  <label htmlFor="enq-email">Email</label>
                  <input className="inp" type="email" id="enq-email" name="email" value={form.email} onChange={onChange} placeholder="you@email.com" autoComplete="email" />
                </div>
                <div className="field">
                  <label htmlFor="enq-phone">Phone</label>
                  <div className="ph-row">
                    <span className="cc">+91</span>
                    <input className="inp" type="tel" inputMode="numeric" id="enq-phone" name="phone" value={form.phone} onChange={onChange} placeholder="98765 43210" />
                  </div>
                </div>
              </div>

              <div className="field">
                <label htmlFor="enq-msg">What are you dreaming of?</label>
                <textarea className="inp" id="enq-msg" name="message" value={form.message} onChange={onChange} placeholder="Spiti in July, or maybe a yoga retreat in Goa..." />
              </div>

              {error ? <p className="err-msg">{error}</p> : null}

              <button className="submit-btn" type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send enquiry"}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              </button>
              <p className="fineprint">We typically reply within 4 hours.</p>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}
