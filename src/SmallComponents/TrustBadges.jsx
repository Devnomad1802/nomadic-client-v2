import { Box, Container, Typography } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const badges = [
  {
    icon: <GroupsIcon sx={{ fontSize: { xs: 24, md: 28 }, color: "#CD482A" }} />,
    title: "5000+",
    subtitle: "Happy Travelers",
  },
  {
    icon: <VerifiedUserIcon sx={{ fontSize: { xs: 24, md: 28 }, color: "#CD482A" }} />,
    title: "100% Safe",
    subtitle: "Secure Payments",
  },
  {
    icon: <EventAvailableIcon sx={{ fontSize: { xs: 24, md: 28 }, color: "#CD482A" }} />,
    title: "Free",
    subtitle: "Cancellation",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: { xs: 24, md: 28 }, color: "#CD482A" }} />,
    title: "24/7",
    subtitle: "Expert Support",
  },
];

const TrustBadges = () => {
  return (
    <Box
      sx={{
        background: "#F9FAFB",
        borderTop: "1px solid #F3F4F6",
        borderBottom: "1px solid #F3F4F6",
        py: { xs: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: { xs: "wrap", sm: "nowrap" },
            gap: { xs: 2, md: 3 },
          }}
        >
          {badges.map((badge, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flex: { xs: "0 0 calc(50% - 8px)", sm: 1 },
                justifyContent: { xs: "flex-start", sm: "center" },
              }}
            >
              {badge.icon}
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "14px", md: "16px" },
                    fontWeight: 700,
                    color: "#1F2937",
                    fontFamily: "Inter",
                    lineHeight: 1.2,
                  }}
                >
                  {badge.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "11px", md: "13px" },
                    color: "#6B7280",
                    fontFamily: "Inter",
                  }}
                >
                  {badge.subtitle}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TrustBadges;
