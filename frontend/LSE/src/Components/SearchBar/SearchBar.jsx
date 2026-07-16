import {
  Box,
  Paper,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
  MenuItem,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function SearchBar() {

  const popularSkills = [
    "React",
    "Python",
    "Cooking",
    "Photography",
    "Guitar",
    "English",
    "Fitness",
    "UI Design",
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: -4, md: -8 },
        position: "relative",
        zIndex: 10,
      }}
    >

      <Paper
        elevation={8}
        sx={{
          borderRadius: 5,
          p: 4,
        }}
      >

        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={1}
        >
          Find Your Perfect Skill Match
        </Typography>

        <Typography
          color="text.secondary"
          textAlign="center"
          mb={4}
        >
          Search thousands of community members ready to
          share their knowledge.
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
        >

          <TextField
            fullWidth
            placeholder="Search Skills"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />,
            }}
          />

          <TextField
            placeholder="Location"
            InputProps={{
              startAdornment: <LocationOnIcon sx={{ mr: 1 }} />,
            }}
          />

          <TextField
            select
            defaultValue="All"
            sx={{ minWidth: 180 }}
          >

            <MenuItem value="All">All Categories</MenuItem>
            <MenuItem value="Programming">Programming</MenuItem>
            <MenuItem value="Design">Design</MenuItem>
            <MenuItem value="Cooking">Cooking</MenuItem>
            <MenuItem value="Music">Music</MenuItem>
            <MenuItem value="Fitness">Fitness</MenuItem>

          </TextField>

          <Button
            variant="contained"
            size="large"
            sx={{
              px: 5,
              borderRadius: 3,
            }}
          >
            Search
          </Button>

        </Stack>

        <Box mt={4}>

          <Typography
            fontWeight="bold"
            mb={2}
          >
            🔥 Popular Searches
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >

            {popularSkills.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                clickable
                color="primary"
                variant="outlined"
              />
            ))}

          </Stack>

        </Box>

      </Paper>

    </Container>
  );
}

export default SearchBar;