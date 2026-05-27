import { Box, Hidden } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../Component/Navbar/Navbar";
import Footer from "../Component/Footer";

const Parent = () => {
  return (
    <Box
      sx={{
        background: "#fff",
      }}
    >
      <Navbar />

      <Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Parent;
