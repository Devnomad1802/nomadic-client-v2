import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import Footer from "../Component/Footer";

const CancellationAndRefund = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <Box>

            <Container sx={{ py: { xs: 5, sm: 10, md: 10 }, maxWidth: "900px" }}>
                <Typography
                    sx={{
                        fontFamily: "Inter",
                        fontSize: { xs: "24px", md: "32px" },
                        fontWeight: 600,
                        color: "#000",
                        mb: 3,
                        textAlign: "left",
                    }}
                >
                    Cancellation and Refund Policy
                </Typography>
                <Typography
                    sx={{
                        fontFamily: "Inter",
                        fontSize: { xs: "16px", md: "18px" },
                        fontWeight: 400,
                        color: "#6D7280",
                        lineHeight: 1.7,
                        mb: 3,
                        textAlign: "left",
                    }}
                >
                    Last updated: {new Date().toLocaleDateString()}
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: { xs: "20px", md: "24px" },
                            fontWeight: 600,
                            color: "#000",
                            mb: 2,
                            textAlign: "left",
                        }}
                    >
                        1. Cancellation by Customer
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: { xs: "16px", md: "18px" },
                            fontWeight: 400,
                            color: "#6D7280",
                            lineHeight: 1.7,
                            mb: 2,
                            textAlign: "left",
                        }}
                    >
                        Customers may cancel their booking at any time. However, cancellation charges will apply based on the time of cancellation:
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, mt: 2 }}>
                        <Typography
                            component="li"
                            sx={{
                                fontFamily: "Inter",
                                fontSize: { xs: "16px", md: "18px" },
                                fontWeight: 400,
                                color: "#6D7280",
                                lineHeight: 1.7,
                                mb: 1,
                                textAlign: "left",
                            }}
                        >
                            Cancellation 30 days or more before departure: Full refund minus processing fees
                        </Typography>
                        <Typography
                            component="li"
                            sx={{
                                fontFamily: "Inter",
                                fontSize: { xs: "16px", md: "18px" },
                                fontWeight: 400,
                                color: "#6D7280",
                                lineHeight: 1.7,
                                mb: 1,
                                textAlign: "left",
                            }}
                        >
                            Cancellation 15-29 days before departure: 50% refund
                        </Typography>
                        <Typography
                            component="li"
                            sx={{
                                fontFamily: "Inter",
                                fontSize: { xs: "16px", md: "18px" },
                                fontWeight: 400,
                                color: "#6D7280",
                                lineHeight: 1.7,
                                mb: 1,
                                textAlign: "left",
                            }}
                        >
                            Cancellation less than 15 days before departure: No refund
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: { xs: "20px", md: "24px" },
                            fontWeight: 600,
                            color: "#000",
                            mb: 2,
                            textAlign: "left",
                        }}
                    >
                        2. Cancellation by Company
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: { xs: "16px", md: "18px" },
                            fontWeight: 400,
                            color: "#6D7280",
                            lineHeight: 1.7,
                            textAlign: "left",
                        }}
                    >
                        If we cancel a trip due to unforeseen circumstances, natural disasters, or insufficient bookings, customers will receive a full refund or the option to transfer to another trip of equal value.
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: { xs: "20px", md: "24px" },
                            fontWeight: 600,
                            color: "#000",
                            mb: 2,
                            textAlign: "left",
                        }}
                    >
                        3. Refund Process
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: { xs: "16px", md: "18px" },
                            fontWeight: 400,
                            color: "#6D7280",
                            lineHeight: 1.7,
                            textAlign: "left",
                        }}
                    >
                        Refunds will be processed within 7-14 business days to the original payment method. Processing fees may apply. Please contact our customer service team for any refund inquiries.
                    </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: { xs: "20px", md: "24px" },
                            fontWeight: 600,
                            color: "#000",
                            mb: 2,
                            textAlign: "left",
                        }}
                    >
                        4. No-Show Policy
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "Inter",
                            fontSize: { xs: "16px", md: "18px" },
                            fontWeight: 400,
                            color: "#6D7280",
                            lineHeight: 1.7,
                            textAlign: "left",
                        }}
                    >
                        If a customer fails to show up for the trip without prior cancellation, no refund will be provided.
                    </Typography>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
};

export default CancellationAndRefund;

