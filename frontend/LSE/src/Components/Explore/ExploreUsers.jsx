import React, { useEffect, useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { exploreUsers, searchUsers } from "../../Services/userService";
import UserCard from "./UserCard";

function ExploreUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get("search") || "";

  // Dynamic Filters State
  const [experienceFilter, setExperienceFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("None");

  useEffect(() => {
    loadUsers();
  }, [searchKeyword]);

  async function loadUsers() {
    try {
      setLoading(true);
      const data = searchKeyword
        ? await searchUsers(searchKeyword)
        : await exploreUsers();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  }

  // Get dynamic unique cities list from retrieved user profiles
  const uniqueCities = ["All", ...new Set(users.map((u) => u.city).filter(Boolean))];

  // Process filters and sorting in-memory
  const filteredUsers = users
    .filter((u) => {
      const isNotAdmin = u.role !== "admin";
      const matchExperience = experienceFilter === "All" || u.experience === experienceFilter;
      const matchCity = cityFilter === "All" || u.city?.toLowerCase() === cityFilter.toLowerCase();
      return isNotAdmin && matchExperience && matchCity;
    })
    .sort((a, b) => {
      if (sortOrder === "HighToLow") {
        return (b.averageRating || 0) - (a.averageRating || 0);
      } else if (sortOrder === "LowToHigh") {
        return (a.averageRating || 0) - (b.averageRating || 0);
      }
      return 0;
    });

  if (loading) {
    return (
      <Stack alignItems="center" py={5}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* Search and Filters Hub */}
      {users.length > 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={4}
          sx={{
            p: 2.5,
            borderRadius: 4,
            bgcolor: "rgba(10, 15, 30, 0.45)",
            border: "1px solid rgba(6, 182, 212, 0.15)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(12px)",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 160, flex: 1 }}>
            <InputLabel id="experience-select-label">Experience Level</InputLabel>
            <Select
              labelId="experience-select-label"
              value={experienceFilter}
              label="Experience Level"
              onChange={(e) => setExperienceFilter(e.target.value)}
            >
              <MenuItem value="All">All Experience Levels</MenuItem>
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Expert">Expert</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160, flex: 1 }}>
            <InputLabel id="city-select-label">Location / City</InputLabel>
            <Select
              labelId="city-select-label"
              value={cityFilter}
              label="Location / City"
              onChange={(e) => setCityFilter(e.target.value)}
            >
              {uniqueCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city === "All" ? "All Cities" : city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160, flex: 1 }}>
            <InputLabel id="sort-select-label">Sort Rating</InputLabel>
            <Select
              labelId="sort-select-label"
              value={sortOrder}
              label="Sort Rating"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <MenuItem value="None">Default Sorting</MenuItem>
              <MenuItem value="HighToLow">Highest Rating</MenuItem>
              <MenuItem value="LowToHigh">Lowest Rating</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      )}

      {filteredUsers.length === 0 ? (
        <Paper
          elevation={1}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: 4,
            bgcolor: "rgba(10, 15, 30, 0.35)",
            border: "1px dashed rgba(6, 182, 212, 0.15)",
          }}
        >
          <Typography color="text.secondary" variant="body1">
            No skilled people match your current search parameters.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} lg={4} key={user._id}>
              <UserCard user={user} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

import { Box } from "@mui/material"; // Import Box explicitly

export default ExploreUsers;