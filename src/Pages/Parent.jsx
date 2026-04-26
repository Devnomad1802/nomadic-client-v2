import { Box, Hidden } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "../Component/Navbar/Navbar";
import Header from "../Component/Navbar/Header";
import Footer from "../Component/Footer";

const Parent = () => {
  return (
    <Box
      sx={{
        background: "#fff",
      }}
    >
      <Hidden lgDown>
        <Navbar />
      </Hidden>
      <Hidden lgUp>
        <Header />
      </Hidden>

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
