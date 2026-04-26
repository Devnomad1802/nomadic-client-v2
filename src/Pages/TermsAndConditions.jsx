import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import Footer from "../Component/Footer";

const TermsAndConditions = () => {
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
                    Terms and Conditions
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
                        1. Acceptance of Terms
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
                        By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
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
                        2. Use License
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
                        Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
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
                            Modify or copy the materials
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
                            Use the materials for any commercial purpose or for any public display
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
                            Attempt to decompile or reverse engineer any software contained on the website
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
                        3. Booking and Payment
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
                        All bookings are subject to availability and confirmation. Payment must be made in full or as per the payment schedule agreed upon. We reserve the right to cancel any booking if payment is not received as agreed.
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
                        4. Limitation of Liability
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
                        In no event shall our company or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
                    </Typography>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
};

export default TermsAndConditions;

