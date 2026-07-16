import {
  Box,
  Typography,
  Container,
} from "@mui/material";

import DashboardNavbar from "../Components/DashboardNavbar/DashboardNavbar";
import Sidebar from "../Components/SideBar/SideBar";
import ExploreUsers from "../Components/Explore/ExploreUsers";

function Explore() {
  return (
    <>
      <DashboardNavbar />

      <Box
        sx={{
          display: "flex",
          bgcolor: "transparent",
          minHeight: "100vh",
          pt: 8,
        }}
      >
        <Sidebar />

        <Container
          maxWidth="xl"
          sx={{
            py: 4,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={3}
          >
            Explore Skilled People
          </Typography>

          <ExploreUsers />
        </Container>
      </Box>
    </>
  );
}

export default Explore;