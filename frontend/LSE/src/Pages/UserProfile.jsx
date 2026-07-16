import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  CircularProgress,
  Container,
} from "@mui/material";

import DashboardNavbar from "../Components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../Components/SideBar/SideBar";

import { getUserProfile } from "../Services/userService";

import ProfileHeader from "../Components/Profile/ProfileHeader";
import AboutSection from "../Components/Profile/AboutSection";
import SkillsSection from "../Components/Profile/SkillsSection";
import ReviewsSection from "../Components/Profile/ReviewsSection";
import ExchangeButton from "../Components/Profile/ExchangeButton";

function UserProfile() {

  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [id]);

  async function loadUser() {

    try {

      const data = await getUserProfile(id);

      setUser(data.user);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  }

  if (loading)
    return <CircularProgress />;

  return (
    <>
      <DashboardNavbar />

      <Box
        sx={{
          display: "flex",
          bgcolor: "transparent",
          minHeight: "100vh",
          pt: 10,
        }}
      >
        <Sidebar />

        <Container
          maxWidth="lg"
          sx={{
            py: 4,
          }}
        >
          <ProfileHeader user={user} />

          <AboutSection user={user} />

          <SkillsSection user={user} />

          <ReviewsSection userId={user?._id} />

          {user?.role !== "admin" && <ExchangeButton user={user} />}
        </Container>
      </Box>
    </>
  );
}

export default UserProfile;