/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useGetAllCategoriesQuery } from "../../services/categoriesApis";
import { CategoryCardSkeleton } from "../../SmallComponents/Skeletons";

const CategoriesV3 = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllCategoriesQuery();
  const cats = Array.isArray(data?.data) ? data.data.slice(0, 6) : [];

  const go = (item) => navigate(`/category/${item?.Category}`, { state: { item } });

  return (
    <section className="section" style={{ background: "var(--bg-soft)", paddingTop: 72, paddingBottom: 72 }}>
      <div className="wrap">
        <div className="sec-head" style={{ marginBottom: 36 }}>
          <div>
            <div className="section-label"><span className="section-label-bar" />Browse by type</div>
            <h2 className="section-h">Choose Your Adventure</h2>
            <p className="section-sub" style={{ marginTop: 8 }}>From serene mountain treks to adrenaline-pumping expeditions — find your perfect experience.</p>
          </div>
          <button className="btn btn-ghost btn-md" onClick={() => navigate("/all-packages")}>
            View All <ArrowForwardIcon sx={{ fontSize: 15 }} />
          </button>
        </div>

        {isLoading ? (
          <CategoryCardSkeleton count={3} />
        ) : (
          <div className="cats-grid">
            {cats.map((item, i) => (
              <div className="cat-card" key={item?._id || i} onClick={() => go(item)} role="button" tabIndex={0}>
                {item?.Banner_Image
                  ? <img className="cat-card-img" src={item.Banner_Image} alt={item?.Category} loading="lazy" />
                  : <div className="cat-card-img" style={{ background: "linear-gradient(160deg,#1a3a2a,#2d6b4a)" }} />}
                <div className="cat-card-overlay" />
                {item?.Starting_From ? (
                  <div className="cat-price-tag">
                    <div className="cat-price-from">Starting from</div>
                    <div className="cat-price-val">₹{parseInt(item.Starting_From || 0).toLocaleString("en-IN")}</div>
                  </div>
                ) : null}
                <div className="cat-body">
                  <div className="cat-name">{item?.Category}</div>
                  <div className="cat-explore">Explore <ArrowForwardIcon sx={{ fontSize: 12 }} /></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesV3;
