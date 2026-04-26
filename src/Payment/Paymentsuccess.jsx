import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import SnowshoeingOutlinedIcon from "@mui/icons-material/SnowshoeingOutlined";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { currency, ps1, ps2 } from "../Images";

const succesBooking = [
  {
    icon: <SnowshoeingOutlinedIcon sx={{ color: "#3E92CC" }} />,
    typo1: "No of Travellers",
    typo2: "1",
  },

  {
    icon: <FmdGoodOutlinedIcon sx={{ color: "#3E92CC" }} />,
    typo1: "Pick Up/Drop Off",
    typo2: "Delhi - Delhi",
  },
];
const Paymentsuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data } = location?.state || {};

  // Helper function to safely parse JSON strings
  const safeParse = (jsonString, fallback = null) => {
    try {
      if (!jsonString) return fallback;
      if (typeof jsonString === 'string') {
        return JSON.parse(jsonString);
      }
      return jsonString; // Already an object
    } catch (error) {
      console.warn("JSON parse error:", error);
      return fallback;
    }
  };

  // Safely parse data with fallbacks
  const CardData = safeParse(data?.cardData, { cardSectionData: [], cardDate: {}, gstTax: 0 });
  const PaymentDetail = safeParse(data?.paymentDetail, { title: "", location: "", price: 0 });

  console.log("total ", data);
  console.log(" cardData....", CardData);
  console.log(" paymentDetail....", PaymentDetail);

  // Redirect to home if no data
  useEffect(() => {
    if (!data) {
      console.warn("No payment data found, redirecting to home");
      navigate("/");
    }
  }, [data, navigate]);

  // Calculate total amount from cardSectionData
  const calculateTotalAmount = () => {
    if (!CardData?.cardSectionData) return 0;
    return CardData.cardSectionData.reduce((sum, item) => {
      return sum + Number(item.TitlePrice || 0) * (item.quantity || 0);
    }, 0);
  };

  const totalAmount = calculateTotalAmount();

  const itemarray = [
    {
      packeg: "Package Price",
      price: <>&#8377; {PaymentDetail?.price}</>,
    },
    {
      packeg: "Amount",
      price: <>&#8377; {totalAmount.toFixed(0)}</>,
    },
    {
      packeg: "GST",
      price: <>&#8377; {Number(CardData?.gstTax).toFixed(0)}</>,
    },
    {
      packeg: "Discount",
      price: <>&#8377; -{Number(data?.coupenDiscount).toFixed(0)}</>,
    },
    {
      packeg: "Total Amount",
      price: (
        <>
          &#8377;{" "}
          {Number(
            totalAmount + CardData?.gstTax - data?.coupenDiscount
          ).toFixed(0)}
        </>
      ),
      color: "#000",
      fontWeight: "600",
    },
    // Conditionally add the following if paymentStatus is "firstPayment"
    ...(data?.paymentStatus === "firstPayment"
      ? [
        {
          packeg: "Amount Paid",
          price: <>&#8377; {Number(data?.total).toFixed(0)}</>,
          color: "#000",
          fontWeight: "600",
        },
        {
          packeg: "Remaining Amount",
          price: (
            <>
              &#8377;{" "}
              {Number(
                totalAmount +
                CardData?.gstTax -
                data?.coupenDiscount -
                data?.total
              ).toFixed(0)}
            </>
          ),
          color: "#000",
          fontWeight: "600",
        },
      ]
      : []),
  ];

  const travelHistory = [
    {
      icon: <FmdGoodOutlinedIcon sx={{ color: "#3E92CC" }} />,
      typo1: "Location",
      typo2: PaymentDetail?.location,
    },
    {
      icon: <CalendarTodayOutlinedIcon sx={{ color: "#3E92CC" }} />,
      typo1: "Date",
      typo2: (
        <>
          {new Date(CardData?.cardDate?.batchDate).toLocaleDateString(
            undefined,
            {
              month: "short",
              day: "numeric",
            }
          )}
          -{" "}
          {new Date(
            new Date(CardData?.cardDate?.endSelectDate).getTime() +
            CardData?.cardDate?.numberOfDays * 24 * 60 * 60 * 1000
          ).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </>
      ),
    },
    {
      icon: <SnowshoeingOutlinedIcon sx={{ color: "#3E92CC" }} />,
      typo1: "Number of Travlers",
      typo2: CardData?.numberOfTravelers,
    },
  ];

  return (
    <Container>
      <Box
        sx={{
          width: "100%",

          backgroundImage: `url(${ps1})`,
          height: "400px",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          borderRadius: "17px",
          backgroundColor: "#EEF5FB",
          mt: { xs: 10, md: 0 },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "100%",
              mb: 1,
            }}
          >
            <img src={ps2} alt="" srcSet="" style={{ width: "50px" }} />
          </Box>
          <Typography
            sx={{ color: "#111827", fontSize: "28px", fontWeight: "600" }}
          >
            Booking Successful!
          </Typography>
          <Typography sx={{ color: "#6D7280", mt: 1 }}>
            An confirmation mail is sent to your registered mail
          </Typography>
          <Box>
            <Button
              onClick={() => {
                navigate("/");
              }}
              sx={{
                background: "#EC3F18",
                color: "#fff",
                width: "100px",
                borderRadius: "18px",
                mt: 3,
              }}
            >
              Done
            </Button>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography sx={{ color: "#6D7280", textAlign: "left", mt: 4, mb: 1 }}>
          Booking Details
        </Typography>
        <Box>
          <Box
            sx={{
              display: { xs: "column", sm: "flex", md: "flex" },
              p: 3,
              background: "#F9FAFB",
              borderRadius: "17px 17px 0px 0px",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                color: "#4B5563",
                fontSize: { xs: "20px", sm: "22px", md: "23px" },
                fontWeight: "500",
              }}
            >
              {PaymentDetail?.title}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "0px 30px",
                mt: { xs: 2, sm: 0, md: 0 },
                justifyContent: { xs: "center", sm: "none", md: "none" },
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "0px 10px",
                  background: "none",
                  "&:hover": { background: "none" },
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    background: "#3E92CC",
                    "&:hover": {
                      background: "#286894",
                    },
                  }}
                >
                  <FileDownloadOutlinedIcon
                    sx={{ color: "#fff", fontSize: "20px" }}
                  />
                </IconButton>
                <Typography
                  sx={{
                    color: "#0081AF",
                    textTransform: "lowercase",
                    fontSize: { xs: "14px", sm: "16px" },
                  }}
                >
                  Download
                </Typography>
              </Button>
              <Button
                sx={{
                  border: "2px solid #EC3F18",
                  borderRadius: "20px",
                  width: "100px",
                  color: "#EC3F18",
                }}
              >
                Share
              </Button>
            </Box>
          </Box>

          <Box>
            <Grid
              container
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                // gap: "50px 0px",
                width: "100%",
                borderWidth: "0px 2px 2px 2px",
                borderStyle: "solid",
                borderColor: "#E5E7EB",
                borderRadius: "0px 0px 17px 17px",
                mb: 4,
              }}
            >
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  // height: "230px",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  p: 3,
                }}
              >
                {travelHistory.map(({ icon, typo1, typo2 }, index) => {
                  return (
                    <Box key={index} sx={{ mb: 5, width: "50%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "start",
                          gap: "0px 10px",
                        }}
                      >
                        {icon}
                        <Box>
                          <Typography
                            sx={{
                              color: "#9CA3AF",
                              fontSize: "13px",
                              textAlign: "left",
                            }}
                          >
                            {typo1}
                          </Typography>
                          <Typography
                            sx={{ color: "#4B5563", mt: 1, textAlign: "left" }}
                          >
                            {typo2}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}

                <Box></Box>
              </Grid>

              <Grid item xs={12} md={5} sx={{ p: 3 }}>
                <Box sx={{ display: "flex", gap: "0px 15px", mb: 2 }}>
                  <img
                    src={currency}
                    alt=""
                    srcSet=""
                    style={{ width: "10px", objectFit: "contain" }}
                  />
                  <Typography sx={{ color: "#9CA3AF" }}>
                    Payment Details
                  </Typography>
                </Box>

                {/* Payment Breakdown */}
                <Box
                  sx={{
                    background: "#F8F8F8",
                    borderRadius: "10px",
                    mb: 2,
                    overflow: "hidden",
                  }}
                >
                  {CardData?.cardSectionData?.map((item, index) => (
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
                        ₹{Number(item?.TitlePrice || 0).toFixed(0)} x{" "}
                        {item.quantity}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#4B5563",
                          fontSize: { xs: "12px", sm: "15px", md: "17px" },
                        }}
                      >
                        ₹
                        {(
                          Number(item?.TitlePrice || 0) * item.quantity
                        ).toFixed(0)}
                      </Typography>
                    </Box>
                  ))}

                  {/* GST and Discount */}
                  <Box
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
                      GST @5%
                    </Typography>
                    <Typography
                      sx={{
                        color: "#4B5563",
                        fontSize: { xs: "12px", sm: "15px", md: "17px" },
                      }}
                    >
                      ₹{Number(CardData?.gstTax || 0).toFixed(0)}
                    </Typography>
                  </Box>

                  <Box
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
                      Discount
                    </Typography>
                    <Typography
                      sx={{
                        color: "#4B5563",
                        fontSize: { xs: "12px", sm: "15px", md: "17px" },
                      }}
                    >
                      -₹{Number(data?.coupenDiscount || 0).toFixed(0)}
                    </Typography>
                  </Box>
                  {data?.paymentStatus === "firstPayment" && (
                    <>
                      <Box
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
                          Amount paid
                        </Typography>
                        <Typography
                          sx={{
                            color: "#4B5563",
                            fontSize: { xs: "12px", sm: "15px", md: "17px" },
                          }}
                        >
                          -₹{Number(data?.total || 0).toFixed(0)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          background: "#EDEDED",
                          borderRadius: "0px 0px 10px 10px",
                          display: "flex",
                          p: 2,
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
                          Remaining Amount
                        </Typography>
                        <Typography
                          sx={{
                            color: "#4B5563",
                            fontSize: { xs: "16px", sm: "20px", md: "21px" },
                            fontWeight: 500,
                          }}
                        >
                          ₹
                          {(
                            Number(
                              totalAmount +
                              CardData?.gstTax -
                              data?.coupenDiscount
                            ) - Number(data?.total || 0)
                          ).toFixed(0)}
                        </Typography>
                      </Box>
                    </>
                  )}

                  {/* Total Trip Amount */}
                  <Box
                    sx={{
                      background: "#EDEDED",
                      borderRadius: "0px 0px 10px 10px",
                      display: "flex",
                      p: 2,
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
                      ₹{Number(totalAmount + CardData?.gstTax - data?.coupenDiscount).toFixed(0)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Paymentsuccess;
