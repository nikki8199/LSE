import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Badge,
  IconButton,
  InputBase,
  Paper,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  Divider,
  Stack,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import HandshakeIcon from "@mui/icons-material/Handshake";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DashboardNavbar() {
  const { user, logout, toggleSidebar } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [anchorElNotify, setAnchorElNotify] = useState(null);

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 6000);
    return () => clearInterval(interval);
  }, []);

  const fetchCounts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch notifications
      const notifyRes = await axios.get("http://localhost:5000/notification", config);
      const notifyList = notifyRes.data.notifications || [];
      setNotifications(notifyList);
      setUnreadNotifications(notifyList.filter((n) => !n.isRead).length);

      // Fetch message conversations
      const msgRes = await axios.get("http://localhost:5000/messages/conversations", config);
      const convList = msgRes.data.conversations || [];
      setUnreadMessages(convList.filter((c) => c.unread).length);
    } catch (err) {
      console.error("Error fetching navbar counts:", err);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (searchTerm.trim()) {
        navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleOpenNotify = (e) => {
    setAnchorElNotify(e.currentTarget);
  };

  const handleCloseNotify = () => {
    setAnchorElNotify(null);
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch("http://localhost:5000/notification/read-all", {}, config);
      fetchCounts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReadNotify = async (id, type, senderId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`http://localhost:5000/notification/read/${id}`, {}, config);
      handleCloseNotify();
      fetchCounts();
      
      // Navigate to relevant section
      if (type === "Accepted" && senderId) {
        navigate(`/messages?chat=${senderId}`);
      } else if (["Request", "Rejected", "Cancelled"].includes(type)) {
        navigate("/requests");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 1.5, sm: 3 },
          alignItems: "center",
          display: "flex",
        }}
      >
        {/* Left branding */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={toggleSidebar} sx={{ mr: 0.5, color: "text.primary" }}>
            <MenuIcon />
          </IconButton>

          <Box
            onClick={() => navigate(user?.role === "admin" ? "/admin" : "/dashboard")}
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
          >
            <HandshakeIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              {user?.role === "admin" ? "SkillSwap Admin" : "SkillSwap"}
            </Typography>
          </Box>
        </Box>

        {/* Center search bar (Hidden for Admin) */}
        {user?.role !== "admin" && (
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              px: 1.5,
              width: { xs: 180, sm: 300, md: 380 },
              bgcolor: "rgba(10, 15, 30, 0.45)",
              border: "1px solid rgba(6, 182, 212, 0.18)",
              backdropFilter: "blur(10px)",
              borderRadius: 8,
              boxShadow: "0 0 12px rgba(6, 182, 212, 0.1)",
              transition: "border-color 0.3s ease",
              "&:hover": {
                borderColor: "rgba(6, 182, 212, 0.5)",
              }
            }}
          >
            <IconButton onClick={handleSearchSubmit} size="small" sx={{ p: 0.5 }}>
              <SearchIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <InputBase
              placeholder="Search Skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
              sx={{
                ml: 1,
                width: "100%",
                fontSize: 14,
              }}
            />
          </Paper>
        )}

        {/* Right navigation icons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
          {user?.role !== "admin" && (
            <>
              <IconButton onClick={() => navigate("/messages")} size="small">
                <Badge badgeContent={unreadMessages} color="error">
                  <ChatIcon sx={{ fontSize: 24, color: "text.primary" }} />
                </Badge>
              </IconButton>

              <IconButton onClick={handleOpenNotify} size="small">
                <Badge badgeContent={unreadNotifications} color="error">
                  <NotificationsIcon sx={{ fontSize: 24, color: "text.primary" }} />
                </Badge>
              </IconButton>

              <Menu
                anchorEl={anchorElNotify}
                open={Boolean(anchorElNotify)}
                onClose={handleCloseNotify}
                PaperProps={{
                  sx: { width: 320, maxHeight: 400, borderRadius: 3, mt: 1.5, boxShadow: 3 },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={1}>
                  <Typography fontWeight="bold" variant="subtitle1">Notifications</Typography>
                  {unreadNotifications > 0 && (
                    <Button size="small" onClick={handleMarkAllRead} sx={{ fontWeight: "bold" }}>
                      Mark all read
                    </Button>
                  )}
                </Stack>
                <Divider />

                {notifications.length === 0 ? (
                  <MenuItem disabled sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary" width="100%" align="center">
                      No notifications yet.
                    </Typography>
                  </MenuItem>
                ) : (
                  notifications.map((notify) => (
                    <MenuItem
                      key={notify._id}
                      onClick={() => handleReadNotify(notify._id, notify.type, notify.sender?._id)}
                      sx={{
                        py: 1.5,
                        px: 2,
                        bgcolor: notify.isRead ? "inherit" : "rgba(25, 118, 210, 0.05)",
                        whiteSpace: "normal",
                      }}
                    >
                      <ListItemText
                        primary={notify.message}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: notify.isRead ? "normal" : "bold",
                        }}
                        secondary={new Date(notify.createdAt).toLocaleDateString()}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </MenuItem>
                  ))
                )}
              </Menu>
            </>
          )}

          <Box
            onClick={() => navigate(user?.role === "admin" ? "/admin" : `/profile/${user?._id}`)}
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1, cursor: "pointer" }}
          >
            <Avatar src={user?.profileImage} sx={{ width: 32, height: 32 }} />
            <Typography fontWeight="bold" variant="body2">
              {user?.name} {user?.role === "admin" && "(Admin)"}
            </Typography>
          </Box>

          <IconButton onClick={handleLogout} color="error" title="Logout" size="small">
            <LogoutIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default DashboardNavbar;