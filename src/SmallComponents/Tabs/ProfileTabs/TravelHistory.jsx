import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import SnowshoeingOutlinedIcon from "@mui/icons-material/SnowshoeingOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Grid, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useGetPartialTripMutation,
  useOrderMutation
} from "../../../services";
import { useUpdateBookingMutation } from "../../../services/BookingApi";

const TravelHistory = () => {
  const { userDbData } = useSelector((store) => store.global);
  const [getPartialTrip] = useGetPartialTripMutation();
  const [partilyArray, setPartialyArray] = useState([]);
  console.log("partilyArray", partilyArray);

  const getPartialTrips = useCallback(async () => {
    try {
      const data = await getPartialTrip({ userId: userDbData?._id });
      if (data?.data?.data) {
        // Map through the array and parse `paymentDetail` and `cardData` fields
        const updatedData = data.data.data.map((item) => {
          // Create a shallow copy of the item to ensure immutability
          const updatedItem = { ...item };

          // Safely parse paymentDetail if it's a string
          if (typeof updatedItem.paymentDetail === "string") {
            try {
              // Create a new object for paymentDetail so we avoid modifying the original one directly
              updatedItem.paymentDetail = JSON.parse(updatedItem.paymentDetail);
            } catch (e) {
              console.error(
                "Error parsing paymentDetail for booking ID:",
                updatedItem.bookingId,
                e
              );
            }
          }

          // Safely parse cardData if it's a string
          if (typeof updatedItem.cardData === "string") {
            try {
              // Create a new object for cardData so we avoid modifying the original one directly
              updatedItem.cardData = JSON.parse(updatedItem.cardData);
            } catch (e) {
              console.error(
                "Error parsing cardData for booking ID:",
                updatedItem.bookingId,
                e
              );
            }
          }

          return updatedItem; // Return the updated item
        });

        // Set the updated array to state
        setPartialyArray(updatedData);
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [getPartialTrip, userDbData]);

  useEffect(() => {
    getPartialTrips();
  }, [getPartialTrips]);

  // ---------------------------- Handle Partical Paymnet ----------------------

  const currency = "INR";
  const reciptId = "123IndNomadic444";
  const navigate = useNavigate();

  const [paymentStatus] = useState("fullPayment");
  const [order] = useOrderMutation();
  const [updateBooking] = useUpdateBookingMutation();
  const handleOrder = async (selectedValue, item) => {
    console.log("item in traverl history", item);
    
    if (!userDbData) {
      console.log("User not logged in");
      alert("Please login to continue with the payment");
      return;
    }
    
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

            const { data, message } = await updateBooking({
              _id: item?._id,
              bookingId: bookingid,
              paymentStatus,
              total: selectedValue + item?.total,
            }).unwrap();

            console.log("Payment successful:", message);
            navigate("/paymentsuccess", {
              state: {
                data,
              },
            });
          } catch (error) {
            console.error("Error updating booking:", error);
            alert("Payment was successful but there was an error updating your booking. Please contact support.");
            navigate("/paymentfail");
          }
          },
        };

        // Initialize Razorpay with the options
      const rzp1 = new window.Razorpay(options);

        // Handle payment failure
        rzp1.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description || "Unknown error"}`);
        navigate("/paymentfail");
        });

        // Open the Razorpay payment dialog
        rzp1.open();
      } catch (error) {
        // Handle errors
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again.");
      navigate("/paymentfail");
    }
  };

  return (
    <Box sx={{}}>
      <Typography
        sx={{
          fontSize: { xs: "20px", md: "28px" },
          color: "#000",
          textAlign: "left",
        }}
      >
        Travel History
      </Typography>

      {partilyArray.slice().reverse().map((item, index) => {
        // Extract properties from each item
        const {
          paymentDetail,
          cardData,
          coupenDiscount,
          total,
          paymentStatus,
          DateOfBooking,
        } = item;

        // Define the status for Payment Status (you can use any logic based on your needs)
        const paymentStatusLabel =
          paymentStatus === "firstPayment" ? "Partial" : "Completed";

        const travelHistory = [
          {
            icon: <FmdGoodOutlinedIcon sx={{ color: "#3E92CC" }} />,
            typo1: "Location",
            typo2: paymentDetail?.location,
          },
          {
            icon: <SnowshoeingOutlinedIcon sx={{ color: "#3E92CC" }} />,
            typo1: "No of Travellers",
            typo2: cardData?.numberOfTravelers,
          },
          {
            icon: <CalendarTodayOutlinedIcon sx={{ color: "#3E92CC" }} />,
            typo1: "Date",
            typo2: (
              <>
                {cardData?.cardDate?.batchDate ? (
                  <>
                    {new Date(cardData?.cardDate?.batchDate).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}
                    {" - "}
                    {new Date(
                      new Date(cardData?.cardDate?.endSelectDate).getTime() +
                        cardData?.cardDate?.numberOfDays * 24 * 60 * 60 * 1000
                    ).toLocaleDateString(undefined, {
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
            icon: <FmdGoodOutlinedIcon sx={{ color: "#3E92CC" }} />,
            typo1: "Pick Up/Drop Off",
            typo2: (
              <>
                {paymentDetail?.pickUp} - {paymentDetail?.dropOff}
              </>
            ),
          },
        ];

        const itemTotal = cardData?.cardSectionData
          ?.flat()
          .reduce((sum, item) => {
            return sum + Number(item?.TitlePrice) * Number(item.quantity); // Adding item prices
          }, 0);

        console.log("itemTotal", itemTotal);
        const gstAndDiscountTotal = Number(cardData?.gstTax); // Add GST tax and discount

        const finalTotal =
          itemTotal + gstAndDiscountTotal - coupenDiscount - total; // Add everything together
        console.log("finalTotal", finalTotal.toFixed(0));

        const array = [
          { value: total, title: "Amount Paid", color: "#4B5563" },
          {
            value: finalTotal.toFixed(0),
            title: "Remain amount to pay",
            color: "#FF0E07",
          },
        ];
        const array2 = [
          {
            name: "Amount Paid",
            price: "",
            total: <> {`${(Number(total) * -1).toFixed(0)}`}</>,
          },
          {
            name: "GST @5%",
            price: "",
            total: Number(cardData?.gstTax).toFixed(0),
          },
          {
            name: "Discount",
            price: "",
            total: <>{`-${(Number(coupenDiscount) * -1).toFixed(0)}`}</>,
          },
          {
            name: "Total",
            price: "",
            total: <>{Number(finalTotal).toFixed(0)}</>,
          },
        ];
        return (
          <Accordion 
            key={index}
            sx={{ 
              mt: 3,
              borderRadius: "10px !important",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid #E5E7EB",
              "&:before": {
                display: "none",
              },
              "&.Mui-expanded": {
                margin: "24px 0",
              }
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#4B5563" }} />}
              sx={{
                background: "#FBFBFB",
                borderRadius: "10px 10px 0 0",
                padding: { xs: "12px 16px", sm: "14px 18px", md: "16px 20px" },
                "&.Mui-expanded": {
                  borderRadius: "10px 10px 0 0",
                  minHeight: "auto",
                },
                "& .MuiAccordionSummary-content": {
                  margin: "0",
                  "&.Mui-expanded": {
                    margin: "0",
                  }
                }
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  pr: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#4B5563",
                      fontSize: { xs: "18px", md: "20px" },
                      fontWeight: 500,
                      textAlign: "left",
                    }}
                  >
                    Explore Bhutan&apos;s Magic !
                  </Typography>
                  <Typography
                    sx={{
                      color: "#9CA3AF",
                      fontSize: "13px",
                      textAlign: "left",
                      mt: 0.5,
                    }}
                  >
                    {`Booked on ${new Date(
                      DateOfBooking
                    ).toLocaleDateString()} at ${new Date(
                      DateOfBooking
                    ).toLocaleTimeString()}`}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    variant="simplebtn"
                    sx={{ background: "#CD482A", color: "#fff" }}
                  >
                    {paymentStatusLabel}
                  </Button>
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails
              sx={{
                background: "#fff",
                borderRadius: "0 0 10px 10px",
                padding: { xs: "12px 16px", sm: "14px 18px", md: "16px 20px" },
              }}
            >
              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  gap: "30px 0px",
                  mt: 3,
                }}
              >
                {travelHistory.map(({ icon, typo1, typo2 }, index) => {
                  return (
                    <Grid key={index} item xs={12} sm={5.5} md={3.7}>
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "0px 10px",
                          }}
                        >
                          {icon}
                          <Typography
                            sx={{ color: "#9CA3AF", fontSize: "13px" }}
                          >
                            {typo1}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{ color: "#4B5563", mt: 1, textAlign: "left" }}
                        >
                          {typo2}
                        </Typography>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
              <Box
                sx={{
                  background: "#E5E7EB",
                  height: "1px",
                  width: "100%",
                  my: 4,
                }}
              />
              <Box>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: { xs: "0px 30px", md: "0px 60px" },
                    }}
                  >
                    <Box>
                      <Typography sx={{ color: "#9CA3AF", fontSize: "13px" }}>
                        Amount Paid
                      </Typography>
                      <Typography
                        sx={{ color: "#4B5563", mt: 1, textAlign: "left" }}
                      >
                        &#8377; {Number(total).toFixed(0)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: "#9CA3AF", fontSize: "13px" }}>
                        Payment Status
                      </Typography>
                      <Typography
                        sx={{ color: "#FBC800", mt: 1, textAlign: "left" }}
                      >
                        Partial
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      color: "#000",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px 0px",
                      p: 3,
                      background: "#F9FAFB",
                      borderRadius: "10px",
                      border: "1px solid #F3F4F6",
                      my: 3,
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
                            p: 1,
                            borderBottom: "1px solid #EDEDED",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#6D7280",
                              fontSize: { xs: "13px", sm: "14px" },
                              textAlign: "start",
                            }}
                          >
                            {item?.Title}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#6D7280",
                              fontSize: { xs: "13px", sm: "14px" },
                              // textAlign: "cent",
                            }}
                          >
                            &#8377; {item?.TitlePrice} x {item.quantity}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#6D7280",
                              fontSize: { xs: "13px", sm: "14px" },
                              textAlign: "right",
                            }}
                          >
                            &#8377;{item?.TitlePrice * item.quantity}
                          </Typography>
                        </Box>
                      );
                    })}
                    {array2.map((item, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            p: 1,
                            borderBottom: "1px solid #EDEDED",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#6D7280",

                              fontSize: { xs: "13px", sm: "14px" },
                              textAlign: "start",
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#6D7280",

                              fontSize: { xs: "13px", sm: "14px" },
                            }}
                          >
                            {item.price}
                          </Typography>
                          <Typography
                            sx={{
                              color: "#6D7280",

                              fontSize: { xs: "13px", sm: "14px" },
                            }}
                          >
                            &#8377; {item.total}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  <Box sx={{ 
                    display: "flex", 
                    gap: "40px",
                    flexWrap: "wrap",
                    justifyContent: { xs: "center", md: "flex-start" }
                  }}>
                    {array.map((item, index) => {
                      return (
                        <Box key={index} sx={{ 
                          display: "flex",
                          flexDirection: "column",
                          alignItems: { xs: "center", md: "flex-start" }
                        }}>
                          <Typography
                            sx={{ 
                              color: "#9CA3AF", 
                              fontSize: "14px",
                              fontWeight: 500,
                              mb: 1
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            sx={{
                              color: item.color,
                              fontSize: "24px",
                              fontWeight: 600,
                              textAlign: { xs: "center", md: "start" },
                            }}
                          >
                            &#8377; {item.value}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px 0px",
                      mt: 2,
                    }}
                  >
                    <Typography sx={{ color: "#6D7280", textAlign: "start" }}>
                      Note: Balance amount of $10,000/- can be paid upto Wed, 8
                      May, 2024
                    </Typography>
                    <Typography sx={{ color: "#9CA3AF", textAlign: "start" }}>
                      Payment Processing fee of 3% will be charged in next step.
                    </Typography>
                    <Button
                      onClick={() => handleOrder(finalTotal, item)}
                      sx={{
                        color: "#fff",
                        background: "#EC3F18",
                        borderRadius: "25px",
                        px: 4,
                        py: 1.5,
                        fontSize: "16px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                        boxShadow: "0px 4px 12px rgba(236, 63, 24, 0.3)",
                        "&:hover": {
                          background: "#D6360E",
                          boxShadow: "0px 6px 16px rgba(236, 63, 24, 0.4)",
                        },
                      }}
                    >
                      Proceed to pay &#8377; {finalTotal.toFixed(0)}
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  background: "#E5E7EB",
                  height: "1px",
                  width: "100%",
                  my: 5,
                }}
              />
              <Typography 
                sx={{ 
                  color: "#058DF8", 
                  mt: 3, 
                  textAlign: "left",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer",
                  "&:hover": {
                    color: "#0471D6",
                    textDecoration: "underline"
                  }
                }}
              >
                Cancellation Policy
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};

export default TravelHistory;
