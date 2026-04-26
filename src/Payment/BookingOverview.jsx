import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Button, IconButton } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useNewBookingMutation,
  useOrderMutation,
} from "../services";
import Loading from "../SmallComponents/Loading";
import Toastify from "../SmallComponents/Tostify";
import { useSelector } from "react-redux";
import LoginModal from "../Modals/LoginModal";

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
  const { paymentDetail, selectedBatch, selections, totalAmount, coupenDiscount } =
    location.state || {};

  console.log("paymentDetail", paymentDetail);
  console.log("selectedBatch", selectedBatch);
  console.log("selections", selections);
  console.log("totalAmount", totalAmount);

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
    {
      icon: <PlaceOutlinedIcon sx={{ color: "#0D99FF" }} />,
      heading: "Location",
      text: paymentDetail?.location || "",
    },
    {
      icon: <DirectionsWalkIcon sx={{ color: "#0D99FF" }} />,
      heading: "No of Travellers",
      text: cardData?.numberOfTravelers || 0,
    },
    {
      icon: <CalendarTodayOutlinedIcon sx={{ color: "#0D99FF" }} />,
      heading: "Date",
      text: (
        <>
          {cardData?.cardDate?.batchDate && cardData?.cardDate?.endSelectDate ? (
            <>
              {new Date(cardData?.cardDate?.batchDate).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric",
                }
              )}
              {" - "}
              {new Date(cardData?.cardDate?.endSelectDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </>
          ) : (
            "00, 00"
          )}
        </>
      ),
    },
    {
      icon: <PlaceOutlinedIcon sx={{ color: "#0D99FF" }} />,
      heading: "Pick Up/Drop Off",
      text: `${paymentDetail?.pickUp || "Bagdogra"} - ${paymentDetail?.dropOff || "Bagdogra"}`,
    },
    {
      icon: <AccessTimeOutlinedIcon sx={{ color: "#0D99FF" }} />,
      heading: "No of Days",
      text: `${paymentDetail?.days || 7}D/${paymentDetail?.nights || 6}N`,
    },
  ];

  const array1 = [
    {
      heading: "GST @5%",
      amount: "",
      totalamount: `${Number(cardData?.gstTax || 0).toFixed(0)}`,
    },
    {
      heading: "Discount",
      amount: "",
      totalamount: `-${coupenDiscount || 0}`,
    },
  ];
  const matches = useMediaQuery("(min-width:600px)");

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
        // console.log("responce", response);
        const order2 = await response;

        if (response?.status === "created") {
          throw new Error("Failed to fetch order details");
        }

        // Construct options for Razorpay
        const options = {
          key: "rzp_test_R767IuvrU4JvCl", // Add your Razorpay key here
          amount: Math.round(selectedValue * 100),
          currency,
          name: "Nomadic Townies",
          description: "Test Transaction",
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
  console.log("particalShow", particalShow);

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

      console.log("batchDate", batchDate);

      // Compare if the modified batch date is greater than the current UTC date
      if (batchDate > currentUtcDate) {
        console.log(
          "The modified batch date is greater than the current UTC date."
        );
        setPartialShow(false);
      } else {
        setPartialShow(true);
        console.log(
          "The modified batch date is not greater than the current UTC date."
        );
      }
    } else {
      setPartialShow(true);
    }
  }, [cardData?.cardDate?.batchDate]);

  return (
    <Box>
      <Loading isLoading={loading} />{" "}
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <LoginModal
        openL={openL}
        setOpenL={setOpenL}
        toggelModelL={toggelModelL}
      />
      <Container>
        <Box sx={{ background: "#FBFBFB" }}>
          <Box
            sx={{
              display: "flex",
              gap: "0px 20px",
              alignItems: "center",
              py: 2,
            }}
          >
            <IconButton
              onClick={() => {
                navigate(-1);
              }}
            >
              <KeyboardBackspaceIcon
                sx={{ color: "#000", fontSize: "25px", fontWeight: 400 }}
              />
            </IconButton>
            <Typography sx={{ color: "#0D99FF", fontSize: "22px" }}>
              Booking Overview
            </Typography>
          </Box>
          <Box
            sx={{ width: "100%", height: "1px", border: "1px solid #F3F4F6" }}
          />
          <Box
            sx={{
              display: "flex",
              p: { xs: 1, md: 3 },
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" },
              Width: { xs: "100%", md: "60%" },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "#0D99FF",
                  textAlign: "start",
                  py: 2,
                }}
              >
                Booking Details
              </Typography>
              <Box sx={{ border: "1px solid #F3F4F6", borderRadius: "15px" }}>
                <Box
                  sx={{
                    background: "#F9FAFB",
                    borderRadius: "15px 15px 0px 0px ",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#4B5563",
                      p: 2,
                      fontSize: { xs: "20px", md: "22px" },
                      textAlign: "left",
                    }}
                  >
                    {paymentDetail?.title}
                  </Typography>
                </Box>
                {array.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        p: 2,
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: { xs: "0px 10px", md: "0px 15px" },
                          width: { xs: "auto", md: "200px" },
                          alignItems: "center",
                        }}
                      >
                        {item.icon}
                        <Typography
                          sx={{
                            color: "#9CA3AF",
                            fontSize: { xs: "12px", sm: "14px", md: "15px" },
                            textAlign: "center",
                          }}
                        >
                          {item.heading}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          color: "#4B5563",
                          fontSize: { xs: "12px", sm: "15px", md: "17px" },
                          textAlign: "left",
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
            <Box sx={{ width: { xs: "100%", md: "60%" } }}>
              <Typography
                sx={{
                  fontSize: "15px",
                  color: "#0D99FF",
                  textAlign: "start",
                  py: 2,
                }}
              >
                Payment Details
              </Typography>
              <Box
                sx={{
                  background: "#F8F8F8",
                  width: "100%",
                  borderRadius: "15px",
                }}
              >
                {cardData?.cardSectionData?.flat().map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        p: 2,
                        borderBottom: "1px solid #EDEDED",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#4B5563",
                          fontSize: { xs: "12px", sm: "15px", md: "17px" },
                        }}
                      >
                        {item?.Title}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#4B5563",
                          fontSize: { xs: "12px", sm: "15px", md: "17px" },
                        }}
                      >
                        &#8377;{Number(item?.TitlePrice || 0).toFixed(1)} x {item.quantity}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#4B5563",
                          fontSize: { xs: "12px", sm: "15px", md: "17px" },
                        }}
                      >
                        &#8377;{(Number(item?.TitlePrice || 0) * item.quantity).toFixed(1)}
                      </Typography>
                    </Box>
                  );
                })}

                {array1?.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        p: 2,
                        borderBottom: "1px solid #EDEDED",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#4B5563",
                          fontSize: { xs: "12px", sm: "15px", md: "17px" },
                        }}
                      >
                        {item?.heading}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#4B5563",
                          fontSize: { xs: "12px", sm: "15px", md: "17px" },
                        }}
                      >
                        &#8377; {Number(item?.totalamount || 0).toFixed(1)}
                      </Typography>
                    </Box>
                  );
                })}

                <Box
                  sx={{
                    background: "#EDEDED",
                    borderRadius: "0px 0px 15px 15px",
                    display: "flex",
                    p: 3,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#4B5563",
                      fontSize: { xs: "16px", sm: "20px", md: "21px" },
                      fontWeight: 500,
                    }}
                  >
                    Total Trip Amount
                  </Typography>
                  <Typography
                    sx={{
                      color: "#4B5563",
                      fontSize: { xs: "16px", sm: "20px", md: "21px" },
                      fontWeight: 500,
                    }}
                  >
                    &#8377;{Total.toFixed(1)}
                  </Typography>
                </Box>
              </Box>
              {particalShow === false && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      background: "#F9FAFB",
                      borderRadius: "15px",
                      justifyContent: "space-between",

                      p: 2,
                      mt: 3,
                      alignItems: { xs: "center", sm: "start" },
                      flexDirection: { xs: "column", sm: "row" },
                      gap: { xs: "20px 0px" },
                      // border: "2px solid red",
                    }}
                  >
                    <Box sx={{}}>
                      <Typography
                        sx={{
                          color: "#4B5563",
                          fontSize: { xs: "15px", md: "19px" },
                          textAlign: { xs: "center", sm: "left", md: "left" },
                          fontWeight: 500,
                        }}
                      >
                        Book this trip now by paying
                      </Typography>
                      {particalShow === false ? (
                        <>
                          <Typography
                            sx={{
                              color: "#4B5563",
                              fontSize: { xs: "12px", md: "15px" },
                              textAlign: { xs: "center", md: "left" },
                              mt: 2,
                            }}
                          >
                            Note: Balance amount of &#8377;
                            {(Total - Number(paymentDetail?.firstBookingPrice || 0)).toFixed(1)}{" "}
                            can be paid upto{" "}
                            {cardData?.cardDate?.batchDate ?
                              new Date(cardData?.cardDate?.batchDate).toLocaleDateString("en", {
                                weekday: "short",
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }) : "Invalid Date"}
                          </Typography>
                        </>
                      ) : null}
                    </Box>

                    <Typography
                      sx={{
                        color: "#00C30F",
                        fontSize: { xs: "17px", md: "21px" },
                        fontWeight: 500,
                        textAlign: { xs: "center", md: "right" },
                      }}
                    >
                      &#8377;{Number(paymentDetail?.firstBookingPrice || 0).toFixed(1)}
                    </Typography>
                  </Box>
                </>
              )}
              <Box>
                <Typography
                  sx={{
                    fontSize: "15px",
                    color: "#0D99FF",
                    textAlign: "start",
                    py: 2,
                  }}
                >
                  Select amount
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue={Total} // Set the default value to Total
                      name="radio-buttons-group"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    >
                      {particalShow === false ? (
                        <>
                          <FormControlLabel
                            sx={{
                              color: "#CD482A",
                            }}
                            name="firstPayment"
                            value={Number(paymentDetail?.firstBookingPrice)}
                            control={<Radio style={{ color: "#CD482A" }} />}
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: "0px 20px",
                                  alignItems: "start",
                                }}
                              >
                                <span
                                  style={{
                                    color: "#4B5563",
                                    fontSize: matches ? "20px" : "16px",
                                    fontWeight: "600",
                                  }}
                                >
                                  &#8377;
                                  {Number(paymentDetail?.firstBookingPrice || 0).toFixed(1)}
                                </span>
                                <span
                                  style={{
                                    fontSize: matches ? "16px" : "12px",
                                    color: "#9CA3AF",
                                    fontWeight: "400",
                                    textAlign: "left",
                                  }}
                                >
                                  Book by paying partial amount <br /> Amount
                                  payable later &#8377;
                                  {(Total - Number(paymentDetail?.firstBookingPrice || 0)).toFixed(1)}
                                </span>
                              </Box>
                            }
                            disabled={particalShow === true} // Disable if particalShow is true
                          />
                        </>
                      ) : null}

                      <FormControlLabel
                        sx={{
                          color: "#CD482A",
                          display: "flex",
                          alignItems: "start",
                        }}
                        name="fullPayment"
                        value={Total}
                        control={
                          <Radio
                            style={{ color: "#CD482A" }}
                          // Disable the Radio if condition is met
                          />
                        }
                        label={
                          <Box sx={{ display: "flex", gap: "0px 20px", mt: 1 }}>
                            <span
                              style={{
                                color: "#4B5563",
                                fontSize: matches ? "20px" : "16px",
                                fontWeight: "600",
                              }}
                            >
                              &#8377;{Total.toFixed(1)}
                            </span>
                            <span
                              style={{
                                fontSize: matches ? "16px" : "12px",
                                color: "#9CA3AF",
                                fontWeight: "400",
                              }}
                            >
                              Book by paying full amount{" "}
                            </span>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>

                  <Box
                    sx={{
                      width: "100%",
                      borderRadius: "20px",
                      mt: 3,
                    }}
                  >
                    <Button
                      sx={{
                        color: "#fff",
                        p: 1,
                        width: "100%",
                        background: "#EC3F18",
                        "&:hover": {
                          background: "#EC3F18",
                        },
                      }}
                      onClick={handleOrder}
                    >
                      Proceed to Pay &#8377; {Number(selectedValue || 0).toFixed(1)}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BookingOverview;
