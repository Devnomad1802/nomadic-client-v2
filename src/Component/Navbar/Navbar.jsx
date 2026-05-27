import {
  Box,
  Button,
  Container,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  Collapse,
  CircularProgress,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { logo } from "../../Images";
import SignUpModal from "../../Modals/SignUpModal";
import EnquirNow from "../../Modals/EnquirNow";
import { useState } from "react";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useGetTripsByCagtegoryMutation } from "../../services/categoriesApis";

const menuItems = [
  { name: "International Trips", category: "INTERNATIONAL" },
  { name: "India Trips", category: "INDIA" },
  { name: "Group Tours", category: "GROUP TOURS", comingSoon: true },
  { name: "Workshops", category: "WORKSHOPS", comingSoon: true },
  { name: "Blogs", link: "/blogs" },
];

const ORANGE = "#CD482A";
const TEXT = "#4B5563";

const Navbar = () => {
  const [opens, setOpens] = useState(false);
  const [opene, setOpene] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const [activeCategory, setActiveCategory] = useState(null);
  const [dropdownTrips, setDropdownTrips] = useState({});
  const [loadingCategory, setLoadingCategory] = useState(null);

  const navigate = useNavigate();
  const { userDbData } = useSelector((store) => store.global);
  const [GetTripsByCagtegory] = useGetTripsByCagtegoryMutation();

  const fetchCategoryTrips = async (category) => {
    if (dropdownTrips[category]) return;
    try {
      setLoadingCategory(category);
      const res = await GetTripsByCagtegory({ categories: category }).unwrap();
      setDropdownTrips((prev) => ({ ...prev, [category]: res?.data || [] }));
    } catch (error) {
      console.error("Error fetching category trips:", error);
      setDropdownTrips((prev) => ({ ...prev, [category]: [] }));
    } finally {
      setLoadingCategory(null);
    }
  };

  const handleHoverEnter = (item) => {
    if (item.comingSoon) {
      setActiveCategory(item.category);
      return;
    }
    if (item.category) {
      setActiveCategory(item.category);
      fetchCategoryTrips(item.category);
    }
  };

  const handleTripClick = (tripId) => {
    setActiveCategory(null);
    setMobileOpen(false);
    navigate(`/UpCommingDetails/${tripId}`);
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  const renderDropdownPanel = (item) => {
    const trips = dropdownTrips[item.category] || [];
    const isLoading = loadingCategory === item.category;

    return (
      <Box
        sx={{
          position: "absolute",
          top: "100%",
          left: 0,
          minWidth: "240px",
          background: "#fff",
          boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
          borderRadius: "10px",
          border: "1px solid #E5E7EB",
          py: 1,
          zIndex: 1300,
          mt: 1,
        }}
      >
        {item.comingSoon ? (
          <Typography sx={{ px: 2, py: 1.5, color: "#9CA3AF", fontSize: "14px" }}>
            Coming soon
          </Typography>
        ) : isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={20} sx={{ color: ORANGE }} />
          </Box>
        ) : trips.length === 0 ? (
          <Typography sx={{ px: 2, py: 1.5, color: "#9CA3AF", fontSize: "14px" }}>
            No trips available
          </Typography>
        ) : (
          trips.map((trip) => (
            <Typography
              key={trip._id}
              onClick={() => handleTripClick(trip._id)}
              sx={{
                px: 2,
                py: 1.2,
                fontSize: "14px",
                color: TEXT,
                cursor: "pointer",
                textAlign: "left",
                "&:hover": { background: "#F9FAFB", color: ORANGE },
              }}
            >
              {trip.title}
            </Typography>
          ))
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Container maxWidth="lg">
        <SignUpModal opens={opens} setOpens={setOpens} toggelModel={() => setOpens(!opens)} />
        <EnquirNow opene={opene} setOpene={setOpene} toggelModele={() => setOpene(!opene)} />

        <Box
          sx={{
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "transparent",
            pt: 1.7,
            pb: 0.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: { xs: "0px 16px", md: "0px 50px" },
            }}
          >
            <Box onClick={goHome} sx={{ cursor: "pointer", mt: { xs: 0, md: 1 } }}>
              <img width="160px" height="21px" src={logo} alt="logo" srcSet="" />
            </Box>

            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                justifyContent: "flex-start",
                gap: "0px 6px",
                alignItems: "center",
              }}
            >
              {menuItems.map((item, index) => {
                if (item.link) {
                  return (
                    <NavLink
                      key={index}
                      to={item.link}
                      onClick={() => window.scrollTo(0, 0)}
                      style={({ isActive }) => ({
                        textDecoration: "none",
                        padding: "10px",
                        fontSize: "16px",
                        color: isActive ? ORANGE : TEXT,
                        fontWeight: isActive ? 700 : 400,
                        fontFamily: "Inter",
                      })}
                    >
                      {item.name}
                    </NavLink>
                  );
                }
                return (
                  <Box
                    key={index}
                    onMouseEnter={() => handleHoverEnter(item)}
                    onMouseLeave={() => setActiveCategory(null)}
                    sx={{ position: "relative" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                        padding: "10px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontFamily: "Inter",
                        color: activeCategory === item.category ? ORANGE : TEXT,
                        fontWeight: activeCategory === item.category ? 700 : 400,
                      }}
                    >
                      {item.name}
                      <KeyboardArrowDownIcon sx={{ fontSize: "18px" }} />
                    </Box>
                    {activeCategory === item.category && renderDropdownPanel(item)}
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "0px 12px" }}>
            <Button
              variant="simplebtn"
              sx={{ display: { xs: "none", sm: "inline-flex" } }}
              onClick={() => setOpene(true)}
            >
              Enquire Now
            </Button>

            {userDbData ? (
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <IconButton onClick={() => navigate("/profile")} sx={{ p: 0.5 }}>
                  <AccountCircleIcon />
                </IconButton>
                <Typography sx={{ color: TEXT, fontSize: "12px" }}>
                  {userDbData?.name}
                </Typography>
              </Box>
            ) : (
              <Button
                onClick={() => setOpens(true)}
                variant="simplebtn"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  background: "#393938",
                  color: "#fff",
                  border: "1px solid #393938",
                  "&:hover": {
                    background: "transparent",
                    border: "1px solid " + ORANGE,
                    color: ORANGE,
                  },
                }}
              >
                Sign UP
              </Button>
            )}

            <IconButton
              sx={{ display: { xs: "inline-flex", lg: "none" }, color: TEXT }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <img width="130px" src={logo} alt="logo" />
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {menuItems.map((item, index) => {
              if (item.link) {
                return (
                  <ListItemButton
                    key={index}
                    onClick={() => {
                      setMobileOpen(false);
                      navigate(item.link);
                      window.scrollTo(0, 0);
                    }}
                    sx={{ color: TEXT, fontSize: "16px" }}
                  >
                    {item.name}
                  </ListItemButton>
                );
              }

              const isExpanded = mobileExpanded === item.category;
              const trips = dropdownTrips[item.category] || [];

              return (
                <Box key={index}>
                  <ListItemButton
                    onClick={() => {
                      const next = isExpanded ? null : item.category;
                      setMobileExpanded(next);
                      if (next && !item.comingSoon) fetchCategoryTrips(item.category);
                    }}
                    sx={{ color: TEXT, justifyContent: "space-between" }}
                  >
                    {item.name}
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: isExpanded ? "rotate(180deg)" : "none",
                        transition: "transform 0.2s",
                      }}
                    />
                  </ListItemButton>
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    {item.comingSoon ? (
                      <Typography sx={{ pl: 4, py: 1, color: "#9CA3AF", fontSize: "14px" }}>
                        Coming soon
                      </Typography>
                    ) : loadingCategory === item.category ? (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                        <CircularProgress size={18} sx={{ color: ORANGE }} />
                      </Box>
                    ) : trips.length === 0 ? (
                      <Typography sx={{ pl: 4, py: 1, color: "#9CA3AF", fontSize: "14px" }}>
                        No trips available
                      </Typography>
                    ) : (
                      trips.map((trip) => (
                        <Typography
                          key={trip._id}
                          onClick={() => handleTripClick(trip._id)}
                          sx={{
                            pl: 4,
                            py: 1,
                            fontSize: "14px",
                            color: TEXT,
                            cursor: "pointer",
                            "&:hover": { color: ORANGE },
                          }}
                        >
                          {trip.title}
                        </Typography>
                      ))
                    )}
                  </Collapse>
                </Box>
              );
            })}
          </List>

          <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Button variant="simplebtn" onClick={() => { setMobileOpen(false); setOpene(true); }}>
              Enquire Now
            </Button>
            {!userDbData && (
              <Button
                variant="simplebtn"
                onClick={() => { setMobileOpen(false); setOpens(true); }}
                sx={{ background: "#393938", color: "#fff" }}
              >
                Sign UP
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;
