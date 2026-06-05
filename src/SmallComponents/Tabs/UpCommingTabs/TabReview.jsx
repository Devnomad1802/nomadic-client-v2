import { Box, Typography } from "@mui/material";
import BasicRating from "../../Rating";
import { useGetAllReviewsQuery } from "../../../services";

const TabReview = () => {
  const { data } = useGetAllReviewsQuery();
  const reviews = data?.data;

  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: "center" }}>
        <Typography
          sx={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#4B5563",
            fontFamily: "Inter",
            mb: 1,
          }}
        >
          Reviews
        </Typography>
        <Typography
          sx={{
            color: "#9CA3AF",
            fontSize: "14px",
            fontFamily: "Inter",
          }}
        >
          No reviews yet. Be the first to share your experience!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: 600,
          color: "#4B5563",
          fontFamily: "Inter",
          mb: 2,
        }}
      >
        Reviews
      </Typography>
      {reviews.slice(0, 5).map((review, index) => (
        <Box
          key={review._id || index}
          sx={{
            border: "1px solid #F3F4F6",
            p: { xs: 2, sm: 3 },
            borderRadius: "16px",
            my: 2,
            "&:hover": { background: "#F9FAFB" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "#CD482A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "16px",
                  fontFamily: "Inter",
                }}
              >
                {(review.Name || review.Title || "A").charAt(0).toUpperCase()}
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: "#1F2937",
                    fontWeight: 600,
                    fontSize: "14px",
                    fontFamily: "Inter",
                  }}
                >
                  {review.Name || review.Title || "Anonymous Traveler"}
                </Typography>
                {review.Designation && (
                  <Typography
                    sx={{
                      color: "#9CA3AF",
                      fontSize: "12px",
                      fontFamily: "Inter",
                    }}
                  >
                    {review.Designation}
                  </Typography>
                )}
              </Box>
            </Box>
            <BasicRating />
          </Box>
          <Typography
            sx={{
              color: "#4B5563",
              textAlign: "left",
              fontSize: "14px",
              fontFamily: "Inter",
              lineHeight: "160%",
            }}
          >
            {review.Description || review.Review || ""}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TabReview;
