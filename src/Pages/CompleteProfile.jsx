import { useState, useCallback } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserDbData } from "../slices";
import Loading from "../SmallComponents/Loading";
import Toastify from "../SmallComponents/Tostify";
import { inputStyle } from "./ContactUs";
import { baseUrl } from "../utils/api";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.global.userDbData);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [loading, setLoading] = useState(false);
  const [alertState, setAlertState] = useState({ open: false, message: "", severity: undefined });
  const showToast = (msg, type) => setAlertState({ open: true, message: msg, severity: type });

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!name.trim()) return showToast("Name is required", "error");
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(baseUrl + "/auth/editUser", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ userId: user?._id, name, phone, gender }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setUserDbData({ ...user, name, phone, gender }));
        showToast("Profile updated!", "success");
        setTimeout(() => navigate("/"), 1000);
      } else {
        showToast(data.msg || "Update failed", "error");
      }
      setLoading(false);
    } catch (err) {
      showToast("Something went wrong", "error");
      setLoading(false);
    }
  }, [name, phone, gender, user, dispatch, navigate]);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9" }}>
      <Loading isLoading={loading} />
      <Toastify setAlertState={setAlertState} alertState={alertState} />
      <Container maxWidth="sm">
        <Box sx={{ background: "#fff", borderRadius: "24px", p: { xs: 3, md: 5 }, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <Typography sx={{ fontSize: "28px", fontWeight: 700, color: "#1F2937", mb: 1 }}>
            Set up your Account
          </Typography>
          <Typography sx={{ fontSize: "16px", color: "#6B7280", mb: 4 }}>
            Just a few details to get you started
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px 0px" }}>
              <Box>
                <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Name *</Typography>
                <TextField required sx={inputStyle} size="small" placeholder="Your name"
                  value={name} onChange={(e) => setName(e.target.value)} />
              </Box>
              <Box>
                <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Email</Typography>
                <TextField sx={inputStyle} size="small" value={user?.email || ""} disabled />
              </Box>
              <Box>
                <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Phone</Typography>
                <TextField sx={inputStyle} size="small" placeholder="+91 9876543210"
                  value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Box>
              <Box>
                <Typography sx={{ color: "#737373", textAlign: "left", mb: 1 }}>Gender</Typography>
                <TextField sx={inputStyle} size="small" placeholder="Male / Female / Other"
                  value={gender} onChange={(e) => setGender(e.target.value)} />
              </Box>
            </Box>
            <Button type="submit" variant="simplebtn" sx={{
              width: "100%", background: "#EC3F18", color: "#fff", mt: 3,
              py: 1.5, fontSize: "16px",
            }}>
              Create Account
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default CompleteProfile;
