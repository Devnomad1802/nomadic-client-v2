/* eslint-disable react/prop-types */
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useGetAllReviewsQuery } from "../../services";

const initial = (name) => (name ? name.trim()[0]?.toUpperCase() : "N");

const Stars = ({ rating = 5 }) => {
  const r = Math.round(Number(rating) || 5);
  return (
    <div className="testi-stars">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= r ? <StarIcon key={i} sx={{ fontSize: 16 }} /> : <StarBorderIcon key={i} sx={{ fontSize: 16, color: "#f5a623" }} />
      )}
    </div>
  );
};

const ReviewsV3 = ({ transparent = false }) => {
  const { data } = useGetAllReviewsQuery();
  const reviews = (Array.isArray(data?.data) ? data.data : []).slice(0, 6);
  if (!reviews.length) return null;

  return (
    <section
      className="section"
      style={{
        background: transparent ? "transparent" : "var(--orange-tint)",
        paddingTop: transparent ? "clamp(36px,4vw,56px)" : undefined,
      }}
    >
      <div className="wrap">
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div className="section-label" style={{ justifyContent: "center" }}>
            <span className="section-label-bar" />From the community<span className="section-label-bar" />
          </div>
          <h2 className="section-h">Stories from Fellow Adventurers</h2>
          <p className="section-sub" style={{ margin: "10px auto 0", maxWidth: 520 }}>
            Real experiences from travellers who&apos;ve embarked on unforgettable journeys with us.
          </p>
        </div>

        <div className="testi-grid">
          {reviews.map((rev, i) => (
            <div className="testi" key={rev?._id || i}>
              <Stars rating={rev?.rating} />
              <p className="testi-text">&ldquo;{rev?.Review}&rdquo;</p>
              <div className="testi-person">
                <div className="testi-avatar">
                  {rev?.Profile_Image ? <img src={rev.Profile_Image} alt={rev?.Name} /> : initial(rev?.Name)}
                </div>
                <div>
                  <div className="testi-name">{rev?.Name}</div>
                  {rev?.Job ? <div className="testi-role">{rev.Job}</div> : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsV3;
