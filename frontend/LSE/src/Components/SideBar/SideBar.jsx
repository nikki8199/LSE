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
import BarChartIcon from "@mui/icons-material/BarChart";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import StarRateIcon from "@mui/icons-material/StarRate";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import ComplaintModal from "../Dashboard/ComplaintModal";

function Sidebar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "analytics";
  const { user, sidebarOpen, logout } = useAuth();
  const [complaintOpen, setComplaintOpen] = useState(false);

  if (!sidebarOpen) return null;

  return (

    <Box

      sx={{
        width: 300,
        minHeight: "calc(100vh - 64px)",
        height: "calc(100vh - 64px)",
        position: "sticky",
        top: "64px",
        bgcolor: "rgba(8, 12, 24, 0.75)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(6, 182, 212, 0.25)",
        borderRadius: 0,
        p: 3,
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.4)",
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
            border: "2px solid rgba(6, 182, 212, 0.4)",
            boxShadow: "0 0 15px rgba(6, 182, 212, 0.3)",
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
        <Stack spacing={1.5} mt={4}>
          <Button
            fullWidth
            variant={activeTab === "analytics" ? "contained" : "outlined"}
            color="primary"
            startIcon={<BarChartIcon />}
            onClick={() => navigate("/admin?tab=analytics")}
            sx={{ borderRadius: 2, justifyContent: "flex-start", px: 3, fontWeight: "bold" }}
          >
            Analytics
          </Button>

          <Button
            fullWidth
            variant={activeTab === "users" ? "contained" : "outlined"}
            color="primary"
            startIcon={<SupervisedUserCircleIcon />}
            onClick={() => navigate("/admin?tab=users")}
            sx={{ borderRadius: 2, justifyContent: "flex-start", px: 3, fontWeight: "bold" }}
          >
            Users Directory
          </Button>

          <Button
            fullWidth
            variant={activeTab === "reviews" ? "contained" : "outlined"}
            color="primary"
            startIcon={<StarRateIcon />}
            onClick={() => navigate("/admin?tab=reviews")}
            sx={{ borderRadius: 2, justifyContent: "flex-start", px: 3, fontWeight: "bold" }}
          >
            User Reviews
          </Button>

          <Button
            fullWidth
            variant={activeTab === "complaints" ? "contained" : "outlined"}
            color="primary"
            startIcon={<ReportIcon />}
            onClick={() => navigate("/admin?tab=complaints")}
            sx={{ borderRadius: 2, justifyContent: "flex-start", px: 3, fontWeight: "bold" }}
          >
            Complaints Desk
          </Button>

          <Button
            fullWidth
            variant={activeTab === "videos" ? "contained" : "outlined"}
            color="primary"
            startIcon={<VideoLibraryIcon />}
            onClick={() => navigate("/admin?tab=videos")}
            sx={{ borderRadius: 2, justifyContent: "flex-start", px: 3, fontWeight: "bold" }}
          >
            Shared Videos
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
            sx={{ borderRadius: 2, mt: 3 }}
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