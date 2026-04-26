import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import GroupsIcon from "@mui/icons-material/Groups";
import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { paymentDetail } = location.state || {};

  // Parse JSON data
  const selectDate = JSON.parse(paymentDetail?.selectDate || "[]");
  const endSelectDate = JSON.parse(paymentDetail?.endSelectDate || "[]");
  const numberOfDays = JSON.parse(paymentDetail?.numberOfDays || "[]");
  const numberOfSeats = JSON.parse(paymentDetail?.numberOfSeats || "[]");
  const discount = JSON.parse(paymentDetail?.discount || "[]");
  console.log("disocunt", discount)
  const AddSection = useMemo(
    () => JSON.parse(paymentDetail?.addsection || "[]"),
    [paymentDetail?.addsection]
  );

  // State management
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [couponCode, setCouponCode] = useState("");
  const [coupenDiscount, setCoupenDiscount] = useState(0);

  // State for all selections (quantities only)
  const [selections, setSelections] = useState({
    // For all sections (quantity-based)
    quantities: {},
  });

  // Generate batch data
  const generateBatchData = () => {
    const batches = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    selectDate.forEach((dateObj, index) => {
      const startDate = new Date(dateObj.BatchDate);
      const endDate = new Date(endSelectDate[index]?.EndBatchDate);
      // Skip past or invalid batches
      if (Number.isNaN(startDate.getTime()) || startDate < today) return;

      const monthName = startDate.toLocaleDateString("en-US", {
        month: "short",
      });

      batches.push({
        id: index,
        startDate: startDate,
        endDate: endDate,
        month: monthName,
        seatsLeft: numberOfSeats[index]?.batchSeats || 0,
        totalSeats: numberOfSeats[index]?.batchSeats || 0,
        days: numberOfDays[index]?.selectDays || 0,
      });
    });
    return batches;
  };

  const batchData = generateBatchData();

  // Get available months from batch data
  const getAvailableMonths = () => {
    const monthSet = new Set();
    batchData.forEach((batch) => {
      monthSet.add(batch.month);
    });
    return ["All", ...Array.from(monthSet).sort()];
  };

  const availableMonths = getAvailableMonths();

  // Calculate totals
  const calculateTotals = () => {
    let totalAmount = 0;
    let totalTravelers = 0;

    // Calculate from first section (quantities) - CATEGORY
    if (AddSection && AddSection.length > 0 && AddSection[0].array) {
      AddSection[0].array.forEach((item, itemIndex) => {
        const optionId = `0-${itemIndex}`;
        const quantity = selections.quantities[optionId] || 0;
        const price = parseInt(item.TitlePrice) || 0;
        totalAmount += quantity * price;
        totalTravelers += quantity; // Only count travelers from first section
      });
    }

    // Calculate from other sections (quantities with multiplication) - ROOMS, etc.
    if (AddSection && AddSection.length > 1) {
      for (
        let sectionIndex = 1;
        sectionIndex < AddSection.length;
        sectionIndex++
      ) {
        if (AddSection[sectionIndex].array) {
          AddSection[sectionIndex].array.forEach((item, itemIndex) => {
            const optionId = `${sectionIndex}-${itemIndex}`;
            const quantity = selections.quantities[optionId] || 0;
            const price = parseInt(item.TitlePrice) || 0;
            totalAmount += quantity * price; // Multiply price by quantity
            // Don't add to totalTravelers - only first section counts travelers
          });
        }
      }
    }

    return { totalAmount, totalTravelers };
  };

  const { totalAmount, totalTravelers } = calculateTotals();
  const gstAmount = (totalAmount - coupenDiscount) * 0.05;
  const finalAmount = totalAmount - coupenDiscount + gstAmount;
  const filteredBatches =
    selectedMonth === "All"
      ? batchData
      : batchData.filter((batch) => batch.month === selectedMonth);

  // Handlers
  const handleQuantityChange = (optionId, change, itemTitle = "") => {
    setSelections((prev) => {
      const currentQty = prev.quantities[optionId] || 0;
      const sectionIndex = parseInt(optionId.split('-')[0]);

      let newQty;

      // Check if item is a "Group" item (case insensitive)
      const isGroupItem = itemTitle.toLowerCase().includes("group");

      // Special logic for Group items in first section (CATEGORY)
      if (sectionIndex === 0 && isGroupItem) {
        if (change > 0) {
          // Increment: first click adds 5, then adds 1
          if (currentQty === 0) {
            newQty = 5;
          } else {
            newQty = currentQty + 1;
          }
        } else {
          // Decrement: if at 5 or less, go to 0; otherwise subtract 1
          if (currentQty <= 5) {
            newQty = 0;
          } else {
            newQty = currentQty - 1;
          }
        }
      } else {
        // Normal increment/decrement for Solo and other sections
        newQty = Math.max(0, currentQty + change);
      }

      return {
        ...prev,
        quantities: {
          ...prev.quantities,
          [optionId]: newQty,
        },
      };
    });
  };

  const applyCoupon = (code) => {
    const normalizedCode = code?.trim();
    if (!normalizedCode) {
      setCoupenDiscount(0);
      return;
    }

    const isValid = discount.some(
      (item) => item?.toLowerCase?.() === normalizedCode.toLowerCase()
    );

    if (isValid) {
      const discountAmount = totalAmount * 0.1;
      setCoupenDiscount(discountAmount);
    } else {
      setCoupenDiscount(0);
    }
  };

  const handleCouponApply = () => applyCoupon(couponCode);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", lg: "row" },
          }}
        >
          {/* Left Column */}
          <Box
            sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Select Batch Date Section */}
            <Box
              sx={{
                background: "white",
                borderRadius: "16px",
                p: 3,
                // boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "1px solid #E5E7EB",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}
              >
                <CalendarTodayIcon
                  sx={{ color: "#FF6B35", fontSize: "20px" }}
                />
                <Typography
                  sx={{ color: "#333", fontSize: "18px", fontWeight: "600" }}
                >
                  Select Batch Date
                </Typography>
              </Box>


              {/* Month Navigation */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 3,
                  overflowX: "auto",
                  "&::-webkit-scrollbar": { display: "none" },
                  scrollbarWidth: "none",
                }}
              >
                <IconButton
                  sx={{
                    minWidth: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "#F5F5F5",
                    color: "#666",
                    "&:hover": { backgroundColor: "#E0E0E0" },
                  }}
                >
                  <ArrowBackIosIcon sx={{ fontSize: "16px" }} />
                </IconButton>
                {availableMonths.map((month) => (
                  <Chip
                    key={month}
                    label={month}
                    onClick={() => setSelectedMonth(month)}
                    sx={{
                      backgroundColor:
                        selectedMonth === month ? "#C4472C" : "#F5F5F5",
                      color: selectedMonth === month ? "white" : "#666",
                      border: "none",
                      borderRadius: "20px",
                      minWidth: "50px",
                      height: "32px",
                      fontSize: "14px",
                      fontWeight: "500",
                      px: 2,
                      "&:hover": {
                        backgroundColor:
                          selectedMonth === month ? "#E55A2B" : "#E0E0E0",
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Batch List */}
              <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                {filteredBatches.length > 0 ? (
                  <RadioGroup
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(parseInt(e.target.value))}
                  >
                    {filteredBatches.map((batch) => (
                      <Box
                        key={batch.id}
                        sx={{
                          width: "100%",
                          border:
                            selectedBatch === batch.id
                              ? "1px solid #FF6B35"
                              : "1px solid #E5E7EB",
                          borderRadius: "16px",
                          py: 0.5,
                          px: 2,
                          mb: 1,
                          backgroundColor:
                            selectedBatch === batch.id ? "#FEF7F7" : "white",
                          "&:hover": {
                            backgroundColor:
                              selectedBatch === batch.id
                                ? "#FEF7F7"
                                : "#F9FAFB",
                          },
                          transition: "all 0.2s ease-in-out",
                          cursor: "pointer",
                          display: "flex",
                        }}
                        onClick={() => setSelectedBatch(batch.id)}
                      >
                        <FormControlLabel
                          value={batch.id}
                          control={
                            <Radio
                              checked={selectedBatch === batch.id}
                              sx={{
                                color: "#E5E7EB",
                                "&.Mui-checked": {
                                  color: "#1976d2",
                                },
                              }}
                            />
                          }
                          label={
                            <Typography
                              sx={{
                                fontSize: "16px",
                                fontWeight: "500",
                                color: "#333",
                                flex: 1,
                              }}
                            >
                              {formatDate(batch.startDate)} -{" "}
                              {formatDate(batch.endDate)},{" "}
                              {batch.startDate.getFullYear()}
                            </Typography>
                          }
                          sx={{ width: "100%", margin: 0 }}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#DC2626",
                              fontWeight: "600",
                              fontSize: "14px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {batch.seatsLeft} Seats Left / {batch.totalSeats}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </RadioGroup>
                ) : (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography sx={{ color: "#9CA3AF", fontSize: "16px" }}>
                      No batches available for{" "}
                      {selectedMonth === "All" ? "any month" : selectedMonth}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* FIRST SECTION - CATEGORY with Quantity Controls */}
            {AddSection && AddSection.length > 0 && AddSection[0] && (
              <Box
                sx={{
                  background: "white",
                  borderRadius: "20px",
                  p: 3,
                  mb: 3,
                  border: "1px solid #E0E0E0",
                }}
              >
                <Typography
                  sx={{
                    color: "#333333",
                    fontSize: "18px",
                    fontWeight: "600",
                    mb: 3,
                  }}
                >
                  {AddSection[0].sectionTitle || "CATEGORY"}
                </Typography>

                {/* Headers for First Section */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#9CA3AF",
                      fontSize: "14px",
                      fontWeight: "600",
                      flex: 1,
                      textAlign: "left",
                    }}
                  >
                    Type
                  </Typography>
                  <Typography
                    sx={{
                      color: "#9CA3AF",
                      fontSize: "14px",
                      fontWeight: "600",
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    Price Per Person
                  </Typography>
                  <Typography
                    sx={{
                      color: "#9CA3AF",
                      fontSize: "14px",
                      fontWeight: "600",
                      flex: 1,
                      textAlign: "center",


                    }}
                  >
                    Qty
                  </Typography>
                </Box>

                {/* First Section Items with Quantity Controls */}
                {AddSection[0].array && AddSection[0].array.length > 0 ? (
                  AddSection[0].array.map((item, itemIndex) => {
                    const optionId = `0-${itemIndex}`;
                    const quantity = selections.quantities[optionId] || 0;

                    return (
                      <Box
                        key={itemIndex}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          backgroundColor: "#FBFBFB",
                          borderRadius: "8px",
                          mb: 1,
                          "&:hover": { backgroundColor: "#F3F4F6" },
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#4B5563",
                            fontWeight: "600",
                            flex: 1,
                            textAlign: "left",
                          }}
                        >
                          {item.Title}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#4B5563",
                            fontWeight: "500",
                            flex: 1,
                            textAlign: "left",
                          }}
                        >
                          ₹{parseInt(item.TitlePrice || 0).toLocaleString()}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #E5E7EB",
                            borderRadius: "20px",
                            p: 0.5,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(optionId, -1, item.Title)}
                            disabled={quantity === 0}
                          >
                            <RemoveIcon
                              sx={{ fontSize: "16px", color: "#9CA3AF" }}
                            />
                          </IconButton>
                          <Typography
                            sx={{
                              mx: 2,
                              minWidth: "20px",
                              textAlign: "center",
                              color: "#4B5563",
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >
                            {quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(optionId, 1, item.Title)}
                          >
                            <AddIcon
                              sx={{ fontSize: "16px", color: "#FF6B35" }}
                            />
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Box sx={{ textAlign: "center", py: 2 }}>
                    <Typography sx={{ color: "#9CA3AF", fontSize: "14px" }}>
                      No items available in this section
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {/* OTHER SECTIONS - Rooms, etc. with Toggle Controls */}
            {AddSection && AddSection.length > 1 && (
              AddSection.slice(1).map((section, sectionIndex) => {
                const actualSectionIndex = sectionIndex + 1; // +1 because we sliced from index 1

                return (
                  <Box
                    key={actualSectionIndex}
                    sx={{
                      background: "white",
                      borderRadius: "20px",
                      p: 3,
                      mb: 3,
                      border: "1px solid #E0E0E0",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#333333",
                        fontSize: "18px",
                        fontWeight: "600",
                        mb: 3,
                      }}
                    >
                      {section.sectionTitle || `Section ${actualSectionIndex + 1}`}
                    </Typography>

                    {/* Headers for Other Sections */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#9CA3AF",
                          fontSize: "14px",
                          fontWeight: "600",
                          flex: 1,
                          textAlign: "left",
                        }}
                      >
                        Type
                      </Typography>
                      <Typography
                        sx={{
                          color: "#9CA3AF",
                          fontSize: "14px",
                          fontWeight: "600",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        Price
                      </Typography>
                      <Typography
                        sx={{
                          color: "#9CA3AF",
                          fontSize: "14px",
                          fontWeight: "600",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        Qty
                      </Typography>
                    </Box>

                    {/* Other Sections Items with +/- Controls */}
                    {section.array && section.array.length > 0 ? (
                      section.array.map((item, itemIndex) => {
                        const optionId = `${actualSectionIndex}-${itemIndex}`;
                        const quantity = selections.quantities[optionId] || 0;

                        return (
                          <Box
                            key={itemIndex}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              p: 1,
                              backgroundColor: "#FBFBFB",
                              borderRadius: "8px",
                              mb: 1,
                              "&:hover": { backgroundColor: "#F3F4F6" },
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#4B5563",
                                fontWeight: "600",
                                flex: 1,
                              }}
                            >
                              {item.Title}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#4B5563",
                                fontWeight: "500",
                                flex: 1,
                                textAlign: "left",
                              }}
                            >
                              ₹{parseInt(item.TitlePrice || 0).toLocaleString()}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #E5E7EB",
                                borderRadius: "20px",
                                p: 0.5,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(optionId, -1)}
                                disabled={quantity === 0}
                              >
                                <RemoveIcon
                                  sx={{ fontSize: "16px", color: "#9CA3AF" }}
                                />
                              </IconButton>
                              <Typography
                                sx={{
                                  mx: 2,
                                  minWidth: "20px",
                                  textAlign: "center",
                                  color: "#4B5563",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                }}
                              >
                                {quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() => handleQuantityChange(optionId, 1)}
                              >
                                <AddIcon
                                  sx={{ fontSize: "16px", color: "#FF6B35" }}
                                />
                              </IconButton>
                            </Box>
                          </Box>
                        );
                      })
                    ) : (
                      <Box sx={{ textAlign: "center", py: 2 }}>
                        <Typography sx={{ color: "#9CA3AF", fontSize: "14px" }}>
                          No items available in this section
                        </Typography>
                      </Box>
                    )}
                  </Box>
                );
              })
            )}

            {/* Fallback when no sections */}
            {(!AddSection || AddSection.length === 0) && (
              <Box
                sx={{
                  background: "white",
                  borderRadius: "20px",
                  p: 3,
                }}
              >
                <Typography
                  sx={{
                    color: "#3E92CC",
                    fontSize: "18px",
                    fontWeight: "600",
                    mb: 3,
                  }}
                >
                  Transport Options
                </Typography>
                <Box sx={{ textAlign: "center", py: 2 }}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: "14px" }}>
                    No transport options available
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Right Column - Amount to Pay */}
          <Box
            sx={{
              background: "white",
              borderRadius: "16px",
              p: 3,
              width: { xs: "100%", lg: "360px" },
              height: "fit-content",
              position: "sticky",
              top: 20,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Typography
              sx={{
                color: "#333",
                fontSize: "20px",
                fontFamily: "Inter",
                fontWeight: "700",
                textAlign: "left",
                mb: 3,
              }}
            >
              Amount to Pay
            </Typography>

            {/* Selected Date and Travelers */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarTodayIcon sx={{ color: "#666", fontSize: "18px" }} />
                  <Typography sx={{ color: "#666", fontSize: "14px" }}>
                    Selected Date
                  </Typography>
                </Box>
                <Typography sx={{ color: "#444", fontSize: "14px", fontWeight: "500" }}>
                  {selectedBatch !== null
                    ? `${formatDate(
                      batchData[selectedBatch]?.startDate
                    )} - ${formatDate(batchData[selectedBatch]?.endDate)}`
                    : "Not selected"}
                </Typography>
              </Box>
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <GroupsIcon sx={{ color: "#666", fontSize: "18px" }} />
                  <Typography sx={{ color: "#666", fontSize: "14px" }}>
                    No of Travellers
                  </Typography>
                </Box>
                <Typography sx={{ color: "#444", fontSize: "14px", fontWeight: "500" }}>
                  {totalTravelers}
                </Typography>
              </Box>
            </Box>

            {/* Coupon Code */}
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ color: "#666", fontSize: "14px", fontWeight: "500", mb: 1, textAlign: 'left' }}>
                Apply Coupon Code
              </Typography>
              <TextField
                size="small"
                fullWidth
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => {
                  const code = e.target.value;
                  setCouponCode(code);
                  applyCoupon(code);
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleCouponApply}>
                        <SearchIcon sx={{ color: "#666" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    "& .MuiInputBase-input": {
                      color: "#000",
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    border: "1px solid #DDD",
                    "&:hover": {
                      border: "1px solid #BBB",
                    },
                    "&.Mui-focused": {
                      border: "1px solid #666",
                    },
                  },
                }}
              />
            </Box>

            {/* Price Breakdown */}
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography sx={{ color: "#333", fontSize: "14px" }}>
                  Amount
                </Typography>
                <Typography
                  sx={{ color: "#333", fontWeight: "400", fontSize: "14px" }}
                >
                  ₹{totalAmount.toLocaleString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography sx={{ color: "#333", fontSize: "14px" }}>
                  Discount
                </Typography>
                <Typography
                  sx={{ color: "#4CAF50", fontWeight: "400", fontSize: "14px" }}
                >
                  -₹{coupenDiscount.toLocaleString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <Typography sx={{ color: "#333", fontSize: "14px" }}>
                  GST
                </Typography>
                <Typography
                  sx={{ color: "#333", fontWeight: "400", fontSize: "14px" }}
                >
                  ₹{gstAmount.toFixed(0)}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                  pb: 1,
                  borderBottom: "1px solid #EEE",
                }}
              >
                <Typography sx={{ color: "#333", fontSize: "14px" }}>
                  Amount to Pay
                </Typography>
                <Typography
                  sx={{ color: "#333", fontWeight: "400", fontSize: "14px" }}
                >
                  ₹{finalAmount.toLocaleString()}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: "28px",
                  fontWeight: "700",
                  textAlign: "center",
                  color: "#333",
                  mt: 2,
                }}
              >
                ₹{finalAmount.toLocaleString()}
              </Typography>
            </Box>

            {/* Proceed Button */}
            <Button
              fullWidth
              variant="contained"
              disabled={totalTravelers === 0 || selectedBatch === null}
              onClick={() => {
                if (selectedBatch === null) {
                  alert("Please select a batch date to continue");
                  return;
                }
                if (totalTravelers === 0) {
                  alert("Please select at least one transport option");
                  return;
                }
                navigate("/booking_overview", {
                  state: {
                    paymentDetail,
                    selectedBatch: batchData[selectedBatch],
                    selections,
                    totalAmount: finalAmount,
                    coupenDiscount,
                  },
                });
              }}
              sx={{
                backgroundColor:
                  totalTravelers === 0 || selectedBatch === null
                    ? "#D3D3D3"
                    : "#CD482A",
                color: "white",
                borderRadius: "8px",
                py: 1.75,
                fontSize: "16px",
                fontWeight: "600",
                textTransform: "none",
                mb: 1,
                "&:hover": {
                  backgroundColor:
                    totalTravelers === 0 || selectedBatch === null
                      ? "#D3D3D3"
                      : "#B53D1F",
                },
              }}
            >
              Proceed to Payment
            </Button>
            <Typography
              sx={{
                color: "#888",
                fontSize: "12px",
                textAlign: "center",
                fontStyle: "italic",
              }}
            >
              *You&apos;ll be redirected to the secure payment gateway
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Payment;
