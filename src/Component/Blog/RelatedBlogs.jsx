/* eslint-disable react/prop-types */
/**
 * RelatedBlogs — "More from the journal" cards (new design, scoped .bdrel).
 * Dynamic from useGetAllBlogsQuery. Excludes the current blog, prefers same
 * location, falls back to newest. Not hardcoded to any specific blog.
 */
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetAllBlogsQuery } from "../../services";
import "./relatedBlogs.css";

const DEFAULT_COVER = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=65";

const fmtDate = (d) => {
  if (!d) return "";
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? "" : x.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};
const readMin = (b) => {
  const text = [
    ...(Array.isArray(b?.items) ? b.items.map((i) => i?.content || "") : []),
    b?.content1, b?.content2, b?.metaDescription,
  ].filter(Boolean).join(" ").replace(/<[^>]+>/g, " ");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 200));
};

const RelatedBlogs = ({ currentId, location = "" }) => {
  const navigate = useNavigate();
  const { data } = useGetAllBlogsQuery();

  const related = useMemo(() => {
    const all = (Array.isArray(data?.data) ? data.data : []).filter((b) => b?._id !== currentId);
    const sameLoc = location ? all.filter((b) => b?.location && b.location === location) : [];
    const rest = all.filter((b) => !sameLoc.includes(b));
    return [...sameLoc, ...rest]
      .sort((a, b) => new Date(b?.Date || 0) - new Date(a?.Date || 0))
      .slice(0, 3);
  }, [data, currentId, location]);

  if (!related.length) return null;

  const go = (id) => { navigate(`/blogs/Details/${id}`); window.scrollTo(0, 0); };

  return (
    <section className="bdrel">
      <div className="wrap">
        <div className="related-head">
          <div className="kicker">Keep reading</div>
          <h2>More from the journal</h2>
        </div>
        <div className="related-grid">
          {related.map((b) => (
            <a key={b._id} className="story" onClick={() => go(b._id)}>
              <div className="story-img">
                <img src={b?.Banner_Image || DEFAULT_COVER} alt={b?.title || "Travel story"} loading="lazy" />
                {b?.location && <span className="loc">📍 {b.location}</span>}
              </div>
              <div className="story-body">
                <h3 className="story-h">{b?.title}</h3>
                <div className="story-meta">
                  {b?.author && <><b>{b.author}</b><span className="dot-sm" /></>}
                  {readMin(b)} min read
                  {fmtDate(b?.Date) && <><span className="dot-sm" />{fmtDate(b.Date)}</>}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedBlogs;
