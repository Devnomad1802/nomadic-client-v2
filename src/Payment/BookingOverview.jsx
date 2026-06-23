import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useNewBookingMutation,
  useOrderMutation,
} from "../services";
import Loading from "../SmallComponents/Loading";
import Toastify from "../SmallComponents/Tostify";
import { useSelector } from "react-redux";
import LoginModal from "../Modals/LoginModal";
import "./booking.css";

const BookingOverview = () => {
  const [openL, setOpenL] = useState(false);
  const toggelModelL = () => {
    setOpenL(!openL);
  };
  const { userDbData } = useSelector((store) => store.global);
  const navigate = useNavigate();
  const location = useLocation();
  const currency = "INR";
  const reciptId = "123IndNomadic444";
  const { paymentDetail, selectedBatch, selections, totalAmount, coupenDiscount,
    travellers, emergencyContact, dietary, batchDate, roomType } =
    location.state || {};


  // Calculate base amount from selections (same logic as Payment.jsx)
  const calculateBaseAmount = () => {
    let baseAmount = 0;
    if (selections?.quantities) {
      Object.entries(selections.quantities).forEach(([key, quantity]) => {
        if (quantity > 0) {
          const [sectionIndex, itemIndex] = key.split('-');
          const sectionData = JSON.parse(paymentDetail?.addsection || "[]");
          if (sectionData[sectionIndex]?.array?.[itemIndex]) {
            const item = sectionData[sectionIndex].array[itemIndex];
            baseAmount += quantity * (parseInt(item.TitlePrice) || 0);
          }
        }
      });
    }
    return baseAmount;
  };

  const baseAmount = calculateBaseAmount();

  // Transform the data to match expected structure
  const cardData = {
    numberOfTravelers: selections?.quantities ?
      Object.entries(selections.quantities)
        .filter(([key]) => key.startsWith('0-')) // Only count first section (CATEGORY)
        .reduce((sum, [, qty]) => sum + (qty || 0), 0) : 0,
    cardDate: {
      batchDate: selectedBatch?.startDate,
      endSelectDate: selectedBatch?.endDate,
      numberOfDays: selectedBatch?.days
    },
    gstTax: baseAmount ? (baseAmount - coupenDiscount) * 0.05 : 0,
    cardSectionData: []
  };

  // Transform selections to cardSectionData format
  if (selections?.quantities) {
    Object.entries(selections.quantities).forEach(([key, quantity]) => {
      if (quantity > 0) {
        const [sectionIndex, itemIndex] = key.split('-');
        const sectionData = JSON.parse(paymentDetail?.addsection || "[]");
        if (sectionData[sectionIndex]?.array?.[itemIndex]) {
          cardData.cardSectionData.push({
            ...sectionData[sectionIndex].array[itemIndex],
            quantity: quantity
          });
        }
      }
    });
  }

  if (selections?.toggles) {
    selections.toggles.forEach((key) => {
      const [sectionIndex, itemIndex] = key.split('-');
      const sectionData = JSON.parse(paymentDetail?.addsection || "[]");
      if (sectionData[sectionIndex]?.array?.[itemIndex]) {
        cardData.cardSectionData.push({
          ...sectionData[sectionIndex].array[itemIndex],
          quantity: 1
        });
      }
    });
  }

  const Total = totalAmount || 0;

  const array = [
    { heading: "Location", text: paymentDetail?.location || "" },
    { heading: "No of Travellers", text: cardData?.numberOfTravelers || 0 },
    {
      heading: "Date",
      text: cardData?.cardDate?.batchDate && cardData?.cardDate?.endSelectDate
        ? `${new Date(cardData.cardDate.batchDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${new Date(cardData.cardDate.endSelectDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
        : "—",
    },
    { heading: "Pick Up/Drop Off", text: `${paymentDetail?.pickUp || "Bagdogra"} - ${paymentDetail?.dropOff || "Bagdogra"}` },
    { heading: "No of Days", text: `${paymentDetail?.days || 7}D/${paymentDetail?.nights || 6}N` },
  ];

  // value
  const [selectedValue, setSelectedValue] = useState(Total);
  const [paymentStatus, setPaymentStatus] = useState("fullPayment");

  const handleChange = (event) => {
    setPaymentStatus(event.target.name);
    setSelectedValue(Number(event.target.value));
  };

  // --------------------- Date Calculation ----------------------

  // Handle Order Function
  // Register User
  // Show Toast
  // Loading
  const [loading] = React.useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
  });
  const showToast = (msg, type) => {
    return setAlertState({
      open: true,
      message: msg,
      severity: type,
    });
  };
  const [order] = useOrderMutation();
  const [newBooking] = useNewBookingMutation();

  const handleOrder = async (event) => {
    event.preventDefault();

    // User login is already checked on component mount
    if (userDbData) {
      try {
        const response = await order({
          amount: Math.round(selectedValue * 100),
          currency,
          receipt: reciptId,
        });
        const order2 = await response;

        if (response?.status === "created") {
          throw new Error("Failed to fetch order details");
        }

        // Construct options for Razorpay
        const options = {
          // Test by default; set VITE_RAZORPAY_KEY_ID=rzp_live_... in Vercel to go live
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_Slffqw3YxojtUf",
          amount: Math.round(selectedValue * 100),
          currency,
          name: "Nomadic Townies",
          description: "Trip Booking Payment",
          image: "https://i.ibb.co/5Y3m33n/test.png",
          order_id: order2.id,
          handler: async function (response) {
            try {
              const body = { ...response };
              const bookingid = body?.razorpay_payment_id;

              const { data, message } = await newBooking({
                userId: userDbData._id,
                bookingId: bookingid,
                paymentDetail,
                cardData,
                selectedValue,
                paymentStatus,
                coupenDiscount,
                travellers,
                emergencyContact,
                dietary,
                batchDate,
                roomType,
              }).unwrap();

              showToast(message, "success");
              navigate("/paymentsuccess", {
                state: {
                  data,
                },
              });
            } catch (error) {
              console.error("Error in payment handler:", error);
              showToast("Payment successful but booking failed. Please contact support.", "error");
              // Still navigate to success page if payment was successful
              navigate("/paymentsuccess", {
                state: {
                  data: {
                    cardData: JSON.stringify(cardData),
                    paymentDetail: JSON.stringify(paymentDetail),
                    total: selectedValue,
                    paymentStatus,
                    coupenDiscount,
                  },
                },
              });
            }
          },
        };

        // Initialize Razorpay with the options
        var rzp1 = new window.Razorpay(options);

        // Handle payment failure
        rzp1.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });

        // Open the Razorpay payment dialog
        rzp1.open();
        event.preventDefault();
      } catch (error) {
        // Handle errors
        console.error("Error:", error);
        navigate("/paymentfail", {});
      }
    }
  };

  const [particalShow, setPartialShow] = useState(true);

  // ----------------------- Check User Login -------------------------------
  useEffect(() => {
    if (!userDbData) {
      // Option 1: Show login modal (current approach)
      setOpenL(true);

      // Option 2: Redirect to login page (uncomment if preferred)
      // navigate('/login');
    }
  }, [userDbData, navigate]);

  // ----------------------- Cheack Date -------------------------------
  useEffect(() => {
    if (cardData?.cardDate?.batchDate) {
      const batchDate = new Date(cardData?.cardDate?.batchDate);

      // Subtract 15 days from the given date
      batchDate.setDate(batchDate.getDate() - 15);

      // Get the current UTC date and time
      const currentUtcDate = new Date();


      // Compare if the modified batch date is greater than the current UTC date
      if (batchDate > currentUtcDate) {
        setPartialShow(false);
      } else {
        setPartialShow(true);
      }
    } else {
      setPartialShow(true);
    }
  }, [cardData?.cardDate?.batchDate]);
  const StepperBO = () => (
    <div className="stepper">
      {["Select Batch", "Your Details", "Confirmation"].map((label, i) => (
        <div key={label} style={{ display: "contents" }}>
          <div className={`step ${i < 2 ? "done" : "on"}`}>
            <div className="step-num">{i < 2 ? "✓" : 3}</div>
            <span className="lbl">{label}</span>
          </div>
          {i < 2 && <div className={`step-line ${i < 2 ? "done" : ""}`} />}
        </div>
      ))}
    </div>
  );

  const lineItems = (cardData?.cardSectionData || []).flat();
  const cover = paymentDetail?.cardImage || paymentDetail?.bannerImage;
  const dateStr = cardData?.cardDate?.batchDate && cardData?.cardDate?.endSelectDate
    ? `${new Date(cardData.cardDate.batchDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })} - ${new Date(cardData.cardDate.endSelectDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
    : (batchDate || "—");

  return (
    <div className="bkpg">
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <LoginModal openL={openL} setOpenL={setOpenL} toggelModelL={toggelModelL} />
      <div className="wrap">
        <StepperBO />

        {/* trip strip */}
        <div className="bk-summary-strip">
          {cover ? <img src={cover} alt="" /> : <div className="ph" />}
          <div className="bk-summary-strip-info">
            <h3>{paymentDetail?.title}</h3>
            <div className="bk-summary-strip-meta">
              <span>{dateStr}</span><span className="bk-batch-meta-dot" />
              <span>{cardData?.numberOfTravelers || 0} traveller{(cardData?.numberOfTravelers || 0) === 1 ? "" : "s"}</span>
            </div>
          </div>
          <span className="bk-summary-strip-edit" onClick={() => navigate(-1)}>&larr; Edit</span>
        </div>

        <div className="bk-grid">
          <div>
            {/* trip details */}
            <div className="bk-card">
              <div className="bk-card-head"><h3 className="bk-card-title">Trip Details</h3></div>
              <div className="sc-card-body" style={{ padding: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                {array.map((a, i) => (
                  <div key={i}>
                    <div className="sc-detail-label">{a.heading}</div>
                    <div className="sc-detail-val">{a.text}</div>
                  </div>
                ))}
                {roomType && (
                  <div><div className="sc-detail-label">Room</div><div className="sc-detail-val">{roomType}</div></div>
                )}
              </div>
            </div>

            {/* travellers */}
            {Array.isArray(travellers) && travellers.length > 0 && (
              <div className="bk-card">
                <div className="bk-card-head"><h3 className="bk-card-title">Travellers</h3></div>
                {travellers.map((t, i) => (
                  <div className="bk-traveler-card" key={i} style={{ marginTop: i ? 10 : 0 }}>
                    <div className="bk-traveler-head">
                      <div className="bk-traveler-num"><span className="num">{i + 1}</span> {t.name || `Traveller ${i + 1}`}</div>
                      {t.isLead && <span className="bk-traveler-primary">Lead</span>}
                    </div>
                    <div className="bk-summary-strip-meta">
                      {t.age && <span>{t.age} yrs</span>}
                      {t.gender && <><span className="bk-batch-meta-dot" /><span>{t.gender}</span></>}
                      {t.phone && <><span className="bk-batch-meta-dot" /><span>{t.phone}</span></>}
                    </div>
                  </div>
                ))}
                {dietary && <p className="bk-card-note" style={{ marginTop: 12, marginBottom: 0 }}>Special requests: {dietary}</p>}
              </div>
            )}
          </div>

          {/* sticky pay */}
          <aside className="bk-side">
            <h3>Payment Summary</h3>
            {lineItems.map((item, i) => (
              <div className="bk-side-summary" key={i}>
                <span>{item.Title} {item.quantity ? `× ${item.quantity}` : ""}</span>
                <b>&#8377;{(Number(item.TitlePrice || 0) * (item.quantity || 1)).toLocaleString("en-IN")}</b>
              </div>
            ))}
            <div className="bk-side-divider" />
            <div className="bk-side-summary"><span>GST (5%)</span><b>&#8377;{Number(cardData?.gstTax || 0).toFixed(0)}</b></div>
            {coupenDiscount > 0 && <div className="bk-side-summary discount"><span>Discount</span><b>&minus;&#8377;{Number(coupenDiscount).toLocaleString("en-IN")}</b></div>}
            <div className="bk-side-total">
              <span className="bk-side-total-label">Total</span>
              <span className="bk-side-total-val">&#8377;{Math.round(Number(Total)).toLocaleString("en-IN")}</span>
            </div>

            {/* payment option */}
            {particalShow === false && (
              <div style={{ marginTop: 16 }}>
                <div className="bk-side-coupon-label">Payment option</div>
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", cursor: "pointer", fontSize: 13.5, color: "var(--text)" }}>
                  <input type="radio" name="firstPayment" value={Number(paymentDetail?.firstBookingPrice || 0)} checked={paymentStatus === "firstPayment"} onChange={handleChange} style={{ accentColor: "var(--orange)", marginTop: 2 }} />
                  <span><b style={{ color: "var(--text-dark)" }}>&#8377;{Number(paymentDetail?.firstBookingPrice || 0).toFixed(0)}</b> now &middot; pay &#8377;{(Total - Number(paymentDetail?.firstBookingPrice || 0)).toFixed(0)} before the trip</span>
                </label>
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", cursor: "pointer", fontSize: 13.5, color: "var(--text)" }}>
                  <input type="radio" name="fullPayment" value={Total} checked={paymentStatus === "fullPayment"} onChange={handleChange} style={{ accentColor: "var(--orange)", marginTop: 2 }} />
                  <span><b style={{ color: "var(--text-dark)" }}>&#8377;{Number(Total).toFixed(0)}</b> &middot; pay in full now</span>
                </label>
              </div>
            )}

            <button className="bk-side-cta" disabled={!userDbData || !selectedValue} onClick={handleOrder}>
              Pay &#8377;{Math.round(Number(selectedValue || Total)).toLocaleString("en-IN")}
            </button>
            <div className="bk-side-secure">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 6v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6L12 2Z" /></svg>
              Secured by Razorpay &middot; 256-bit encryption
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingOverview;
