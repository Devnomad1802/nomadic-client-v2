import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container } from "@mui/material";
import { setUserDbData, setAuthenticated } from "../../slices";
import { useEditUserProfileMutation } from "../../services";
import MyTripsPanel from "./MyTripsPanel";
import SavedTripsPanel from "./SavedTripsPanel";

const TABS = [
  { key: "account", icon: "◍", label: "My Account" },
  { key: "coupon", icon: "✦", label: "Marketing Coupon" },
  { key: "trips", icon: "⛰", label: "My Trips" },
  { key: "saved", icon: "♥", label: "Saved Trips" },
  { key: "settings", icon: "⚙", label: "Settings" },
  { key: "logout", icon: "⏻", label: "Logout" },
];

const initials = (name) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "U";

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userDbData } = useSelector((store) => store.global) || {};

  const [tab, setTab] = useState("account");
  const [toast, setToast] = useState("");
  const [editProfile, { isLoading }] = useEditUserProfileMutation();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name: userDbData?.name || "",
    email: userDbData?.email || "",
    phone: userDbData?.phone || "",
    gender: userDbData?.gender || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(userDbData?.profileImage || "");

  const ping = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2600);
  };

  const onField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onPickAvatar = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return ping("Please choose an image file.");
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const onSave = async () => {
    if (!userDbData?._id) return ping("Please log in again.");
    try {
      const fd = new FormData();
      fd.append("userId", userDbData._id);
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("gender", form.gender);
      if (avatarFile) fd.append("profileImage", avatarFile);

      const res = await editProfile(fd).unwrap();
      const updated = res?.data || res?.user || {};
      dispatch(
        setUserDbData({
          ...userDbData,
          ...form,
          profileImage: updated.profileImage || avatarPreview || userDbData.profileImage,
        })
      );
      setAvatarFile(null);
      ping("Profile updated ✓");
    } catch (err) {
      console.error("profile update failed:", err);
      ping(err?.data?.msg || err?.data?.error || "Could not update profile.");
    }
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUserDbData(null));
    dispatch(setAuthenticated(false));
    navigate("/");
  };

  const copyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    ping("Coupon copied ✓");
  };

  const name = userDbData?.name || "Traveller";
  const isInfluencer = !!userDbData?.influencer;
  const couponCode = "MKNT10";

  // localStorage-backed notification prefs (honest local preference, no fake backend)
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nt_prefs") || "{}"); } catch { return {}; }
  });
  const togglePref = (k) => {
    const next = { ...prefs, [k]: !prefs[k] };
    setPrefs(next);
    localStorage.setItem("nt_prefs", JSON.stringify(next));
  };

  const avatarNode = useMemo(
    () =>
      avatarPreview ? (
        <img className="nt-av-img" src={avatarPreview} alt={name} />
      ) : (
        <div className="nt-av-fallback">{initials(name)}</div>
      ),
    [avatarPreview, name]
  );

  return (
    <Container maxWidth="xl" disableGutters className="nt-profile">
      <style>{css}</style>

      {toast && <div className="nt-toast">{toast}</div>}

      <div className="nt-head">
        <div className="nt-brand"><span className="o">nomadic</span> townies</div>
        <div className="nt-crumb">My Profile</div>
      </div>

      <div className="nt-grid">
        {/* SIDEBAR */}
        <aside className="nt-side">
          <div className="nt-side-top">
            <div className="nt-av-wrap">
              {avatarNode}
              <span className="nt-av-dot" />
            </div>
            <div className="nt-name">{name}</div>
            {isInfluencer && <div className="nt-badge">★ Influencer host</div>}
          </div>
          <nav className="nt-tabs">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className="nt-tab"
                data-active={tab === t.key}
                onClick={() => setTab(t.key)}
              >
                <span className="nt-tab-ic">{t.icon}</span> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* CONTENT */}
        <section className="nt-panel">
          {tab === "account" && (
            <>
              <h2 className="nt-h2">My Account</h2>
              <p className="nt-sub">Keep your details up to date so hosts and travelers can reach you.</p>

              <div className="nt-avatar-row">
                <div className="nt-av-wrap nt-av-lg">{avatarNode}</div>
                <div>
                  <button className="nt-ghost" onClick={() => fileRef.current?.click()}>
                    {avatarPreview ? "Change photo" : "Upload photo"}
                  </button>
                  <p className="nt-hint">JPG or PNG, up to ~5MB.</p>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPickAvatar} />
                </div>
              </div>

              <div className="nt-form">
                <label className="nt-fld">
                  <span className="nt-lbl">Name</span>
                  <input className="nt-in" name="name" value={form.name} onChange={onField} />
                </label>
                <label className="nt-fld">
                  <span className="nt-lbl">Email</span>
                  <input className="nt-in" name="email" type="email" value={form.email} onChange={onField} />
                </label>
                <label className="nt-fld">
                  <span className="nt-lbl">Mobile</span>
                  <input className="nt-in" name="phone" value={form.phone} onChange={onField} />
                </label>
                <label className="nt-fld">
                  <span className="nt-lbl">Gender</span>
                  <div className="nt-sel-wrap">
                    <select className="nt-in" name="gender" value={form.gender} onChange={onField}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Prefer not to say</option>
                    </select>
                    <span className="nt-sel-caret">▾</span>
                  </div>
                </label>
              </div>

              <button className="nt-cta" onClick={onSave} disabled={isLoading}>
                {isLoading ? "Updating…" : "Update profile"}
              </button>
            </>
          )}

          {tab === "coupon" && (
            <>
              <h2 className="nt-h2">Marketing Coupon</h2>
              <p className="nt-sub">Share your code — travelers get a discount, you earn referral rewards.</p>
              {isInfluencer ? (
                <div className="nt-coupon-card">
                  <div className="nt-coupon-row">
                    <div>
                      <div className="nt-coupon-name">{name} <span className="nt-pill-green">Active</span></div>
                      <div className="nt-hint">Your personal referral code</div>
                    </div>
                    <button className="nt-cta nt-cta-sm" onClick={() => copyCoupon(couponCode)}>
                      {couponCode} <span className="nt-copy">⧉ copy</span>
                    </button>
                  </div>
                  <div className="nt-coupon-desc">
                    <div className="nt-lbl">Coupon description</div>
                    <p>Give travelers 10% off their first booked experience. You earn a referral reward each time your code is redeemed on a completed trip.</p>
                  </div>
                </div>
              ) : (
                <div className="nt-empty">Marketing coupons are available for influencer hosts. Reach out to us to become one.</div>
              )}
            </>
          )}

          {tab === "trips" && (
            <>
              <h2 className="nt-h2">My Trips</h2>
              <p className="nt-sub">Your bookings and balances. Open a trip to see details and pay any remaining amount.</p>
              <div className="nt-embed"><MyTripsPanel /></div>
            </>
          )}

          {tab === "saved" && (
            <>
              <h2 className="nt-h2">Saved Trips</h2>
              <p className="nt-sub">Experiences you&apos;ve bookmarked for later.</p>
              <div className="nt-embed"><SavedTripsPanel /></div>
            </>
          )}

          {tab === "settings" && (
            <>
              <h2 className="nt-h2">Settings</h2>
              <p className="nt-sub">Manage notifications, privacy and your account.</p>
              <div className="nt-settings">
                <label className="nt-toggle">
                  <span>
                    <span className="nt-toggle-t">Trip &amp; booking emails</span>
                    <span className="nt-toggle-d">Confirmations, reminders and itinerary updates</span>
                  </span>
                  <span className={`nt-switch ${prefs.tripEmails ? "on" : ""}`} onClick={() => togglePref("tripEmails")}><i /></span>
                </label>
                <label className="nt-toggle">
                  <span>
                    <span className="nt-toggle-t">Marketing &amp; offers</span>
                    <span className="nt-toggle-d">Curated experiences and seasonal deals</span>
                  </span>
                  <span className={`nt-switch ${prefs.marketing ? "on" : ""}`} onClick={() => togglePref("marketing")}><i /></span>
                </label>

                <div className="nt-danger">
                  <div>
                    <div className="nt-danger-t">Delete account</div>
                    <div className="nt-danger-d">Permanently remove your profile, trips and saved experiences. This can&apos;t be undone.</div>
                  </div>
                  <button className="nt-danger-btn" onClick={() => navigate("/contact-us")}>Contact support</button>
                </div>
              </div>
            </>
          )}

          {tab === "logout" && (
            <div className="nt-logout">
              <div className="nt-logout-ic">⏻</div>
              <h3 className="nt-h3">Ready to head out?</h3>
              <p className="nt-sub" style={{ textAlign: "center" }}>You&apos;ll need to sign in again next time.</p>
              <div className="nt-logout-actions">
                <button className="nt-ghost" onClick={() => setTab("account")}>Cancel</button>
                <button className="nt-cta" onClick={onLogout}>Log out</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </Container>
  );
};

