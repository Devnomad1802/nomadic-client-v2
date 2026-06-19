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
import { useGetAllBlogsQuery } from "../../services/blogApi";

const menuItems = [
  { name: "International Trips", category: "INTERNATIONAL" },
  { name: "India Trips", category: "INDIA" },
  { name: "Blogs", isBlog: true },
  // Group Tours and Workshops hidden until ready to avoid dead-end nav items
  // { name: "Group Tours", category: "GROUP TOURS", comingSoon: true },
  // { name: "Workshops", category: "WORKSHOPS", comingSoon: true },
];

const ORANGE = "#CD482A";
const TEXT = "#4B5563";

const Navbar = () => {
  const [opens, setOpens] = useState(false);
  const [opene, setOpene] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const [activeMenu, setActiveMenu] = useState(null);
  const [dropdownTrips, setDropdownTrips] = useState({});
  const [loadingCategory, setLoadingCategory] = useState(null);

  const navigate = useNavigate();
  const { userDbData } = useSelector((store) => store.global);
  const [GetTripsByCagtegory] = useGetTripsByCagtegoryMutation();
  const { data: blogsData } = useGetAllBlogsQuery();
  const allBlogs = blogsData?.data || [];
  const recentBlogs = allBlogs.slice(0, 5);

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
    setActiveMenu(item.name);
    if (item.category && !item.comingSoon) fetchCategoryTrips(item.category);
  };

  const handleTripClick = (tripId) => {
    setActiveMenu(null);
    setMobileOpen(false);
    navigate(`/trips/${tripId}`);
    window.scrollTo(0, 0);
  };

  const handleBlogClick = (blogId) => {
    setActiveMenu(null);
    setMobileOpen(false);
    navigate(`/blogs/Details/${blogId}`);
    window.scrollTo(0, 0);
  };

  const handleViewAllBlogs = () => {
    setActiveMenu(null);
    setMobileOpen(false);
    navigate("/blogs");
    window.scrollTo(0, 0);
  };

  const goHome = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  const dropdownItemSx = {
    px: 2,
    py: 1.2,
    fontSize: "13px",
    color: TEXT,
    cursor: "pointer",
    textAlign: "left",
    "&:hover": { background: "#F9FAFB", color: ORANGE },
  };

  const renderDropdownPanel = (item) => {
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
          // Transparent bridge fills the 8px gap (mt:1) between the menu item and
          // the panel so moving the cursor down keeps it within the hover area.
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-8px",
            left: 0,
            right: 0,
            height: "8px",
            background: "transparent",
          },
        }}
      >
        {item.isBlog ? (
          recentBlogs.length === 0 ? (
            <Typography sx={{ px: 2, py: 1.5, color: "#9CA3AF", fontSize: "13px" }}>
              No blogs available
            </Typography>
          ) : (
            <>
              {recentBlogs.map((blog) => (
                <Typography
                  key={blog._id}
                  onClick={() => handleBlogClick(blog._id)}
                  sx={dropdownItemSx}
                >
                  {blog.location || blog.title}
                </Typography>
              ))}
              <Box sx={{ borderTop: "1px solid #E5E7EB", mt: 0.5, pt: 0.5 }}>
                <Typography
                  onClick={handleViewAllBlogs}
                  sx={{ ...dropdownItemSx, color: ORANGE, fontWeight: 600 }}
                >
                  View all blogs →
                </Typography>
              </Box>
            </>
          )
        ) : item.comingSoon ? (
          <Typography sx={{ px: 2, py: 1.5, color: "#9CA3AF", fontSize: "13px" }}>
            Coming soon
          </Typography>
        ) : loadingCategory === item.category ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={20} sx={{ color: ORANGE }} />
          </Box>
        ) : (dropdownTrips[item.category] || []).length === 0 ? (
          <Typography sx={{ px: 2, py: 1.5, color: "#9CA3AF", fontSize: "13px" }}>
            No trips available
          </Typography>
        ) : (
          (dropdownTrips[item.category] || []).map((trip) => (
            <Typography
              key={trip._id}
              onClick={() => handleTripClick(trip._id)}
              sx={dropdownItemSx}
            >
              {trip.location ? trip.location.charAt(0) + trip.location.slice(1).toLowerCase() : (trip.title || "Trip")}
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
              gap: { xs: "0px 16px", md: "0px 30px" },
            }}
          >
            <Box onClick={goHome} sx={{ cursor: "pointer", mt: { xs: 0, md: 1 } }}>
              <img width="160px" height="21px" src={logo} alt="Nomadic Townies - Adventure Travel" />
            </Box>

            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                justifyContent: "flex-start",
                gap: "0px 10px",
                alignItems: "center",
              }}
            >
              {menuItems.map((item, index) => (
                <Box
                  key={index}
                  onMouseEnter={() => handleHoverEnter(item)}
                  onMouseLeave={() => setActiveMenu(null)}
                  sx={{ position: "relative" }}
                >
                  <Box
                    sx={{
                      display: "flex", whiteSpace: "nowrap",
                      alignItems: "center",
                      gap: "2px",
                      padding: "10px 8px",
                      cursor: "pointer",
                      fontSize: "15px",
                      fontFamily: "Inter",
                      color: activeMenu === item.name ? ORANGE : TEXT,
                      fontWeight: 400,
                      "&:hover": { color: ORANGE },
                    }}
                  >
                    {item.name}
                    <KeyboardArrowDownIcon sx={{ fontSize: "18px" }} />
                  </Box>
                  {activeMenu === item.name && renderDropdownPanel(item)}
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: "0px 12px" }}>
            <Button
              variant="simplebtn"
              sx={{ display: { xs: "none", sm: "inline-flex" }, fontSize: "13px" }}
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
                  whiteSpace: "nowrap",
                  "&:hover": {
                    background: "transparent",
                    border: "1px solid " + ORANGE,
                    color: ORANGE,
                  },
                }}
              >
                Login or Sign Up
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
            <img width="130px" src={logo} alt="Nomadic Townies" />
            <IconButton onClick={() => setMobileOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {menuItems.map((item, index) => {
              const isExpanded = mobileExpanded === item.name;
              return (
                <Box key={index}>
                  <ListItemButton
                    onClick={() => {
                      const next = isExpanded ? null : item.name;
                      setMobileExpanded(next);
                      if (next && item.category && !item.comingSoon) {
                        fetchCategoryTrips(item.category);
                      }
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
                    {item.isBlog ? (
                      recentBlogs.length === 0 ? (
                        <Typography sx={{ pl: 4, py: 1, color: "#9CA3AF", fontSize: "14px" }}>
                          No blogs available
                        </Typography>
                      ) : (
                        <>
                          {recentBlogs.map((blog) => (
                            <Typography
                              key={blog._id}
                              onClick={() => handleBlogClick(blog._id)}
                              sx={{ pl: 4, py: 1, fontSize: "14px", color: TEXT, cursor: "pointer", "&:hover": { color: ORANGE } }}
                            >
                              {blog.location || blog.title}
                            </Typography>
                          ))}
                          <Typography
                            onClick={handleViewAllBlogs}
                            sx={{ pl: 4, py: 1, fontSize: "14px", color: ORANGE, fontWeight: 600, cursor: "pointer" }}
                          >
                            View all blogs →
                          </Typography>
                        </>
                      )
                    ) : item.comingSoon ? (
                      <Typography sx={{ pl: 4, py: 1, color: "#9CA3AF", fontSize: "14px" }}>
                        Coming soon
                      </Typography>
                    ) : loadingCategory === item.category ? (
                      <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
                        <CircularProgress size={18} sx={{ color: ORANGE }} />
                      </Box>
                    ) : (dropdownTrips[item.category] || []).length === 0 ? (
                      <Typography sx={{ pl: 4, py: 1, color: "#9CA3AF", fontSize: "14px" }}>
                        No trips available
                      </Typography>
                    ) : (
                      (dropdownTrips[item.category] || []).map((trip) => (
                        <Typography
                          key={trip._id}
                          onClick={() => handleTripClick(trip._id)}
                          sx={{ pl: 4, py: 1, fontSize: "14px", color: TEXT, cursor: "pointer", "&:hover": { color: ORANGE } }}
                        >
                          {trip.location ? trip.location.charAt(0) + trip.location.slice(1).toLowerCase() : (trip.title || "Trip")}
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
                Login or Sign Up
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;
