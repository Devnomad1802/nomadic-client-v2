import { Box, Container, Typography } from "@mui/material";
import { useEffect } from "react";
import Footer from "../Component/Footer";

const PrivacyPolicy = () => {
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
                    Privacy Policy
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
                        1. Information We Collect
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
                        We collect information that you provide directly to us, including:
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
                            Personal information (name, email, phone number, address)
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
                            Payment information (processed securely through third-party providers)
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
                            Booking and travel preferences
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
                            Communication preferences and feedback
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
                        2. How We Use Your Information
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
                        We use the information we collect to process bookings, send confirmations, provide customer support, improve our services, send marketing communications (with your consent), and comply with legal obligations.
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
                        3. Information Sharing
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
                        We do not sell your personal information. We may share your information with service providers who assist us in operating our website and conducting our business, as long as they agree to keep this information confidential. We may also disclose information when required by law.
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
                        4. Data Security
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
                        We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
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
                        5. Your Rights
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
                        You have the right to access, update, or delete your personal information at any time. You may also opt-out of marketing communications. Please contact us to exercise these rights.
                    </Typography>
                </Box>
            </Container>
            <Footer />
        </Box>
    );
};

export default PrivacyPolicy;