const css = `
.nt-profile{--bg:#FFFDF9;--line:#E6DDCF;--line-soft:#EFE7DA;--accent:#CF4A2C;--accent2:#E9622F;--ink:#221C17;--muted:#726A5E;--muted2:#8A8073;--green:#5BBF7A;--badge:#F6E4DC;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--ink);padding:clamp(20px,4vw,52px) clamp(16px,4vw,52px);box-sizing:border-box}
.nt-profile *{box-sizing:border-box}
.nt-toast{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:1300;background:var(--ink);color:#FFF6EF;padding:11px 20px;border-radius:12px;font-size:14px;font-weight:600;box-shadow:0 10px 30px -10px rgba(0,0,0,.4)}
.nt-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:clamp(20px,3vw,34px);max-width:1180px;margin-left:auto;margin-right:auto}
.nt-brand{font-weight:800;font-size:clamp(20px,2.4vw,24px);letter-spacing:-.01em}
.nt-brand .o{color:var(--accent)}
.nt-crumb{font-weight:600;font-size:13px;color:var(--muted2)}
.nt-grid{display:grid;grid-template-columns:296px 1fr;gap:clamp(18px,2.2vw,28px);align-items:start;max-width:1180px;margin:0 auto}
.nt-side{position:sticky;top:24px;background:var(--bg);border:1px solid var(--line);border-radius:22px;padding:30px 22px;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.nt-side-top{display:flex;flex-direction:column;align-items:center;text-align:center;padding-bottom:24px;border-bottom:1px solid var(--line-soft)}
.nt-av-wrap{position:relative;width:88px;height:88px}
.nt-av-lg{width:84px;height:84px}
.nt-av-img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
.nt-av-fallback{width:100%;height:100%;border-radius:50%;background:linear-gradient(145deg,var(--accent2),var(--accent));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:32px;color:#FFF6EF}
.nt-av-dot{position:absolute;right:2px;bottom:2px;width:22px;height:22px;border-radius:50%;background:var(--green);border:3px solid var(--bg)}
.nt-name{margin-top:14px;font-weight:700;font-size:21px;color:var(--ink)}
.nt-badge{margin-top:5px;display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:99px;background:var(--badge);color:var(--accent);font-weight:700;font-size:11px;letter-spacing:.04em;text-transform:uppercase}
.nt-tabs{display:flex;flex-direction:column;gap:4px;margin-top:18px}
.nt-tab{display:flex;align-items:center;gap:11px;width:100%;text-align:left;padding:12px 14px;border:none;background:transparent;color:var(--muted);font-size:15px;font-weight:600;border-radius:12px;cursor:pointer;transition:background .15s,color .15s}
.nt-tab:hover{background:#F7F0E6}
.nt-tab[data-active="true"]{background:var(--accent);color:#fff}
.nt-tab-ic{font-size:17px;width:18px;text-align:center}
.nt-panel{background:var(--bg);border:1px solid var(--line);border-radius:22px;padding:clamp(24px,3vw,40px);box-shadow:0 1px 3px rgba(0,0,0,.05);min-height:560px}
.nt-h2{margin:0;font-weight:700;font-size:clamp(24px,2.8vw,30px);letter-spacing:-.01em;color:var(--ink)}
.nt-h3{margin:18px 0 0;font-weight:700;font-size:24px;color:var(--ink)}
.nt-sub{margin:8px 0 0;font-size:15px;line-height:1.5;color:var(--muted)}
.nt-avatar-row{display:flex;align-items:center;gap:18px;margin-top:26px}
.nt-hint{margin:6px 0 0;font-size:12.5px;color:var(--muted2)}
.nt-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:20px 24px;margin-top:28px}
.nt-fld{display:flex;flex-direction:column;gap:8px}
.nt-lbl{font-weight:600;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.nt-in{width:100%;padding:13px 15px;font-size:15px;font-family:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:11px;outline:none}
.nt-in:focus{border-color:var(--accent)}
.nt-sel-wrap{position:relative}
.nt-sel-wrap select{-webkit-appearance:none;appearance:none;padding-right:40px;cursor:pointer;width:100%}
.nt-sel-caret{position:absolute;right:15px;top:50%;transform:translateY(-50%);color:#A89C8A;pointer-events:none;font-size:12px}
.nt-cta{margin-top:30px;padding:14px 30px;font-size:15px;font-weight:700;color:#fff;background:var(--accent);border:none;border-radius:12px;cursor:pointer;box-shadow:0 6px 16px rgba(207,74,44,.26)}
.nt-cta:hover{background:#B83F23}
.nt-cta:disabled{opacity:.6;cursor:default}
.nt-cta-sm{margin-top:0;padding:12px 18px;display:inline-flex;align-items:center;gap:10px}
.nt-copy{font-size:13px;opacity:.85}
.nt-ghost{padding:12px 22px;font-size:14px;font-weight:700;color:#3C3228;background:transparent;border:1.5px solid #D8CFC0;border-radius:11px;cursor:pointer}
.nt-ghost:hover{border-color:var(--ink)}
.nt-coupon-card{margin-top:26px;border:1px solid var(--line);border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:20px}
.nt-coupon-row{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.nt-coupon-name{font-weight:700;font-size:16px;display:flex;align-items:center;gap:8px}
.nt-pill-green{font-size:11px;font-weight:700;color:#1f7a45;background:#E4F4EA;padding:3px 9px;border-radius:99px;text-transform:uppercase;letter-spacing:.04em}
.nt-coupon-desc p{margin:6px 0 0;font-size:14px;line-height:1.55;color:var(--muted)}
.nt-empty{margin-top:26px;padding:22px;border:1px dashed var(--line);border-radius:14px;color:var(--muted);font-size:14.5px}
.nt-embed{margin-top:18px}
.nt-settings{margin-top:28px;display:flex;flex-direction:column;gap:14px}
.nt-toggle{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 20px;border:1px solid var(--line);border-radius:14px;cursor:pointer}
.nt-toggle-t{display:block;font-weight:600;font-size:15px;color:var(--ink)}
.nt-toggle-d{display:block;margin-top:3px;font-size:13px;color:var(--muted)}
.nt-switch{flex-shrink:0;width:46px;height:26px;border-radius:99px;background:#D8CFC0;position:relative;transition:background .18s}
.nt-switch i{position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .18s}
.nt-switch.on{background:var(--green)}
.nt-switch.on i{left:23px}
.nt-danger{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 20px;border:1px solid #E8C9C0;background:#FDF4F1;border-radius:14px;margin-top:6px}
.nt-danger-t{font-weight:700;font-size:15px;color:#A23A26}
.nt-danger-d{margin-top:3px;font-size:13px;color:#9A6A5E;line-height:1.4}
.nt-danger-btn{flex-shrink:0;padding:12px 22px;font-size:14px;font-weight:700;color:#C0392B;background:transparent;border:1.5px solid #D88B7C;border-radius:11px;cursor:pointer}
.nt-danger-btn:hover{background:#C0392B;color:#fff;border-color:#C0392B}
.nt-logout{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:460px;gap:6px}
.nt-logout-ic{width:64px;height:64px;border-radius:50%;background:var(--badge);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:6px}
.nt-logout-actions{display:flex;gap:12px;margin-top:22px}
/* states */
.nt-state{margin-top:24px;font-size:15px;color:var(--muted)}
.nt-state-err{color:#A23A26}
.nt-link{background:none;border:none;color:var(--accent);font-weight:700;cursor:pointer;text-decoration:underline}
.nt-empty-box{margin-top:24px;border:1px dashed var(--line);border-radius:16px;padding:40px 24px;text-align:center;color:var(--muted)}
.nt-empty-ic{font-size:34px;color:var(--accent)}
.nt-empty-t{margin-top:8px;font-weight:700;font-size:17px;color:var(--ink)}
.nt-empty-box p{margin:6px 0 16px;font-size:14px}
/* My Trips accordion */
.nt-bookings{margin-top:18px;display:flex;flex-direction:column;gap:12px}
.nt-bk{border:1px solid var(--line);border-radius:16px;overflow:hidden;background:#fff}
.nt-bk-head{width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px 20px;background:transparent;border:none;cursor:pointer;text-align:left}
.nt-bk-ttl{display:flex;flex-direction:column;gap:3px;min-width:0}
.nt-bk-name{font-weight:700;font-size:16px;color:var(--ink)}
.nt-bk-sub{font-size:12.5px;color:var(--muted)}
.nt-bk-right{display:flex;align-items:center;gap:12px;flex-shrink:0}
.nt-stat{font-size:11.5px;font-weight:700;padding:5px 11px;border-radius:99px;text-transform:uppercase;letter-spacing:.03em}
.nt-stat.ok{background:#E4F4EA;color:#1f7a45}
.nt-stat.warn{background:#FBEBD9;color:#9C5A12}
.nt-stat.muted{background:#EFE7DA;color:var(--muted)}
.nt-caret{color:var(--muted);font-size:13px;transition:transform .2s}
.nt-bk[data-open="true"] .nt-caret{transform:rotate(180deg)}
.nt-bk-body{padding:0 20px 20px;border-top:1px solid var(--line-soft)}
.nt-bk-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;padding:18px 0}
.nt-bk-cell{display:flex;flex-direction:column;gap:4px}
.nt-k{font-size:12px;color:var(--muted)}
.nt-v{font-size:14px;font-weight:600;color:var(--ink)}
.nt-li{border-top:1px solid var(--line-soft);padding-top:12px}
.nt-li-row{display:grid;grid-template-columns:1fr auto auto;gap:12px;padding:6px 0;font-size:13.5px;color:var(--ink)}
.nt-li-qty{color:var(--muted)}
.nt-green{color:#1f7a45;font-weight:600}
.nt-pay{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px;padding:14px 16px;background:var(--bg);border:1px solid var(--line);border-radius:12px}
.nt-pay-cell{display:flex;flex-direction:column;gap:3px;font-size:13px;color:var(--muted)}
.nt-pay-cell strong{font-size:17px;color:var(--ink)}
.nt-balance{margin-top:14px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;padding:14px 16px;background:#FFF7EE;border:1px solid #F0DEC6;border-radius:12px;font-size:13px;color:#7a5a2e}
/* Saved Trips grid */
.nt-saved{margin-top:18px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px}
.nt-card{border:1px solid var(--line);border-radius:16px;overflow:hidden;background:#fff;display:flex;flex-direction:column}
.nt-card-img{position:relative;aspect-ratio:16/10;overflow:hidden;cursor:pointer;background:var(--line-soft)}
.nt-card-img img{width:100%;height:100%;object-fit:cover;display:block}
.nt-card-ph{width:100%;height:100%;background:linear-gradient(135deg,#E9DFCF,#D8CFC0)}
.nt-heart{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;border:none;background:rgba(255,253,249,.92);color:var(--accent);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.12)}
.nt-heart:hover{background:#fff}
.nt-heart:disabled{opacity:.5}
.nt-rate{position:absolute;left:10px;bottom:10px;background:rgba(34,28,23,.85);color:#FFE9B0;font-size:12px;font-weight:700;padding:3px 9px;border-radius:99px}
.nt-card-body{padding:14px 16px;display:flex;flex-direction:column;gap:7px;flex:1}
.nt-card-ttl{font-weight:700;font-size:15.5px;color:var(--ink);cursor:pointer;line-height:1.3}
.nt-card-loc{font-size:13px;color:var(--muted)}
.nt-card-row{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:2px}
.nt-card-price{font-weight:700;font-size:15px;color:var(--ink)}
.nt-per{font-weight:400;font-size:12px;color:var(--muted)}
.nt-card-dur{font-size:12.5px;color:var(--muted)}
.nt-card-cta{margin-top:8px;padding:10px;font-size:13.5px;font-weight:700;color:var(--accent);background:transparent;border:1.5px solid var(--accent);border-radius:10px;cursor:pointer}
.nt-card-cta:hover{background:var(--accent);color:#fff}
@media(max-width:860px){
  .nt-grid{grid-template-columns:1fr}
  .nt-side{position:static}
  .nt-tabs{flex-direction:row;flex-wrap:wrap;gap:8px}
  .nt-tab{width:auto;flex:1 1 auto;justify-content:center}
  .nt-pay{grid-template-columns:1fr}
}
`;

export default UserProfile;
