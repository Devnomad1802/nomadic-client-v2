/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import "./tripV3.css";
import { useGetTripsQuery } from "../../../services/TripApis";
import { useNewBookingMutation, useOrderMutation } from "../../../services";

const RECEIPT = "123IndNomadic444";
const blankTraveller = (lead = false) => ({ name: "", age: "", gender: "", phone: "", email: "", city: "", isLead: lead });
const parseBatches = (sd) => {
  let b = [];
  try { b = sd ? (typeof sd === "string" ? JSON.parse(sd) : sd) : []; } catch { b = []; }
  const now = new Date(); now.setHours(0, 0, 0, 0);
  return (Array.isArray(b) ? b : [])
    .filter((x) => x?.BatchDate && new Date(x.BatchDate) >= now)
    .sort((a, b) => new Date(a.BatchDate) - new Date(b.BatchDate));
};
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "";

const BookingFlowV3 = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { userDbData } = useSelector((s) => s.global);
  const { data } = useGetTripsQuery();
  const [order] = useOrderMutation();
  const [newBooking] = useNewBookingMutation();

  const item = useMemo(() => {
    const list = Array.isArray(data?.data) ? data.data : [];
    return list.find((t) => t.seoSlug === slug) || list.find((t) => t._id === slug);
  }, [data, slug]);

  const batches = useMemo(() => parseBatches(item?.selectDate), [item]);
  const price = Number(item?.price) || 0;

  const [step, setStep] = useState(1);
  const [batch, setBatch] = useState(null);
  const [count, setCount] = useState(1);
  const [roomType, setRoomType] = useState("");
  const [travellers, setTravellers] = useState([blankTraveller(true)]);
  const [emergency, setEmergency] = useState({ name: "", phone: "", relation: "" });
  const [dietary, setDietary] = useState("");
  const [coupon, setCoupon] = useState("");
  const [agree, setAgree] = useState(false);
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState("");

  if (data && !item) return <div className="tdv3"><div className="wrap" style={{ padding: 80, textAlign: "center" }}>Trip not found.</div></div>;
  if (!item) return <div className="tdv3"><div className="wrap" style={{ padding: 80, textAlign: "center" }}>Loading…</div></div>;

  const total = price * count;

  const setCountSafe = (n) => {
    const v = Math.max(1, Math.min(20, n));
    setCount(v);
    setTravellers((prev) => {
      const next = [...prev];
      while (next.length < v) next.push(blankTraveller(false));
      return next.slice(0, v).map((t, i) => ({ ...t, isLead: i === 0 }));
    });
  };
  const setTrav = (i, k, val) => setTravellers((p) => p.map((t, idx) => (idx === i ? { ...t, [k]: val } : t)));

  const next1 = () => { if (!batch) { setErr("Please select a batch date."); return; } setErr(""); setStep(2); };
  const next2 = () => {
    const lead = travellers[0];
    if (!lead?.name || (!lead?.phone && !lead?.email)) { setErr("Lead traveller needs a name and a phone or email."); return; }
    if (!agree) { setErr("Please accept the terms to continue."); return; }
    setErr(""); setStep(3);
  };

  const pay = async () => {
    if (!userDbData) { navigate(`/trips/${slug}`); return; }
    setErr(""); setPaying(true);
    try {
      const selectedValue = total;
      const res = await order({ amount: Math.round(selectedValue * 100), currency: "INR", receipt: RECEIPT });
      const order2 = await res;
      if (res?.status === "created") throw new Error("Order failed");
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_Slffqw3YxojtUf",
        amount: Math.round(selectedValue * 100),
        currency: "INR",
        name: "Nomadic Townies",
        description: `Booking — ${item.title}`,
        order_id: order2.id,
        prefill: { name: travellers[0]?.name, email: travellers[0]?.email, contact: travellers[0]?.phone },
        handler: async (response) => {
          try {
            const { data: bk } = await newBooking({
              userId: userDbData._id,
              bookingId: response?.razorpay_payment_id,
              paymentDetail: item,
              cardData: { travellers, batch, roomType, count, total: selectedValue },
              selectedValue,
              paymentStatus: "Successful",
              status: "Booked",
              coupenDiscount: 0,
              // structured fields (persisted by new backend)
              travellers,
              emergencyContact: emergency,
              dietary,
              batchDate: batch?.BatchDate || "",
              roomType,
              couponCode: coupon,
            }).unwrap();
            navigate("/paymentsuccess", { state: { data: bk } });
          } catch (e) {
            navigate("/paymentsuccess", { state: { data: { total: selectedValue, paymentStatus: "Successful" } } });
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => { setPaying(false); navigate("/paymentfail"); });
      rzp.open();
      setPaying(false);
    } catch (e) {
      setPaying(false);
      navigate("/paymentfail");
    }
  };

  const Stepper = () => (
    <div className="stepper">
      {["Select Batch", "Your Details", "Confirmation"].map((label, i) => {
        const n = i + 1;
        return (
          <div key={label} style={{ display: "contents" }}>
            <div className={`step${step === n ? " on" : step > n ? " done" : ""}`}>
              <div className="step-num">{step > n ? "✓" : n}</div>{label}
            </div>
            {i < 2 && <div className="step-line" />}
          </div>
        );
      })}
    </div>
  );

  const Summary = ({ title }) => (
    <div className="bk-card" style={{ position: "sticky", top: 80 }}>
      <h3>{title}</h3>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "12px 0", fontSize: 14 }}><span>{item.title}</span></div>
      {batch && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-light)" }}><span>Batch</span><b>{fmt(batch.BatchDate)}</b></div>}
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-light)", marginTop: 6 }}><span>Travellers</span><b>{count}</b></div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-light)", marginTop: 6 }}><span>₹{price.toLocaleString("en-IN")} × {count}</span><b>₹{total.toLocaleString("en-IN")}</b></div>
      <div style={{ borderTop: "1px solid var(--line)", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, color: "var(--text-dark)" }}><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>
    </div>
  );

  return (
    <div className="tdv3">
      <Helmet><title>Book — {item.title} | Nomadic Townies</title></Helmet>
      <div className="wrap" style={{ paddingTop: 28, paddingBottom: 60 }}>
        <Stepper />
        <h3 style={{ fontFamily: "var(--playfair)", fontSize: 22, color: "var(--text-dark)", margin: "18px 0" }}>{item.title}</h3>
        {err && <p style={{ color: "#b91c1c", fontSize: 14, marginBottom: 12 }}>{err}</p>}

        <div className="bk-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start" }}>
          <div>
            {step === 1 && (
              <>
                <div className="bk-card">
                  <h3 className="bk-card-title">Select Batch Date</h3>
                  <div className="bk-batches">
                    {batches.length ? batches.map((b, i) => (
                      <label key={i} className="bk-batch" style={{ borderColor: batch?.BatchDate === b.BatchDate ? "var(--orange)" : "", background: batch?.BatchDate === b.BatchDate ? "#FEF7F7" : "" }}>
                        <input type="radio" name="batch" checked={batch?.BatchDate === b.BatchDate} onChange={() => setBatch(b)} />
                        <div className="bk-batch-range"><b>{fmt(b.BatchDate)}</b>{b.endDate ? ` – ${fmt(b.endDate)}` : ""}</div>
                        {b.seats ? <div className="bk-batch-seats">{b.seats} seats left</div> : null}
                      </label>
                    )) : <p style={{ color: "var(--text-light)" }}>No upcoming batches. Please enquire.</p>}
                  </div>
                </div>
                <div className="bk-card" style={{ marginTop: 16 }}>
                  <h3 className="bk-card-title">Travellers</h3>
                  <div className="bk-qty-control" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button className="bk-qty-btn" onClick={() => setCountSafe(count - 1)}>−</button>
                    <span className="bk-qty-num">{count}</span>
                    <button className="bk-qty-btn" onClick={() => setCountSafe(count + 1)}>+</button>
                    <span style={{ marginLeft: "auto", fontWeight: 700 }}>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                <div className="bk-card" style={{ marginTop: 16 }}>
                  <h3 className="bk-card-title">Room Type <span style={{ color: "var(--text-light)", fontWeight: 400 }}>(optional)</span></h3>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {["Twin sharing", "Triple sharing", "Private room"].map((r) => (
                      <button key={r} className={`spec-chip${roomType === r ? " on" : ""}`} style={{ border: roomType === r ? "1.5px solid var(--orange)" : "1px solid var(--line)", color: roomType === r ? "var(--orange)" : "var(--text-dark)", background: "#fff", padding: "8px 14px", borderRadius: 999, fontWeight: 600, fontSize: 13 }} onClick={() => setRoomType(r === roomType ? "" : r)}>{r}</button>
                    ))}
                  </div>
                </div>
                <div className="bk-actions" style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
                  <button className="td-side-book" style={{ width: "auto", margin: 0, padding: "12px 28px" }} onClick={next1}>Continue to Details</button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                {travellers.map((t, i) => (
                  <div className="bk-card" key={i} style={{ marginBottom: 16 }}>
                    <h3 className="bk-card-title">{i === 0 ? "Lead Traveller Details" : `Co-traveller ${i}`}</h3>
                    <div className="bk-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <input className="bk-fld" placeholder="Full name (as per ID)" value={t.name} onChange={(e) => setTrav(i, "name", e.target.value)} />
                      <input className="bk-fld" placeholder="Age" value={t.age} onChange={(e) => setTrav(i, "age", e.target.value)} />
                      <select className="bk-fld" value={t.gender} onChange={(e) => setTrav(i, "gender", e.target.value)}><option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option></select>
                      <input className="bk-fld" placeholder="City" value={t.city} onChange={(e) => setTrav(i, "city", e.target.value)} />
                      <input className="bk-fld" placeholder="Phone" value={t.phone} onChange={(e) => setTrav(i, "phone", e.target.value)} />
                      <input className="bk-fld" placeholder="Email" value={t.email} onChange={(e) => setTrav(i, "email", e.target.value)} />
                    </div>
                  </div>
                ))}
                <div className="bk-card" style={{ marginBottom: 16 }}>
                  <h3 className="bk-card-title">Emergency Contact</h3>
                  <div className="bk-form-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    <input className="bk-fld" placeholder="Name" value={emergency.name} onChange={(e) => setEmergency({ ...emergency, name: e.target.value })} />
                    <input className="bk-fld" placeholder="Phone" value={emergency.phone} onChange={(e) => setEmergency({ ...emergency, phone: e.target.value })} />
                    <input className="bk-fld" placeholder="Relation" value={emergency.relation} onChange={(e) => setEmergency({ ...emergency, relation: e.target.value })} />
                  </div>
                </div>
                <div className="bk-card" style={{ marginBottom: 16 }}>
                  <h3 className="bk-card-title">Special requests <span style={{ color: "var(--text-light)", fontWeight: 400 }}>(optional)</span></h3>
                  <textarea className="bk-fld" style={{ width: "100%", minHeight: 80 }} placeholder="Dietary preferences, allergies, or anything we should know…" value={dietary} onChange={(e) => setDietary(e.target.value)} />
                </div>
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--text)" }}>
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: 3 }} />
                  <span>I have read and agree to the <a href="/terms-and-conditions" style={{ color: "var(--orange)", fontWeight: 600 }}>terms &amp; conditions</a> and <a href="/cancellation-and-refund" style={{ color: "var(--orange)", fontWeight: 600 }}>cancellation policy</a>.</span>
                </label>
                <div className="bk-actions" style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
                  <button className="td-host-cta" onClick={() => setStep(1)}>← Back</button>
                  <button className="td-side-book" style={{ width: "auto", margin: 0, padding: "12px 28px" }} onClick={next2}>Continue to Review</button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="bk-card">
                  <h3 className="bk-card-title">Order Review</h3>
                  <div style={{ fontSize: 14, color: "var(--text)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}><span>Trip</span><b>{item.title}</b></div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}><span>Batch</span><b>{fmt(batch?.BatchDate)}</b></div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}><span>Lead traveller</span><b>{travellers[0]?.name}</b></div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}><span>Travellers</span><b>{count}</b></div>
                    {roomType && <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}><span>Room</span><b>{roomType}</b></div>}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", fontSize: 18, fontWeight: 800, color: "var(--text-dark)" }}><span>Total payable</span><span>₹{total.toLocaleString("en-IN")}</span></div>
                  </div>
                </div>
                <div className="bk-actions" style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
                  <button className="td-host-cta" onClick={() => setStep(2)}>← Back</button>
                  <button className="td-side-book" style={{ width: "auto", margin: 0, padding: "12px 28px" }} disabled={paying} onClick={pay}>{paying ? "Processing…" : `Proceed to Payment · ₹${total.toLocaleString("en-IN")}`}</button>
                </div>
              </>
            )}
          </div>

          <Summary title={step === 3 ? "Order Review" : "Booking Summary"} />
        </div>
      </div>
    </div>
  );
};

export default BookingFlowV3;
