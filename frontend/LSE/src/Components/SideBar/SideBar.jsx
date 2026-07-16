import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Chip,
  Button,
  Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import ReportIcon from "@mui/icons-material/Report";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ComplaintModal from "../Dashboard/ComplaintModal";

function Sidebar() {
  const navigate = useNavigate();
  const { user, sidebarOpen, logout } = useAuth();
  const [complaintOpen, setComplaintOpen] = useState(false);

  if (!sidebarOpen) return null;

  return (

    <Box

      sx={{
        width: 300,
        minHeight: "calc(100vh - 80px)",
        height: "calc(100vh - 80px)",
        position: "sticky",
        top: "80px",
        bgcolor: "rgba(17, 24, 39, 0.6)",
        backdropFilter: "blur(14px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 0,
        p: 3,
        boxShadow: 2,
        overflowY: "auto",
        boxSizing: "border-box",
      }}

    >

      <Box textAlign="center">

        <Avatar
          src={user?.profileImage}
          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            fontSize: 40,
            bgcolor: "primary.main",
          }}
        >
          {user?.name?.charAt(0)}
        </Avatar>

        <Typography
          mt={2}
          variant="h5"
          fontWeight="bold"
        >
          {user?.name}
        </Typography>

        <Typography
          color="text.secondary"
          mb={user?.role === "admin" ? 2 : 0}
        >
          {user?.email}
        </Typography>

        {user?.role === "admin" && (
          <Chip
            label="System Administrator"
            color="warning"
            sx={{ fontWeight: "bold", mb: 2 }}
          />
        )}

      </Box>

      {user?.role === "admin" ? (
        <Stack spacing={2} mt={4}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            startIcon={<AdminPanelSettingsIcon />}
            onClick={() => navigate("/admin")}
            sx={{ borderRadius: 2, fontWeight: "bold" }}
          >
            System Monitor
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => {
              logout();
              navigate("/login");
            }}
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        </Stack>
      ) : (
        <>
          <Typography
            mt={4}
            fontWeight="bold"
          >
            Skills Offered
          </Typography>

          <Box mt={1}>

            {user?.skillsOffered?.map((skill) => (

              <Chip
                key={skill}
                label={skill}
                color="primary"
                sx={{
                  mr: 1,
                  mb: 1,
                }}
              />

            ))}

          </Box>

          <Typography
            mt={3}
            fontWeight="bold"
          >
            Skills Needed
          </Typography>

          <Box mt={1}>

            {user?.skillsNeeded?.map((skill) => (

              <Chip
                key={skill}
                label={skill}
                color="secondary"
                sx={{
                  mr: 1,
                  mb: 1,
                }}
              />

            ))}

          </Box>

          <Stack spacing={2} mt={4}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate("/edit-profile")}
              sx={{ borderRadius: 2 }}
            >
              Edit Profile
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<VideoLibraryIcon />}
              onClick={() => navigate("/videos")}
              sx={{ borderRadius: 2 }}
            >
              Videos Feed
            </Button>

            <Button
              fullWidth
              variant="outlined"
              color="warning"
              startIcon={<ReportIcon />}
              onClick={() => setComplaintOpen(true)}
              sx={{ borderRadius: 2 }}
            >
              File Complaint
            </Button>
          </Stack>
        </>
      )}

      <ComplaintModal
        open={complaintOpen}
        onClose={() => setComplaintOpen(false)}
      />

    </Box>

  );
}

export default Sidebar;